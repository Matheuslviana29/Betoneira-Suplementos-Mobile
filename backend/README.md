# Backend — Betoneira Suplementos

API REST em Node.js/Express com SQLite local.

## Instalar e executar

Use obrigatoriamente Node.js **22.18.0**. O backend possui seu próprio `package.json` e deve ser iniciado antes do frontend.

```powershell
cd backend
npm.cmd ci
npm.cmd run db:seed
npm.cmd run dev
```

A ordem é importante:

1. instalar o backend;
2. executar o seed do banco;
3. iniciar a API;
4. iniciar o frontend em outro terminal.

A API ficará disponível em `http://localhost:3333`. O backend usa `node:sqlite`, incluído no Node.js, sem exigir Python ou ferramentas C++.

## Banco local

O arquivo padrão é `backend/data/database.sqlite`. Ele não vai para o Git.

Usuários, sessões, carrinhos, endereços e pedidos ficam somente no computador que executa o backend. Outro computador terá seu próprio banco e seus próprios dados.

Não versione arquivos de ambiente, credenciais, dados pessoais, senhas ou tokens.

## Testar

```powershell
npm.cmd test
npm.cmd run db:check
```

## Arquitetura

O fluxo principal é:

```text
rota → controller → service → repository → banco
```

- rotas definem os endpoints;
- controllers tratam HTTP;
- services aplicam regras de negócio;
- repositories concentram o SQL;
- migrations e seed preparam o banco.

## Funcionalidades atendidas

- autenticação e sessão;
- catálogo e favoritos;
- carrinho;
- perfil, endereços e formas de pagamento;
- criação, listagem, detalhes e cancelamento de pedidos pela API.

## Limitações de interface

- recuperação de senha é simulada no frontend;
- cancelamento de pedido ainda não possui interface;
- smoke test de iOS ainda não foi realizado.
