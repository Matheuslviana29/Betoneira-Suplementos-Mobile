# Frontend — Betoneira Suplementos

Aplicativo Expo SDK 57, React Native e Expo Router.

## Instalar

Use obrigatoriamente Node.js **22.18.0**. O backend deve ser instalado e iniciado primeiro.

```powershell
cd frontend
npm.cmd ci
```

Cada pasta do repositório é um projeto separado; este frontend possui seu próprio `package.json`.

## Executar

```powershell
npm.cmd start
```

Ou abra diretamente:

```powershell
npm.cmd run web
npm.cmd run android
```

- Web abre no navegador.
- Android requer emulador ou aparelho configurado.
- iOS requer macOS e Xcode.

### Celular físico

Mantenha celular e computador na mesma rede. Se o Expo não detectar a API automaticamente, crie `frontend/.env.local` e defina `EXPO_PUBLIC_API_URL` apontando para o IP do computador, porta `3333` e caminho `/api/v1`.

Não versione esse arquivo e não inclua credenciais, senhas, tokens ou dados pessoais.

## Testar

```powershell
npm.cmd test
node --test test/router-contract.test.mjs
node --test test/import-contract.test.mjs
```

## Arquitetura

- `src/app/`: rotas e adaptadores pequenos do Expo Router;
- `src/features/`: telas organizadas por autenticação, catálogo, carrinho, checkout, perfil e pedidos;
- `src/components/`: componentes compartilhados;
- `src/services/`: comunicação com a API.

## Funcionalidades

- autenticação e sessão;
- catálogo, busca e favoritos;
- carrinho;
- perfil e senha;
- cadastro, seleção e remoção de endereços e formas de pagamento;
- checkout com seleção explícita;
- criação e consulta de pedidos.

### Mercado Pago Checkout Pro (MVP acadêmico)

No checkout, o botão **Pagar com Mercado Pago** solicita ao backend uma preferência e abre o
`init_point` com `Linking.openURL`. O método de pagamento é escolhido no ambiente hospedado do
Mercado Pago; nenhum Access Token, número de cartão ou CVV passa pelo aplicativo.

Ao iniciar o pagamento, o backend cria o pedido com status financeiro `aguardando_pagamento`.
O retorno do navegador não confirma pagamento: a atualização para aprovado, recusado ou
cancelado depende de um webhook HTTPS público validado e de uma consulta autenticada do backend
ao Mercado Pago. `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_WEBHOOK_SECRET` existem somente em
`backend/.env` e nunca devem ser expostos ao aplicativo ou enviados ao Git.

Para o smoke manual, use credenciais de teste, selecione o endereço, pressione **Pagar com
Mercado Pago** e conclua o checkout hospedado. As telas e formas de pagamento locais continuam
preservadas.

## Limitações

- recuperação de senha simulada;
- cancelamento de pedido ainda sem interface;
- smoke test de iOS ainda não realizado.
- estoque e carrinho não são alterados após o pagamento;
- não há fluxo automático de separação ou envio após a aprovação financeira.
