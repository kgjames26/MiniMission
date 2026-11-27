/* =====================================================================
   Mini Mission · le grand final (rose-world.html?w=final)
   L'apothéose : la ville est devenue toute grise sous la poudre Grognon.
   Quatre actes, comme dans le livre : « Ziggy, les avenues. Filou, les toits.
   Titan, le chantier. Et moi, le ciel ! »
   - chaque quartier : des soucoupes larguent les farceurs (deux vagues) ;
     quand ils sont tous dans une bulle, le quartier retrouve ses couleurs
     (une vague de couleur balaie la rue), le héros du quartier fait son pouvoir
     et cinq des vingt amis rejoignent la parade ; le nuage de poudre qui barre
     la route s'envole ;
   - la super bulle : chaque farceur attrapé remplit le bouton bulle ; plein,
     il lance une vague de bulles de toute l'équipe ;
   - le ciel : le vaisseau géant de Capitaine Farfouille en trois temps
     (poudre, bouclier et petites soucoupes, grosse colère), puis « Tous
     ensemble ! » : tout le monde souffle une bulle géante.
   Rien n'est punitif : personne n'a mal, on ne perd jamais.
   Le moteur (rose-engine.js) appelle les crochets renvoyés ici.
   ===================================================================== */
(() => {
  'use strict';
  window.MM = window.MM || {};
  MM.ROSE_EPIC = function (E) {
    const WD = E.WD, EP = WD.epic, D = EP.districts, L = E.L, rose = E.rose;
    const T = (k) => E.EN[k];
    const say = (t, imp = true) => { if (t) E.say(t, imp); };
    const pick = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

    // ================= état =================
    let lastCatch = 0, phase = 'intro', di = 0, introT = 0, wallCd = 0, powCd = 4, meter = 0, ready = false, readySaid = false, lastShieldSay = 0, clock = 0;
    const st = D.map(() => ({ wave: -1, done: false, sweep: 0, wallA: 1, bumps: 0, t: 0 }));
    let gray = 0;                                    // pendant l'ouverture : la ville devient grise
    const saucers = [], fx = [], webs = [], rings = [];
    let wave = null, flash = 0;
    let ship = null, fin = null;

    // ================= les vingt amis (libérés dans l'espace) : 5 au départ, 5 de plus par quartier =================
    const pool = [...E.CALM.map(([, a]) => ({ img: 'mon', cell: a })), ...E.HUES.map(h => ({ img: 'flame', cell: h }))];
    const joinFriends = (n, fromSky) => { for (let i = 0; i < n && pool.length; i++) { const p = pool.shift();
      E.friends.push({ ...p, x: rose.x + (fromSky ? 300 + i * 120 : -200 - i * 60), y: fromSky ? 700 + i * 40 : 0, t: Math.random() * 6 }); } };
    joinFriends(5, false);
    E.friends.forEach((f, i) => { f.x = rose.x - 150 - i * 52; });

    // ================= couleurs : grise ou colorée selon l'endroit =================
    const front = (i) => D[i].x0 + st[i].sweep * (D[i].x1 - D[i].x0);
    function colorAt(x) {
      if (phase === 'intro') return 1 - gray;
      for (let i = 0; i < D.length; i++) if (x >= D[i].x0 && x < D[i].x1) return st[i].sweep > 0 && x < front(i) ? 1 : 0;
      return x < D[0].x0 ? (st[0].sweep > 0 ? 1 : 0) : 0;
    }
    // portions de l'écran en couleur (en pixels)
    function colorSpans() {
      const out = [];
      for (let i = 0; i < D.length; i++) { if (st[i].sweep <= 0) continue; let a = E.SX(i === 0 ? -1e5 : D[i].x0), b = E.SX(front(i)); if (i === D.length - 1 && st[i].sweep >= 1) b = 1e6;
        a = Math.max(0, a); b = Math.min(E.W, b); if (b > a) { const l = out[out.length - 1]; if (l && Math.abs(l[1] - a) < 2) l[1] = b; else out.push([a, b]); } }
      return out;
    }
    const greySpans = () => { const c = colorSpans(), out = []; let x = 0; for (const [a, b] of c) { if (a > x) out.push([x, a]); x = b; } if (x < E.W) out.push([x, E.W]); return out; };

    // le décor peint en version grise (calculé une seule fois, pas à chaque image : les téléphones restent fluides)
    let GREY = null;
    function makeGrey(img) {
      try { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
        for (let i = 0; i < p.length; i += 4) { const l = p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11; p[i] = (l * .86 + p[i] * .14) * .86; p[i + 1] = (l * .86 + p[i + 1] * .14) * .82; p[i + 2] = (l * .86 + p[i + 2] * .14) * .95; }
        x.putImageData(d, 0, 0); GREY = c; } catch (e) { GREY = img; }
    }
    const greyCache = new Map();
    function greyHex(h) { if (greyCache.has(h)) return greyCache.get(h); const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, l = r * .3 + g * .59 + b * .11;
      const out = `rgb(${Math.round((l * .85 + r * .15) * .86)},${Math.round((l * .85 + g * .15) * .82)},${Math.round((l * .85 + b * .15) * .95)})`; greyCache.set(h, out); return out; }

    // ================= les farceurs : largués par des soucoupes =================
    let nextId = 1000;
    function spawn(def, dist, fromShip) {
      const a = { type: def.type, x: def.x, x0: def.x0 != null ? def.x0 : def.x - 110, x1: def.x1 != null ? def.x1 : def.x + 110, yb: def.yb || 0, y0: def.y0 || 380,
        id: nextId++, dir: Math.random() < .5 ? -1 : 1, t: Math.random() * 3, bt: 0, cool: 1.5 + Math.random() * 2, hp: def.type === 'bidou' ? 2 : 1, hitT: 0, dist };
      a.goalY = a.type === 'zap' ? a.y0 : a.yb;
      if (def.pre) { a.state = 'farceur'; a.y = a.goalY; }
      else { a.state = 'drop'; a.y = 760; const s = { x: (fromShip ? fromShip.x : rose.x + 1100 + Math.random() * 300), y: 720, tx: a.x, ty: 640 + Math.random() * 40, st: 'in', t: 0, a, k: fromShip ? .8 : 1 };
        saucers.push(s); }
      E.aliens.push(a); return a;
    }
    const inDist = (i) => E.aliens.filter(a => a.dist === i && (a.state === 'farceur' || a.state === 'drop'));
    function startWave(i, w) {
      st[i].wave = w; const defs = D[i].waves[w] || [];
      defs.forEach((d, k) => setTimeout(() => spawn(d, i), k * 450));
      if (w > 0) { say(T('epWave')); E.sfx.beep(); }
    }

    // ================= la super bulle =================
    const bs = document.getElementById('bs');
    function setMeter(v) { meter = clamp(v, 0, 1); if (bs) bs.style.setProperty('--m', meter); const was = ready; ready = meter >= 1; if (bs) bs.classList.toggle('super', ready);
      if (ready && !was) { E.tone(784, 1568, .4, 'sine', .05); if (!readySaid || Math.random() < .5) { say(T('epReady')); readySaid = true; } } }
    function superWave() {
      setMeter(0); flash = .5; E.sfx.friend(); setTimeout(() => E.sfx.good(), 200); say(T('epSuper'));
      const h = rose.mode === 'air' ? rose.y : rose.base;
      wave = { x: rose.x, y: h + 110, r: 40, t: 0 };
      for (const hp of E.helpers) { hp.pose = { ziggy: 'ziggy_j3', filou: 'filou_s3', titan: 'titan_j3' }[hp.n]; hp.poseT = .9; }
      for (let i = 0; i < 36; i++) { const an = i / 36 * Math.PI * 2; fx.push({ x: wave.x, y: wave.y, vx: Math.cos(an) * 520, vy: Math.sin(an) * 520, t: 0, life: 1.1, kind: 'bub', r: 14 + Math.random() * 16 }); }
    }

    // ================= les pouvoirs des héros (chacun dans son quartier) =================
    const HERO = (n) => E.helpers.find(h => h.n === n);
    function nearestFarceur(x, maxD, pred) { let best = null, bd = maxD; for (const a of E.aliens) if (a.state === 'farceur' && (!pred || pred(a))) { const d = Math.abs(a.x - x); if (d < bd) { bd = d; best = a; } } return best; }
    function heroPower() {
      const n = D[di] && D[di].hero; if (!n) return; const h = HERO(n); if (!h) return;
      const a = nearestFarceur(h.x, 900); if (!a) { powCd = 1.5; return; }
      if (n === 'ziggy') {            // bond lumineux : il file comme une comète et attrape le farceur au passage
        h.dash = { from: h.x, to: a.x + Math.sign(a.x - h.x || 1) * 160, t: 0, a }; h.lock = .75; h.pose = 'ziggy_m3'; h.poseT = .75; h.face = Math.sign(a.x - h.x) || 1; h.trail = 1;
        E.tone(600, 1800, .35, 'sawtooth', .025); powCd = 6.5;
      } else if (n === 'filou') {     // fil doux : le farceur est pris dans une toile toute douce, il ne bouge plus
        h.pose = 'filou_s3'; h.poseT = .7; h.face = Math.sign(a.x - h.x) || 1; a.web = 5; h.cool = Math.min(h.cool, .6);
        webs.push({ h, a, t: 0 }); E.tone(900, 400, .25, 'triangle', .04); powCd = 6;
      } else if (n === 'titan') {     // force douce : un grand saut, la terre tremble, les farceurs ont la tête qui tourne
        h.jump = { t: 0 }; h.lock = 1; h.pose = 'titan_j3'; h.poseT = 1; h.face = Math.sign(a.x - h.x) || 1; powCd = 7;
      }
      say(T('epPow')[['ziggy', 'filou', 'titan'].indexOf(n)], false);
    }
    function updateHeroes(dt) {
      for (const h of E.helpers) {
        if (h.trail > 0) h.trail = Math.max(0, h.trail - dt * 1.6);
        if (h.dash) { const d = h.dash; d.t += dt / .55; const k = smooth(d.t); h.x = d.from + (d.to - d.from) * k; h.y = E.groundTop(h.x); h.vx = 0;
          if (d.a.state === 'farceur' && Math.abs(h.x - d.a.x) < 90) { E.bubbleAlien(d.a); burst(d.a.x, (d.a.y || 0) + 70, 14); }
          if (Math.random() < .8) fx.push({ x: h.x - h.face * 30, y: h.y + 80 + Math.random() * 60, vx: -h.face * 60, vy: 20, t: 0, life: .6, kind: 'star', c: '#ffd34f' });
          if (d.t >= 1) { h.dash = null; h.lock = 0; } }
        if (h.jump) { const j = h.jump; j.t += dt; const k = clamp(j.t / .8, 0, 1); h.lift = Math.sin(k * Math.PI) * 190; h.y = E.groundTop(h.x);
          if (k >= 1) { h.jump = null; h.lift = 0; h.lock = 0; rings.push({ x: h.x, y: h.y + 10, t: 0 }); E.tone(120, 60, .35, 'triangle', .09); E.tone(200, 90, .25, 'sine', .06, .05);
            let first = true; for (const a of E.aliens) if (a.state === 'farceur' && Math.abs(a.x - h.x) < 750) { if (first) { E.bubbleAlien(a); first = false; } else { a.dizzy = 3; if (a.type !== 'zap') a.y = (a.yb || 0) + 70; } } } }
      }
      for (let i = webs.length - 1; i >= 0; i--) { webs[i].t += dt; if (webs[i].t > .5) webs.splice(i, 1); }
      for (let i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t > .8) rings.splice(i, 1); }
    }

    // ================= un quartier qui retrouve ses couleurs =================
    function burst(x, y, n, hearts) { for (let i = 0; i < n; i++) { const an = Math.random() * 6.28, v = 120 + Math.random() * 260; fx.push({ x, y, vx: Math.cos(an) * v, vy: Math.sin(an) * v + 80, g: 260, t: 0, life: 1 + Math.random() * .6, kind: hearts && i % 2 ? 'heart' : 'conf', c: `hsl(${Math.floor(Math.random() * 360)} 90% 62%)` }); } }
    function fireworks(x0, x1) { for (let k = 0; k < 6; k++) setTimeout(() => { const x = x0 + Math.random() * (x1 - x0), y = 450 + Math.random() * 180; burst(x, y, 26, true); E.tone(300 + k * 60, 1400, .25, 'sine', .04); }, k * 260); }
    function fanfare() { [523, 659, 784, 1047].forEach((f, i) => E.tone(f, f, .22, 'square', .03, i * .12, true)); [523, 659, 784].forEach(f => E.tone(f * 2, f * 2, .9, 'triangle', .035, .5, true)); }
    function restore(i) {
      st[i].done = true; music.pause(2.4); fanfare(); flash = .35;
      const h = HERO(D[i].hero); if (h) { h.pose = { ziggy: 'ziggy_j3', filou: 'filou_s3', titan: 'titan_j3' }[h.n]; h.poseT = 1.6; }
      say(T('epDone')[i]);
      setTimeout(() => fireworks(Math.max(D[i].x0, rose.x - 700), rose.x + 700), 300);
      setTimeout(() => { if (i < 3) { joinFriends(5, true); say(T('epFriends'), false); E.sfx.friend(); } updHud(); }, 3200);
      setTimeout(() => { if (i + 1 < D.length) { di = i + 1; if (di < 3) { say(T('epD')[di]); startWave(di, 0); D[di].pre.forEach(d => spawn({ ...d, pre: true }, di)); } else say(T('epSky'), false); updHud(); } }, i < 3 ? 6200 : 0);
    }

    // ================= le vaisseau géant de Capitaine Farfouille =================
    const AR = EP.arena;
    const SK = () => clamp(E.W / E.zoom / 1400, .62, 1);   // le vaisseau un peu plus petit sur un écran étroit (portrait)                              // [x0, x1] du ciel
    function bossEnter() {
      phase = 'boss'; music.play('boss');
      ship = { x: (AR[0] + AR[1]) / 2 + 200, y: 900, yb: 360, st: 'enter', hp: 4, hitT: 0, t: 0, cool: 2.5, shield: 0, dir: -1, minis: 0, cloud: 0, caught: 0 };
      say(T('epD')[3]); updHud();
    }
    const shipBox = () => { const k = SK(); return { x0: ship.x - 230 * k, x1: ship.x + 230 * k, y0: ship.y - 30 * k, y1: ship.y + 230 * k }; };
    const vulnerable = () => ship && (ship.st === 'p1' || ship.st === 'p2') && !ship.shield;
    function hitShip(x, y) {
      if (ship.shield) { E.puffs.push({ x, y, t: 0, c: '#9fe8ff' }); E.sfx.bonk(); if (clock - lastShieldSay > 5) { lastShieldSay = clock; say(T('epShield')); } return; }
      if (ship.hitT > 0) { E.puffs.push({ x, y, t: 0, c: '#fff' }); return; }   // juste après une bulle, il tourbillonne : les suivantes rebondissent
      ship.hp--; ship.hitT = 1.1; E.sfx.pop(); burst(x, y, 10); E.puffs.push({ x, y, t: 0, c: '#d9a8ff' }); updHud();
      if (ship.hp > 0) { say(pick(E.EN.boss), false); return; }
      if (ship.st === 'p1') { ship.st = 'p2call'; ship.t = 0; ship.shield = 1; say(T('epB2')); E.sfx.beep(); }
      else if (ship.st === 'p2') { ship.st = 'tantrum'; ship.t = 0; say(T('epB3')); music.pause(99); }
    }
    function updateShip(dt) {
      const s = ship; s.t += dt; s.hitT -= dt; const hy = (rose.mode === 'air' ? rose.y : rose.base) + 100;
      if (s.st === 'enter') { s.y += (s.yb - s.y) * Math.min(1, dt * 1.4); s.x += ((AR[0] + AR[1]) / 2 + 250 - s.x) * Math.min(1, dt); if (s.t > 2.6) { s.st = 'p1'; s.t = 0; } return; }
      if (s.st === 'p1' || s.st === 'p2') {
        const sp = s.st === 'p2' ? 150 : 110; if (s.hitT <= 0) { s.x += s.dir * sp * dt; if (s.x < AR[0] + 500) s.dir = 1; if (s.x > AR[1] - 280) s.dir = -1; }
        s.y = s.yb + Math.sin(s.t * 1.4) * 60 + (s.st === 'p2' ? Math.sin(s.t * 3.1) * 30 : 0); s.cool -= dt;
        if (s.cool <= 0 && Math.abs(rose.x - s.x) < 1100) { s.cool = s.st === 'p2' ? 2.2 : 2.8;    // de la poudre Grognon : rien de méchant, Rose ralentit juste un peu
          const dx = rose.x - s.x, dy = hy - (s.y + 30), base = Math.atan2(dy, dx); E.tone(300, 600, .2, 'square', .02);
          for (const da of [-.28, 0, .28]) E.slime.push({ soap: true, glitter: true, x: s.x + Math.sign(dx) * 120, y: s.y + 30, vx: Math.cos(base + da) * 210, vy: Math.sin(base + da) * 210, life: 3.5 }); }
      } else if (s.st === 'p2call') {   // bouclier et petites soucoupes
        s.y += (s.yb + 70 - s.y) * Math.min(1, dt * 2); s.x += ((AR[0] + AR[1]) / 2 + 250 - s.x) * Math.min(1, dt * .8);
        if (s.t > 1.4 && !s.minis) { s.minis = 1; const xs = [rose.x - 420, rose.x + 380, rose.x + 640, rose.x - 150];
          ['glouglou', 'zap', 'boing', 'zigzag'].forEach((tp, k) => setTimeout(() => spawn({ type: tp, x: clamp(xs[k], AR[0] + 150, AR[1] - 150), y0: 360 }, 3, s), k * 350)); }
        if (s.minis && s.t > 3 && inDist(3).length === 0) { s.shield = 0; s.st = 'p2'; s.t = 0; s.hp = 4; say(T('epB2off')); E.sfx.good(); updHud(); }
      } else if (s.st === 'tantrum') {  // la grosse colère : il gonfle un énorme nuage de poudre… puis « Tous ensemble ! »
        s.x += ((AR[0] + AR[1]) / 2 + 280 - s.x) * Math.min(1, dt * 1.5); s.y += (s.yb + 60 - s.y) * Math.min(1, dt * 1.5); s.cloud = Math.min(1, s.cloud + dt * .5);
        if (Math.random() < .5) E.sparks.push({ x: s.x + (Math.random() - .5) * 500, y: s.y + 80 + (Math.random() - .5) * 300, vx: (Math.random() - .5) * 60, vy: -40, t: 0, life: 1.2, kind: 'glit' });
        if (s.t > 2.8) startFinale();
      } else if (s.st === 'caught') { s.caught += dt; s.y += (300 - s.y) * Math.min(1, dt * .6); s.x += Math.sin(s.caught * 1.3) * 20 * dt; }
    }

    // ================= « Tous ensemble ! » : la bulle géante =================
    function startFinale() {
      phase = 'finale'; ship.st = 'hold'; E.slime.length = 0;
      fin = { p: 0, t: 0, x: 0, y: 300, launched: 0, presses: 0, said: 0 };
      rose.face = 1; say(T('epAll')); music.play('finale');
      E.helpers.forEach((h, i) => { h.tx = null; });
      E.friends.forEach((f, i) => { f.dx = 0; });
    }
    function updateFinale(dt) {
      const f = fin; f.t += dt; const rx = rose.x, Wz = E.W / E.zoom;
      // cadrage : Rose à gauche, le vaisseau à droite, la bulle au milieu, et toute l'équipe en dessous qui souffle vers le haut
      if (!f.launched) { ship.x += (rx + Wz * (.5 + (1 - SK()) * .25) - ship.x) * Math.min(1, dt * 1.2); ship.y += (430 - ship.y) * Math.min(1, dt * 1.2); }
      if (!f.launched) { f.x = rx + Wz * .24; f.y += (390 - f.y) * Math.min(1, dt * 2); }
      E.helpers.forEach((h, i) => { h.tx = rx + 120 + i * Wz * .1; h.face = 1; h.cool = 9; });
      if (!f.launched) E.helpers.forEach(h => { if (Math.random() < dt * 1.4) { h.pose = { ziggy: 'ziggy_j3', filou: 'filou_s3', titan: 'titan_j3' }[h.n]; h.poseT = .35; } });
      const n = E.friends.length; E.friends.forEach((fr, i) => { fr.lock = .2; const tx = rx + 90 + (i / Math.max(1, n - 1)) * Wz * .36 + (i % 2) * 18, ty = (i % 2) * 14; fr.x += (tx - fr.x) * Math.min(1, dt * 2.5); fr.y += (ty - fr.y) * Math.min(1, dt * 3); fr.t += dt; fr.face = 1; });
      if (!f.launched) {
        f.p = Math.min(1, f.p + dt * .04);          // même sans appuyer, la bulle grandit : on ne reste jamais bloqué
        if (Math.random() < dt * 14) { const src = Math.random() < .3 ? E.helpers[Math.floor(Math.random() * E.helpers.length)] : E.friends[Math.floor(Math.random() * E.friends.length)] || rose;
          if (src) fx.push({ x: src.x, y: (src.y || 0) + 90, tx: f.x + (Math.random() - .5) * gbR(), ty: f.y - gbR() * .5, t: 0, life: .8, kind: 'feed', r: 8 + Math.random() * 8 }); }
        if (f.t > 6 && f.said < 1) { f.said = 1; say(T('epAllMore'), false); }
        if (f.p >= 1) { f.launched = .001; E.sfx.good(); E.tone(400, 1600, 1, 'sine', .06); }
      } else {
        f.launched += dt; const k = smooth(f.launched / 1.4); f.x += (ship.x - f.x) * k; f.y += (ship.y + 110 - f.y) * k;
        if (f.launched > 1.4 && ship.st !== 'caught') { ship.st = 'caught'; ship.caught = 0; ship.cloud = 0; flash = .7; E.sfx.pop(); E.sfx.friend(); say(E.EN.bossPop); music.stop();
          st[3].done = true; fanfare(); fireworks(AR[0] + 300, AR[1] - 200); setTimeout(() => fireworks(AR[0] + 300, AR[1] - 200), 1600);
          E.got.aliens++; setTimeout(() => { phase = 'end'; E.finish(); }, 4200); }
      }
    }
    const gbR = () => (40 + fin.p * 210) * SK();

    // ================= musique : une marche héroïque, puis le combat, puis la grande bulle =================
    const music = (() => {
      const N = (n) => { const m = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }, k = n.match(/^([A-G]#?)(\d)$/); return 440 * Math.pow(2, (m[k[1]] + (+k[2] - 4) * 12 - 9) / 12); };
      const SONGS = {
        march: { step: .14, lead: 'square', mel: 'G4 . C5 . E5 . G5 . E5 . C5 . D5 . . . F5 . E5 . D5 . C5 . D5 . G4 . . . G4 . C5 . E5 . G5 . A5 . G5 . E5 . C5 . D5 . E5 . F5 . D5 . C5 . . . G5 . . .',
          bass: 'C3 C3 G3 G3 F3 F3 G3 G3 C3 C3 F3 F3 G3 G3 C3 C3' },
        boss: { step: .12, lead: 'square', mel: 'A4 . C5 A4 E5 . A4 . G4 . B4 G4 D5 . G4 . F4 . A4 F4 C5 . F4 . E4 . G#4 B4 E5 . D5 . A4 . C5 A4 E5 . A5 . G5 . E5 . D5 . B4 . C5 . A4 . B4 . G#4 . A4 . . . E5 . . .',
          bass: 'A2 A2 G2 G2 F2 F2 E2 E2 A2 A2 G2 G2 F2 E2 A2 A2' },
        finale: { step: .16, lead: 'triangle', mel: 'C5 . E5 . G5 . C6 . . . G5 . C6 . . . A5 . F5 . A5 . C6 . . . A5 . D6 . . . B5 . G5 . B5 . D6 . . . B5 . G5 . . . C6 . G5 . E5 . G5 . C6 . . . . . . .',
          bass: 'C3 C3 F3 F3 G3 G3 C3 C3' },
      };
      let cur = null, i = 0, next = 0, timer = 0, holdUntil = 0;
      const now = () => performance.now() / 1000;
      function pump() { if (!cur) return; const S = SONGS[cur], M = S.mel.split(' '), B = S.bass.split(' ');
        if (next < now()) next = now() + .05;
        while (next < now() + .3) { const at = next - now();
          if (now() >= holdUntil) { const m = M[i % M.length]; if (m !== '.') E.tone(N(m), N(m), S.step * 1.6, S.lead, cur === 'finale' ? .045 : .02, at, true);
            if (i % 4 === 0) { const b = N(B[(i / 4 | 0) % B.length]); E.tone(b, b, S.step * 3.2, 'triangle', .065, at, true); }
            if (cur !== 'finale' && i % 2 === 1) E.tone(2200, 900, .035, 'square', .006, at, true); }
          i++; next += S.step; } }
      return {
        play(k) { cur = k; i = 0; next = 0; holdUntil = 0; if (!timer) timer = setInterval(pump, 90); },
        pause(s) { holdUntil = now() + s; },
        stop() { cur = null; clearInterval(timer); timer = 0; },
      };
    })();
    addEventListener('pagehide', () => music.stop());

    // ================= l'interface : les quatre étapes en haut de l'écran =================
    const css = document.createElement('style');
    css.textContent = `
      #epic { display: flex; gap: 6px; pointer-events: none; margin-left: 4px; }
      #epic b { width: clamp(30px, 7vmin, 40px); height: clamp(30px, 7vmin, 40px); border-radius: 50%; display: grid; place-items: center; font-size: clamp(16px, 4vmin, 22px);
        background: rgba(120,110,150,.75); border: 3px solid rgba(255,255,255,.7); filter: grayscale(.8); opacity: .75; transition: .3s; position: relative; }
      #epic b.on { background: #fff; filter: none; opacity: 1; animation: epPulse 1.2s ease-in-out infinite; border-color: #ffd34f; }
      #epic b.ok { background: linear-gradient(#ffe36b, #ffb21f); filter: none; opacity: 1; border-color: #fff; }
      #epic b.ok::after { content: '✓'; position: absolute; right: -5px; bottom: -6px; font-size: 13px; font-weight: 900; color: #fff; background: #3cb84a; border-radius: 50%; width: 17px; height: 17px; display: grid; place-items: center; }
      @keyframes epPulse { 50% { transform: scale(1.15); } }
      @media (max-width: 640px) { #epic { position: fixed; left: 50%; transform: translateX(-50%); top: calc(max(8px, env(safe-area-inset-top)) + 46px); margin: 0; } #wchip { display: none; } }
      #bs { position: relative; }
      #bs::before { content: ''; position: absolute; inset: -9px; border-radius: 50%; pointer-events: none;
        background: conic-gradient(#ff5fa8 calc(var(--m, 0) * 360deg), rgba(255,255,255,.35) 0); -webkit-mask: radial-gradient(circle, transparent 62%, #000 63%); mask: radial-gradient(circle, transparent 62%, #000 63%); }
      #bs.super { animation: epSuper .8s ease-in-out infinite; background: conic-gradient(#ff6b8a, #ffb648, #ffe36b, #6bdc7a, #4aa8ff, #9a6bff, #ff6b8a); }
      #bs.super::before { background: conic-gradient(#fff 360deg, #fff 0); }
      @keyframes epSuper { 50% { transform: scale(1.12); filter: brightness(1.2); } }
      #bs.giant { animation: epSuper .5s ease-in-out infinite; background: radial-gradient(circle at 35% 30%, #fff, #9fe3ff 45%, #ff9de0); }`;
    document.head.appendChild(css);
    const hud = document.createElement('div'); hud.id = 'epic'; hud.innerHTML = ['☄️', '🕸️', '👊', '🛸'].map(e => `<b>${e}</b>`).join('');
    const cf = document.getElementById('cFriends'); if (cf) cf.after(hud);
    function updHud() {
      [...hud.children].forEach((b, i) => { b.className = st[i].done ? 'ok' : (i === di && phase !== 'intro') ? 'on' : ''; });
      let txt;
      if (phase === 'boss' && ship) txt = (ship.shield ? '🛡️ ' + inDist(3).length : '🫧 ' + '●'.repeat(Math.max(0, ship.hp)) + '○'.repeat(4 - Math.max(0, ship.hp)));
      else if (di < 3) txt = '👾 ' + inDist(di).length; else txt = '🛸';
      if (cf && cf.textContent !== txt) E.chip('#cFriends', txt);
    }

    // ================= dessin =================
    function saucerAt(x, y, k, time, lights) {   // une soucoupe (k = taille)
      const c = E.ctx, z = E.zoom * k;
      c.fillStyle = 'rgba(170,230,255,.85)'; c.beginPath(); c.ellipse(x, y - 14 * z, 30 * z, 26 * z, 0, Math.PI, 0); c.fill();
      c.fillStyle = '#9aa3c7'; c.beginPath(); c.ellipse(x, y, 66 * z, 18 * z, 0, 0, 7); c.fill(); c.fillStyle = '#c9d0ec'; c.beginPath(); c.ellipse(x, y - 6 * z, 58 * z, 11 * z, 0, 0, 7); c.fill();
      c.strokeStyle = 'rgba(35,22,55,.7)'; c.lineWidth = Math.max(1.5, 2.2 * E.zoom); c.beginPath(); c.ellipse(x, y, 66 * z, 18 * z, 0, 0, 7); c.stroke();
      if (lights) for (let i = 0; i < 5; i++) { c.fillStyle = Math.floor(time * 5 + i) % 2 ? '#ffe36b' : '#7ef0ff'; c.beginPath(); c.arc(x + (i - 2) * 24 * z, y + 4 * z, 4.5 * z, 0, 7); c.fill(); }
    }
    function drawBg(paint, BGI, time) {
      if (!GREY) makeGrey(BGI);
      const c = E.ctx;
      if (phase === 'intro') { paint(BGI); if (gray > 0) { c.save(); c.globalAlpha = gray; paint(GREY); c.restore(); } return; }
      const sp = colorSpans();
      if (!sp.length) { paint(GREY); return; }
      if (sp.length === 1 && sp[0][0] <= 0 && sp[0][1] >= E.W) { paint(BGI); return; }
      paint(GREY);
      for (const [a, b] of sp) { c.save(); c.beginPath(); c.rect(a, 0, b - a, E.H); c.clip(); paint(BGI); c.restore(); }
    }
    function drawBack(time) {
      const c = E.ctx, z = E.zoom;
      // ouverture : le vaisseau géant traverse le ciel en déversant la poudre
      if (phase === 'intro') { const k = clamp(introT / 4, 0, 1), x = E.W * (1.25 - k * 1.5), y = E.H * .2 + Math.sin(introT * 2) * 8;
        c.fillStyle = 'rgba(160,90,240,.28)'; c.beginPath(); c.moveTo(x - 90 * z, y + 30 * z); c.lineTo(x + 90 * z, y + 30 * z); c.lineTo(x + 260 * z, E.H); c.lineTo(x - 260 * z, E.H); c.closePath(); c.fill();
        for (let i = 0; i < 30; i++) { const px = x + (Math.sin(i * 7.1) * 220) * z * ((i % 10) / 10 + .2), py = y + ((introT * 260 + i * 53) % (E.H - y)); c.fillStyle = i % 2 ? '#c99bff' : '#9d5cff'; c.beginPath(); c.arc(px, py, 3.5 * z, 0, 7); c.fill(); }
        bigShip(x, y + 40 * z, .75, time, 'joke'); }
      // la grue du chantier (quartier de Titan)
      const cr = EP.crane; if (cr) { const x = E.SX(cr), g = E.SY(0); if (x > -500 && x < E.W + 700) { const col = colorAt(cr) ? ['#ffb21f', '#d1840a'] : ['#a9a3b3', '#7d778a'];
        c.strokeStyle = col[1]; c.lineWidth = 5 * z; c.fillStyle = col[0];
        c.fillRect(x - 14 * z, E.SY(560), 28 * z, g - E.SY(560)); for (let y = 40; y < 560; y += 50) { c.beginPath(); c.moveTo(x - 14 * z, E.SY(y)); c.lineTo(x + 14 * z, E.SY(y + 50)); c.stroke(); }
        c.fillRect(x - 160 * z, E.SY(580), 620 * z, 22 * z); c.fillStyle = col[1]; c.fillRect(x - 170 * z, E.SY(575), 80 * z, 46 * z);
        c.strokeStyle = '#555'; c.lineWidth = 2.5 * z; const hx = x + 360 * z, sw = Math.sin(time * .9) * 10 * z; c.beginPath(); c.moveTo(hx, E.SY(560)); c.lineTo(hx + sw, E.SY(420)); c.stroke();
        if (st[2].done) { c.fillStyle = '#ff5c93'; E.heartPath(hx + sw, E.SY(395), 30 * z); c.fill(); c.fillStyle = '#fff'; c.font = `900 ${Math.round(22 * z)}px system-ui`; c.textAlign = 'center'; c.fillText('♥', hx + sw, E.SY(388)); }
        else { c.fillStyle = '#8a8496'; c.fillRect(hx + sw - 34 * z, E.SY(420), 68 * z, 40 * z); } } }
      // soucoupes qui tournent dans le ciel gris
      for (let i = 0; i < 4; i++) { if (phase === 'end') break; const wx = ((i * 431 + time * 40) % 1800) - 300 + E.camX * .7, x = E.SX(wx), y = E.H * (.12 + (i % 3) * .07) + Math.sin(time * 1.3 + i) * 8;
        if (x < -100 || x > E.W + 100 || colorAt(E.camX + x / z) > .5) continue; saucerAt(x, y, .45, time, true);
        c.fillStyle = 'rgba(190,120,255,.6)'; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x + Math.sin(time * 3 + k) * 6, y + 12 + ((time * 50 + k * 25 + i * 13) % 80), 2.2, 0, 7); c.fill(); } }
    }
    function drawMid(time) {
      const c = E.ctx, z = E.zoom, gy = E.SY(0);
      // le sol gris, et la poudre qui tombe sur les quartiers pas encore nettoyés
      if (phase !== 'intro' || gray > 0) for (const [a, b] of greySpans()) {
        c.fillStyle = `rgba(70,58,96,${phase === 'intro' ? .38 * gray : .38})`; c.fillRect(a, gy, b - a, E.H - gy);
        c.fillStyle = 'rgba(180,120,255,.55)'; for (let i = 0; i < 26; i++) { const px = a + ((i * 97.3 + time * 12) % Math.max(1, b - a)), py = ((i * 61.7 + time * (40 + i % 5 * 9)) % (gy + 10)); c.beginPath(); c.arc(px, py, (1.6 + i % 3) * Math.max(.6, z), 0, 7); c.fill(); } }
      // la vague de couleur qui balaie la rue
      for (let i = 0; i < D.length; i++) { const s = st[i]; if (s.sweep <= 0 || s.sweep >= 1) continue; const x = E.SX(front(i)); if (x < -60 || x > E.W + 60) continue;
        const g = c.createLinearGradient(x - 60 * z, 0, x + 10 * z, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.75)'); c.fillStyle = g; c.fillRect(x - 60 * z, 0, 70 * z, E.H);
        for (let k = 0; k < 14; k++) { const y = (k * 71 + time * 300) % E.H; c.fillStyle = `hsl(${(k * 40 + time * 200) % 360} 90% 65%)`; c.beginPath(); c.arc(x + Math.sin(time * 9 + k) * 12 * z, y, 6 * z, 0, 7); c.fill(); } }
      // guirlandes entre les immeubles des quartiers en couleur
      for (const [x0, y0, x1, y1] of EP.garlands) { if (colorAt((x0 + x1) / 2) < 1) continue; const a = E.SX(x0), b = E.SX(x1); if (b < -40 || a > E.W + 40) continue;
        const ya = E.SY(y0), yb = E.SY(y1), sag = 40 * z, n = Math.max(3, Math.round((b - a) / (34 * z)));
        c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 2 * z; c.beginPath(); for (let i = 0; i <= n; i++) { const t = i / n, x = a + (b - a) * t, y = ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        for (let i = 0; i < n; i++) { const t = (i + .5) / n, x = a + (b - a) * t, y = ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag; c.save(); c.translate(x, y); c.rotate(Math.sin(time * 3 + i) * .14); c.fillStyle = `hsl(${(i * 53 + x0) % 360} 85% 62%)`; c.beginPath(); c.moveTo(-9 * z, 0); c.lineTo(9 * z, 0); c.lineTo(0, 17 * z); c.closePath(); c.fill(); c.restore(); } }
      // les nuages de poudre qui barrent la route
      for (let i = 0; i < 3; i++) { const s = st[i]; if (s.wallA <= 0) continue; const wx = D[i].x1, x = E.SX(wx); if (x < -260 || x > E.W + 260) continue;
        c.save(); c.globalAlpha = s.wallA;
        for (let k = 0; k < 16; k++) { const yy = k * 46, r = (70 + (k % 3) * 18 + Math.sin(time * 1.7 + k) * 8) * z, ox = Math.sin(time * 1.1 + k * 1.9) * 28 * z;
          c.fillStyle = k % 2 ? 'rgba(150,90,230,.55)' : 'rgba(120,70,200,.5)'; c.beginPath(); c.arc(x + ox, E.SY(yy), r, 0, 7); c.fill(); }
        // une petite tête grognon dans le nuage
        const fy = E.SY(260 + Math.sin(time * 2) * 12); c.fillStyle = 'rgba(60,30,110,.8)'; c.beginPath(); c.arc(x - 18 * z, fy, 6 * z, 0, 7); c.arc(x + 18 * z, fy, 6 * z, 0, 7); c.fill();
        c.strokeStyle = 'rgba(60,30,110,.8)'; c.lineWidth = 4 * z; c.beginPath(); c.arc(x, fy + 26 * z, 14 * z, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
        for (let k = 0; k < 10; k++) { const p = (time * .6 + k * .1) % 1; c.fillStyle = '#d6b4ff'; c.beginPath(); c.arc(x + Math.sin(k * 3 + time) * 80 * z, E.SY(p * 620), 3 * z, 0, 7); c.fill(); }
        c.restore(); }
      // les soucoupes qui larguent les farceurs (et leur rayon)
      for (const s of saucers) { const x = E.SX(s.x), y = E.SY(s.y); if (x < -200 || x > E.W + 200) continue;
        if (s.st === 'beam') { const a = s.a, ay = E.SY(a.y + 60), g = c.createLinearGradient(0, y, 0, ay + 80 * z); g.addColorStop(0, 'rgba(255,250,170,.55)'); g.addColorStop(1, 'rgba(255,250,170,.08)');
          c.fillStyle = g; c.beginPath(); c.moveTo(x - 26 * z * s.k, y + 10 * z); c.lineTo(x + 26 * z * s.k, y + 10 * z); c.lineTo(x + 90 * z, ay + 80 * z); c.lineTo(x - 90 * z, ay + 80 * z); c.closePath(); c.fill(); }
        saucerAt(x, y, .9 * s.k, time, true); }
    }
    function bigShip(x, y, k, time, pose, hit) {   // le vaisseau géant (coordonnées écran)
      const c = E.ctx, z = E.zoom * k;
      // Farfouille sous le dôme
      if (E.farfImg.complete) { const f = E.FARF[pose], sh = 200 * z / 300; c.save(); c.translate(x + (hit > 0 ? Math.sin(hit * 40) * 5 * z : 0), y - 30 * z); c.scale(-sh, sh); c.drawImage(E.farfImg, f.x, 0, f.w, 300, -f.w / 2, -300, f.w, 300); c.restore(); }
      c.fillStyle = 'rgba(170,230,255,.33)'; c.beginPath(); c.ellipse(x, y - 34 * z, 125 * z, 150 * z, 0, Math.PI, 0); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 4 * z; c.beginPath(); c.ellipse(x, y - 34 * z, 125 * z, 150 * z, 0, Math.PI * 1.15, Math.PI * 1.45); c.stroke();
      // la coque
      c.fillStyle = '#7d86ad'; c.beginPath(); c.ellipse(x, y + 22 * z, 170 * z, 40 * z, 0, 0, Math.PI); c.fill();
      c.fillStyle = '#aab4d6'; c.beginPath(); c.ellipse(x, y, 260 * z, 48 * z, 0, 0, 7); c.fill();
      c.fillStyle = '#d6dcf2'; c.beginPath(); c.ellipse(x, y - 12 * z, 236 * z, 30 * z, 0, 0, 7); c.fill();
      c.strokeStyle = 'rgba(35,22,55,.75)'; c.lineWidth = Math.max(2, 3.5 * E.zoom); c.beginPath(); c.ellipse(x, y, 260 * z, 48 * z, 0, 0, 7); c.stroke();
      for (let i = 0; i < 11; i++) { const a = i / 11 * Math.PI * 2 + time * 2.2, lx = x + Math.cos(a) * 225 * z, ly = y + 6 * z + Math.sin(a) * 30 * z; if (Math.sin(a) < -.2) continue;
        c.fillStyle = `hsl(${(i * 33 + time * 140) % 360},95%,66%)`; c.beginPath(); c.arc(lx, ly, 10 * z, 0, 7); c.fill(); }
      c.fillStyle = '#ffd34f'; c.beginPath(); c.arc(x, y - 186 * z, 10 * z, 0, 7); c.fill(); c.strokeStyle = '#7d86ad'; c.lineWidth = 4 * z; c.beginPath(); c.moveTo(x, y - 184 * z); c.lineTo(x, y - 170 * z); c.stroke();
      // un sac de poudre Grognon accroché dessous
      c.fillStyle = '#8f5bd6'; c.beginPath(); c.ellipse(x + 120 * z, y + 66 * z, 34 * z, 40 * z, 0, 0, 7); c.fill(); c.fillStyle = '#d6b4ff'; c.font = `900 ${Math.round(30 * z)}px system-ui`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('☹', x + 120 * z, y + 70 * z);
    }
    function drawShip(time) {
      if (!ship) return; const c = E.ctx, z = E.zoom, x = E.SX(ship.x), y = E.SY(ship.y); if (x < -500 || x > E.W + 500) return;
      if (ship.cloud > 0) { const r = (260 + 240 * ship.cloud) * z, g = c.createRadialGradient(x, y - 40 * z, r * .2, x, y - 40 * z, r); g.addColorStop(0, `rgba(150,80,240,${.45 * ship.cloud})`); g.addColorStop(1, 'rgba(150,80,240,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y - 40 * z, r, 0, 7); c.fill(); }
      const shake = ship.st === 'tantrum' ? Math.sin(time * 50) * 5 * z : ship.hitT > 0 ? Math.sin(time * 30) * 8 * z * ship.hitT : 0;
      bigShip(x + shake, y, SK(), time, ship.st === 'caught' ? 'sad' : ship.hitT > 0 || ship.st === 'tantrum' ? 'sad' : 'joke', ship.hitT);
      if (ship.shield) { const r = 300 * z * SK(); c.save(); c.globalAlpha = .55 + Math.sin(time * 6) * .15; c.strokeStyle = '#9fe8ff'; c.lineWidth = 6 * z; c.beginPath(); c.ellipse(x, y - 40 * z, r, r * .82, 0, 0, 7); c.stroke();
        c.fillStyle = 'rgba(160,230,255,.15)'; c.fill(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28 + time; c.fillStyle = '#e8fbff'; c.beginPath(); c.arc(x + Math.cos(a) * r, y - 40 * z + Math.sin(a) * r * .82, 5 * z, 0, 7); c.fill(); } c.restore(); }
      if (ship.st === 'caught') { const r = 290 * z * SK(), cy = y - 40 * z * SK(), g = c.createRadialGradient(x - r * .3, cy - r * .3, r * .1, x, cy, r); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.7, 'rgba(170,230,255,.2)'); g.addColorStop(1, 'rgba(255,170,240,.6)'); c.fillStyle = g; c.beginPath(); c.arc(x, cy, r, 0, 7); c.fill();
        if (Math.random() < .2) E.sparks.push({ x: ship.x + (Math.random() - .5) * 300, y: ship.y + 200, vx: (Math.random() - .5) * 40, vy: 80, t: 0, life: 1.5, kind: 'heart' }); }
    }
    function drawFront(time) {
      const c = E.ctx, z = E.zoom;
      // fils doux de Filou
      for (const w of webs) { const h = w.h, a = w.a, k = clamp(w.t / .2, 0, 1); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 3 * z; c.beginPath(); c.moveTo(E.SX(h.x + h.face * 40), E.SY(h.y + 130)); const ex = h.x + (a.x - h.x) * k, ey = h.y + 130 + ((a.y || 0) + 70 - h.y - 130) * k; c.lineTo(E.SX(ex), E.SY(ey)); c.stroke(); }
      const S2 = E.S2;
      for (const a of E.aliens) { if (a.state !== 'farceur') continue; const x = E.SX(a.x), y = E.SY((a.y || 0) + 70); if (x < -150 || x > E.W + 150) continue;
        if (a.web > 0 && S2 && S2.filou_web && E.s2Img.complete) { const q = S2.filou_web, k = 170 / q.w * z; c.save(); c.globalAlpha = Math.min(1, a.web * 2) * .9; c.drawImage(E.s2Img, q.x, q.y, q.w, q.h, x - q.w * k / 2, y - q.h * k / 2, q.w * k, q.h * k); c.restore(); }
        if (a.dizzy > 0) for (let i = 0; i < 3; i++) { const an = time * 6 + i * 2.1; c.fillStyle = '#ffd34f'; c.font = `900 ${Math.round(24 * z)}px system-ui`; c.textAlign = 'center'; c.fillText('★', x + Math.cos(an) * 40 * z, y - 80 * z + Math.sin(an) * 10 * z); } }
      // ondes du saut de Titan
      for (const r of rings) { const x = E.SX(r.x), y = E.SY(r.y), k = r.t / .8; c.globalAlpha = 1 - k; c.strokeStyle = '#ffda56'; c.lineWidth = 8 * z * (1 - k); c.beginPath(); c.ellipse(x, y, (60 + k * 700) * z, (14 + k * 90) * z, 0, 0, 7); c.stroke(); c.globalAlpha = 1; }
      // la super bulle : une grande onde arc-en-ciel
      if (wave) { const x = E.SX(wave.x), y = E.SY(wave.y), r = wave.r * z; c.save(); c.globalAlpha = clamp(1.4 - wave.t, 0, 1); c.lineWidth = 16 * z; for (let i = 0; i < 6; i++) { c.strokeStyle = `hsl(${i * 55 + time * 200} 90% 65%)`; c.beginPath(); c.arc(x, y, r - i * 12 * z, 0, 7); c.stroke(); } c.restore(); }
      // la bulle géante de la fin
      if (fin && phase === 'finale' || (fin && ship && ship.st === 'caught' && ship.caught < .3)) { const x = E.SX(fin.x), y = E.SY(fin.y), r = gbR() * z * (1 + Math.sin(time * 5) * .03);
        const g = c.createRadialGradient(x - r * .35, y - r * .35, r * .08, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(.55, 'rgba(160,225,255,.32)'); g.addColorStop(1, 'rgba(255,150,235,.75)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        c.strokeStyle = `hsla(${time * 120 % 360},90%,70%,.8)`; c.lineWidth = 4 * z; c.stroke();
        if (!fin.launched) { c.save(); c.globalAlpha = .9; c.fillStyle = '#fff'; c.strokeStyle = '#3b2f7a'; c.lineWidth = 3; const bw = Math.min(260, E.W * .4), bx = E.W / 2 - bw / 2, by = E.W <= 640 ? 104 : 64; c.beginPath(); c.roundRect(bx, by, bw, 18, 9); c.fill(); c.stroke();
          const gr = c.createLinearGradient(bx, 0, bx + bw, 0); gr.addColorStop(0, '#ff6b8a'); gr.addColorStop(.5, '#ffe36b'); gr.addColorStop(1, '#4aa8ff'); c.fillStyle = gr; c.beginPath(); c.roundRect(bx + 3, by + 3, (bw - 6) * fin.p, 12, 6); c.fill(); c.restore(); } }
      // paillettes, confettis, étoiles
      for (const p of fx) { const k = p.t / p.life; c.globalAlpha = Math.max(0, 1 - k * k);
        if (p.kind === 'feed') { const t = smooth(k), x = E.SX(p.x + (p.tx - p.x) * t), y = E.SY(p.y + (p.ty - p.y) * t + Math.sin(t * Math.PI) * 80); c.fillStyle = 'rgba(200,240,255,.85)'; c.beginPath(); c.arc(x, y, p.r * z, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,170,240,.8)'; c.lineWidth = 1.5; c.stroke(); continue; }
        const x = E.SX(p.x), y = E.SY(p.y);
        if (p.kind === 'heart') { c.fillStyle = p.c; E.heartPath(x, y, 9 * z); c.fill(); }
        else if (p.kind === 'star') { c.fillStyle = p.c; c.font = `900 ${Math.round(22 * z)}px system-ui`; c.textAlign = 'center'; c.fillText('★', x, y); }
        else if (p.kind === 'bub') { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2.5 * z; c.fillStyle = 'rgba(170,230,255,.3)'; c.beginPath(); c.arc(x, y, p.r * z, 0, 7); c.fill(); c.stroke(); }
        else { c.fillStyle = p.c; c.save(); c.translate(x, y); c.rotate(p.t * 8 + p.x); c.fillRect(-5 * z, -2.5 * z, 10 * z, 5 * z); c.restore(); } }
      c.globalAlpha = 1;
      if (flash > 0) { c.fillStyle = `rgba(255,255,255,${Math.min(.6, flash)})`; c.fillRect(0, 0, E.W, E.H); }
    }

    // ================= la mise à jour =================
    function update(dt, B) {
      clock += dt; wallCd -= dt;
      // ouverture
      if (phase === 'intro') { introT += dt; gray = smooth((introT - 1.2) / 2.2);
        if (introT > 4.4) { phase = 'play'; gray = 1; say(T('epD')[0]); startWave(0, 0); D[0].pre.forEach(d => spawn({ ...d, pre: true }, 0)); music.play('march'); updHud(); } }
      // couleurs qui reviennent, nuages qui s'envolent
      for (let i = 0; i < D.length; i++) { const s = st[i]; if (s.done) { s.sweep = Math.min(1, s.sweep + dt / (i === 3 ? 2.5 : 1.8)); if (s.sweep > .35 && i < 3) s.wallA = Math.max(0, s.wallA - dt); } }
      // soucoupes : elles arrivent, posent le farceur avec leur rayon, repartent
      for (let i = saucers.length - 1; i >= 0; i--) { const s = saucers[i]; s.t += dt;
        if (s.st === 'in') { s.x += clamp((s.tx - s.x) * 3, -1500, 1500) * dt; s.y += (s.ty - s.y) * Math.min(1, dt * 2.4); s.a.x = s.x; if (Math.abs(s.x - s.tx) < 12) { s.st = 'beam'; s.t = 0; E.tone(500, 1200, .5, 'sine', .025); } }
        else if (s.st === 'beam') { const a = s.a; a.y = Math.max(a.goalY, a.y - 430 * dt); if (a.y <= a.goalY + .5) { a.y = a.goalY; a.state = 'farceur'; s.st = 'out'; s.t = 0; updHud(); } }
        else { s.y += 260 * dt; s.x += 340 * dt; if (s.t > 2.5) saucers.splice(i, 1); } }
      // le quartier en cours
      if (phase === 'play' && di < 3 && !st[di].done) {
        const left = inDist(di).length + saucers.filter(s => s.a.dist === di && s.st === 'in').length;
        if (left === 0 && st[di].wave >= 0 && !saucers.some(s => s.a.dist === di && s.st !== 'out')) {
          if (st[di].wave + 1 < D[di].waves.length) startWave(di, st[di].wave + 1); else restore(di); }
        powCd -= dt; if (powCd <= 0) heroPower();
        // filet de sécurité : si les derniers farceurs restent hors d'atteinte trop longtemps, ils viennent narguer Rose bien en vue
        const rest = inDist(di).filter(a => a.state === 'farceur');
        if (rest.length && rest.length <= 2 && clock - lastCatch > 22 && !saucers.some(s => s.a.dist === di && s.st !== 'out')) { lastCatch = clock; taunt(rest); }
        // contre le nuage : on explique, on montre la flèche ; s'il ne reste qu'un ou deux farceurs, ils reviennent narguer Rose
        if (rose.x >= maxX() - 6 && E.key.r && wallCd <= 0) { wallCd = 5; st[di].bumps++; say(T('epWall')); E.hintNow();
          const rest = inDist(di).filter(a => a.state === 'farceur'); if (st[di].bumps >= 2 && rest.length && rest.length <= 3) setTimeout(() => taunt(rest, -1), 1800); }
      }
      updateHeroes(dt);
      // le ciel
      if (phase === 'play' && di === 3 && !ship && rose.x > D[3].x0 + 260) bossEnter();
      if (ship) updateShip(dt);
      if (phase === 'finale') updateFinale(dt);
      if (wave) { wave.t += dt; wave.r += 1500 * dt;
        for (const a of E.aliens) if (a.state === 'farceur' && Math.hypot(a.x - wave.x, (a.y || 0) + 60 - wave.y) < wave.r) { E.bubbleAlien(a); burst(a.x, (a.y || 0) + 70, 6); }
        if (ship && vulnerable() && !wave.hitShip && Math.hypot(ship.x - wave.x, ship.y + 80 - wave.y) < wave.r) { wave.hitShip = 1; hitShip(ship.x, ship.y + 60); }
        if (wave.t > 1.4) wave = null; }
      for (let i = fx.length - 1; i >= 0; i--) { const p = fx[i]; p.t += dt; if (p.kind !== 'feed') { p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= (p.g || 0) * dt; } if (p.t > p.life) fx.splice(i, 1); }
      if (fx.length > 260) fx.splice(0, fx.length - 260);
      flash = Math.max(0, flash - dt * 1.4);
      if (bs) bs.classList.toggle('giant', phase === 'finale' && !!fin && !fin.launched);
      if ((clock * 4 | 0) !== ((clock - dt) * 4 | 0)) updHud();
    }
    function taunt(list, side) {   // « coucou ! » : les farceurs réapparaissent près de Rose, sur le sol libre le plus proche
      list.forEach((a, k) => { if (a.state !== 'farceur') return; E.puffs.push({ x: a.x, y: (a.y || 0) + 60, t: 0, c: '#d6b4ff' });
        const sd = side || (rose.face || 1); let x = clamp(rose.x + sd * (380 + k * 170), D[di].x0 + 80, D[di].x1 - 140);
        const gt = E.groundTop(x), roof = gt > 0 ? E.solids.find(q => q.kind === 'block' && x >= q.x && x <= q.x + q.w) : null; a.x = x; a.x0 = roof ? Math.max(roof.x + 50, x - 90) : x - 90; a.x1 = roof ? Math.min(roof.x + roof.w - 50, x + 90) : x + 90; a.yb = gt; a.y0 = Math.max(300, gt + 160); a.y = a.type === 'zap' ? a.y0 : gt; a.web = 0; a.dizzy = 0;
        E.puffs.push({ x: a.x, y: a.y + 60, t: 0, c: '#d6b4ff' }); burst(a.x, a.y + 80, 8); });
      E.sfx.beep(); E.hintNow();
    }
    function maxX() {
      if (phase === 'intro') return rose.x;
      for (let i = 0; i < 3; i++) if (st[i].wallA > .2) return D[i].x1 - 70;
      return L - 60;
    }

    // ================= les crochets pour le moteur =================
    return {
      start() { introT = 0; say(WD.intro); E.tone(200, 90, 1.2, 'sawtooth', .03); updHud(); },
      locked: () => phase === 'intro' || phase === 'finale' || phase === 'end',
      maxX,
      update, frame() {},
      onBubble(a) { lastCatch = clock; if (phase !== 'finale') setMeter(meter + (a.dist === 3 ? .2 : 1 / 7)); updHud(); },
      shoot() {
        if (phase === 'finale' && fin && !fin.launched) { fin.p = Math.min(1, fin.p + .055); fin.presses++; E.sfx.bubble(); for (let i = 0; i < 3; i++) fx.push({ x: rose.x, y: rose.base + 120, tx: fin.x, ty: fin.y, t: 0, life: .5, kind: 'feed', r: 10 }); return true; }
        if (phase === 'finale' || phase === 'end' || phase === 'intro') return true;
        if (ready) { superWave(); return true; }
        return false;
      },
      target(u) { return !u.h && vulnerable() ? [ship.x, ship.y + 90] : null; },
      bubbleHit(u) { if (u.h || !ship || !(ship.st === 'p1' || ship.st === 'p2' || ship.st === 'p2call')) return false; const b = shipBox(); if (u.x > b.x0 && u.x < b.x1 && u.y > b.y0 && u.y < b.y1) { if (ship.st === 'p2call' && !ship.shield) return false; hitShip(u.x, u.y); return true; } return false; },
      helperTarget() { return null; },   // le vaisseau, c'est l'enfant qui l'attrape : les héros s'occupent des farceurs
      helperShot() {},
      hintTarget() {
        if (phase !== 'play') return null;
        if (di < 3) { const rest = inDist(di).filter(a => a.state === 'farceur').sort((a, b) => Math.abs(a.x - rose.x) - Math.abs(b.x - rose.x))[0]; if (rest) return { x: rest.x, y: (rest.y || 0) + 260 }; return null; }
        return { go: true, x: rose.x + 420, y: (rose.mode === 'air' ? rose.y : rose.base) + 150, say: E.EN.hintGo };
      },
      noHint: () => phase !== 'play' || !!ship,
      cam() {
        if (fin && ship) return { x: rose.x + E.W / E.zoom * (.14 + (1 - SK()) * .15), minY: 140 };
        const Wz = E.W / E.zoom;
        if (ship && ship.st !== 'enter' && Math.abs(ship.x - rose.x) < Wz * 1.15) return { x: (rose.x + ship.x) / 2 - Wz * .1, minY: 110 };
        if (ship) return { minY: 110 };
        return null;
      },
      blockPal(s, pal) { if (colorAt(s.x + s.w / 2) >= 1) return pal; return [greyHex(pal[0]), greyHex(pal[1])]; },
      drawBg, drawBack, drawMid, drawShip, drawFront,
      dbg: { get phase() { return phase; }, get di() { return di; }, st, get ship() { return ship; }, get fin() { return fin; }, get meter() { return meter; }, setMeter, saucers },   // pour les tests
    };
  };
})();
