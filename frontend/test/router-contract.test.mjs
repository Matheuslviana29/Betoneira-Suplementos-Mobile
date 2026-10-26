import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const frontendDirectory = join(testDirectory, '..');
const appDirectory = join(frontendDirectory, 'src', 'app');
const read = (...parts) => readFileSync(join(frontendDirectory, ...parts), 'utf8');

const routeManifest = [
  ['/', 'index.js'],
  ['/login', 'login.js'],
  ['/criar-conta', 'criar-conta.js'],
  ['/esqueci-senha', 'esqueci-senha.js'],
  ['/home', 'home.js'],
  ['/produtos', 'produtos.js'],
  ['/carrinho', 'carrinho.js'],
  ['/checkout', 'checkout.js'],
  ['/perfil', 'perfil.js'],
  ['/meus-dados', 'meus-dados.js'],
  ['/alterar-senha', 'alterar-senha.js'],
  ['/favoritos', 'favoritos.js'],
  ['/pedidos', 'pedidos.js'],
  ['/endereco-entrega', 'endereco-entrega.js'],
  ['/novo-endereco', 'novo-endereco.js'],
  ['/forma-pagamento', 'forma-pagamento.js'],
  ['/nova-forma-pagamento', 'nova-forma-pagamento.js'],
  ['/_layout', '_layout.js'],
];

test('UNIT-001: preserva o manifesto de 18 rotas do Expo Router', () => {
  assert.deepEqual(
    readdirSync(appDirectory).filter((file) => file.endsWith('.js')).sort(),
    routeManifest.map(([, file]) => file).sort(),
  );
  for (const [, file] of routeManifest) assert.ok(existsSync(join(appDirectory, file)), file);
});

test('UNIT-001: mantém plugin, typed routes, scheme e web do Expo Router', () => {
  const appConfig = JSON.parse(read('app.json')).expo;
  assert.equal(appConfig.scheme, 'betoneira-suplementos');
  assert.deepEqual(appConfig.plugins, ['expo-router', 'expo-font', 'expo-secure-store']);
  assert.equal(appConfig.experiments.typedRoutes, true);
  assert.equal(appConfig.web.bundler, 'metro');
});

test('UNIT-002: mantém o redirect inicial e o guardião de rotas', () => {
  const indexRoute = read('src', 'app', 'index.js');
  const layout = read('src', 'app', '_layout.js');
  assert.match(indexRoute, /<Redirect href=\{autenticado \? '\/home' : '\/login'\} \/>/);
  assert.match(layout, /\['login', 'criar-conta', 'esqueci-senha'\]/);
  assert.match(layout, /!autenticado && !publica\) roteador\.replace\('\/login'\)/);
  assert.match(layout, /autenticado && publica\) roteador\.replace\('\/home'\)/);
});

test('UNIT-003: mantém API, sessão, tema e contexto nos caminhos atuais', () => {
  for (const file of [
    'src/services/api.js',
    'src/services/api-url.mjs',
    'src/services/sessao.js',
    'src/constants/tema.js',
    'src/contextos/AutenticacaoContext.js',
  ]) {
    assert.ok(existsSync(join(frontendDirectory, file)), file);
  }
});

test('A11Y-001: preserva tabs, rótulos e estado selecionado da navegação inferior', () => {
  const navigation = read('src', 'components', 'BarraNavegacaoInferior.js');
  for (const [path, label] of [
    ['/home', 'Início'],
    ['/produtos', 'Produtos'],
    ['/carrinho', 'Carrinho'],
    ['/perfil', 'Perfil'],
  ]) {
    assert.match(navigation, new RegExp(`destino: '${path.replace('/', '\\/')}'`));
    assert.match(navigation, new RegExp(`rotulo: '${label}'`));
  }
  assert.match(navigation, /accessibilityRole="tablist"/);
  assert.match(navigation, /accessibilityRole="tab"/);
  assert.match(navigation, /accessibilityLabel=\{item\.rotulo\}/);
  assert.match(navigation, /accessibilityState=\{\{ selected: estaAtivo \}\}/);
});
