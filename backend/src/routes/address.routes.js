import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { addressSchema, idParamsSchema, updateAddressSchema } from '../validators/schemas.js';

export function createAddressRouter(controller) {
  const router = Router();

  router.get('/', controller.list);
  router.post('/', validate({ body: addressSchema }), controller.create);
  router.patch(
    '/:id',
    validate({ params: idParamsSchema, body: updateAddressSchema }),
    controller.update,
  );
  router.delete('/:id', validate({ params: idParamsSchema }), controller.delete);

  return router;
}
