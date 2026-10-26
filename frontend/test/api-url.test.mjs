import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveApiUrl } from '../src/services/api-url.mjs';

test('usa a URL configurada sem barra final', () => {
  assert.equal(
    resolveApiUrl({ configuredUrl: 'https://api.example.com/api/v1/', platform: 'android' }),
    'https://api.example.com/api/v1',
  );
});

test('deriva o host da API a partir do Metro em aparelho físico', () => {
  assert.equal(
    resolveApiUrl({ hostUri: '192.168.0.14:8081', platform: 'android' }),
    'http://192.168.0.14:3333/api/v1',
  );
});

test('preserva suporte ao emulador Android quando o host do Metro não existe', () => {
  assert.equal(resolveApiUrl({ platform: 'android' }), 'http://10.0.2.2:3333/api/v1');
});

test('deriva o host da API a partir da página web aberta pela rede local', () => {
  assert.equal(
    resolveApiUrl({ browserHostname: '192.168.0.14', platform: 'web' }),
    'http://192.168.0.14:3333/api/v1',
  );
});

test('usa localhost no navegador quando não há hostname disponível', () => {
  assert.equal(
    resolveApiUrl({ platform: 'web' }),
    'http://localhost:3333/api/v1',
  );
});
