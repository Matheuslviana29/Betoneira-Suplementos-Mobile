import { AppError } from '../errors/app-error.js';

export function createAuthenticationMiddleware(authService) {
  return (request, response, next) => {
    const authorization = request.get('authorization');
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      next(
        new AppError('Autenticação necessária.', {
          statusCode: 401,
          code: 'NAO_AUTENTICADO',
        }),
      );
      return;
    }

    const session = authService.authenticate(token);
    request.auth = session;
    next();
  };
}
