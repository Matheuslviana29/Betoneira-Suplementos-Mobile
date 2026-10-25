import { env } from '../config/env.js';
import { createDatabase } from './connection.js';
import { runMigrations } from './migrations.js';
import { seedCatalog } from './seeds/catalog.js';

const database = createDatabase(env.databasePath);

try {
  runMigrations(database);
  seedCatalog(database);
  console.log(`Catálogo inicial gravado em ${env.databasePath}`);
} finally {
  database.close();
}
