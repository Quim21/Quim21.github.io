// Copia el código Python de "La nau PiaXXII" al portafolio para poder jugarlo en el navegador.
// Uso: npm run sync:piaxxii   (con el repo projecte-Historia-Conversacional clonado al lado)
import { readdirSync, statSync, mkdirSync, copyFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';

const source = resolve(process.argv[2] ?? '../projecte-Historia-Conversacional/src');
const target = resolve('public/piaxxii/game');

if (!existsSync(join(source, 'main.py'))) {
  console.error(`No encuentro main.py en ${source}`);
  process.exit(1);
}

function listPy(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__pycache__' ? [] : listPy(path);
    return name.endsWith('.py') ? [path] : [];
  });
}

rmSync(target, { recursive: true, force: true });
const files = listPy(source).map((path) => {
  const rel = relative(source, path).replaceAll('\\', '/');
  mkdirSync(dirname(join(target, rel)), { recursive: true });
  copyFileSync(path, join(target, rel));
  return rel;
});

writeFileSync(join(target, 'manifest.json'), JSON.stringify(files.sort(), null, 2) + '\n');
console.log(`Copiados ${files.length} archivos a public/piaxxii/game`);
