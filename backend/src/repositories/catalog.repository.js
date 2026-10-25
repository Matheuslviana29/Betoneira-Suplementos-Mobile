const PRODUCT_SELECT = `
  SELECT p.*, c.nome AS categoria_nome, c.slug AS categoria_slug
  FROM produtos p
  JOIN categorias c ON c.pk_id = p.fk_categoria
`;

export function createCatalogRepository(database) {
  return {
    listCategories() {
      return database
        .prepare(`
          SELECT pk_id, nome, slug, ordem_exibicao
          FROM categorias
          WHERE ativa = 1
          ORDER BY ordem_exibicao, nome
        `)
        .all();
    },

    listProducts({ search, category, featured, page, limit }) {
      const conditions = ['p.ativo = 1', 'c.ativa = 1'];
      const parameters = {};

      if (search) {
        conditions.push(`(
          p.nome LIKE @search COLLATE NOCASE OR
          p.subtitulo LIKE @search COLLATE NOCASE OR
          p.descricao LIKE @search COLLATE NOCASE
        )`);
        parameters.search = `%${search}%`;
      }

      if (category) {
        conditions.push('c.slug = @category COLLATE NOCASE');
        parameters.category = category;
      }

      if (featured !== undefined) {
        conditions.push('p.destaque = @featured');
        parameters.featured = featured ? 1 : 0;
      }

      const where = conditions.join(' AND ');
      const total = database
        .prepare(`
          SELECT COUNT(*) AS total
          FROM produtos p
          JOIN categorias c ON c.pk_id = p.fk_categoria
          WHERE ${where}
        `)
        .get(parameters).total;

      const items = database
        .prepare(`
          ${PRODUCT_SELECT}
          WHERE ${where}
          ORDER BY p.destaque DESC, p.nome
          LIMIT @limit OFFSET @offset
        `)
        .all({ ...parameters, limit, offset: (page - 1) * limit });

      return { items, total };
    },

    findProduct(identifier) {
      const isNumericId = /^\d+$/.test(String(identifier));
      const field = isNumericId ? 'p.pk_id' : 'p.slug';

      return database
        .prepare(`${PRODUCT_SELECT} WHERE ${field} = ? AND p.ativo = 1 AND c.ativa = 1`)
        .get(identifier);
    },

    findProductById(id) {
      return database
        .prepare(`${PRODUCT_SELECT} WHERE p.pk_id = ? AND p.ativo = 1 AND c.ativa = 1`)
        .get(id);
    },
  };
}
