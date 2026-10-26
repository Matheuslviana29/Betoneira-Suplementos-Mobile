import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { createApp } from '../src/app.js';
import { createDatabase } from '../src/database/connection.js';
import { runMigrations } from '../src/database/migrations.js';
import { seedCatalog } from '../src/database/seeds/catalog.js';

let baseUrl;
let database;
let server;

before(async () => {
  database = createDatabase(':memory:');
  runMigrations(database);
  seedCatalog(database);
  const app = createApp({ database, sessionDurationDays: 1 });

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
  if (database?.open) database.close();
});

async function request(path, { method = 'GET', token, body, origin } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(origin ? { origin } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = response.status === 204 ? null : await response.json();
  return { response, data };
}

test('GET /api/health informa que a API está ativa', async () => {
  const { response, data } = await request('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(data, { status: 'ok' });
});

test('CORS permite o Expo web na rede local durante o desenvolvimento', async () => {
  const { response } = await request('/api/v1/categorias', {
    origin: 'http://192.168.0.14:8081',
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://192.168.0.14:8081');
});

test('CORS continua rejeitando origens externas não configuradas', async () => {
  const { response, data } = await request('/api/v1/categorias', {
    origin: 'https://site-nao-configurado.example',
  });

  assert.equal(response.status, 403);
  assert.equal(data.erro.codigo, 'ORIGEM_NAO_PERMITIDA');
});

test('catálogo público oferece busca, categoria e paginação', async () => {
  const { response, data } = await request(
    '/api/v1/produtos?busca=whey&categoria=whey&pagina=1&limite=2',
  );

  assert.equal(response.status, 200);
  assert.equal(data.dados.length, 2);
  assert.equal(data.paginacao.pagina, 1);
  assert.equal(data.paginacao.totalItens, 3);
});

test('rota protegida rejeita requisição sem token', async () => {
  const { response, data } = await request('/api/v1/usuarios/me');
  assert.equal(response.status, 401);
  assert.equal(data.erro.codigo, 'NAO_AUTENTICADO');
});

test('fluxo REST cria conta, endereço, pagamento, carrinho e pedido', async () => {
  const registration = await request('/api/v1/auth/cadastro', {
    method: 'POST',
    body: {
      nomeCompleto: 'Cliente de Teste',
      email: 'cliente@teste.com',
      cpf: '52998224725',
      dataNascimento: '1990-03-15',
      celular: '11999990000',
      telefone: '1133334444',
      genero: 'outro',
      senha: 'Senha1234',
    },
  });

  assert.equal(registration.response.status, 201);
  const token = registration.data.dados.token;

  const address = await request('/api/v1/enderecos', {
    method: 'POST',
    token,
    body: {
      apelido: 'Casa',
      destinatario: 'Cliente de Teste',
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

  const payment = await request('/api/v1/formas-pagamento', {
    method: 'POST',
    token,
    body: {
      apelido: 'Principal',
      bandeira: 'Visa',
      ultimosDigitos: '4321',
      mesExpiracao: 12,
      anoExpiracao: 2030,
      tokenGateway: 'tok_teste_123',
      padrao: true,
    },
  });
  assert.equal(payment.response.status, 201);

  const products = await request('/api/v1/produtos?limite=1');
  const productId = products.data.dados[0].id;
  const cart = await request('/api/v1/carrinho/itens', {
    method: 'POST',
    token,
    body: { produtoId: productId, quantidade: 2 },
  });
  assert.equal(cart.response.status, 201);
  assert.equal(cart.data.dados.resumo.quantidadeItens, 2);

  const order = await request('/api/v1/pedidos', {
    method: 'POST',
    token,
    body: {
      enderecoId: address.data.dados.id,
      formaPagamentoId: payment.data.dados.id,
    },
  });
  assert.equal(order.response.status, 201);
  assert.equal(order.data.dados.itens.length, 1);
  assert.equal(
    order.data.dados.totalCentavos,
    order.data.dados.subtotalCentavos + order.data.dados.freteCentavos,
  );

  const emptyCart = await request('/api/v1/carrinho', { token });
  assert.equal(emptyCart.data.dados.itens.length, 0);
});

test('validação devolve erros de campo em formato estável', async () => {
  const { response, data } = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'invalido', senha: '' },
  });

  assert.equal(response.status, 422);
  assert.equal(data.erro.codigo, 'DADOS_INVALIDOS');
  assert.ok(data.erro.detalhes.some((detail) => detail.campo === 'body.email'));
});

test('uma rota inexistente retorna 404 padronizado', async () => {
  const { response, data } = await request('/api/inexistente');
  assert.equal(response.status, 404);
  assert.equal(data.erro.codigo, 'ROTA_NAO_ENCONTRADA');
});
