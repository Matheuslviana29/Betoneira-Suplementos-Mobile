import { Router } from 'express';

export function createMercadoPagoWebhookRouter(controller) {
  const router = Router();
  router.post('/', controller.webhook);
  return router;
}
