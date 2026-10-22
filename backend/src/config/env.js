const DEFAULT_PORT = 3333;

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

export const env = Object.freeze({
  port: readPort(process.env.PORT),
});

