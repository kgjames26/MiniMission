/* Niveaux de Mini Mission : un parcours différent par héros, généré à partir d'une graine.
   - Filou  : une ville en hauteur. Ravins et immeubles de plus en plus hauts, à gravir en se balançant au bout de sa toile.
   - Ziggy  : une piste de vitesse. Grands ravins à sauter en pleine course, barrières à défoncer, plateformes hautes.
   - Titan  : un chantier. Gros rochers et murs à briser à coups de poing, lave à franchir de toit en toit.
   Chaque balancement de Filou est vérifié par simulation : il atterrit toujours là où le niveau l'attend.
   Chaque niveau contient 20 petits monstres à capturer (pour apprendre à compter en jouant). */
(() => {
  const MM = (window.MM = window.MM || {});
  const W = 11000, F = 506, H = 620, PW = 58, PH = 86, GRAV = 1450;
  const STATIONS = [1900, 5300, 8700];

  /* ---------- Physique de la toile (partagée avec le jeu) ---------- */
  // Le balancement est normalisé : quelle que soit la position d'accroche, Filou est lâché à la même vitesse (vr) quand il
  // atteint l'angle thr, ce qui rend les sauts prévisibles et fiables. Il peut aussi relancer une toile à tout moment.
  const SWING = { G: 1900, vr: 580, thr: 1.2, damp: .1, maxT: 2.6 };
  const swing = {
    // l'ancre est-elle à portée depuis la main (hx, hy) ? dir = côté de l'ancre
    canReach(a, hx, hy, dir) {
      const dx = (a.x - hx) * dir, dy = hy - a.y;
      return dy >= 90 && dy <= 520 && dx >= 20 && dx <= 400 && Math.hypot(a.x - hx, a.y - hy) <= 540;
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
    // simule le balancement puis le vol ; renvoie le chemin (centre du héros), l'indice du lâcher et l'atterrissage
    simulate(ax, ay, hx, hy, dir, surfaces) {
      const dt = 1 / 120, s = swing.start(ax, ay, hx, hy, dir), path = [];
      let n = 0;
      const mid = PH / 2 - 12;
      while (n++ < 400) { const done = swing.step(s, dt); const h = swing.hand(s); if (n % 12 === 0) path.push({ x: h.x, y: h.y + mid }); if (done) break; }
      const split = path.length;
      const h = swing.hand(s), v = swing.velocity(s);
      let x = h.x, y = h.y + (PH - 12), vx = v.vx, vy = v.vy, land = null;
      for (let i = 0; i < 700; i++) {
        const py = y; vy += GRAV * dt; x += vx * dt; y += vy * dt;
        if (i % 12 === 0) path.push({ x, y: y - PH / 2 });
        if (vy > 0) for (const sf of surfaces) if (x >= sf.x0 && x <= sf.x1 && py <= sf.y && y >= sf.y) { land = { x, y: sf.y, surface: sf }; break; }
        if (land || y > F + 200) break;
      }
      return { path, split, land };
    }
  };

  /* ---------- Petits monstres ---------- */
  // 0 hérisson (marche), 1 limon (rebondit), 2 chauve-souris (vole), 3 golem (costaud : 2 tirs), 4 lutin de feu (lance des boules de feu)
  const MONSTER_TYPES = [
    { name: 'herisson', hp: 1, h: 66 }, { name: 'limon', hp: 1, h: 62 }, { name: 'chauve', hp: 1, h: 72 },
    { name: 'golem', hp: 2, h: 104 }, { name: 'lutin', hp: 1, h: 104 }
  ];

  /* ---------- Génération ---------- */
  function build(hero, rnd) {
    const r = (a, b) => a + rnd() * (b - a);
    const ri = (a, b) => Math.floor(r(a, b + 1));
    const shuffle = (list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const c = { width: W, floor: F, height: H, stations: STATIONS.slice(), gaps: [], platforms: [], bumps: [], anchors: [], pads: [], tramps: [], stars: [], spots: [], monsters: [], log: [] };
    const HAND_Y = F - PH + 12;

    const starLine = (x0, y, n, dx = 46) => { for (let i = 0; i < n; i++) c.stars.push({ x: x0 + i * dx, y }); };
    const starArc = (x0, x1, yBase, peak, n) => { for (let i = 0; i < n; i++) { const t = (i + .5) / n; c.stars.push({ x: x0 + (x1 - x0) * t, y: yBase - peak * 4 * t * (1 - t) }); } };
    const spot = (x, y, diff) => c.spots.push({ x, y, diff });
    const platform = (x, h, w, extra = {}) => { const p = { x, y: F - h, w, h: 18, type: ri(0, 1), ...extra }; c.platforms.push(p); return p; };
    const bump = (x, w, h, kind, hp = 0) => { const b = { id: 'b' + c.bumps.length, x, w, h, kind, hp, maxHp: hp, type: ri(0, 2) }; c.bumps.push(b); return b; };
    const building = (x, h, w) => platform(x, h, w, { bld: { color: ['#ffb36b', '#ff8fa3', '#74d3a0', '#ffd45c', '#a994f2', '#ff9a7a'][ri(0, 5)], roof: ['#e8564b', '#5a6fcf', '#3f9d6e', '#c9742f'][ri(0, 3)] } });
    const rooftopSurface = (p) => ({ x0: p.x - 6, x1: p.x + p.w + 6, y: p.y });

    // Cherche une ancre telle que, depuis tous les points de départ plausibles, la toile atterrisse sur la surface visée.
    function findAnchor({ starts, hy = HAND_Y, ayList, axList, surfaces, target }) {
      for (const ay of ayList) for (const ax of axList) {
        const a = { x: ax, y: ay }; let ok = true, n = 0, res0 = null;
        for (const sx of starts) {
          if (!swing.canReach(a, sx, hy, 1)) continue;
          n++;
          const res = swing.simulate(ax, ay, sx, hy, 1, surfaces);
          if (!res.land || res.land.surface !== target) { ok = false; break; }
          if (!res0) res0 = res;
        }
        if (ok && n >= 3) return { ax, ay, path: res0.path, split: res0.split };
      }
      return null;
    }
    const swingStars = (path, from = 1, every = 2) => { path.forEach((p, i) => { if (i >= from && i % every === 0 && p.y < F - 30) c.stars.push({ x: p.x, y: p.y }); }); };
    const AYS = [F - 440, F - 420, F - 400, F - 380, F - 360, F - 340];

    /* ----- Segments ----- */
    const SEG = {
      street(x, fixedLen) {
        const len = fixedLen || r(360, 520);
        starLine(x + 40, F - 42, Math.floor((len - 40) / 70), 70);
        spot(x + len * .55, F - 56, 'easy');
        if (hero !== 'filou') { bump(x + len * .35, ri(36, 56), ri(34, 46), 'small'); }
        return len;
      },
      /* ---- Filou ---- */
      // grands trous traversés de meuble en meuble / de toit en toit : des pierres flottantes à hauteurs variées
      hopStones(x) {
        const approach = r(150, 200), gx = x + approach, n = ri(4, 6);
        let cx = gx + r(85, 105), prevH = 0;
        for (let i = 0; i < n; i++) {
          const w = r(92, 125);
          let h = i === 0 ? r(55, 85) : prevH + (rnd() < .5 ? 1 : -1) * r(30, 65);
          h = Math.max(60, Math.min(190, h)); if (i === n - 1) h = Math.min(h, 120);
          platform(cx, h, w, { kind: 'furn', icon: ri(0, 4) });
          starLine(cx + w * .2, F - h - 40, 2, w * .5);
          if (i === 1 || i === n - 1) spot(cx + w / 2, F - h - 44, i === n - 1 ? 'hard' : 'medium');
          prevH = h; cx += w + r(88, 118);
        }
        c.gaps.push({ x: gx, w: cx - gx - 6 });
        return approach + (cx - gx) + 330;
      },
      // grimper de barre en barre pour passer par-dessus un grand immeuble qui barre la route
      towerHop(x) {
        const approach = r(170, 210), tw = r(170, 210), th = r(285, 315);
        let cx = x + approach; const hs = [75, 150, 225];
        hs.forEach((h, i) => { platform(cx, h, 100, { kind: 'bar' }); starLine(cx + 20, F - h - 40, 2, 50); if (i === 1) spot(cx + 50, F - h - 42, 'medium'); cx += 100 + (i < 2 ? 32 : 58); });
        const tx = cx; bump(tx, tw, th, 'tower', 0); spot(tx + tw / 2, F - th - 40, 'hard'); starLine(tx + 30, F - th - 40, 3, 55);
        cx = tx + tw + 55;
        [225, 150, 75].forEach((h, i) => { platform(cx, h, 100, { kind: 'bar' }); starLine(cx + 20, F - h - 40, 2, 50); cx += 100 + 32; });
        return cx - x + 260;
      },
      // Filou : un immeuble trop haut pour être gravi, on le franchit d'un grand balancement par-dessus
      swingOver(x) {
        const approach = r(420, 460), gx = x + approach;
        for (const th of [240, 215, 190, 165]) for (let attempt = 0; attempt < 4; attempt++) {
          const tw = r(120, 150);
          const right = { x0: gx + tw, x1: gx + tw + 520, y: F }, left = { x0: gx - 900, x1: gx, y: F };
          let best = null;
          for (const ay of [F - 560, F - 540, F - 520, F - 500, F - 480]) for (const ax of [gx - 380, gx - 350, gx - 320, gx - 290, gx - 260]) {
            const a = { x: ax, y: ay }; let ok = true, n = 0, res0 = null;
            for (const sx of [gx - 520, gx - 470, gx - 420, gx - 370, gx - 320]) {
              if (!swing.canReach(a, sx, HAND_Y, 1)) continue;
              n++;
              const res = swing.simulate(ax, ay, sx, HAND_Y, 1, [left, right]);
              const clear = res.path.every((p) => p.x < gx - 20 || p.x > gx + tw + 20 || p.y + PH / 2 < F - th - 10);
              if (!res.land || res.land.surface !== right || !clear) { ok = false; break; }
              if (!res0) res0 = res;
            }
            if (ok && n >= 3 && !best) best = { ax, ay, path: res0.path, split: res0.split };
          }
          if (!best) continue;
          bump(gx, tw, th, 'tower', 0); c.anchors.push({ x: best.ax, y: best.ay }); c.log.push('swingOver');
          swingStars(best.path, 2, 2);
          const pb = best.path[Math.min(best.path.length - 1, best.split + 2)]; spot(pb.x, pb.y, 'hard');
          return approach + tw + 480;
        }
        return SEG.swingGap(x);
      },
      // Titan : un grand trou, et devant lui un pilier à faire tomber à coups de poing pour s'en faire un pont
      pillarBridge(x) {
        const pw = 64, approach = r(210, 250), x0 = x + approach, gapW = r(320, 360), gx = x0 + pw + 40, L = 40 + gapW + 70;
        bump(x0, pw, L, 'pillar', 3);
        c.gaps.push({ x: gx, w: gapW });
        starLine(gx + 40, F - pw - 38, 4, (gapW - 80) / 3);
        spot(gx + gapW / 2, F - pw - 42, 'hard');
        c.log.push('pillarBridge');
        return approach + pw + 40 + gapW + 330;
      },
      // Ziggy : un grand immeuble, et un trampoline puissant en bas pour passer par-dessus
      trampTower(x) {
        const approach = r(220, 260), tx0 = x + approach, tw = r(170, 200), th = r(320, 350), bx = tx0 + 110 + 140;
        c.tramps.push({ x: tx0, w: 110 });
        bump(bx, tw, th, 'tower', 0);
        spot(bx + tw / 2, F - th - 44, 'hard'); starLine(bx + 30, F - th - 40, 3, 55);
        starArc(tx0 + 40, bx + tw + 90, F - th - 80, 170, 6);
        c.log.push('trampTower');
        return approach + 110 + 140 + tw + 380;
      },
      // plusieurs balancements d'affilée : on se pose à peine, puis on repart sur la toile
      swingChain(x) {
        const n = rnd() < .45 ? 3 : 2; let end = x, first = true;
        for (let k = 0; k < n; k++) {
          const before = c.log.length, len = first ? SEG.swingGap(end) : SEG.swingGap(end, { approach: 262 });
          const g = c.gaps[c.gaps.length - 1];
          if (c.log[c.log.length - 1] === 'swingGap!') { end = (first ? end + len : end + len); break; }
          void before; end = g.x + g.w; first = false;
        }
        const last = c.gaps[c.gaps.length - 1];
        return Math.max(end, last.x + last.w) + 470 - x;
      },
      swingGap(x, opts) {
        const approach = (opts && opts.approach) || r(170, 230), gx = x + approach;
        for (let attempt = 0; attempt < 6; attempt++) {
          const w = attempt < 4 ? r(310, 420) : r(260, 300);
          const right = { x0: gx + w, x1: gx + w + 520, y: F }, left = { x0: gx - 800, x1: gx, y: F };
          const found = findAnchor({
            starts: [gx - 250, gx - 190, gx - 130, gx - 70, gx - 12].filter((st) => !opts || st >= gx - approach + 12), ayList: [F - 360, F - 380, F - 340, F - 400, F - 420],
            axList: [gx + w * .5, gx + w * .42, gx + w * .58], surfaces: [left, right], target: right
          });
          if (!found) continue;
          c.gaps.push({ x: gx, w }); c.anchors.push({ x: found.ax, y: found.ay }); c.log.push('swingGap');
          swingStars(found.path, 2, 2);
          // lettres sur la toile, puis après le lâcher
          const pa = found.path[Math.max(0, found.split - 2)], pb = found.path[Math.min(found.path.length - 1, found.split + 2)];
          spot(pa.x, pa.y, 'hard'); spot(pb.x, pb.y, 'hard');
          return approach + w + 470;
        }
        c.log.push('swingGap!'); c.gaps.push({ x: gx, w: 140 }); starArc(gx - 20, gx + 160, F - 70, 90, 5);
        return approach + 140 + 400;
      },
      // une échelle d'immeubles de plus en plus hauts : on monte de toit en toit en relançant la toile
      ladderTall(x) { return SEG.ladder(x, true); },
      ladder(x, tall) {
        const approach = r(170, 220), nSteps = tall ? ri(3, 5) : ri(2, 3);
        const plan = tall ? [[150, 180], [255, 290], [365, 400], [470, 505], [575, 610]] : [[130, 160], [205, 245], [285, 325]];
        let cursor = x + approach, prev = null, built = 0;
        for (let i = 0; i < nSteps; i++) {
          let done = false;
          for (let attempt = 0; attempt < 14 && !done; attempt++) {
            const h = r(plan[i][0], plan[i][1]), w = i === 0 ? r(300, 340) : r(230, 300), rw = r(250, 300);
            const chasmStart = prev ? prev.x + prev.w : cursor, tx = chasmStart + w;
            const roof = { x: tx, y: F - h, w: rw }, roofS = rooftopSurface(roof);
            let surfaces, starts, hy;
            if (prev) {
              const left = rooftopSurface(prev);
              surfaces = [left, roofS, { x0: -400, x1: W + 400, y: F }];
              const right = prev.x + prev.w; hy = prev.y - PH + 12;
              starts = [230, 170, 110, 50, 12].map((d) => right - d).filter((sx) => sx > prev.x + 10);
            } else {
              surfaces = [{ x0: -400, x1: chasmStart, y: F }, roofS, { x0: tx + rw + 6, x1: W + 400, y: F }];
              hy = HAND_Y; starts = [230, 170, 110, 50, 12].map((d) => chasmStart - d);
            }
            const found = findAnchor({ starts, hy, ayList: tall && prev ? [hy - 250, hy - 290, hy - 330, hy - 370, hy - 220, hy - 410] : AYS, axList: [.1, .2, .3, .4, .5, .6].map((f) => chasmStart + w * f), surfaces, target: roofS });
            if (!found) continue;
            if (!prev) c.gaps.push({ x: chasmStart, w });
            const p = building(tx, h, rw);
            c.anchors.push({ x: found.ax, y: found.ay }); c.log.push('ladder');
            swingStars(found.path, 2, 2);
            starLine(tx + 40, F - h - 34, Math.floor((rw - 40) / 54), 54);
            const pb = found.path[Math.min(found.path.length - 1, found.split + 2)];
            if (i % 2 === 0) spot(pb.x, pb.y, 'hard');                      // lettre en plein vol, après le lâcher
            spot(tx + rw * .6, F - h - 36, i === nSteps - 1 ? 'hard' : 'medium');
            prev = p; built++; done = true;
          }
          if (!done) break;
        }
        if (!built) { c.log.push('ladder!'); starLine(cursor, F - 44, 5, 60); return approach + 300; }
        return prev.x + prev.w + 380 - x;
      },
      rooftops(x) {
        const heights = [110, 170, 225, 160], n = ri(3, 4); let cx = x + 180;
        for (let i = 0; i < n; i++) {
          const w = r(180, 210), h = heights[i];
          building(cx, h, w);
          starLine(cx + 30, F - h - 34, 3, 52);
          if (i === 1 || i === 2) spot(cx + w * .5, F - h - 36, 'medium');
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
        const hs = [150, 215, 275, 205]; let cx = x + 260;
        c.pads.push({ x: x + 70, w: 96 });
        hs.forEach((h, i) => {
          platform(cx, h, 170, { type: i % 2 });
          starLine(cx + 22, F - h - 36, 3, 52);
          if (i === 1 || i === 2) spot(cx + 85, F - h - 38, 'hard');
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
      },
      // de la lave partout : on traverse en sautant d'immeuble en immeuble
      lavaRoofs(x) {
        const approach = r(150, 200), gx = x + approach, n = ri(3, 4);
        const heights = [100, 160, 215, 150].slice(0, n), gapW = 120;
        const widths = heights.map(() => r(170, 200));
        const total = widths.reduce((s, w) => s + w + gapW, gapW);
        c.gaps.push({ x: gx, w: total });
        let cx = gx + gapW;
        heights.forEach((h, i) => {
          building(cx, h, widths[i]);
          starLine(cx + 28, F - h - 36, 3, 52);
          if (i === 1 || i === n - 1) spot(cx + widths[i] / 2, F - h - 38, i === n - 1 ? 'hard' : 'medium');
          if (i < n - 1) starArc(cx + widths[i] - 12, cx + widths[i] + gapW + 12, F - h - 36, 70, 3);
          cx += widths[i] + gapW;
        });
        return approach + total + 330;
      }
    };
    const DECKS = {
      filou: ['street', 'swingGap', 'ladderTall', 'hopStones', 'swingOver', 'swingChain', 'ladder', 'towerHop', 'swingChain', 'ladderTall', 'rooftops', 'swingOver', 'hopStones', 'swingGap', 'swingChain', 'ladder', 'swingChain'],
      ziggy: ['sprint', 'hopStones', 'trampTower', 'bigGap', 'towerHop', 'fenceRun', 'highTrack', 'hopStones', 'bigGap', 'hurdles', 'towerHop', 'fenceRun', 'hopStones', 'trampTower', 'highTrack'],
      titan: ['rubble', 'hopStones', 'boulder', 'lavaRoofs', 'towerHop', 'wall', 'double', 'hopStones', 'crates', 'lavaRoofs', 'towerHop', 'ledge', 'boulder', 'hopStones', 'wall', 'lavaRoofs']
    };

    // zone de repos : terrain dégagé autour des caisses à énigme
    const rest = (x0, x1) => {
      starLine(x0 + 60, F - 44, Math.floor((x1 - x0 - 120) / 90), 90);
      spot((x0 + x1) / 2 - 220, F - 58, 'easy'); spot((x0 + x1) / 2 + 230, F - 58, 'easy');
    };

    const deck = DECKS[hero].concat(DECKS[hero]);
    for (let k = deck.length - 1; k > 2; k--) { if (rnd() < .3) { const j = k - 1; [deck[k], deck[j]] = [deck[j], deck[k]]; } }
    const snap = () => ({ g: c.gaps.length, p: c.platforms.length, b: c.bumps.length, a: c.anchors.length, pd: c.pads.length, tr: c.tramps.length, s: c.stars.length, sp: c.spots.length });
    const rollback = (q) => { c.gaps.length = q.g; c.platforms.length = q.p; c.bumps.length = q.b; c.anchors.length = q.a; c.pads.length = q.pd; c.tramps.length = q.tr; c.stars.length = q.s; c.spots.length = q.sp; };
    const ZONE = 260;
    const windows = [[440, STATIONS[0] - ZONE], ...STATIONS.slice(0, -1).map((st, k) => [st + ZONE, STATIONS[k + 1] - ZONE]), [STATIONS[2] + ZONE, W - 700]];
    STATIONS.forEach((st) => rest(st - ZONE, st + ZONE));
    let di = 0, wi = -1, pillarDone = hero !== 'titan';
    for (const [a, b] of windows) {
      let x = a; wi++;
      if (!pillarDone && wi === 1 && b - x > 1200) { const q0 = snap(), len0 = SEG.pillarBridge(x); if (x + len0 <= b) { x += len0 + 60; pillarDone = true; } else rollback(q0); }
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

    /* ----- 20 petits monstres, répartis sur tout le parcours (sol, toits, airs) ----- */
    {
      const blockedRanges = [
        ...c.gaps.map((g) => [g.x - 30, g.x + g.w + 30]),
        ...c.bumps.filter((b) => b.kind !== 'small').map((b) => [b.x - 60, b.x + b.w + 60]),
        ...STATIONS.map((s) => [s - 150, s + 150])
      ].sort((p, q) => p[0] - q[0]);
      const ground = []; let cur = 700;
      for (const [a, b] of blockedRanges) { if (a - cur >= 150) ground.push({ x0: cur + 30, x1: a - 30, y: F, roof: false }); cur = Math.max(cur, b); }
      if (W - 800 - cur >= 150) ground.push({ x0: cur + 30, x1: W - 830, y: F, roof: false });
      const roofs = c.platforms.filter((p) => p.w >= 130 && !STATIONS.some((s) => Math.abs(p.x + p.w / 2 - s) < 200)).map((p) => ({ x0: p.x + 40, x1: p.x + p.w - 40, y: p.y, roof: true }));
      const surfaces = ground.concat(roofs);
      const order = shuffle([0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
      const lo = 850, hi = Math.round(W * .6), step = (hi - lo) / 20, used = [];
      for (let i = 0; i < 20; i++) {
        const type = order[i], s0 = lo + i * step, s1 = s0 + step;
        let x, y;
        {
          const cand = surfaces.map((sf) => ({ sf, a: Math.max(sf.x0, s0 - 120), b: Math.min(sf.x1, s1 + 120) })).filter((q) => q.b - q.a >= 70 && !used.some((u) => Math.abs(u - (q.a + q.b) / 2) < 150));
          const pool = (type === 4 || rnd() < .45) && cand.some((q) => q.sf.roof) ? cand.filter((q) => q.sf.roof) : cand;
          const pickFrom = pool.length ? pool : cand;
          if (!pickFrom.length) { const sf = surfaces.reduce((best, q) => Math.abs((q.x0 + q.x1) / 2 - s0) < Math.abs((best.x0 + best.x1) / 2 - s0) ? q : best, surfaces[0]); x = (sf.x0 + sf.x1) / 2; y = sf.y; }
          else { const q = pickFrom[Math.floor(rnd() * pickFrom.length)]; x = r(q.a, q.b); y = q.sf.y; }
        }
        used.push(x);
        c.monsters.push({ id: i, type, x, y, hp: MONSTER_TYPES[type].hp });
      }
    }

    /* ----- Lettres : 26 emplacements, les plus difficiles d'abord ----- */
    // les dernières étoiles, lettres et monstres ne se suivent pas : chaque autocollant a le temps d'être savouré
    c.stars = c.stars.filter((s) => s.x < W * .76);
    const taken = [];
    const blocked = (s) => c.gaps.some((g) => s.x > g.x - 24 && s.x < g.x + g.w + 24 && s.diff !== 'hard' && s.y > F - 120)
      || c.bumps.some((b) => s.x > b.x - 24 && s.x < b.x + b.w + 24 && s.y > F - b.h - 30);
    const rank = { hard: 0, medium: 1, easy: 2 };
    c.spots.filter((s) => !blocked(s) && s.x < W - 1000).sort((a, b) => rank[a.diff] - rank[b.diff]).forEach((s) => {
      if (taken.length < 26 && taken.every((t) => Math.abs(t.x - s.x) > 150 || Math.abs(t.y - s.y) > 120)) taken.push(s);
    });
    for (let fx = 300; taken.length < 26 && fx < W - 1000; fx += 170) {
      const s = { x: fx, y: F - 58, diff: 'easy' };
      if (!blocked(s) && taken.every((t) => Math.abs(t.x - s.x) > 150)) taken.push(s);
    }
    for (let fx = 330; taken.length < 26 && fx < W - 1000; fx += 61) {
      const s = { x: fx, y: F - 58, diff: 'easy' };
      if (!blocked(s) && taken.every((t) => Math.abs(t.x - s.x) > 110)) taken.push(s);
    }
    // la dernière lettre est loin des dernières étoiles
    if (Math.max(...taken.map((t) => t.x)) < W - 1900) {
      for (let fx = W - 1500; fx < W - 1050; fx += 40) { const s = { x: fx, y: F - 58, diff: 'easy' }; if (!blocked(s)) { taken.pop(); taken.push(s); break; } }
    }
    c.letterSpots = taken.sort((a, b) => a.x - b.x).slice(0, 26);
    return c;
  }

  MM.level = { W, F, H, PW, PH, GRAV, STATIONS, SWING, swing, build, MONSTER_TYPES };
})();
