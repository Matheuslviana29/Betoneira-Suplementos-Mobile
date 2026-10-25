import { Router } from 'express';

import { createAddressRouter } from './address.routes.js';
import { createAuthRouter } from './auth.routes.js';
import { createCartRouter } from './cart.routes.js';
import { createCatalogRouter } from './catalog.routes.js';
import { createFavoriteRouter } from './favorite.routes.js';
import { healthRouter } from './health.routes.js';
import { createOrderRouter } from './order.routes.js';
import { createPaymentRouter } from './payment.routes.js';
import { createUserRouter } from './user.routes.js';

export function createApiRouter({ controllers, authenticate }) {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/v1', createCatalogRouter(controllers.catalog));
  router.use('/v1/auth', createAuthRouter(controllers.auth, authenticate));
  router.use('/v1/usuarios', authenticate, createUserRouter(controllers.users));
  router.use('/v1/enderecos', authenticate, createAddressRouter(controllers.addresses));
  router.use(
    '/v1/formas-pagamento',
    authenticate,
    createPaymentRouter(controllers.payments),
  );
  router.use('/v1/favoritos', authenticate, createFavoriteRouter(controllers.favorites));
  router.use('/v1/carrinho', authenticate, createCartRouter(controllers.carts));
  router.use('/v1/pedidos', authenticate, createOrderRouter(controllers.orders));

  return router;
}

