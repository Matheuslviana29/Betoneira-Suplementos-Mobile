# Betoneira Suplementos

Aplicativo de loja de suplementos com frontend React Native/Expo e API REST Node.js/Express com SQLite.

## Requisitos

- Node.js 22.13 ou superior;
- npm;
- Android Studio/Android Emulator para Android, Xcode para iOS em macOS ou um navegador para web.

## Estrutura

```text
.
├── frontend/  # Expo SDK 57, React Native e Expo Router
└── backend/   # API REST, Express e SQLite
```

Cada projeto possui seu próprio `package.json`, `package-lock.json` e `node_modules`. Execute os comandos dentro da pasta correspondente.

No frontend, `frontend/src/app/` contém adaptadores finos de rota do Expo Router. As telas ficam organizadas por funcionalidade em `frontend/src/features/`, atualmente nas áreas de autenticação, catálogo, carrinho, checkout, perfil e pedidos.

## Instalação e configuração

Instale as dependências separadamente:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Use os arquivos de exemplo como referência para a configuração local:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

No Windows, copie os arquivos pelo Explorador ou use `Copy-Item` no PowerShell. O frontend normalmente deriva o host da API a partir do Metro; `EXPO_PUBLIC_API_URL` só precisa ser definido quando a API usa outro host. Ajuste `CORS_ORIGINS` no backend para origens web adicionais.

Nunca versione arquivos `.env`, bancos SQLite gerados em `backend/data/` ou artefatos locais em `.planning/`.

## Execução

Em um terminal, prepare e inicie o backend:

```bash
cd backend
npm run db:seed
npm run dev
```

A API fica disponível por padrão em `http://localhost:3333`.

Em outro terminal, inicie o frontend:

```bash
cd frontend
npm start
```

Também é possível abrir uma plataforma diretamente:

```bash
npm run android
npm run ios
npm run web
```

O comando de iOS requer macOS/Xcode. Para dispositivo físico, mantenha o aparelho e o computador na mesma rede.

## Funcionalidades atuais

- cadastro, login, logout e sessão persistida;
- catálogo com busca, categorias, destaques e paginação;
- favoritos;
- carrinho com inclusão, quantidade e remoção de itens;
- perfil, dados pessoais e alteração de senha;
- cadastro e remoção de endereços e formas de pagamento;
- checkout e criação de pedidos;
- histórico e detalhes de pedidos.

## Limitações conhecidas

- a recuperação de senha é simulada;
- o backend suporta cancelamento de pedido quando permitido, mas ainda não existe interface no frontend;
- a seleção explícita de endereço e forma de pagamento no checkout está pendente.

## Testes e verificações

```bash
cd frontend
npm test
node --test test/router-contract.test.mjs
node --test test/import-contract.test.mjs

cd ../backend
npm test
```

Estado verificado:

- frontend: 14/14;
- backend: 8/8;
- contrato das rotas: 5/5;
- resolução de imports: 1/1.

Consulte [frontend/README.md](frontend/README.md) e [backend/README.md](backend/README.md) para detalhes de cada projeto.
