# Backend — Betoneira Suplementos

API REST em Node.js/Express com SQLite local.

## Instalar e executar

Use obrigatoriamente Node.js **22.18.0**. O backend possui seu próprio `package.json` e deve ser iniciado antes do frontend.

```powershell
cd backend
npm.cmd ci
Copy-Item .env.example .env
npm.cmd run db:seed
npm.cmd run dev
```

A ordem é importante:

1. instalar o backend;
2. executar o seed do banco;
3. iniciar a API;
4. iniciar o frontend em outro terminal.

A API ficará disponível em `http://localhost:3333`. O backend usa `node:sqlite`, incluído no Node.js, sem exigir Python ou ferramentas C++.

## Mercado Pago Checkout Pro (MVP acadêmico)

O SDK oficial `mercadopago` fica somente neste backend. Copie `backend/.env.example` para
`backend/.env` e substitua o placeholder de `MERCADO_PAGO_ACCESS_TOKEN` pelo Access Token de
teste da sua aplicação Mercado Pago. Nunca use uma variável `EXPO_PUBLIC_*`, nunca coloque o
token no frontend e não versione o arquivo `.env`.

Use uma conta e credenciais de teste do Mercado Pago para validar o botão **Pagar com Mercado
Pago**. Não coloque Access Token, assinatura de webhook ou qualquer credencial real em comandos,
logs, documentação ou arquivos versionados.

O endpoint autenticado `POST /api/v1/pagamentos/mercado-pago/preferencia` recebe apenas
`enderecoId`. Usuário, carrinho, produtos, quantidades, preços e frete são obtidos no backend.
A resposta expõe somente `init_point` e `preference_id`.

Ao iniciar o Checkout Pro, a API cria um pedido local com status financeiro
`aguardando_pagamento`. Configure também `MERCADO_PAGO_WEBHOOK_SECRET` somente em
`backend/.env`. No painel do Mercado Pago, habilite o evento **Pagamentos** para uma URL HTTPS
pública terminada em `/api/v1/webhooks/mercado-pago`.

Em desenvolvimento, exponha temporariamente a porta `3333` com um túnel HTTPS de sua escolha,
sem adicioná-lo às dependências do projeto. O backend valida a assinatura, consulta o pagamento
pelo SDK e só então atualiza o pedido. O retorno visual do navegador nunca confirma pagamento.

Limitação acadêmica: o fluxo Mercado Pago não baixa ou reserva estoque e não limpa, converte ou
altera o carrinho, inclusive após aprovação. A aprovação também não inicia automaticamente
separação ou envio.

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
