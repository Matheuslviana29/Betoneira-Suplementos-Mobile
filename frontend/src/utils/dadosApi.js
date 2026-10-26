import { formatarMoeda } from './carrinho';

const imagensProduto = {
  'barra-proteica-calcio': require('../../assets/images/barra-proteica-calcio.png'),
  'creatina-monohidratada-300g': require('../../assets/images/creatina-monohidratada.png'),
  'dark-lab-whey-900g': require('../../assets/images/dark-lab-whey.png'),
  'full-complex-a-z': require('../../assets/images/full-complex-a-z.png'),
  'osteovena-a-z': require('../../assets/images/osteovena-a-z.png'),
  'vitamina-b12-apisnutri': require('../../assets/images/vitamina-b12-apisnutri.png'),
  'whey-betoneira-chocolate': require('../../assets/images/whey-betoneira-chocolate.png'),
  'whey-betoneira-coco': require('../../assets/images/whey-betoneira-coco.png'),
};

const imagemPadrao = require('../../assets/images/logo-betoneira.png');

export function adaptarProduto(produto) {
  return {
    ...produto,
    imagem: imagensProduto[produto.slug] ?? imagemPadrao,
    preco: formatarMoeda(produto.precoCentavos / 100),
  };
}

export function adaptarCarrinho(carrinho) {
  return {
    ...carrinho,
    itens: carrinho.itens.map((item) => ({
      ...item,
      imagem: imagensProduto[item.slug] ?? imagemPadrao,
      precoUnitario: item.precoUnitarioCentavos / 100,
    })),
  };
}

export function adaptarEndereco(endereco) {
  const complemento = endereco.complemento ? ` - ${endereco.complemento}` : '';
  return {
    ...endereco,
    enderecoCompleto: `${endereco.logradouro}, ${endereco.numero}${complemento}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${formatarCep(endereco.cep)}`,
  };
}

export function adaptarPagamento(pagamento) {
  return {
    ...pagamento,
    validade: `${String(pagamento.mesExpiracao).padStart(2, '0')}/${pagamento.anoExpiracao}`,
  };
}

const statusPedido = {
  aguardando_pagamento: ['Aguardando pagamento', '#FF7900', '#C65E00'],
  pago: ['Pago', '#1570EF', '#175CD3'],
  em_separacao: ['Em separação', '#7F56D9', '#6941C6'],
  enviado: ['Enviado', '#FF7900', '#C65E00'],
  entregue: ['Entregue', '#12B76A', '#027A48'],
  cancelado: ['Cancelado', '#667085', '#475467'],
};

export function adaptarPedido(pedido) {
  const [status, corStatus, corTextoStatus] = statusPedido[pedido.status] ?? [
    pedido.status,
    '#667085',
    '#475467',
  ];
  return {
    ...pedido,
    corStatus,
    corTextoStatus,
    data: new Intl.DateTimeFormat('pt-BR').format(
      new Date(`${pedido.criadoEm.replace(' ', 'T')}Z`),
    ),
    itens: pedido.itens.map((item) => `${item.quantidade}x ${item.nomeProduto}`).join(', '),
    status,
    valor: formatarMoeda(pedido.totalCentavos / 100),
  };
}

export const somenteDigitos = (value = '') => String(value ?? '').replace(/\D/g, '');
export const formatarCpf = (value = '') =>
  somenteDigitos(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
export const formatarTelefone = (value = '') => {
  const digits = somenteDigitos(value).slice(0, 11);
  const areaCode = digits.replace(/^(\d{2})(\d)/, '($1) $2');
  return digits.length > 10
    ? areaCode.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    : areaCode.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
};
export const formatarCep = (value = '') =>
  somenteDigitos(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
export const formatarDataApi = (value = '') => {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
};
