export function createOrderRepository(database) {
  return {
    list(userId) {
      return database
        .prepare('SELECT * FROM pedidos WHERE fk_usuario = ? ORDER BY criado_em DESC, pk_id DESC')
        .all(userId);
    },

    find(userId, id) {
      return database
        .prepare('SELECT * FROM pedidos WHERE pk_id = ? AND fk_usuario = ?')
        .get(id, userId);
    },

    listItems(orderId) {
      return database
        .prepare('SELECT * FROM pedido_itens WHERE fk_pedido = ? ORDER BY pk_id')
        .all(orderId);
    },

    insertOrder(data) {
      return database
        .prepare(`
          INSERT INTO pedidos (
            fk_usuario, fk_endereco, fk_forma_pagamento, status,
            subtotal_centavos, frete_centavos, total_centavos,
            destinatario, cep, logradouro, numero, complemento, bairro, cidade, uf,
            pagamento_descricao
          ) VALUES (
            @userId, @addressId, @paymentMethodId, 'aguardando_pagamento',
            @subtotal, @shipping, @total,
            @destinatario, @cep, @logradouro, @numero, @complemento, @bairro, @cidade, @uf,
            @paymentDescription
          ) RETURNING *
        `)
        .get(data);
    },

    insertItem(orderId, item) {
      database
        .prepare(`
          INSERT INTO pedido_itens (
            fk_pedido, fk_produto, nome_produto, preco_unitario_centavos,
            quantidade, subtotal_centavos
          ) VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
          orderId,
          item.fk_produto,
          item.nome,
          item.preco_centavos,
          item.quantidade,
          item.preco_centavos * item.quantidade,
        );
    },

    decrementStock(productId, quantity) {
      return database
        .prepare(`
          UPDATE produtos SET estoque = estoque - ?, atualizado_em = CURRENT_TIMESTAMP
          WHERE pk_id = ? AND ativo = 1 AND estoque >= ?
        `)
        .run(quantity, productId, quantity);
    },

    restoreStock(productId, quantity) {
      database
        .prepare(`
          UPDATE produtos SET estoque = estoque + ?, atualizado_em = CURRENT_TIMESTAMP
          WHERE pk_id = ?
        `)
        .run(quantity, productId);
    },

    markCartAsConverted(cartId) {
      database
        .prepare(`
          UPDATE carrinhos SET status = 'convertido', atualizado_em = CURRENT_TIMESTAMP
          WHERE pk_id = ?
        `)
        .run(cartId);
    },

    cancel(userId, orderId) {
      return database
        .prepare(`
          UPDATE pedidos
          SET status = 'cancelado', atualizado_em = CURRENT_TIMESTAMP
          WHERE pk_id = ? AND fk_usuario = ?
            AND status IN ('aguardando_pagamento', 'pago', 'em_separacao')
        `)
        .run(orderId, userId);
    },
  };
}
