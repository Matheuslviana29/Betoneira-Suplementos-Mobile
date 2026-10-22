import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (request, response) => {
  response.json({ status: 'ok' });
});

