// Copia el código Python del ajedrez al portafolio para poder jugarlo en el navegador.
// Uso: npm run sync:ajedrez   (con el repo Programacio clonado al lado)
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve(process.argv[2] ?? '../Programacio/Projecte Escacs/QuimPerez_Escacs.py');
const target = resolve('public/ajedrez/QuimPerez_Escacs.py');

if (!existsSync(source)) {
  console.error(`No encuentro ${source}`);
  process.exit(1);
}

mkdirSync(resolve('public/ajedrez'), { recursive: true });
copyFileSync(source, target);
console.log('Copiado QuimPerez_Escacs.py a public/ajedrez');
