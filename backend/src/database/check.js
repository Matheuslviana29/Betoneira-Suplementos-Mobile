import { env } from '../config/env.js';
import { createDatabase } from './connection.js';

const database = createDatabase(env.databasePath);

try {
  const integrity = database.pragma('integrity_check', { simple: true });
  const foreignKeyErrors = database.pragma('foreign_key_check');

  if (integrity !== 'ok' || foreignKeyErrors.length > 0) {
    console.error({ integrity, foreignKeyErrors });
    process.exitCode = 1;
  } else {
    console.log('Banco íntegro e sem violações de chaves estrangeiras.');
  }
} finally {
  database.close();
}
