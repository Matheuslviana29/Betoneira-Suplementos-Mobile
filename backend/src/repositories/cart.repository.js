export function createCartRepository(database) {
  const createActiveCart = database.prepare(`
    INSERT INTO carrinhos (fk_usuario) VALUES (?) RETURNING *
  `);

  const repository = {
    getActiveCart(userId) {
      return database
        .prepare("SELECT * FROM carrinhos WHERE fk_usuario = ? AND status = 'ativo'")
        .get(userId);
    },

    getOrCreateActiveCart(userId) {
      return this.getActiveCart(userId) ?? createActiveCart.get(userId);
    },

    listItems(cartId) {
      return database
        .prepare(`
          SELECT
            ci.pk_id, ci.fk_produto, ci.quantidade,
            p.nome, p.slug, p.subtitulo, p.preco_centavos, p.estoque, p.imagem_uri
          FROM carrinho_itens ci
          JOIN produtos p ON p.pk_id = ci.fk_produto
          WHERE ci.fk_carrinho = ? AND p.ativo = 1
          ORDER BY ci.criado_em
        `)
        .all(cartId);
    },

    findItem(cartId, productId) {
      return database
        .prepare(`
          SELECT * FROM carrinho_itens WHERE fk_carrinho = ? AND fk_produto = ?
        `)
        .get(cartId, productId);
    },

    addItem(cartId, productId, quantity) {
      database
        .prepare(`
          INSERT INTO carrinho_itens (fk_carrinho, fk_produto, quantidade)
          VALUES (?, ?, ?)
          ON CONFLICT (fk_carrinho, fk_produto) DO UPDATE SET
            quantidade = carrinho_itens.quantidade + excluded.quantidade,
            atualizado_em = CURRENT_TIMESTAMP
        `)
        .run(cartId, productId, quantity);
    },

    updateItem(cartId, productId, quantity) {
      return database
        .prepare(`
          UPDATE carrinho_itens
          SET quantidade = ?, atualizado_em = CURRENT_TIMESTAMP
          WHERE fk_carrinho = ? AND fk_produto = ?
        `)
        .run(quantity, cartId, productId);
    },

    deleteItem(cartId, productId) {
      return database
        .prepare('DELETE FROM carrinho_itens WHERE fk_carrinho = ? AND fk_produto = ?')
        .run(cartId, productId);
    },
  };

  return repository;
}
