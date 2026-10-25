export function createCustomerRepository(database) {
  const setDefaultAddress = database.transaction((userId, addressId) => {
    database.prepare('UPDATE enderecos SET padrao = 0 WHERE fk_usuario = ?').run(userId);
    database
      .prepare('UPDATE enderecos SET padrao = 1 WHERE pk_id = ? AND fk_usuario = ?')
      .run(addressId, userId);
  });

  const setDefaultPayment = database.transaction((userId, paymentMethodId) => {
    database.prepare('UPDATE formas_pagamento SET padrao = 0 WHERE fk_usuario = ?').run(userId);
    database
      .prepare('UPDATE formas_pagamento SET padrao = 1 WHERE pk_id = ? AND fk_usuario = ?')
      .run(paymentMethodId, userId);
  });

  return {
    listAddresses(userId) {
      return database
        .prepare('SELECT * FROM enderecos WHERE fk_usuario = ? ORDER BY padrao DESC, pk_id')
        .all(userId);
    },

    findAddress(userId, id) {
      return database
        .prepare('SELECT * FROM enderecos WHERE pk_id = ? AND fk_usuario = ?')
        .get(id, userId);
    },

    createAddress(userId, data) {
      const row = database
        .prepare(`
          INSERT INTO enderecos (
            fk_usuario, apelido, destinatario, cep, logradouro, numero,
            complemento, bairro, cidade, uf, referencia, padrao
          ) VALUES (
            @userId, @apelido, @destinatario, @cep, @logradouro, @numero,
            @complemento, @bairro, @cidade, @uf, @referencia, 0
          ) RETURNING *
        `)
        .get({ userId, ...data });

      if (data.padrao || this.listAddresses(userId).length === 1) {
        setDefaultAddress(userId, row.pk_id);
        return this.findAddress(userId, row.pk_id);
      }

      return row;
    },

    updateAddress(userId, id, fields) {
      const columns = [
        'apelido', 'destinatario', 'cep', 'logradouro', 'numero', 'complemento',
        'bairro', 'cidade', 'uf', 'referencia',
      ];
      const entries = Object.entries(fields).filter(([field]) => columns.includes(field));

      if (entries.length > 0) {
        const assignments = entries.map(([field]) => `${field} = @${field}`).join(', ');
        database
          .prepare(`
            UPDATE enderecos SET ${assignments}, atualizado_em = CURRENT_TIMESTAMP
            WHERE pk_id = @id AND fk_usuario = @userId
          `)
          .run({ id, userId, ...Object.fromEntries(entries) });
      }

      if (fields.padrao === true) setDefaultAddress(userId, id);
      return this.findAddress(userId, id);
    },

    deleteAddress(userId, id) {
      return database
        .prepare('DELETE FROM enderecos WHERE pk_id = ? AND fk_usuario = ?')
        .run(id, userId);
    },

    listPaymentMethods(userId) {
      return database
        .prepare(`
          SELECT * FROM formas_pagamento
          WHERE fk_usuario = ?
          ORDER BY padrao DESC, pk_id
        `)
        .all(userId);
    },

    findPaymentMethod(userId, id) {
      return database
        .prepare('SELECT * FROM formas_pagamento WHERE pk_id = ? AND fk_usuario = ?')
        .get(id, userId);
    },

    createPaymentMethod(userId, data) {
      const row = database
        .prepare(`
          INSERT INTO formas_pagamento (
            fk_usuario, apelido, bandeira, ultimos_digitos, mes_expiracao,
            ano_expiracao, token_gateway, padrao
          ) VALUES (
            @userId, @apelido, @bandeira, @ultimosDigitos, @mesExpiracao,
            @anoExpiracao, @tokenGateway, 0
          ) RETURNING *
        `)
        .get({ userId, ...data });

      if (data.padrao || this.listPaymentMethods(userId).length === 1) {
        setDefaultPayment(userId, row.pk_id);
        return this.findPaymentMethod(userId, row.pk_id);
      }

      return row;
    },

    deletePaymentMethod(userId, id) {
      return database
        .prepare('DELETE FROM formas_pagamento WHERE pk_id = ? AND fk_usuario = ?')
        .run(id, userId);
    },

    listFavorites(userId) {
      return database
        .prepare(`
          SELECT p.*, c.nome AS categoria_nome, c.slug AS categoria_slug
          FROM favoritos f
          JOIN produtos p ON p.pk_id = f.fk_produto
          JOIN categorias c ON c.pk_id = p.fk_categoria
          WHERE f.fk_usuario = ? AND p.ativo = 1
          ORDER BY f.criado_em DESC
        `)
        .all(userId);
    },

    addFavorite(userId, productId) {
      return database
        .prepare(`
          INSERT INTO favoritos (fk_usuario, fk_produto)
          VALUES (?, ?)
          ON CONFLICT (fk_usuario, fk_produto) DO NOTHING
        `)
        .run(userId, productId);
    },

    deleteFavorite(userId, productId) {
      return database
        .prepare('DELETE FROM favoritos WHERE fk_usuario = ? AND fk_produto = ?')
        .run(userId, productId);
    },
  };
}
