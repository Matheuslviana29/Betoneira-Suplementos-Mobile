import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { idParamsSchema, orderSchema } from '../validators/schemas.js';

export function createOrderRouter(controller) {
  const router = Router();

  router.get('/', controller.list);
  router.get('/:id', validate({ params: idParamsSchema }), controller.get);
  router.post('/', validate({ body: orderSchema }), controller.create);
  router.patch(
    '/:id/cancelamento',
    validate({ params: idParamsSchema }),
    controller.cancel,
  );

  return router;
}
