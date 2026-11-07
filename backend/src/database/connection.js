import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

function addTransactionSupport(database) {
  database.transaction = (callback) => (...args) => {
    database.exec('BEGIN');

    try {
      const result = callback(...args);
      database.exec('COMMIT');
      return result;
    } catch (error) {
      if (database.isTransaction) database.exec('ROLLBACK');
      throw error;
    }
  };
}

export function createDatabase(databasePath) {
  if (databasePath !== ':memory:') {
    mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const database = new DatabaseSync(databasePath, {
    allowBareNamedParameters: true,
    allowUnknownNamedParameters: true,
    enableForeignKeyConstraints: true,
    readBigInts: false,
    timeout: 5000,
  });

  if (databasePath !== ':memory:') {
    database.exec('PRAGMA journal_mode = WAL');
  }

  addTransactionSupport(database);
  return database;
}
