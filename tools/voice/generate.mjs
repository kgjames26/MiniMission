#!/usr/bin/env node
/* Fabrique un fichier audio par phrase du tableau tools/voice/phrases.csv, avec Google Cloud Text-to-Speech :
     voice/fr/<code>.mp3      les voix
     voice/fr/index.json      ce que lit le jeu : phrase (normalisée) → code. Seuls les fichiers présents y sont :
                              une phrase sans fichier reste dite par la voix du navigateur.
   Seules les phrases nouvelles ou modifiées (texte, voix ou ton) sont refaites : on peut relancer le script sans frais.

   Accès à Google Cloud (une des deux façons) :
     - gcloud auth application-default login   (ou gcloud auth login), et un projet avec l'API Text-to-Speech activée ;
       le script demande lui-même le jeton à gcloud. Projet : variable GOOGLE_CLOUD_PROJECT, sinon celui de gcloud.
     - ou une clé d'API : GOOGLE_API_KEY=… (clé limitée à l'API Cloud Text-to-Speech).

   Exemples :
     node tools/voice/generate.mjs --dry-run                  ce qui serait fait, sans rien appeler
     node tools/voice/generate.mjs --only bravo.,nom. --limit 5   un petit essai
     node tools/voice/generate.mjs                            tout ce qui manque
     node tools/voice/generate.mjs --audition guide Laomedeia,Leda,Aoede   la même phrase avec plusieurs voix (voice/_essais/)
   Options : --engine gemini|chirp (gemini par défaut : le ton est joué d'après la consigne ; chirp : vitesse et pauses seulement)
             --model gemini-2.5-flash-tts|gemini-2.5-pro-tts   --force (tout refaire)   --prune (effacer les fichiers qui ne servent plus)
             --concurrency 4   --phrase "texte pour --audition" */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const LANG = 'fr';
const OUT = path.join(ROOT, 'voice', LANG);
const DONE = path.join(HERE, `.generated-${LANG}.json`);   // empreinte de chaque fichier fait (texte + voix + ton)

/* ---------- options ---------- */
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i < 0 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const ENGINE = opt('engine', 'gemini'), MODEL = opt('model', 'gemini-2.5-flash-tts');
const DRY = !!opt('dry-run', false), FORCE = !!opt('force', false), PRUNE = !!opt('prune', false);
const ONLY = opt('only', '') ? String(opt('only')).split(',').filter(Boolean) : null;
const LIMIT = +opt('limit', 0) || Infinity, CONC = Math.max(1, +opt('concurrency', 4) || 4);
if (!['gemini', 'chirp'].includes(ENGINE)) { console.error('--engine gemini ou chirp'); process.exit(1); }

/* ---------- la même normalisation que le jeu (voice-clips.js) ---------- */
const ctx = { console, Intl, localStorage: { getItem: () => null, setItem() {} }, navigator: { language: 'fr' }, document: { readyState: 'complete', addEventListener() {}, querySelectorAll: () => [], head: { appendChild() {} }, createElement: () => ({}) }, setTimeout: () => 0, fetch: () => Promise.reject(new Error('x')) };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['i18n.js', 'voice-clips.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx);
const { key } = ctx.MM.clips;

/* ---------- le tableau ---------- */
function parseCsv(txt) {
  const out = []; let row = [], f = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (q) { if (ch === '"' && txt[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; }
    else if (ch === '"') q = true; else if (ch === ';') { row.push(f); f = ''; } else if (ch === '\n') { row.push(f.replace(/\r$/, '')); out.push(row); row = []; f = ''; } else f += ch;
  }
  if (f || row.length) { row.push(f); out.push(row); }
  return out.filter((r) => r.some((c) => c !== ''));
}
const CSV = path.join(HERE, 'phrases.csv');
if (!fs.existsSync(CSV)) { console.error('Lancez d’abord : node tools/voice/extract.mjs'); process.exit(1); }
const [head, ...lines] = parseCsv(fs.readFileSync(CSV, 'utf8').replace(/^﻿/, ''));
const rows = lines.map((l) => Object.fromEntries(head.map((h, i) => [h, l[i] ?? ''])));
const VOICES = JSON.parse(fs.readFileSync(path.join(HERE, 'voices.json'), 'utf8'));
const num = (v, d) => { const n = Number(String(v).replace(',', '.')); return Number.isFinite(n) ? n : d; };
const SAFE = /^[a-z0-9][a-z0-9.\-]*$/;

/* ---------- une requête Google ---------- */
const PACE = (v) => v <= 0.82 ? 'très lentement, en articulant bien' : v <= 0.9 ? 'lentement' : v < 0.98 ? 'un peu lentement' : v <= 1.02 ? 'à un rythme normal' : 'avec entrain, un peu vite';
const PAUSE = { aucune: 'sans pause', courtes: 'avec de petites pauses naturelles entre les phrases', longues: 'en marquant bien les pauses entre les phrases, sans se presser' };
function request(row, voiceName = null) {
  const p = VOICES.personnages[row.personnage] || VOICES.personnages.guide;
  const voix = voiceName || p.voix, vitesse = num(row.vitesse, 1), ent = Math.round(num(row.enthousiasme, 3));
  if (ENGINE === 'gemini') {
    const prompt = `Tu es ${p.role}. Dis le texte en français de France, pour un tout-petit : ${row.style}. Parle ${PACE(vitesse)}, ${PAUSE[row.pauses] || PAUSE.courtes}. Enthousiasme : ${ent} sur 5. Ne dis que le texte, sans rien ajouter.`;
    return { input: { text: row.phrase, prompt }, voice: { languageCode: VOICES.langue, name: voix, modelName: MODEL }, audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000 } };
  }
  const tag = row.pauses === 'longues' ? ' [pause] ' : row.pauses === 'courtes' ? ' [pause short] ' : ' ';
  const markup = ctx.MM.clips.split(row.phrase).join(tag).trim();
  return { input: { markup }, voice: { languageCode: VOICES.langue, name: `${VOICES.langue}-Chirp3-HD-${voix}` }, audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000, speakingRate: vitesse } };
}
const fingerprint = (row) => crypto.createHash('sha1').update(JSON.stringify([ENGINE, ENGINE === 'gemini' ? MODEL : '', request(row)])).digest('hex').slice(0, 16);

let auth = null;
function getAuth() {
  if (auth) return auth;
  if (process.env.GOOGLE_API_KEY) return (auth = { url: '?key=' + encodeURIComponent(process.env.GOOGLE_API_KEY), headers: {} });
  const sh = (c) => { try { return execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } };
  const token = process.env.GOOGLE_ACCESS_TOKEN || sh('gcloud auth application-default print-access-token') || sh('gcloud auth print-access-token');
  if (!token) { console.error('Pas d’accès à Google Cloud : lancez « gcloud auth application-default login » ou donnez GOOGLE_API_KEY.'); process.exit(1); }
  const project = process.env.GOOGLE_CLOUD_PROJECT || sh('gcloud config get-value project');
  return (auth = { url: '', headers: { Authorization: 'Bearer ' + token, ...(project ? { 'x-goog-user-project': project } : {}) } });
}
async function synth(body) {
  const a = getAuth();
  for (let attempt = 1; ; attempt++) {
    const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize' + a.url, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', ...a.headers }, body: JSON.stringify(body) });
    if (res.ok) { const j = await res.json(); return Buffer.from(j.audioContent, 'base64'); }
    const msg = (await res.text()).slice(0, 400);
    if ((res.status === 429 || res.status >= 500) && attempt < 6) { await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt)); continue; }
    throw new Error(`Google a répondu ${res.status} : ${msg}`);
  }
}

/* ---------- essai de plusieurs voix ---------- */
if (opt('audition', false)) {
  const i = argv.indexOf('--audition'), perso = argv[i + 1], list = (argv[i + 2] || '').split(',').filter(Boolean);
  if (!VOICES.personnages[perso] || !list.length) { console.error('Exemple : --audition guide Laomedeia,Leda,Aoede'); process.exit(1); }
  const sample = rows.find((r) => r.personnage === perso && r.fichier === 'oui') || rows[0];
  const row = { ...sample, phrase: typeof opt('phrase') === 'string' ? opt('phrase') : sample.phrase };
  const dir = path.join(ROOT, 'voice', '_essais'); fs.mkdirSync(dir, { recursive: true });
  for (const v of list) {
    const f = path.join(dir, `${perso}-${v}-${ENGINE}.mp3`);
    if (DRY) { console.log('essai', f, JSON.stringify(request(row, v))); continue; }
    fs.writeFileSync(f, await synth(request(row, v))); console.log('✔', path.relative(ROOT, f));
  }
  console.log(`Phrase : « ${row.phrase} ». Choisissez puis changez la voix de « ${perso} » dans tools/voice/voices.json.`);
  process.exit(0);
}

/* ---------- toutes les phrases ---------- */
fs.mkdirSync(OUT, { recursive: true });
const done = fs.existsSync(DONE) ? JSON.parse(fs.readFileSync(DONE, 'utf8')) : {};
const todo = [], bad = [];
for (const r of rows) {
  if (r.fichier !== 'oui') continue;
  if (!SAFE.test(r.code)) { bad.push(r.code); continue; }
  if (ONLY && !ONLY.some((p) => r.code.startsWith(p))) continue;
  const file = path.join(OUT, r.code + '.mp3'), fp = fingerprint(r);
  if (!FORCE && fs.existsSync(file) && done[r.code] === fp) continue;
  todo.push({ r, file, fp });
}
if (bad.length) console.warn('Codes ignorés (lettres minuscules, chiffres, points et tirets seulement) :', bad.join(', '));
const batch = todo.slice(0, LIMIT);
const chars = batch.reduce((t, x) => t + x.r.phrase.length, 0);
console.log(`${batch.length} fichier(s) à faire (${chars} caractères), moteur ${ENGINE}${ENGINE === 'gemini' ? ' / ' + MODEL : ''}.`);
if (DRY) { batch.slice(0, 5).forEach((x) => console.log(' ', x.r.code, JSON.stringify(request(x.r)))); if (batch.length > 5) console.log('  …'); }
else {
  let k = 0, fails = 0;
  const worker = async () => {
    while (k < batch.length) {
      const x = batch[k++];
      try { fs.writeFileSync(x.file, await synth(request(x.r))); done[x.r.code] = x.fp; process.stdout.write(`✔ ${x.r.code}\n`); }
      catch (e) { fails++; console.error(`✘ ${x.r.code} : ${e.message}`); if (/ 40[0-3] /.test(e.message) && fails > 3) { console.error('Arrêt : plusieurs refus de Google.'); k = batch.length; } }
      if (k % 25 === 0) fs.writeFileSync(DONE, JSON.stringify(done, null, 0));
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));
  fs.writeFileSync(DONE, JSON.stringify(done, null, 0));
  if (fails) console.log(`${fails} échec(s) : relancez la même commande, seuls les manquants seront refaits.`);
}

/* ---------- l'index lu par le jeu (seulement les fichiers présents) ---------- */
const wanted = new Set(rows.filter((r) => r.fichier === 'oui').map((r) => r.code));
const clips = {};
for (const r of rows) if (wanted.has(r.code) && fs.existsSync(path.join(OUT, r.code + '.mp3'))) { const k = key(r.phrase); if (k && !clips[k]) clips[k] = r.code; }
if (!DRY) fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ v: 1, lang: LANG, clips }) + '\n');
console.log(`index.json : ${Object.keys(clips).length} phrase(s) enregistrée(s) sur ${wanted.size}.`);
if (PRUNE) for (const f of fs.readdirSync(OUT)) if (f.endsWith('.mp3') && !wanted.has(f.slice(0, -4))) { if (DRY) console.log('à effacer', f); else { fs.unlinkSync(path.join(OUT, f)); delete done[f.slice(0, -4)]; console.log('effacé', f); } }
if (PRUNE && !DRY) fs.writeFileSync(DONE, JSON.stringify(done, null, 0));
