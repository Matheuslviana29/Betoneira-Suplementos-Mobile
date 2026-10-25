CREATE TABLE usuarios (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  cpf TEXT NOT NULL UNIQUE CHECK (length(cpf) = 11),
  data_nascimento TEXT NOT NULL,
  celular TEXT NOT NULL,
  telefone TEXT,
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'feminino', 'outro')),
  senha_hash TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE sessoes (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expira_em TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_uso_em TEXT,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_sessoes_usuario ON sessoes(fk_usuario);
CREATE INDEX idx_sessoes_expiracao ON sessoes(expira_em);

CREATE TABLE enderecos (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario INTEGER NOT NULL,
  apelido TEXT NOT NULL,
  destinatario TEXT NOT NULL,
  cep TEXT NOT NULL CHECK (length(cep) = 8),
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL CHECK (length(uf) = 2),
  referencia TEXT,
  padrao INTEGER NOT NULL DEFAULT 0 CHECK (padrao IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_enderecos_usuario ON enderecos(fk_usuario);
CREATE UNIQUE INDEX idx_endereco_padrao_usuario
  ON enderecos(fk_usuario) WHERE padrao = 1;

CREATE TABLE categorias (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  ordem_exibicao INTEGER NOT NULL DEFAULT 0,
  ativa INTEGER NOT NULL DEFAULT 1 CHECK (ativa IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE produtos (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_categoria INTEGER NOT NULL,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitulo TEXT,
  descricao TEXT,
  preco_centavos INTEGER NOT NULL CHECK (preco_centavos >= 0),
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  imagem_uri TEXT,
  destaque INTEGER NOT NULL DEFAULT 0 CHECK (destaque IN (0, 1)),
  ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_categoria) REFERENCES categorias(pk_id) ON DELETE RESTRICT
) STRICT;

CREATE INDEX idx_produtos_categoria ON produtos(fk_categoria);
CREATE INDEX idx_produtos_ativos_nome ON produtos(ativo, nome);

CREATE TABLE favoritos (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario INTEGER NOT NULL,
  fk_produto INTEGER NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_produto) REFERENCES produtos(pk_id) ON DELETE CASCADE,
  UNIQUE (fk_usuario, fk_produto)
) STRICT;

CREATE INDEX idx_favoritos_usuario ON favoritos(fk_usuario);

CREATE TABLE carrinhos (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo'
    CHECK (status IN ('ativo', 'convertido', 'abandonado')),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_id) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX idx_carrinho_ativo_usuario
  ON carrinhos(fk_usuario) WHERE status = 'ativo';

CREATE TABLE carrinho_itens (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_carrinho INTEGER NOT NULL,
  fk_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_carrinho) REFERENCES carrinhos(pk_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_produto) REFERENCES produtos(pk_id) ON DELETE CASCADE,
  UNIQUE (fk_carrinho, fk_produto)
) STRICT;

CREATE INDEX idx_carrinho_itens_carrinho ON carrinho_itens(fk_carrinho);

CREATE TABLE formas_pagamento (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario INTEGER NOT NULL,
  apelido TEXT,
  bandeira TEXT NOT NULL,
  ultimos_digitos TEXT NOT NULL CHECK (length(ultimos_digitos) = 4),
  mes_expiracao INTEGER NOT NULL CHECK (mes_expiracao BETWEEN 1 AND 12),
  ano_expiracao INTEGER NOT NULL,
  token_gateway TEXT,
  padrao INTEGER NOT NULL DEFAULT 0 CHECK (padrao IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_formas_pagamento_usuario ON formas_pagamento(fk_usuario);
CREATE UNIQUE INDEX idx_forma_pagamento_padrao_usuario
  ON formas_pagamento(fk_usuario) WHERE padrao = 1;

CREATE TABLE pedidos (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario INTEGER NOT NULL,
  fk_endereco INTEGER,
  fk_forma_pagamento INTEGER,
  status TEXT NOT NULL DEFAULT 'aguardando_pagamento'
    CHECK (status IN (
      'aguardando_pagamento', 'pago', 'em_separacao', 'enviado',
      'entregue', 'cancelado'
    )),
  subtotal_centavos INTEGER NOT NULL CHECK (subtotal_centavos >= 0),
  frete_centavos INTEGER NOT NULL CHECK (frete_centavos >= 0),
  total_centavos INTEGER NOT NULL CHECK (total_centavos >= 0),
  destinatario TEXT NOT NULL,
  cep TEXT NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  pagamento_descricao TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_id) ON DELETE RESTRICT,
  FOREIGN KEY (fk_endereco) REFERENCES enderecos(pk_id) ON DELETE SET NULL,
  FOREIGN KEY (fk_forma_pagamento) REFERENCES formas_pagamento(pk_id) ON DELETE SET NULL,
  CHECK (total_centavos = subtotal_centavos + frete_centavos)
) STRICT;

CREATE INDEX idx_pedidos_usuario_data ON pedidos(fk_usuario, criado_em DESC);

CREATE TABLE pedido_itens (
  pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_pedido INTEGER NOT NULL,
  fk_produto INTEGER,
  nome_produto TEXT NOT NULL,
  preco_unitario_centavos INTEGER NOT NULL CHECK (preco_unitario_centavos >= 0),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  subtotal_centavos INTEGER NOT NULL CHECK (subtotal_centavos >= 0),
  FOREIGN KEY (fk_pedido) REFERENCES pedidos(pk_id) ON DELETE CASCADE,
  FOREIGN KEY (fk_produto) REFERENCES produtos(pk_id) ON DELETE SET NULL,
  CHECK (subtotal_centavos = preco_unitario_centavos * quantidade)
) STRICT;

CREATE INDEX idx_pedido_itens_pedido ON pedido_itens(fk_pedido);
