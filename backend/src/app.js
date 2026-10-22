import express from 'express';

import { apiRouter } from './routes/index.js';

export const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use('/api', apiRouter);

app.use((request, response) => {
  response.status(404).json({ message: 'Rota não encontrada.' });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: 'Erro interno do servidor.' });
});

