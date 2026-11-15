import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { createApp } from '../src/app.js';
import { createDatabase } from '../src/database/connection.js';
import { runMigrations } from '../src/database/migrations.js';
import { seedCatalog } from '../src/database/seeds/catalog.js';
import { createMercadoPagoService } from '../src/services/mercado-pago.service.js';

let baseUrl;
let database;
let server;
let userSequence = 0;
const testCpfs = ['52998224725', '11144477735', '12345678909', '93541134780', '98765432100', '39053344705'];
const preferenceCalls = [];
let providerFailure = null;

const preferenceClient = {
  async create(request) {
    preferenceCalls.push(request);
    if (providerFailure) {
      const error = providerFailure;
      providerFailure = null;
      throw error;
    }
    return {
      id: `preference-${preferenceCalls.length}`,
      init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceCalls.length}`,
      ignored_secret: 'não deve chegar à resposta',
    };
  },
};

before(async () => {
  database = createDatabase(':memory:');
  runMigrations(database);
  seedCatalog(database);
  const app = createApp({
    database,
    mercadoPagoPreferenceClient: preferenceClient,
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
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  if (database?.isOpen) database.close();
});

async function request(path, { method = 'GET', token, body, headers = {} } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...headers,
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { response, data: await response.json() };
}

async function createUserWithAddressAndCart({ withCart = true } = {}) {
  userSequence += 1;
  const registration = await request('/api/v1/auth/cadastro', {
    method: 'POST',
    body: {
      nomeCompleto: `Cliente Mercado Pago ${userSequence}`,
      email: `mercado-pago-${userSequence}@teste.com`,
      cpf: testCpfs[userSequence - 1],
      dataNascimento: '1990-03-15',
      celular: '11999990000',
      genero: 'outro',
      senha: 'Senha1234',
    },
  });
  assert.equal(registration.response.status, 201, JSON.stringify(registration.data));
  const token = registration.data.dados.token;

  const address = await request('/api/v1/enderecos', {
    method: 'POST',
    token,
    body: {
      apelido: 'Casa',
      destinatario: 'Cliente Mercado Pago',
      cep: '01311200',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      complemento: null,
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      referencia: null,
      padrao: true,
    },
  });
  assert.equal(address.response.status, 201);

  let product;
  if (withCart) {
    const products = await request('/api/v1/produtos?limite=1');
    product = products.data.dados[0];
    await request('/api/v1/carrinho/itens', {
      method: 'POST',
      token,
      body: { produtoId: product.id, quantidade: 2 },
    });
  }

  return { addressId: address.data.dados.id, product, token };
}

test('endpoint exige a sessão atual e ignora x-user-id como autenticação', async () => {
  const callsBefore = preferenceCalls.length;
  const { response, data } = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST',
    headers: { 'x-user-id': '1' },
    body: { enderecoId: 1 },
  });

  assert.equal(response.status, 401);
  assert.equal(data.erro.codigo, 'NAO_AUTENTICADO');
  assert.equal(preferenceCalls.length, callsBefore);
});

test('serviço falha de forma segura quando o Access Token não foi configurado', async () => {
  const service = createMercadoPagoService();

  await assert.rejects(service.createPreference({ items: [] }), (error) => {
    assert.equal(error.statusCode, 503);
    assert.equal(error.code, 'MERCADO_PAGO_NAO_CONFIGURADO');
    assert.doesNotMatch(error.message, /APP_USR/);
    return true;
  });
});

test('endpoint rejeita campos financeiros ou identidade enviados pelo frontend', async () => {
  const { token, addressId } = await createUserWithAddressAndCart();
  const { response, data } = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST',
    token,
    body: { enderecoId: addressId, total: 1, userId: 999 },
  });

  assert.equal(response.status, 422);
  assert.equal(data.erro.codigo, 'DADOS_INVALIDOS');
});

test('endpoint valida que o endereço pertence ao usuário autenticado', async () => {
  const first = await createUserWithAddressAndCart();
  const second = await createUserWithAddressAndCart();
  const { response, data } = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST',
    token: first.token,
    body: { enderecoId: second.addressId },
  });

  assert.equal(response.status, 404);
  assert.equal(data.erro.codigo, 'RECURSO_NAO_ENCONTRADO');
});

test('carrinho vazio não chama o cliente Mercado Pago', async () => {
  const { token, addressId } = await createUserWithAddressAndCart({ withCart: false });
  const callsBefore = preferenceCalls.length;
  const { response, data } = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST',
    token,
    body: { enderecoId: addressId },
  });

  assert.equal(response.status, 422);
  assert.equal(data.erro.codigo, 'CARRINHO_VAZIO');
  assert.equal(preferenceCalls.length, callsBefore);
});

test('preferência usa valores do backend e retorna somente URL e ID', async () => {
  const { token, addressId, product } = await createUserWithAddressAndCart();
  const { response, data } = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST',
    token,
    body: { enderecoId: addressId },
  });

  assert.equal(response.status, 201);
  assert.deepEqual(Object.keys(data.dados).sort(), ['init_point', 'preference_id']);
  assert.match(data.dados.init_point, /^https:\/\/www\.mercadopago\.com\.br\//);
  assert.match(data.dados.preference_id, /^preference-/);

  const body = preferenceCalls.at(-1).body;
  assert.equal(body.items.length, 1);
  assert.equal(body.items[0].quantity, 2);
  assert.equal(body.items[0].currency_id, 'BRL');
  assert.equal(body.items[0].unit_price, product.precoCentavos / 100);
  assert.equal(body.shipments.cost, 15);
  assert.match(body.external_reference, /^pedido:\d+$/);
});

test('falha do provedor retorna erro sanitizado', async () => {
  const { token, addressId } = await createUserWithAddressAndCart();
  providerFailure = new Error('APP_USR_SEGREDO_NAO_PODE_VAZAR');
  const { response, data } = await request('/api/v1/pagamentos/mercado-pago/preferencia', {
    method: 'POST',
    token,
    body: { enderecoId: addressId },
  });

  assert.equal(response.status, 502);
  assert.equal(data.erro.codigo, 'MERCADO_PAGO_INDISPONIVEL');
  assert.doesNotMatch(JSON.stringify(data), /APP_USR_SEGREDO_NAO_PODE_VAZAR/);
});
