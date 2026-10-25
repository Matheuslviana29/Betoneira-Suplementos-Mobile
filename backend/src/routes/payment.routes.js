import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { idParamsSchema, paymentMethodSchema } from '../validators/schemas.js';

export function createPaymentRouter(controller) {
  const router = Router();

  router.get('/', controller.list);
  router.post('/', validate({ body: paymentMethodSchema }), controller.create);
  router.delete('/:id', validate({ params: idParamsSchema }), controller.delete);

  return router;
}
