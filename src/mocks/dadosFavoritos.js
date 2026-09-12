import { produtosMock } from './dadosLoja';

const idsFavoritos = [
  'whey-betoneira-chocolate',
  'creatina-monohidratada-300g',
  'dark-lab-whey-900g',
  'barra-proteica-calcio',
];

export const favoritosMock = idsFavoritos
  .map((id) => produtosMock.find((produto) => produto.id === id))
  .filter(Boolean);
