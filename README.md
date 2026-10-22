# Betoneira Suplementos

Repositório do aplicativo Betoneira Suplementos, organizado em dois projetos independentes para evitar conflitos entre as dependências do aplicativo e da API.

## Estrutura

```text
.
├── frontend/  # Aplicativo React Native com Expo
└── backend/   # API HTTP com Node.js e Express
```

Cada projeto possui seu próprio `package.json`, `package-lock.json` e `node_modules`. Execute os comandos sempre dentro da pasta correspondente.

## Executar o frontend

```bash
cd frontend
npm install
npm start
```

Consulte [frontend/README.md](frontend/README.md) para mais detalhes sobre o aplicativo.

## Executar o backend

```bash
cd backend
npm install
npm run dev
```

A API estará disponível, por padrão, em `http://localhost:3333`. Consulte [backend/README.md](backend/README.md) para os endpoints e a estrutura inicial.
