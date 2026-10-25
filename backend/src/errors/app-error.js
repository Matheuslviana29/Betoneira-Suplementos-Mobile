export class AppError extends Error {
  constructor(message, { statusCode = 400, code = 'ERRO_APLICACAO', details } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
