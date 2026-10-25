import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registrationSchema } from '../validators/schemas.js';

export function createAuthRouter(controller, authenticate) {
  const router = Router();

  router.post('/cadastro', validate({ body: registrationSchema }), controller.register);
  router.post('/login', validate({ body: loginSchema }), controller.login);
  router.post('/logout', authenticate, controller.logout);

  return router;
}
