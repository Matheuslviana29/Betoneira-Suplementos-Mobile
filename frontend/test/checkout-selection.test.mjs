import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const checkoutPath = fileURLToPath(
  new URL('../src/features/checkout/screens/TelaCheckout.js', import.meta.url),
);

test('checkout cria a preferência somente com o endereço selecionado', async () => {
  const source = await readFile(checkoutPath, 'utf8');
  assert.match(
    source,
    /api\.mercadoPago\.criarPreferencia\(\s*selectedAddressId,?\s*\)/,
  );
  assert.doesNotMatch(source, /api\.pedidos\.criar/);
  assert.doesNotMatch(source, /formaPagamentoId/);
  assert.match(source, /roteador\.replace\('\/pedidos'\)[\s\S]*Linking\.openURL\(initPoint\)/);
  assert.match(source, /Linking\.openURL\(initPoint\)/);
});

test('modelo de seleção inicial prioriza endereço principal e primeiro pagamento', () => {
  const enderecos = [{ id: 1, padrao: false }, { id: 2, padrao: true }];
  const pagamentos = [{ id: 7 }, { id: 8 }];
  const enderecoInicial = enderecos.find((item) => item.padrao) ?? enderecos[0] ?? null;
  const pagamentoInicial = pagamentos[0] ?? null;
  assert.equal(enderecoInicial?.id, 2);
  assert.equal(pagamentoInicial?.id, 7);
});

test('modelo de exclusão limpa somente a seleção ativa', () => {
  const invalidar = (selecionadoId, removidoId) =>
    selecionadoId === removidoId ? null : selecionadoId;
  assert.equal(invalidar(2, 2), null);
  assert.equal(invalidar(2, 3), 2);
});

test('checkout inicializa a seleção apenas uma vez durante a instância do fluxo', async () => {
  const source = await readFile(checkoutPath, 'utf8');
  assert.match(source, /const selecaoInicializada = useRef\(false\)/);
  assert.match(source, /selecaoInicializada\.current\) return/);
  assert.match(source, /initializeSelection\(enderecos, \[\]\)/);
  assert.match(source, /selecaoInicializada\.current = true/);
});

test('checkout exige apenas endereço e explica que o pagamento será escolhido no Mercado Pago', async () => {
  const source = await readFile(checkoutPath, 'utf8');
  assert.match(source, /itens\.length === 0 \|\| selectedAddressId === null/);
  assert.match(source, /accessibilityLiveRegion="polite"/);
  assert.match(source, /Selecione um endereço para continuar com o pagamento/);
  assert.match(source, /O método de pagamento será escolhido no Mercado Pago\./);
  assert.match(source, /PAGAR COM MERCADO PAGO/);
});
