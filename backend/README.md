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
teste obtido em **Mercado Pago Developers → Integrações → sua aplicação Checkout Pro →
Credenciais de teste**. Essa variável só é necessária para testar o Checkout Pro. Nunca use uma
variável `EXPO_PUBLIC_*`, nunca coloque o token no frontend, GitHub, logs ou mensagens e nunca
compartilhe ou versione o arquivo `.env`.

Use uma conta e credenciais de teste do Mercado Pago para validar o botão **Pagar com Mercado
Pago**. Não coloque Access Token, assinatura de webhook ou qualquer credencial real em comandos,
logs, documentação ou arquivos versionados.

O endpoint autenticado `POST /api/v1/pagamentos/mercado-pago/preferencia` recebe apenas
`enderecoId`. Usuário, carrinho, produtos, quantidades, preços e frete são obtidos no backend.
A resposta expõe somente `init_point` e `preference_id`.

Ao iniciar o Checkout Pro, a API cria um pedido local com status financeiro
`aguardando_pagamento`. O retorno visual do navegador nunca confirma pagamento. O endpoint de
webhook validado permanece no código para evolução futura, mas não é configurado nem necessário
para esta demonstração.

Limitação acadêmica: nesta demonstração, o pedido permanece como `aguardando_pagamento`; não há
consulta manual ou confirmação automática. O fluxo não baixa ou reserva estoque, não altera o
carrinho e não inicia automaticamente separação ou envio. O webhook permanece disponível como
melhoria futura, sem configuração obrigatória nesta etapa.

## Banco local

O arquivo padrão é `backend/data/database.sqlite`. Ele não vai para o Git.

Usuários, sessões, carrinhos, endereços e pedidos ficam somente no computador que executa o backend. Outro computador terá seu próprio banco e seus próprios dados.

Não versione arquivos de ambiente, credenciais, dados pessoais, senhas ou tokens.

## Testar

```powershell
npm.cmd test
npm.cmd run db:check
```

Para o smoke do Checkout Pro, inicie o backend antes do frontend, adicione produtos e endereço
no aplicativo, pressione **PAGAR COM MERCADO PAGO** e use um comprador ou cartão de teste
oficial. Ao voltar, o pedido estará em `/pedidos` como pendente. **Atualizar pedidos** apenas
recarrega a lista local; não consulta nem confirma o pagamento.

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
