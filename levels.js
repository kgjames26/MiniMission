/* Niveaux de Mini Mission : un parcours différent par héros, généré à partir d'une graine.
   - Filou  : une ville. Ravins et immeubles à franchir en se balançant au bout de sa toile.
   - Ziggy  : une piste de vitesse. Grands ravins à sauter en pleine course, barrières à défoncer.
   - Titan  : un chantier. Gros rochers et murs à briser à coups de poing.
   Chaque balancement de Filou est vérifié par simulation : il atterrit toujours là où le niveau l'attend. */
(() => {
  const MM = (window.MM = window.MM || {});
  const W = 11000, F = 426, PW = 58, PH = 86, GRAV = 1450;
  const STATIONS = [1900, 5300, 8700];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---------- Physique de la toile (partagée avec le jeu) ---------- */
  // Le balancement est normalisé : quelle que soit la position d'accroche, Filou est lâché à la même vitesse (vr) quand il
  // atteint l'angle thr, ce qui rend les sauts prévisibles et fiables.
  const SWING = { G: 1900, vr: 580, thr: 1.2, damp: .1, maxT: 2.6 };
  const swing = {
    // l'ancre est-elle à portée depuis la main (hx, hy) en regardant dans la direction dir ?
    canReach(a, hx, hy, dir) {
      const dx = (a.x - hx) * dir, dy = hy - a.y;
      return dy >= 150 && dy <= 480 && dx >= 40 && dx <= 380 && Math.hypot(a.x - hx, a.y - hy) <= 520;
    },
    start(ax, ay, hx, hy, dir) {
      const L = Math.hypot(hx - ax, hy - ay), theta = Math.atan2(hx - ax, hy - ay), thr = SWING.thr * dir;
      const wr = SWING.vr / L;
      const omega = Math.sqrt(Math.max(0, wr * wr + 2 * (SWING.G / L) * (Math.cos(theta) - Math.cos(thr)))) * dir;
      return { ax, ay, L, theta, omega, dir, t: 0 };
    },
    // avance d'un pas ; renvoie true quand il est temps de lâcher
    step(s, dt) {
      s.omega += -(SWING.G / s.L) * Math.sin(s.theta) * dt;
      s.omega *= 1 - SWING.damp * dt;
      s.theta += s.omega * dt; s.t += dt;
      const far = s.dir > 0 ? (s.theta >= SWING.thr && s.omega > 0) : (s.theta <= -SWING.thr && s.omega < 0);
      return far || s.t >= SWING.maxT;
    },
    hand(s) { return { x: s.ax + s.L * Math.sin(s.theta), y: s.ay + s.L * Math.cos(s.theta) }; },
    velocity(s) { return { vx: s.L * Math.cos(s.theta) * s.omega, vy: -s.L * Math.sin(s.theta) * s.omega }; },
    // simule le balancement puis le vol ; renvoie le chemin (centre du héros) et l'endroit d'atterrissage
    simulate(ax, ay, hx, hy, dir, surfaces) {
      const dt = 1 / 120, s = swing.start(ax, ay, hx, hy, dir), path = [];
      let n = 0;
      const mid = PH / 2 - 12;
      while (n++ < 400) { const done = swing.step(s, dt); const h = swing.hand(s); if (n % 12 === 0) path.push({ x: h.x, y: h.y + mid }); if (done) break; }
      const h = swing.hand(s), v = swing.velocity(s);
      let x = h.x, y = h.y + (PH - 12), vx = v.vx, vy = v.vy, land = null;
      for (let i = 0; i < 700; i++) {
        const py = y; vy += GRAV * dt; x += vx * dt; y += vy * dt;
        if (i % 12 === 0) path.push({ x, y: y - PH / 2 });
        if (vy > 0) for (const sf of surfaces) if (x >= sf.x0 && x <= sf.x1 && py <= sf.y && y >= sf.y) { land = { x, y: sf.y, surface: sf }; break; }
        if (land || y > F + 200) break;
      }
      return { path, land };
    }
  };

  /* ---------- Génération ---------- */
  function build(hero, rnd) {
    const r = (a, b) => a + rnd() * (b - a);
    const ri = (a, b) => Math.floor(r(a, b + 1));
    const c = { width: W, floor: F, stations: STATIONS.slice(), gaps: [], platforms: [], bumps: [], anchors: [], pads: [], stars: [], spots: [], blocks: [], log: [] };
    const HAND_Y = F - PH + 12;

    const starLine = (x0, y, n, dx = 46) => { for (let i = 0; i < n; i++) c.stars.push({ x: x0 + i * dx, y }); };
    const starArc = (x0, x1, yBase, peak, n) => { for (let i = 0; i < n; i++) { const t = (i + .5) / n; c.stars.push({ x: x0 + (x1 - x0) * t, y: yBase - peak * 4 * t * (1 - t) }); } };
    const spot = (x, y, diff) => c.spots.push({ x, y, diff });
    const platform = (x, h, w, extra = {}) => { const p = { x, y: F - h, w, h: 18, type: ri(0, 1), ...extra }; c.platforms.push(p); return p; };
    const bump = (x, w, h, kind, hp = 0) => { const b = { id: 'b' + c.bumps.length, x, w, h, kind, hp, maxHp: hp, type: ri(0, 2) }; c.bumps.push(b); return b; };
    const building = (x, h, w) => platform(x, h, w, { bld: { color: ['#ffb36b', '#ff8fa3', '#74d3a0', '#ffd45c', '#a994f2', '#ff9a7a'][ri(0, 5)], roof: ['#e8564b', '#5a6fcf', '#3f9d6e', '#c9742f'][ri(0, 3)] } });
    const floorSurfaces = () => {
      const gaps = c.gaps.slice().sort((a, b) => a.x - b.x), out = []; let x = -400;
      for (const g of gaps) { out.push({ x0: x, x1: g.x, y: F }); x = g.x + g.w; }
      out.push({ x0: x, x1: W + 400, y: F }); return out;
    };
    const rooftopSurface = (p) => ({ x0: p.x - 6, x1: p.x + p.w + 6, y: p.y });

    // Cherche une ancre telle que, depuis tous les points de départ plausibles, la toile atterrisse sur la surface visée.
    function findAnchor({ starts, ayList, axList, surfaces, target }) {
      for (const ay of ayList) for (const ax of axList) {
        const a = { x: ax, y: ay }; let ok = true, n = 0, path = null;
        for (const sx of starts) {
          if (!swing.canReach(a, sx, HAND_Y, 1)) continue;
          n++;
          const res = swing.simulate(ax, ay, sx, HAND_Y, 1, surfaces);
          if (!res.land || res.land.surface !== target) { ok = false; break; }
          if (!path) path = res.path;
        }
        if (ok && n >= 3) return { ax, ay, path };
      }
      return null;
    }
    const swingStars = (path, from = 1, every = 2) => { path.forEach((p, i) => { if (i >= from && i % every === 0 && p.y < F - 30) c.stars.push({ x: p.x, y: p.y }); }); };

    /* ----- Segments communs ----- */
    const SEG = {
      street(x, fixedLen) {
        const len = fixedLen || r(360, 520);
        starLine(x + 40, F - 42, Math.floor((len - 40) / 70), 70);
        spot(x + len * .55, F - 56, 'easy');
        if (hero !== 'filou') { bump(x + len * .35, ri(36, 56), ri(34, 46), 'small'); }
        return len;
      },
      /* ---- Filou ---- */
      swingGap(x) {
        const approach = r(170, 230), gx = x + approach;
        for (let attempt = 0; attempt < 6; attempt++) {
          const w = attempt < 4 ? r(310, 400) : r(260, 300);
          const right = { x0: gx + w, x1: gx + w + 520, y: F }, left = { x0: gx - 800, x1: gx, y: F };
          const found = findAnchor({
            starts: [gx - 250, gx - 190, gx - 130, gx - 70, gx - 12], ayList: [F - 360, F - 380, F - 340, F - 400],
            axList: [gx + w * .5, gx + w * .42, gx + w * .58], surfaces: [left, right], target: right
          });
          if (!found) continue;
          c.gaps.push({ x: gx, w }); c.anchors.push({ x: found.ax, y: found.ay }); c.log.push('swingGap');
          swingStars(found.path, 2, 2);
          spot(gx + w * .5, found.ay + 150, 'hard');
          return approach + w + 470;
        }
        c.log.push('swingGap!'); c.gaps.push({ x: gx, w: 140 }); starArc(gx - 20, gx + 160, F - 70, 90, 5);
        return approach + 140 + 400;
      },
      // un immeuble de l'autre côté d'un ravin : on n'y accède qu'en se balançant
      tower(x) {
        const approach = r(170, 220), gx = x + approach;
        const heights = [110, 140, 170].sort(() => rnd() - .5);
        for (const h of heights) for (const w of [r(300, 340), r(280, 300)]) {
          const rw = r(260, 300), tx = gx + w, roof = { x: tx, y: F - h, w: rw };
          const surfaces = [{ x0: -400, x1: gx, y: F }, rooftopSurface(roof), { x0: tx + rw + 6, x1: W + 400, y: F }];
          const found = findAnchor({
            starts: [gx - 230, gx - 170, gx - 110, gx - 50, gx - 12], ayList: [F - 366, F - 350, F - 330],
            axList: [gx + w * .1, gx + w * .2, gx + w * .3, gx + w * .4, gx + w * .5, gx + w * .6], surfaces, target: surfaces[1]
          });
          if (!found) continue;
          c.gaps.push({ x: gx, w }); building(tx, h, rw);
          c.anchors.push({ x: found.ax, y: found.ay }); c.log.push('tower');
          swingStars(found.path, 2, 2);
          starLine(tx + 40, F - h - 34, Math.floor((rw - 40) / 54), 54);
          spot(tx + rw * .6, F - h - 36, 'hard');
          return approach + w + rw + 330;
        }
        c.log.push('tower!');
        starLine(gx, F - 44, 5, 60);
        return approach + 300;
      },
      rooftops(x) {
        const heights = [100, 160, 120, 90], n = ri(3, 4); let cx = x + 180;
        for (let i = 0; i < n; i++) {
          const w = r(180, 210), h = heights[i];
          building(cx, h, w);
          starLine(cx + 30, F - h - 34, 3, 52);
          if (i === 1) spot(cx + w * .5, F - h - 36, 'medium');
          if (i < n - 1) starArc(cx + w - 10, cx + w + 110, F - h - 34, 70, 3);
          cx += w + 100;
        }
        return cx - x + 200;
      },
      /* ---- Ziggy ---- */
      sprint(x) {
        const len = r(520, 700);
        c.pads.push({ x: x + 60, w: 96 });
        starLine(x + 200, F - 44, Math.floor((len - 200) / 52), 52);
        spot(x + len * .7, F - 56, 'easy');
        return len;
      },
      bigGap(x) {
        const padX = x + 60, w = r(330, 420), gx = x + 360;
        c.pads.push({ x: padX, w: 96 });
        c.gaps.push({ x: gx, w });
        // étoiles le long de la vraie trajectoire du grand saut depuis le bord (vitesse turbo 520, saut 780)
        const pts = []; for (let t = .12; t < 1.04; t += .115) pts.push({ x: gx - 24 + 520 * t, y: F - (780 * t - 725 * t * t) - PH / 2 });
        pts.forEach((p) => c.stars.push(p));
        const apex = pts.reduce((best, p) => p.y < best.y ? p : best, pts[0]);
        spot(apex.x, apex.y, 'hard');
        starLine(gx + w + 70, F - 44, 4, 56);
        return 360 + w + 480;
      },
      fenceRun(x) {
        const n = ri(2, 3); c.pads.push({ x: x + 50, w: 96 });
        let cx = x + 330;
        for (let i = 0; i < n; i++) {
          bump(cx, 34, 150, 'fence', 1);
          starLine(cx + 80, F - 44, 3, 50);
          if (i === 1 || n === 2) spot(cx + 150, F - 58, 'medium');
          cx += 280;
        }
        return cx - x + 140;
      },
      highTrack(x) {
        const hs = [150, 205, 140]; let cx = x + 260;
        c.pads.push({ x: x + 70, w: 96 });
        hs.forEach((h, i) => {
          platform(cx, h, 170, { type: i % 2 });
          starLine(cx + 22, F - h - 36, 3, 52);
          if (i === 1) spot(cx + 85, F - h - 38, 'hard');
          cx += 170 + 125;
        });
        return cx - x + 160;
      },
      hurdles(x) {
        const n = 4; let cx = x + 160;
        for (let i = 0; i < n; i++) { const w = ri(34, 60), h = ri(34, 54); bump(cx, w, h, 'small'); starArc(cx - 40, cx + w + 40, F - h - 30, 46, 3); cx += 170; }
        spot(cx - 70, F - 58, 'easy');
        return cx - x + 80;
      },
      /* ---- Titan ---- */
      boulder(x) {
        const bx = x + r(240, 300);
        bump(bx, ri(96, 112), ri(148, 164), 'boulder', 2);
        starLine(bx + 160, F - 44, 4, 50); starArc(bx + 130, bx + 330, F - 100, 60, 4);
        spot(bx + 150, F - 60, 'medium');
        return bx - x + 430;
      },
      wall(x) {
        const bx = x + r(240, 290);
        bump(bx, 82, ri(196, 214), 'wall', 3);
        starLine(bx + 150, F - 44, 3, 52);
        spot(bx + 170, F - 120, 'hard');
        return bx - x + 380;
      },
      crates(x) {
        let bx = x + r(220, 260);
        for (let i = 0; i < 2; i++) { bump(bx, 62, ri(110, 126), 'wall', 1); starLine(bx + 100, F - 44, 2, 48); bx += 260; }
        spot(bx - 150, F - 60, 'medium');
        return bx - x + 120;
      },
      double(x) {
        const b1 = x + r(220, 260), b2 = b1 + 420;
        bump(b1, 100, 156, 'boulder', 2); bump(b2, 100, 156, 'boulder', 2);
        platform(b1 + 160, 90, 150, { type: 0 }); starLine(b1 + 185, F - 90 - 36, 3, 48);
        spot(b1 + 235, F - 250, 'hard');
        starLine(b2 + 150, F - 44, 3, 50);
        return b2 - x + 380;
      },
      rubble(x) {
        let cx = x + 160;
        for (let i = 0; i < 3; i++) { const w = ri(48, 70), h = ri(36, 52); bump(cx, w, h, 'small'); starArc(cx - 36, cx + w + 36, F - h - 30, 44, 3); cx += 160; }
        platform(cx, 80, 140, { type: 0 }); starLine(cx + 25, F - 80 - 36, 3, 48); spot(cx + 70, F - 80 - 38, 'medium');
        return cx + 140 - x + 120;
      },
      ledge(x) {
        let cx = x + 200; const hs = [70, 112, 74];
        hs.forEach((h, i) => { platform(cx, h, 130, { type: i % 2 }); starLine(cx + 18, F - h - 36, 3, 48); cx += 130 + 90; });
        spot(cx - 200, F - 112 - 40, 'medium');
        c.gaps.push({ x: cx + 80, w: 140 }); starArc(cx + 60, cx + 240, F - 80, 90, 4);
        return cx - x + 400;
      }
    };
    const DECKS = {
      filou: ['street', 'swingGap', 'tower', 'rooftops', 'swingGap', 'tower', 'street', 'swingGap', 'rooftops', 'tower', 'swingGap'],
      ziggy: ['sprint', 'bigGap', 'fenceRun', 'highTrack', 'bigGap', 'hurdles', 'fenceRun', 'bigGap', 'highTrack', 'sprint', 'fenceRun'],
      titan: ['rubble', 'boulder', 'wall', 'double', 'crates', 'boulder', 'ledge', 'wall', 'double', 'boulder', 'crates']
    };
    const REST = { filou: 'street', ziggy: 'sprint', titan: 'rubble' };

    // zone de repos : terrain dégagé autour des caisses à énigme
    const rest = (x0, x1) => {
      starLine(x0 + 60, F - 44, Math.floor((x1 - x0 - 120) / 90), 90);
      spot((x0 + x1) / 2 - 220, F - 58, 'easy'); spot((x0 + x1) / 2 + 230, F - 58, 'easy');
    };

    const deck = DECKS[hero].concat(DECKS[hero]);
    for (let k = deck.length - 1; k > 2; k--) { if (rnd() < .3) { const j = k - 1; [deck[k], deck[j]] = [deck[j], deck[k]]; } }
    const snap = () => ({ g: c.gaps.length, p: c.platforms.length, b: c.bumps.length, a: c.anchors.length, pd: c.pads.length, s: c.stars.length, sp: c.spots.length });
    const rollback = (q) => { c.gaps.length = q.g; c.platforms.length = q.p; c.bumps.length = q.b; c.anchors.length = q.a; c.pads.length = q.pd; c.stars.length = q.s; c.spots.length = q.sp; };
    // fenêtres libres entre les zones dégagées autour des caisses à énigme
    const ZONE = 260;
    const windows = [[440, STATIONS[0] - ZONE], ...STATIONS.slice(0, -1).map((st, k) => [st + ZONE, STATIONS[k + 1] - ZONE]), [STATIONS[2] + ZONE, W - 700]];
    STATIONS.forEach((st) => rest(st - ZONE, st + ZONE));
    let di = 0;
    for (const [a, b] of windows) {
      let x = a;
      while (b - x > 330) {
        let placed = false;
        for (let t = 0; t < deck.length && !placed; t++) {
          const name = deck[(di + t) % deck.length], q = snap();
          const len = SEG[name](x);
          if (x + len <= b) { x += len + 60; di = di + t + 1; placed = true; } else rollback(q);
        }
        if (!placed) { x += SEG.street(x, Math.max(200, b - x)); break; }
      }
      if (b - x > 150) SEG.street(x, b - x);
    }
    rest(W - 700, W - 120);
    void REST;

    /* ----- Lettres : 26 emplacements, les plus difficiles d'abord ----- */
    const taken = [];
    const blocked = (s) => c.gaps.some((g) => s.x > g.x - 24 && s.x < g.x + g.w + 24 && s.diff !== 'hard')
      || c.bumps.some((b) => s.x > b.x - 24 && s.x < b.x + b.w + 24 && s.y > F - b.h - 30);
    const rank = { hard: 0, medium: 1, easy: 2 };
    c.spots.filter((s) => !blocked(s)).sort((a, b) => rank[a.diff] - rank[b.diff]).forEach((s) => {
      if (taken.length < 26 && taken.every((t) => Math.abs(t.x - s.x) > 150)) taken.push(s);
    });
    for (let fx = 300; taken.length < 26 && fx < W - 300; fx += 170) {
      const s = { x: fx, y: F - 58, diff: 'easy' };
      if (!blocked(s) && taken.every((t) => Math.abs(t.x - s.x) > 150)) taken.push(s);
    }
    for (let fx = 330; taken.length < 26 && fx < W - 300; fx += 61) {
      const s = { x: fx, y: F - 58, diff: 'easy' };
      if (!blocked(s) && taken.every((t) => Math.abs(t.x - s.x) > 110)) taken.push(s);
    }
    c.letterSpots = taken.sort((a, b) => a.x - b.x).slice(0, 26);

    /* ----- Ennemis (petits farceurs) : au sol, jamais dans un ravin ni dans un obstacle ----- */
    c.enemyXs = Array.from({ length: 32 }, (_, k) => {
      let ex = 330 + k * 330;
      for (let tries = 0; tries < 12; tries++) {
        const bad = c.gaps.some((g) => ex > g.x - 70 && ex < g.x + g.w + 70) || c.bumps.some((b) => ex > b.x - 50 && ex < b.x + b.w + 50)
          || STATIONS.some((s) => Math.abs(ex - s) < 90) || c.platforms.some((p) => p.bld && ex > p.x - 30 && ex < p.x + p.w + 30 && false);
        if (!bad) break; ex += 70;
      }
      return Math.min(ex, W - 400);
    });
    // doublons éventuels écartés
    for (let k = 1; k < c.enemyXs.length; k++) if (c.enemyXs[k] - c.enemyXs[k - 1] < 120) c.enemyXs[k] = c.enemyXs[k - 1] + 120;
    return c;
  }

  MM.level = { W, F, PW, PH, GRAV, STATIONS, SWING, swing, build };
})();
