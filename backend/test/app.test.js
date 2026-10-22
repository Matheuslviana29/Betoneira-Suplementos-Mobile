import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { app } from '../src/app.js';

let baseUrl;
let server;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});

test('GET /api/health informa que a API está ativa', async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('uma rota inexistente retorna 404', async () => {
  const response = await fetch(`${baseUrl}/api/inexistente`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: 'Rota não encontrada.' });
});

