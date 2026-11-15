import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const adapterPath = fileURLToPath(new URL('../src/utils/dadosApi.js', import.meta.url));
const cardPath = fileURLToPath(new URL('../src/components/CartaoPedido.js', import.meta.url));
const screenPath = fileURLToPath(
  new URL('../src/features/pedidos/screens/TelaPedidos.js', import.meta.url),
);

test('pedidos mapeiam os quatro estados financeiros do Mercado Pago', async () => {
  const source = await readFile(adapterPath, 'utf8');
  assert.match(source, /Pagamento iniciado — aguardando confirmação no Mercado Pago/);
  assert.match(source, /Pagamento aprovado — aguardando envio/);
  assert.match(source, /Pagamento recusado/);
  assert.match(source, /Pagamento cancelado/);
  assert.match(source, /statusPagamento.*nao_aplicavel/s);
});

test('cartão anuncia o status para tecnologia assistiva', async () => {
  const source = await readFile(cardPath, 'utf8');
  assert.match(source, /accessibilityLabel={`Status do pedido: \$\{pedido\.status\}`}/);
  assert.match(source, /accessibilityRole="text"/);
});

test('pedidos oferece somente recarga local acessível', async () => {
  const card = await readFile(cardPath, 'utf8');
  const screen = await readFile(screenPath, 'utf8');
  assert.doesNotMatch(card, /Verificar pagamento/);
  assert.doesNotMatch(screen, /verificarPagamento|Pagamento confirmado|<Modal/);
  assert.match(screen, /Atualizar pedidos/);
  assert.match(screen, /onPress=\{recarregar\}/);
  assert.match(screen, /accessibilityState=\{\{ busy: carregando, disabled: carregando \}\}/);
});
