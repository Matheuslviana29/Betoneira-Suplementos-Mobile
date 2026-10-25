import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { productParamsSchema, productQuerySchema } from '../validators/schemas.js';

export function createCatalogRouter(controller) {
  const router = Router();

  router.get('/categorias', controller.listCategories);
  router.get('/produtos', validate({ query: productQuerySchema }), controller.listProducts);
  router.get(
    '/produtos/:identificador',
    validate({ params: productParamsSchema }),
    controller.getProduct,
  );

  return router;
}
