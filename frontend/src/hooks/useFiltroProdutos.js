import { useMemo, useState } from 'react';

import { categoriasMock, produtosMock } from '../mocks/dadosLoja';

export function useFiltroProdutos() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriasMock[0]);

  const produtosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLocaleLowerCase('pt-BR');

    return produtosMock.filter((produto) => {
      const correspondeCategoria =
        categoriaAtiva === 'Tudo' || produto.categoria === categoriaAtiva;
      const textoProduto = `${produto.nome} ${produto.subtitulo} ${produto.categoria}`
        .toLocaleLowerCase('pt-BR');
      const correspondeBusca = !termoBusca || textoProduto.includes(termoBusca);

      return correspondeCategoria && correspondeBusca;
    });
  }, [busca, categoriaAtiva]);

  return {
    busca,
    categoriaAtiva,
    definirBusca: setBusca,
    definirCategoriaAtiva: setCategoriaAtiva,
    produtosFiltrados,
  };
}
