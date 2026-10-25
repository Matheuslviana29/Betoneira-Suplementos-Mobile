# Backend — Betoneira Suplementos

API REST modular construída com Node.js 22, Express 5 e SQLite. A API está versionada em `/api/v1`; a rota operacional de saúde permanece em `/api/health`.

## Decisões de arquitetura

O projeto usa o fluxo `rota → controller → service → repository → banco`:

- **rotas** definem URL, método HTTP, autenticação e validação;
- **controllers** traduzem HTTP para chamadas da aplicação;
- **services** concentram regras de negócio e transações;
- **repositories** isolam todo o SQL;
- **validators** definem o contrato de entrada com Zod;
- **migrações** mantêm um histórico reproduzível do esquema.

`repositories` foi usado no lugar de `models` porque as entidades não são objetos ativos acoplados ao SQLite. Isso facilita trocar a camada de persistência e testar as regras sem espalhar SQL pela aplicação.

## Estrutura

```text
backend/
├── data/                         # Banco local, ignorado pelo Git
├── src/
│   ├── config/                   # Variáveis de ambiente
│   ├── controllers/              # Entrada e saída HTTP
│   ├── database/
│   │   ├── migrations/           # Alterações versionadas do esquema
│   │   └── seeds/                # Catálogo inicial idempotente
│   ├── errors/                   # Erros conhecidos da aplicação
│   ├── middlewares/              # Autenticação, validação e erros
│   ├── repositories/             # Consultas SQL
│   ├── routes/                   # Endpoints REST
│   ├── services/                 # Regras de negócio
│   ├── utils/                    # Hash de senha, sessão e mapeadores
│   ├── validators/               # Esquemas Zod
│   ├── app.js                    # Composição da aplicação
│   └── server.js                 # Processo HTTP
├── test/                         # Testes de integração
├── .env.example
└── package.json
```

## Instalação e execução

Requer Node.js 22.13 ou superior.

```bash
cd backend
npm install
npm run db:seed
npm run dev
```

O `db:seed` executa primeiro todas as migrações pendentes e depois cadastra o catálogo inicial. Ele pode ser executado novamente sem duplicar dados. A API estará em `http://localhost:3333`.

Copie `.env.example` para `.env` se precisar alterar:

```dotenv
PORT=3333
NODE_ENV=development
DATABASE_PATH=./data/database.sqlite
SESSION_DURATION_DAYS=7
CORS_ORIGINS=http://localhost:8081,http://127.0.0.1:8081
```

No Android Emulator, o frontend normalmente acessa a máquina pelo host `10.0.2.2`; em aparelho físico, use o IP local do computador. A origem web do Expo deve estar em `CORS_ORIGINS`.

## Convenções do banco

- Todas as tabelas usam `pk_id` como chave primária inteira.
- Toda chave estrangeira começa com `fk_`, como `fk_usuario` e `fk_produto`.
- Tabelas e colunas usam nomes claros em português e `snake_case`.
- Dinheiro é salvo em centavos inteiros, evitando erros de ponto flutuante.
- Senhas usam `scrypt` com salt individual; nunca são devolvidas pela API.
- Sessões usam tokens aleatórios, mas somente o hash SHA-256 é persistido.
- Cabeçalhos HTTP de segurança são aplicados pelo Helmet e o CORS usa uma lista configurável.
- Cartões guardam apenas bandeira, últimos quatro dígitos, validade e token do gateway. Número completo e CVV nunca devem ser persistidos.
- Pedidos guardam uma fotografia de endereço, pagamento, nome e preço dos itens, preservando o histórico após futuras edições.
- Chaves estrangeiras, índices, `CHECK` constraints e transações estão ativos.

Tabelas atuais: `usuarios`, `sessoes`, `enderecos`, `categorias`, `produtos`, `favoritos`, `carrinhos`, `carrinho_itens`, `formas_pagamento`, `pedidos`, `pedido_itens` e `schema_migrations`.

Para alterar o esquema, crie uma nova migração numerada; não edite uma migração que já tenha sido aplicada em ambientes compartilhados.

## Endpoints REST

Endpoints públicos:

| Método | Rota | Uso |
|---|---|---|
| `GET` | `/api/health` | Verifica a API |
| `POST` | `/api/v1/auth/cadastro` | Cria conta e sessão |
| `POST` | `/api/v1/auth/login` | Autentica |
| `GET` | `/api/v1/categorias` | Lista categorias |
| `GET` | `/api/v1/produtos` | Lista, busca, filtra e pagina produtos |
| `GET` | `/api/v1/produtos/:identificador` | Obtém produto por ID ou slug |

Endpoints protegidos por `Authorization: Bearer <token>`:

| Método | Rota | Uso |
|---|---|---|
| `POST` | `/api/v1/auth/logout` | Encerra a sessão |
| `GET/PATCH` | `/api/v1/usuarios/me` | Consulta ou edita o perfil |
| `PATCH` | `/api/v1/usuarios/me/senha` | Altera senha e revoga sessões |
| `GET/POST` | `/api/v1/enderecos` | Lista ou cria endereço |
| `PATCH/DELETE` | `/api/v1/enderecos/:id` | Edita ou remove endereço |
| `GET/POST` | `/api/v1/formas-pagamento` | Lista ou cria forma de pagamento |
| `DELETE` | `/api/v1/formas-pagamento/:id` | Remove forma de pagamento |
| `GET/POST` | `/api/v1/favoritos` | Lista ou adiciona favorito |
| `DELETE` | `/api/v1/favoritos/:produtoId` | Remove favorito |
| `GET` | `/api/v1/carrinho` | Obtém o carrinho ativo |
| `POST` | `/api/v1/carrinho/itens` | Adiciona item |
| `PATCH/DELETE` | `/api/v1/carrinho/itens/:produtoId` | Altera quantidade ou remove item |
| `GET/POST` | `/api/v1/pedidos` | Lista ou cria pedido |
| `GET` | `/api/v1/pedidos/:id` | Obtém um pedido |
| `PATCH` | `/api/v1/pedidos/:id/cancelamento` | Cancela quando permitido |

A listagem de produtos aceita `busca`, `categoria`, `destaque`, `pagina` e `limite` como query params.

## Formato das respostas

Sucesso simples:

```json
{
  "dados": {}
}
```

Erro conhecido:

```json
{
  "erro": {
    "codigo": "DADOS_INVALIDOS",
    "mensagem": "Dados inválidos.",
    "detalhes": [
      { "campo": "body.email", "mensagem": "Invalid email address" }
    ]
  }
}
```

## Verificações

```bash
npm test
npm audit
npm run db:check
```

Os testes usam SQLite em memória e cobrem saúde, catálogo, autenticação, autorização, validação e o fluxo completo até a criação do pedido.
