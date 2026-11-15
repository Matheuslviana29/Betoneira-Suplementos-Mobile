# Betoneira Suplementos

Loja de suplementos com aplicativo Expo/React Native e API Node.js/Express com SQLite.

## Requisito obrigatório

- Node.js **22.18.0**. A versão também está registrada em `.nvmrc`.
- npm, instalado com o Node.js.

## Clonar e instalar no Windows

No PowerShell:

```powershell
git clone https://github.com/Matheuslviana29/Betoneira-Suplementos-Mobile.git
cd Betoneira-Suplementos-Mobile
```

O repositório contém dois projetos independentes. Cada pasta possui seu próprio `package.json` e `package-lock.json`:

- `backend/`: API e banco SQLite;
- `frontend/`: aplicativo Expo.

Instale cada projeto com `npm ci` — não use `npm install`:

```powershell
cd backend
npm.cmd ci

cd ..\frontend
npm.cmd ci
```

Antes de iniciar o backend, entre na pasta e crie o arquivo local de ambiente a partir do exemplo:

```powershell
cd ..\backend
Copy-Item .env.example .env
```

`MERCADO_PAGO_ACCESS_TOKEN` só é necessário para testar o Checkout Pro. Obtenha o Access Token
em **Mercado Pago Developers → Integrações → sua aplicação Checkout Pro → Credenciais de teste**
e preencha-o manualmente em `backend/.env`. O token fica somente no backend: nunca o coloque no
frontend, GitHub, logs ou mensagens e nunca compartilhe o arquivo `.env`.

## Executar

Abra dois terminais.

No primeiro, prepare o banco e inicie a API:

```powershell
cd backend
npm.cmd run db:seed
npm.cmd run dev
```

A API ficará disponível em `http://localhost:3333`.

No segundo, inicie o aplicativo:

```powershell
cd frontend
npm.cmd start
```

Também é possível abrir uma plataforma diretamente:

```powershell
npm.cmd run web
npm.cmd run android
```

O comando de Android requer emulador ou aparelho configurado. iOS requer macOS e Xcode.

### Celular físico

Normalmente o Expo detecta o endereço da API pela rede. Se isso não funcionar, crie `frontend/.env.local` e defina `EXPO_PUBLIC_API_URL` com o IP do computador, a porta `3333` e o caminho `/api/v1`. O celular e o computador precisam estar na mesma rede.

Não publique esse arquivo nem coloque nele credenciais, senhas, tokens ou dados pessoais.

## Testes

```powershell
cd backend
npm.cmd test

cd ..\frontend
npm.cmd test
node --test test/router-contract.test.mjs
node --test test/import-contract.test.mjs
```

## Testar o Checkout Pro

1. Crie uma conta e uma aplicação Checkout Pro no Mercado Pago Developers.
2. Configure o Access Token de teste somente em `backend/.env`.
3. Inicie primeiro o backend e depois o frontend.
4. No aplicativo, crie uma conta, adicione produtos ao carrinho e cadastre um endereço.
5. Pressione **PAGAR COM MERCADO PAGO** e use um comprador ou cartão de teste oficial.
6. Volte ao aplicativo e encontre o pedido em `/pedidos`.
7. Use **Atualizar pedidos** para recarregar a lista local.

Nesta demonstração o pagamento não é confirmado automaticamente. O pedido permanece como
**Pagamento iniciado — aguardando confirmação no Mercado Pago**; estoque e carrinho não são
modificados. O webhook existente pode ser configurado futuramente, mas não é necessário para
instalar, executar ou apresentar o projeto.

## Dados locais

O banco é local e fica em `backend/data/database.sqlite`. Ele é ignorado pelo Git. Usuários, carrinhos, endereços e pedidos existem somente no computador que está executando o backend.

## Arquitetura

- As rotas do Expo ficam em `frontend/src/app/` e são adaptadores pequenos.
- As telas e regras de interface ficam em `frontend/src/features/`.
- O backend segue `rota → controller → service → repository → banco`.

## Funcionalidades atuais

- cadastro, login, logout e sessão persistida;
- catálogo, busca, categorias e favoritos;
- carrinho e controle de quantidades;
- perfil e alteração de senha;
- endereços e formas de pagamento;
- seleção explícita de endereço e pagamento no checkout;
- criação, histórico e detalhes de pedidos.
- demonstração acadêmica do Mercado Pago Checkout Pro, com preferência criada no backend e
  abertura do checkout hospedado pelo aplicativo;
- pedido Mercado Pago iniciado como `aguardando_pagamento`, sem confirmação automática ou
  manual nesta demonstração;
- após iniciar o pagamento, o aplicativo seleciona `/pedidos`, abre o Checkout Pro e permite
  recarregar apenas a lista local com **Atualizar pedidos**.

## Limitações atuais

- recuperação de senha simulada;
- cancelamento de pedido disponível na API, mas ainda sem interface;
- smoke test de iOS ainda não realizado.
- na demonstração acadêmica, o pedido permanece pendente e não há confirmação automática ou
  manual do pagamento; estoque e carrinho permanecem intactos.
- não existe fluxo automático de separação ou envio após a aprovação financeira.
- o webhook permanece no código como melhoria futura, mas não precisa ser configurado nesta etapa.

Veja também [frontend/README.md](frontend/README.md) e [backend/README.md](backend/README.md).
