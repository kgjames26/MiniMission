(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  // ================= le monde choisi (rose-worlds.js) =================
  const WID = (new URLSearchParams(location.search).get('w') || location.hash.slice(1) || 'lune').toLowerCase();
  const WD = (MM.ROSE_WORLDS || {})[WID] || MM.ROSE_WORLDS.lune;
  // ================= langue : textes du monde, devinettes et phrases de la voix (story-xx.js) =================
  const LANG = (MM.i18n && MM.i18n.lang) || 'fr', LX = (MM.STORY_L10N || {})[LANG] || null;
  const TTS = (MM.i18n && MM.i18n.info && MM.i18n.info().tts) || 'fr-FR';
  try { if (MM.i18n && MM.i18n.applyDom) MM.i18n.applyDom(); document.documentElement.lang = LANG; } catch (e) {}
  { const lw = LX && LX.worlds && LX.worlds[WID];
    if (lw) { for (const k of ['name', 'chip', 'on', 'intro', 'outroAll']) if (lw[k]) WD[k] = lw[k];
      (lw.riddles || []).forEach((r, i) => { const R = WD.riddles[i]; if (!R || !r) return; R.q = r[0]; r[1].forEach((o, k) => { if (R.o[k]) R.o[k] = [R.o[k][0], o]; }); R.fact = r[2]; }); } }
  const EN = { freed: ['Libéré !', 'Merci Rose !', 'Youpi !', 'Un ami de plus !'], partial: 'Bravo Rose ! Tu as libéré {n} amis. Les autres attendent encore sur {on} !', again: 'Essaie encore !',
    robot: 'Bip bip ! Le petit robot se réveille !', heli: 'Le petit hélicoptère s’envole avec toi !', bossStart: 'Voilà Capitaine Farfouille dans sa soucoupe ! Envoie-lui des bulles !',
    boss: ['Hé hé ! Tu ne m’attraperas pas !', 'Oh ! Encore une bulle ?', 'Non, non, non !'], bossPop: 'Pop ! Capitaine Farfouille est dans une bulle !', endN: 'Bravo, {name} !', end: 'Bravo !', replay: '↻ Rejouer',
    tStars: 'Étoiles ramassées : {n} sur {t} !', tLetters: 'Lettres trouvées : {n} sur {t} !', tFriends: 'Amis libérés : {n} sur {t} !', tBubbles: 'Farceurs dans une bulle : {n} sur {t} !', tWorld: '{w} : libère tous les amis, puis monte dans la fusée !', tWorldBoss: '{w} : mets les farceurs dans des bulles, puis aide Capitaine Farfouille à devenir gentil !',
    moreStory: 'Libère au moins {n} amis pour lire la suite de l’histoire ! Tu peux revenir quand tu veux.',
    hintGo: 'Par ici, {name} ! Avance tout droit !', hintCage: 'Un ami attend dans la cage ! Envoie-lui une bulle !', hintAlien: 'Envoie des bulles au farceur !',
    partyN: 'Bravo {name} ! Grâce à toi, tout le monde est ami ! C’est la fête !', party: 'Bravo ! Grâce à toi, tout le monde est ami ! C’est la fête !', dipTitle: 'Diplôme de super-héros', dipLine: 'a sauvé la Terre avec Rose, Ziggy, Filou et Titan', dipLineAnon: 'Tu as sauvé la Terre avec Rose, Ziggy, Filou et Titan', dipSay: 'Voici ton diplôme de super-héros !',
    // le grand final (rose-final.js)
    epD: ['Les avenues de Ziggy ! Attrape tous les farceurs, et la rue retrouvera ses couleurs !', 'Les toits de Filou ! Les farceurs sont tout là-haut : vole avec Rose !', 'Le chantier de Titan ! Gros Bidou a besoin de deux bulles !', 'Le voilà ! Capitaine Farfouille dans son vaisseau géant ! Envoie-lui des bulles !'],
    epSky: 'La route est libre ! Vole vers le ciel, Capitaine Farfouille t’attend !', epWave: 'Encore des soucoupes ! Voilà d’autres farceurs !',
    epDone: ['Bravo ! Les avenues ont retrouvé leurs couleurs !', 'Bravo ! Les toits ont retrouvé leurs couleurs !', 'Bravo ! Le chantier a retrouvé ses couleurs !'],
    epFriends: 'Regarde ! Cinq amis arrivent pour aider !', epWall: 'Le nuage de poudre bloque encore la route. Il reste des farceurs : suis la flèche !',
    epReady: 'La super bulle est prête ! Appuie sur le bouton bulle !', epSuper: 'Tous ensemble : super bulle !', epPow: ['Bond lumineux !', 'Fil doux !', 'Force douce !'],
    epShield: 'Boing ! Un bouclier ! Attrape d’abord les farceurs des petites soucoupes !', epB2: 'Aïe aïe aïe ! À moi, mes petites soucoupes ! Bouclier !', epB2off: 'Le bouclier a disparu ! Vas-y, encore des bulles !',
    epB3: 'Grrr… Je suis très, très grognon ! Voilà ma poudre Grognon géante !', epAll: 'Tous ensemble ! Appuie, appuie, appuie sur le bouton bulle pour souffler une bulle géante !', epAllMore: 'Encore ! Tout le monde souffle avec toi !',
    ...((LX && LX.engine) || {}) };
  document.title = 'Mini Mission · Rose · ' + WD.name; $('#wchip').textContent = WD.chip;
  document.querySelector('meta[name=theme-color]').setAttribute('content', WD.theme); document.body.style.background = WD.theme;
  // ================= images =================
  const V = '1';
  const roseImg = new Image(); roseImg.src = 'assets/rose.webp?v=' + V;
  const alienImg = new Image(); alienImg.src = 'assets/aliens.webp?v=' + V;
  const monImg = new Image(); monImg.src = 'assets/monsters.webp?v=' + V;
  const s2Img = new Image(); s2Img.src = 'assets/sprites2.webp?v=' + V; let S2 = null; fetch('assets/sprites2.json?v=' + V).then(r => r.json()).then(j => { S2 = j; });
  const flameImg = new Image(); flameImg.src = 'assets/friend-flame.webp?v=' + V;
  const farfImg = new Image(); if (WD.boss) farfImg.src = 'assets/farfouille.webp?v=' + V;
  const FARF = { joke: { x: 0, w: 325 }, sad: { x: 335, w: 299 }, happy: { x: 644, w: 321 } };   // Capitaine Farfouille (planche de 300 px de haut)
  let RF = null, AF = null;
  fetch('assets/rose.json?v=' + V + 'b').then(r => r.json()).then(j => { RF = j; });
  fetch('assets/aliens.json?v=' + V).then(r => r.json()).then(j => { AF = j; });

  // ================= voix et sons =================
  let voiceOn = 'speechSynthesis' in window, speaking = 0;
  // la voix parle au JOUEUR : « Bravo Rose ! » devient « Bravo Léa ! » (prénom donné par le parent), ou « Bravo ! » sans prénom
  const KID = (() => { try { const s = JSON.parse(localStorage.getItem('mini-mission-v1') || '{}'); return String(s.childNameSay || s.childName || '').trim(); } catch (e) { return ''; } })();
  const toKid = (t) => String(t).replace(/([,、，]?\s*)\{name\}/g, (m, pre) => KID ? pre + KID : '').replace(/(?<!avec)(,)?\s+Rose(\s*!)/g, (m, c, end) => KID ? (c || '') + ' ' + KID + end : end);
  // d'abord les voix enregistrées (voice-clips.js), sinon la synthèse vocale du navigateur ; parts : les morceaux d'une phrase assemblée
  function say(text, important = true, parts = null) {
    if (!voiceOn && !MM.clips) return;
    text = toKid(text);
    if (!important && performance.now() < speaking) return;
    const browser = () => { if (!voiceOn) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); if (MM.voice) MM.voice.tune(u); else { u.lang = TTS; u.pitch = 1.14; u.rate = .96; }
      speechSynthesis.speak(u); } catch {} };
    const clips = MM.clips && MM.clips.plan(parts ? parts.map(toKid) : text);
    try { if (voiceOn) speechSynthesis.cancel(); } catch {}
    if (MM.clips) MM.clips.stop();
    speaking = performance.now() + 1200 + text.length * 70;
    if (clips) MM.clips.play(clips, { onfail: browser }); else browser();
  }
  // les réglages du parent (sons, bruitages, musique) valent aussi dans les mondes de Rose
  const SND = (() => { try { const s = JSON.parse(localStorage.getItem('mini-mission-v1') || '{}'); const on = s.audioEnabled !== false; return { fx: on && s.effectsEnabled !== false, music: on && s.musicEnabled !== false }; } catch (e) { return { fx: true, music: true }; } })();
  let AC = null;
  function tone(f0, f1, dur, type = 'sine', vol = .08, at = 0, isMusic = false) {
    if (!(isMusic ? SND.music : SND.fx)) return;
    try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume();
      const t = AC.currentTime + at, o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur * .9);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + .05); } catch {}
  }
  const sfx = {
    star: () => { tone(1320, 1320, .12, 'sine', .06); tone(1760, 1760, .18, 'sine', .05, .07); },
    letter: () => { tone(660, 990, .18, 'triangle', .07); },
    bubble: () => { tone(500, 1100, .14, 'sine', .06); },
    pop: () => { tone(900, 300, .12, 'triangle', .08); },
    friend: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, f, .2, 'sine', .06, i * .07)); },
    bonk: () => { tone(220, 160, .12, 'triangle', .06); },
    good: () => { [784, 988, 1175].forEach((f, i) => tone(f, f, .25, 'sine', .07, i * .1)); },
    no: () => { tone(330, 260, .2, 'triangle', .05); },
    wind: () => { tone(180, 520, .45, 'sawtooth', .025); tone(240, 700, .5, 'sine', .03, .05); },
    beep: () => { tone(880, 880, .08, 'square', .035); tone(1175, 1175, .1, 'square', .035, .12); tone(1568, 1568, .14, 'square', .03, .26); },
    heli: () => { for (let i = 0; i < 6; i++) tone(140, 120, .05, 'triangle', .04, i * .06); },
  };

  // ================= réglages de Rose (unités : pixels de sa planche, ~210 px du casque aux pieds) =================
  const WALK = 205, WALK_ACC = 900, WALK_DEC = 1400, STEP_PX = 13.2, WALK_START = 4;
  const FLY = 400, DASH_AT = 300, FLY_ACC = 1000, RISE = 330, SINK = 270;
  const FADE = .15, STOP_FADE = .16, RW = 40, RH = 196;   // demi-largeur et hauteur de Rose pour les collisions
  const A = { idle: { n: 10, fps: 6, loop: 'pp' }, hover: { n: 30, fps: 13, loop: 'loop' }, fly: { n: 27, fps: 14, loop: 'loop' }, dash: { n: 30, fps: 15, loop: 'pp' },
              lift: { n: 20, fps: 26, loop: 'once' }, up: { n: 18, fps: 24, loop: 'once' }, down: { n: 20, fps: 26, loop: 'once' }, drop: { n: 20, fps: 28, loop: 'once', src: 'lift', rev: true },
              win: { n: 30, fps: 13, loop: 'once' }, walk: { n: 30, loop: 'loop' } };
  function sample(name, pos) {
    const a = A[name], n = a.n, src = 'rose_' + (a.src || name); let q;
    if (a.loop === 'loop') q = ((pos % n) + n) % n;
    else if (a.loop === 'pp') { const P = 2 * n - 2, p = ((pos % P) + P) % P; q = p < n - 1 ? p : P - p; }
    else q = Math.max(0, Math.min(n - 1, pos));
    let i = Math.floor(q), j = a.loop === 'loop' ? (i + 1) % n : Math.min(n - 1, i + 1); const mix = q - i;
    if (a.rev) { i = n - 1 - i; j = n - 1 - j; }
    return { k: src + i, k2: src + j, mix };
  }
  const topOf = (k) => RF[k].top;
  // En vol, les trois animations se mélangent selon la vitesse ; chacune s'incline vers l'angle de la suivante
  // (inclinaison mesurée dans les GIF : stationnaire ≈ 8°, vol lent ≈ 11°, vol rapide ≈ 32° vers l'avant), avec un léger penché en plus quand ça va vite.
  const AIR = ['hover', 'fly', 'dash'], AIR_V = [0, 170, 370], AIR_A = [-7, -10, -30], PIVOT = 105;
  // angle mesuré (négatif = penchée en avant) → rotation à l'écran : pencher plus en avant = tourner dans le sens de la marche
  const rot = (dAng) => -dAng * rose.face * Math.PI / 180;

  // ================= le niveau (données du monde) =================
  const L = WD.L, CAVE0 = WD.cave ? WD.cave[0] : -1e9, CAVE1 = WD.cave ? WD.cave[1] : -1e9, CEIL = WD.ceil || 99999;
  const solids = WD.solids.map(s => ({ ...s, h: s.h === 'ceil' ? CEIL - s.y : s.h }));
  if (WD.cave) solids.push({ x: CAVE0, y: CEIL, w: CAVE1 - CAVE0, h: 3000, kind: WD.ceilKind || 'ceil' });
  // courants qui soulèvent Rose tout doucement (tourbillons de poussière, jets de vapeur…) : un petit ascenseur, jamais un danger
  const devils = (WD.lifts || []).map((x, i) => ({ x, t: i * 1.7, inside: false }));
  const DEVIL_W = 70, DEVIL_TOP = 430;
  // compagnons à réveiller (Mars : le petit robot et l'hélicoptère)
  const rover = { x: WD.rover != null ? WD.rover : -1e9, awake: false, face: 1, t: 0, wheel: 0 };
  const heli = { x: WD.heli != null ? WD.heli : -1e9, y: 0, vx: 0, vy: 0, awake: false, t: 0, face: 1 };
  // ---- formes : chaque solide a un vrai contour (polygone, y vers le haut) qui sert À LA FOIS au dessin et aux collisions.
  // Rose ne peut donc jamais se tenir sur un bout de rocher qui n'est pas dessiné ; les futurs mondes pourront avoir
  // des arches, des surplombs, des pentes… (on lit le contour colonne par colonne).
  const FOOT = 12, STEP = 10;
  function shapeOf(s) {
    const P = [], x0 = s.x, x1 = s.x + s.w, top = s.y + s.h;
    if (s.kind === 'mesa') {                                // plateau : flancs raides, dessus plat
      P.push([x0, s.y - 30], [x0 + 8, s.y], [x0 + 52, top - 14], [x0 + 80, top], [x1 - 80, top], [x1 - 52, top - 14], [x1 - 8, s.y], [x1, s.y - 30]);
    } else if (s.kind === 'arch') {                         // arche (vue de face, un peu en retrait) : on passe dessous, on marche dessus
      const lw = 120, rx = (s.w - 2 * lw) / 2, ry = Math.min(rx, 90), cx = x0 + s.w / 2, oy = s.oh - ry;
      P.push([x0, s.y - 30], [x0 + 8, s.y], [x0 + 24, top - 34], [x0 + 64, top], [x1 - 64, top], [x1 - 24, top - 34], [x1 - 8, s.y], [x1, s.y - 30], [x1 - lw, s.y - 30], [x1 - lw, oy]);
      for (let i = 1; i < 16; i++) { const a = i / 16 * Math.PI; P.push([cx + Math.cos(a) * rx, oy + Math.sin(a) * ry]); }
      P.push([x0 + lw, oy], [x0 + lw, s.y - 30]);
    } else if (s.kind === 'ramp') {                         // toboggan : pente douce d'un côté, bord arrondi de l'autre
      const d = s.dir || 1, xa = d > 0 ? x0 : x1, xb = d > 0 ? x1 : x0;
      for (let i = 0; i <= 16; i++) { const t = i / 16; P.push([xa + (xb - xa) * t, s.y + s.h * (t * t * (3 - 2 * t))]); }
      P.push([xb + d * 14, s.y + s.h * .6], [xb + d * 8, s.y], [xb + d * 8, s.y - 30], [xa, s.y - 30]);
      if (d < 0) P.reverse();
    } else if (s.kind === 'pancake') {                      // dôme plat (volcan « crêpe » de Vénus) : bords arrondis, dessus large
      const N = 24;
      for (let i = 0; i <= N; i++) { const t = i / N, a = Math.PI + t * Math.PI, c = Math.cos(a), sn = -Math.sin(a), k = Math.pow(sn, .35);
        P.push([x0 + s.w / 2 + c * s.w / 2, s.y + s.h * k]); }
      P.push([x1, s.y - 30], [x0, s.y - 30]);
    } else if (s.kind === 'cloudceil') {                    // plafond de nuages bien gonflés
      P.push([x0, top]);
      for (let x = x0; x <= x1; x += 30) P.push([x, s.y - 26 - Math.abs(Math.sin(x * .012)) * 34]);
      P.push([x1, s.y], [x1, top]);
    } else if (s.kind === 'block') {                        // immeuble (le grand final) : murs droits, toit plat
      P.push([x0, s.y - 30], [x0, top], [x1, top], [x1, s.y - 30]);
    } else if (s.kind === 'rock' || s.kind === 'mite' || s.kind === 'ice') {          // dôme un peu irrégulier
      const N = 28, seed = s.x * .01, cx = x0 + s.w / 2;
      for (let i = 0; i <= N; i++) { const t = i / N, a = Math.PI + t * Math.PI, j = Math.sin(seed + t * 9) * .05;
        P.push([cx + Math.cos(a) * s.w / 2 * (1 + j * Math.sin(t * Math.PI)), s.y - Math.sin(a) * s.h * (1 + Math.cos(seed + t * 7) * .04)]); }
      P.push([x1, s.y - 30], [x0, s.y - 30]);
    } else if (s.kind === 'tite') {                         // stalactite : large en haut, pointe arrondie en bas
      P.push([x0 - 8, CEIL + 40], [x1 + 8, CEIL + 40], [x0 + s.w * .78, s.y - 10]);
      for (let i = 1; i < 10; i++) { const t = i / 10, a = [x0 + s.w * .78, s.y - 10], c = [x0 + s.w * .5, s.y - 30], b = [x0 + s.w * .22, s.y - 10];
        P.push([(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]]); }
      P.push([x0 + s.w * .22, s.y - 10]);
    } else if (s.kind === 'slab') {                         // dalle aux coins arrondis
      const r = 14, b = s.y - 10, arc = (cx, cy, a0) => { for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * Math.PI / 2; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
      arc(x1 - r, top - r, 0); arc(x0 + r, top - r, Math.PI / 2); arc(x0 + r, b + r, Math.PI); arc(x1 - r, b + r, Math.PI * 1.5);
    } else if (s.kind === 'ceil') {                         // plafond de la grotte, avec ses petites dents
      P.push([x0, top]);
      for (let k = 0; k < s.w; k += 90) P.push([x0 + k, s.y], [x0 + k + 20, s.y - (18 + (k % 3) * 8)], [x0 + k + 40, s.y]);
      P.push([x1, s.y], [x1, top]);
    }
    return P;
  }
  for (const q of solids) { q.poly = shapeOf(q); q.minX = Math.min(...q.poly.map(p => p[0])); q.maxX = Math.max(...q.poly.map(p => p[0])); }
  function spansAt(q, x) {                   // les morceaux de matière sur la verticale x : [[bas, haut], …]
    if (x < q.minX || x > q.maxX) return null;
    const ys = [], P = q.poly;
    for (let i = 0, n = P.length; i < n; i++) { const a = P[i], b = P[(i + 1) % n];
      if ((a[0] <= x) !== (b[0] <= x)) ys.push(a[1] + (x - a[0]) / (b[0] - a[0]) * (b[1] - a[1])); }
    if (ys.length < 2) return null; ys.sort((m, n) => m - n);
    const out = []; for (let i = 0; i + 1 < ys.length; i += 2) out.push([ys[i], ys[i + 1]]); return out;
  }
  function supportAt(x, yMax) {              // le plus haut sol sous les pieds (seulement là où le pied touche vraiment)
    let best = 0;
    for (const cx of [x - FOOT, x, x + FOOT]) for (const q of solids) { const sp = spansAt(q, cx); if (sp) for (const [, hi] of sp) if (hi <= yMax && hi > best) best = hi; }
    return best;
  }
  function colTop(cx, yMax) { let best = 0; for (const q of solids) { const sp = spansAt(q, cx); if (sp) for (const [, hi] of sp) if (hi <= yMax && hi > best) best = hi; } return best; }
  const steepAt = (x, y) => { const l = colTop(x - FOOT, y + STEP), r = colTop(x + FOOT, y + STEP); return Math.abs(r - l) > FOOT * 2 * 1.25 ? Math.sign(l - r) : 0; };   // pente trop raide → -1/1 = côté où ça descend
  function blockedIn(cx, y0, y1) {           // de la matière (hors dalles, qu'on traverse par en dessous) entre y0 et y1 ?
    for (const q of solids) { if (q.kind === 'slab' || q.kind === 'arch') continue; const sp = spansAt(q, cx); if (sp) for (const [lo, hi] of sp) if (lo < y1 && hi > y0) return true; }
    return false;
  }
  function bodyHit(x, h, air) {              // jambes étroites, buste et casque un peu plus larges
    const yLeg = h + (air ? 4 : STEP), yTop = h + RH - 4;
    for (const cx of [x - FOOT, x, x + FOOT]) if (blockedIn(cx, yLeg, yTop)) return true;
    for (const cx of [x - RW + 6, x + RW - 6]) if (blockedIn(cx, h + 70, yTop)) return true;
    return false;
  }
  const solidPoint = (x, y, slabs) => solids.some(q => (slabs || (q.kind !== 'slab' && q.kind !== 'arch')) && (spansAt(q, x) || []).some(([lo, hi]) => y > lo && y < hi));
  // étoiles
  const stars = [];
  const arc = (x0, x1, y0, hgt, n) => { for (let i = 0; i < n; i++) { const t = n === 1 ? .5 : i / (n - 1); stars.push({ x: x0 + (x1 - x0) * t, y: y0 + Math.sin(t * Math.PI) * hgt, got: false }); } };
  WD.stars.forEach(a => arc(...a));
  // lettres (l'alphabet de la langue choisie)
  const ABC = (MM.i18n && MM.i18n.alphabet ? MM.i18n.alphabet() : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')).slice(0, 26);
  const letters = ABC.map((l, i) => { const x = 450 + i * ((L - 900) / ABC.length); let y = 110 + ((i * 97) % 3) * 110;
    for (const s of solids) if (s.kind !== 'ceil' && s.kind !== 'cloudceil' && x > s.x - 40 && x < s.x + s.w + 40) y = Math.max(y, s.kind === 'tite' ? 120 : Math.min(470, s.y + s.h + 90));
    if (x > CAVE0 && x < CAVE1) y = Math.min(y, CEIL - 90);
    return { l, x, y, got: false }; });
  // extraterrestres farceurs
  const aliens = WD.aliens.map((a, i) => ({ ...a, id: i, dir: 1, t: Math.random() * 3, state: 'farceur', bt: 0, cool: 2 + i, hp: a.type === 'bidou' ? 2 : 1, hitT: 0 }));   // Gros Bidou est costaud : 2 bulles
  // amis enfermés dans des petites prisons (nos monstres : case farceur → case ami de monsters.webp)
  // les 20 amis des autres héros, enfermés par les extraterrestres : les 15 petits monstres + les 5 flammes de couleur
  const CALM = [[0, 5], [1, 6], [2, 7], [3, 8], [10, 11], [12, 13], [14, 15], [16, 17], [18, 19], [20, 21], [22, 23], [24, 25], [26, 27], [28, 29], [30, 31]];
  const HUES = [0, 190, 95, 250, 305];
  const prisoners = [...CALM.map(([f, a]) => ({ kind: 'mon', f, a })), ...HUES.map(h => ({ kind: 'flame', hue: h }))].sort(() => Math.random() - .5);
  const cageSpots = [];
  { const blocked = (x) => solids.some(s => s.y === 0 && x > s.x - 110 && x < s.x + s.w + 110) || Math.abs(x - (L - 280)) < 300;
    for (const s of solids) if (s.kind === 'slab' || s.kind === 'arch' || s.kind === 'mesa' || s.kind === 'pancake') cageSpots.push({ x: s.x + s.w / 2, y: s.y + s.h });
    for (let x = 1050; cageSpots.length < 20 && x < L - 400; x += 320) if (!blocked(x)) cageSpots.push({ x, y: 0 });
    for (let x = 1210; cageSpots.length < 20 && x < L - 400; x += 320) if (!blocked(x) && !cageSpots.some(p => p.y === 0 && Math.abs(p.x - x) < 150)) cageSpots.push({ x, y: 0 }); }   // toujours 20 cages
  const cages = WD.noCages ? [] : cageSpots.slice(0, 20).map((p, i) => ({ ...p, ...prisoners[i], open: false, t: 0 }));
  // caisses « ? » : une devinette sur l'espace
  const boxes = WD.boxes.map(b => ({ ...b, done: false }));
  const ROCKET = L - 280;
  const friends = [];                       // ceux qui suivent Rose
  for (let i = 0; i < (WD.friends || 0); i++) friends.push({ img: 'mon', cell: CALM[(i * 4) % CALM.length][1], x: 260 - i * 90, y: 0, t: i * 1.3 });   // grand final : des amis déjà libres viennent aider
  // grand final : Ziggy, Filou et Titan courent avec Rose et envoient des bulles eux aussi
  const HSPR = { ziggy: ['ziggy_r0', 'ziggy_r1', 'ziggy_r2', 'ziggy_r3'], filou: [0, 1, 2, 3, 4, 5, 6, 7].map(i => 'filou_w' + i), titan: [0, 1, 2, 3, 4, 5, 6, 7].map(i => 'titan_w' + i) };
  const helpers = (WD.helpers || []).map((n, i) => ({ n, i, x: 300 - i * 110, y: 0, vx: 0, face: 1, t: i, cool: 2 + i * 1.1, run: 0, shotT: 0 }));
  // grand final : Capitaine Farfouille dans sa soucoupe (il faut 3 bulles), tout au bout de la ville
  let EP = null;   // grand final « épique » (rose-final.js) : crochets appelés par le moteur
  const boss = WD.boss && !WD.epic ? { ...WD.boss, hpMax: WD.boss.hp, state: 'wait', t: 0, dir: -1, hitT: 0, cool: 2.5, bt: 0, yy: WD.boss.y } : null;
  const bossBox = () => ({ x0: boss.x - 95, x1: boss.x + 95, y0: boss.yy + 10, y1: boss.yy + 235 });
  const slime = [], bubbles = [], puffs = [], sparks = [];   // sparks : paillettes de poudre ronchon, cœurs, notes de musique
  const RIDDLES = WD.riddles;
  const quizPick = RIDDLES.map((r, i) => i).sort(() => Math.random() - .5).slice(0, 3);
  if (!quizPick.includes(WD.pin || 0)) quizPick[0] = WD.pin || 0;   // la 1re caisse parle toujours de ce monde-ci

  // ================= Rose =================
  const rose = { x: 420, y: 0, vx: 0, vy: 0, vs: 0, face: 1, mode: 'ground', anim: null, walkDist: 0, t: 0, airPose: 'hover', airT: 0, walking: false, base: 0, cool: 0, bump: 0 };
  let shownSet = null, shown = null, fadeFrom = null, fadeT = 9, fadeLen = FADE, fadeGy = 0, lastGy = 0, stopFade = false, fadeAng = 0, fadePivot = 0, lastGround = true;
  function play(name, then, opts = {}) { rose.anim = { name, t: 0, then, ...opts }; if (name !== 'win') rose.mode = 'trans'; }

  // ================= commandes =================
  const key = { l: false, r: false, fly: false, down: false, shoot: false };
  let paused = false, finished = false;
  const hold = (id, k) => { const b = document.getElementById(id);
    const on = (e) => { e.preventDefault(); key[k] = true; b.classList.add('on'); if (k === 'shoot') shoot(); }, off = (e) => { e.preventDefault(); key[k] = false; b.classList.remove('on'); };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('pointerleave', off); };
  hold('bs', 'shoot');
  // ----- joystick flottant : il apparaît là où le pouce se pose (moitié gauche), suit le doigt et disparaît quand on lâche -----
  // haut = voler, bas = redescendre vite, côtés = marcher / avancer ; grande zone morte au centre pour les petits pouces
  const zone = $('#stickzone'), stick = $('#stick'), knob = $('#sknob'), arrowEl = $('#sarrow');
  let sid = null, sx0 = 0, sy0 = 0;
  const restStick = () => { stick.classList.add('idle'); stick.style.left = (Math.max(110, innerWidth * .14)) + 'px'; stick.style.top = (innerHeight - Math.max(110, innerHeight * .2)) + 'px'; knob.style.transform = ''; arrowEl.style.opacity = 0; };
  restStick(); addEventListener('resize', () => { if (sid === null) restStick(); });
  function stickMove(x, y) {
    const R = stick.offsetWidth * .5, dx = x - sx0, dy = y - sy0, d = Math.hypot(dx, dy), k = Math.min(1, d / R);
    const nx = d ? dx / d * k : 0, ny = d ? dy / d * k : 0;
    knob.style.transform = `translate(${nx * R * .62}px, ${ny * R * .62}px)`;
    const dead = .26;
    key.l = nx < -dead; key.r = nx > dead; key.fly = ny < -dead * 1.2; key.down = ny > .45;
    if (k > dead) { arrowEl.style.opacity = 1; arrowEl.style.transform = `rotate(${Math.atan2(dx, -dy)}rad) translateY(${-R * .78}px)`; } else arrowEl.style.opacity = 0;
  }
  zone.addEventListener('pointerdown', (e) => { if (sid !== null) return; e.preventDefault(); sid = e.pointerId; zone.setPointerCapture(sid); sx0 = e.clientX; sy0 = e.clientY;
    stick.classList.remove('idle'); stick.style.left = sx0 + 'px'; stick.style.top = sy0 + 'px'; stickMove(sx0, sy0); });
  zone.addEventListener('pointermove', (e) => { if (e.pointerId !== sid) return; e.preventDefault();
    // si le doigt part loin, le joystick le suit (il ne « décroche » jamais)
    const R = stick.offsetWidth * .5, dx = e.clientX - sx0, dy = e.clientY - sy0, d = Math.hypot(dx, dy);
    if (d > R * 1.15) { sx0 = e.clientX - dx / d * R * 1.15; sy0 = e.clientY - dy / d * R * 1.15; stick.style.left = sx0 + 'px'; stick.style.top = sy0 + 'px'; }
    stickMove(e.clientX, e.clientY); });
  const stickUp = (e) => { if (e.pointerId !== sid) return; sid = null; key.l = key.r = key.fly = key.down = false; restStick(); };
  zone.addEventListener('pointerup', stickUp); zone.addEventListener('pointercancel', stickUp);
  addEventListener('keydown', (e) => { if (e.repeat) return; if (e.key === 'ArrowDown') key.down = true; if (e.key === 'ArrowLeft') key.l = true; if (e.key === 'ArrowRight') key.r = true; if (e.key === ' ' || e.key === 'ArrowUp') key.fly = true; if (e.key === 'x' || e.key === 'Enter') shoot(); });
  addEventListener('keyup', (e) => { if (e.key === 'ArrowDown') key.down = false; if (e.key === 'ArrowLeft') key.l = false; if (e.key === 'ArrowRight') key.r = false; if (e.key === ' ' || e.key === 'ArrowUp') key.fly = false; });
  const BACK = WD.boss ? 'index.html#chapters' : 'index.html#space';   // le grand final revient aux chapitres, les planètes à la carte
  $('#quit').onclick = () => { location.href = BACK; };
  $('#home').onclick = () => { location.href = BACK; };
  if (WD.next) { $('#next').textContent = WD.nextIcon + ' ➜'; { const nw = (LX && LX.worlds && LX.worlds[WD.next]) || (MM.ROSE_WORLDS || {})[WD.next]; if (nw && nw.name) $('#next').setAttribute('aria-label', nw.name); } $('#next').onclick = () => { location.href = 'rose-world.html?w=' + WD.next; }; } else $('#next').style.display = 'none';
  $('#again').onclick = () => { location.reload(); }; $('#again').textContent = EN.replay;

  function shoot() {
    if (paused || finished || !RF) return;
    if (EP && EP.shoot()) return;   // super bulle, bulle géante…
    if (rose.cool > 0) return;
    rose.cool = .32; sfx.bubble();
    const h = rose.mode === 'air' ? rose.y : rose.base, dash = rose.mode === 'air' && rose.vs > 300;
    const cx = rose.x + rose.face * (dash ? -14 : 6), cy = h + (dash ? 118 : 121);      // le petit triangle blanc sur la poitrine
    bubbles.push({ x: cx, y: cy, vx: rose.face * 1150 + rose.vx, vy: 0, age: 0, life: 2.4, r: 5 });
  }

  // ================= mise à jour =================
  function moveX(dx, air) {
    const n = Math.max(1, Math.ceil(Math.abs(dx) / 6)), sx = dx / n;
    for (let i = 0; i < n; i++) {
      const nx = Math.max(60, Math.min(EP ? EP.maxX() : L - 60, rose.x + sx));
      let h = air ? rose.y : rose.base;
      if (!air) { const sf = supportAt(nx, h + STEP); if (sf > h) h = sf; }          // une pente douce : elle la monte
      if (bodyHit(nx, h, air)) { if (air) { rose.vx *= -.3; if (Math.abs(dx) > 1) bonk(); } else rose.vx = 0; break; }
      rose.x = nx; if (!air) rose.base = h;
    }
  }
  // au sol (ou pendant une jonction qui finit au sol) : suit la pente qui descend ; si plus rien sous les pieds
  // ou si c'est trop raide, elle se met à flotter et redescend doucement (jamais debout sur du vide)
  function followGround(dt) {
    const sf = supportAt(rose.x, rose.base + 2), down = 6 + Math.abs(rose.vx) * dt * 1.3;
    if (sf >= rose.base - 1 && !steepAt(rose.x, rose.base)) { rose.base = sf; return; }
    if (sf < rose.base - 1 && rose.base - sf <= down && !steepAt(rose.x, sf)) { rose.base = sf; return; }
    rose.anim = null; rose.mode = 'air'; rose.y = rose.base - (topOf('rose_hover0') - topOf('rose_idle0')) + 4; rose.vy = 0; rose.airPose = Math.abs(rose.vx) < 60 ? 'hover' : 'fly'; rose.airT = 0; rose.walking = false;
  }
  const inDevil = () => { const h = rose.mode === 'air' ? rose.y : rose.base; return h < DEVIL_TOP - 60 && devils.some(d => Math.abs(rose.x - d.x) < DEVIL_W); };
  function updateMars(dt) {
    for (const d of devils) { d.t += dt; const now = Math.abs(rose.x - d.x) < DEVIL_W && (rose.mode === 'air' ? rose.y : rose.base) < DEVIL_TOP; if (now && !d.inside) { sfx.wind(); puffs.push({ x: d.x, y: 60, t: 0, c: '#f2b58a' }); } d.inside = now; }
    const B = roseBox();
    // le robot : il dort jusqu'à ce que Rose le touche, puis la suit (il roule derrière le décor)
    rover.t += dt;
    if (!rover.awake && B.x1 > rover.x - 60 && B.x0 < rover.x + 60 && B.y0 < 90) { rover.awake = true; sfx.beep(); say(EN.robot, false); puffs.push({ x: rover.x, y: 80, t: 0, c: '#ffe9a8' }); }
    if (rover.awake) { const tx = rose.x - rose.face * 170, d = tx - rover.x, v = Math.max(-230, Math.min(230, d * 2.2)); if (Math.abs(d) > 6) { rover.x += v * dt; rover.face = Math.sign(v) || rover.face; rover.wheel += v * dt / 11; } }
    // l'hélicoptère : il se réveille aussi au contact, puis vole à côté de Rose
    heli.t += dt;
    if (!heli.awake && B.x1 > heli.x - 50 && B.x0 < heli.x + 50 && B.y0 < 80) { heli.awake = true; sfx.heli(); say(EN.heli, false); }
    if (heli.awake) { const h = rose.mode === 'air' ? rose.y : rose.base, tx = rose.x - rose.face * 110, ty = Math.min(CEIL - 60 > h ? 560 : 560, h + RH + 30 + Math.sin(heli.t * 2) * 12);
      let ty2 = ty; if (rose.x > CAVE0 - 100 && rose.x < CAVE1 + 100) ty2 = Math.min(ty, CEIL - 70);
      heli.vx += ((tx - heli.x) * 4 - heli.vx * 2.6) * dt; heli.vy += ((ty2 - heli.y) * 4 - heli.vy * 2.6) * dt; heli.x += heli.vx * dt; heli.y += heli.vy * dt; if (Math.abs(heli.vx) > 20) heli.face = Math.sign(heli.vx); }
  }
  function bonk() { if (rose.bump > 0) return; rose.bump = .4; sfx.bonk(); puffs.push({ x: rose.x + rose.face * RW, y: (rose.mode === 'air' ? rose.y : rose.base) + 110, t: 0, c: '#fff' }); }

  function update(dt) {
    if (EP && EP.locked()) { const sv = { ...key }; key.l = key.r = key.fly = key.down = false; try { updateInner(dt); } finally { Object.assign(key, sv); } return; }
    updateInner(dt);
  }
  function updateInner(dt) {
    const dir = (key.r ? 1 : 0) - (key.l ? 1 : 0);
    if (dir) rose.face = dir;
    rose.t += dt; rose.airT += dt; rose.cool -= dt; rose.bump -= dt; rose.vs += (Math.abs(rose.vx) - rose.vs) * Math.min(1, dt * 5);
    const a = rose.anim;
    if (rose.mode === 'ground') {
      const target = a ? 0 : dir * WALK;
      const acc = Math.abs(target) > Math.abs(rose.vx) || Math.sign(target) !== Math.sign(rose.vx) ? WALK_ACC : WALK_DEC;
      rose.vx += Math.max(-acc * dt, Math.min(acc * dt, target - rose.vx));
      moveX(rose.vx * dt, false);
      const was = rose.walking;
      if (Math.abs(rose.vx) > 8 && !a) { if (!was) rose.walkDist = WALK_START * STEP_PX; rose.walking = true; rose.walkDist += Math.abs(rose.vx) * dt; }
      else if (was) { rose.walking = false; stopFade = true; }
      // plus rien sous les pieds (bord d'une dalle) : elle se met à flotter et redescend doucement
      followGround(dt);
      if (key.fly && !a && rose.mode === 'ground') { if (Math.abs(rose.vx) > 60) play('up', 'air', { vx0: rose.vx }); else play('lift', 'air'); rose.walking = false; }
      if (inDevil() && !a && rose.mode === 'ground' && !key.down) { play('lift', 'air'); rose.walking = false; }   // le tourbillon la soulève
    } else if (rose.mode === 'air') {
      const ty = inDevil() && !key.down ? RISE * 1.3 : key.fly ? RISE : key.down ? -SINK * 1.8 : -SINK;
      rose.vy += Math.max(-1300 * dt, Math.min(1300 * dt, ty - rose.vy));
      const target = dir * FLY;
      rose.vx += Math.max(-FLY_ACC * dt, Math.min(FLY_ACC * dt, target - rose.vx));
      moveX(rose.vx * dt, true);
      const ny = rose.y + rose.vy * dt;
      if (bodyHit(rose.x, ny, true)) {
        if (rose.vy > 0) { const hard = rose.vy > 150; rose.vy = hard ? -30 : 0; if (hard) bonk(); }           // la tête touche : petit rebond tout doux
        else { rose.vy = 0; for (const d of [3, -3]) if (!bodyHit(rose.x + d * 2, ny, true)) { rose.x += d; break; } }   // glisse le long de la paroi
      } else rose.y = Math.min(400, ny);                 // plafond du ciel : Rose reste toujours à l'écran
      if (rose.y >= 400 && rose.vy > 0) rose.vy = 0;
      const sp = Math.abs(rose.vx), want = sp < 60 ? 'hover' : sp < DASH_AT ? 'fly' : 'dash';
      if (want !== rose.airPose) { rose.airPose = want; rose.airT = 0; }
      if (rose.vy < 0) {                                          // atterrissage : la jonction démarre pile à la bonne hauteur
        const sf = supportAt(rose.x, rose.y + 40), moving = sp > 60;
        const startTop = moving ? topOf('rose_down0') : topOf('rose_lift' + (A.lift.n - 1));
        const hAt = startTop - topOf('rose_hover0');
        const st = steepAt(rose.x, sf);
        if (st && rose.y - sf <= hAt + 20) { const nx = rose.x + st * 160 * dt; if (!bodyHit(nx, rose.y, true)) rose.x = nx; }
        else if (rose.y - sf <= hAt) { rose.base = sf; rose.y = sf; rose.vy = 0; play(moving ? 'down' : 'drop', 'ground', { vx0: rose.vx }); }
      }
    } else if (a) {
      const n = A[a.name].n, dur = (n - 1) / A[a.name].fps, k = Math.min(1, a.t / dur);
      if (a.name === 'up') rose.vx = a.vx0 + (rose.face * FLY * .55 - a.vx0) * k * k;
      else if (a.name === 'down') rose.vx = a.vx0 + (rose.face * WALK * (dir ? 1 : .3) - a.vx0) * k;
      else rose.vx *= Math.pow(.02, dt);
      moveX(rose.vx * dt, false);
      if (a.then !== 'air' && a.name !== 'win') followGround(dt);
    }
    if (a && rose.anim === a) {
      a.t += dt;
      if (a.t >= (A[a.name].n - 1) / A[a.name].fps) {
        rose.anim = null;
        if (a.then === 'air') { const last = 'rose_' + (A[a.name].src || a.name) + (A[a.name].n - 1);
          rose.y = rose.base + topOf(last) - topOf('rose_hover0'); rose.vy = 120; rose.mode = 'air'; rose.airPose = Math.abs(rose.vx) < 60 ? 'hover' : 'fly'; rose.airT = 0; }
        else { rose.mode = 'ground'; rose.y = rose.base; if (a.name === 'down') { rose.walkDist = WALK_START * STEP_PX; rose.walking = Math.abs(rose.vx) > 8; } else rose.walking = false; }
      }
    }
    updateWorld(dt); updateMars(dt);
    // vents (Neptune) : ils poussent Rose tout doucement, jamais assez pour l'empêcher d'avancer
    if (!finished && rose.mode !== 'trans') for (const w of WD.winds || []) if (rose.x > w[0] && rose.x < w[1]) moveX(w[2] * (rose.mode === 'air' ? 1 : .6) * dt, rose.mode === 'air');
  }

  // ================= le reste du monde =================
  const roseBox = () => { const h = rose.mode === 'air' ? rose.y : rose.base; return { x0: rose.x - RW, x1: rose.x + RW, y0: h, y1: h + RH }; };
  const hitR = (b, x, y, r) => x + r > b.x0 && x - r < b.x1 && y + r > b.y0 && y - r < b.y1;
  let got = { stars: 0, letters: 0, friends: 0, aliens: 0 };
  function chip(id, txt) { const c = $(id); c.textContent = txt; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
  function addFriend(img, cell, x, y) {
    friends.push({ img, cell, x, y, t: Math.random() * 6 }); got.friends++; chip('#cFriends', '💛 ' + got.friends + '/20'); sfx.friend();
    const followers = friends.filter(f => !f.home); if (followers.length > 5) { followers[0].home = true; followers[0].hv = 0; }   // au plus 5 suivent Rose
    say(EN.freed[got.friends % EN.freed.length], false);
  }
  function updateWorld(dt) {
    const B = roseBox();
    for (const s of stars) if (!s.got && hitR(B, s.x, s.y, 26)) { s.got = true; got.stars++; chip('#cStars', '⭐ ' + got.stars); sfx.star(); puffs.push({ x: s.x, y: s.y, t: 0, c: '#ffe36e' }); }
    for (const l of letters) if (!l.got && hitR(B, l.x, l.y, 30)) { l.got = true; got.letters++; chip('#cLetters', '🔤 ' + got.letters); sfx.letter();
      puffs.push({ x: l.x, y: l.y, t: 0, c: '#a6e1ff' }); const p = MM.i18n && MM.i18n.letterPhrase ? MM.i18n.letterPhrase(l.l) : null; say(p ? p.say : l.l, false); }
    for (const c of cages) if (!c.open && hitR(B, c.x, c.y + 70, 60)) openCage(c);
    for (const b of boxes) if (!b.done && hitR(B, b.x, b.y, 50)) openQuiz(b);
    // bulles de Rose
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const u = bubbles[i]; u.life -= dt; u.age += dt;
      const g = 1 - Math.exp(-u.age * 5.5); u.r = 5 + (BUBBLE_R - 5) * g;                 // elle grossit…
      const sp = Math.hypot(u.vx, u.vy), nsp = Math.max(150, sp * Math.pow(.05, dt));      // …en ralentissant
      let tgt = null, bd = 1100;                                                          // et file un peu vers le farceur le plus proche, devant elle
      for (const a of aliens) if (a.state === 'farceur') { const ab = alienBox(a), ax = (ab.x0 + ab.x1) / 2, ay = (ab.y0 + ab.y1) / 2, dx = ax - u.x, d = Math.hypot(dx, ay - u.y); if (dx * Math.sign(u.vx || 1) > -20 && d < bd) { bd = d; tgt = [ax, ay]; } }
      if (EP) { const t = EP.target(u); if (t) { const d = Math.hypot(t[0] - u.x, t[1] - u.y); if ((t[0] - u.x) * Math.sign(u.vx || 1) > -20 && d < bd) { bd = d; tgt = t; } } }
      if (boss && boss.state === 'fight') { const bb = bossBox(), ax = boss.x, ay = (bb.y0 + bb.y1) / 2, dx = ax - u.x, d = Math.hypot(dx, ay - u.y); if (dx * Math.sign(u.vx || 1) > -20 && d < bd) { bd = d; tgt = [ax, ay]; } }
      let ang = Math.atan2(u.vy, u.vx);
      if (tgt) { const want = Math.atan2(tgt[1] - u.y, tgt[0] - u.x); let da = want - ang; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; ang += Math.max(-2.4 * dt, Math.min(2.4 * dt, da)); }
      u.vx = Math.cos(ang) * nsp; u.vy = Math.sin(ang) * nsp;
      u.x += u.vx * dt; u.y += u.vy * dt + Math.sin(u.age * 9) * .4;
      let hit = u.life <= 0 || solidPoint(u.x, u.y, false);
      for (const a of aliens) if (!hit && a.state === 'farceur') { const ab = alienBox(a); if (u.x + u.r * .6 > ab.x0 && u.x - u.r * .6 < ab.x1 && u.y + u.r * .6 > ab.y0 && u.y - u.r * .6 < ab.y1) {
        if (a.hp > 1) { a.hp--; a.hitT = .55; hit = true; sfx.bonk(); puffs.push({ x: u.x, y: u.y, t: 0, c: '#ffd08a' }); continue; }   // 1re bulle : il boude, il en faut une 2e
        bubbleAlien(a); hit = 'keep'; } }
      if (!hit && EP && EP.bubbleHit(u)) hit = true;
      if (!hit && boss && boss.state === 'fight') { const bb = bossBox(); if (u.x + u.r * .6 > bb.x0 && u.x - u.r * .6 < bb.x1 && u.y + u.r * .6 > bb.y0 && u.y - u.r * .6 < bb.y1) { hit = true; hitBoss(u.x, u.y); } }
      for (const c of cages) if (!hit && !c.open && Math.abs(u.x - c.x) < 70 + u.r * .4 && u.y > c.y && u.y < c.y + 160) { openCage(c); hit = true; }
      if (hit) { bubbles.splice(i, 1); if (hit !== 'keep') puffs.push({ x: u.x, y: u.y, t: 0, c: '#d9f6ff' }); }
    }
    // extraterrestres
    for (const a of aliens) {
      a.t += dt;
      if (a.state === 'farceur' && a.web > 0) { a.web -= dt; a.throwT = 0; }   // pris dans le fil doux de Filou : il ne bouge plus
      else if (a.state === 'farceur' && a.dizzy > 0) { a.dizzy -= dt; a.throwT = 0; if (a.y > (a.yb || 0)) a.y = Math.max(a.yb || 0, a.y - 260 * dt); }   // secoué par Titan : la tête qui tourne
      else if (a.state === 'farceur') {
        if (a.type === 'glouglou') { a.x += a.dir * 45 * dt; if (a.x > a.x1) a.dir = -1; if (a.x < a.x0) a.dir = 1; }
        else if (a.type === 'boing') { a.y = (a.yb || 0) + Math.abs(Math.sin(a.t * 2.4)) * 130; a.x += a.dir * 30 * dt; if (a.x > a.x1) a.dir = -1; if (a.x < a.x0) a.dir = 1; }
        else if (a.type === 'bidou') { a.hitT -= dt; if (a.hitT <= 0) { a.x += a.dir * 28 * dt; if (a.x > a.x1) a.dir = -1; if (a.x < a.x0) a.dir = 1; } }
        else if (a.type === 'zigzag') {                                     // Zigzag souffle 2 bulles d'un coup vers Rose (rien de méchant)
          a.x += a.dir * 22 * dt; if (a.x > a.x1) a.dir = -1; if (a.x < a.x0) a.dir = 1; a.cool -= dt; a.throwT = (a.throwT || 0) - dt;
          if (a.cool <= 0 && Math.abs(rose.x - a.x) < 700) { a.cool = 3.8; a.throwT = .5; a.dir = rose.x < a.x ? -1 : 1;
            const h = (rose.mode === 'air' ? rose.y : rose.base) + 100, dx = rose.x - a.x, dy = h - (a.yb || 0) - 80, base = Math.atan2(dy, dx);
            for (const da of [-.22, .22]) slime.push({ soap: true, x: a.x + a.dir * 55, y: (a.yb || 0) + 85, vx: Math.cos(base + da) * 210, vy: Math.sin(base + da) * 210, life: 3.5 }); } }
        else { a.y = a.y0 + Math.sin(a.t * 1.3) * 60; a.dir = rose.x < a.x ? -1 : 1; a.cool -= dt;
          if (a.cool <= 0 && Math.abs(rose.x - a.x) < 750) { a.cool = 3.6; a.throwT = .45; const h = (rose.mode === 'air' ? rose.y : rose.base) + 100, dx = rose.x - a.x, dy = h - (a.y + 60), d = Math.hypot(dx, dy) || 1;
            slime.push({ x: a.x + a.dir * 50, y: a.y + 70, vx: dx / d * 230, vy: dy / d * 230, life: 3.5 }); } a.throwT = (a.throwT || 0) - dt; }
        const ab = alienBox(a);
        if (B.x1 > ab.x0 && B.x0 < ab.x1 && B.y1 > ab.y0 && B.y0 < ab.y1 && rose.bump <= 0) { rose.vx = (rose.x < a.x ? -1 : 1) * 220; rose.bump = .6; sfx.bonk(); puffs.push({ x: (rose.x + a.x) / 2, y: B.y0 + 100, t: 0, c: '#fff' }); }
      } else if (a.state === 'bubble') {
        a.bt += dt; a.vy += 140 * dt; a.y += a.vy * dt; a.x += (a.vx + Math.sin(a.bt * 3) * 40) * dt;     // il s'envole dans sa bulle
        a.nt = (a.nt || .2) - dt; if (a.nt <= 0 && a.y < 900) { a.nt = .45; sparks.push({ x: a.x + (Math.random() - .5) * 80, y: a.y + 140, vx: (Math.random() - .5) * 40, vy: 70, t: 0, life: 1.4, kind: WD.boss && Math.random() < .5 ? 'heart' : 'note' }); }   // dans l'histoire, les farceurs boudent dans leur bulle jusqu'au grand final : des notes d'abord, des cœurs à la fin
        if (a.y > 1400) a.state = 'gone';
      }
    }
    // boules de slime de Zap : rien de méchant, juste un « splotch »
    for (let i = slime.length - 1; i >= 0; i--) { const s = slime[i]; s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt;
      if (hitR(B, s.x, s.y, 14)) { slime.splice(i, 1); sfx.bonk(); puffs.push({ x: s.x, y: s.y, t: 0, c: s.soap ? '#bfe8ff' : '#8be36a' }); rose.vx *= .4; continue; }
      if (s.life <= 0 || s.y < 0 || solidPoint(s.x, s.y, true)) { slime.splice(i, 1); puffs.push({ x: s.x, y: Math.max(8, s.y), t: 0, c: s.soap ? '#bfe8ff' : '#8be36a' }); } }
    // les amis suivent Rose en petite file
    friends.filter(f => f.home).forEach(f => { f.t += dt; f.hv += 260 * dt; f.x += 420 * dt; f.y += f.hv * dt * .8; f.face = 1; });   // les plus anciens rentrent à la fusée
    friends.filter(f => !f.home).forEach((f, i) => { f.t += dt; const tx = rose.x - rose.face * (150 + i * (WD.epic ? 52 : 95)) + (f.dx || 0), ty = Math.max(0, (rose.mode === 'air' ? rose.y : rose.base) - 10 + Math.sin(f.t * 3 + i) * 10);
      if (f.lock > 0) { f.lock -= dt; return; } f.x += (tx - f.x) * Math.min(1, dt * 2.6); f.y += (ty - f.y) * Math.min(1, dt * 2.2); f.face = tx > f.x ? 1 : -1; });
    for (let i = puffs.length - 1; i >= 0; i--) { puffs[i].t += dt; if (puffs[i].t > .6) puffs.splice(i, 1); }
    for (let i = sparks.length - 1; i >= 0; i--) { const q = sparks[i]; q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy -= (q.g || 0) * dt; if (q.t > q.life) sparks.splice(i, 1); }
    cages.forEach(c => { if (c.open) c.t += dt; });
    if (!finished && !WD.boss && rose.x > ROCKET - 40 && rose.mode !== 'air') finish();
    updateHelpers(dt); updateBoss(dt, B);
    if (EP) EP.update(dt, B);
  }
  const ASCALE = 1;
  const BUBBLE_R = 92;   // un peu plus grand que le plus grand extraterrestre (≈ 150 de haut)
  const TSCALE = { bidou: 1.25 };
  const SHADES = { glouglou: [.08, .62], boing: [.02, .7], zap: [0, .6], bidou: [0, .7], zigzag: [0, .66] };   // où poser les lunettes (fraction de l'image)   // Gros Bidou, le costaud, un peu plus grand
  function alienBox(a) { const f = AF && AF[a.type + '_f1'], z = ASCALE * (TSCALE[a.type] || 1); const w = f ? f.w * z : 120, h = f ? f.h * z : 120; return { x0: a.x - w * .38, x1: a.x + w * .38, y0: a.y, y1: a.y + h * .9 }; }
  function openCage(c) { c.open = true; c.t = 0; sfx.pop(); puffs.push({ x: c.x, y: c.y + 90, t: 0, c: '#ffe9a8' }); setTimeout(() => addFriend(c.kind, c.kind === 'mon' ? c.a : c.hue, c.x, c.y), 450); }

  function bubbleAlien(a) {   // un farceur attrapé dans une bulle (par Rose, un héros ou la super bulle)
    if (a.state !== 'farceur') return; const ab = alienBox(a);
    a.state = 'bubble'; a.bt = 0; a.vy = 40; a.vx = (Math.random() - .5) * 60; a.web = 0; sfx.pop(); powderBurst((ab.x0 + ab.x1) / 2, (ab.y0 + ab.y1) / 2); got.aliens++;
    if (EP) EP.onBubble(a); else if (WD.noCages) bubbleChip();
  }
  function bubbleChip() { chip('#cFriends', '🫧 ' + got.aliens + '/' + (aliens.length + (boss ? 1 : 0))); }
  // ----- les héros qui aident (grand final) -----
  function groundTop(x) { let best = 0; for (const q of solids) { if (q.kind === 'slab') continue; const sp = spansAt(q, x); if (sp) for (const [, hi] of sp) if (hi > best) best = hi; } return best; }
  function updateHelpers(dt) {
    for (const h of helpers) {
      h.t += dt; h.cool -= dt; h.shotT -= dt; h.poseT = (h.poseT || 0) - dt; if (h.poseT <= 0) h.pose = null;
      if (h.lock > 0) { h.lock -= dt; continue; }        // pendant un pouvoir (grand final), c'est rose-final.js qui le déplace
      const tx = (h.tx != null ? h.tx : rose.x - rose.face * (120 + h.i * 115)), d = tx - h.x, v = Math.max(-480, Math.min(480, d * 2.4));
      h.vx = Math.abs(d) > 12 ? v : 0; h.x += h.vx * dt; if (EP) h.x = Math.min(h.x, EP.maxX() + 60); if (Math.abs(h.vx) > 20) h.face = Math.sign(h.vx); h.run += Math.abs(h.vx) * dt;
      const gt = groundTop(h.x), ty = gt + (gt > h.y + 4 ? 0 : 0); h.y += (ty - h.y) * Math.min(1, dt * (ty > h.y ? 9 : 6));   // ils sautent sur les toits
      if (h.cool <= 0 && !finished) {                     // une bulle vers le farceur le plus proche
        let best = null, bd = 700, by = 0;
        for (const a of aliens) if (a.state === 'farceur') { const dd = Math.abs(a.x - h.x); if (dd < bd) { bd = dd; best = a.x; by = a.y + 60; } }
        if (boss && boss.state === 'fight' && Math.abs(boss.x - h.x) < bd) { best = boss.x; by = boss.yy + 100; }
        if (EP) { const t = EP.helperTarget(h); if (t && Math.abs(t[0] - h.x) < bd) { best = t[0]; by = t[1]; } }
        if (best !== null) { h.face = best > h.x ? 1 : -1; h.cool = (EP ? 1.8 : 2.4) + Math.random() * 1.6; h.shotT = .3; sfx.bubble();
          const sx = h.x + h.face * 50, sy = h.y + 130, ang = Math.atan2(Math.max(-200, by - sy), Math.abs(best - sx)) * .8;   // vise aussi vers le haut (farceurs sur les toits)
          bubbles.push({ x: sx, y: sy, vx: h.face * 950 * Math.cos(ang), vy: 950 * Math.sin(ang), age: 0, life: 2.2, r: 5, h: 1 }); if (EP) EP.helperShot(h); }
        else h.cool = .5;
      }
    }
  }
  // ----- Capitaine Farfouille (grand final) -----
  const BOSS_SAY = EN.boss;
  // musique du combat contre Farfouille : une petite boucle sautillante, jouée seulement pendant le combat
  const bossMusic = (() => {
    const N = { C4: 262, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, G5: 784, C3: 131, F3: 175, G3: 196, A3: 220 };
    const MEL = 'E5 . G5 E5 D5 . C5 . D5 E5 . G5 A4 . . . E5 . G5 E5 D5 . C5 . D5 . C5 . G4 . . . C5 . E5 G5 A4 . G5 . E5 . D5 C5 D5 . . . E5 . G5 E5 D5 . C5 . D5 E5 D5 B4 C5 . . .'.split(' ');
    const BAS = ['C3', 'C3', 'F3', 'F3', 'G3', 'G3', 'C3', 'G3', 'A3', 'A3', 'F3', 'F3', 'G3', 'G3', 'C3', 'C3'];
    const STEP = .115; let timer = 0, i = 0, next = 0, on = false;
    function pump() { if (!AC) return; while (next < AC.currentTime + .25) { const at = next - AC.currentTime, m = MEL[i % MEL.length];
        if (m !== '.') tone(N[m], N[m], STEP * 1.7, 'square', .022, at, true);
        if (i % 4 === 0) { const b = N[BAS[(i / 4 | 0) % BAS.length]]; tone(b, b, STEP * 3, 'triangle', .07, at, true); }
        if (i % 4 === 2) tone(1800, 900, .04, 'square', .008, at, true);     // petit « tchik »
        i++; next += STEP; } }
    return {
      start() { if (on || !SND.music) return; on = true; tone(1, 1, .01, 'sine', .0001, 0, true); if (!AC) return; i = 0; next = AC.currentTime + .1; pump(); timer = setInterval(pump, 90); },
      stop() { on = false; clearInterval(timer); timer = 0; }
    };
  })();
  addEventListener('pagehide', () => bossMusic.stop());
  function hitBoss(x, y) {
    puffs.push({ x, y, t: 0, c: '#d9a8ff' });
    if (boss.hp > 1) { boss.hp--; boss.hitT = .8; sfx.bonk(); say(BOSS_SAY[Math.min(BOSS_SAY.length - 1, boss.hpMax - boss.hp)], false); return; }
    boss.state = 'bubble'; boss.bt = 0; bossMusic.stop(); sfx.pop(); sfx.friend(); got.aliens++; bubbleChip(); say(EN.bossPop);
    setTimeout(() => { if (!finished) finish(); }, 2600);
  }
  function updateBoss(dt, B) {
    if (!boss) return; boss.t += dt; boss.hitT -= dt;
    if (boss.state === 'wait') { if (rose.x > boss.x0 - 1000) { boss.state = 'fight'; say(EN.bossStart); bossMusic.start(); } return; }
    if (boss.state === 'fight') {
      if (boss.hitT <= 0) { boss.x += boss.dir * 130 * dt; if (boss.x < boss.x0) boss.dir = 1; if (boss.x > boss.x1) boss.dir = -1; }
      boss.yy = boss.y + Math.sin(boss.t * 1.5) * 55;
      boss.cool -= dt;
      if (boss.cool <= 0 && Math.abs(rose.x - boss.x) < 900) { boss.cool = 2.6;         // il lance un peu de poudre violette (rien de méchant : Rose ralentit juste un peu)
        const h = (rose.mode === 'air' ? rose.y : rose.base) + 100, dx = rose.x - boss.x, dy = h - (boss.yy + 40), base = Math.atan2(dy, dx);
        for (const da of [-.25, 0, .25]) slime.push({ soap: true, glitter: true, x: boss.x, y: boss.yy + 40, vx: Math.cos(base + da) * 200, vy: Math.sin(base + da) * 200, life: 3.5 }); }
      const bb = bossBox();
      if (B.x1 > bb.x0 && B.x0 < bb.x1 && B.y1 > bb.y0 && B.y0 < bb.y1 && rose.bump <= 0) { rose.vx = (rose.x < boss.x ? -1 : 1) * 240; rose.bump = .6; sfx.bonk(); }
    } else if (boss.state === 'bubble') { boss.bt += dt; const h = rose.mode === 'air' ? rose.y : rose.base;   // sa bulle vient flotter près de Rose, bien visible
      boss.yy += (Math.max(80, Math.min(330, h + 40)) - boss.yy) * Math.min(1, dt * 1.5); boss.x += ((rose.x + rose.face * 330) - boss.x) * Math.min(1, dt * .8) + Math.sin(boss.bt * 2) * 30 * dt; }
  }

  // ================= devinettes =================
  let qIndex = 0, curBox = null;
  function openQuiz(b) {
    curBox = b; b.done = true; paused = true; key.l = key.r = key.fly = key.down = false; if (typeof restStick === 'function') { sid = null; restStick(); } document.querySelectorAll('.b').forEach(x => x.classList.remove('on'));
    const r = RIDDLES[quizPick[qIndex++ % quizPick.length]];
    const order = [0, 1, 2].sort(() => Math.random() - .5);
    $('#qtext').textContent = r.q;
    $('#qopts').innerHTML = order.map(i => `<button class="opt" data-i="${i}"><i>${r.o[i][0]}</i>${r.o[i][1]}</button>`).join('');
    const speakQ = () => say(r.q + ' ' + order.map(i => r.o[i][1]).join(', ') + ' ?', true, [r.q, ...order.map((i, k) => r.o[i][1] + (k === order.length - 1 ? ' ?' : ','))]);
    $('#qsay').onclick = speakQ; speakQ();
    $('#qopts').querySelectorAll('.opt').forEach(btn => btn.onclick = () => {
      const i = +btn.dataset.i;
      if (i === r.a) { btn.classList.add('good'); sfx.good(); say(r.fact); for (let k = 0; k < 6; k++) stars.push({ x: b.x - 100 + k * 40, y: b.y + 60 + Math.sin(k) * 30, got: false });
        setTimeout(() => { $('#quiz').classList.remove('show'); paused = false; last = performance.now(); }, 2600); }
      else { btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no'); sfx.no(); say(EN.again); }
    });
    $('#quiz').classList.add('show');
  }

  function finish() {
    try { localStorage.setItem('mm.rose.world', 'rose-world.html?w=' + WID); } catch (e) {}
    try { const d = JSON.parse(localStorage.getItem('mm.rose.done') || '[]'); if (!d.includes(WID)) { d.push(WID); localStorage.setItem('mm.rose.done', JSON.stringify(d)); } } catch (e) {}
    finished = true; rose.vx = 0; rose.walking = false; play('win', 'ground'); rose.mode = 'ground'; sfx.good();
    say(WD.boss || got.friends >= 20 ? WD.outroAll : EN.partial.replace('{n}', got.friends).replace('{on}', WD.on));
    // le livre de fin du monde (« les vingt amis sont libres ! ») se mérite : au moins la moitié des amis libérés (meilleur score gardé) ;
    // le monde suivant s'ouvre quand même. Grand final et mondes sans cages : toujours.
    let best = got.friends; try { const B = JSON.parse(localStorage.getItem('mm.rose.best') || '{}'); best = Math.max(best, B[WID] || 0); B[WID] = best; localStorage.setItem('mm.rose.best', JSON.stringify(B)); } catch (e) {}
    const need = Math.ceil((cages.length || 20) / 2), earned = WD.boss || WD.noCages || best >= need;
    if (!earned && MM.book && !MM.book.seen(WID + '_c')) setTimeout(() => say(EN.moreStory.replace('{n}', need)), 4800);
    setTimeout(() => earned && MM.book && !MM.book.seen(WID + '_c') ? MM.book.open(WID + '_c', { onDone: showEnd }) : showEnd(), earned ? 3200 : 5200);
    function showEnd() {
      if (WD.boss) { showParty(); return; }   // le grand final : une vraie fête, puis le diplôme
      $('#end .title').textContent = KID ? EN.endN.replace('{name}', KID) : EN.end;   // on félicite le joueur, pas le personnage
      $('#estats').innerHTML = `<span>⭐ ${got.stars}/${stars.length}</span><span>🔤 ${got.letters}/${letters.length}</span>` + (WD.noCages ? '' : `<span>💛 ${got.friends}/${cages.length}</span>`) + `<span>🫧 ${got.aliens}</span>`;
      $('#end').classList.add('show');
    }
  }

  // ================= la fête de fin (grand final) =================
  function showParty() {
    const ov = document.createElement('div'); ov.id = 'party';
    ov.innerHTML = `<canvas></canvas><div class="pbar"><button class="pbtn" data-a="dip" aria-label="${EN.dipTitle}">📜</button><button class="pbtn" data-a="home" aria-label="🏠">🏠</button><button class="pbtn alt" data-a="again" aria-label="↻">↻</button></div>`;
    document.body.appendChild(ov);
    const cv2 = ov.querySelector('canvas'), c = cv2.getContext('2d'); let PW = 0, PH = 0, run = true, t0 = performance.now();
    const fit = () => { const d = Math.min(2, devicePixelRatio || 1); PW = innerWidth; PH = innerHeight; cv2.width = PW * d; cv2.height = PH * d; c.setTransform(d, 0, 0, d, 0, 0); }; fit(); addEventListener('resize', fit);
    const conf = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), v: .05 + Math.random() * .1, r: Math.random() * 6, s: 5 + Math.random() * 6, h: Math.floor(Math.random() * 360) }));
    const mons = [0, 3, 7, 11, 15, 19, 24, 28, 33, 38].filter(i => i < 45);
    const ALI = ['glouglou_ami', 'boing_ami', 'zap_ami', 'zigzag_ami', 'bidou_ami'];
    const HJ = { ziggy: 'ziggy_j', filou: 'filou_j', titan: 'titan_j' };
    const nf = (pre) => S2 ? Object.keys(S2).filter(k => k.startsWith(pre)).sort((a, b) => parseInt(a.slice(pre.length)) - parseInt(b.slice(pre.length))) : [];
    const jumps = {}; let RW = [];   // calculés dès que les planches sont chargées (sinon Rose et les héros manqueraient à la fête)
    say(KID ? EN.partyN.replace('{name}', KID) : EN.party); sfx.good(); setTimeout(() => sfx.friend(), 500);
    function frame(now) {
      if (!run) return; const t = (now - t0) / 1000; requestAnimationFrame(frame);
      const g = c.createLinearGradient(0, 0, 0, PH); g.addColorStop(0, '#3b2a8f'); g.addColorStop(.55, '#b45ad8'); g.addColorStop(1, '#ffb27a'); c.fillStyle = g; c.fillRect(0, 0, PW, PH);
      for (let i = 0; i < 40; i++) { const x = (i * 97.3) % PW, y = (i * 53.7) % (PH * .45), tw = .4 + .6 * Math.abs(Math.sin(t * 2 + i)); c.globalAlpha = tw; c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); } c.globalAlpha = 1;
      // guirlandes de fanions
      for (let row = 0; row < 2; row++) { const y0 = PH * (.08 + row * .09), sag = PH * .06, n = Math.ceil(PW / 46); c.strokeStyle = '#fff6'; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= n; i++) { const x = i * PW / n, y = y0 + Math.sin(i / n * Math.PI) * sag; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        for (let i = 0; i < n; i++) { const x = (i + .5) * PW / n, y = y0 + Math.sin((i + .5) / n * Math.PI) * sag, sw = Math.sin(t * 3 + i + row) * .15; c.save(); c.translate(x, y); c.rotate(sw); c.fillStyle = `hsl(${(i * 47 + row * 90) % 360} 85% 62%)`; c.beginPath(); c.moveTo(-13, 0); c.lineTo(13, 0); c.lineTo(0, 24); c.closePath(); c.fill(); c.restore(); } }
      // sol
      const gy = PH * .86; c.fillStyle = '#7ad36b'; c.fillRect(0, gy, PW, PH - gy); c.fillStyle = '#5cb84f'; c.fillRect(0, gy, PW, 6);
      const u = Math.min(PH / 600, PW / (PH > PW ? 560 : 900));           // échelle (plus grand en portrait)
      // rangée du fond : les farceurs devenus gentils
      if (AF && alienImg.complete) ALI.forEach((n, i) => { const f = AF[n]; if (!f) return; const x = PW * (.12 + i * .19), hop = Math.abs(Math.sin(t * 3 + i * 1.3)) * 30 * u, k = .55 * u * (TSCALE[n.split('_')[0]] || 1);
        c.save(); c.translate(x, gy - PH * .2 - hop); c.rotate(Math.sin(t * 3 + i) * .12); c.scale((i % 2 ? -1 : 1) * k, k); c.drawImage(alienImg, f.x, f.y, f.w, f.h, -f.w / 2, -f.h, f.w, f.h); c.restore(); });
      // les petits monstres
      if (monImg.complete) mons.forEach((m, i) => { const x = PW * (.05 + i * .1), hop = Math.abs(Math.sin(t * 4 + i * .8)) * 24 * u, k = .3 * u; c.save(); c.translate(x, gy - 40 * u - hop); c.scale((i % 2 ? -1 : 1) * k, k); c.drawImage(monImg, (m % 5) * 400, Math.floor(m / 5) * 264, 400, 264, -200, -258, 400, 264); c.restore(); });
      // Capitaine Farfouille, tout content, au milieu
      if (farfImg.complete) { const f = FARF.happy, x = PW * .5, y = gy - PH * .34 + Math.sin(t * 2) * 10 * u, k = .55 * u;
        c.fillStyle = 'rgba(160,220,255,.35)'; c.beginPath(); c.ellipse(x, y - 95 * u, 80 * u, 92 * u, 0, Math.PI, 0); c.fill(); c.fillStyle = '#9aa3c7'; c.beginPath(); c.ellipse(x, y - 8 * u, 150 * u, 30 * u, 0, 0, 7); c.fill(); c.fillStyle = '#c9d0ec'; c.beginPath(); c.ellipse(x, y - 16 * u, 130 * u, 20 * u, 0, 0, 7); c.fill();
        for (let i = 0; i < 7; i++) { c.fillStyle = Math.floor(t * 4 + i) % 2 ? '#ffe36b' : '#7ef0ff'; c.beginPath(); c.arc(x + (i - 3) * 38 * u, y - 4 * u, 6 * u, 0, 7); c.fill(); }
        c.save(); c.translate(x, y - 22 * u); c.rotate(Math.sin(t * 2.5) * .08); c.scale(k, k); c.drawImage(farfImg, f.x, 0, f.w, 300, -f.w / 2, -300, f.w, 300); c.restore(); }
      // au premier rang : Ziggy, Filou, Rose, Titan qui sautent de joie
      const front = [['ziggy', .2], ['filou', .36], ['rose', .64], ['titan', .8]];
      front.forEach(([n, fx], i) => { const x = PW * fx, ph = (t * 1.3 + i * .25) % 1, hop = Math.sin(Math.min(1, ph * 1.6) * Math.PI) * 60 * u;
        c.fillStyle = 'rgba(30,25,70,.25)'; c.beginPath(); c.ellipse(x, gy + 4, 50 * u * (1 - hop / (120 * u)), 10 * u, 0, 0, 7); c.fill();
        if (n === 'rose') { if (RF && !RW.length) RW = Object.keys(RF).filter(k => k.startsWith('rose_win')).sort((a, b) => parseInt(a.slice(8)) - parseInt(b.slice(8))); if (!RF || !roseImg.complete || !RW.length) return; const q = RF[RW[Math.floor(t * 12) % RW.length]], k = .8 * u; if (!q) { RW = []; return; } c.save(); c.translate(x, gy - hop * .5); c.scale(-k, k); c.drawImage(roseImg, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); c.restore(); return; }
        if (!S2 || !s2Img.complete) return; const L = (jumps[n] && jumps[n].length) ? jumps[n] : (jumps[n] = nf(HJ[n])); const q = S2[L.length ? L[Math.min(L.length - 1, Math.floor(ph * L.length))] : HSPR[n][0]]; if (!q) return;
        const k = .62 * u; c.save(); c.translate(x, gy - hop); c.scale((fx < .5 ? 1 : -1) * k, k); c.drawImage(s2Img, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); c.restore(); });
      // confettis
      for (const p of conf) { p.y += p.v * .016 * 3; if (p.y > 1.05) { p.y = -.05; p.x = Math.random(); } p.r += .05; const x = p.x * PW + Math.sin(t * 2 + p.r) * 12, y = p.y * PH;
        c.save(); c.translate(x, y); c.rotate(p.r); c.fillStyle = `hsl(${p.h} 90% 62%)`; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); }
      if (Math.floor(t * 1.2) !== Math.floor((t - .016) * 1.2) && t < 20) sfx.star();
    }
    requestAnimationFrame(frame);
    ov.querySelector('.pbar').addEventListener('click', (e) => { const b = e.target.closest('.pbtn'); if (!b) return; const a = b.dataset.a;
      if (a === 'home') { run = false; location.href = BACK; } else if (a === 'again') { run = false; location.reload(); } else showDiploma(); });
  }
  function showDiploma() {
    let d = document.getElementById('diploma'); if (d) { d.classList.add('show'); return; }
    d = document.createElement('div'); d.id = 'diploma'; d.className = 'show';
    const loc = LANG === 'fr' ? 'fr-BE' : LANG, date = new Date().toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' });
    d.innerHTML = `<div class="dcard"><h1>${EN.dipTitle}</h1>${KID ? `<p class="dname">${KID.replace(/[<>&]/g, '')}</p><p class="dline">${EN.dipLine}</p>` : `<p class="dline">${EN.dipLineAnon}</p>`}
      <img class="dpic" src="assets/diploma.webp?v=${V}" alt="" aria-hidden="true"><p class="ddate">${date}</p>
      <div class="dbar"><button class="pbtn" data-a="print" aria-label="🖨️">🖨️</button><button class="pbtn alt" data-a="close" aria-label="✕">✕</button></div></div>`;
    document.body.appendChild(d); say(EN.dipSay); sfx.good();
    d.querySelector('.dbar').addEventListener('click', (e) => { const b = e.target.closest('.pbtn'); if (!b) return; if (b.dataset.a === 'print') { try { window.print(); } catch (er) {} } else d.classList.remove('show'); });
  }

  // ================= dessin =================
  const cv = $('#c'); let ctx = cv.getContext('2d');   // « let » : les plateformes sont dessinées sur un calque à part pour recevoir la texture peinte
  const offA = document.createElement('canvas'), offAX = offA.getContext('2d'), offB = document.createElement('canvas'), offBX = offB.getContext('2d');
  let W = 0, H = 0, dpr = 1, zoom = 1, GY = 0, camX = 0, camY = 0;
  function resize() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; zoom = Math.min(H * .27, W * .24) / 210; GY = H * (H > W * 1.2 ? .66 : .8); }   // en portrait, on dézoome pour voir assez loin devant Rose
  addEventListener('resize', resize); resize();
  const SX = (x) => (x - camX) * zoom, SY = (y) => GY - (y - camY) * zoom;
  const bgStars = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() < .2 ? 2 : 1, tw: Math.random() * 6 }));
  const craters = Array.from({ length: 60 }, (_, i) => ({ x: i * 160 + Math.random() * 120, r: 25 + Math.random() * 55 }));
  const pebbles = Array.from({ length: 140 }, (_, i) => ({ x: i * 70 + Math.random() * 60, r: 3 + Math.random() * 5, d: 18 + Math.random() * 60 }));
  const hills = Array.from({ length: 30 }, (_, i) => ({ x: i * 420, h: 80 + Math.random() * 140, w: 300 + Math.random() * 300 }));

  const api = () => ({ ctx, W, H, GY, zoom, camX, camY, SX, SY, L, CAVE0, CAVE1, CEIL, bgStars, craters, pebbles, hills });
  // décor peint (assets/bg/<monde>.webp) : un panorama lointain qui défile lentement ; sinon le décor dessiné du monde
  const BGI = new Image(); let bgOk = false; BGI.onload = () => { bgOk = true; }; BGI.src = 'assets/bg/' + WID + '.webp?v=' + V;
  function drawBg(time) {
    if (!bgOk) { WD.drawBg(api(), time); return; }
    if (EP && EP.drawBg) { EP.drawBg(paintBg, BGI, time); return; }
    paintBg(BGI); if (WD.bgOver) WD.bgOver(api(), time);
  }
  function paintBg(img) {
    const BGI = img, hy = SY(0) + camY * zoom * .55, sc = Math.max(hy / BGI.height, (H * .5) / BGI.height), tw = BGI.width * sc, th = BGI.height * sc, top = hy - th;
    if (top > 0) { ctx.fillStyle = WD.skyTop || WD.theme; ctx.fillRect(0, 0, W, top + 2); }
    let x0 = -((camX * zoom * .18) % (tw * 2)); if (x0 > 0) x0 -= tw * 2;
    for (let i = 0, x = x0; x < W; i++, x += tw) { ctx.save(); if (i % 2) { ctx.translate(x + tw, top); ctx.scale(-1, 1); } else ctx.translate(x, top); ctx.drawImage(BGI, 0, 0, tw + (i % 2 ? 0 : 1), th); ctx.restore(); }   // une image sur deux en miroir : pas de couture visible
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(0, Math.max(0, top), W, hy - Math.max(0, top));   // un léger voile : le décor reste au loin, les personnages ressortent
  }
  // texture peinte du sol (assets/ground/*.webp, en « multiplier » : garde les couleurs du monde et ajoute cailloux, glace, plaques…)
  const GTEX = null && { lune: 'rock', mars: 'rock', venus: 'rock', mercure: 'rock', soleil: 'rock', jupiter: 'ice', saturne: 'ice', uranus: 'ice', neptune: 'ice', terre: 'metal' }[WID];
  const GTI = new Image(); let gPat = null; if (GTEX) { GTI.onload = () => { try { gPat = ctx.createPattern(GTI, 'repeat'); } catch (e) {} }; GTI.src = 'assets/ground/' + GTEX + '.webp?v=' + V; }
  function drawGround(time) {
    WD.drawGround(api(), time);
    { const gy = SY(0); ctx.fillStyle = 'rgba(35,22,55,.55)'; ctx.fillRect(0, gy - 1, W, Math.max(2, 3 * zoom)); }   // ligne du sol plus marquée
    if (gPat) { const gy = SY(0), k = zoom * .55; ctx.save(); ctx.globalCompositeOperation = 'multiply'; try { gPat.setTransform(new DOMMatrix([k, 0, 0, k, -camX * zoom, gy])); } catch (e) {} ctx.fillStyle = gPat; ctx.fillRect(0, gy, W, H - gy + 4); ctx.restore(); }
    const c0 = SX(CAVE0), c1 = SX(CAVE1), gy = SY(0);                   // l'intérieur du passage couvert, plus sombre
    if (WD.cave && c1 > 0 && c0 < W) { const g = ctx.createLinearGradient(0, SY(CEIL), 0, gy); g.addColorStop(0, WD.caveShade[0]); g.addColorStop(1, WD.caveShade[1]); ctx.fillStyle = g; ctx.fillRect(c0, SY(CEIL), c1 - c0, gy - SY(CEIL)); }
  }
  // tourbillons de poussière
  function drawWinds(time) {
    for (const w of WD.winds || []) { const a = SX(w[0]), b = SX(w[1]); if (b < 0 || a > W) continue;
      ctx.strokeStyle = 'rgba(220,240,255,.45)'; ctx.lineWidth = 3 * zoom; ctx.lineCap = 'round';
      for (let i = 0; i < 14; i++) { const len = (w[1] - w[0]), x = w[0] + (((i * 137 + time * Math.abs(w[2]) * 1.6 * Math.sign(w[2])) % len) + len) % len, y = 40 + (i * 53) % 480;
        ctx.beginPath(); ctx.moveTo(SX(x), SY(y)); ctx.lineTo(SX(x - Math.sign(w[2]) * 70), SY(y + Math.sin(time * 3 + i) * 6)); ctx.stroke(); } }
  }
  function drawDevils(time) {
    drawWinds(time);
    for (const d of devils) { const x = SX(d.x); if (x < -150 || x > W + 150) continue;
      for (let k = 0; k < 12; k++) { const y = SY(k * 34 + 10), r = (18 + k * 6.5) * zoom, off = Math.sin(d.t * 3 + k * .6) * 10 * zoom;
        ctx.strokeStyle = `rgba(${WD.liftRGB || '240,185,140'},${.42 - k * .025})`; ctx.lineWidth = (5 - k * .2) * zoom; ctx.beginPath(); ctx.ellipse(x + off, y, r, r * .28, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (let i = 0; i < 18; i++) { const hh = (i * 23 + d.t * 70) % 400, a = d.t * 4 + i * 2.1, rr = 16 + hh * .2;
        ctx.fillStyle = WD.liftDot || 'rgba(200,110,60,.7)'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr * zoom, SY(hh + 10) + Math.sin(a) * rr * .28 * zoom, 3 * zoom, 0, 7); ctx.fill(); } }
  }
  // le petit robot à six roues
  function drawRover(time) {
    const x = SX(rover.x), y = SY(0), s = zoom; if (x < -150 || x > W + 150) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(rover.face * s, s);
    ctx.strokeStyle = '#5c5f6e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, -14); ctx.lineTo(-10, -34); ctx.lineTo(40, -14); ctx.moveTo(0, -14); ctx.lineTo(-10, -34); ctx.stroke();
    for (const wx of [-40, 0, 40]) { ctx.fillStyle = '#3b3d48'; ctx.beginPath(); ctx.arc(wx, -13, 13, 0, 7); ctx.fill(); ctx.strokeStyle = '#9aa0b4'; ctx.lineWidth = 3; ctx.beginPath();
      for (let k = 0; k < 3; k++) { const a = rover.wheel + k * 2.1; ctx.moveTo(wx, -13); ctx.lineTo(wx + Math.cos(a) * 10, -13 + Math.sin(a) * 10); } ctx.stroke(); }
    const bob = rover.awake ? Math.sin(rover.t * 9) * 1.2 : 0;
    ctx.translate(0, bob);
    ctx.fillStyle = '#f1f2f6'; ctx.beginPath(); ctx.roundRect(-46, -62, 92, 30, 8); ctx.fill(); ctx.fillStyle = '#e7b342'; ctx.fillRect(-40, -54, 30, 16);
    ctx.fillStyle = '#4a6fd6'; ctx.beginPath(); ctx.roundRect(-8, -70, 52, 9, 3); ctx.fill();
    ctx.fillStyle = '#c9ccd8'; ctx.fillRect(22, -118, 6, 56);
    const look = rover.awake ? Math.sin(rover.t * 1.5) * .15 : .25;
    ctx.save(); ctx.translate(25, -122); ctx.rotate(look); ctx.fillStyle = '#f1f2f6'; ctx.beginPath(); ctx.roundRect(-18, -14, 40, 22, 7); ctx.fill();
    if (rover.awake) { ctx.fillStyle = '#26324f'; ctx.beginPath(); ctx.arc(-4, -3, 6, 0, 7); ctx.arc(12, -3, 6, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-2, -5, 2, 0, 7); ctx.arc(14, -5, 2, 0, 7); ctx.fill(); }
    else { ctx.strokeStyle = '#26324f'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-9, -3); ctx.quadraticCurveTo(-4, 1, 1, -3); ctx.moveTo(7, -3); ctx.quadraticCurveTo(12, 1, 17, -3); ctx.stroke(); }
    ctx.restore(); ctx.restore();
    if (!rover.awake) { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = `900 ${Math.round(22 * zoom)}px system-ui`; ctx.textAlign = 'center'; for (let k = 0; k < 2; k++) { const p = (time * .5 + k * .5) % 1; ctx.globalAlpha = 1 - p; ctx.fillText('z', x + (40 + p * 30) * zoom * rover.face, y - (150 + p * 50) * zoom); } ctx.globalAlpha = 1; }
  }
  // le petit hélicoptère martien
  function drawHeli(time) {
    const x = SX(heli.x), y = SY(heli.y), s = zoom; if (x < -120 || x > W + 120) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * 1.5, s * 1.5); ctx.rotate(heli.awake ? Math.max(-.25, Math.min(.25, heli.vx / 900)) : 0);
    ctx.strokeStyle = '#8a8f9e'; ctx.lineWidth = 2.5; ctx.beginPath(); for (const lx of [-1, 1]) { ctx.moveTo(lx * 9, -22); ctx.lineTo(lx * 22, 0); } ctx.stroke();
    ctx.fillStyle = '#e8e9ee'; ctx.beginPath(); ctx.roundRect(-14, -40, 28, 22, 5); ctx.fill(); ctx.fillStyle = '#d9a440'; ctx.fillRect(-10, -34, 20, 10);
    ctx.fillStyle = '#9aa0b4'; ctx.fillRect(-1.5, -64, 3, 24);
    ctx.fillStyle = '#3b4a7a'; ctx.fillRect(-12, -70, 24, 5);
    const sp = heli.awake ? time * 40 : 0;
    for (const [yy, dir] of [[-60, 1], [-52, -1]]) { const c = Math.cos(sp * dir), L2 = 44 * Math.abs(c) + 6; ctx.strokeStyle = heli.awake ? 'rgba(70,70,80,.75)' : '#4a4a55'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-L2, yy); ctx.lineTo(L2, yy); ctx.stroke();
      if (heli.awake) { ctx.fillStyle = 'rgba(200,200,210,.18)'; ctx.beginPath(); ctx.ellipse(0, yy, 50, 4, 0, 0, 7); ctx.fill(); } }
    ctx.restore();
  }
  function rockPath(x, y, w, h, seed) {             // rocher arrondi, un peu irrégulier
    ctx.beginPath(); const n = 10;
    for (let i = 0; i <= n; i++) { const t = i / n, a = Math.PI + t * Math.PI; const rx = w / 2 * (1 + Math.sin(seed + i * 1.7) * .06), ry = h * (1 + Math.cos(seed + i * 2.3) * .05);
      const px = x + w / 2 + Math.cos(a) * rx, py = y - Math.sin(a) * -ry; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath();
  }
  function polyPath(P) { ctx.beginPath(); P.forEach(([px, py], i) => i ? ctx.lineTo(SX(px), SY(py)) : ctx.moveTo(SX(px), SY(py))); ctx.closePath(); }
  let texCost = 0, texOK = true;   // sur un téléphone trop lent, on renonce à la texture des plateformes (le jeu reste fluide)
  function drawSolidsTex(time) {
    if (!gPat || !texOK) { drawSolids(time); return; }
    const t0 = performance.now();
    if (offA.width !== cv.width || offA.height !== cv.height) { offA.width = offB.width = cv.width; offA.height = offB.height = cv.height; }
    const T = ctx.getTransform(), main = ctx;
    offAX.setTransform(1, 0, 0, 1, 0, 0); offAX.globalCompositeOperation = 'source-over'; offAX.clearRect(0, 0, offA.width, offA.height); offAX.setTransform(T);
    ctx = offAX; try { drawSolids(time); } finally { ctx = main; }
    offBX.setTransform(1, 0, 0, 1, 0, 0); offBX.globalCompositeOperation = 'source-over'; offBX.clearRect(0, 0, offB.width, offB.height); offBX.drawImage(offA, 0, 0);
    offBX.globalCompositeOperation = 'source-atop'; offBX.setTransform(T); const k = zoom * .55; try { gPat.setTransform(new DOMMatrix([k, 0, 0, k, -camX * zoom, SY(0)])); } catch (e) {} offBX.fillStyle = gPat; offBX.fillRect(0, 0, W, H);
    offAX.setTransform(1, 0, 0, 1, 0, 0); offAX.globalCompositeOperation = 'multiply'; offAX.drawImage(offB, 0, 0); offAX.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(offA, 0, 0); ctx.restore();
    texCost = texCost * .95 + (performance.now() - t0) * .05; if (texCost > 6) texOK = false;
  }
  function drawSolids(time) {
    const C = WD.colors;
    for (const s of solids) {
      const x = SX(s.x), w = s.w * zoom; if (x > W + 80 || x + w < -50) continue;
      const yb = SY(s.y), yt = SY(s.y + s.h);
      if (s.kind === 'ceil') { const g = ctx.createLinearGradient(0, yt, 0, yb); g.addColorStop(0, C.ceil[0]); g.addColorStop(1, C.ceil[1]); ctx.fillStyle = g; polyPath(s.poly); ctx.fill();
        ctx.fillStyle = C.ceil[2]; for (let k = 0; k < s.w; k += 90) { const kx = SX(s.x + k); ctx.beginPath(); ctx.moveTo(kx, yb); ctx.lineTo(kx + 20 * zoom, yb + (18 + (k % 3) * 8) * zoom); ctx.lineTo(kx + 40 * zoom, yb); ctx.fill(); }
        for (let k = 60; k < s.w; k += 330) { const kx = SX(s.x + k), ky = yb + 8 * zoom, gl = .5 + .5 * Math.sin(time * 2 + k); ctx.fillStyle = `rgba(${C.crystal},${.4 + gl * .4})`; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + 9 * zoom, ky + 26 * zoom); ctx.lineTo(kx + 18 * zoom, ky); ctx.fill(); }
        continue; }
      if (s.kind === 'cloudceil') { ctx.fillStyle = C.cloud[0]; polyPath(s.poly); ctx.fill(); ctx.fillStyle = C.cloud[1]; for (let k = 0; k < s.w; k += 60) { ctx.beginPath(); ctx.arc(SX(s.x + k + 30), SY(s.y - 26 - Math.abs(Math.sin((s.x + k + 30) * .012)) * 34) - 8 * zoom, 26 * zoom, Math.PI, 0); ctx.fill(); } continue; }
      if (s.kind === 'block') { let pal = (C.block || [['#d8d0c4', '#a89c8c']])[s.c || 0]; if (EP) pal = EP.blockPal(s, pal); ctx.fillStyle = pal[0]; polyPath(s.poly); ctx.fill();
        const cols = Math.max(2, Math.floor(s.w / 85)), rows = Math.max(1, Math.floor((s.h - 50) / 70));
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const wx = SX(s.x + 34 + i * (s.w - 68) / Math.max(1, cols - 1)) - 17 * zoom, wy = SY(s.y + s.h - 36 - j * 70);
          ctx.fillStyle = (i + j) % 3 ? 'rgba(225,242,255,.95)' : 'rgba(255,228,150,.95)'; ctx.fillRect(wx, wy, 34 * zoom, 42 * zoom); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(wx, wy + 38 * zoom, 34 * zoom, 4 * zoom); }
        ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(x + w - 14 * zoom, yt, 14 * zoom, yb - yt);
        ctx.fillStyle = pal[1]; ctx.beginPath(); ctx.roundRect(x - 8 * zoom, yt - 6 * zoom, w + 16 * zoom, 18 * zoom, 6 * zoom); ctx.fill(); continue; }
      if (s.kind === 'slab') { ctx.fillStyle = C.slab[0]; polyPath(s.poly); ctx.fill(); ctx.fillStyle = C.slab[1]; ctx.beginPath(); ctx.roundRect(x, yt, w, 12 * zoom, 8 * zoom); ctx.fill(); continue; }
      if (s.kind === 'tite') { ctx.fillStyle = C.tite; polyPath(s.poly); ctx.fill(); continue; }
      if (s.kind === 'mesa' || s.kind === 'arch') {           // roche en couches, comme les falaises de Mars
        ctx.fillStyle = s.kind === 'arch' ? C.arch : C.mesa; polyPath(s.poly); ctx.fill(); ctx.save(); polyPath(s.poly); ctx.clip();
        for (let k = 0; k * 46 < s.h + 40; k++) { ctx.fillStyle = k % 2 ? 'rgba(255,190,140,.18)' : 'rgba(120,40,20,.16)'; ctx.fillRect(x - 20, SY(s.y + s.h - k * 46), w + 40, 22 * zoom); }
        ctx.fillStyle = C.mesaTop; ctx.fillRect(x - 20, yt, w + 40, 10 * zoom); ctx.restore(); continue; }
      // rochers et stalagmites
      ctx.fillStyle = (C[s.kind] || C.rock)[0]; polyPath(s.poly); ctx.fill();
      ctx.fillStyle = (C[s.kind] || C.rock)[1]; ctx.beginPath(); ctx.ellipse(x + w * .35, yt + (yb - yt) * .35, w * .12, (yb - yt) * .06, 0, 0, Math.PI * 2); ctx.ellipse(x + w * .62, yt + (yb - yt) * .6, w * .09, (yb - yt) * .05, 0, 0, Math.PI * 2); ctx.fill();
    }
    // un contour sombre autour de chaque plateforme : elles ressortent bien devant les décors peints
    ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(35,22,55,.78)'; ctx.lineWidth = Math.max(2, 3.2 * zoom);
    for (const s of solids) { if (!s.poly || s.kind === 'ceil' || s.kind === 'cloudceil') continue; const x = SX(s.x); if (x > W + 80 || x + s.w * zoom < -50) continue; polyPath(s.poly); ctx.stroke(); }
    ctx.restore();
  }
  function drawStar(x, y, r, time, bob) {
    ctx.save(); ctx.translate(x, y + Math.sin(time * 3 + bob) * 4 * zoom); ctx.fillStyle = '#ffd84a'; ctx.strokeStyle = '#e09a16'; ctx.lineWidth = 3 * zoom;
    ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7a4a10'; ctx.beginPath(); ctx.arc(-r * .2, -r * .05, r * .08, 0, 7); ctx.arc(r * .2, -r * .05, r * .08, 0, 7); ctx.fill(); ctx.restore();
  }
  const COLS = ['#ff6b8a', '#ffa94a', '#58c96b', '#4aa8ff', '#9a6bff'];
  function drawItems(time) {
    for (const s of stars) if (!s.got) { const x = SX(s.x); if (x > -40 && x < W + 40) drawStar(x, SY(s.y), 22 * zoom, time, s.x); }
    letters.forEach((l, i) => { if (l.got) return; const x = SX(l.x); if (x < -60 || x > W + 60) return; const y = SY(l.y) + Math.sin(time * 2.5 + i) * 5 * zoom, s = 54 * zoom;
      ctx.fillStyle = COLS[i % 5]; ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 12 * zoom); ctx.fill(); ctx.strokeStyle = 'rgba(35,22,55,.7)'; ctx.lineWidth = Math.max(2, 3 * zoom); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.roundRect(x - s / 2 + 4 * zoom, y - s / 2 + 4 * zoom, s - 8 * zoom, s * .35, 8 * zoom); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `900 ${Math.round(36 * zoom)}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(l.l, x, y + 2 * zoom); });
    for (const b of boxes) { const x = SX(b.x); if (x < -80 || x > W + 80) continue; const y = SY(b.y) + Math.sin(time * 2 + b.x) * 4 * zoom, s = 70 * zoom;
      ctx.globalAlpha = b.done ? .35 : 1; ctx.fillStyle = '#ffb648'; ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 14 * zoom); ctx.fill(); ctx.strokeStyle = '#b06a10'; ctx.lineWidth = 4 * zoom; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = `900 ${Math.round(46 * zoom)}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.done ? '✓' : '?', x, y + 2 * zoom); ctx.globalAlpha = 1; }
    // la fusée d'arrivée
    if (!WD.noRocket) { const x = SX(ROCKET), y = SY(0), s = zoom; if (x > -200 && x < W + 200) { ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#e9eef7'; ctx.beginPath(); ctx.moveTo(0, -330 * s); ctx.quadraticCurveTo(70 * s, -240 * s, 55 * s, -60 * s); ctx.lineTo(-55 * s, -60 * s); ctx.quadraticCurveTo(-70 * s, -240 * s, 0, -330 * s); ctx.fill();
      ctx.fillStyle = '#ff5d5d'; ctx.beginPath(); ctx.moveTo(-55 * s, -60 * s); ctx.lineTo(-95 * s, 0); ctx.lineTo(-40 * s, -10 * s); ctx.fill(); ctx.beginPath(); ctx.moveTo(55 * s, -60 * s); ctx.lineTo(95 * s, 0); ctx.lineTo(40 * s, -10 * s); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -330 * s); ctx.quadraticCurveTo(40 * s, -290 * s, 48 * s, -250 * s); ctx.lineTo(-48 * s, -250 * s); ctx.quadraticCurveTo(-40 * s, -290 * s, 0, -330 * s); ctx.fill();
      ctx.fillStyle = '#4aa8ff'; ctx.strokeStyle = '#2a5f9e'; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.arc(0, -180 * s, 26 * s, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); } }
  }
  function drawCage(c, time) {
    const x = SX(c.x), y = SY(c.y); if (x < -150 || x > W + 150) return; const s = zoom, wob = Math.sin(time * 5 + c.x) * 2 * s;
    if (!c.open && c.kind === 'mon' && monImg.complete) { const cw = 400, ch = 264, i = c.f, k = 110 / 254 * s;
      ctx.drawImage(monImg, (i % 5) * cw, Math.floor(i / 5) * ch, cw, ch, x - cw * k / 2 + wob, y - (ch - 6) * k - 8 * s, cw * k, ch * k); }
    if (!c.open && c.kind === 'flame' && S2 && s2Img.complete) { const q = S2.imp_w0, k = 120 / q.h * s; if (c.hue) ctx.filter = `hue-rotate(${c.hue}deg)`;
      ctx.drawImage(s2Img, q.x, q.y, q.w, q.h, x - q.ax * k + wob, y - q.ay * k - 8 * s, q.w * k, q.h * k); ctx.filter = 'none'; }
    const lift = c.open ? Math.min(1, c.t * 2) : 0;
    if (lift < 1) { ctx.save(); ctx.globalAlpha = 1 - lift; ctx.translate(0, -lift * 120 * s);
      ctx.fillStyle = '#7b7f99'; ctx.fillRect(x - 70 * s, y - 150 * s, 140 * s, 14 * s); ctx.fillRect(x - 70 * s, y - 10 * s, 140 * s, 10 * s);
      ctx.strokeStyle = '#6f7496'; ctx.lineWidth = 4.5 * s; for (let k = -55; k <= 55; k += 22) { ctx.beginPath(); ctx.moveTo(x + k * s, y - 138 * s); ctx.lineTo(x + k * s, y - 10 * s); ctx.stroke(); }
      ctx.fillStyle = '#ffcf4a'; ctx.beginPath(); ctx.arc(x, y - 75 * s, 12 * s, 0, 7); ctx.fill(); ctx.restore(); }
    if (!c.open) { const pu = 1 + Math.sin(time * 4 + c.x) * .1, hy = y - 190 * s + Math.sin(time * 2 + c.x) * 5 * s, br = 26 * s * pu;   // « aide-moi ! » : une bulle avec un cœur au-dessus de chaque ami en cage
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.beginPath(); ctx.arc(x, hy, br, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 7 * s, hy + br * .85); ctx.lineTo(x, hy + br + 10 * s); ctx.lineTo(x + 7 * s, hy + br * .85); ctx.fill();
      ctx.fillStyle = '#ff5c93'; heartPath(x, hy + 2 * s, 13 * s * pu); ctx.fill(); }
  }
  function drawAlien(a, time) {
    if (!AF || !alienImg.complete) return;
    let name = a.type + '_f1';
    if (a.state === 'farceur') { if (a.type === 'boing') name = a.y - (a.yb || 0) > 25 ? 'boing_f2' : 'boing_f1'; else if (a.type === 'zap') name = (a.throwT || 0) > 0 ? 'zap_f2' : 'zap_f1';
      else if (a.type === 'zigzag') name = (a.throwT || 0) > 0 ? 'zigzag_f2' : 'zigzag_f1';
      else if (a.type === 'bidou') name = a.hitT > 0 ? 'bidou_f1' : Math.floor(a.t * 2.2) % 2 ? 'bidou_f2' : 'bidou_f1'; else name = Math.floor(a.t * 3.2) % 2 ? 'glouglou_f2' : 'glouglou_f1'; }
    else if (a.state === 'gone') return;
    else if (a.state === 'bubble' && WD.boss && AF[a.type + '_ami']) name = a.type + '_ami';   // au grand final, ils deviennent amis : sourire dans la bulle
    const f = AF[name], x = SX(a.x), y = SY(a.y); if (x < -150 || x > W + 150) return;
    const pts = TSCALE[a.type] || 1, phh = f.h * ASCALE * pts * zoom, pr = Math.max(phh, f.w * ASCALE * pts * zoom) * .72; if (a.state === 'farceur') drawPowderGlow(x, y - phh / 2, pr);
    const k = zoom * ASCALE * (TSCALE[a.type] || 1), by = a.y - (a.yb || 0), sq = a.type === 'boing' && a.state === 'farceur' && by < 25 ? 1 + (25 - by) / 25 * .12 : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale((a.dir < 0 ? -1 : 1) * k * sq, k / sq);
    if (a.type === 'glouglou' && a.state === 'farceur') ctx.rotate(Math.sin(a.t * 6.4) * .06);
    if (a.state === 'bubble') { ctx.translate(0, -f.h / 2); ctx.rotate(Math.sin(a.bt * 7) * .18); const d = 1 + Math.sin(a.bt * 14) * .05; ctx.scale(d, 2 - d); ctx.translate(0, f.h / 2); }   // content d'être libéré : il danse dans sa bulle
    if (WD.sideways && a.state === 'farceur') { ctx.translate(0, -f.h * .3); ctx.rotate(-Math.PI / 2 * .92); ctx.translate(0, f.h * .3); }   // Uranus : ils se couchent sur le côté « pour se déguiser »
    if (a.type === 'bidou' && a.hitT > 0) { const w = Math.sin(a.hitT * 40) * .08; ctx.scale(1 + w, 1 - w); }        // il boude en tremblotant
    if (a.type === 'zigzag' && a.state === 'farceur') ctx.translate(0, -Math.abs(Math.sin(a.t * 4)) * 8);
    ctx.drawImage(alienImg, f.x, f.y, f.w, f.h, -f.w / 2, -f.h, f.w, f.h);
    if (WD.shades && a.state !== 'gone') { const e = SHADES[a.type] || [0, .55]; ctx.fillStyle = '#1d1d2b'; const ex = f.w * e[0], ey = -f.h * e[1], r = f.w * .13;
      ctx.beginPath(); ctx.ellipse(ex - r * 1.05, ey, r, r * .72, 0, 0, 7); ctx.ellipse(ex + r * 1.05, ey, r, r * .72, 0, 0, 7); ctx.fill(); ctx.fillRect(ex - r * .3, ey - r * .25, r * .6, r * .22);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(ex - r * 1.3, ey - r * .25, r * .22, 0, 7); ctx.arc(ex + r * .8, ey - r * .25, r * .22, 0, 7); ctx.fill(); }
    ctx.restore();
    if (a.state === 'farceur') drawPowder(x, y - phh / 2, pr, time, a.x * .01);
    if (a.state === 'bubble') { const ts = TSCALE[a.type] || 1, r = Math.max(BUBBLE_R, Math.max(f.w, f.h) * .62 * ts) * zoom, cy = y - f.h * ts * zoom / 2; const g = ctx.createRadialGradient(x - r * .3, cy - r * .3, r * .1, x, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.7, 'rgba(170,230,255,.18)'); g.addColorStop(1, 'rgba(255,170,240,.55)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.fill(); }
  }
  function powderBurst(x, y) { for (let i = 0; i < 16; i++) { const an = Math.random() * 6.28, v = 90 + Math.random() * 160; sparks.push({ x, y, vx: Math.cos(an) * v, vy: Math.sin(an) * v + 60, g: 60, t: 0, life: .9 + Math.random() * .5, kind: 'glit' }); } }
  function heartPath(x, y, r) { ctx.beginPath(); ctx.moveTo(x, y + r * .9); ctx.bezierCurveTo(x - r * 1.6, y - r * .1, x - r * .7, y - r * 1.3, x, y - r * .45); ctx.bezierCurveTo(x + r * .7, y - r * 1.3, x + r * 1.6, y - r * .1, x, y + r * .9); ctx.closePath(); }
  function drawSparks() {
    for (const q of sparks) { const x = SX(q.x), y = SY(q.y), k = q.t / q.life; ctx.globalAlpha = Math.max(0, 1 - k * k);
      if (q.kind === 'glit') { const r = (5 + 3 * Math.sin(q.t * 20)) * zoom; ctx.fillStyle = '#b678ff'; ctx.beginPath(); ctx.moveTo(x, y - r * 1.6); ctx.lineTo(x + r * .45, y); ctx.lineTo(x, y + r * 1.6); ctx.lineTo(x - r * .45, y); ctx.closePath(); ctx.fill(); }
      else if (q.kind === 'heart') { ctx.fillStyle = '#ff6fa8'; heartPath(x, y, 11 * zoom); ctx.fill(); }
      else { ctx.fillStyle = '#5b6bff'; ctx.font = `900 ${28 * zoom}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('♪', x, y); } }
    ctx.globalAlpha = 1;
  }
  // la poudre ronchon de Farfouille : un petit nuage violet qui scintille autour des farceurs (les amis, eux, n'en ont pas)
  function drawPowderGlow(cx, cy, r) { const g = ctx.createRadialGradient(cx, cy, r * .25, cx, cy, r); g.addColorStop(0, 'rgba(160,80,255,.30)'); g.addColorStop(.7, 'rgba(160,80,255,.22)'); g.addColorStop(1, 'rgba(160,80,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); }
  function drawPowder(cx, cy, r, time, seed) {
    for (let i = 0; i < 10; i++) { const an = time * (1.1 + (i % 3) * .25) * (i % 2 ? 1 : -1) + i * .63 + seed, rr = r * (.78 + .1 * Math.sin(time * 2 + i)), px = cx + Math.cos(an) * rr, py = cy + Math.sin(an) * rr * .8, tw = .5 + .5 * Math.sin(time * 6 + i * 2 + seed), s = (5 + tw * 6) * zoom;
      ctx.globalAlpha = .45 + tw * .55; ctx.fillStyle = i % 2 ? '#c99bff' : '#9d5cff'; ctx.beginPath(); ctx.moveTo(px, py - s * 1.7); ctx.lineTo(px + s * .5, py); ctx.lineTo(px, py + s * 1.7); ctx.lineTo(px - s * .5, py); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function drawFriend(f, time) {
    const x = SX(f.x), y = SY(f.y) - Math.abs(Math.sin(f.t * 5)) * 6 * zoom; if (x < -150 || x > W + 150) return;
    ctx.save(); ctx.translate(x, y);
    if (f.img === 'flame' && flameImg.complete) { const hh = 74 * zoom, ww = hh * .78; if (f.cell) ctx.filter = `hue-rotate(${f.cell}deg)`; ctx.scale(f.face || 1, 1); ctx.drawImage(flameImg, -ww / 2, -hh, ww, hh); ctx.filter = 'none'; }
    else if (monImg.complete) { const cw = 400, ch = 264, i = f.cell, k = 90 / 254 * zoom; ctx.scale(f.face || 1, 1); ctx.drawImage(monImg, (i % 5) * cw, Math.floor(i / 5) * ch, cw, ch, -cw * k / 2, -(ch - 6) * k, cw * k, ch * k); }
    ctx.restore();
    ctx.fillStyle = '#ff6fa8'; ctx.globalAlpha = .9; heartPath(x, y - 108 * zoom + Math.sin(f.t * 3) * 3 * zoom, 8 * zoom); ctx.fill(); ctx.globalAlpha = 1;   // un ami : petit cœur au-dessus de la tête
  }
  function drawShots() {
    for (const u of bubbles) { const x = SX(u.x), y = SY(u.y), r = u.r * zoom; const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.6, 'rgba(160,225,255,.45)'); g.addColorStop(1, 'rgba(255,160,240,.8)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    for (const s of slime) { const x = SX(s.x), y = SY(s.y);
      if (s.soap) { const r = 19 * zoom, g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.6, s.glitter ? 'rgba(200,150,255,.8)' : 'rgba(120,200,255,.7)'); g.addColorStop(1, s.glitter ? 'rgba(140,60,220,1)' : 'rgba(60,140,235,1)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); continue; }
      ctx.fillStyle = '#7fe060'; ctx.strokeStyle = '#3f9a2c'; ctx.lineWidth = 3 * zoom; ctx.beginPath(); ctx.arc(x, y, 14 * zoom, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(x - 4 * zoom, y - 4 * zoom, 4 * zoom, 0, 7); ctx.fill(); }
    for (const p of puffs) { const k = p.t / .6, x = SX(p.x), y = SY(p.y); ctx.globalAlpha = 1 - k; ctx.strokeStyle = p.c; ctx.lineWidth = 4 * zoom; ctx.beginPath(); ctx.arc(x, y, (14 + k * 40) * zoom, 0, 7); ctx.stroke();
      ctx.fillStyle = p.c; for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3 + p.x; ctx.beginPath(); ctx.arc(x + Math.cos(an) * (20 + k * 50) * zoom, y + Math.sin(an) * (20 + k * 50) * zoom, 4 * zoom * (1 - k), 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
  }
  function drawHelpers() {
    if (!S2 || !s2Img.complete) return;
    for (const h of helpers) { const fr = HSPR[h.n], k = h.pose || fr[Math.abs(h.vx) > 20 ? Math.floor(h.run / 38) % fr.length : 0], q = S2[k]; if (!q) continue;
      const x = SX(h.x), y = SY(h.y + (h.lift || 0)), sc = 190 / 280 * zoom; if (x < -150 || x > W + 150) continue;
      ctx.fillStyle = 'rgba(30,25,70,.22)'; ctx.beginPath(); ctx.ellipse(x, SY(h.y) + 3, 44 * zoom, 9 * zoom, 0, 0, 7); ctx.fill();
      if (h.trail > 0) for (let i = 4; i >= 1; i--) { ctx.save(); ctx.globalAlpha = h.trail * .22 / i * 2; ctx.translate(x - h.face * i * 34 * zoom, y); ctx.scale(h.face * sc, sc); ctx.drawImage(s2Img, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); ctx.restore(); }   // traînée lumineuse de Ziggy
      ctx.save(); ctx.translate(x, y - (h.shotT > 0 ? 6 * zoom : 0)); ctx.scale(h.face * sc, sc); ctx.drawImage(s2Img, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); ctx.restore(); }
  }
  function drawBoss(time) {
    if (!boss || !farfImg.complete) return; const x = SX(boss.x), y = SY(boss.yy), z = zoom; if (x < -300 || x > W + 300) return;
    const pose = boss.state === 'bubble' || boss.hitT > 0 ? 'sad' : 'joke', f = FARF[pose], sh = 190 * z / 300;
    if (boss.state !== 'bubble') {          // la soucoupe
      ctx.fillStyle = 'rgba(160,220,255,.35)'; ctx.beginPath(); ctx.ellipse(x, y - 120 * z, 105 * z, 125 * z, 0, Math.PI, 0); ctx.fill();
    }
    const wob = boss.hitT > 0 ? Math.sin(boss.hitT * 40) * 4 * z : 0;
    ctx.save(); ctx.translate(x + wob, y - (boss.state === 'bubble' ? 30 * z : 20 * z)); ctx.scale(boss.dir < 0 ? sh : -sh, sh); ctx.drawImage(farfImg, f.x, 0, f.w, 300, -f.w / 2, -300, f.w, 300); ctx.restore();
    if (boss.state !== 'bubble') {
      ctx.fillStyle = '#aab4c8'; ctx.beginPath(); ctx.ellipse(x, y - 10 * z, 150 * z, 34 * z, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#d6dceb'; ctx.beginPath(); ctx.ellipse(x, y - 20 * z, 150 * z, 22 * z, 0, Math.PI, 0); ctx.fill();
      for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + time * 3; ctx.fillStyle = `hsl(${(i * 50 + time * 120) % 360},90%,65%)`; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 120 * z, y - 6 * z + Math.sin(a) * 18 * z, 7 * z, 0, 7); ctx.fill(); }
      for (let i = 0; i < boss.hpMax; i++) { ctx.fillStyle = i < boss.hp ? '#c58cff' : 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(x + (i - (boss.hpMax - 1) / 2) * 30 * z, y + 40 * z, 9 * z, 0, 7); ctx.fill(); }
    } else { const r = 140 * z, cy = y - 125 * z, g = ctx.createRadialGradient(x - r * .3, cy - r * .3, r * .1, x, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.7, 'rgba(170,230,255,.18)'); g.addColorStop(1, 'rgba(255,170,240,.55)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.fill(); }
  }
  function roseFrame() {
    const a = rose.anim;
    if (a) return { ...sample(a.name, a.t * A[a.name].fps), set: a.name, ground: true };
    if (rose.mode === 'air') {
      const v = rose.vs, i = v >= AIR_V[1] ? 1 : 0, t0 = Math.max(0, Math.min(1, (v - AIR_V[i]) / (AIR_V[i + 1] - AIR_V[i]))), t = t0 * t0 * (3 - 2 * t0);
      const pa = AIR[i], pb = AIR[i + 1], A1 = sample(pa, rose.t * A[pa].fps), B1 = sample(pb, rose.t * A[pb].fps), da = AIR_A[i + 1] - AIR_A[i];
      return { ...(t < .5 ? A1 : B1), set: 'air', air: { A1, B1, t, rotA: da * t, rotB: -da * (1 - t), extra: -6 * Math.min(1, v / 370) } };
    }
    if (rose.walking) return { ...sample('walk', rose.walkDist / STEP_PX), set: 'walk', ground: true };
    return { ...sample('idle', rose.t * A.idle.fps), set: 'idle', ground: true };
  }
  function drawRose() {
    const f = roseFrame(); if (!RF[f.k]) return;
    const gy = f.ground ? SY(rose.base) : SY(rose.y), px = SX(rose.x);
    if (f.set !== shownSet) { if (shownSet) { fadeFrom = shown; fadeT = 0; fadeGy = lastGy; fadeLen = stopFade ? STOP_FADE : FADE; stopFade = false;
        fadeAng = (RF[fadeFrom] && RF[fadeFrom].ang) || 0; fadePivot = (lastGround && f.ground) ? 0 : PIVOT; } shownSet = f.set; }
    shown = f.mix > .5 ? f.k2 : f.k;
    const surf = SY(supportAt(rose.x, (rose.mode === 'air' ? rose.y : rose.base) + 2)), h = f.ground ? 0 : rose.y - supportAt(rose.x, rose.y + 2), sh = Math.max(.2, 1 - h / 500);
    ctx.fillStyle = `rgba(30,25,70,${.3 * sh})`; ctx.beginPath(); ctx.ellipse(px, surf + 3, 52 * zoom * sh, 11 * zoom * sh, 0, 0, Math.PI * 2); ctx.fill();
    const draw = (k, alpha, y) => { const q = RF[k]; ctx.save(); ctx.globalAlpha = alpha; ctx.translate(px, y); ctx.scale(rose.face * zoom, zoom); ctx.drawImage(roseImg, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); ctx.restore(); };
    if (f.air) {                                                        // vol : deux animations, chacune penchée vers l'autre, en fondu selon la vitesse
      const { A1, B1, t, rotA, rotB, extra } = f.air;
      const tilt = (k, alpha, deg) => { if (alpha <= .01) return; const q = RF[k]; ctx.save(); ctx.globalAlpha = alpha; ctx.translate(px, gy - PIVOT * zoom); ctx.rotate(rot(deg + extra));
        ctx.translate(0, PIVOT * zoom); ctx.scale(rose.face * zoom, zoom); ctx.drawImage(roseImg, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); ctx.restore(); };
      // l'inclinaison suit toute la plage de vitesse, mais le changement d'animation se fait d'un coup bref au milieu,
      // là où les deux sont penchées pareil : on ne voit presque jamais deux Rose superposées
      const sw = Math.max(0, Math.min(1, (t - .42) / .16)), aB = sw, aA = 1 - sw * sw;
      const pair = (S, a, deg) => { tilt(S.k, a, deg); if (S.mix > .01 && S.k2 !== S.k) tilt(S.k2, a * S.mix, deg); };
      if (t < .5) { pair(B1, aB, rotB); pair(A1, aA, rotA); } else { pair(A1, aA, rotA); pair(B1, aB, rotB); }
    } else {
      let r0 = 0, pv = 0;
      if (fadeFrom && fadeT < fadeLen) { const k0 = fadeT / fadeLen, k = k0 * k0 * (3 - 2 * k0), inAng = (RF[f.k] && RF[f.k].ang) || 0; r0 = rot((fadeAng - inAng) * (1 - k)); pv = fadePivot; }
      const drawR = (k, alpha) => { const q = RF[k]; ctx.save(); ctx.globalAlpha = alpha; ctx.translate(px, gy - pv * zoom); ctx.rotate(r0); ctx.translate(0, pv * zoom); ctx.scale(rose.face * zoom, zoom); ctx.drawImage(roseImg, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); ctx.restore(); };
      drawR(f.k, 1); if (f.mix > .01 && f.k2 !== f.k) drawR(f.k2, f.mix);
    }
    lastGy = gy; lastGround = !!f.ground;
    if (fadeFrom && fadeT < fadeLen) {
      // l'ancienne pose bascule vers l'inclinaison de la nouvelle (autour des pieds au sol, du milieu du corps en vol), puis s'efface vite
      const k0 = fadeT / fadeLen, k = k0 * k0 * (3 - 2 * k0), inAng = (RF[f.k] && RF[f.k].ang) || 0, d = inAng - fadeAng, a = 1 - Math.min(1, k0 * 1.6);
      if (a > .01) { const q = RF[fadeFrom]; ctx.save(); ctx.globalAlpha = a; ctx.translate(px, fadeGy - fadePivot * zoom); ctx.rotate(rot(d * k)); ctx.translate(0, fadePivot * zoom); ctx.scale(rose.face * zoom, zoom); ctx.drawImage(roseImg, q.x, q.y, q.w, q.h, -q.ax, -q.ay, q.w, q.h); ctx.restore(); }
    } else fadeFrom = null;
  }

  // ================= tuiles d'information (toucher un compteur en haut de l'écran) =================
  function showTile(kind) {
    let ic, n, t, line, extra = '';
    const plan = WID === 'final' ? null : 'assets/planets/' + WID + '.webp?v=' + V;
    if (kind === 'stars') { ic = '⭐'; n = got.stars; t = stars.length; line = EN.tStars; }
    else if (kind === 'letters') { ic = '🔤'; n = got.letters; t = letters.length; line = EN.tLetters; extra = '<div class="tl-letters">' + letters.map((l, i) => `<b class="${l.got ? 'on' : ''}" style="--c:${COLS[i % 5]}">${l.got ? l.l : '?'}</b>`).join('') + '</div>'; }
    else if (kind === 'friends') { if (WD.noCages) { ic = '🫧'; n = got.aliens; t = WD.epic ? WD.epic.total + 1 : aliens.length + (boss ? 1 : 0); line = EN.tBubbles; } else { ic = '💛'; n = got.friends; t = 20; line = EN.tFriends; } }
    else { ic = plan ? `<img src="${plan}" alt="">` : '🏙️'; n = -1; line = (WD.boss ? EN.tWorldBoss : EN.tWorld).replace('{w}', WD.name); }
    const txt = line.replace('{n}', n).replace('{t}', t);
    let d = document.getElementById('tile'); if (!d) { d = document.createElement('div'); d.id = 'tile'; document.body.appendChild(d); d.addEventListener('pointerdown', (e) => { e.preventDefault(); d.classList.remove('show'); paused = d.dataset.wasPaused === '1'; }); }
    d.dataset.wasPaused = paused ? '1' : '0'; paused = true;
    d.innerHTML = `<div class="tcard"><div class="tic">${ic}</div>${n >= 0 ? `<div class="tnum">${n}<small> / ${t}</small></div><div class="tbar"><i style="width:${t ? Math.round(n / t * 100) : 0}%"></i></div>` : `<div class="tname">${WD.name}</div>`}${extra}<p>${txt}</p><div class="tok">👍</div></div>`;
    d.classList.add('show'); say(txt, true); sfx.good && sfx.good();
  }
  [['#cStars', 'stars'], ['#cLetters', 'letters'], ['#cFriends', 'friends'], ['#wchip', 'world']].forEach(([sel, k]) => { const el = $(sel); if (!el) return; el.setAttribute('role', 'button'); el.tabIndex = 0; el.addEventListener('click', (e) => { e.stopPropagation(); showTile(k); }); });

  // ================= petits indices à la voix (si l'enfant ne sait plus où aller) =================
  const hint = { best: 0, idle: 0, n: 0, show: 0, tx: 0, ty: 0, gotSum: 0 };
  function updateHint(dt) {
    if (finished || (boss && boss.state === 'fight') || (EP && EP.noHint())) { hint.idle = 0; return; }
    const sum = got.friends + got.aliens + got.stars + got.letters;
    if (rose.x > hint.best + 80 || sum !== hint.gotSum) { hint.best = Math.max(hint.best, rose.x); hint.gotSum = sum; hint.idle = 0; hint.n = 0; }
    hint.show = Math.max(0, hint.show - dt); hint.idle += dt;
    if (hint.idle < (hint.n ? 18 : 13) || hint.n >= 4) return;
    hint.idle = 0; hint.n++; hint.show = 4.5; hint.go = false;
    if (EP) { const t = EP.hintTarget(); if (t) { hint.tx = t.x; hint.ty = t.y; hint.go = !!t.go; say(t.say || EN.hintAlien, true); return; } }
    const cage = cages.filter(c => !c.open && Math.abs(c.x - rose.x) < 650).sort((a, b) => Math.abs(a.x - rose.x) - Math.abs(b.x - rose.x))[0];
    const al = aliens.filter(a => a.state === 'farceur' && Math.abs(a.x - rose.x) < 700).sort((a, b) => Math.abs(a.x - rose.x) - Math.abs(b.x - rose.x))[0];
    if (cage) { hint.tx = cage.x; hint.ty = cage.y + 230; say(EN.hintCage, true); }
    else if (al) { hint.tx = al.x; hint.ty = (al.y || 0) + 260; say(EN.hintAlien, true); }
    else { hint.go = true; hint.tx = rose.x + 420; hint.ty = (rose.mode === 'air' ? rose.y : rose.base) + 150; say(EN.hintGo, true); }
  }
  function drawHint(time) {
    if (hint.show <= 0) return; const x = SX(hint.tx), y = SY(hint.ty) + Math.sin(time * 8) * 10 * zoom, s = zoom * 1.1, a = Math.min(1, hint.show * 2);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(Math.max(40, Math.min(W - 40, x)), Math.max(60, y));
    if (hint.go || x > W - 40) ctx.rotate(-Math.PI / 2); else if (x < 40) ctx.rotate(Math.PI / 2);                  // la cible est plus loin à droite : la flèche pointe vers la droite
    ctx.fillStyle = '#ffd53d'; ctx.strokeStyle = '#a66a00'; ctx.lineWidth = 5 * s; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-22 * s, -60 * s); ctx.lineTo(22 * s, -60 * s); ctx.lineTo(22 * s, -22 * s); ctx.lineTo(44 * s, -22 * s); ctx.lineTo(0, 18 * s); ctx.lineTo(-44 * s, -22 * s); ctx.lineTo(-22 * s, -22 * s); ctx.closePath(); ctx.stroke(); ctx.fill();
    ctx.restore();
  }

  // ================= le grand final (rose-final.js) : on lui prête tout ce qu'il faut =================
  if (WD.epic && MM.ROSE_EPIC) EP = MM.ROSE_EPIC({
    WD, L, EN, KID, rose, aliens, bubbles, slime, puffs, sparks, helpers, friends, stars, solids, key, got, CALM, HUES, TSCALE, FARF,
    alienImg, monImg, s2Img, flameImg, farfImg, get AF() { return AF; }, get S2() { return S2; },
    get ctx() { return ctx; }, get W() { return W; }, get H() { return H; }, get GY() { return GY; }, get zoom() { return zoom; }, get camX() { return camX; }, get camY() { return camY; }, get paused() { return paused; }, get finished() { return finished; },
    SX, SY, say, tone, sfx, chip, toKid, heartPath, alienBox, bubbleAlien, powderBurst, groundTop, supportAt, roseBox,
    finish: () => finish(), hintNow: () => { hint.idle = 99; hint.n = 0; }, stopFlying: () => { rose.vx = 0; },
  });
  // ================= boucle =================
  let last = performance.now(), started = false;
  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (RF && AF && roseImg.complete && alienImg.complete) {
      if (!started) { started = true; paused = true; MM.say = (t, parts) => say(t, true, parts); MM.hush = () => { if (MM.clips) MM.clips.stop(); try { speechSynthesis.cancel(); } catch (e) {} };
        const go = () => { paused = false; last = performance.now(); if (EP) EP.start(); else say(WD.intro); };
        if (MM.book && !MM.book.seen(WID + '_a')) MM.book.open(WID + '_a', { onDone: go }); else go(); }
      if (!paused) { update(dt); updateHint(dt); fadeT += dt; }
      const look = rose.face * 120;
      const cf = EP && EP.cam ? EP.cam() : null;   // le grand final peut cadrer autre chose que Rose (le vaisseau, la bulle géante)
      camX += (((cf && cf.x != null ? cf.x : rose.x + look) - (W * .4) / zoom) - camX) * Math.min(1, dt * (cf && cf.x != null ? 2 : 3.5)); camX = Math.max(0, Math.min(L - W / zoom, camX));
      const hy = rose.mode === 'air' ? rose.y : rose.base; let ty = Math.max(0, Math.min(CEIL - (GY / zoom) + 60, hy + 230 - GY / zoom * .82)); if (cf && cf.minY != null) ty = Math.max(ty, cf.minY);
      camY += (Math.max(0, ty) - camY) * Math.min(1, dt * 3);
      const time = now / 1000;
      if (EP) EP.frame(dt, time);
      drawBg(time); drawGround(time); drawDevils(time); drawRover(time); if (EP) EP.drawBack(time); drawSolidsTex(time); if (EP) EP.drawMid(time); drawItems(time);
      cages.forEach(c => drawCage(c, time)); aliens.forEach(a => drawAlien(a, time)); friends.forEach(f => drawFriend(f, time)); drawSparks();
      drawHelpers(); drawBoss(time); if (EP) EP.drawShip(time); drawRose(); drawHeli(time); drawShots(); if (EP) EP.drawFront(time); drawHint(time);
    } else { ctx.fillStyle = WD.theme; ctx.fillRect(0, 0, W, H); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  $('#cStars').textContent = '⭐ 0'; $('#cLetters').textContent = '🔤 0'; $('#cFriends').textContent = WD.noCages ? '🫧 0/' + (aliens.length + (boss ? 1 : 0)) : '💛 0/20';
  window.__rose = { bubbles, party: () => showParty(), bubble: (a) => bubbleAlien(a), get EP() { return EP; }, WID, helpers, get boss() { return boss; }, rover, heli, devils, rose, aliens, cages, boxes, stars, letters, friends, key, got, solids, get paused() { return paused; } };
})();
