import { env } from '../config/env.js';
import { createDatabase } from './connection.js';
import { runMigrations } from './migrations.js';

const database = createDatabase(env.databasePath);

try {
  runMigrations(database);
  console.log(`Migrações executadas em ${env.databasePath}`);
} finally {
  database.close();
}
