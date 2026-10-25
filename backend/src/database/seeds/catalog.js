const categories = [
  { nome: 'Whey', slug: 'whey', ordem: 1 },
  { nome: 'Creatina', slug: 'creatina', ordem: 2 },
  { nome: 'Vitaminas', slug: 'vitaminas', ordem: 3 },
];

const products = [
  { categoria: 'creatina', nome: 'Creatina Monohidratada 300g', slug: 'creatina-monohidratada-300g', subtitulo: 'Fórmula para força', preco: 11999, imagem: '/images/creatina-monohidratada.png', destaque: 1 },
  { categoria: 'vitaminas', nome: 'Full Complex A a Z 30 cápsulas Apex', slug: 'full-complex-a-z', subtitulo: 'Suplemento de vitaminas', preco: 2000, imagem: '/images/full-complex-a-z.png', destaque: 0 },
  { categoria: 'vitaminas', nome: 'OsteoVena A a Z 60 cápsulas', slug: 'osteovena-a-z', subtitulo: 'Suporte para ossos', preco: 15000, imagem: '/images/osteovena-a-z.png', destaque: 0 },
  { categoria: 'whey', nome: 'Dark Lab Whey 100% 900g', slug: 'dark-lab-whey-900g', subtitulo: 'Proteína de alta absorção', preco: 9999, imagem: '/images/dark-lab-whey.png', destaque: 1 },
  { categoria: 'vitaminas', nome: 'Vitamina B12 ApisNutri 60 cápsulas', slug: 'vitamina-b12-apisnutri', subtitulo: 'Energia e concentração', preco: 11999, imagem: '/images/vitamina-b12-apisnutri.png', destaque: 0 },
  { categoria: 'vitaminas', nome: 'Barra Proteica Cálcio 20 unidades', slug: 'barra-proteica-calcio', subtitulo: 'Lanche rápido proteico', preco: 4099, imagem: '/images/barra-proteica-calcio.png', destaque: 0 },
  { categoria: 'whey', nome: 'Whey Betoneira Chocolate 500g', slug: 'whey-betoneira-chocolate', subtitulo: 'Edição premium especial', preco: 11999, imagem: '/images/whey-betoneira-chocolate.png', destaque: 1 },
  { categoria: 'whey', nome: 'Whey Betoneira Coco 900g', slug: 'whey-betoneira-coco', subtitulo: 'Sabor tropical e refrescante', preco: 11999, imagem: '/images/whey-betoneira-coco.png', destaque: 1 },
];

export function seedCatalog(database) {
  const upsertCategory = database.prepare(`
    INSERT INTO categorias (nome, slug, ordem_exibicao)
    VALUES (@nome, @slug, @ordem)
    ON CONFLICT (slug) DO UPDATE SET
      nome = excluded.nome,
      ordem_exibicao = excluded.ordem_exibicao,
      ativa = 1,
      atualizado_em = CURRENT_TIMESTAMP
  `);
  const findCategory = database.prepare('SELECT pk_id FROM categorias WHERE slug = ?');
  const upsertProduct = database.prepare(`
    INSERT INTO produtos (
      fk_categoria, nome, slug, subtitulo, preco_centavos, estoque,
      imagem_uri, destaque
    ) VALUES (
      @categoriaId, @nome, @slug, @subtitulo, @preco, 50, @imagem, @destaque
    )
    ON CONFLICT (slug) DO UPDATE SET
      fk_categoria = excluded.fk_categoria,
      nome = excluded.nome,
      subtitulo = excluded.subtitulo,
      preco_centavos = excluded.preco_centavos,
      imagem_uri = excluded.imagem_uri,
      destaque = excluded.destaque,
      ativo = 1,
      atualizado_em = CURRENT_TIMESTAMP
  `);

  database.transaction(() => {
    for (const category of categories) upsertCategory.run(category);
    for (const product of products) {
      const categoriaId = findCategory.get(product.categoria).pk_id;
      upsertProduct.run({ ...product, categoriaId });
    }
  })();
}
