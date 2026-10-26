import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const screenPath = fileURLToPath(
  new URL('../src/features/perfil/screens/TelaAlterarSenha.js', import.meta.url),
);

test('desestimula autofill nos três campos de senha', async () => {
  const source = await readFile(screenPath, 'utf8');
  for (const label of ['Senha Atual', 'Nova Senha', 'Confirmar Nova Senha']) {
    const field = source.slice(source.indexOf(`rotulo="${label}"`) - 600, source.indexOf(`rotulo="${label}"`) + 600);
    assert.match(field, /autoComplete="off"/);
    assert.match(field, /importantForAutofill="no"/);
    assert.match(field, /textContentType="none"/);
  }
});
