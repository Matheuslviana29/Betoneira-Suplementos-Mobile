const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
});

export const formatarMoeda = (valor) => formatadorMoeda.format(valor);

export function calcularResumoCarrinho(itens, fretePadrao) {
  const quantidadeItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const subtotal = itens.reduce(
    (total, item) => total + item.precoUnitario * item.quantidade,
    0,
  );
  const frete = itens.length > 0 ? fretePadrao : 0;

  return {
    frete,
    quantidadeItens,
    subtotal,
    total: subtotal + frete,
  };
}

export function serializarItensCheckout(itens) {
  return JSON.stringify(
    itens.map(({ id, quantidade }) => ({
      id,
      quantidade,
    })),
  );
}

export function reconstruirItensCheckout(itensBase, itensSerializados) {
  if (typeof itensSerializados !== 'string') {
    return itensBase.map((item) => ({ ...item }));
  }

  try {
    const itensRecebidos = JSON.parse(itensSerializados);

    if (!Array.isArray(itensRecebidos)) {
      return itensBase.map((item) => ({ ...item }));
    }

    const quantidadesPorId = new Map(
      itensRecebidos
        .filter(
          (item) =>
            typeof item?.id === 'string' &&
            Number.isInteger(item.quantidade) &&
            item.quantidade > 0,
        )
        .map((item) => [item.id, item.quantidade]),
    );

    return itensBase
      .filter((item) => quantidadesPorId.has(item.id))
      .map((item) => ({ ...item, quantidade: quantidadesPorId.get(item.id) }));
  } catch {
    return itensBase.map((item) => ({ ...item }));
  }
}
