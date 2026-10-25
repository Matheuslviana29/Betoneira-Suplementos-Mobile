import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { favoriteSchema, productIdParamsSchema } from '../validators/schemas.js';

export function createFavoriteRouter(controller) {
  const router = Router();

  router.get('/', controller.list);
  router.post('/', validate({ body: favoriteSchema }), controller.add);
  router.delete(
    '/:produtoId',
    validate({ params: productIdParamsSchema }),
    controller.delete,
  );

  return router;
}
