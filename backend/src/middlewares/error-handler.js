import { SqliteError } from 'better-sqlite3';
import { AppError } from '../errors/app-error.js';

export function notFoundHandler(request, response) {
  response.status(404).json({
    erro: {
      codigo: 'ROTA_NAO_ENCONTRADA',
      mensagem: 'Rota não encontrada.',
    },
  });
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      erro: {
        codigo: error.code,
        mensagem: error.message,
        ...(error.details ? { detalhes: error.details } : {}),
      },
    });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    response.status(400).json({
      erro: { codigo: 'JSON_INVALIDO', mensagem: 'O corpo JSON é inválido.' },
    });
    return;
  }

  if (error instanceof SqliteError && error.code.startsWith('SQLITE_CONSTRAINT')) {
    response.status(409).json({
      erro: { codigo: 'CONFLITO_DE_DADOS', mensagem: 'Os dados informados já existem.' },
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    erro: { codigo: 'ERRO_INTERNO', mensagem: 'Erro interno do servidor.' },
  });
}
