import { useEffect, useMemo, useState } from 'react';

import { api } from '../services/api';
import { adaptarProduto } from '../utils/dadosApi';

export function useFiltroProdutos() {
  const [busca, definirBusca] = useState('');
  const [categoriaAtiva, definirCategoriaAtiva] = useState('Tudo');
  const [categorias, setCategorias] = useState(['Tudo']);
  const [erro, setErro] = useState();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    Promise.all([api.catalogo.categorias(), api.catalogo.produtos()])
      .then(([categories, products]) => {
        setCategorias(['Tudo', ...categories.map((category) => category.nome)]);
        setProdutos(products.map(adaptarProduto));
      })
      .catch((error) => setErro(error.message));
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLocaleLowerCase('pt-BR');
    return produtos.filter((produto) => {
      const correspondeCategoria =
        categoriaAtiva === 'Tudo' || produto.categoria === categoriaAtiva;
      const textoProduto = `${produto.nome} ${produto.subtitulo} ${produto.categoria}`
        .toLocaleLowerCase('pt-BR');
      return correspondeCategoria && (!termoBusca || textoProduto.includes(termoBusca));
    });
  }, [busca, categoriaAtiva, produtos]);

  return {
    busca,
    categorias,
    categoriaAtiva,
    definirBusca,
    definirCategoriaAtiva,
    erro,
    produtosFiltrados,
  };
}
