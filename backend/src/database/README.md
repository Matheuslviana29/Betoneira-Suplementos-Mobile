# Banco de dados

O SQLite é aberto em `connection.js` com chaves estrangeiras, timeout de espera e modo WAL para arquivos locais. O caminho padrão é `backend/data/database.sqlite` e pode ser alterado por `DATABASE_PATH`.

## Migrações

Os arquivos de `migrations/` são executados em ordem alfabética e registrados em `schema_migrations`. Cada arquivo é aplicado dentro de uma transação.

Ao mudar o esquema:

1. crie o próximo arquivo numerado, como `002_adicionar_campo_produto.sql`;
2. escreva uma alteração compatível com bancos que já possuem dados;
3. execute `npm run db:migrate`;
4. atualize e execute os testes.

Não altere migrações já aplicadas fora da sua máquina. O arquivo `.sqlite`, assim como os arquivos auxiliares `-wal` e `-shm`, é local e está ignorado pelo Git.

## Seed

`npm run db:seed` aplica as migrações e cadastra categorias e produtos do protótipo. Os `UPSERTs` tornam a operação idempotente.
