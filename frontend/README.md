# Frontend — Betoneira Suplementos

Aplicativo Expo SDK 57, React Native e Expo Router.

## Instalar

Use obrigatoriamente Node.js **22.18.0**. O backend deve ser instalado e iniciado primeiro.

```powershell
cd frontend
npm.cmd ci
```

Cada pasta do repositório é um projeto separado; este frontend possui seu próprio `package.json`.
Para testar o Checkout Pro, configure antes `MERCADO_PAGO_ACCESS_TOKEN` somente em
`backend/.env`, usando uma credencial de teste obtida em **Mercado Pago Developers → Integrações
→ sua aplicação Checkout Pro → Credenciais de teste**. Nunca coloque o token no frontend,
GitHub, logs ou mensagens e nunca o compartilhe.

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

No checkout, o botão **Pagar com Mercado Pago** solicita ao backend uma preferência, navega para
`/pedidos` e abre o `init_point` com `Linking.openURL`. Ao voltar do navegador ou aplicativo
externo, a tela de pedidos já está selecionada. O método de pagamento é escolhido no ambiente
hospedado do Mercado Pago; nenhum Access Token, número de cartão ou CVV passa pelo aplicativo.

Ao iniciar o pagamento, o backend cria o pedido com status financeiro `aguardando_pagamento`.
Nesta demonstração, o retorno do navegador não confirma nem altera o pagamento. A tela mostra
**Pagamento iniciado — aguardando confirmação no Mercado Pago** e **Atualizar pedidos** apenas
recarrega os dados locais. O webhook permanece no código como melhoria futura.

Para o smoke manual, crie uma conta/aplicação Checkout Pro, configure o Access Token de teste no
backend, inicie backend e frontend, adicione produtos e endereço e pressione **PAGAR COM MERCADO
PAGO**. Use um comprador ou cartão de teste oficial, volte ao app, encontre o pedido em
`/pedidos` e pressione **Atualizar pedidos** para recarregar a lista local.

## Limitações

- recuperação de senha simulada;
- cancelamento de pedido ainda sem interface;
- smoke test de iOS ainda não realizado.
- não há confirmação automática ou manual; estoque e carrinho não são alterados;
- não há fluxo automático de separação ou envio após a aprovação financeira.
