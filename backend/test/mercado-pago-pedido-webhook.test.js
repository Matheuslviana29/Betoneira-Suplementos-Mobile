import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { createApp } from '../src/app.js';
import { createDatabase } from '../src/database/connection.js';
import { runMigrations } from '../src/database/migrations.js';
import { seedCatalog } from '../src/database/seeds/catalog.js';

let baseUrl;
let database;
let server;
let sequence = 0;
let signatureIsValid = true;
let currentPayment;
let preferenceShouldFail = false;

function testCpf(value) {
  const base = String(100000000 + value).slice(-9);
  const digit = (input, factor) => {
    const sum = [...input].reduce((total, number) => total + Number(number) * factor--, 0);
    const result = 11 - (sum % 11);
    return result >= 10 ? 0 : result;
  };
  const first = digit(base, 10);
  return `${base}${first}${digit(`${base}${first}`, 11)}`;
}
const preferenceClient = {
  async create({ body }) {
    if (preferenceShouldFail) {
      preferenceShouldFail = false;
      throw new Error('falha simulada');
    }
    return {
      id: `pref-${sequence}`,
      init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${sequence}`,
      body,
    };
  },
};
const paymentClient = { async get() { return currentPayment; } };
const signatureValidator = {
  validate() {
    if (!signatureIsValid) throw new Error('assinatura inválida');
  },
};

before(async () => {
  database = createDatabase(':memory:');
  runMigrations(database);
  seedCatalog(database);
  const app = createApp({
    database,
    mercadoPagoPaymentClient: paymentClient,
    mercadoPagoPreferenceClient: preferenceClient,
    mercadoPagoSignatureValidator: signatureValidator,
    mercadoPagoWebhookSecret: 'segredo-apenas-de-teste',
    sessionDurationDays: 1,
  });
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (database?.isOpen) database.close();
});

async function request(path, { body, method = 'GET', token } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { response, data: await response.json() };
}

async function createCheckout() {
  sequence += 1;
  const registration = await request('/api/v1/auth/cadastro', {
    method: 'POST',
    body: {
      nomeCompleto: `Cliente Webhook ${sequence}`,
      email: `webhook-${sequence}@teste.com`,
      cpf: testCpf(sequence),
      dataNascimento: '1990-03-15',
      celular: '11999990000',
      genero: 'outro',
      senha: 'Senha1234',
    },
  });
  const token = registration.data.dados.token;
  const address = await request('/api/v1/enderecos', {
    method: 'POST', token,
    body: {
      apelido: 'Casa', destinatario: 'Cliente', cep: '01311200',
      logradouro: 'Avenida Paulista', numero: '1000', complemento: null,
      bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', referencia: null, padrao: true,
    },
  });
  const products = await request('/api/v1/produtos?limite=1');
  const product = products.data.dados[0];
  await request('/api/v1/carrinho/itens', {
    method: 'POST', token, body: { produtoId: product.id, quantidade: 2 },
  });
  const stockBefore = database.prepare('SELECT estoque FROM produtos WHERE pk_id = ?').get(product.id).estoque;
  const preference = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST', token, body: { enderecoId: address.data.dados.id },
  });
  const order = database.prepare('SELECT * FROM pedidos ORDER BY pk_id DESC LIMIT 1').get();
  return { order, preference, product, stockBefore, token };
}

async function notify(payment) {
  currentPayment = payment;
  return request('/api/v1/webhooks/mercado-pago?data.id=payment-1&type=payment', {
    method: 'POST', body: { type: 'payment', data: { id: 'payment-1' } },
  });
}

test('preferência cria pedido pendente sem alterar estoque ou carrinho', async () => {
  const { order, preference, product, stockBefore, token } = await createCheckout();
  assert.equal(preference.response.status, 201);
  assert.equal(order.status_pagamento, 'aguardando_pagamento');
  assert.equal(order.mercado_pago_preference_id, preference.data.dados.preference_id);
  assert.equal(database.prepare('SELECT estoque FROM produtos WHERE pk_id = ?').get(product.id).estoque, stockBefore);
  const cart = await request('/api/v1/carrinho', { token });
  assert.equal(cart.data.dados.itens.length, 1);
  assert.equal(cart.data.dados.itens[0].quantidade, 2);
});

test('falha da preferência compensa o pedido sem alterar carrinho', async () => {
  const countBefore = database.prepare('SELECT count(*) AS total FROM pedidos').get().total;
  preferenceShouldFail = true;
  const { preference } = await createCheckout();
  assert.equal(preference.response.status, 502);
  assert.equal(database.prepare('SELECT count(*) AS total FROM pedidos').get().total, countBefore);
});

test('webhook inválido não consulta nem atualiza o pedido', async () => {
  const { order } = await createCheckout();
  signatureIsValid = false;
  const result = await notify({ id: 'payment-1' });
  signatureIsValid = true;
  assert.equal(result.response.status, 401);
  assert.equal(database.prepare('SELECT status_pagamento FROM pedidos WHERE pk_id = ?').get(order.pk_id).status_pagamento, 'aguardando_pagamento');
});

test('webhook aprovado é idempotente, não regride e preserva estoque/carrinho', async () => {
  const { order, preference, product, stockBefore, token } = await createCheckout();
  const approved = {
    id: 'payment-approved', status: 'approved', currency_id: 'BRL',
    external_reference: `pedido:${order.pk_id}`,
    preference_id: preference.data.dados.preference_id,
    transaction_amount: order.total_centavos / 100,
  };
  assert.equal((await notify(approved)).response.status, 200);
  assert.equal((await notify(approved)).response.status, 200);
  await notify({ ...approved, id: 'payment-late', status: 'rejected' });
  const updated = database.prepare('SELECT * FROM pedidos WHERE pk_id = ?').get(order.pk_id);
  assert.equal(updated.status, 'aguardando_pagamento');
  assert.equal(updated.status_pagamento, 'pago_aguardando_envio');
  assert.equal(updated.mercado_pago_payment_id, 'payment-approved');
  assert.equal(database.prepare('SELECT estoque FROM produtos WHERE pk_id = ?').get(product.id).estoque, stockBefore);
  const cart = await request('/api/v1/carrinho', { token });
  assert.equal(cart.data.dados.itens[0].quantidade, 2);
});

test('webhook mapeia rejeitado, cancelado e pendente', async () => {
  for (const [remoteStatus, expected] of [
    ['rejected', 'recusado'], ['cancelled', 'cancelado'], ['pending', 'aguardando_pagamento'],
  ]) {
    const { order, preference } = await createCheckout();
    const result = await notify({
      id: `payment-${remoteStatus}`, status: remoteStatus, currency_id: 'BRL',
      external_reference: `pedido:${order.pk_id}`,
      preference_id: preference.data.dados.preference_id,
      transaction_amount: order.total_centavos / 100,
    });
    assert.equal(result.response.status, 200);
    assert.equal(database.prepare('SELECT status_pagamento FROM pedidos WHERE pk_id = ?').get(order.pk_id).status_pagamento, expected);
  }
});
