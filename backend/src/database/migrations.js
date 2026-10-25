import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIGRATIONS_DIRECTORY = fileURLToPath(new URL('./migrations', import.meta.url));

export function runMigrations(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_arquivo TEXT NOT NULL UNIQUE,
      executada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
  `);

  const appliedMigrations = new Set(
    database
      .prepare('SELECT nome_arquivo FROM schema_migrations')
      .all()
      .map(({ nome_arquivo: fileName }) => fileName),
  );

  const migrationFiles = readdirSync(MIGRATIONS_DIRECTORY)
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort();

  const applyMigration = database.transaction((fileName) => {
    const sql = readFileSync(path.join(MIGRATIONS_DIRECTORY, fileName), 'utf8');

    database.exec(sql);
    database
      .prepare('INSERT INTO schema_migrations (nome_arquivo) VALUES (?)')
      .run(fileName);
  });

  for (const fileName of migrationFiles) {
    if (!appliedMigrations.has(fileName)) {
      applyMigration(fileName);
    }
  }
}
