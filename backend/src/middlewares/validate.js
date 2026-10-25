import { AppError } from '../errors/app-error.js';

export function validate(schemas) {
  return (request, response, next) => {
    const validated = {};
    const errors = [];

    for (const [location, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(request[location]);

      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            campo: [location, ...issue.path].join('.'),
            mensagem: issue.message,
          })),
        );
      } else {
        validated[location] = result.data;
      }
    }

    if (errors.length > 0) {
      next(
        new AppError('Dados inválidos.', {
          statusCode: 422,
          code: 'DADOS_INVALIDOS',
          details: errors,
        }),
      );
      return;
    }

    request.validated = { ...request.validated, ...validated };
    next();
  };
}
