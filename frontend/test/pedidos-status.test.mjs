import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const adapterPath = fileURLToPath(new URL('../src/utils/dadosApi.js', import.meta.url));
const cardPath = fileURLToPath(new URL('../src/components/CartaoPedido.js', import.meta.url));

test('pedidos mapeiam os quatro estados financeiros do Mercado Pago', async () => {
  const source = await readFile(adapterPath, 'utf8');
  assert.match(source, /Aguardando pagamento/);
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
