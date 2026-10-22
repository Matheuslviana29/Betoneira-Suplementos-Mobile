# Backend

API HTTP do Betoneira Suplementos, construída com Node.js e Express.

Esta primeira etapa contém somente a base da aplicação e uma rota de verificação. A persistência será adicionada em uma etapa posterior; o diretório `src/database/` já reserva o local da configuração e das migrações do SQLite.

## Requisitos

- Node.js 22.13 ou superior
- npm

## Instalação e execução

```bash
npm install
npm run dev
```

Para executar sem o modo de recarregamento automático:

```bash
npm start
```

É possível alterar a porta copiando `.env.example` para `.env` e editando `PORT`.

## Endpoint inicial

```http
GET /api/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## Estrutura

```text
src/
├── config/    # Leitura e validação das configurações
├── database/  # Futuras conexão, migrações e arquivos do SQLite
├── routes/    # Rotas HTTP da API
├── app.js     # Configuração do Express
└── server.js  # Inicialização do servidor
```

Novas pastas, como `controllers`, `services` e `repositories`, devem ser criadas apenas quando surgirem regras de negócio que precisem delas.

