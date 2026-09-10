export const carrinhoMock = {
  cep: '01311-200',
  endereco: 'Av. Paulista',
  frete: 15,
  itens: [
    {
      escalaImagem: 1,
      id: 'whey-chocolate',
      imagem: require('../images/WheyChocolate-transparente.png'),
      nome: 'Whey Betoneira Chocolate 500g',
      precoUnitario: 119.99,
      quantidade: 1,
      subtitulo: 'Sabor: Premium Chocolate',
    },
    {
      escalaImagem: 1.55,
      id: 'creatina-300g',
      imagem: require('../images/Creatina-transparente.png'),
      nome: 'Creatina Monohidratada 300g',
      precoUnitario: 119.99,
      quantidade: 2,
      subtitulo: 'Fabricado | Pura Força',
    },
  ],
};
