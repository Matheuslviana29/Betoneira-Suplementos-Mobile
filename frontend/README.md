# Frontend — Betoneira Suplementos

Aplicativo de loja de suplementos desenvolvido com Expo SDK 57, React Native 0.86 e Expo Router. Consome a API REST do projeto para autenticação, catálogo, favoritos, carrinho, perfil, endereços, formas de pagamento e pedidos.

## Requisitos e instalação

Requer Node.js 22.13 ou superior.

```bash
cd frontend
npm install
```

Use `.env.example` como referência. A configuração é opcional no desenvolvimento porque o aplicativo deriva o host da API a partir do Metro:

```bash
cp .env.example .env
```

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.0.10:3333/api/v1
```

Defina `EXPO_PUBLIC_API_URL` para builds ou quando a API estiver em outro computador ou servidor. Não versione `.env` ou variantes locais.

## Execução

Inicie primeiro o backend em outro terminal. Depois use:

```bash
npm start
```

Ou abra uma plataforma diretamente:

```bash
npm run android
npm run ios
npm run web
```

- Android requer um emulador configurado ou dispositivo compatível.
- iOS requer macOS e Xcode.
- Web abre o aplicativo no navegador.
- Em aparelho físico, celular e computador devem estar na mesma rede.

Se a versão web informar bloqueio de CORS, inclua a origem exibida pelo Expo em `CORS_ORIGINS` no `backend/.env`.

## Arquitetura

- `src/app/`: adaptadores finos de rota; preservam os caminhos públicos do Expo Router e delegam para as telas das funcionalidades.
- `src/features/auth/`: login, criação de conta e recuperação simulada de senha.
- `src/features/catalogo/`: página inicial e catálogo de produtos.
- `src/features/carrinho/`: carrinho de compras.
- `src/features/checkout/`: checkout, endereços e formas de pagamento.
- `src/features/perfil/`: perfil, dados pessoais, senha e favoritos.
- `src/features/pedidos/`: histórico e detalhes de pedidos.
- `src/components/`: componentes compartilhados.
- `src/contextos/`: autenticação e estado compartilhado.
- `src/hooks/`: hooks reutilizáveis.
- `src/services/`: cliente da API e armazenamento seguro da sessão.
- `src/schemas/`: validação de formulários.
- `src/utils/`: adaptação e formatação de dados.

## Funcionalidades

- cadastro, login, logout e sessão persistida;
- busca, categorias, destaques e paginação no catálogo;
- favoritos;
- carrinho com ajuste de quantidade;
- edição dos dados pessoais e alteração de senha;
- cadastro e remoção de endereços e formas de pagamento;
- checkout, criação e consulta de pedidos.

## Limitações conhecidas

- a recuperação de senha é simulada;
- o cancelamento de pedido existe na API, mas ainda não possui interface;
- a seleção explícita do endereço e da forma de pagamento no checkout está pendente.

## Testes

```bash
npm test
node --test test/router-contract.test.mjs
node --test test/import-contract.test.mjs
```

Resultados atuais:

- testes do frontend: 14/14;
- contrato das rotas: 5/5;
- resolução de imports: 1/1.

## Dados locais e segurança

Não versione `.env`, credenciais, tokens, bancos SQLite ou artefatos locais de ferramentas. Formas de pagamento armazenam apenas bandeira, quatro últimos dígitos, validade e token do gateway; número completo e CVV não devem ser persistidos.
