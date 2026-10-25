import { mkdirSync } from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

export function createDatabase(databasePath) {
  if (databasePath !== ':memory:') {
    mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const database = new Database(databasePath);

  database.pragma('foreign_keys = ON');
  database.pragma('busy_timeout = 5000');

  if (databasePath !== ':memory:') {
    database.pragma('journal_mode = WAL');
  }

  return database;
}
