import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const checkoutPath = fileURLToPath(
  new URL('../src/features/checkout/screens/TelaCheckout.js', import.meta.url),
);

test('contrato atual envia os IDs de endereço e pagamento ao criar o pedido', async () => {
  const source = await readFile(checkoutPath, 'utf8');
  assert.match(
    source,
    /api\.pedidos\.criar\(\{\s*enderecoId: selectedAddressId,\s*formaPagamentoId: selectedPaymentId,\s*\}\)/,
  );
  assert.doesNotMatch(source, /enderecoId: endereco\.id/);
  assert.doesNotMatch(source, /formaPagamentoId: pagamento\.id/);
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
  assert.match(source, /initializeSelection\(enderecos, pagamentos\)/);
  assert.match(source, /selecaoInicializada\.current = true/);
});

test('checkout bloqueia confirmação e orienta quando falta seleção', async () => {
  const source = await readFile(checkoutPath, 'utf8');
  assert.match(
    source,
    /itens\.length === 0 \|\| selectedAddressId === null \|\| selectedPaymentId === null/,
  );
  assert.match(source, /accessibilityLiveRegion="polite"/);
  assert.match(source, /Selecione um endereço e uma forma de pagamento/);
});
