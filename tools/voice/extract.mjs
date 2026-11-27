#!/usr/bin/env node
/* Relève toutes les phrases que la voix de Mini Mission dit en français, et écrit le tableau :
     tools/voice/phrases.csv   (à ouvrir dans un tableur : code, personnage, phrase, vitesse, pauses, enthousiasme, style…)
   Les phrases sont lues directement dans les fichiers du jeu (i18n.js, story.js, rose-worlds.js, app.js, rose-engine.js…),
   donc il suffit de relancer ce script après avoir changé un texte.
   Les réglages de ton que vous avez modifiés à la main dans phrases.csv (vitesse, pauses, enthousiasme, style, personnage)
   sont conservés d'une fois sur l'autre pour le même code.
   Usage : node tools/voice/extract.mjs */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- 1. charger les données du jeu comme le ferait le navigateur ---------- */
const store = {};
const ctx = {
  console, Intl, Math, JSON, Promise, setTimeout: () => 0, clearTimeout() {},
  localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
  navigator: { language: 'fr-FR', languages: ['fr-FR'] },
  location: { search: '', hash: '' },
  document: { readyState: 'complete', querySelectorAll: () => [], querySelector: () => null, addEventListener() {}, createElement: () => ({ style: {} }), head: { appendChild() {} }, documentElement: {} },
  fetch: () => Promise.reject(new Error('hors ligne'))
};
ctx.window = ctx; ctx.self = ctx;
vm.createContext(ctx);
for (const f of ['i18n.js', 'cities.js', 'stickers-cities.js', 'stickers.js', 'story.js', 'rose-worlds.js', 'voice-clips.js']) vm.runInContext(read(f), ctx, { filename: f });
const MM = ctx.MM;
const FR = MM.L10N.fr, UI = FR.ui;
const { key, split } = MM.clips;
const clean = (t) => MM.voice.clean(t);

// morceaux de code qu'on ne peut pas exécuter tels quels (app.js et rose-engine.js ont besoin de la page) : on lit les listes de textes
const grab = (file, start, end) => {
  const src = read(file), i = src.indexOf(start); if (i < 0) throw new Error(`introuvable dans ${file} : ${start}`);
  const j = src.indexOf(end, i + start.length); if (j < 0) throw new Error(`fin introuvable dans ${file} : ${end}`);
  return vm.runInContext('(' + src.slice(i + start.length, j + 1) + ')', ctx);   // garde le « ] » final, pas le « ; »
};
const APP = 'app.js', ENG = 'rose-engine.js';
const praise = grab(APP, 'const praisePhrases = ', '];');
const retry = grab(APP, 'const retryPhrases = ', '];');
const themes = grab(APP, 'const questionThemes = ', '];');
const patterns = grab(APP, 'const questionPatterns = ', '];');
const MON_TOTAL = +/const MON_TOTAL = (\d+)/.exec(read(APP))[1], STORY_MIN = Math.ceil(MON_TOTAL / 2);
const EN = vm.runInContext('(' + (() => { const s = read(ENG), a = s.indexOf('const EN = {') + 'const EN = '.length, b = s.indexOf('...((LX && LX.engine) || {}) };', a); return s.slice(a, b) + '})'; })(), ctx);
const HEROES = ['ziggy', 'filou', 'titan', 'rose'];

// rose-engine.js : la voix parle au joueur ; sans prénom, « Bravo Rose ! » devient « Bravo ! » et « {name} » disparaît
const toKid = (t) => String(t).replace(/([,、，]?\s*)\{name\}/g, '').replace(/(?<!avec)(,)?\s+Rose(\s*!)/g, (m, c, end) => end);
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v && v[k] != null ? v[k] : m));
const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'x';
const dash = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

/* ---------- 2. le ton de chaque sorte de phrase ---------- */
// vitesse : 1 = normale. pauses : aucune | courtes | longues. enthousiasme : de 1 (très calme) à 5 (très joyeux).
const TONES = {
  consigne:  { vitesse: 0.92, pauses: 'courtes', enthousiasme: 3, style: 'clair et souriant, comme une maîtresse de maternelle qui montre le chemin' },
  bravo:     { vitesse: 1.0,  pauses: 'courtes', enthousiasme: 5, style: 'très joyeux et fier de l’enfant, avec un grand sourire dans la voix' },
  encourage: { vitesse: 0.88, pauses: 'courtes', enthousiasme: 2, style: 'doux et rassurant, jamais déçu ni grondeur' },
  calme:     { vitesse: 0.85, pauses: 'longues', enthousiasme: 1, style: 'tout doux et apaisant, presque chuchoté, comme avant la sieste' },
  question:  { vitesse: 0.88, pauses: 'courtes', enthousiasme: 3, style: 'curieux et complice, avec une vraie intonation de question' },
  reponse:   { vitesse: 0.9,  pauses: 'aucune',  enthousiasme: 2, style: 'neutre et bien articulé, comme on lit un choix dans une liste' },
  lettre:    { vitesse: 0.8,  pauses: 'courtes', enthousiasme: 3, style: 'très bien articulé, une petite pause entre la lettre et le mot' },
  compte:    { vitesse: 0.9,  pauses: 'aucune',  enthousiasme: 4, style: 'on compte ensemble, net et joyeux' },
  savoir:    { vitesse: 0.92, pauses: 'courtes', enthousiasme: 3, style: 'émerveillé, comme on partage un secret « le savais-tu »' },
  aventure:  { vitesse: 0.95, pauses: 'courtes', enthousiasme: 4, style: 'plein d’entrain, on part à l’aventure' },
  histoire:  { vitesse: 0.9,  pauses: 'longues', enthousiasme: 3, style: 'conteuse du soir, chaleureuse ; plus vivante dans les dialogues entre guillemets' },
  farceur:   { vitesse: 1.0,  pauses: 'courtes', enthousiasme: 4, style: 'méchant pour rire : farceur, un peu grognon, petit ricanement, jamais effrayant' },
  amis:      { vitesse: 1.05, pauses: 'aucune',  enthousiasme: 5, style: 'petite voix ravie d’être libérée' },
  heros:     { vitesse: 1.05, pauses: 'aucune',  enthousiasme: 5, style: 'cri de super-héros joyeux et bienveillant' },
  nom:       { vitesse: 0.95, pauses: 'aucune',  enthousiasme: 4, style: 'on annonce le héros, content de le voir' }
};

/* ---------- 3. le relevé ---------- */
const rows = [], byKey = new Map();
// code : nom du fichier ; perso : qui parle ; text : ce que dit la voix ; ton : une clé de TONES ; src : d'où vient la phrase
function add(code, perso, text, ton, src, note = '') {
  const t = clean(text); if (!key(t)) return;
  const k = key(t);
  if (byKey.has(k)) { const r = byKey.get(k); if (!r.src.includes(src)) r.src += ' · ' + src; return; }
  if (rows.some((r) => r.code === code)) code += '-' + rows.length;
  const r = { code, personnage: perso, phrase: t, ...TONES[ton], ton, fichier: 'oui', src, note, key: k };
  rows.push(r); byKey.set(k, r);
}
// phrase lue par la voix du navigateur (prénom de l'enfant, ou trop de combinaisons) : une ligne pour mémoire, sans fichier
function browser(code, perso, text, ton, src, note) {
  rows.push({ code, personnage: perso, phrase: clean(text), ...TONES[ton], ton, fichier: 'secours navigateur', src, note, key: '' });
}
// modèle avec des {variables} : un fichier par phrase et par valeur (le jeu assemble les phrases une à une)
function tpl(code, perso, template, ton, src, vars = {}) {
  split(template).forEach((s, i) => {
    const names = [...new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
    const sc = split(template).length > 1 ? `${code}.s${i + 1}` : code;
    if (!names.length) return add(sc, perso, s, ton, src);
    const combos = names.reduce((acc, n) => acc.flatMap((a) => (vars[n] || []).map(([id, val]) => ({ ...a, [n]: [id, val] }))), [{}]);
    for (const c of combos) add(sc + '.' + names.map((n) => c[n][0]).join('.'), perso, fill(s, Object.fromEntries(names.map((n) => [n, c[n][1]]))), ton, src);
  });
}
const nums = (a, b, word = false) => Array.from({ length: b - a + 1 }, (_, i) => [String(a + i), word ? FR.count[a + i] : String(a + i)]);
const G = 'guide', C = 'conteuse', F = 'farfouille', A = 'amis';

// ----- accueil, menus, villes (app.js) -----
const ui = (k, ton, extra) => add('ui.' + dash(k), G, UI[k], ton, 'app.js · ' + k, extra);
add('ui.hello', G, MM.i18n.info().hello, 'bravo', 'app.js · langue choisie');
ui('newVoice', 'bravo');
browser('ui.hello-n', G, UI.helloN, 'bravo', 'app.js · helloN', 'contient le prénom de l’enfant');
for (const k of ['sayChooseChapter', 'sayChooseCity', 'restSay', 'endSayAll']) browser('ui.' + dash(k) + '-n', G, UI[k + 'N'], k === 'restSay' ? 'calme' : k === 'endSayAll' ? 'bravo' : 'consigne', 'app.js · ' + k + 'N', 'contient le prénom de l’enfant');
ui('sayChooseChapter', 'consigne'); ui('sayChooseCity', 'consigne'); ui('sayChoosePlanet', 'aventure');
ui('lockedSay', 'encourage'); ui('spaceLockedSay', 'encourage'); ui('finalLockedSay', 'encourage'); ui('lockedPlanetSay', 'encourage');
tpl('ui.story-more-city', G, UI.storyMoreCity, 'encourage', 'app.js · storyMoreCity', { n: [[String(STORY_MIN), String(STORY_MIN)]] });
const cities = MM.cities.map((c) => [c.id, c.say || c.name]);
tpl('ui.say-choose-hero-city', G, UI.sayChooseHeroCity, 'question', 'app.js · sayChooseHeroCity', { city: cities });
MM.cities.forEach((c) => add('ville.' + c.id, G, c.say, 'aventure', 'cities.js · ' + c.id));
tpl('ui.tier-say', G, UI.tierSay, 'aventure', 'app.js · tierSay', { n: nums(1, 20, true) });
ui('timerNotice', 'calme'); ui('restSay', 'calme'); ui('oops', 'encourage'); ui('endSayAll', 'bravo'); ui('peekAll', 'bravo');
browser('ui.end-say-left', G, UI.endSayLeft, 'encourage', 'app.js · endSayLeft', 'trop de combinaisons (étoiles, lettres, monstres, mini-jeux qui restent)');
tpl('ui.peek-left', G, UI.peekLeft, 'encourage', 'app.js · peekLeft', { parts: Object.keys(FR.plural).flatMap((kind) => Array.from({ length: 30 }, (_, i) => [kind + (i + 1), MM.i18n.plural(kind, i + 1)])) });
ui('count10', 'bravo'); ui('count20', 'bravo');
for (let n = 1; n <= 19; n++) if (n !== 10) add('compte.' + n, G, FR.count[n], 'compte', 'app.js · compter les monstres');
HEROES.forEach((h) => add('nom.' + h, G, cap(h) + ' !', 'nom', 'app.js · toucher un héros'));
// lettres
for (const l of MM.i18n.alphabet()) {
  add('lettre.' + l.toLowerCase(), G, MM.i18n.letterPhrase(l).say, 'lettre', 'i18n.js · letters');
  tpl('ui.forgot', G, UI.forgot, 'encourage', 'app.js · forgot', { l: [[l.toLowerCase(), MM.i18n.letterSay(l)]] });
}
// félicitations et encouragements
praise.forEach((p, i) => add('bravo.' + String(i + 1).padStart(2, '0'), G, p, 'bravo', 'app.js · praisePhrases'));
retry.forEach((p, i) => add('encore.' + String(i + 1).padStart(2, '0'), G, p, 'encourage', 'app.js · retryPhrases'));
// autocollants
const S = MM.stickers, stickers = [];
S.PAGES.forEach((pg, p) => pg.slots.forEach((_, s) => { const inf = S.info(p * S.PER_PAGE + s); stickers.push({ ...inf, id: (p < S.CITY_BASE ? 'p' + p : 'v' + (p - S.CITY_BASE)) + '-' + String(s + 1).padStart(2, '0') }); }));
for (const st of stickers) {
  add('autocollant.' + st.id, G, `${cap(st.n)}. ${st.d || ''}`, 'savoir', 'stickers · fiche de l’autocollant');
  if (st.tier === 'gold') tpl('ui.gold-say', G, UI.goldSay, 'bravo', 'app.js · goldSay', { n: [[st.id, st.n]] });
  if (st.tier === 'silver') tpl('ui.silver-say', G, UI.silverSay, 'bravo', 'app.js · silverSay', { n: [[st.id, st.n]] });
  // « {praise} Un autocollant : {n} ! » : la félicitation est déjà un fichier (bravo.xx), il reste la fin de la phrase
  add('ui.sticker-award.' + st.id, G, fill(UI.stickerAward.replace('{praise}', '').trim(), { n: st.n }), 'bravo', 'app.js · stickerAward');
}
browser('ui.gold-say-n', G, UI.goldSayN || UI.goldSay, 'bravo', 'app.js · goldSayN', 'contient le prénom de l’enfant');
// mini-jeux
add('ui.maze-say', G, fill(UI.mazeSay, { a: '🐭', b: '🧀' }), 'consigne', 'minigames.js · mazeSay', 'les émojis {a} et {b} ne sont pas dits : la voix dit « Aide à trouver ! » (déjà le cas avec la voix du navigateur)');
ui('jigsawSay', 'consigne'); ui('pairsSay', 'consigne'); ui('simonSay', 'consigne');
// énigmes : la question, puis « Choisis une réponse : », puis chaque réponse (le jeu les mélange)
const [, mid] = /\{q\}(.*)\{opts\}/.exec(UI.chooseAnswer);
add('ui.choose-answer', G, mid.trim(), 'question', 'app.js · chooseAnswer');
const Q = FR.quiz, answers = new Set();
const ans = (list) => list.forEach((o) => answers.add(o));
Q.animals.forEach((a) => { add('quiz.cri.' + slug(a[1]), G, fill(Q.t.whoSays, { s: a[2] }), 'question', 'quiz · whoSays'); ans([a[1]]); });
Q.colors.forEach((c) => { add('quiz.couleur.' + slug(c[0]), G, fill(Q.t.whatColor, { c: c[0] }), 'question', 'quiz · whatColor'); ans(c[2].map((x) => x[1])); });
Q.countables.forEach(([, w]) => add('quiz.combien.' + slug(w), G, fill(Q.t.howManySay, { w }), 'question', 'quiz · howManySay'));
ans(Q.numWords.slice(1));
add('quiz.intrus', G, Q.t.oddSay, 'question', 'quiz · oddSay'); Q.groups.forEach((g) => ans(g.map((x) => x[1])));
Q.abilities.forEach(([p, yes, no]) => { add('quiz.qui.' + slug(p), G, p, 'question', 'quiz · abilities'); ans([...yes, ...no].map((x) => x[1])); });
Q.shapes.forEach((s) => { add('quiz.forme.' + slug(s[1]), G, fill(Q.t.whereIs, { x: s[1] }), 'question', 'quiz · whereIs'); ans([s[1]]); });
add('quiz.plus-grand', G, Q.t.biggest, 'question', 'quiz · biggest'); add('quiz.plus-petit', G, Q.t.smallest, 'question', 'quiz · smallest'); ans(Q.sizes.map((x) => x[1]));
Q.eats.forEach((e) => { add('quiz.mange.' + slug(e[1]), G, fill(Q.t.eats, { x: e[1] }), 'question', 'quiz · eats'); ans([e[3]]); });
Q.wears.forEach((w) => { add('quiz.met.' + slug(w[0]), G, w[0], 'question', 'quiz · wears'); ans([w[2]]); }); ans(Q.wearOthers.map((x) => x[1]));
for (let n = 1; n <= 8; n++) add('quiz.apres.' + n, G, fill(Q.t.after, { n: Q.numWords[n] }), 'question', 'quiz · after');
themes.forEach((th, ti) => { ans(th.answers.map((a) => a[1])); th.people.forEach((person, pi) => patterns.forEach((pat, qi) =>
  add(`quiz.aide.${ti + 1}-${pi + 1}-${qi + 1}`, G, cap(pat.replace('{person}', person).replace('{goal}', th.goal)), 'question', 'app.js · questionThemes'))); });
[...answers].forEach((a) => add('reponse.' + slug(a), G, a, 'reponse', 'quiz · réponses'));

// ----- les mondes de Rose (rose-engine.js, rose-worlds.js, rose-final.js) -----
const W = MM.ROSE_WORLDS, worlds = Object.keys(W);
const eng = (k, perso, ton, i) => add('rose.' + dash(k) + (i != null ? '.' + (i + 1) : ''), perso, toKid(i != null ? EN[k][i] : EN[k]), ton, 'rose-engine.js · ' + k);
EN.freed.forEach((_, i) => eng('freed', A, 'amis', i));
EN.boss.forEach((_, i) => eng('boss', F, 'farceur', i));
eng('again', G, 'encourage'); eng('robot', G, 'aventure'); eng('heli', G, 'aventure'); eng('bossStart', G, 'aventure'); eng('bossPop', G, 'bravo');
eng('hintCage', G, 'consigne'); eng('hintAlien', G, 'consigne'); eng('hintGo', G, 'consigne'); eng('party', G, 'bravo'); eng('dipSay', G, 'bravo');
browser('rose.hint-go-n', G, EN.hintGo, 'consigne', 'rose-engine.js · hintGo', 'avec le prénom : voix du navigateur ; sans prénom : fichier rose.hint-go');
browser('rose.party-n', G, EN.partyN, 'bravo', 'rose-engine.js · partyN', 'contient le prénom de l’enfant');
tpl('rose.partial', G, toKid(EN.partial), 'encourage', 'rose-engine.js · partial', { n: nums(1, 19), on: worlds.map((w) => [w, W[w].on]).filter(([, on]) => on) });
tpl('rose.more-story', G, EN.moreStory, 'encourage', 'rose-engine.js · moreStory', { n: nums(1, 20) });
tpl('rose.t-world', G, EN.tWorld, 'consigne', 'rose-engine.js · tWorld', { w: worlds.filter((w) => !W[w].boss).map((w) => [w, W[w].name]) });
tpl('rose.t-world-boss', G, EN.tWorldBoss, 'consigne', 'rose-engine.js · tWorldBoss', { w: worlds.filter((w) => W[w].boss).map((w) => [w, W[w].name]) });
for (const k of ['tStars', 'tLetters', 'tFriends', 'tBubbles']) browser('rose.' + dash(k), G, EN[k], 'consigne', 'rose-engine.js · ' + k, 'compteur « {n} sur {t} » : trop de combinaisons');
// le grand final
const fin = (k, perso, ton, i) => add('final.' + dash(k) + (i != null ? '.' + (i + 1) : ''), perso, toKid(i != null ? EN[k][i] : EN[k]), ton, 'rose-final.js · ' + k);
EN.epD.forEach((_, i) => fin('epD', G, 'aventure', i)); EN.epDone.forEach((_, i) => fin('epDone', G, 'bravo', i));
['ziggy', 'filou', 'titan'].forEach((h, i) => fin('epPow', h, 'heros', i));
fin('epSky', G, 'aventure'); fin('epWave', G, 'aventure'); fin('epFriends', G, 'bravo'); fin('epWall', G, 'consigne'); fin('epReady', G, 'consigne'); fin('epSuper', G, 'bravo');
fin('epShield', G, 'consigne'); fin('epB2', F, 'farceur'); fin('epB2off', G, 'bravo'); fin('epB3', F, 'farceur'); fin('epAll', G, 'consigne'); fin('epAllMore', G, 'bravo');
// chaque monde : arrivée, fin, devinettes
for (const w of worlds) {
  const d = W[w];
  if (d.intro) add('monde.' + w + '.intro', G, toKid(d.intro), 'aventure', 'rose-worlds.js · ' + w);
  if (d.outroAll) add('monde.' + w + '.fin', G, toKid(d.outroAll), 'bravo', 'rose-worlds.js · ' + w);
  if (d.outroAll && /Rose\s*!|\{name\}/.test(d.outroAll)) browser('monde.' + w + '.fin-n', G, d.outroAll, 'bravo', 'rose-worlds.js · ' + w, 'avec le prénom à la place de « Rose » : voix du navigateur');
  (d.riddles || []).forEach((r, i) => {
    const c = `monde.${w}.devinette${i + 1}`;
    add(c + '.q', G, r.q, 'question', 'rose-worlds.js · devinettes');
    r.o.forEach((o, k) => { add(c + '.r' + (k + 1), G, o[1], 'reponse', 'rose-worlds.js · devinettes'); add(c + '.r' + (k + 1) + 'q', G, o[1] + ' ?', 'question', 'rose-worlds.js · devinettes (dernière réponse)'); });
    if (r.fact) add(c + '.fait', G, r.fact, 'savoir', 'rose-worlds.js · devinettes');
  });
}

// ----- les livres d'histoire (story.js) : une page = un fichier -----
for (const id of MM.STORY_ORDER.concat(Object.keys(MM.STORY).filter((k) => !MM.STORY_ORDER.includes(k)))) {
  (MM.STORY[id].pages || []).forEach((p, i) => add(`livre.${dash(id).replace(/_/g, '-')}.p${i + 1}`, C, p.s || p.t, 'histoire', 'story.js · ' + id));
}

/* ---------- 4. garder les réglages faits à la main, puis écrire ---------- */
const CSV = path.join(HERE, 'phrases.csv');
const COLS = ['code', 'personnage', 'phrase', 'vitesse', 'pauses', 'enthousiasme', 'style', 'fichier', 'source', 'note'];
const parseCsv = (txt) => {
  const out = []; let row = [], f = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (q) { if (ch === '"' && txt[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; }
    else if (ch === '"') q = true; else if (ch === ';') { row.push(f); f = ''; } else if (ch === '\n') { row.push(f.replace(/\r$/, '')); out.push(row); row = []; f = ''; } else f += ch;
  }
  if (f || row.length) { row.push(f); out.push(row); }
  return out;
};
if (fs.existsSync(CSV)) {
  const [head, ...lines] = parseCsv(fs.readFileSync(CSV, 'utf8').replace(/^﻿/, ''));
  const old = new Map(lines.map((l) => [l[head.indexOf('code')], Object.fromEntries(head.map((h, i) => [h, l[i]]))]));
  for (const r of rows) { const o = old.get(r.code); if (!o) continue; for (const k of ['personnage', 'vitesse', 'pauses', 'enthousiasme', 'style']) if (o[k] != null && o[k] !== '') r[k] = /vitesse|enthousiasme/.test(k) ? Number(String(o[k]).replace(',', '.')) : o[k]; }
}
const esc = (v) => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const asRow = (r) => ({ ...r, source: r.src, vitesse: String(r.vitesse).replace('.', ',') });
fs.writeFileSync(CSV, '﻿' + [COLS.join(';'), ...rows.map((r) => COLS.map((c) => esc(asRow(r)[c])).join(';'))].join('\n') + '\n');
const n = rows.filter((r) => r.fichier === 'oui').length;
const per = rows.reduce((a, r) => ((a[r.personnage] = (a[r.personnage] || 0) + 1), a), {});
console.log(`${rows.length} lignes : ${n} phrases à enregistrer, ${rows.length - n} laissées à la voix du navigateur.`);
console.log('Par personnage :', per);
console.log('Caractères à synthétiser :', rows.filter((r) => r.fichier === 'oui').reduce((t, r) => t + r.phrase.length, 0));
