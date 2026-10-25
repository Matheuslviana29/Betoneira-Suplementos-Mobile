import { createApp } from './app.js';
import { env } from './config/env.js';
import { database } from './database/index.js';

const app = createApp({ database });

const server = app.listen(env.port, (error) => {
  if (error) throw error;
  console.log(`API disponível em http://localhost:${env.port}`);
});

function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando a API...`);
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

