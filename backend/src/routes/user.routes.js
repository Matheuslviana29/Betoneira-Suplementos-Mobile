import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { changePasswordSchema, updateUserSchema } from '../validators/schemas.js';

export function createUserRouter(controller) {
  const router = Router();

  router.get('/me', controller.getProfile);
  router.patch('/me', validate({ body: updateUserSchema }), controller.updateProfile);
  router.patch(
    '/me/senha',
    validate({ body: changePasswordSchema }),
    controller.changePassword,
  );

  return router;
}
