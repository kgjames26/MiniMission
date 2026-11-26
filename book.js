/* Mini Mission — lecteur du livre de l'histoire.
   MM.book.open(id, { onDone, force }) : ouvre un livre de MM.STORY (une seule fois sauf force) ; MM.book.seen(id) ; MM.book.library(ids).
   Paysage : double page (2 pages côte à côte) ; portrait : une page à la fois. La voix lit seulement quand on appuie sur 🔊. */
(() => {
  const MM = (window.MM = window.MM || {});
  const KEY = 'mm.book.seen';
  const seenList = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const markSeen = (id) => { try { const s = seenList(); if (!s.includes(id)) { s.push(id); localStorage.setItem(KEY, JSON.stringify(s)); } } catch (e) {} };
  const BG = { space: ['#1c1460', '#4a3aa8'], city: ['#8fdcff', '#ffe9b0'], night: ['#1b2550', '#6a4aa8'] };
  const css = `
  .mmb{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;font-family:var(--font,"Baloo 2",system-ui,sans-serif);user-select:none;-webkit-user-select:none;touch-action:none;
    background:radial-gradient(ellipse at 50% 40%,rgba(255,220,160,.25),rgba(0,0,0,.45) 75%),repeating-linear-gradient(90deg,#7a4a26 0 22px,#6d3f1f 22px 40px,#84522b 40px 64px),#6d3f1f;
    padding:max(8px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}
  .mmb-book{position:relative;width:100%;height:100%;padding:clamp(6px,1.4vmin,14px);border-radius:clamp(10px,2vmin,20px);background:linear-gradient(135deg,#a0522d,#7b3415 60%,#5e260e);
    box-shadow:0 18px 40px rgba(0,0,0,.55),inset 0 0 0 2px rgba(255,210,150,.35)}
  .mmb-pages{position:relative;width:100%;height:100%;perspective:2600px;
    box-shadow:3px 0 0 #efe4cc,6px 0 0 #e2d4b5,9px 0 0 #d6c6a3,-3px 0 0 #efe4cc,-6px 0 0 #e2d4b5,-9px 0 0 #d6c6a3}
  .mmb-slot{position:absolute;top:0;bottom:0;overflow:hidden}
  .mmb.two .mmb-slot.l{left:0;width:50%}.mmb.two .mmb-slot.r{left:50%;width:50%}
  .mmb.one .mmb-slot.l{display:none}.mmb.one .mmb-slot.r{left:0;width:100%}
  .mmb-pg{position:absolute;inset:0;display:flex;flex-direction:column;background:#fffaf0;overflow:hidden}
  .mmb-pg.l{background:linear-gradient(90deg,#fffaf0 80%,#efe2c6)}.mmb-pg.r{background:linear-gradient(90deg,#efe2c6,#fffaf0 20%)}
  .mmb.one .mmb-pg.r,.mmb.one .mmb-pg.l{background:linear-gradient(90deg,#efe2c6,#fffaf0 8%)}
  .mmb-pic{position:relative;flex:0 0 72%;overflow:hidden;background:#e9dcc0}
  .mmb.one .mmb-pic{flex-basis:56%}
  .mmb-pic img{pointer-events:none;-webkit-user-drag:none;position:absolute;top:0;height:100%;width:200%;object-fit:cover;opacity:0;transition:opacity .25s}
  .mmb-pic img.on{opacity:1}
  .mmb-pg.l .mmb-pic img{left:0}.mmb-pg.r .mmb-pic img{left:-100%}
  .mmb-pg.solo .mmb-pic img{left:0;width:100%}
  .mmb-pic::after{content:'';position:absolute;left:0;right:0;bottom:0;height:18px;background:linear-gradient(transparent,#fffaf0)}
  .mmb-tx{flex:1;min-height:0;display:flex;align-items:center;padding:clamp(4px,1.2vmin,12px) clamp(12px,3.2vmin,34px);font-weight:700;color:#3b2a1a;line-height:1.28;font-size:clamp(13px,2.75vmin,24px);overflow:hidden}
  .mmb.one .mmb-tx{font-size:clamp(16px,4.6vw,26px);align-items:flex-start;padding-top:12px}
  .mmb-pg.l .mmb-tx{padding-right:clamp(16px,4vmin,40px)}.mmb-pg.r .mmb-tx{padding-left:clamp(16px,4vmin,40px)}
  .mmb-num{position:absolute;bottom:6px;left:50% !important;right:auto !important;transform:translateX(-50%);font-size:13px;font-weight:800;color:#b49a72}.mmb-pg.l .mmb-num{left:12px}.mmb-pg.r .mmb-num{right:12px}
  .mmb-end{flex:1;display:grid;place-items:center;align-content:center;gap:14px;background:radial-gradient(circle,#fff6dc,#f6e6c4)}
  .mmb-end b{font-size:clamp(40px,12vmin,110px)}
  .mmb-spine{position:absolute;left:50%;top:0;bottom:0;width:60px;margin-left:-30px;pointer-events:none;z-index:3;background:linear-gradient(90deg,transparent,rgba(60,30,0,.18) 45%,rgba(60,30,0,.28) 50%,rgba(60,30,0,.18) 55%,transparent)}
  .mmb.one .mmb-spine{left:0;margin-left:-20px;width:40px;opacity:.7}
  .mmb-leaf{position:absolute;top:0;bottom:0;z-index:5;transform-style:preserve-3d;will-change:transform}
  .mmb-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
  .mmb-face.back{transform:rotateY(180deg)}
  .mmb-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.25),transparent 40%);opacity:0}
  .mmb-curl{position:absolute;right:0;bottom:0;width:clamp(34px,7vmin,64px);height:clamp(34px,7vmin,64px);z-index:4;pointer-events:none;
    background:linear-gradient(135deg,transparent 50%,#e4d3ad 50%,#fff6e0 70%,#d9c49a);border-top-left-radius:8px;box-shadow:-3px -3px 6px rgba(0,0,0,.18);animation:mmbCurl 2.4s ease-in-out infinite}
  @keyframes mmbCurl{0%,70%,100%{transform:scale(1)}80%{transform:scale(1.35)}}
  .mmb-hand{position:absolute;right:12%;bottom:18%;z-index:6;font-size:clamp(40px,9vmin,70px);pointer-events:none;animation:mmbHand 1.8s ease-in-out 3;opacity:0;filter:drop-shadow(0 4px 4px rgba(0,0,0,.35))}
  @keyframes mmbHand{0%{opacity:0;transform:translateX(0)}15%{opacity:1}70%{opacity:1;transform:translateX(-160%)}100%{opacity:0;transform:translateX(-170%)}}
  .mmb-ui{position:absolute;z-index:8;display:flex;gap:10px}
  .mmb-ui.tl{top:max(12px,env(safe-area-inset-top));left:max(12px,env(safe-area-inset-left))}.mmb-ui.tr{top:max(12px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right))}
  .mmb-rb{border:0;width:clamp(44px,8vmin,58px);height:clamp(44px,8vmin,58px);border-radius:50%;font-size:clamp(20px,4vmin,28px);background:rgba(255,250,235,.95);color:#7b3415;box-shadow:0 4px 0 rgba(0,0,0,.25);font-family:inherit;font-weight:900}
  .mmb-rb:active{transform:translateY(2px);box-shadow:0 2px 0 rgba(0,0,0,.25)}
  .mmb-go.small{position:absolute;right:clamp(10px,2vmin,18px);bottom:clamp(10px,2vmin,18px);padding:8px 22px;font-size:clamp(22px,4.5vmin,32px);z-index:4}
  .mmb-go{border:0;border-radius:999px;padding:14px 34px;font-size:clamp(26px,6vmin,40px);font-weight:900;color:#fff;background:linear-gradient(#69d36a,#2f9c3b);box-shadow:0 6px 0 #1f6e2a;font-family:inherit}
  .mmb-lib{position:fixed;inset:0;z-index:999;display:flex;flex-direction:column;gap:10px;background:radial-gradient(ellipse at 50% 30%,rgba(255,220,160,.25),rgba(0,0,0,.4) 80%),repeating-linear-gradient(90deg,#7a4a26 0 22px,#6d3f1f 22px 40px,#84522b 40px 64px);padding:max(12px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}
  .mmb-lib h2{margin:0;text-align:center;font-size:clamp(28px,6vmin,44px)}
  .mmb-shelf{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:16px;grid-auto-rows:max-content;align-content:start;padding:6px}
  .mmb-cover{position:relative;aspect-ratio:3/4;border:0;border-radius:6px 14px 14px 6px;overflow:hidden;background:linear-gradient(160deg,#a0522d,#5e260e);box-shadow:inset 9px 0 0 rgba(0,0,0,.25),0 6px 0 rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:flex-end;color:#fff;font:inherit;font-weight:900;font-size:clamp(13px,2.4vmin,17px);padding:0;text-shadow:0 2px 0 rgba(0,0,0,.45)}
  .mmb-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .mmb-cover em{position:relative;font-style:normal;padding:8px 8px 10px 14px;background:linear-gradient(transparent,rgba(0,0,0,.6))}
  .mmb-cover span{position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(30px,7vmin,48px)}
  .mmb-cover.lock{filter:grayscale(1) brightness(.6)}
  .mmb-skip{position:absolute;top:max(10px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right));border:0;border-radius:50%;width:52px;height:52px;background:rgba(255,250,235,.95);font-size:22px;font-weight:900;color:#7b3415;box-shadow:0 4px 0 rgba(0,0,0,.25);z-index:2}`;
  // ---------- images : une grande image par double page (assets/book/<livre>-w<n>.webp) ; sinon une scène dessinée par le jeu ----------
  const IMG = {}, load = (src) => IMG[src] || (IMG[src] = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }));
  const J = {}, json = (src) => J[src] || (J[src] = fetch(src).then(r => r.json()).catch(() => null));
  const PLANET = { lune: ['#f4f4fa', '#a6a4c0', '#b9bccd'], mars: ['#ffb08a', '#c4502a', '#c4643a'], venus: ['#fff1c4', '#e0a84a', '#8f5a34'], mercure: ['#e2d6cc', '#8f7f74', '#8a7f78'], jupiter: ['#ffe2b8', '#c98a52', '#dfeaf4'], saturne: ['#fff0c0', '#d8b46a', '#dbe6f2'], uranus: ['#d8fbff', '#6fd0d8', '#bfeef2'], neptune: ['#a8c8ff', '#3555d8', '#9ab4ea'], terre: ['#9fe0ff', '#2f7fe0', '#8f97aa'], soleil: ['#fff6a8', '#ff9a1a', '#5a3e36'] };
  const GIFT = ['🥐', '🌸', '🏮', '💧', '⏳', '🎵', '💛', '🎈', '👋', '🤝'];
  async function scene(id, di) {
    const b = MM.STORY[id], W = 1600, H = 600, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const [heroes, mons, flame, roseA, roseJ, alA, alJ] = await Promise.all([load('assets/heroes-hd.webp'), load('assets/monsters.webp'), load('assets/friend-flame.webp'), load('assets/rose.webp'), json('assets/rose.json'), load('assets/aliens.webp'), json('assets/aliens.json')]);
    const city = b.city != null && MM.cities ? MM.cities[b.city] : null, gy = 440, night = id === 'ch1end' && di === 0;
    // décor
    if (b.world || b.bg === 'space') { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0828'); g.addColorStop(1, '#2a2070'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(255,255,240,${.4 + (i % 5) / 8})`; c.fillRect((i * 397) % W, (i * 211) % 420, i % 7 ? 2 : 3, i % 7 ? 2 : 3); }
      const P = PLANET[b.world] || PLANET.lune; if (b.world) { const pg = c.createRadialGradient(1200, 150, 30, 1260, 210, 230); pg.addColorStop(0, P[0]); pg.addColorStop(1, P[1]); c.fillStyle = pg; c.beginPath(); c.arc(1260, 210, 200, 0, 7); c.fill(); }
      c.fillStyle = P[2]; c.fillRect(0, gy, W, H - gy); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(0, gy, W, 6); }
    else { const sky = night ? ['#1b2550', '#4a3a88'] : city ? city.sky : ['#8fd0ff', '#fff1d8'], g = c.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); c.fillStyle = g; c.fillRect(0, 0, W, gy);
      if (city && MM.landmarks && MM.landmarks[city.lm]) { c.save(); c.globalAlpha = .9; MM.landmarks[city.lm](c, 1250, gy + 4, 1.5, city.lmCol); c.restore(); }
      c.fillStyle = city ? city.grass : '#8cc983'; c.fillRect(0, gy, W, H - gy); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(0, gy, W, 6);
      if (night) for (let i = 0; i < 80; i++) { c.fillStyle = 'rgba(255,255,230,.8)'; c.fillRect((i * 397) % W, (i * 131) % 300, 2, 2); } }
    // personnages
    const hero = (h) => { if (!heroes) return null; const hw = heroes.width / 4, hh = heroes.height / 3, col = h === 'ziggy' ? 0 : 2, row = { ziggy: 0, filou: 1, titan: 2 }[h]; return [heroes, col * hw, row * hh, hw, hh, 300]; };
    const mon = (i) => mons ? [mons, (i % 5) * 400, Math.floor(i / 5) * 264, 400, 264, 150] : null;
    const rose = () => { const q = roseJ && roseJ.rose_idle0; return q && roseA ? [roseA, q.x, q.y, q.w, q.h, 310] : null; };
    const al = (k) => { const q = alJ && alJ[k]; return q && alA ? [alA, q.x, q.y, q.w, q.h, 150 * (k.startsWith('bidou') ? 1.25 : 1)] : null; };
    const fl = () => flame ? [flame, 0, 0, flame.width, flame.height, 120] : null;
    const FR = [mon(5), mon(6), mon(8), mon(11), fl()], GR = [mon(0), mon(1), mon(2), mon(3)];
    let cast = [], extra = '', bubbles = [];
    const isC = /c$|_c$/.test(id), H3 = ['ziggy', 'filou', 'titan'].map(hero);
    if (b.hero) cast = [FR[0], hero(b.hero), FR[4]], extra = '🎉';
    else if (city && isC) cast = [FR[0], H3[0], FR[1], H3[1], FR[4], H3[2], FR[2]], extra = GIFT[b.city];
    else if (city) cast = [GR[0], GR[1], H3[0], H3[1], H3[2], GR[2]];
    else if (b.world && isC) cast = [FR[0], FR[1], rose(), FR[4], FR[2]], extra = '🫧';
    else if (b.world) cast = [al('glouglou_f1'), rose(), al('boing_f1'), al('zap_f1')];
    else if (id === 'prologue') cast = ['glouglou_f1', 'boing_f1', 'zap_f1', 'bidou_f1', 'zigzag_f1'].map(al);
    else if (id === 'ch1end') cast = di === 0 ? [FR[0], FR[1], FR[4], FR[2], FR[3]] : [H3[0], rose(), H3[1], H3[2]];
    else if (id === 'final_a') cast = [H3[0], rose(), H3[1], H3[2]];
    else if (id === 'final_c' && di === 0) { cast = [H3[0], rose(), H3[1], H3[2]]; bubbles = ['glouglou_f1', 'boing_f1', 'zap_f1', 'bidou_f1', 'zigzag_f1'].map(al); }
    else if (id === 'final_c') { cast = [al('glouglou_ami'), H3[0], al('bidou_ami'), rose(), FR[4], H3[1], al('zigzag_ami'), H3[2], al('boing_ami')]; extra = '💖'; }
    cast = cast.filter(Boolean);
    const sc = Math.min(.82, (W - 160) / cast.reduce((t, q) => t + q[3] / q[4] * q[5] + 10, 0));
    let x = (W - cast.reduce((t, q) => t + (q[3] / q[4] * q[5] + 10) * sc, 0)) / 2;
    for (const [im, sx, sy, sw, sh, ht] of cast) { const h = ht * sc, w = sw / sh * h; c.drawImage(im, sx, sy, sw, sh, x, gy + 14 - h, w, h); x += w + 10 * sc; }
    bubbles.filter(Boolean).forEach(([im, sx, sy, sw, sh, ht], i) => { const bx = 220 + i * 290, by = 130 + (i % 2) * 60, r = 80; c.drawImage(im, sx, sy, sw, sh, bx - 50, by - 50, 100, 100 * sh / sw);
      const g = c.createRadialGradient(bx - 25, by - 25, 8, bx, by, r); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.7, 'rgba(170,230,255,.15)'); g.addColorStop(1, 'rgba(255,170,240,.6)'); c.fillStyle = g; c.beginPath(); c.arc(bx, by, r, 0, 7); c.fill(); });
    if (extra) { c.font = '64px system-ui, "Apple Color Emoji", "Noto Color Emoji"'; c.textAlign = 'center'; for (let i = 0; i < 6; i++) c.fillText(extra, 160 + i * 260 + (i % 2) * 40, 90 + (i % 3) * 70); }
    return cv.toDataURL('image/jpeg', .85);
  }
  const PICS = {};
  function picture(id, di) {
    const key = id + '-' + di; if (PICS[key]) return PICS[key];
    const b = MM.STORY[id], art = (b.art || [])[di] || 'auto';
    const drawn = () => MM.bookArt && MM.bookArt[key] ? (async () => { const cv = document.createElement('canvas'); cv.width = 2000; cv.height = 750; await MM.bookArt[key](cv.getContext('2d')); return cv.toDataURL('image/jpeg', .88); })() : scene(id, di);
    return (PICS[key] = (art === 'img' ? load(`assets/book/${id}-w${di + 1}.webp`).then(im => im ? im.src : drawn()) : drawn()));
  }
  let styled = false;
  const style = () => { if (styled) return; styled = true; const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
  const speak = (t) => { if (MM.say) MM.say(t); else { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; speechSynthesis.speak(u); } catch (e) {} } };
  const hush = () => { if (MM.hush) MM.hush(); else { try { speechSynthesis.cancel(); } catch (e) {} } };
  const esc = (v) => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function open(id, opts = {}) {
    const book = MM.STORY && MM.STORY[id];
    if (!book || (!opts.force && seenList().includes(id))) { if (opts.onDone) opts.onDone(); return false; }
    style(); markSeen(id);
    const pages = book.pages, root = document.createElement('div'); root.className = 'mmb'; root.setAttribute('role', 'dialog');
    root.innerHTML = `<div class="mmb-book"><div class="mmb-pages"><div class="mmb-slot l"></div><div class="mmb-slot r"></div><div class="mmb-spine"></div></div></div>
      <div class="mmb-ui tl"><button class="mmb-rb" data-a="say" aria-label="Écouter">🔊</button></div><div class="mmb-ui tr"><button class="mmb-rb" data-a="close" aria-label="Fermer">✕</button></div>`;
    document.body.appendChild(root);
    const area = root.querySelector('.mmb-pages'), L = root.querySelector('.mmb-slot.l'), R = root.querySelector('.mmb-slot.r');
    let two = true, at = 0, closed = false, busy = false, hinted = false;
    // en paysage, on ajoute une page « fin » si le nombre de pages est impair ; en portrait, elle vient après la dernière page
    const count = () => two ? pages.length + (pages.length % 2) : pages.length;
    const solo = pages.length === 1;
    // une page du livre : la moitié de la grande image de la double page + son texte (ou la page de fin)
    const page = (i) => {
      const d = document.createElement('div');
      if (i < 0 || i >= count()) { d.className = 'mmb-pg'; return d; }
      const side = i % 2 ? 'r' : 'l'; d.className = 'mmb-pg ' + side + (solo ? ' solo' : '');
      if (i >= pages.length) { d.innerHTML = `<div class="mmb-end"><b>⭐</b><button class="mmb-go" data-a="close" aria-label="C’est parti">▶▶</button></div>`; return d; }
      d.innerHTML = `<div class="mmb-pic"><img alt="" draggable="false"></div><div class="mmb-tx">${esc(pages[i].t)}</div><div class="mmb-num">${i + 1}</div>${i === pages.length - 1 ? '<button class="mmb-go small" data-a="close" aria-label="C’est parti">▶▶</button>' : ''}`;
      const img = d.querySelector('img'); picture(id, Math.floor(i / 2)).then(src => { img.onload = () => img.classList.add('on'); img.src = src; });
      return d;
    };
    const fill = (slot, i) => { slot.innerHTML = ''; slot.appendChild(page(i)); };
    const render = () => {
      two = innerWidth > innerHeight; root.classList.toggle('two', two); root.classList.toggle('one', !two);
      if (two) at -= at % 2;
      if (two) { fill(L, at); fill(R, at + 1); } else fill(R, at);
      root.querySelectorAll('.mmb-curl').forEach(c => c.remove());
      if (at + (two ? 2 : 1) < count()) { const c = document.createElement('div'); c.className = 'mmb-curl'; R.appendChild(c); }
      if (!hinted) { hinted = true; const h = document.createElement('div'); h.className = 'mmb-hand'; h.textContent = '👆'; R.appendChild(h); }
    };
    const close = () => { if (closed) return; closed = true; hush(); removeEventListener('resize', render); root.remove(); if (opts.onDone) opts.onDone(); };
    const step = () => two ? 2 : 1;

    // ---- la feuille qui tourne : dir = 1 (page suivante) ou -1 (page d'avant) ----
    let leaf = null, dir = 0, angle = 0, ending = false;
    const startFlip = (d) => {
      const n = at + d * step(); if (n < 0) return false; ending = n >= count();
      dir = d; hush(); leaf = document.createElement('div'); leaf.className = 'mmb-leaf';
      const front = document.createElement('div'), back = document.createElement('div'), shade = document.createElement('div');
      front.className = 'mmb-face front'; back.className = 'mmb-face back'; shade.className = 'mmb-shade';
      if (two) {
        if (d > 0) { leaf.style.cssText = 'left:50%;width:50%;transform-origin:0 50%'; front.appendChild(page(at + 1)); back.appendChild(page(at + 2)); fill(R, at + 3); }
        else { leaf.style.cssText = 'left:0;width:50%;transform-origin:100% 50%'; front.appendChild(page(at)); back.appendChild(page(at - 1)); fill(L, at - 2); }
      } else {
        leaf.style.cssText = 'left:0;width:100%;transform-origin:0 50%';
        if (d > 0) { front.appendChild(page(at)); back.appendChild(page(-1)); fill(R, at + 1); }
        else { front.appendChild(page(at - 1)); back.appendChild(page(-1)); }
      }
      front.appendChild(shade); leaf.append(front, back); area.appendChild(leaf);
      angle = (!two && d < 0) ? -180 : 0; setAngle(angle); return true;
    };
    const setAngle = (a) => { angle = a; leaf.style.transform = `rotateY(${a}deg)`; const s = leaf.querySelector('.mmb-shade'); if (s) s.style.opacity = Math.min(1, Math.abs(a) / 90);
      leaf.style.boxShadow = `0 0 ${20 * Math.sin(Math.abs(a) * Math.PI / 180)}px rgba(0,0,0,.35)`; };
    const target = () => two ? (dir > 0 ? -180 : 180) : (dir > 0 ? -180 : 0);
    const origin = () => (!two && dir < 0) ? -180 : 0;
    const finish = (done) => new Promise(res => {
      busy = true; const from = angle, to = done ? target() : origin(), t0 = performance.now(), dur = 380 * Math.max(.35, Math.abs(to - from) / 180);
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); setAngle(from + (to - from) * e);
        if (k < 1) return requestAnimationFrame(tick);
        leaf.remove(); leaf = null; busy = false; if (done && ending) { close(); return res(); } if (done) at += dir * step(); render(); res(); };
      requestAnimationFrame(tick);
    });
    const turn = (d) => { if (busy || leaf) return; if (startFlip(d)) finish(true); };

    // ---- le doigt : on attrape la page et on la tourne ----
    let px = null, py = null, moved = false, w = 1;
    area.addEventListener('dragstart', e => e.preventDefault());
    area.addEventListener('pointerdown', e => { if (busy || e.target.closest('button')) return; px = e.clientX; py = e.clientY; moved = false; w = area.clientWidth / (two ? 2 : 1); area.setPointerCapture(e.pointerId); });
    area.addEventListener('pointermove', e => {
      if (px === null) return; const dx = e.clientX - px;
      if (!leaf) { if (Math.abs(dx) < 10) return; moved = true; if (!startFlip(dx < 0 ? 1 : -1)) { px = null; return; } }
      const k = Math.max(0, Math.min(1, (dir > 0 ? -dx : dx) / (w * 1.1)));
      setAngle(two ? (dir > 0 ? -180 * k : 180 * k) : (dir > 0 ? -180 * k : -180 + 180 * k));
    });
    const up = (e) => {
      if (px === null) return; const dx = e.clientX - px; px = null;
      if (leaf) { finish(Math.abs(angle - origin()) > 60 || (e.type === 'pointerup' && Math.abs(dx) > w * .35)); return; }
      if (!moved && !e.target.closest('button')) { const r = area.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; if (x > .66) turn(1); else if (x < .34) turn(-1); }
    };
    area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
    root.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'close') close();
      else if (a.dataset.a === 'say') speak((two ? pages.slice(at, at + 2) : pages.slice(at, at + 1)).map(p => p.s || p.t).join(' '));   // la voix ne lit que si on appuie sur 🔊
    });
    addEventListener('keydown', function kd(e) { if (closed) return removeEventListener('keydown', kd); if (e.key === 'ArrowRight') turn(1); else if (e.key === 'ArrowLeft') turn(-1); else if (e.key === 'Escape') close(); });
    addEventListener('resize', render);
    render();
    return true;
  }

  // la bibliothèque : tous les livres déjà lus, dans l'ordre de l'histoire
  function library(order, onClose) {
    style();
    const seen = seenList(), root = document.createElement('div'); root.className = 'mmb-lib';
    const items = order.filter(id => MM.STORY[id]);
    root.innerHTML = `<button class="mmb-skip" aria-label="Fermer">✕</button><h2>📚</h2><div class="mmb-shelf">${items.map(id => { const b = MM.STORY[id], [b1, b2] = BG[b.bg] || BG.city, ok = seen.includes(id);
      return `<button class="mmb-cover ${ok ? '' : 'lock'}" data-id="${id}">${ok ? `<img alt="" data-src="${id}">` : '<span>🔒</span>'}<em>${ok ? esc(b.title || '') : ''}</em></button>`; }).join('')}</div>`;
    document.body.appendChild(root);
    root.querySelectorAll('img[data-src]').forEach(im => picture(im.dataset.src, 0).then(s => { im.src = s; }));
    root.querySelector('.mmb-skip').onclick = () => { root.remove(); if (onClose) onClose(); };
    root.querySelector('.mmb-shelf').addEventListener('click', e => { const c = e.target.closest('.mmb-cover'); if (!c || c.classList.contains('lock')) return; open(c.dataset.id, { force: true }); });
  }
  MM.book = { open, library, seen: (id) => seenList().includes(id), markSeen };
})();
