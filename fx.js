/* Effets visuels (particules, secousses), vibrations et musique de fond. */
(() => {
  const MM = (window.MM = window.MM || {});
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---------- Vibrations (retour haptique) ---------- */
  const PATTERNS = {
    tap: [8], jump: [10], land: [14], star: [6], letter: [10, 30, 14], punch: [45], smash: [30, 25, 70],
    web: [18], friend: [10, 20, 10], gift: [20, 40, 20, 40, 70], gold: [30, 50, 30, 50, 30, 50, 120], silver: [25, 40, 25, 40, 80],
    bump: [18], turbo: [25, 15, 25], good: [12, 30, 12], oops: [30]
  };
  let hapticsOn = true, iosSwitch = null;
  MM.setHaptics = (on) => { hapticsOn = !!on; };
  MM.haptic = (kind) => {
    if (!hapticsOn) return;
    const pattern = PATTERNS[kind] || PATTERNS.tap;
    try { if (navigator.vibrate) { navigator.vibrate(pattern); return; } } catch {}
    // iPhone : un interrupteur HTML « switch » déclenche un petit retour haptique (iOS 17.4+, seulement pendant un geste).
    try {
      if (!iosSwitch) {
        iosSwitch = document.createElement('label');
        iosSwitch.setAttribute('aria-hidden', 'true');
        iosSwitch.style.cssText = 'position:fixed;left:-120px;top:-120px;width:40px;height:20px;opacity:0;pointer-events:none';
        const input = document.createElement('input'); input.type = 'checkbox'; input.setAttribute('switch', ''); input.tabIndex = -1;
        iosSwitch.appendChild(input); document.body.appendChild(iosSwitch);
      }
      iosSwitch.click();
    } catch {}
  };

  /* ---------- Musique de fond ---------- */
  const music = { el: null, want: false, ducked: false, vol: 0, base: .3, timer: 0 };
  function targetVolume() { return music.want ? (music.ducked ? music.base * .3 : music.base) : 0; }
  function tick() {
    const target = targetVolume();
    music.vol += (target - music.vol) * .22;
    if (Math.abs(target - music.vol) < .004) music.vol = target;
    try { music.el.volume = clamp(music.vol, 0, 1); } catch {}
    if (music.vol === target) {
      clearInterval(music.timer); music.timer = 0;
      if (target === 0) { try { music.el.pause(); } catch {} }
    }
  }
  function startFade() { if (!music.timer) music.timer = setInterval(tick, 60); }
  music.play = (src) => {
    if (!music.el) { music.el = new Audio(src); music.el.loop = true; music.el.preload = 'auto'; music.el.volume = 0; }
    music.want = true;
    const p = music.el.play(); if (p && p.catch) p.catch(() => {});
    startFade();
  };
  music.stop = () => { music.want = false; if (music.el) startFade(); };
  music.duck = (on) => { music.ducked = !!on; if (music.el) startFade(); };
  MM.music = music;

  /* ---------- Particules ---------- */
  const parts = [];
  const shakeState = { amp: 0, t: 0, dur: 0 };
  const STAR_COLORS = ['#ffd84a', '#ffb02e', '#fff1a0', '#ff8fb8', '#8fd8ff'];
  function add(p) { if (parts.length > 420) parts.shift(); parts.push({ x: 0, y: 0, vx: 0, vy: 0, g: 0, life: .6, age: 0, size: 4, color: '#fff', rot: 0, vr: 0, drag: 0, grow: 0, ...p }); }
  const fx = {
    shake(amp, dur = .25) { if (amp >= shakeState.amp * (1 - shakeState.t / Math.max(.001, shakeState.dur)) ) { shakeState.amp = amp; shakeState.dur = dur; shakeState.t = 0; } },
    shakeOffset() {
      if (shakeState.amp <= 0) return { x: 0, y: 0 };
      const k = 1 - shakeState.t / shakeState.dur;
      return { x: (Math.random() - .5) * 2 * shakeState.amp * k, y: (Math.random() - .5) * 2 * shakeState.amp * k };
    },
    sparkle(x, y, n = 10, colors = STAR_COLORS, speed = 150) {
      for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(speed * .4, speed); add({ type: 'star', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, g: 260, life: rand(.5, .9), size: rand(5, 9), color: pick(colors), rot: rand(0, 6), vr: rand(-6, 6) }); }
    },
    dots(x, y, n = 10, colors = STAR_COLORS, speed = 120) {
      for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), s = rand(speed * .3, speed); add({ type: 'dot', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, g: 180, life: rand(.4, .8), size: rand(2.5, 5), color: pick(colors) }); }
    },
    ring(x, y, color = '#fff', r = 60, life = .4, width = 5) { add({ type: 'ring', x, y, life, size: 8, grow: r / life, color, width }); },
    dust(x, y, dir = 0, n = 5) {
      for (let i = 0; i < n; i++) add({ type: 'dust', x: x + rand(-8, 8), y, vx: -dir * rand(10, 60) + rand(-25, 25), vy: rand(-45, -8), life: rand(.35, .6), size: rand(5, 9), grow: 22, color: 'rgba(255,248,230,' });
    },
    shards(x, y, colors, n = 14, power = 280) {
      for (let i = 0; i < n; i++) { const a = rand(-Math.PI * .95, -Math.PI * .05), s = rand(power * .35, power); add({ type: 'shard', x: x + rand(-18, 18), y: y + rand(-30, 6), vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 900, life: rand(.7, 1.1), size: rand(6, 14), color: pick(colors), rot: rand(0, 6), vr: rand(-10, 10) }); }
    },
    text(x, y, str, color = '#fff6c4', size = 22) { add({ type: 'text', x, y, vy: -52, life: .95, size, color, str }); },
    heart(x, y) { for (let i = 0; i < 4; i++) add({ type: 'heart', x: x + rand(-14, 14), y, vx: rand(-25, 25), vy: rand(-90, -50), life: rand(.7, 1), size: rand(9, 14), color: pick(['#ff7a9b', '#ff5d82', '#ffa0b8']) }); },
    streak(x, y, dir) { add({ type: 'streak', x: x - dir * rand(10, 40), y: y + rand(-48, 36), vx: -dir * rand(180, 320), life: rand(.18, .3), size: rand(26, 54), color: pick(['#ffffff', '#ffe36e', '#ff9ec2', '#9fe3ff']), dir }); },
    confetti(x, y, n = 26) {
      for (let i = 0; i < n; i++) { const a = rand(-Math.PI, 0), s = rand(120, 380); add({ type: 'shard', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 520, life: rand(1, 1.6), size: rand(5, 9), color: pick(['#ff6b6b', '#ffb02e', '#5ccf6c', '#4aa3ff', '#a074ff', '#ff7ac8']), rot: rand(0, 6), vr: rand(-12, 12), flat: true }); }
    },
    glitter(x, y) { add({ type: 'dot', x: x + rand(-4, 4), y: y + rand(-4, 4), vx: rand(-12, 12), vy: rand(-12, 12), life: rand(.25, .5), size: rand(1.5, 3), color: '#ffffff' }); },
    clear() { parts.length = 0; shakeState.amp = 0; },
    update(dt) {
      if (shakeState.amp > 0) { shakeState.t += dt; if (shakeState.t >= shakeState.dur) shakeState.amp = 0; }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt; if (p.age >= p.life) { parts.splice(i, 1); continue; }
        p.vy += p.g * dt;
        if (p.drag) { p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.size += p.grow * dt;
      }
    },
    draw(ctx, camera) {
      for (const p of parts) {
        const k = 1 - p.age / p.life, x = p.x - camera, y = p.y;
        ctx.save();
        switch (p.type) {
          case 'dot': ctx.globalAlpha = clamp(k * 1.6, 0, 1); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(x, y, p.size * (.5 + k * .5), 0, 6.3); ctx.fill(); break;
          case 'star': ctx.globalAlpha = clamp(k * 1.6, 0, 1); ctx.translate(x, y); ctx.rotate(p.rot); ctx.fillStyle = p.color; starPath(ctx, 0, 0, p.size * (.5 + k * .5), p.size * .45 * (.5 + k * .5)); ctx.fill(); break;
          case 'ring': ctx.globalAlpha = k * .8; ctx.strokeStyle = p.color; ctx.lineWidth = p.width * k + 1; ctx.beginPath(); ctx.arc(x, y, p.size, 0, 6.3); ctx.stroke(); break;
          case 'dust': ctx.globalAlpha = k * .7; ctx.fillStyle = p.color + '1)'; ctx.beginPath(); ctx.arc(x, y, p.size, 0, 6.3); ctx.fill(); break;
          case 'shard': ctx.globalAlpha = clamp(k * 2, 0, 1); ctx.translate(x, y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
            if (p.flat) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); else { ctx.beginPath(); ctx.moveTo(-p.size / 2, p.size / 2); ctx.lineTo(0, -p.size / 2); ctx.lineTo(p.size / 2, p.size * .35); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1.5; ctx.stroke(); }
            break;
          case 'text': ctx.globalAlpha = clamp(k * 2, 0, 1); ctx.font = `900 ${p.size}px ui-rounded, 'Baloo 2', 'Nunito', sans-serif`; ctx.textAlign = 'center'; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(120,70,0,.85)'; ctx.strokeText(p.str, x, y); ctx.fillStyle = p.color; ctx.fillText(p.str, x, y); break;
          case 'heart': ctx.globalAlpha = clamp(k * 1.6, 0, 1); ctx.fillStyle = p.color; ctx.font = `${p.size * 2}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('♥', x, y); break;
          case 'streak': ctx.globalAlpha = k * .8; ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - p.dir * p.size, y); ctx.stroke(); break;
        }
        ctx.restore();
      }
    }
  };
  function starPath(ctx, x, y, R, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R; const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath();
  }
  fx.starPath = starPath;
  MM.fx = fx;
})();
