export function createUserRepository(database) {
  const insertUser = database.prepare(`
    INSERT INTO usuarios (
      nome_completo, email, cpf, data_nascimento, celular, telefone, genero, senha_hash
    ) VALUES (
      @nomeCompleto, @email, @cpf, @dataNascimento, @celular, @telefone, @genero, @senhaHash
    ) RETURNING *
  `);

  return {
    create(data) {
      return insertUser.get(data);
    },

    findByEmail(email) {
      return database.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    },

    findByCpf(cpf) {
      return database.prepare('SELECT * FROM usuarios WHERE cpf = ?').get(cpf);
    },

    findById(id) {
      return database.prepare('SELECT * FROM usuarios WHERE pk_id = ?').get(id);
    },

    update(id, fields) {
      const columnByField = {
        nomeCompleto: 'nome_completo',
        email: 'email',
        dataNascimento: 'data_nascimento',
        celular: 'celular',
        telefone: 'telefone',
        genero: 'genero',
      };
      const entries = Object.entries(fields).filter(([field]) => columnByField[field]);
      const assignments = entries.map(([field]) => `${columnByField[field]} = @${field}`);

      if (assignments.length === 0) return this.findById(id);

      return database
        .prepare(`
          UPDATE usuarios
          SET ${assignments.join(', ')}, atualizado_em = CURRENT_TIMESTAMP
          WHERE pk_id = @id
          RETURNING *
        `)
        .get({ id, ...Object.fromEntries(entries) });
    },

    updatePassword(id, passwordHash) {
      return database
        .prepare(`
          UPDATE usuarios
          SET senha_hash = ?, atualizado_em = CURRENT_TIMESTAMP
          WHERE pk_id = ?
        `)
        .run(passwordHash, id);
    },
  };
}

export function createSessionRepository(database) {
  return {
    create({ userId, tokenHash, expiresAt }) {
      return database
        .prepare(`
          INSERT INTO sessoes (fk_usuario, token_hash, expira_em)
          VALUES (?, ?, ?)
          RETURNING *
        `)
        .get(userId, tokenHash, expiresAt);
    },

    findActiveByTokenHash(tokenHash) {
      return database
        .prepare(`
          SELECT s.pk_id AS sessao_id, s.fk_usuario, s.expira_em, u.*
          FROM sessoes s
          JOIN usuarios u ON u.pk_id = s.fk_usuario
          WHERE s.token_hash = ?
            AND datetime(s.expira_em) > datetime('now')
            AND u.ativo = 1
        `)
        .get(tokenHash);
    },

    touch(sessionId) {
      database
        .prepare('UPDATE sessoes SET ultimo_uso_em = CURRENT_TIMESTAMP WHERE pk_id = ?')
        .run(sessionId);
    },

    deleteByTokenHash(tokenHash) {
      database.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(tokenHash);
    },

    deleteAllByUserId(userId) {
      database.prepare('DELETE FROM sessoes WHERE fk_usuario = ?').run(userId);
    },
  };
}
