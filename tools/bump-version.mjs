// Incrémente le numéro de version du jeu (version.json) et le nom du cache hors ligne (sw.js).
// Lancé automatiquement à chaque nouveau message de l'utilisateur par le hook UserPromptSubmit (.claude/settings.json).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'version.json');
let data = { version: '0.0', build: 0 };
try { data = JSON.parse(readFileSync(file, 'utf8')); } catch {}
data.build = (Number(data.build) || 0) + 1;
data.version = `0.${data.build}`;
writeFileSync(file, JSON.stringify(data) + '\n');

try {
  const swFile = join(root, 'sw.js');
  const sw = readFileSync(swFile, 'utf8');
  writeFileSync(swFile, sw.replace(/const CACHE_NAME = '[^']*';/, `const CACHE_NAME = 'mini-mission-v${data.build}';`));
} catch {}
