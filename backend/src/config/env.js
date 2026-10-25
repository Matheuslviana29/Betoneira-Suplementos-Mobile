import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PORT = 3333;
const DEFAULT_SESSION_DURATION_DAYS = 7;
const BACKEND_ROOT = fileURLToPath(new URL('../..', import.meta.url));

function readPort(value) {
  if (value === undefined) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('A variável PORT deve ser um número inteiro entre 1 e 65535.');
  }

  return port;
}

function readPositiveInteger(value, fallback, variableName) {
  if (value === undefined) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`A variável ${variableName} deve ser um número inteiro positivo.`);
  }

  return parsedValue;
}

function readNodeEnvironment(value) {
  const environment = value ?? 'development';
  const allowedEnvironments = new Set(['development', 'test', 'production']);

  if (!allowedEnvironments.has(environment)) {
    throw new Error('A variável NODE_ENV deve ser development, test ou production.');
  }

  return environment;
}

function readDatabasePath(value) {
  if (value === ':memory:') {
    return value;
  }

  return path.resolve(BACKEND_ROOT, value ?? './data/database.sqlite');
}

function readCorsOrigins(value) {
  return (value ?? 'http://localhost:8081,http://127.0.0.1:8081')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = Object.freeze({
  corsOrigins: readCorsOrigins(process.env.CORS_ORIGINS),
  databasePath: readDatabasePath(process.env.DATABASE_PATH),
  nodeEnvironment: readNodeEnvironment(process.env.NODE_ENV),
  port: readPort(process.env.PORT),
  sessionDurationDays: readPositiveInteger(
    process.env.SESSION_DURATION_DAYS,
    DEFAULT_SESSION_DURATION_DAYS,
    'SESSION_DURATION_DAYS',
  ),
});

