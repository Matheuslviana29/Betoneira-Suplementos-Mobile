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

## Limitações

- recuperação de senha simulada;
- cancelamento de pedido ainda sem interface;
- smoke test de iOS ainda não realizado.
