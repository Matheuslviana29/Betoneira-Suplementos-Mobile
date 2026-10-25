import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import {
  cartItemSchema,
  productIdParamsSchema,
  updateCartItemSchema,
} from '../validators/schemas.js';

export function createCartRouter(controller) {
  const router = Router();

  router.get('/', controller.get);
  router.post('/itens', validate({ body: cartItemSchema }), controller.addItem);
  router.patch(
    '/itens/:produtoId',
    validate({ params: productIdParamsSchema, body: updateCartItemSchema }),
    controller.updateItem,
  );
  router.delete(
    '/itens/:produtoId',
    validate({ params: productIdParamsSchema }),
    controller.deleteItem,
  );

  return router;
}
