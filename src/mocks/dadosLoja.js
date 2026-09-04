export const categoriasMock = ['Whey', 'Creatina', 'Vitaminas', 'Pré-Treino'];

export const produtosMock = [
  {
    id: 'whey-chocolate',
    imagem: require('../images/WheyChocolate-transparente.png'),
    nome: 'Whey Betoneira\nChocolate 500g',
    preco: 'R$ 119,99',
    escalaImagem: 1,
    subtitulo: 'Edição Premium Especial',
  },
  {
    id: 'creatina-300g',
    imagem: require('../images/Creatina-transparente.png'),
    nome: 'Creatina Betoneira\n300g',
    preco: 'R$ 119,99',
    escalaImagem: 1.55,
    subtitulo: 'Pura força e desempenho',
  },
];

export const pedidosMock = [
  {
    corStatus: '#12B76A',
    corTextoStatus: '#027A48',
    data: '20/08/2026',
    id: '1234',
    itens: '1x Whey Betoneira Chocolate 500g',
    status: 'Entregue',
    valor: 'R$ 239,98',
  },
  {
    corStatus: '#FF7900',
    corTextoStatus: '#C65E00',
    data: '15/08/2026',
    id: '1233',
    itens: '2x Dark Lab Whey 100%',
    status: 'Em Trânsito',
    valor: 'R$ 199,98',
  },
  {
    corStatus: '#667085',
    corTextoStatus: '#475467',
    data: '10/08/2026',
    id: '1232',
    itens: '1x Barra Proteica Box',
    status: 'Cancelado',
    valor: 'R$ 40,99',
  },
];
