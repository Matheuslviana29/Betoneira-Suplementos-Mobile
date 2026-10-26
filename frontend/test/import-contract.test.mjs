import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = resolve(testDirectory, '..', 'src', 'app');
const sourceExtensions = ['.js', '.mjs', '.jsx', '.json'];

function importsFrom(source) {
  return [...source.matchAll(/(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"](\.{1,2}\/[^'"]+)['"]/g)]
    .map((match) => match[1]);
}

function resolvesImport(fromFile, specifier) {
  const target = resolve(dirname(fromFile), specifier);
  const candidates = extname(target)
    ? [target]
    : sourceExtensions.flatMap((extension) => [target + extension, join(target, `index${extension}`)]);
  return candidates.some(existsSync);
}

test('UNIT-005: todos os imports relativos das rotas atuais resolvem', () => {
  const brokenImports = [];
  for (const file of readdirSync(appDirectory).filter((name) => name.endsWith('.js'))) {
    const filePath = join(appDirectory, file);
    for (const specifier of importsFrom(readFileSync(filePath, 'utf8'))) {
      if (!resolvesImport(filePath, specifier)) brokenImports.push(`${file} -> ${specifier}`);
    }
  }
  assert.deepEqual(brokenImports, []);
});
