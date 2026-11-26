/* Mini Mission — les mondes de Rose : données de chaque niveau (rose-world.html?w=<monde>, moteur commun rose-engine.js). */
(() => {
  const MM = (window.MM = window.MM || {}); const W = (MM.ROSE_WORLDS = MM.ROSE_WORLDS || {});
  const W_ = W;
  // ================= La Lune =================
  W.lune = {
    name: 'La Lune',
    chip: '🌙 La Lune',
    on: 'la Lune',
    theme: '#140f3a',
    L: 9200,
    cave: [4650, 6450],
    ceil: 640,
    pin: 1,
    intro: 'Bienvenue sur la Lune ! Les petits extraterrestres farceurs ont enfermé les amis dans des cages. Libère-les, et envoie des bulles aux farceurs !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de la Lune ! Prochaine étape : Mars !',
    next: 'mars',
    nextIcon: '🔴',
    caveShade: ['rgba(20,14,48,.85)', 'rgba(40,30,80,.35)'],
    colors: { ceil: ['#2a2350', '#5a5390', '#6f68a8'], crystal: '140,230,255', cloud: ['#fff', '#fff'], slab: ['#8e8bb0', '#c9c7e0'], tite: '#4b447e', mesa: '#9a98b4', arch: '#8e8bb0', mesaTop: '#c9c7e0', rock: ['#9a98b4', '#b9b7cf'], mite: ['#5d568f', '#7a73ad'], ice: ['#e3f2fc', '#fff'], pancake: ['#9a98b4', '#b9b7cf'] },
    solids: [
    { x: 950, y: 0, w: 170, h: 300, kind: 'rock' },
    { x: 2250, y: 250, w: 320, h: 40, kind: 'slab' },
    { x: 3250, y: 0, w: 210, h: 380, kind: 'rock' },
    { x: 4950, y: 0, w: 150, h: 280, kind: 'mite' },
    { x: 5350, y: 310, w: 150, h: 'ceil', kind: 'tite' },
    { x: 5750, y: 0, w: 160, h: 300, kind: 'mite' },
    { x: 6150, y: 330, w: 150, h: 'ceil', kind: 'tite' },
    { x: 7650, y: 260, w: 300, h: 40, kind: 'slab' },
  ],
    stars: [[300, 700, 60, 60, 5],[900, 1170, 360, 80, 5],[2270, 2550, 330, 30, 4],[3200, 3510, 440, 90, 5],[4800, 5250, 380, 60, 5],[5500, 5900, 380, 40, 5],[6250, 6420, 150, 50, 3],[7000, 7400, 80, 120, 5],[7670, 7930, 340, 30, 4],[8400, 8700, 70, 60, 4]],
    aliens: [
    { type: 'glouglou', x: 1500, x0: 1300, x1: 1750, y: 0 },
    { type: 'boing', x: 2700, x0: 2620, x1: 2900, y: 0 },
    { type: 'zap', x: 3900, y0: 330, y: 330 },
    { type: 'boing', x: 4300, x0: 4200, x1: 4500, y: 0 },
    { type: 'glouglou', x: 6750, x0: 6550, x1: 6950, y: 0 },
    { type: 'glouglou', x: 7150, x0: 6950, x1: 7450, y: 0 },
    { type: 'boing', x: 8050, x0: 7980, x1: 8250, y: 0 },
    { type: 'zap', x: 8850, y0: 360, y: 360 },
  ],
    boxes: [ { x: 2950, y: 260 }, { x: 6750, y: 240 }, { x: 8350, y: 300 } ],
    riddles: [
    { q: 'Comment s’appelle l’astre qui tourne autour de la Terre et brille la nuit ?', o: [['🌙', 'la Lune'], ['☀️', 'le Soleil'], ['🪐', 'Saturne']], a: 0, fact: 'Oui ! La Lune tourne autour de la Terre. C’est là que tu es, avec Rose !' },
    { q: 'Qui a marché le premier sur la Lune ?', o: [['🧑‍🚀', 'un astronaute'], ['🐶', 'un chien'], ['🤖', 'un robot']], a: 0, fact: 'Bravo ! C’était l’astronaute Neil Armstrong, en 1969. Il a laissé ses traces de pas sur la Lune.' },
    { q: 'Le premier homme dans l’espace s’appelait Youri Gagarine. Dans quoi est-il monté ?', o: [['🚀', 'une fusée'], ['🎈', 'un ballon'], ['🚲', 'un vélo']], a: 0, fact: 'Oui ! En 1961, Youri Gagarine a fait le tour de la Terre dans une fusée.' },
    { q: 'Quel animal a fait le tour de la Terre dans l’espace, avant les astronautes ?', o: [['🐶', 'un chien'], ['🐘', 'un éléphant'], ['🐟', 'un poisson']], a: 0, fact: 'Oui ! Une petite chienne, Laïka, est allée dans l’espace en 1957.' },
    { q: 'Quelle planète est rouge ?', o: [['🔴', 'Mars'], ['🔵', 'Neptune'], ['🌍', 'la Terre']], a: 0, fact: 'Bravo ! Mars est rouge, à cause de sa poussière rouge.' },
    { q: 'Quelle planète a de grands anneaux ?', o: [['🪐', 'Saturne'], ['🌙', 'la Lune'], ['☀️', 'le Soleil']], a: 0, fact: 'Oui ! Saturne a de grands anneaux faits de glace et de cailloux.' },
    { q: 'Qu’est-ce qui emmène les astronautes dans l’espace ?', o: [['🚀', 'une fusée'], ['🚗', 'une voiture'], ['⛵', 'un bateau']], a: 0, fact: 'Oui ! Il faut une très grande fusée pour aller dans l’espace.' },
    { q: 'Où vivent les astronautes qui tournent autour de la Terre ?', o: [['🛰️', 'dans une station spatiale'], ['🏰', 'dans un château'], ['⛺', 'sous une tente']], a: 0, fact: 'Oui ! Dans la station spatiale, les astronautes flottent et dorment attachés à leur sac de couchage.' },
    { q: 'Qu’est-ce qui roule sur Mars pour l’explorer ?', o: [['🤖', 'un robot'], ['🛹', 'un skate'], ['🐴', 'un cheval']], a: 0, fact: 'Bravo ! Des robots roulent sur Mars et prennent des photos pour les savants.' },
    { q: 'Sur quelle planète vivons-nous ?', o: [['🌍', 'la Terre'], ['🔴', 'Mars'], ['🪐', 'Saturne']], a: 0, fact: 'Oui ! La Terre, notre maison, est la planète bleue.' },
    { q: 'Sur la Lune, on est très léger. Comment peut-on sauter ?', o: [['🦘', 'très haut'], ['🐌', 'pas du tout'], ['🪨', 'comme un caillou']], a: 0, fact: 'Oui ! Sur la Lune, les astronautes faisaient de grands bonds.' },
    { q: 'Quelle est la plus grosse planète ?', o: [['🟠', 'Jupiter'], ['⚪', 'Mercure'], ['🌙', 'la Lune']], a: 0, fact: 'Bravo ! Jupiter est la plus grosse planète. On pourrait y mettre plus de mille Terre !' },
  ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, SX, SY, L, CAVE0, CAVE1, CEIL, bgStars, craters, pebbles, hills } = A; 
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d0930'); g.addColorStop(1, '#2d2575'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = .5 + .5 * Math.sin(time * 2 + s.tw); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x, s.y * GY * .95, s.r, s.r); }
    ctx.globalAlpha = 1;
    const er = Math.min(W, H) * .09, ex = W * .8 - camX * zoom * .02, ey = H * .18 + camY * zoom * .05;   // la Terre au loin
    ctx.fillStyle = '#3b8be0'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5fc46a'; ctx.beginPath(); ctx.ellipse(ex - er * .3, ey - er * .1, er * .35, er * .25, .5, 0, Math.PI * 2); ctx.ellipse(ex + er * .35, ey + er * .3, er * .25, er * .18, -.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.ellipse(ex + er * .1, ey - er * .55, er * .4, er * .1, 0, 0, Math.PI * 2); ctx.fill();
    // collines lointaines
    ctx.fillStyle = '#4a467a';
    for (const h of hills) { const x = (h.x - camX * .4) * zoom; if (x > W + 400 || x + h.w * zoom < -400) continue; const by = SY(0) + camY * zoom * .6;
      ctx.beginPath(); ctx.moveTo(x - h.w * zoom * .5, by); ctx.quadraticCurveTo(x, by - h.h * zoom * 1.4, x + h.w * zoom * .5, by); ctx.fill(); }
    },
    drawGround(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, SX, SY, L, CAVE0, CAVE1, CEIL, bgStars, craters, pebbles, hills } = A; 
    const gy = SY(0);
    ctx.fillStyle = '#b9bccd'; ctx.fillRect(0, gy, W, H - gy + 10);
    ctx.fillStyle = '#d7d9e6'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
    for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > W + 200) continue;
      ctx.fillStyle = '#a2a5b9'; ctx.beginPath(); ctx.ellipse(sx, gy + (24 + c.r * .2) * zoom, c.r * zoom, c.r * .22 * zoom, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c8cad8'; ctx.beginPath(); ctx.ellipse(sx, gy + (20 + c.r * .2) * zoom, c.r * .85 * zoom, c.r * .16 * zoom, 0, 0, Math.PI); ctx.fill(); }
    },
  };
  // ================= Mars =================
  W.mars = {
    name: 'Mars',
    chip: '🔴 Mars',
    on: 'Mars',
    theme: '#7a3018',
    L: 9600,
    cave: [4700, 6600],
    ceil: 620,
    pin: 0,
    intro: 'Bienvenue sur Mars, la planète rouge ! Les farceurs ont encore enfermé les amis. Les tourbillons de poussière peuvent t’aider à monter !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Mars ! Prochaine étape : Vénus !',
    next: 'venus',
    nextIcon: '🟡',
    lifts: [760, 2790, 3320, 6950, 8250],
    rover: 2620,
    heli: 6800,
    caveShade: ['rgba(60,18,10,.85)', 'rgba(110,40,20,.35)'],
    colors: { ceil: ['#4a1d12', '#8a3a22', '#9c4a2c'], crystal: '255,200,120', cloud: ['#fff', '#fff'], slab: ['#a2502e', '#dd8a5a'], tite: '#6c2a18', mesa: '#b5532f', arch: '#a04a2a', mesaTop: '#e08b5a', rock: ['#a8482a', '#c8673e'], mite: ['#7c3420', '#9a4a2c'], ice: ['#e3f2fc', '#ffffff'], pancake: ['#a8482a', '#c8673e'] },
    solids: [
    { x: 880, y: 0, w: 380, h: 220, kind: 'mesa' },
    { x: 1950, y: 0, w: 540, h: 370, kind: 'arch', oh: 250 },
    { x: 2850, y: 260, w: 300, h: 40, kind: 'slab' },
    { x: 3480, y: 0, w: 220, h: 330, kind: 'rock' },
    { x: 5000, y: 0, w: 160, h: 270, kind: 'mite' },
    { x: 5400, y: 300, w: 150, h: 'ceil', kind: 'tite' },
    { x: 5800, y: 0, w: 170, h: 290, kind: 'mite' },
    { x: 6200, y: 320, w: 150, h: 'ceil', kind: 'tite' },
    { x: 7150, y: 0, w: 500, h: 340, kind: 'arch', oh: 240 },
    { x: 7900, y: 250, w: 300, h: 40, kind: 'slab' },
    { x: 8700, y: 0, w: 280, h: 120, kind: 'ice' },
  ],
    stars: [[300, 650, 60, 60, 5],[980, 1160, 270, 40, 4],[2060, 2380, 420, 40, 5],[2120, 2320, 60, 50, 4],[2880, 3120, 330, 30, 4],[3500, 3680, 400, 60, 4],[4900, 5300, 380, 60, 5],[5560, 6000, 380, 40, 5],[6300, 6550, 150, 50, 3],[7240, 7560, 400, 40, 5],[7300, 7500, 60, 50, 4],[8740, 8940, 180, 40, 4],[9000, 9200, 60, 60, 4]],
    aliens: [
    { type: 'bidou', x: 1450, x0: 1320, x1: 1700, y: 0 },
    { type: 'boing', x: 3000, x0: 2900, x1: 3200, y: 0 },
    { type: 'zap', x: 3950, y0: 330, y: 330 },
    { type: 'zigzag', x: 4400, x0: 4300, x1: 4600, y: 0 },
    { type: 'glouglou', x: 5500, x0: 5300, x1: 5700, y: 0 },
    { type: 'zap', x: 6450, y0: 380, y: 380 },
    { type: 'bidou', x: 7600, x0: 7450, x1: 7850, y: 0 },
    { type: 'zigzag', x: 8400, x0: 8300, x1: 8550, y: 0 },
    { type: 'zap', x: 9050, y0: 350, y: 350 },
  ],
    boxes: [ { x: 1070, y: 310 }, { x: 2220, y: 455 }, { x: 8050, y: 340 } ],
    riddles: [
    { q: 'Pourquoi Mars est-elle rouge ?', o: [['🔩', 'à cause de la rouille'], ['🍓', 'à cause des fraises'], ['🎨', 'quelqu’un l’a peinte']], a: 0, fact: 'Oui ! Le sol de Mars est plein de rouille, comme un vieux clou. C’est ça qui le rend rouge.' },
    { q: 'Où se trouve le plus grand volcan de tout le système solaire ?', o: [['🔴', 'sur Mars'], ['🌍', 'sur la Terre'], ['🌙', 'sur la Lune']], a: 0, fact: 'Bravo ! Il s’appelle Olympus Mons. Il est plus de deux fois plus haut que la plus haute montagne de la Terre.' },
    { q: 'Combien de petites lunes tournent autour de Mars ?', o: [['2️⃣', 'deux'], ['🔟', 'dix'], ['0️⃣', 'aucune']], a: 0, fact: 'Oui ! Elles s’appellent Phobos et Déimos. Elles ressemblent à des pommes de terre !' },
    { q: 'Qu’est-ce qui roule sur Mars avec six roues ?', o: [['🤖', 'un robot'], ['🚂', 'un train'], ['🛵', 'un scooter']], a: 0, fact: 'Bravo ! Les robots Curiosity et Perseverance roulent sur Mars et étudient les cailloux.' },
    { q: 'Qu’est-ce qui a volé sur Mars pour la première fois, en deux mille vingt et un ?', o: [['🚁', 'un petit hélicoptère'], ['🦅', 'un aigle'], ['🎈', 'un ballon']], a: 0, fact: 'Oui ! Il s’appelait Ingenuity. C’était le tout premier vol sur une autre planète.' },
    { q: 'Qu’y a-t-il de blanc tout en haut et tout en bas de Mars ?', o: [['🧊', 'de la glace'], ['🥛', 'du lait'], ['☁️', 'du coton']], a: 0, fact: 'Bravo ! Aux pôles de Mars, il y a de la glace, comme au pôle Nord de la Terre.' },
    { q: 'Combien de temps dure une journée sur Mars ?', o: [['🕐', 'presque comme chez nous'], ['⚡', 'une minute'], ['📅', 'une année']], a: 0, fact: 'Oui ! Une journée sur Mars dure à peine plus longtemps qu’une journée sur la Terre.' },
    { q: 'Qu’est-ce qui tourne sur Mars et soulève la poussière ?', o: [['🌪️', 'des tourbillons'], ['🌧️', 'la pluie'], ['⛄', 'des bonshommes de neige']], a: 0, fact: 'Oui ! Des tourbillons de poussière tournent comme des toupies géantes. Rose peut s’en servir pour monter !' },
    { q: 'Quelle planète est une voisine de la Terre ?', o: [['🔴', 'Mars'], ['🪐', 'Saturne'], ['🔵', 'Neptune']], a: 0, fact: 'Bravo ! Mars est notre voisine, avec Vénus. Pour y aller, il faut plusieurs mois de voyage en fusée.' },
    { q: 'Le premier robot qui a roulé sur Mars était gros comme…', o: [['📦', 'un petit carton'], ['🏠', 'une maison'], ['🐘', 'un éléphant']], a: 0, fact: 'Oui ! Il s’appelait Sojourner, et il était à peine plus grand qu’un four à micro-ondes.' },
    { q: 'Peut-on respirer sans casque sur Mars ?', o: [['🧑‍🚀', 'non, il faut un casque'], ['🌬️', 'oui, facilement'], ['🤿', 'avec un tuba']], a: 0, fact: 'Bravo ! Sur Mars, on ne peut pas respirer l’air. C’est pour ça que Rose garde son casque !' },
    { q: 'De quelle couleur est le coucher de soleil sur Mars ?', o: [['🔵', 'bleu'], ['🟢', 'vert'], ['🟣', 'violet']], a: 0, fact: 'Oui ! Sur Mars, le coucher de soleil est bleu. C’est le contraire de chez nous !' },
  ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, SX, SY, L, CAVE0, CAVE1, CEIL, bgStars, craters, pebbles, hills } = A; const ICE0 = 8450; 
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#b4683e'); g.addColorStop(.55, '#e2a06a'); g.addColorStop(1, '#f2c79a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const sx = W * .82 - camX * zoom * .015, sy = H * .16 + camY * zoom * .04, sr = Math.min(W, H) * .045;   // le Soleil, plus petit et pâle vu de Mars
    const sg = ctx.createRadialGradient(sx, sy, sr * .3, sx, sy, sr * 3); sg.addColorStop(0, 'rgba(255,250,230,.95)'); sg.addColorStop(.3, 'rgba(255,240,210,.35)'); sg.addColorStop(1, 'rgba(255,240,210,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sr * 3, 0, 7); ctx.fill();
    // Phobos et Déimos, les deux petites lunes en forme de pomme de terre
    const moon = (x, y, r, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#9b8a80'; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.35, r, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#7f6f66'; ctx.beginPath(); ctx.arc(-r * .4, -r * .1, r * .28, 0, 7); ctx.arc(r * .45, r * .3, r * .18, 0, 7); ctx.fill(); ctx.restore(); };
    moon(W * .28 - camX * zoom * .03, H * .14 + camY * zoom * .05, Math.min(W, H) * .028, .4 + time * .02);
    moon(W * .55 - camX * zoom * .025, H * .09 + camY * zoom * .05, Math.min(W, H) * .014, -.3);
    // Olympus Mons, le plus grand volcan, très loin
    const ox = W * .62 - camX * zoom * .06, oby = SY(0) + camY * zoom * .8, ow = W * 1.1, oh = H * .2;
    ctx.fillStyle = '#c9845a'; ctx.beginPath(); ctx.moveTo(ox - ow / 2, oby); ctx.bezierCurveTo(ox - ow * .25, oby - oh * .4, ox - ow * .12, oby - oh, ox - ow * .06, oby - oh); ctx.lineTo(ox + ow * .06, oby - oh);
    ctx.bezierCurveTo(ox + ow * .12, oby - oh, ox + ow * .25, oby - oh * .4, ox + ow / 2, oby); ctx.fill();
    ctx.fillStyle = '#b8714a'; ctx.beginPath(); ctx.ellipse(ox, oby - oh * .985, ow * .045, oh * .03, 0, 0, 7); ctx.fill();
    // collines lointaines
    ctx.fillStyle = '#bd6a40';
    for (const h of hills) { const x = (h.x - camX * .4) * zoom; if (x > W + 400 || x + h.w * zoom < -400) continue; const by = SY(0) + camY * zoom * .6;
      ctx.beginPath(); ctx.moveTo(x - h.w * zoom * .5, by); ctx.quadraticCurveTo(x, by - h.h * zoom * 1.4, x + h.w * zoom * .5, by); ctx.fill(); }
    },
    drawGround(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, SX, SY, L, CAVE0, CAVE1, CEIL, bgStars, craters, pebbles, hills } = A; const ICE0 = 8450; 
    const gy = SY(0);
    ctx.fillStyle = '#c4643a'; ctx.fillRect(0, gy, W, H - gy + 10);
    ctx.fillStyle = '#e08b5a'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
    for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > W + 200 || c.x > ICE0) continue;
      ctx.fillStyle = '#a9532f'; ctx.beginPath(); ctx.ellipse(sx, gy + (24 + c.r * .2) * zoom, c.r * zoom, c.r * .22 * zoom, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d77d4e'; ctx.beginPath(); ctx.ellipse(sx, gy + (20 + c.r * .2) * zoom, c.r * .85 * zoom, c.r * .16 * zoom, 0, 0, Math.PI); ctx.fill(); }
    // petits cailloux
    for (const p of pebbles) { const sx = SX(p.x); if (sx < -20 || sx > W + 20) continue; ctx.fillStyle = p.x > ICE0 ? '#cfe6f5' : '#8e3f22'; ctx.beginPath(); ctx.ellipse(sx, gy + p.d * zoom, p.r * zoom, p.r * .6 * zoom, 0, 0, 7); ctx.fill(); }
    // la glace du pôle
    const i0 = SX(ICE0); if (i0 < W) { const ig = ctx.createLinearGradient(i0, 0, i0 + 220 * zoom, 0); ig.addColorStop(0, 'rgba(236,246,255,0)'); ig.addColorStop(1, 'rgba(236,246,255,1)');
      ctx.fillStyle = ig; ctx.fillRect(i0, gy, W - i0 + 10, H - gy + 10); ctx.fillStyle = 'rgba(190,225,245,.9)'; ctx.fillRect(Math.max(i0 + 180 * zoom, 0), gy, W, 4 * zoom + 2); }
    },
  };
  // ================= Vénus =================
  W.venus = {
    name: 'Vénus', chip: '🟡 Vénus', on: 'Vénus', theme: '#8a5a1a', L: 9400, cave: [4500, 6400], ceil: 600, ceilKind: 'cloudceil', pin: 0,
    intro: 'Bienvenue sur Vénus, la planète la plus chaude ! Les farceurs ont mis des lunettes de soleil. Les jets de vapeur peuvent t’aider à monter !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Vénus ! Prochaine étape : Mercure !', next: 'mercure', nextIcon: '⚪',
    lifts: [700, 2420, 3020, 5450, 7700], liftRGB: '255,244,225', liftDot: 'rgba(255,255,255,.8)', shades: true,
    caveShade: ['rgba(150,90,20,.5)', 'rgba(190,130,50,.2)'],
    colors: { ceil: ['#c88a3a', '#f0c070', '#ffe0a0'], crystal: '255,240,200', cloud: ['#f2c46e', '#ffe2a6'], slab: ['#7a4a2e', '#b07a50'], tite: '#5a3628', mesa: '#7a4a2e', arch: '#6e4028', mesaTop: '#c08a5a', rock: ['#6a4434', '#8a5a44'], mite: ['#5a3628', '#7a4a38'], ice: ['#e3f2fc', '#fff'], pancake: ['#8a5a3a', '#b07a52'] },
    solids: [
      { x: 880, y: 0, w: 440, h: 170, kind: 'pancake' },
      { x: 1900, y: 0, w: 200, h: 300, kind: 'rock' },
      { x: 2550, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 3200, y: 0, w: 480, h: 210, kind: 'pancake' },
      { x: 4850, y: 0, w: 160, h: 250, kind: 'mite' },
      { x: 5250, y: 270, w: 280, h: 40, kind: 'slab' },
      { x: 5650, y: 0, w: 170, h: 270, kind: 'mite' },
      { x: 7000, y: 0, w: 480, h: 330, kind: 'arch', oh: 240 },
      { x: 7820, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 8480, y: 0, w: 380, h: 140, kind: 'pancake' },
    ],
    stars: [[300, 650, 60, 60, 5], [980, 1220, 230, 40, 5], [1920, 2080, 380, 50, 4], [2570, 2830, 330, 30, 4], [3270, 3610, 270, 40, 5], [4650, 4800, 80, 60, 3], [5270, 5510, 350, 30, 4], [5850, 6250, 300, 60, 5], [7080, 7400, 400, 40, 5], [7150, 7330, 60, 50, 4], [7840, 8100, 330, 30, 4], [8540, 8800, 200, 40, 4], [8950, 9100, 60, 60, 3]],
    aliens: [
      { type: 'glouglou', x: 1450, x0: 1360, x1: 1760, y: 0 },
      { type: 'zigzag', x: 2280, x0: 2180, x1: 2420, y: 0 },
      { type: 'boing', x: 2950, x0: 2880, x1: 3120, y: 0 },
      { type: 'zap', x: 4000, y0: 330, y: 330 },
      { type: 'bidou', x: 5350, x0: 5100, x1: 5560, y: 0 },
      { type: 'zap', x: 6100, y0: 350, y: 350 },
      { type: 'glouglou', x: 6750, x0: 6560, x1: 6940, y: 0 },
      { type: 'bidou', x: 7650, x0: 7540, x1: 7790, y: 0 },
      { type: 'zigzag', x: 8250, x0: 8160, x1: 8430, y: 0 },
      { type: 'zap', x: 9000, y0: 340, y: 340 },
    ],
    boxes: [{ x: 1100, y: 260 }, { x: 3440, y: 300 }, { x: 7240, y: 450 }],
    riddles: [
      { q: 'Quelle est la planète la plus chaude ?', o: [['🟡', 'Vénus'], ['🔵', 'Neptune'], ['🌙', 'la Lune']], a: 0, fact: 'Oui ! Vénus est encore plus chaude que Mercure, parce que ses nuages très épais gardent la chaleur, comme une couverture.' },
      { q: 'Qu’est-ce qui cache le sol de Vénus ?', o: [['☁️', 'des nuages très épais'], ['❄️', 'de la neige'], ['🌳', 'des arbres']], a: 0, fact: 'Bravo ! Vénus est toujours cachée sous des nuages jaunes. De la Terre, on ne voit jamais son sol.' },
      { q: 'Quelle planète brille le soir, comme une grosse étoile ?', o: [['🟡', 'Vénus'], ['🟠', 'Jupiter'], ['🔵', 'Neptune']], a: 0, fact: 'Oui ! On l’appelle l’étoile du berger. Mais ce n’est pas une étoile : c’est la planète Vénus.' },
      { q: 'Sur Vénus, de quel côté le Soleil se lève-t-il ?', o: [['🔄', 'de l’autre côté'], ['🚫', 'jamais'], ['✌️', 'deux fois par jour']], a: 0, fact: 'Bravo ! Vénus tourne à l’envers, alors le Soleil se lève du côté où il se couche chez nous.' },
      { q: 'Vénus est presque de la même taille que…', o: [['🌍', 'la Terre'], ['🌙', 'la Lune'], ['⚽', 'un ballon']], a: 0, fact: 'Oui ! Vénus est presque aussi grande que la Terre. On l’appelle parfois sa jumelle.' },
      { q: 'Quelle planète passe le plus près de la Terre ?', o: [['🟡', 'Vénus'], ['🪐', 'Saturne'], ['🔵', 'Neptune']], a: 0, fact: 'Bravo ! Vénus est la planète qui s’approche le plus de la Terre.' },
      { q: 'Combien de temps dure une journée sur Vénus ?', o: [['🐢', 'très, très longtemps'], ['⚡', 'une seconde'], ['🕐', 'une heure']], a: 0, fact: 'Oui ! Vénus tourne si lentement qu’une journée y dure plus longtemps qu’une année entière !' },
      { q: 'Combien de lunes tournent autour de Vénus ?', o: [['0️⃣', 'aucune'], ['2️⃣', 'deux'], ['💯', 'cent']], a: 0, fact: 'Bravo ! Vénus n’a aucune lune. Mercure non plus.' },
      { q: 'Pourquoi Rose garde-t-elle son exosquelette sur Vénus ?', o: [['🔥', 'il fait très chaud'], ['🍬', 'il pleut des bonbons'], ['💃', 'pour danser']], a: 0, fact: 'Oui ! Sur Vénus, il fait bien plus chaud que dans un four. L’exosquelette protège Rose.' },
      { q: 'Qui a pris les premières photos du sol de Vénus ?', o: [['🤖', 'un robot'], ['🐦', 'un oiseau'], ['📱', 'un téléphone']], a: 0, fact: 'Bravo ! En mille neuf cent soixante-quinze, des robots venus de la Terre ont pris les premières photos du sol de Vénus.' },
      { q: 'De quelle couleur est le ciel de Vénus ?', o: [['🟠', 'orange'], ['🔵', 'bleu'], ['🟢', 'vert']], a: 0, fact: 'Oui ! À cause de ses nuages, le ciel de Vénus est jaune et orange.' },
      { q: 'Y a-t-il des volcans sur Vénus ?', o: [['🌋', 'énormément'], ['🚫', 'aucun'], ['1️⃣', 'un seul']], a: 0, fact: 'Bravo ! Vénus a plus de volcans que n’importe quelle autre planète. Certains sont plats comme des crêpes !' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, SY, hills } = A;
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#c9782a'); g.addColorStop(.5, '#eab25a'); g.addColorStop(1, '#f7d79a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // le Soleil, tout pâle derrière les nuages… et à gauche : sur Vénus, il se lève de l'autre côté !
      const sx = W * .16 - camX * zoom * .01, sy = H * .2 + camY * zoom * .04, sr = Math.min(W, H) * .08;
      const sg = ctx.createRadialGradient(sx, sy, sr * .2, sx, sy, sr * 2.6); sg.addColorStop(0, 'rgba(255,252,230,.9)'); sg.addColorStop(.35, 'rgba(255,240,200,.35)'); sg.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sr * 2.6, 0, 7); ctx.fill();
      // bandes de nuages qui glissent lentement
      for (let b = 0; b < 5; b++) { const y0 = H * (.08 + b * .1) + camY * zoom * .05, off = (time * (6 + b * 3) - camX * zoom * (.02 + b * .01)) % (W * 2);
        ctx.fillStyle = `rgba(255,236,190,${.22 - b * .03})`; ctx.beginPath(); ctx.moveTo(-W, y0);
        for (let x = -W; x <= W * 2; x += 40) ctx.lineTo(x + off - W, y0 + Math.sin((x + b * 90) * .01) * 14);
        ctx.lineTo(W * 2, y0 + 40); ctx.lineTo(-W, y0 + 40); ctx.fill(); }
      // grand volcan au loin
      const ox = W * .7 - camX * zoom * .05, oby = SY(0) + camY * zoom * .8, ow = W * .9, oh = H * .17;
      ctx.fillStyle = '#b97a3e'; ctx.beginPath(); ctx.moveTo(ox - ow / 2, oby); ctx.quadraticCurveTo(ox - ow * .1, oby - oh * 1.1, ox - ow * .05, oby - oh); ctx.lineTo(ox + ow * .05, oby - oh); ctx.quadraticCurveTo(ox + ow * .1, oby - oh * 1.1, ox + ow / 2, oby); ctx.fill();
      ctx.fillStyle = 'rgba(255,240,220,.35)'; for (let k = 0; k < 3; k++) { const p = (time * .15 + k / 3) % 1; ctx.beginPath(); ctx.arc(ox + Math.sin(p * 6 + k) * 10, oby - oh - p * H * .12, (8 + p * 26) * zoom, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#a5683a';
      for (const h of hills) { const x = (h.x - camX * .4) * zoom; if (x > W + 400 || x + h.w * zoom < -400) continue; const by = SY(0) + camY * zoom * .6;
        ctx.beginPath(); ctx.moveTo(x - h.w * zoom * .5, by); ctx.quadraticCurveTo(x, by - h.h * zoom * 1.1, x + h.w * zoom * .5, by); ctx.fill(); }
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, craters, pebbles } = A;
      const gy = SY(0);
      ctx.fillStyle = '#8f5a34'; ctx.fillRect(0, gy, W, H - gy + 10);
      ctx.fillStyle = '#c08a5a'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
      // dalles de roche craquelée
      ctx.strokeStyle = 'rgba(70,35,15,.45)'; ctx.lineWidth = 2 * zoom;
      for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > W + 200) continue; const y = gy + (18 + c.r * .35) * zoom;
        ctx.beginPath(); ctx.moveTo(sx - c.r * zoom, y); ctx.lineTo(sx - c.r * .3 * zoom, y - 8 * zoom); ctx.lineTo(sx + c.r * .4 * zoom, y + 6 * zoom); ctx.lineTo(sx + c.r * zoom, y - 4 * zoom); ctx.stroke(); }
      for (const p of pebbles) { const sx = SX(p.x); if (sx < -20 || sx > W + 20) continue; ctx.fillStyle = '#6a3e22'; ctx.beginPath(); ctx.ellipse(sx, gy + p.d * zoom, p.r * zoom, p.r * .6 * zoom, 0, 0, 7); ctx.fill(); }
    },
  };
  // ================= Mercure =================
  W.mercure = {
    name: 'Mercure', chip: '⚪ Mercure', on: 'Mercure', theme: '#0e0b1e', L: 9200, cave: [4600, 6300], ceil: 620, pin: 0,
    intro: 'Bienvenue sur Mercure, la plus petite planète, tout près du Soleil ! Les farceurs ont caché les cages près des cratères. Regarde : le jour brûlant, puis la nuit glacée !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Mercure ! Prochaine étape : Jupiter !', next: null,
    caveShade: ['rgba(10,8,24,.85)', 'rgba(30,26,50,.35)'],
    colors: { ceil: ['#2a2630', '#5e5660', '#6e666e'], crystal: '255,240,180', cloud: ['#fff', '#fff'], slab: ['#857a74', '#b8aea6'], tite: '#4a4248', mesa: '#8a7f78', arch: '#7a706a', mesaTop: '#bdb2aa', rock: ['#8a7f78', '#a89c94'], mite: ['#5e5660', '#766d76'], ice: ['#e3f2fc', '#fff'], pancake: ['#8a7f78', '#a89c94'] },
    solids: [
      { x: 860, y: 0, w: 130, h: 90, kind: 'rock' },
      { x: 1290, y: 0, w: 130, h: 90, kind: 'rock' },
      { x: 2100, y: 0, w: 380, h: 200, kind: 'mesa' },
      { x: 2800, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 3400, y: 0, w: 220, h: 320, kind: 'rock' },
      { x: 4900, y: 0, w: 160, h: 260, kind: 'mite' },
      { x: 5300, y: 300, w: 150, h: 'ceil', kind: 'tite' },
      { x: 5700, y: 0, w: 170, h: 280, kind: 'mite' },
      { x: 6800, y: 0, w: 130, h: 100, kind: 'rock' },
      { x: 7260, y: 0, w: 130, h: 100, kind: 'rock' },
      { x: 7700, y: 0, w: 360, h: 180, kind: 'mesa' },
      { x: 8300, y: 250, w: 300, h: 40, kind: 'slab' },
    ],
    stars: [[300, 650, 60, 60, 5], [880, 960, 160, 30, 2], [1310, 1390, 160, 30, 2], [2160, 2420, 250, 40, 5], [2820, 3080, 330, 30, 4], [3420, 3600, 400, 60, 4], [4750, 4850, 80, 60, 3], [5000, 5250, 380, 60, 5], [5500, 5900, 380, 40, 5], [6050, 6250, 150, 50, 3], [6950, 7200, 60, 80, 4], [7760, 8000, 230, 40, 5], [8320, 8580, 330, 30, 4], [8800, 8950, 60, 60, 3]],
    aliens: [
      { type: 'boing', x: 1100, x0: 1020, x1: 1260, y: 0 },
      { type: 'glouglou', x: 1700, x0: 1520, x1: 2000, y: 0 },
      { type: 'boing', x: 2700, x0: 2560, x1: 2780, y: 0 },
      { type: 'zap', x: 3950, y0: 330, y: 330 },
      { type: 'zigzag', x: 5450, x0: 5120, x1: 5640, y: 0 },
      { type: 'zap', x: 6100, y0: 360, y: 360 },
      { type: 'boing', x: 7050, x0: 6960, x1: 7230, y: 0 },
      { type: 'bidou', x: 8150, x0: 8080, x1: 8280, y: 0 },
      { type: 'zap', x: 8900, y0: 340, y: 340 },
    ],
    boxes: [{ x: 1140, y: 230 }, { x: 2290, y: 290 }, { x: 7880, y: 270 }],
    riddles: [
      { q: 'Quelle est la plus petite planète ?', o: [['⚪', 'Mercure'], ['🟠', 'Jupiter'], ['🪐', 'Saturne']], a: 0, fact: 'Oui ! Mercure est la plus petite planète. Elle est à peine plus grande que notre Lune.' },
      { q: 'Quelle planète est la plus proche du Soleil ?', o: [['⚪', 'Mercure'], ['🔵', 'Neptune'], ['🌍', 'la Terre']], a: 0, fact: 'Bravo ! Mercure est la planète la plus proche du Soleil.' },
      { q: 'Sur Mercure, comment est la nuit ?', o: [['🥶', 'glacée'], ['🔥', 'brûlante'], ['🌤️', 'toute douce']], a: 0, fact: 'Oui ! Le jour, il fait brûlant, mais la nuit, il fait glacé, car il n’y a pas d’air pour garder la chaleur.' },
      { q: 'Combien de temps dure une année sur Mercure ?', o: [['🏃', 'moins de trois mois'], ['🐢', 'cent ans'], ['⏱️', 'une minute']], a: 0, fact: 'Bravo ! Mercure fait le tour du Soleil en moins de trois mois. C’est la plus rapide de toutes les planètes.' },
      { q: 'À quoi ressemble le sol de Mercure ?', o: [['🕳️', 'plein de cratères'], ['🌳', 'plein d’arbres'], ['🌊', 'plein d’eau']], a: 0, fact: 'Oui ! Mercure est couverte de cratères, comme la Lune.' },
      { q: 'Combien de lunes tournent autour de Mercure ?', o: [['0️⃣', 'aucune'], ['1️⃣', 'une'], ['💯', 'cent']], a: 0, fact: 'Bravo ! Mercure n’a aucune lune, comme Vénus.' },
      { q: 'De quelle couleur est le ciel de Mercure, même le jour ?', o: [['⚫', 'noir'], ['🔵', 'bleu'], ['🩷', 'rose']], a: 0, fact: 'Oui ! Il n’y a pas d’air sur Mercure, alors le ciel reste noir, même en plein jour.' },
      { q: 'Vu de Mercure, comment est le Soleil ?', o: [['☀️', 'beaucoup plus gros'], ['🔸', 'tout petit'], ['🟥', 'carré']], a: 0, fact: 'Bravo ! Vu de Mercure, le Soleil paraît environ trois fois plus gros que chez nous.' },
      { q: 'Mercure porte le nom d’un personnage des légendes romaines. Qui était-ce ?', o: [['🏃', 'un messager très rapide'], ['🐌', 'un escargot'], ['🧙', 'un sorcier']], a: 0, fact: 'Oui ! Mercure était le messager des dieux, qui courait très vite. Comme la planète !' },
      { q: 'Qu’est-ce qui a tourné autour de Mercure pour la photographier ?', o: [['🛰️', 'une sonde spatiale'], ['🦅', 'un aigle'], ['🎈', 'un ballon']], a: 0, fact: 'Bravo ! Des sondes spatiales envoyées depuis la Terre ont photographié Mercure de tout près.' },
      { q: 'Y a-t-il de la glace sur Mercure ?', o: [['🧊', 'oui, dans des cratères'], ['🚫', 'non, jamais'], ['⛸️', 'partout']], a: 0, fact: 'Oui ! Même tout près du Soleil, il y a de la glace au fond de cratères qui restent toujours à l’ombre.' },
      { q: 'Comment Mercure tourne-t-elle autour du Soleil ?', o: [['💨', 'très vite'], ['🐢', 'très lentement'], ['🛑', 'elle ne bouge pas']], a: 0, fact: 'Bravo ! Mercure file autour du Soleil plus vite que toutes les autres planètes.' },
    ],
    // du jour brûlant à la nuit glacée : plus on avance, plus le Soleil s'en va et plus les étoiles brillent
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, SY, L, bgStars, hills } = A;
      const n = Math.max(0, Math.min(1, (camX - L * .4) / (L * .3)));
      ctx.fillStyle = '#07060f'; ctx.fillRect(0, 0, W, H);
      for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = (.15 + .85 * n) * (.5 + .5 * Math.sin(time * 2 + s.tw)); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x, s.y * GY * .95, s.r, s.r); }
      ctx.globalAlpha = 1;
      if (n < 1) { const sx = W * .78, sy = H * (.18 + n * .5) + camY * zoom * .04, sr = Math.min(W, H) * .16;
        const sg = ctx.createRadialGradient(sx, sy, sr * .5, sx, sy, sr * 2.2); sg.addColorStop(0, `rgba(255,250,215,${1 - n})`); sg.addColorStop(.4, `rgba(255,220,140,${.4 * (1 - n)})`); sg.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sr * 2.2, 0, 7); ctx.fill();
        ctx.fillStyle = `rgba(255,248,220,${1 - n})`; ctx.beginPath(); ctx.arc(sx, sy, sr * .55, 0, 7); ctx.fill(); }
      const k = 1 - n * .6; ctx.fillStyle = `rgb(${Math.round(120 * k)},${Math.round(110 * k)},${Math.round(108 * k + n * 20)})`;
      for (const h of hills) { const x = (h.x - camX * .4) * zoom; if (x > W + 400 || x + h.w * zoom < -400) continue; const by = SY(0) + camY * zoom * .6;
        ctx.beginPath(); ctx.moveTo(x - h.w * zoom * .5, by); ctx.quadraticCurveTo(x, by - h.h * zoom * 1.2, x + h.w * zoom * .5, by); ctx.fill(); }
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, L, craters } = A;
      const gy = SY(0), g = ctx.createLinearGradient(SX(L * .45), 0, SX(L * .72), 0);
      g.addColorStop(0, '#a3968e'); g.addColorStop(1, '#3a3848'); ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 10);
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
      for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > W + 200) continue;
        ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(sx, gy + (24 + c.r * .2) * zoom, c.r * zoom, c.r * .22 * zoom, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.ellipse(sx, gy + (20 + c.r * .2) * zoom, c.r * .85 * zoom, c.r * .16 * zoom, 0, 0, Math.PI); ctx.fill(); }
    },
  };
})();
