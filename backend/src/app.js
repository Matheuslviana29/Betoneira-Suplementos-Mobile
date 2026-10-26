import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { isCorsOriginAllowed } from './config/cors.js';
import { env } from './config/env.js';
import { createControllers } from './controllers/index.js';
import { AppError } from './errors/app-error.js';
import { createAuthenticationMiddleware } from './middlewares/authenticate.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { createRepositories } from './repositories/index.js';
import { createApiRouter } from './routes/index.js';
import { createServices } from './services/index.js';

export function createApp({
  database,
  corsOrigins = env.corsOrigins,
  nodeEnvironment = env.nodeEnvironment,
  sessionDurationDays = env.sessionDurationDays,
}) {
  const app = express();
  const repositories = createRepositories(database);
  const services = createServices({ database, repositories, sessionDurationDays });
  const controllers = createControllers(services);
  const authenticate = createAuthenticationMiddleware(services.auth);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      origin(origin, callback) {
        const allowed = isCorsOriginAllowed(origin, { allowedOrigins: corsOrigins, nodeEnvironment });
        callback(
          allowed
            ? null
            : new AppError('Origem não permitida pelo CORS.', {
                statusCode: 403,
                code: 'ORIGEM_NAO_PERMITIDA',
              }),
          allowed,
        );
      },
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', createApiRouter({ controllers, authenticate }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

