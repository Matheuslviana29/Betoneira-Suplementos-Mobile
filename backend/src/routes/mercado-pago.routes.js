import { Router } from 'express';

import { validate } from '../middlewares/validate.js';
import { mercadoPagoPreferenceSchema } from '../validators/schemas.js';

export function createMercadoPagoRouter(controller) {
  const router = Router();

  router.post(
    '/preferencia',
    validate({ body: mercadoPagoPreferenceSchema }),
    controller.createPreference,
  );

  return router;
}
