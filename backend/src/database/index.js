import { env } from '../config/env.js';
import { createDatabase } from './connection.js';
import { runMigrations } from './migrations.js';

export const database = createDatabase(env.databasePath);

runMigrations(database);
