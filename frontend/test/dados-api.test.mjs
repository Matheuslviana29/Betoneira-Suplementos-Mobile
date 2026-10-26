import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const sourcePath = fileURLToPath(new URL('../src/utils/dadosApi.js', import.meta.url));

async function carregarFormatadores() {
  const source = await readFile(sourcePath, 'utf8');
  const sourceParaTeste = source
    .replace("import { formatarMoeda } from './carrinho';", 'const formatarMoeda = () => "";')
    .replaceAll('require(', '(() => null)(');
  return import(`data:text/javascript;base64,${Buffer.from(sourceParaTeste).toString('base64')}`);
}

test('normaliza valores nulos e telefones em somenteDigitos', async () => {
  const { somenteDigitos } = await carregarFormatadores();
  assert.equal(somenteDigitos(null), '');
  assert.equal(somenteDigitos(undefined), '');
  assert.equal(somenteDigitos('(11) 99999-9999'), '11999999999');
});

test('formatadores aceitam valores nulos', async () => {
  const { formatarCep, formatarCpf, formatarTelefone } = await carregarFormatadores();
  assert.equal(formatarTelefone(null), '');
  assert.equal(formatarCpf(null), '');
  assert.equal(formatarCep(null), '');
});
