const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
});

export const formatarMoeda = (valor) => formatadorMoeda.format(valor);
