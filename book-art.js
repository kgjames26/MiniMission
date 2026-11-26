/* Mini Mission — illustrations du livre dessinées par le jeu (canvas), avec les vrais personnages du jeu.
   MM.bookArt['<livre>-<double page>'] = async (c, K) => { … } ; c = contexte 2000×750 ; K = boîte à outils (images, personnages, décors). */
(() => {
  const MM = (window.MM = window.MM || {});
  const W = 2000, H = 750;
  const IM = {}, img = (s) => IM[s] || (IM[s] = new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = s; }));
  const JS = {}, json = (s) => JS[s] || (JS[s] = fetch(s).then(r => r.json()).catch(() => null));
  async function kit() {
    const [heroes, s2, s2j, mons, al, alj, rose, rosej, flame, card] = await Promise.all([img('assets/heroes-hd.webp'), img('assets/sprites2.webp'), json('assets/sprites2.json'), img('assets/monsters.webp'),
      img('assets/aliens.webp'), json('assets/aliens.json'), img('assets/rose.webp'), json('assets/rose.json'), img('assets/friend-flame.webp'), img('assets/rose-card.webp')]);
    return { heroes, s2, s2j, mons, al, alj, rose, rosej, flame, card };
  }
  // ---------- outils de dessin ----------
  const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  function shadow(c, x, y, w, a = .25) { c.save(); c.fillStyle = `rgba(30,20,40,${a})`; c.beginPath(); c.ellipse(x, y, w, w * .18, 0, 0, 7); c.fill(); c.restore(); }
  // un personnage : source (image + case), posé les pieds en (x, y), haut de h pixels, retourné, penché
  function put(c, src, x, y, h, o = {}) {
    if (!src || !src[0]) return; const [im, sx, sy, sw, sh] = src, w = sw / sh * h;
    if (o.shadow !== false) shadow(c, x, y + 2, w * .42, o.sa || .22);
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); c.scale(o.flip ? -1 : 1, 1); if (o.alpha) c.globalAlpha = o.alpha;
    c.drawImage(im, sx, sy, sw, sh, -w / 2, -h, w, h); c.restore(); return { x, y, w, h };
  }
  const S = {
    hero: (K, h) => { const hw = K.heroes.width / 4, hh = K.heroes.height / 3; return [K.heroes, (h === 'ziggy' ? 0 : 2) * hw, { ziggy: 0, filou: 1, titan: 2 }[h] * hh, hw, hh]; },
    pose: (K, k) => { const q = K.s2j && K.s2j[k]; return q ? [K.s2, q.x, q.y, q.w, q.h] : null; },
    mon: (K, i) => { const cv = tightMon(K, i); return cv ? [cv, 0, 0, cv.width, cv.height] : null; },
    al: (K, k) => { const q = K.alj && K.alj[k]; return q ? [K.al, q.x, q.y, q.w, q.h] : null; },
    rose: (K, k) => { const q = K.rosej && K.rosej[k]; return q ? [K.rose, q.x, q.y, q.w, q.h] : null; },
    flame: (K) => K.flame ? [K.flame, 0, 0, K.flame.width, K.flame.height] : null,
  };
  const MC = {};
  function tightMon(K, i) {   // les cases des monstres ont du vide autour : on le coupe une fois
    if (MC[i]) return MC[i]; if (!K.mons) return null;
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = 264; const x = cv.getContext('2d'); x.drawImage(K.mons, (i % 5) * 400, Math.floor(i / 5) * 264, 400, 264, 0, 0, 400, 264);
    const d = x.getImageData(0, 0, 400, 264).data; let x0 = 400, y0 = 264, x1 = 0, y1 = 0;
    for (let y = 0; y < 264; y++) for (let xx = 0; xx < 400; xx++) if (d[(y * 400 + xx) * 4 + 3] > 20) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(cv, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return (MC[i] = o);
  }
  function cloud(c, x, y, s, a = .9) { c.save(); c.fillStyle = `rgba(255,255,255,${a})`; c.beginPath(); for (const [dx, dy, r] of [[0, 0, 40], [42, -18, 48], [92, 0, 38], [50, 14, 40]]) c.moveTo(x + dx * s + r * s, y + dy * s), c.arc(x + dx * s, y + dy * s, r * s, 0, 7); c.fill(); c.restore(); }
  function glitter(c, x, y, r, t = 0) {   // la poudre Grognon : petit nuage violet pailleté
    c.save(); c.fillStyle = 'rgba(170,110,240,.55)'; c.beginPath(); c.arc(x, y, r, 0, 7); c.arc(x + r * .8, y + 3, r * .75, 0, 7); c.arc(x - r * .8, y + 4, r * .7, 0, 7); c.fill();
    const R = rnd(Math.round(x * 7 + y)); for (let i = 0; i < 14; i++) { c.fillStyle = i % 3 ? '#fff' : '#e7c8ff'; const a = R() * 7, d = R() * r * 1.8; star4(c, x + Math.cos(a) * d, y + Math.sin(a) * d * .6, 2 + R() * 4); } c.restore();
  }
  function star4(c, x, y, r) { c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r * .3, y - r * .3); c.lineTo(x + r, y); c.lineTo(x + r * .3, y + r * .3); c.lineTo(x, y + r); c.lineTo(x - r * .3, y + r * .3); c.lineTo(x - r, y); c.lineTo(x - r * .3, y - r * .3); c.closePath(); c.fill(); }
  function speed(c, x, y, len, n, col = 'rgba(255,255,255,.85)', dir = -1) { c.save(); c.strokeStyle = col; c.lineCap = 'round'; for (let i = 0; i < n; i++) { c.lineWidth = 6 - i * .6; const yy = y + (i - n / 2) * 22; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + dir * len * (1 - i * .08), yy); c.stroke(); } c.restore(); }
  function croissant(c, x, y, s, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.strokeStyle = '#7a4416'; c.lineWidth = 2.5;
    const seg = [[-30, 6, 11, -.9], [-17, -6, 14, -.45], [0, -10, 16, 0], [17, -6, 14, .45], [30, 6, 11, .9]];
    for (const [sx, sy, r, a] of seg) { const g = c.createRadialGradient(sx - r * .3, sy - r * .4, 1, sx, sy, r * 1.2); g.addColorStop(0, '#ffe2a0'); g.addColorStop(.6, '#e7a24a'); g.addColorStop(1, '#b8691f');
      c.fillStyle = g; c.beginPath(); c.ellipse(sx, sy, r * .8, r, a, 0, 7); c.fill(); c.stroke(); }
    c.restore();
  }
  function anger(c, x, y, s) {   // le petit signe de colère des dessins animés
    c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#e8322e'; c.lineWidth = 6; c.lineCap = 'round';
    for (const [a, b] of [[[-12, -4], [-4, -4]], [[-4, -12], [-4, -4]], [[4, -12], [4, -4]], [[4, -4], [12, -4]], [[-12, 4], [-4, 4]], [[-4, 4], [-4, 12]], [[4, 4], [12, 4]], [[4, 4], [4, 12]]]) { c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); }
    c.restore();
  }
  // ---------- décors ----------
  function eiffel(c, x, base, s, col = '#7d6a5a', light = '#a8917c') {
    c.save(); c.translate(x, base); c.scale(s, s); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 3;
    const leg = (sgn) => { c.beginPath(); c.moveTo(sgn * 120, 0); c.quadraticCurveTo(sgn * 60, -150, sgn * 34, -300); c.lineTo(sgn * 14, -560); c.lineTo(sgn * 4, -640); c.lineTo(0, -640); c.lineTo(0, -300); c.lineTo(sgn * 70, 0); c.closePath(); c.fill(); };
    leg(-1); leg(1); c.fillStyle = '#c9e6fb';
    c.beginPath(); c.moveTo(-74, 0); c.quadraticCurveTo(0, -150, 74, 0); c.closePath(); c.fill();       // la grande arche
    c.strokeStyle = light; c.lineWidth = 2; for (let y = -20; y > -560; y -= 26) { const w = 120 - (-y) * .19; c.beginPath(); c.moveTo(-w * .62, y); c.lineTo(w * .62, y - 26); c.moveTo(w * .62, y); c.lineTo(-w * .62, y - 26); c.stroke(); }
    c.fillStyle = col; c.fillRect(-58, -300, 116, 14); c.fillRect(-30, -470, 60, 10); c.fillRect(-6, -700, 12, 70); c.restore();
  }
  function haussmann(c, x, base, w, h, R, col) {
    c.fillStyle = col; c.fillRect(x, base - h, w, h);
    c.fillStyle = '#6f7f95'; c.beginPath(); c.moveTo(x - 6, base - h); c.lineTo(x + 18, base - h - 60); c.lineTo(x + w - 18, base - h - 60); c.lineTo(x + w + 6, base - h); c.fill();   // toit d'ardoise
    for (let k = 0; k < w / 70; k++) { c.fillStyle = '#7d8da3'; c.fillRect(x + 22 + k * 70, base - h - 50, 22, 30); }
    c.fillStyle = '#9a6a4a'; c.fillRect(x + w * .2, base - h - 82, 16, 30); c.fillRect(x + w * .7, base - h - 76, 16, 26);
    for (let r = 0; r < 4; r++) for (let k = 0; k < Math.floor(w / 70); k++) { const wx = x + 18 + k * 70, wy = base - h + 22 + r * (h / 4.4);
      c.fillStyle = '#e9f3fb'; c.fillRect(wx, wy, 32, 48); c.fillStyle = '#9fc4de'; c.fillRect(wx + 3, wy + 3, 12, 42); c.fillRect(wx + 17, wy + 3, 12, 42);
      if (r % 2 === 0) { c.fillStyle = '#2f3440'; c.fillRect(wx - 5, wy + 44, 42, 5); for (let b = 0; b < 6; b++) c.fillRect(wx - 3 + b * 8, wy + 34, 2, 12); } }
    c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x, base - h, 6, h);
  }
  function earth(c, x, y, r) {
    const g = c.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#7fd0ff'); g.addColorStop(.7, '#2f7fe0'); g.addColorStop(1, '#1a4aa0');
    c.save(); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.clip(); c.fillStyle = '#5fbf68';
    for (const [dx, dy, rx, ry, a] of [[-.35, -.15, .32, .2, .6], [.25, .2, .22, .32, -.3], [.4, -.45, .18, .1, .2], [-.15, .5, .25, .1, .1]]) { c.beginPath(); c.ellipse(x + dx * r, y + dy * r, rx * r, ry * r, a, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.75)'; for (const [dx, dy, rx] of [[-.1, -.55, .4], [.3, .05, .3], [-.5, .25, .25]]) { c.beginPath(); c.ellipse(x + dx * r, y + dy * r, rx * r, .06 * r, -.2, 0, 7); c.fill(); }
    c.restore(); c.save(); c.strokeStyle = 'rgba(140,210,255,.5)'; c.lineWidth = r * .08; c.beginPath(); c.arc(x, y, r * 1.02, 0, 7); c.stroke(); c.restore();
  }
  function stars(c, n, seed, maxY = H) { const R = rnd(seed); for (let i = 0; i < n; i++) { const x = R() * W, y = R() * maxY, s = R(); c.fillStyle = `rgba(255,250,230,${.4 + s * .6})`; if (s > .93) star4(c, x, y, 5); else c.fillRect(x, y, s > .6 ? 3 : 2, s > .6 ? 3 : 2); } }
  function moonGround(c, top, seed) {
    const g = c.createLinearGradient(0, top, 0, H); g.addColorStop(0, '#c9cbd8'); g.addColorStop(1, '#8e91a6'); c.fillStyle = g;
    c.beginPath(); c.moveTo(0, top + 20); for (let x = 0; x <= W; x += 40) c.lineTo(x, top + Math.sin(x * .004) * 18 + Math.sin(x * .013) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fill();
    const R = rnd(seed); for (let i = 0; i < 26; i++) { const x = R() * W, y = top + 40 + R() * (H - top - 60), r = 20 + R() * 70 * ((y - top) / (H - top) + .3);
      c.fillStyle = 'rgba(80,80,110,.28)'; c.beginPath(); c.ellipse(x, y, r, r * .28, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(x, y - r * .05, r * .85, r * .2, 0, Math.PI, 0); c.fill(); }
  }
  function cage(c, x, base, w, h) {
    c.save(); c.fillStyle = '#5d6178'; c.fillRect(x - w / 2 - 6, base - h - 10, w + 12, 14); c.fillRect(x - w / 2 - 6, base - 6, w + 12, 10);
    c.strokeStyle = '#8a8fa8'; c.lineWidth = 7; for (let k = 0; k <= 6; k++) { const bx = x - w / 2 + k * w / 6; c.beginPath(); c.moveTo(bx, base - h); c.lineTo(bx, base - 4); c.stroke(); }
    c.fillStyle = '#ffd54a'; c.beginPath(); c.arc(x, base - h * .45, 9, 0, 7); c.fill(); c.restore();
  }
  function tongue(c, x, y, s) { c.save(); c.fillStyle = '#ff6f8f'; c.strokeStyle = '#a8324e'; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, 10 * s, 14 * s, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
  function radio(c, K, x, y, r) {   // Rose qui parle dans son poste : on voit son visage dans l'écran rond
    c.save(); c.fillStyle = '#b0472a'; c.beginPath(); c.roundRect(x - r * 1.25, y - r * 1.15, r * 2.5, r * 2.35, r * .35); c.fill();
    c.strokeStyle = '#3c4652'; c.lineWidth = 6; c.beginPath(); c.moveTo(x + r * .8, y - r * 1.1); c.lineTo(x + r * 1.4, y - r * 1.9); c.stroke(); c.fillStyle = '#ffcf4a'; c.beginPath(); c.arc(x + r * 1.4, y - r * 1.9, 9, 0, 7); c.fill();
    c.fillStyle = '#dff3ff'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.clip();
    if (K.card) { const cw = K.card.width, ch = K.card.height; c.drawImage(K.card, cw * .2, ch * .02, cw * .6, ch * .42, x - r * 1.05, y - r * 1.0, r * 2.1, r * 2.1 * (ch * .42) / (cw * .6)); }
    c.restore(); c.save(); c.strokeStyle = '#7a2a14'; c.lineWidth = 8; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 5; for (let k = 1; k <= 3; k++) { c.beginPath(); c.arc(x - r * 1.3, y, r * .25 * k, Math.PI * .75, Math.PI * 1.25); c.stroke(); } c.restore();
  }
  function crane(c, x, base, s) {
    c.save(); c.translate(x, base); c.scale(s, s); c.strokeStyle = '#f2b53a'; c.lineWidth = 5; c.strokeRect(-12, -420, 24, 420); for (let y = -420; y < 0; y += 24) { c.beginPath(); c.moveTo(-12, y); c.lineTo(12, y + 24); c.stroke(); }
    c.strokeRect(-90, -440, 330, 20); for (let xx = -90; xx < 240; xx += 24) { c.beginPath(); c.moveTo(xx, -440); c.lineTo(xx + 24, -420); c.stroke(); }
    c.fillStyle = '#5d6b7a'; c.fillRect(-100, -442, 34, 30); c.strokeStyle = '#3c4652'; c.lineWidth = 2; c.beginPath(); c.moveTo(190, -420); c.lineTo(190, -260); c.stroke(); c.fillStyle = '#ef4b43'; c.fillRect(160, -260, 60, 18); c.restore();
  }
  MM.bookArt = {
    // ===== Paris, avant : les monstres grognons volent des croissants ; les 3 héros partent, Rose les guide à la radio =====
    'c0a-0': async (c) => {
      const K = await kit(), GY = 610;
      const sky = c.createLinearGradient(0, 0, 0, GY); sky.addColorStop(0, '#6fc3f7'); sky.addColorStop(1, '#fff0d6'); c.fillStyle = sky; c.fillRect(0, 0, W, H);
      const sg = c.createRadialGradient(1700, 110, 10, 1700, 110, 160); sg.addColorStop(0, 'rgba(255,250,210,1)'); sg.addColorStop(1, 'rgba(255,250,210,0)'); c.fillStyle = sg; c.fillRect(1500, 0, 400, 300);
      cloud(c, 120, 110, 1.1); cloud(c, 820, 70, .9); cloud(c, 1350, 150, .8, .8);
      eiffel(c, 1080, GY - 40, .78);
      const R = rnd(7); [[-30, 300, '#f3e6d0'], [300, 260, '#ecdcc2'], [560, 220, '#f1e2cf'], [1290, 240, '#efe0c6'], [1560, 280, '#f4e8d6'], [1860, 260, '#ecdcc2']].forEach(([x, h, col]) => haussmann(c, x, GY - 40, 250, h, R, col));
      crane(c, 1840, GY - 40, .9);
      // la boulangerie
      c.fillStyle = '#7a3e2a'; c.fillRect(30, GY - 330, 420, 290); c.fillStyle = '#fff6e6'; c.fillRect(60, GY - 300, 230, 200); c.fillStyle = '#e8d2b0'; for (let s = 0; s < 3; s++) c.fillRect(60, GY - 240 + s * 60, 230, 8);
      for (let s = 0; s < 3; s++) for (let k = 0; k < 4; k++) croissant(c, 92 + k * 55, GY - 254 + s * 60, .55, (k % 2 ? .1 : -.1));
      c.fillStyle = '#4a2416'; c.fillRect(320, GY - 260, 100, 220); c.fillStyle = '#ffd36a'; c.beginPath(); c.arc(400, GY - 150, 6, 0, 7); c.fill();
      for (let k = 0; k < 9; k++) { c.fillStyle = k % 2 ? '#ffffff' : '#e8463c'; c.beginPath(); c.moveTo(20 + k * 48, GY - 330); c.lineTo(68 + k * 48, GY - 330); c.lineTo(68 + k * 48, GY - 380); c.lineTo(20 + k * 48, GY - 380); c.fill(); c.beginPath(); c.arc(44 + k * 48, GY - 330, 24, 0, Math.PI); c.fill(); }
      croissant(c, 240, GY - 405, 1.2);       // l'enseigne : un grand croissant
      // la rue
      const st = c.createLinearGradient(0, GY - 40, 0, H); st.addColorStop(0, '#d9cdb8'); st.addColorStop(1, '#b8a990'); c.fillStyle = st; c.fillRect(0, GY - 40, W, H);
      c.fillStyle = '#c8bba2'; for (let y = GY - 20; y < H; y += 26) for (let x = (y / 26 % 2) * 30; x < W; x += 60) { c.beginPath(); c.roundRect(x, y, 52, 20, 7); c.fill(); }
      c.fillStyle = '#e9e2d4'; c.fillRect(0, GY - 46, W, 12);
      // les deux grognons qui filent avec les croissants
      speed(c, 520, GY - 70, 140, 4, 'rgba(255,255,255,.9)');
      const h1 = put(c, S.mon(K, 0), 610, GY + 30, 170, { flip: true, rot: .08 }); croissant(c, 668, GY - 74, .9, .4); glitter(c, 640, GY - 150, 26); anger(c, 560, GY - 130, 1.3);
      const h2 = put(c, S.mon(K, 1), 800, GY + 40, 150, { flip: true, rot: .06 }); croissant(c, 850, GY - 50, .9, -.3); glitter(c, 810, GY - 128, 24); anger(c, 870, GY - 115, 1.2);
      c.fillStyle = '#e9a64a'; for (let i = 0; i < 10; i++) { c.beginPath(); c.arc(470 + i * 26, GY + 40 + (i % 3) * 8, 4, 0, 7); c.fill(); }   // miettes
      // les 3 héros partent chacun de leur côté
      speed(c, 1150, GY - 120, 200, 5, 'rgba(255,255,255,.95)');
      put(c, S.pose(K, 'ziggy_r1') || S.hero(K, 'ziggy'), 1270, GY + 40, 230);
      c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.beginPath(); c.moveTo(1640, 0); c.lineTo(1520, 245); c.stroke();
      put(c, S.pose(K, 'filou_s2') || S.hero(K, 'filou'), 1440, 380, 210, { shadow: false, rot: -.2 });
      put(c, S.pose(K, 'titan_w2') || S.hero(K, 'titan'), 1690, GY + 40, 230);
      radio(c, K, 1880, 140, 82);
    },
    // ===== La Lune, avant : Rose se pose ; derrière un rocher, les farceurs tirent la langue près des cages =====
    'lune_a-0': async (c) => {
      const K = await kit(), GY = 470;
      const sky = c.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#05041a'); sky.addColorStop(1, '#1e1a4a'); c.fillStyle = sky; c.fillRect(0, 0, W, H);
      c.save(); c.globalAlpha = .25; const mw = c.createLinearGradient(0, 0, W, 300); mw.addColorStop(0, 'rgba(160,140,255,0)'); mw.addColorStop(.5, 'rgba(200,190,255,.9)'); mw.addColorStop(1, 'rgba(160,140,255,0)');
      c.fillStyle = mw; c.beginPath(); c.moveTo(0, 260); c.quadraticCurveTo(W / 2, 40, W, 120); c.lineTo(W, 200); c.quadraticCurveTo(W / 2, 140, 0, 340); c.fill(); c.restore();
      stars(c, 260, 11, GY); earth(c, 330, 170, 120);
      moonGround(c, GY, 5);
      // à gauche : Rose qui se pose en douceur, petit nuage de poussière
      c.save(); c.fillStyle = 'rgba(235,235,245,.75)'; for (let i = 0; i < 11; i++) { c.beginPath(); c.arc(600 + (i - 5) * 30, GY + 182 - Math.abs(i - 5) * 6 - (i % 2) * 8, 30 - Math.abs(i - 5) * 2, 0, 7); c.fill(); } c.restore();
      put(c, S.rose(K, 'rose_hover10'), 600, GY + 150, 440, { shadow: false }); shadow(c, 600, GY + 185, 110, .3);
      // à droite : le grand rocher, les cages, les farceurs
      c.fillStyle = '#8a8ca2'; c.beginPath(); c.moveTo(1180, GY + 110); c.quadraticCurveTo(1250, GY - 200, 1450, GY - 230); c.quadraticCurveTo(1640, GY - 220, 1700, GY + 110); c.fill();
      c.fillStyle = '#a3a5ba'; c.beginPath(); c.moveTo(1260, GY + 20); c.quadraticCurveTo(1320, GY - 170, 1450, GY - 200); c.quadraticCurveTo(1380, GY - 90, 1320, GY + 30); c.fill();
      c.fillStyle = 'rgba(60,60,90,.25)'; for (const [x, y, r] of [[1560, GY - 120, 30], [1620, GY - 40, 22], [1480, GY - 60, 18], [1400, GY - 140, 14]]) { c.beginPath(); c.ellipse(x, y, r, r * .7, 0, 0, 7); c.fill(); }
      c.strokeStyle = '#6f7188'; c.lineWidth = 3; c.beginPath(); c.moveTo(1180, GY + 110); c.quadraticCurveTo(1250, GY - 200, 1450, GY - 230); c.quadraticCurveTo(1640, GY - 220, 1700, GY + 110); c.stroke();
      [[1300, 0, 160], [1520, 1, 150], [1710, 2, 140]].forEach(([x, i, h], k) => { put(c, S.mon(K, i), x, GY + 60 - k * 6, h * .78, { sa: .15 }); cage(c, x, GY + 66 - k * 6, h * .95, h); });
      put(c, S.al(K, 'glouglou_f1'), 1330, GY + 250, 190);
      put(c, S.al(K, 'boing_f1'), 1560, GY + 245, 200);
      put(c, S.al(K, 'zap_f2'), 1800, GY + 200, 170, { flip: true });
      c.save(); c.fillStyle = '#ffffff'; for (const [x, y] of [[1240, GY + 40], [1600, GY + 20], [1880, GY + 10]]) star4(c, x, y, 10); c.restore();
    },
  };
})();
