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
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Mercure ! Prochaine étape : Jupiter !', next: 'jupiter', nextIcon: '🟠',
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
  // ================= Jupiter =================
  // on ne marche pas sur Jupiter : Rose se pose sur ses lunes (Europe, couverte de glace, puis Io et ses volcans) et traverse ses nuages en volant
  W.jupiter = {
    name: 'Jupiter', chip: '🟠 Jupiter', on: 'les lunes de Jupiter', theme: '#120c26', L: 9800, cave: [4700, 6600], ceil: 600, ceilKind: 'cloudceil', pin: 0,
    intro: 'Waouh, Jupiter, la plus grosse planète ! On ne peut pas marcher dessus, alors les farceurs ont caché les amis sur ses lunes. Les geysers peuvent t’aider à monter !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Jupiter ! Prochaine étape : Saturne !', next: 'saturne', nextIcon: '🪐',
    lifts: [1450, 2480, 7500, 8250, 8800], liftRGB: '235,248,255', liftDot: 'rgba(255,255,255,.85)',
    caveShade: ['rgba(120,70,40,.45)', 'rgba(200,150,110,.18)'],
    colors: { ceil: ['#a86a3a', '#e8c8a0', '#fff0dc'], crystal: '255,240,200', cloud: ['#e2b98c', '#fbe6cc'], slab: ['#b8c8d8', '#eef4fa'], tite: '#7a5a3a', mesa: '#cfdeea', arch: '#bccfdf', mesaTop: '#ffffff', rock: ['#c9a23a', '#e8c860'], mite: ['#a07a3a', '#c09a52'], ice: ['#dbe9f4', '#ffffff'], pancake: ['#c0782a', '#e8a040'] },
    solids: [
      { x: 880, y: 0, w: 280, h: 140, kind: 'ice' },
      { x: 1800, y: 0, w: 400, h: 200, kind: 'mesa' },
      { x: 2650, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 3350, y: 0, w: 230, h: 300, kind: 'ice' },
      { x: 5050, y: 220, w: 280, h: 40, kind: 'slab' },
      { x: 5700, y: 300, w: 280, h: 40, kind: 'slab' },
      { x: 6250, y: 200, w: 240, h: 40, kind: 'slab' },
      { x: 7000, y: 0, w: 420, h: 160, kind: 'pancake' },
      { x: 7850, y: 0, w: 200, h: 280, kind: 'rock' },
      { x: 8450, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 9000, y: 0, w: 320, h: 120, kind: 'pancake' },
    ],
    stars: [[300, 650, 60, 60, 5], [900, 1140, 200, 40, 4], [1860, 2140, 250, 40, 5], [2670, 2930, 330, 30, 4], [3370, 3560, 380, 60, 4], [4850, 5000, 80, 60, 3], [5070, 5310, 300, 30, 4], [5720, 5960, 380, 30, 4], [6270, 6470, 280, 30, 3], [7060, 7360, 220, 40, 5], [7860, 8040, 360, 50, 4], [8470, 8730, 330, 30, 4], [9030, 9290, 180, 40, 4], [9400, 9500, 60, 50, 2]],
    aliens: [
      { type: 'glouglou', x: 1300, x0: 1220, x1: 1700, y: 0 },
      { type: 'zigzag', x: 2400, x0: 2280, x1: 2600, y: 0 },
      { type: 'boing', x: 3000, x0: 2950, x1: 3250, y: 0 },
      { type: 'zap', x: 4100, y0: 330, y: 330 },
      { type: 'bidou', x: 5500, x0: 5200, x1: 5800, y: 0 },
      { type: 'zap', x: 6300, y0: 360, y: 360 },
      { type: 'glouglou', x: 6800, x0: 6680, x1: 6960, y: 0 },
      { type: 'zigzag', x: 7650, x0: 7480, x1: 7800, y: 0 },
      { type: 'bidou', x: 8650, x0: 8500, x1: 8900, y: 0 },
      { type: 'zap', x: 9450, y0: 340, y: 340 },
    ],
    boxes: [{ x: 2000, y: 290 }, { x: 5840, y: 420 }, { x: 7210, y: 260 }],
    riddles: [
      { q: 'Quelle est la plus grosse planète ?', o: [['🟠', 'Jupiter'], ['⚪', 'Mercure'], ['🌙', 'la Lune']], a: 0, fact: 'Oui ! Jupiter est la plus grosse planète du système solaire.' },
      { q: 'Peut-on marcher sur Jupiter ?', o: [['☁️', 'non, c’est du gaz'], ['🚶', 'oui, facilement'], ['🛼', 'en patins à roulettes']], a: 0, fact: 'Bravo ! Jupiter est faite de gaz et de nuages. Il n’y a pas de sol où se poser.' },
      { q: 'La grosse tache rouge de Jupiter, qu’est-ce que c’est ?', o: [['🌀', 'une tempête géante'], ['🍅', 'une tomate'], ['🌋', 'un volcan']], a: 0, fact: 'Oui ! C’est une tempête plus grande que la Terre entière, qui tourne depuis très longtemps.' },
      { q: 'Combien de lunes tournent autour de Jupiter ?', o: [['💯', 'presque cent'], ['1️⃣', 'une'], ['0️⃣', 'aucune']], a: 0, fact: 'Bravo ! Jupiter a énormément de lunes : presque une centaine !' },
      { q: 'Europe, une lune de Jupiter, est couverte de…', o: [['🧊', 'glace'], ['🍫', 'chocolat'], ['🌱', 'herbe']], a: 0, fact: 'Oui ! Europe est couverte de glace, et les savants pensent qu’il y a un océan caché dessous.' },
      { q: 'Io, une autre lune de Jupiter, a beaucoup de…', o: [['🌋', 'volcans'], ['🌳', 'arbres'], ['🏠', 'maisons']], a: 0, fact: 'Bravo ! Io est l’endroit du système solaire où il y a le plus de volcans qui crachent.' },
      { q: 'Jupiter tourne très vite sur elle-même. Une journée y dure…', o: [['🕙', 'moins de dix heures'], ['📅', 'un mois'], ['🎂', 'une année']], a: 0, fact: 'Oui ! Une journée sur Jupiter dure moins de dix heures. C’est la planète qui tourne le plus vite.' },
      { q: 'De quoi sont faites les bandes de couleur de Jupiter ?', o: [['☁️', 'de nuages'], ['🎨', 'de peinture'], ['🎀', 'de rubans']], a: 0, fact: 'Bravo ! Ce sont des bandes de nuages qui tournent autour de la planète.' },
      { q: 'Qui a découvert les quatre grandes lunes de Jupiter ?', o: [['🔭', 'un savant avec une lunette'], ['🐦', 'un oiseau'], ['🤖', 'un robot']], a: 0, fact: 'Oui ! C’est le savant Galilée, avec sa lunette, il y a plus de quatre cents ans.' },
      { q: 'Jupiter a-t-elle des anneaux ?', o: [['💍', 'oui, très fins'], ['🚫', 'non, aucun'], ['🥇', 'oui, en or']], a: 0, fact: 'Bravo ! Jupiter a des anneaux, mais ils sont si fins qu’on les voit à peine.' },
      { q: 'Combien de Terres pourrait-on mettre dans Jupiter ?', o: [['🌍', 'plus de mille'], ['2️⃣', 'deux'], ['0️⃣', 'aucune']], a: 0, fact: 'Oui ! On pourrait mettre plus de mille Terres dans Jupiter !' },
      { q: 'Jupiter est-elle plus loin du Soleil que Mars ?', o: [['➡️', 'oui, plus loin'], ['⬅️', 'non, plus près'], ['🟰', 'au même endroit']], a: 0, fact: 'Bravo ! Après Mars, il faut voyager encore très longtemps pour arriver jusqu’à Jupiter.' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, L, bgStars } = A;
      ctx.fillStyle = '#0a0718'; ctx.fillRect(0, 0, W, H);
      for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = .5 + .5 * Math.sin(time * 2 + s.tw); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x, s.y * GY * .95, s.r, s.r); }
      ctx.globalAlpha = 1;
      // Jupiter, immense, qui tourne doucement
      const r = Math.min(W, H) * .62, cx = W * .62 - camX * zoom * .02, cy = H * .3 + camY * zoom * .05;
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
      const B = ['#f3dcb8', '#d9a26a', '#fbecd2', '#c98450', '#f0d2a8', '#b9764a', '#f6e2c4', '#d49a62', '#efd0a0'];
      for (let i = 0; i < 18; i++) { const y0 = cy - r + i * (2 * r / 18); ctx.fillStyle = B[i % B.length]; ctx.beginPath(); ctx.moveTo(cx - r, y0);
        for (let x = -r; x <= r; x += 20) ctx.lineTo(cx + x, y0 + Math.sin((x + time * 12 + i * 40) * .02) * 4);
        ctx.lineTo(cx + r, y0 + 2 * r / 18 + 2); ctx.lineTo(cx - r, y0 + 2 * r / 18 + 2); ctx.fill(); }
      const sx = cx + r * .25 + ((time * 6) % (r * 3)) * 0, sy = cy + r * .32;
      ctx.fillStyle = '#c0452e'; ctx.beginPath(); ctx.ellipse(sx, sy, r * .17, r * .09, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#d8664a'; ctx.beginPath(); ctx.ellipse(sx, sy, r * .1, r * .05, 0, 0, 7); ctx.fill();
      const sh = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .2, cx, cy, r * 1.05); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(10,6,24,.55)'); ctx.fillStyle = sh; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      ctx.restore();
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, L, CAVE0, CAVE1, craters } = A;
      const gy = SY(0), e1 = SX(CAVE0), i0 = SX(CAVE1);
      // Europe : glace craquelée
      if (e1 > 0) { ctx.fillStyle = '#dfeaf4'; ctx.fillRect(0, gy, Math.min(W, e1), H - gy + 10); ctx.strokeStyle = 'rgba(150,90,50,.55)'; ctx.lineWidth = 2.5 * zoom;
        for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > Math.min(W, e1) + 200 || c.x > CAVE0) continue; const y = gy + (14 + c.r * .4) * zoom;
          ctx.beginPath(); ctx.moveTo(sx - c.r * 1.4 * zoom, y); ctx.quadraticCurveTo(sx, y - 10 * zoom, sx + c.r * 1.4 * zoom, y + 8 * zoom); ctx.stroke(); } }
      // les nuages de Jupiter, entre les deux lunes
      if (i0 > 0 && e1 < W) { ctx.fillStyle = '#ecc89c'; ctx.fillRect(Math.max(0, e1), gy, Math.min(W, i0) - Math.max(0, e1), H - gy + 10);
        ctx.fillStyle = '#f8e2c4'; for (let x = CAVE0; x < CAVE1; x += 70) { const sx = SX(x + 35); if (sx < -60 || sx > W + 60) continue; ctx.beginPath(); ctx.arc(sx, gy + 6 * zoom, 34 * zoom, Math.PI, 0); ctx.fill(); } }
      // Io : soufre jaune et taches orange
      if (i0 < W) { ctx.fillStyle = '#e6c54a'; ctx.fillRect(Math.max(0, i0), gy, W, H - gy + 10);
        for (const c of craters) { const sx = SX(c.x); if (c.x < CAVE1 || sx < -200 || sx > W + 200) continue; ctx.fillStyle = 'rgba(200,100,30,.45)'; ctx.beginPath(); ctx.ellipse(sx, gy + (24 + c.r * .2) * zoom, c.r * .7 * zoom, c.r * .16 * zoom, 0, 0, 7); ctx.fill(); } }
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(0, gy, W, 4 * zoom + 2);
    },
  };
  // ================= Saturne =================
  // Rose marche sur les blocs de glace des anneaux, fait du toboggan, et passe la grande « division » des anneaux en volant
  W.saturne = {
    name: 'Saturne', chip: '🪐 Saturne', on: 'Saturne', theme: '#14102a', L: 9600, cave: [4600, 6500], ceil: 620, pin: 0,
    intro: 'Voici Saturne et ses magnifiques anneaux de glace ! Les farceurs font du toboggan. Profites-en pour libérer les amis !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Saturne ! Prochaine étape : Uranus !', next: 'uranus', nextIcon: '🩵',
    caveShade: ['rgba(30,24,60,.7)', 'rgba(60,50,100,.25)'],
    colors: { ceil: ['#5a6a8a', '#a9bcd8', '#d8e6f6'], crystal: '220,240,255', cloud: ['#fff', '#fff'], slab: ['#b9c9de', '#f2f7fc'], tite: '#8aa0c0', mesa: '#c8d6e8', arch: '#b4c4da', mesaTop: '#ffffff', rock: ['#a9b8cc', '#d6e2ee'], mite: ['#8aa0c0', '#b6c8de'], ice: ['#dfeaf6', '#ffffff'], pancake: ['#c8d6e8', '#ffffff'], ramp: ['#cfdcec', '#ffffff'] },
    solids: [
      { x: 820, y: 0, w: 520, h: 210, kind: 'ramp', dir: 1 },
      { x: 1900, y: 0, w: 260, h: 140, kind: 'ice' },
      { x: 2550, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 3150, y: 0, w: 560, h: 240, kind: 'ramp', dir: -1 },
      { x: 4950, y: 0, w: 160, h: 260, kind: 'mite' },
      { x: 5350, y: 300, w: 150, h: 'ceil', kind: 'tite' },
      { x: 5750, y: 0, w: 170, h: 280, kind: 'mite' },
      { x: 6150, y: 320, w: 150, h: 'ceil', kind: 'tite' },
      { x: 6950, y: 0, w: 520, h: 220, kind: 'ramp', dir: 1 },
      { x: 7900, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 8550, y: 0, w: 280, h: 130, kind: 'ice' },
    ],
    stars: [[300, 650, 60, 60, 5], [900, 1300, 120, 150, 6], [1920, 2140, 200, 40, 4], [2570, 2830, 330, 30, 4], [3200, 3650, 290, 40, 6], [4750, 4900, 80, 60, 3], [5000, 5300, 380, 60, 5], [5550, 5950, 380, 40, 5], [6300, 6450, 150, 50, 3], [7000, 7420, 120, 160, 6], [7920, 8180, 330, 30, 4], [8570, 8810, 190, 40, 4], [8950, 9100, 60, 60, 3]],
    aliens: [
      { type: 'glouglou', x: 1600, x0: 1420, x1: 1850, y: 0 },
      { type: 'boing', x: 2300, x0: 2220, x1: 2480, y: 0 },
      { type: 'zigzag', x: 2950, x0: 2880, x1: 3100, y: 0 },
      { type: 'zap', x: 4000, y0: 330, y: 330 },
      { type: 'bidou', x: 5500, x0: 5150, x1: 5700, y: 0 },
      { type: 'zap', x: 6350, y0: 360, y: 360 },
      { type: 'glouglou', x: 7650, x0: 7520, x1: 7860, y: 0 },
      { type: 'boing', x: 8350, x0: 8250, x1: 8500, y: 0 },
      { type: 'zigzag', x: 8950, x0: 8880, x1: 9150, y: 0 },
      { type: 'zap', x: 9200, y0: 340, y: 340 },
    ],
    boxes: [{ x: 1300, y: 300 }, { x: 3230, y: 330 }, { x: 8050, y: 340 }],
    riddles: [
      { q: 'Quelle planète a les plus beaux anneaux ?', o: [['🪐', 'Saturne'], ['🔴', 'Mars'], ['🌍', 'la Terre']], a: 0, fact: 'Oui ! Saturne a de magnifiques anneaux, qu’on peut voir avec une petite lunette.' },
      { q: 'De quoi sont faits les anneaux de Saturne ?', o: [['🧊', 'de glace et de cailloux'], ['🍬', 'de bonbons'], ['🧵', 'de ficelle']], a: 0, fact: 'Bravo ! Les anneaux sont faits de milliards de morceaux de glace et de cailloux.' },
      { q: 'Dans une baignoire géante, que ferait Saturne ?', o: [['🦆', 'elle flotterait'], ['⚓', 'elle coulerait'], ['💥', 'elle exploserait']], a: 0, fact: 'Oui ! Saturne est si légère qu’elle flotterait, comme un canard en plastique.' },
      { q: 'Combien de lunes tournent autour de Saturne ?', o: [['💯', 'plus de cent'], ['1️⃣', 'une'], ['0️⃣', 'aucune']], a: 0, fact: 'Bravo ! Saturne a plus de cent lunes. C’est la championne !' },
      { q: 'Titan, la plus grande lune de Saturne, a… ', o: [['🌫️', 'un ciel brumeux'], ['🌈', 'des arcs-en-ciel'], ['🍦', 'des glaces à la vanille']], a: 0, fact: 'Oui ! Titan est entourée d’une épaisse brume orange, comme un brouillard.' },
      { q: 'Quelle est la deuxième plus grosse planète ?', o: [['🪐', 'Saturne'], ['⚪', 'Mercure'], ['🔴', 'Mars']], a: 0, fact: 'Bravo ! Saturne est la deuxième plus grosse planète, juste après Jupiter.' },
      { q: 'Peut-on marcher sur Saturne ?', o: [['☁️', 'non, c’est du gaz'], ['🚶', 'oui'], ['🏃', 'seulement en courant']], a: 0, fact: 'Oui ! Comme Jupiter, Saturne est faite de gaz. Rose marche sur les blocs de glace des anneaux.' },
      { q: 'Les anneaux de Saturne sont-ils épais ?', o: [['📄', 'très fins'], ['🏔️', 'hauts comme des montagnes'], ['🏢', 'hauts comme la Terre']], a: 0, fact: 'Bravo ! Les anneaux sont immenses, mais très fins, comme une feuille de papier géante.' },
      { q: 'Quelle forme a la tempête au pôle Nord de Saturne ?', o: [['⬡', 'un hexagone'], ['⭐', 'une étoile'], ['❤️', 'un cœur']], a: 0, fact: 'Oui ! Au pôle Nord de Saturne, les nuages forment un hexagone, une forme à six côtés.' },
      { q: 'Quel robot a tourné autour de Saturne pendant treize ans ?', o: [['🛰️', 'une sonde spatiale'], ['🚗', 'une voiture'], ['🦉', 'un hibou']], a: 0, fact: 'Bravo ! La sonde Cassini a étudié Saturne et ses lunes pendant treize ans.' },
      { q: 'Saturne est-elle plus loin du Soleil que Jupiter ?', o: [['➡️', 'oui, plus loin'], ['⬅️', 'non, plus près'], ['🟰', 'pareil']], a: 0, fact: 'Oui ! Saturne vient juste après Jupiter, encore plus loin du Soleil.' },
      { q: 'Avec quoi peut-on voir les anneaux de Saturne depuis la Terre ?', o: [['🔭', 'une lunette'], ['🕶️', 'des lunettes de soleil'], ['🔦', 'une lampe de poche']], a: 0, fact: 'Bravo ! Avec une petite lunette, on voit déjà les anneaux de Saturne.' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, bgStars } = A;
      ctx.fillStyle = '#0b0920'; ctx.fillRect(0, 0, W, H);
      for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = .5 + .5 * Math.sin(time * 2 + s.tw); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x, s.y * GY * .95, s.r, s.r); }
      ctx.globalAlpha = 1;
      const r = Math.min(W, H) * .3, cx = W * .66 - camX * zoom * .02, cy = H * .3 + camY * zoom * .05, ring = (back) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.32);
        for (const [k, c, lw] of [[2.25, 'rgba(230,210,170,.55)', 10], [1.95, 'rgba(250,236,200,.85)', 14], [1.6, 'rgba(210,190,150,.7)', 9]]) { ctx.strokeStyle = c; ctx.lineWidth = lw * zoom * 2; ctx.beginPath(); ctx.ellipse(0, 0, r * k, r * k * .28, 0, back ? Math.PI : 0, back ? Math.PI * 2 : Math.PI); ctx.stroke(); }
        ctx.restore(); };
      ring(true);
      const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r); g.addColorStop(0, '#fff2cc'); g.addColorStop(.7, '#e2c27e'); g.addColorStop(1, '#a8874e');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip(); ctx.fillStyle = 'rgba(190,150,90,.25)'; for (let i = -3; i <= 3; i++) ctx.fillRect(cx - r, cy + i * r * .24, 2 * r, r * .09); ctx.restore();
      ring(false);
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, pebbles } = A;
      const gy = SY(0), g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#dbe6f2'); g.addColorStop(1, '#a9b9d0');
      ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 10); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
      for (const p of pebbles) { const sx = SX(p.x); if (sx < -30 || sx > W + 30) continue; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.moveTo(sx, gy + (p.d - p.r) * zoom); ctx.lineTo(sx + p.r * 1.4 * zoom, gy + p.d * zoom); ctx.lineTo(sx, gy + (p.d + p.r) * zoom); ctx.lineTo(sx - p.r * 1.4 * zoom, gy + p.d * zoom); ctx.fill(); }
    },
  };
  // ================= Uranus =================
  W.uranus = {
    name: 'Uranus', chip: '🩵 Uranus', on: 'Uranus', theme: '#0d1f2a', L: 9400, cave: [4600, 6400], ceil: 620, pin: 0, sideways: true,
    intro: 'Voici Uranus, la planète bleu-vert qui tourne couchée sur le côté ! Regarde les farceurs : ils se sont couchés eux aussi pour se déguiser !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis d’Uranus ! Prochaine étape : Neptune !', next: 'neptune', nextIcon: '🔵',
    caveShade: ['rgba(10,40,50,.75)', 'rgba(30,80,90,.25)'],
    colors: { ceil: ['#1e5664', '#5ab4c0', '#9be2ea'], crystal: '200,255,255', cloud: ['#fff', '#fff'], slab: ['#7cc8d0', '#d6f6f8'], tite: '#3e8e9a', mesa: '#8ad2da', arch: '#76c2cc', mesaTop: '#e4fbfc', rock: ['#5ab0bc', '#9be0e6'], mite: ['#3e8e9a', '#6cb8c2'], ice: ['#d6f6f8', '#ffffff'], pancake: ['#7cc8d0', '#c8f0f2'], ramp: ['#8ad2da', '#e4fbfc'] },
    solids: [
      { x: 880, y: 0, w: 260, h: 150, kind: 'ice' },
      { x: 1750, y: 0, w: 400, h: 210, kind: 'mesa' },
      { x: 2600, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 3250, y: 0, w: 540, h: 230, kind: 'ramp', dir: -1 },
      { x: 4950, y: 0, w: 160, h: 260, kind: 'mite' },
      { x: 5350, y: 300, w: 150, h: 'ceil', kind: 'tite' },
      { x: 5750, y: 0, w: 170, h: 280, kind: 'mite' },
      { x: 6950, y: 0, w: 480, h: 330, kind: 'arch', oh: 240 },
      { x: 7850, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 8450, y: 0, w: 300, h: 140, kind: 'ice' },
    ],
    stars: [[300, 650, 60, 60, 5], [900, 1120, 210, 40, 4], [1810, 2090, 260, 40, 5], [2620, 2880, 330, 30, 4], [3300, 3740, 300, 40, 5], [4750, 4900, 80, 60, 3], [5000, 5300, 380, 60, 5], [5550, 5950, 380, 40, 5], [6100, 6350, 150, 50, 3], [7030, 7350, 400, 40, 5], [7100, 7280, 60, 50, 4], [7870, 8130, 330, 30, 4], [8470, 8730, 200, 40, 4], [8900, 9050, 60, 60, 3]],
    aliens: [
      { type: 'glouglou', x: 1450, x0: 1280, x1: 1700, y: 0 },
      { type: 'boing', x: 2350, x0: 2250, x1: 2550, y: 0 },
      { type: 'zigzag', x: 3000, x0: 2950, x1: 3200, y: 0 },
      { type: 'zap', x: 4000, y0: 330, y: 330 },
      { type: 'bidou', x: 5500, x0: 5150, x1: 5700, y: 0 },
      { type: 'zap', x: 6150, y0: 360, y: 360 },
      { type: 'glouglou', x: 6700, x0: 6550, x1: 6900, y: 0 },
      { type: 'zigzag', x: 7650, x0: 7500, x1: 7800, y: 0 },
      { type: 'boing', x: 8250, x0: 8180, x1: 8400, y: 0 },
      { type: 'zap', x: 9000, y0: 340, y: 340 },
    ],
    boxes: [{ x: 1950, y: 300 }, { x: 3330, y: 330 }, { x: 7190, y: 450 }],
    riddles: [
      { q: 'Comment Uranus tourne-t-elle ?', o: [['🛞', 'couchée sur le côté'], ['🙃', 'la tête en bas'], ['🛑', 'elle ne tourne pas']], a: 0, fact: 'Oui ! Uranus tourne couchée sur le côté, comme une roue qui roule.' },
      { q: 'De quelle couleur est Uranus ?', o: [['🩵', 'bleu-vert'], ['🔴', 'rouge'], ['🟡', 'jaune']], a: 0, fact: 'Bravo ! Uranus est bleu-vert, à cause d’un gaz dans son ciel.' },
      { q: 'Comment fait-il sur Uranus ?', o: [['🥶', 'très, très froid'], ['🔥', 'très chaud'], ['🌤️', 'tout doux']], a: 0, fact: 'Oui ! Uranus est une des planètes les plus froides du système solaire.' },
      { q: 'Combien de temps dure la nuit à un pôle d’Uranus ?', o: [['🌙', 'quarante-deux ans'], ['⏱️', 'une minute'], ['🕗', 'une nuit normale']], a: 0, fact: 'Bravo ! Comme Uranus est couchée, chaque pôle reste dans le noir pendant quarante-deux ans !' },
      { q: 'Uranus a-t-elle des anneaux ?', o: [['💍', 'oui, très fins'], ['🚫', 'non'], ['🍩', 'oui, en beignets']], a: 0, fact: 'Oui ! Uranus a des anneaux fins et sombres, qui font le tour de la planète… debout !' },
      { q: 'Avec quoi a-t-on découvert Uranus ?', o: [['🔭', 'un télescope'], ['👀', 'les yeux tout seuls'], ['🎧', 'un casque']], a: 0, fact: 'Bravo ! Uranus a été la première planète découverte avec un télescope, il y a plus de deux cents ans.' },
      { q: 'Combien de robots sont allés voir Uranus de près ?', o: [['1️⃣', 'un seul'], ['💯', 'cent'], ['0️⃣', 'aucun']], a: 0, fact: 'Oui ! Une seule sonde, Voyager 2, est passée près d’Uranus.' },
      { q: 'Uranus est-elle plus grosse que la Terre ?', o: [['🐘', 'oui, beaucoup plus'], ['🐭', 'non, plus petite'], ['🟰', 'pareille']], a: 0, fact: 'Bravo ! Uranus est beaucoup plus grosse que la Terre : on pourrait y mettre plus de soixante Terres.' },
      { q: 'Uranus a-t-elle des lunes ?', o: [['🌙', 'oui, beaucoup'], ['🚫', 'aucune'], ['🧀', 'une en fromage']], a: 0, fact: 'Oui ! Uranus a plus de vingt lunes, qui portent des noms de personnages de théâtre.' },
      { q: 'De quoi est faite Uranus ?', o: [['🧊', 'de gaz et de glace'], ['🪨', 'de cailloux'], ['🍭', 'de sucre']], a: 0, fact: 'Bravo ! Uranus est faite de gaz et de glaces très froides. On l’appelle une géante de glace.' },
      { q: 'Uranus est la combientième planète à partir du Soleil ?', o: [['7️⃣', 'la septième'], ['1️⃣', 'la première'], ['3️⃣', 'la troisième']], a: 0, fact: 'Oui ! Uranus est la septième planète, juste avant Neptune.' },
      { q: 'Que font les farceurs sur Uranus ?', o: [['😴', 'ils se couchent sur le côté'], ['🏊', 'ils nagent'], ['🎻', 'ils jouent du violon']], a: 0, fact: 'Bravo ! Ils voulaient se déguiser en planète couchée… ce n’est pas très réussi !' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, bgStars } = A;
      ctx.fillStyle = '#081420'; ctx.fillRect(0, 0, W, H);
      for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = .5 + .5 * Math.sin(time * 2 + s.tw); ctx.fillStyle = '#e8fbff'; ctx.fillRect(x, s.y * GY * .95, s.r, s.r); }
      ctx.globalAlpha = 1;
      const r = Math.min(W, H) * .3, cx = W * .7 - camX * zoom * .02, cy = H * .32 + camY * zoom * .05;
      ctx.strokeStyle = 'rgba(160,220,230,.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, r * .5, r * 1.7, .12, 0, 7); ctx.stroke();
      const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r); g.addColorStop(0, '#e6ffff'); g.addColorStop(.7, '#8fe0e6'); g.addColorStop(1, '#4aa8b4');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(200,245,250,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy, r * .5, r * 1.7, .12, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, pebbles } = A;
      const gy = SY(0), g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#bfeef2'); g.addColorStop(1, '#6cbcc6');
      ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 10); ctx.fillStyle = '#ecfeff'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
      for (const p of pebbles) { const sx = SX(p.x); if (sx < -20 || sx > W + 20) continue; ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(sx, gy + p.d * zoom, p.r * 1.3 * zoom, p.r * .5 * zoom, 0, 0, 7); ctx.fill(); }
    },
  };
  // ================= Neptune =================
  W.neptune = {
    name: 'Neptune', chip: '🔵 Neptune', on: 'Neptune', theme: '#0a1238', L: 9600, cave: [4700, 6500], ceil: 620, pin: 0,
    winds: [[1300, 2300, -70], [3600, 4500, -90], [6800, 7800, -80], [8300, 9000, -60]],
    intro: 'Voici Neptune, la planète la plus loin du Soleil ! Attention au vent, le plus rapide du système solaire. Accroche-toi bien, Rose !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de Neptune ! Prochaine étape : retour près de la Terre !', next: 'terre', nextIcon: '🌍',
    caveShade: ['rgba(6,10,40,.8)', 'rgba(20,30,80,.3)'],
    colors: { ceil: ['#14205a', '#3a56b0', '#6a86d8'], crystal: '170,210,255', cloud: ['#fff', '#fff'], slab: ['#5a78c8', '#a8c0f0'], tite: '#2a3c88', mesa: '#5a78c8', arch: '#4a68b8', mesaTop: '#b8ccf4', rock: ['#4a64b4', '#7a94dc'], mite: ['#2a3c88', '#4a5ca8'], ice: ['#cfe0fa', '#ffffff'], pancake: ['#5a78c8', '#a8c0f0'], ramp: ['#6a88d4', '#c0d2f6'] },
    solids: [
      { x: 880, y: 0, w: 260, h: 150, kind: 'ice' },
      { x: 2500, y: 0, w: 400, h: 200, kind: 'mesa' },
      { x: 3250, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 5000, y: 0, w: 160, h: 260, kind: 'mite' },
      { x: 5400, y: 300, w: 150, h: 'ceil', kind: 'tite' },
      { x: 5800, y: 0, w: 170, h: 280, kind: 'mite' },
      { x: 6200, y: 320, w: 150, h: 'ceil', kind: 'tite' },
      { x: 7300, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 8000, y: 0, w: 220, h: 300, kind: 'rock' },
      { x: 9050, y: 0, w: 260, h: 130, kind: 'ice' },
    ],
    stars: [[300, 650, 60, 60, 5], [900, 1120, 210, 40, 4], [1400, 2200, 80, 80, 7], [2560, 2840, 250, 40, 5], [3270, 3530, 330, 30, 4], [3700, 4400, 120, 120, 6], [4850, 5000, 80, 60, 3], [5050, 5350, 380, 60, 5], [5600, 6000, 380, 40, 5], [6900, 7200, 100, 80, 4], [7320, 7580, 330, 30, 4], [8020, 8200, 380, 60, 4], [8400, 8900, 90, 60, 5], [9070, 9290, 190, 40, 4]],
    aliens: [
      { type: 'glouglou', x: 1700, x0: 1350, x1: 2200, y: 0 },
      { type: 'zigzag', x: 3000, x0: 2950, x1: 3200, y: 0 },
      { type: 'boing', x: 3900, x0: 3700, x1: 4300, y: 0 },
      { type: 'zap', x: 4300, y0: 330, y: 330 },
      { type: 'bidou', x: 5550, x0: 5200, x1: 5750, y: 0 },
      { type: 'zap', x: 6350, y0: 360, y: 360 },
      { type: 'glouglou', x: 7100, x0: 6850, x1: 7700, y: 0 },
      { type: 'zigzag', x: 8600, x0: 8350, x1: 8950, y: 0 },
      { type: 'bidou', x: 8800, x0: 8700, x1: 8980, y: 0 },
      { type: 'zap', x: 9300, y0: 340, y: 340 },
    ],
    boxes: [{ x: 2700, y: 290 }, { x: 5650, y: 420 }, { x: 7450, y: 340 }],
    riddles: [
      { q: 'Quelle planète est la plus loin du Soleil ?', o: [['🔵', 'Neptune'], ['⚪', 'Mercure'], ['🌍', 'la Terre']], a: 0, fact: 'Oui ! Neptune est la huitième et dernière planète, la plus loin du Soleil.' },
      { q: 'Sur Neptune, comment est le vent ?', o: [['🌪️', 'le plus rapide de tous'], ['🍃', 'tout doux'], ['🚫', 'il n’y en a pas']], a: 0, fact: 'Bravo ! Sur Neptune soufflent les vents les plus rapides du système solaire, bien plus forts qu’une tempête chez nous.' },
      { q: 'De quelle couleur est Neptune ?', o: [['🔵', 'bleu foncé'], ['🟠', 'orange'], ['🟢', 'vert pomme']], a: 0, fact: 'Oui ! Neptune est d’un beau bleu profond.' },
      { q: 'Combien de temps Neptune met-elle à faire le tour du Soleil ?', o: [['⏳', 'cent soixante-cinq ans'], ['📅', 'un an'], ['🕐', 'une heure']], a: 0, fact: 'Bravo ! Neptune est si loin qu’un tour du Soleil lui prend cent soixante-cinq ans.' },
      { q: 'Comment a-t-on trouvé Neptune ?', o: [['🧮', 'grâce à des calculs'], ['🎲', 'en jouant aux dés'], ['🐕', 'avec un chien']], a: 0, fact: 'Oui ! Des savants ont calculé où elle devait être, avant même de la voir dans un télescope.' },
      { q: 'Comment s’appelle la plus grande lune de Neptune ?', o: [['🌙', 'Triton'], ['🐟', 'Poisson'], ['🍪', 'Biscuit']], a: 0, fact: 'Bravo ! Triton tourne autour de Neptune à l’envers, et elle a des geysers glacés.' },
      { q: 'Comment fait-il sur Neptune ?', o: [['🥶', 'glacial'], ['🔥', 'brûlant'], ['🌤️', 'doux']], a: 0, fact: 'Oui ! Si loin du Soleil, il fait glacial sur Neptune.' },
      { q: 'Neptune a-t-elle des anneaux ?', o: [['💍', 'oui, très fins'], ['🚫', 'non'], ['🎀', 'oui, en rubans']], a: 0, fact: 'Bravo ! Neptune a des anneaux fins et sombres.' },
      { q: 'Combien de robots sont allés voir Neptune de près ?', o: [['1️⃣', 'un seul'], ['💯', 'cent'], ['0️⃣', 'aucun']], a: 0, fact: 'Oui ! La sonde Voyager 2 est la seule à être passée près de Neptune.' },
      { q: 'Neptune porte le nom du dieu de…', o: [['🌊', 'la mer'], ['🔥', 'le feu'], ['🌲', 'la forêt']], a: 0, fact: 'Bravo ! Neptune est le dieu romain de la mer, comme sa belle couleur bleue.' },
      { q: 'Peut-on voir Neptune sans télescope ?', o: [['🔭', 'non, il faut un télescope'], ['👀', 'oui, facilement'], ['🕶️', 'avec des lunettes de soleil']], a: 0, fact: 'Oui ! Neptune est trop loin : il faut un télescope pour la voir.' },
      { q: 'Qu’y a-t-il tout au loin, après Neptune ?', o: [['☄️', 'des comètes glacées'], ['🏰', 'des châteaux'], ['🌴', 'des palmiers']], a: 0, fact: 'Bravo ! Après Neptune, il y a plein de petites comètes glacées. C’est là que vivent les farceurs !' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, bgStars } = A;
      ctx.fillStyle = '#060a24'; ctx.fillRect(0, 0, W, H);
      for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = .5 + .5 * Math.sin(time * 2 + s.tw); ctx.fillStyle = '#eef4ff'; ctx.fillRect(x, s.y * GY * .95, s.r, s.r); }
      ctx.globalAlpha = 1;
      const r = Math.min(W, H) * .32, cx = W * .7 - camX * zoom * .02, cy = H * .3 + camY * zoom * .05;
      const g = ctx.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r); g.addColorStop(0, '#8fb4ff'); g.addColorStop(.7, '#3456d8'); g.addColorStop(1, '#1a2c8a');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 3; i++) { const yy = cy - r * .3 + i * r * .35, xx = cx - r * .4 + ((time * 40 + i * 120) % (r * .8)); ctx.beginPath(); ctx.ellipse(xx, yy, r * .14, r * .03, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#1a2470'; ctx.beginPath(); ctx.ellipse(cx + r * .2, cy + r * .15, r * .14, r * .08, 0, 0, 7); ctx.fill();
      // la petite comète des farceurs, tout au loin
      const kx = W * .18 - camX * zoom * .01, ky = H * .16; const tg = ctx.createLinearGradient(kx, ky, kx + 90, ky - 30); tg.addColorStop(0, 'rgba(220,240,255,.9)'); tg.addColorStop(1, 'rgba(220,240,255,0)');
      ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(kx, ky - 5); ctx.lineTo(kx + 100, ky - 36); ctx.lineTo(kx + 100, ky - 20); ctx.lineTo(kx, ky + 5); ctx.fill(); ctx.fillStyle = '#eef8ff'; ctx.beginPath(); ctx.arc(kx, ky, 6, 0, 7); ctx.fill();
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, craters } = A;
      const gy = SY(0), g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#9ab4ea'); g.addColorStop(1, '#3a54a8');
      ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 10); ctx.fillStyle = '#d4e2fb'; ctx.fillRect(0, gy, W, 5 * zoom + 2);
      for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > W + 200) continue; ctx.fillStyle = 'rgba(30,50,120,.3)'; ctx.beginPath(); ctx.ellipse(sx, gy + (24 + c.r * .2) * zoom, c.r * zoom, c.r * .2 * zoom, 0, 0, 7); ctx.fill(); }
    },
  };
  // ================= la Terre (autour de la station spatiale) =================
  W.terre = {
    name: 'La Terre', chip: '🌍 La Terre', on: 'la station spatiale', theme: '#060a1c', L: 9600, cave: [4700, 6500], ceil: 620, pin: 0,
    intro: 'Retour près de la Terre, notre planète bleue ! Les farceurs ont accroché les cages à la station spatiale et aux satellites. Les astronautes comptent sur toi !',
    outroAll: 'Bravo Rose ! Tu as libéré les vingt amis de la station spatiale ! Dernière étape : le Soleil !', next: 'soleil', nextIcon: '☀️',
    caveShade: ['rgba(10,14,30,.75)', 'rgba(40,50,80,.3)'],
    colors: { ceil: ['#5a6276', '#9aa2b6', '#c8cede'], crystal: '120,200,255', cloud: ['#fff', '#fff'], slab: ['#2a4a9a', '#7a9ae8'], tite: '#7a8296', mesa: '#e6eaf2', arch: '#d8dde8', mesaTop: '#ffffff', rock: ['#c8ccd6', '#eef0f4'], mite: ['#8a92a6', '#b0b6c6'], ice: ['#e3f2fc', '#fff'], pancake: ['#d8dde8', '#ffffff'], ramp: ['#d8dde8', '#ffffff'] },
    solids: [
      { x: 880, y: 0, w: 420, h: 180, kind: 'mesa' },
      { x: 1700, y: 250, w: 320, h: 34, kind: 'slab' },
      { x: 2400, y: 0, w: 540, h: 330, kind: 'arch', oh: 240 },
      { x: 3300, y: 280, w: 320, h: 34, kind: 'slab' },
      { x: 3900, y: 0, w: 380, h: 200, kind: 'mesa' },
      { x: 5000, y: 0, w: 160, h: 260, kind: 'mite' },
      { x: 5400, y: 300, w: 150, h: 'ceil', kind: 'tite' },
      { x: 5800, y: 0, w: 170, h: 280, kind: 'mite' },
      { x: 6150, y: 320, w: 150, h: 'ceil', kind: 'tite' },
      { x: 7000, y: 0, w: 440, h: 190, kind: 'mesa' },
      { x: 7850, y: 260, w: 320, h: 34, kind: 'slab' },
      { x: 8500, y: 0, w: 220, h: 130, kind: 'rock' },
    ],
    stars: [[300, 650, 60, 60, 5], [940, 1240, 250, 40, 5], [1720, 2000, 320, 30, 4], [2480, 2860, 410, 40, 5], [2560, 2780, 60, 50, 4], [3320, 3600, 350, 30, 4], [3960, 4220, 270, 40, 5], [4850, 5000, 80, 60, 3], [5050, 5350, 380, 60, 5], [5600, 6000, 380, 40, 5], [6300, 6450, 150, 50, 3], [7060, 7380, 260, 40, 5], [7870, 8150, 330, 30, 4], [8520, 8700, 190, 40, 4], [8950, 9100, 60, 60, 3]],
    aliens: [
      { type: 'glouglou', x: 1500, x0: 1380, x1: 1650, y: 0 },
      { type: 'zap', x: 2100, y0: 330, y: 330 },
      { type: 'zigzag', x: 3150, x0: 3020, x1: 3250, y: 0 },
      { type: 'boing', x: 4500, x0: 4350, x1: 4650, y: 0 },
      { type: 'bidou', x: 5500, x0: 5200, x1: 5750, y: 0 },
      { type: 'zap', x: 6350, y0: 360, y: 360 },
      { type: 'glouglou', x: 6750, x0: 6600, x1: 6950, y: 0 },
      { type: 'zigzag', x: 7650, x0: 7520, x1: 7800, y: 0 },
      { type: 'bidou', x: 8250, x0: 8200, x1: 8450, y: 0 },
      { type: 'zap', x: 9200, y0: 340, y: 340 },
    ],
    boxes: [{ x: 1090, y: 270 }, { x: 2670, y: 455 }, { x: 7220, y: 280 }],
    riddles: [
      { q: 'Comment appelle-t-on la Terre, vue de l’espace ?', o: [['🔵', 'la planète bleue'], ['🔴', 'la planète rouge'], ['🟢', 'la planète verte']], a: 0, fact: 'Oui ! Vue de l’espace, la Terre est toute bleue : c’est la planète bleue.' },
      { q: 'Pourquoi la Terre est-elle bleue ?', o: [['🌊', 'à cause de l’eau des océans'], ['🎨', 'à cause de la peinture'], ['🫐', 'à cause des myrtilles']], a: 0, fact: 'Bravo ! Les océans couvrent presque toute la Terre. C’est pour ça qu’elle est bleue.' },
      { q: 'Où vivent les astronautes qui tournent autour de la Terre ?', o: [['🛰️', 'dans la station spatiale'], ['🏰', 'dans un château'], ['⛵', 'sur un bateau']], a: 0, fact: 'Oui ! Dans la station spatiale, des astronautes vivent et travaillent pendant des mois.' },
      { q: 'Dans la station spatiale, que font les astronautes ?', o: [['🎈', 'ils flottent'], ['🏃', 'ils courent très vite'], ['🛌', 'ils restent couchés']], a: 0, fact: 'Bravo ! Dans la station, tout flotte : les astronautes, les crayons, et même les gouttes d’eau !' },
      { q: 'Combien de levers de soleil voient les astronautes chaque jour ?', o: [['1️⃣6️⃣', 'seize'], ['1️⃣', 'un'], ['0️⃣', 'aucun']], a: 0, fact: 'Oui ! La station fait le tour de la Terre en une heure et demie : seize levers de soleil par jour !' },
      { q: 'Combien de temps la Terre met-elle pour faire le tour du Soleil ?', o: [['📅', 'un an'], ['🌙', 'une nuit'], ['🕐', 'une heure']], a: 0, fact: 'Bravo ! La Terre fait le tour du Soleil en un an. Chaque anniversaire, tu as fait un tour de plus !' },
      { q: 'Qui a été le premier homme dans l’espace ?', o: [['🧑‍🚀', 'Youri Gagarine'], ['🤴', 'un roi'], ['🧙', 'un magicien']], a: 0, fact: 'Oui ! Youri Gagarine a fait le tour de la Terre dans sa fusée en mille neuf cent soixante et un.' },
      { q: 'Combien de lunes tournent autour de la Terre ?', o: [['1️⃣', 'une'], ['🔟', 'dix'], ['0️⃣', 'aucune']], a: 0, fact: 'Bravo ! La Terre a une seule lune : la Lune, où Rose a commencé son voyage.' },
      { q: 'Qu’est-ce qui protège la Terre, comme une couverture ?', o: [['🌫️', 'l’air tout autour'], ['☂️', 'un parapluie'], ['⛺', 'une tente']], a: 0, fact: 'Oui ! L’air qui entoure la Terre, l’atmosphère, nous protège et nous permet de respirer.' },
      { q: 'Sur quelle planète vivent les plantes et les animaux ?', o: [['🌍', 'la Terre'], ['🔴', 'Mars'], ['🔵', 'Neptune']], a: 0, fact: 'Bravo ! La Terre est la seule planète où l’on connaît des plantes et des animaux.' },
      { q: 'La nuit, que voit-on briller sur la Terre depuis l’espace ?', o: [['💡', 'les lumières des villes'], ['🐛', 'des vers luisants géants'], ['🕯️', 'des bougies']], a: 0, fact: 'Oui ! La nuit, on voit briller les lumières de Paris, New York, Tokyo… toutes les villes du chapitre un !' },
      { q: 'La Terre est la combientième planète à partir du Soleil ?', o: [['3️⃣', 'la troisième'], ['1️⃣', 'la première'], ['8️⃣', 'la huitième']], a: 0, fact: 'Bravo ! Après Mercure et Vénus, la Terre est la troisième planète.' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY, L, bgStars } = A;
      ctx.fillStyle = '#04061a'; ctx.fillRect(0, 0, W, H);
      for (const s of bgStars) { const x = ((s.x * W * 2 - camX * zoom * .05) % W + W) % W; ctx.globalAlpha = .5 + .5 * Math.sin(time * 2 + s.tw); ctx.fillStyle = '#fff'; ctx.fillRect(x, s.y * GY * .7, s.r, s.r); }
      ctx.globalAlpha = 1;
      // la Terre, immense, sous la station : on passe du jour à la nuit, et les villes s'allument
      const n = Math.max(0, Math.min(1, (camX - L * .45) / (L * .25))), r = W * 1.1, cx = W * .5 - camX * zoom * .01, cy = GY + r * .78 + camY * zoom * .3;
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
      ctx.fillStyle = '#2f7fe0'; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      ctx.fillStyle = '#5fbf68'; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .22 - camX * .00002, x = cx + Math.cos(a) * r * .9, y = cy + Math.sin(a) * r * .9; ctx.beginPath(); ctx.ellipse(x, y, r * .08, r * .035, a, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i - 6) * .15 + time * .003, x = cx + Math.cos(a) * r * .97, y = cy + Math.sin(a) * r * .97; ctx.beginPath(); ctx.ellipse(x, y, r * .05, r * .012, a, 0, 7); ctx.fill(); }
      if (n > 0) { ctx.fillStyle = `rgba(6,10,40,${.78 * n})`; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.fillStyle = `rgba(255,214,120,${n})`;
        for (let i = 0; i < 60; i++) { const a = -Math.PI / 2 + (((i * 0.6180339) % 1) - .5) * 1.4, d = r * (.9 + ((i * 0.37) % 1) * .09); ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.6 + (i % 3), 0, 7); ctx.fill(); } }
      ctx.restore();
      ctx.strokeStyle = 'rgba(120,190,255,.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r + 3, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY } = A;
      const gy = SY(0); ctx.fillStyle = '#8f97aa'; ctx.fillRect(0, gy, W, 28 * zoom); ctx.fillStyle = '#c8cede'; ctx.fillRect(0, gy, W, 6 * zoom);
      ctx.strokeStyle = '#6a7286'; ctx.lineWidth = 3 * zoom; for (let x = Math.floor((SX(0) % (60 * zoom))); x < W; x += 60 * zoom) { ctx.beginPath(); ctx.moveTo(x, gy + 6 * zoom); ctx.lineTo(x + 30 * zoom, gy + 28 * zoom); ctx.lineTo(x + 60 * zoom, gy + 6 * zoom); ctx.stroke(); }
      ctx.fillStyle = '#5a6276'; ctx.fillRect(0, gy + 28 * zoom, W, H);
    },
  };
  // ================= le Soleil =================
  W.soleil = {
    name: 'Le Soleil', chip: '☀️ Le Soleil', on: 'les rochers du Soleil', theme: '#3a0e04', L: 9800, cave: [4700, 6600], ceil: 620, pin: 0,
    lifts: [1500, 3000, 7400, 8300], liftRGB: '255,190,110', liftDot: 'rgba(255,230,150,.9)',
    intro: 'Dernière étape : le Soleil, notre étoile ! Rose reste à bonne distance, sur des rochers qui flottent. Tous les farceurs sont là : courage, Rose !',
    outroAll: 'Bravo Rose ! Les vingt amis sont enfin tous libres ! Mais Capitaine Farfouille a dit qu’ils allaient tous sur la Terre…', next: null,
    caveShade: ['rgba(60,10,0,.7)', 'rgba(120,30,0,.25)'],
    colors: { ceil: ['#3a1408', '#7a2e12', '#a0441c'], crystal: '255,200,90', cloud: ['#fff', '#fff'], slab: ['#5a3a30', '#c86a3a'], tite: '#4a2418', mesa: '#5e4038', arch: '#54362e', mesaTop: '#e07a3a', rock: ['#5a3e36', '#7a5446'], mite: ['#4a2e26', '#6a4436'], ice: ['#e3f2fc', '#fff'], pancake: ['#5e4038', '#c86a3a'], ramp: ['#5e4038', '#e07a3a'] },
    solids: [
      { x: 880, y: 0, w: 380, h: 190, kind: 'mesa' },
      { x: 1800, y: 260, w: 300, h: 40, kind: 'slab' },
      { x: 2400, y: 0, w: 220, h: 310, kind: 'rock' },
      { x: 3300, y: 0, w: 540, h: 230, kind: 'ramp', dir: 1 },
      { x: 5000, y: 0, w: 160, h: 260, kind: 'mite' },
      { x: 5400, y: 300, w: 150, h: 'ceil', kind: 'tite' },
      { x: 5800, y: 0, w: 170, h: 280, kind: 'mite' },
      { x: 6200, y: 320, w: 150, h: 'ceil', kind: 'tite' },
      { x: 7000, y: 0, w: 480, h: 330, kind: 'arch', oh: 240 },
      { x: 7900, y: 250, w: 300, h: 40, kind: 'slab' },
      { x: 8700, y: 0, w: 400, h: 170, kind: 'mesa' },
    ],
    stars: [[300, 650, 60, 60, 5], [940, 1200, 260, 40, 5], [1820, 2080, 340, 30, 4], [2420, 2600, 390, 60, 4], [3350, 3800, 300, 40, 6], [4850, 5000, 80, 60, 3], [5050, 5350, 380, 60, 5], [5600, 6000, 380, 40, 5], [6300, 6500, 150, 50, 3], [7080, 7400, 400, 40, 5], [7150, 7330, 60, 50, 4], [7920, 8180, 330, 30, 4], [8760, 9040, 250, 40, 5], [9300, 9450, 60, 60, 3]],
    aliens: [
      { type: 'glouglou', x: 1500, x0: 1300, x1: 1750, y: 0 },
      { type: 'zap', x: 1950, y0: 380, y: 380 },
      { type: 'zigzag', x: 2900, x0: 2700, x1: 3200, y: 0 },
      { type: 'bidou', x: 4300, x0: 3950, x1: 4600, y: 0 },
      { type: 'boing', x: 5550, x0: 5200, x1: 5750, y: 0 },
      { type: 'zap', x: 6000, y0: 360, y: 360 },
      { type: 'bidou', x: 6700, x0: 6650, x1: 6950, y: 0 },
      { type: 'zigzag', x: 7700, x0: 7520, x1: 7850, y: 0 },
      { type: 'glouglou', x: 8400, x0: 8250, x1: 8650, y: 0 },
      { type: 'boing', x: 9250, x0: 9150, x1: 9400, y: 0 },
      { type: 'zap', x: 9450, y0: 340, y: 340 },
      { type: 'bidou', x: 9350, x0: 9150, x1: 9450, y: 0 },
    ],
    boxes: [{ x: 1070, y: 280 }, { x: 3600, y: 330 }, { x: 7240, y: 450 }],
    riddles: [
      { q: 'Le Soleil, qu’est-ce que c’est ?', o: [['⭐', 'une étoile'], ['🪐', 'une planète'], ['🌙', 'une lune']], a: 0, fact: 'Oui ! Le Soleil est une étoile, comme celles qu’on voit la nuit. Elle est juste beaucoup plus près de nous.' },
      { q: 'Peut-on regarder le Soleil directement ?', o: [['🙈', 'non, jamais'], ['👀', 'oui, longtemps'], ['🕶️', 'oui, avec des lunettes de soleil']], a: 0, fact: 'Bravo ! On ne regarde jamais le Soleil directement, même avec des lunettes de soleil. Ça abîme les yeux.' },
      { q: 'Combien de Terres pourrait-on mettre dans le Soleil ?', o: [['🌍', 'plus d’un million'], ['🔟', 'dix'], ['1️⃣', 'une']], a: 0, fact: 'Oui ! Le Soleil est si gros qu’on pourrait y mettre plus d’un million de Terres.' },
      { q: 'Combien de temps met la lumière du Soleil pour arriver jusqu’à nous ?', o: [['⏱️', 'environ huit minutes'], ['📅', 'un an'], ['⚡', 'zéro seconde']], a: 0, fact: 'Bravo ! La lumière va très vite, mais il lui faut environ huit minutes pour venir du Soleil.' },
      { q: 'Qu’est-ce qui tourne autour du Soleil ?', o: [['🪐', 'les planètes'], ['☁️', 'les nuages'], ['🐦', 'les oiseaux']], a: 0, fact: 'Oui ! Les huit planètes, dont la Terre, tournent autour du Soleil.' },
      { q: 'De quoi est fait le Soleil ?', o: [['🔥', 'de gaz très chaud'], ['🧊', 'de glace'], ['🍫', 'de chocolat']], a: 0, fact: 'Bravo ! Le Soleil est une immense boule de gaz très, très chaud.' },
      { q: 'Que nous donne le Soleil ?', o: [['☀️', 'la lumière et la chaleur'], ['❄️', 'la neige'], ['🍬', 'des bonbons']], a: 0, fact: 'Oui ! Sans la lumière et la chaleur du Soleil, il n’y aurait pas de vie sur la Terre.' },
      { q: 'Pourquoi les plantes ont-elles besoin du Soleil ?', o: [['🌱', 'pour grandir'], ['😴', 'pour dormir'], ['🎤', 'pour chanter']], a: 0, fact: 'Bravo ! Les plantes se nourrissent grâce à la lumière du Soleil.' },
      { q: 'La nuit, où est le Soleil ?', o: [['🌍', 'de l’autre côté de la Terre'], ['💤', 'il dort'], ['🌊', 'dans la mer']], a: 0, fact: 'Oui ! La Terre tourne : quand il fait nuit chez nous, il fait jour de l’autre côté.' },
      { q: 'Comment s’appellent les taches sombres sur le Soleil ?', o: [['⚫', 'des taches solaires'], ['🍪', 'des miettes'], ['🕳️', 'des trous']], a: 0, fact: 'Bravo ! Ce sont des taches solaires : des endroits un peu moins chauds que le reste du Soleil.' },
      { q: 'Le Soleil fait danser de belles lumières dans le ciel près des pôles. Ce sont…', o: [['🌌', 'des aurores'], ['🌈', 'des arcs-en-ciel'], ['🎆', 'des feux d’artifice']], a: 0, fact: 'Oui ! Ce sont les aurores polaires, vertes et violettes, créées par le vent du Soleil.' },
      { q: 'Vu de l’espace, de quelle couleur est le Soleil ?', o: [['⚪', 'blanc'], ['🟢', 'vert'], ['🔵', 'bleu']], a: 0, fact: 'Bravo ! Vu de l’espace, le Soleil est blanc. C’est l’air de la Terre qui le fait paraître jaune.' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY } = A;
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a0800'); g.addColorStop(1, '#7a2400'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const r = Math.min(W, H) * .75, cx = W * .78 - camX * zoom * .01, cy = -r * .2 + camY * zoom * .04;
      const glow = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 1.6); glow.addColorStop(0, 'rgba(255,170,60,.55)'); glow.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, r * 1.6, 0, 7); ctx.fill();
      // éruptions qui dansent sur le bord
      ctx.strokeStyle = 'rgba(255,190,90,.8)'; ctx.lineWidth = 10; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) { const a = Math.PI * (.45 + i * .1), h = r * (.12 + .06 * Math.sin(time * 1.5 + i * 2)), x0 = cx + Math.cos(a) * r, y0 = cy + Math.sin(a) * r;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx + Math.cos(a + .05) * (r + h * 2), cy + Math.sin(a + .05) * (r + h * 2), cx + Math.cos(a + .1) * r, cy + Math.sin(a + .1) * r); ctx.stroke(); }
      const sg = ctx.createRadialGradient(cx - r * .2, cy + r * .2, r * .1, cx, cy, r); sg.addColorStop(0, '#fff7c0'); sg.addColorStop(.6, '#ffc040'); sg.addColorStop(1, '#ff7a1a'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(200,90,10,.35)'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(cx - r * (.2 + i * .15), cy + r * (.45 + (i % 2) * .15), r * .03, 0, 7); ctx.fill(); }
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY, craters } = A;
      const gy = SY(0), g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#5a3e36'); g.addColorStop(1, '#2a1a16');
      ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 10); ctx.fillStyle = '#ff9a4a'; ctx.fillRect(0, gy, W, 4 * zoom + 2);
      for (const c of craters) { const sx = SX(c.x); if (sx < -200 || sx > W + 200) continue; ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(sx, gy + (24 + c.r * .2) * zoom, c.r * zoom, c.r * .2 * zoom, 0, 0, 7); ctx.fill(); }
    },
  };
  // ================= le grand final : la ville envahie par les soucoupes =================
  // Rose vole, Ziggy, Filou et Titan courent avec elle et envoient des bulles eux aussi ; à la fin, Capitaine Farfouille dans sa soucoupe.
  W.final = {
    name: 'Le grand final', chip: '🏙️ Le grand final', on: 'la ville', theme: '#8fd3ff', L: 9000, pin: 0,
    noCages: true, noRocket: true, helpers: ['ziggy', 'filou', 'titan'], friends: 4,
    boss: { x: 8150, x0: 7650, x1: 8650, y: 330, hp: 3 },
    intro: 'Les farceurs sont partout dans la ville ! Envoie des bulles avec Ziggy, Filou et Titan. Capitaine Farfouille t’attend tout au bout !',
    outroAll: 'Bravo Rose ! Toute la ville est remplie de bulles, et Capitaine Farfouille aussi !',
    colors: { ceil: ['#888', '#aaa', '#ccc'], crystal: '255,255,255', cloud: ['#fff', '#fff'], slab: ['#c0563a', '#ff8a5a'], tite: '#888', mesa: '#d9b38c', arch: '#c9a27c', mesaTop: '#f2d5b0', rock: ['#9aa3b5', '#c8d0de'],
      block: [['#f2b6a0', '#c97a64'], ['#a8d8ea', '#6aa8c4'], ['#ffe08a', '#d1a84a'], ['#c8b6f2', '#8f7ac9'], ['#b6e6a8', '#74b064']] },
    solids: [
      { x: 900, y: 0, w: 360, h: 220, kind: 'block', c: 0 },
      { x: 1500, y: 260, w: 260, h: 34, kind: 'slab' },
      { x: 2050, y: 0, w: 420, h: 300, kind: 'block', c: 1 },
      { x: 2900, y: 0, w: 300, h: 180, kind: 'block', c: 2 },
      { x: 3500, y: 300, w: 280, h: 34, kind: 'slab' },
      { x: 4100, y: 0, w: 460, h: 260, kind: 'block', c: 3 },
      { x: 4900, y: 0, w: 540, h: 330, kind: 'arch', oh: 240 },
      { x: 5800, y: 0, w: 320, h: 200, kind: 'block', c: 4 },
      { x: 6400, y: 280, w: 280, h: 34, kind: 'slab' },
      { x: 6950, y: 0, w: 380, h: 240, kind: 'block', c: 0 },
    ],
    stars: [[300, 650, 60, 60, 5], [940, 1220, 270, 40, 5], [1520, 1740, 330, 30, 4], [2100, 2420, 350, 40, 5], [2940, 3160, 230, 40, 4], [3520, 3760, 370, 30, 4], [4150, 4510, 310, 40, 5], [4980, 5360, 410, 40, 5], [5020, 5320, 60, 50, 4], [5840, 6080, 250, 40, 4], [6420, 6660, 350, 30, 4], [7000, 7280, 290, 40, 5], [7500, 7700, 80, 60, 3]],
    aliens: [
      { type: 'glouglou', x: 1350, x0: 1280, x1: 1480, y: 0 },
      { type: 'zap', x: 1800, y0: 380, y: 380 },
      { type: 'boing', x: 2700, x0: 2560, x1: 2840, y: 0 },
      { type: 'zigzag', x: 3350, x0: 3250, x1: 3450, y: 0 },
      { type: 'bidou', x: 3900, x0: 3820, x1: 4040, y: 0 },
      { type: 'zap', x: 4700, y0: 380, y: 380 },
      { type: 'glouglou', x: 5150, x0: 5060, x1: 5280, y: 0 },
      { type: 'boing', x: 5600, x0: 5500, x1: 5720, y: 0 },
      { type: 'zigzag', x: 6250, x0: 6180, x1: 6340, y: 0 },
      { type: 'zap', x: 6800, y0: 400, y: 400 },
      { type: 'bidou', x: 7450, x0: 7380, x1: 7560, y: 0 },
    ],
    boxes: [{ x: 1080, y: 310 }, { x: 4330, y: 350 }, { x: 7140, y: 330 }],
    riddles: [
      { q: 'Pourquoi les farceurs faisaient-ils des blagues ?', o: [['💛', 'ils voulaient des amis'], ['🍰', 'ils voulaient un gâteau'], ['😴', 'ils voulaient dormir']], a: 0, fact: 'Oui ! Sur leur comète, ils étaient tout seuls. Ils voulaient juste des amis pour jouer.' },
      { q: 'Pour jouer avec quelqu’un, que peut-on faire ?', o: [['🙋', 'lui demander gentiment'], ['😠', 'lui prendre ses jouets'], ['🙈', 'se cacher']], a: 0, fact: 'Bravo ! Il suffit de demander : « Tu veux jouer avec moi ? »' },
      { q: 'Que dit la poudre Grognon quand elle tombe sur le nez ?', o: [['😾', 'elle rend grognon'], ['😂', 'elle fait rire'], ['🌈', 'elle fait des arcs-en-ciel']], a: 0, fact: 'Oui ! La poudre Grognon rend tout le monde grognon. Heureusement, les héros savent quoi faire !' },
      { q: 'Quand quelqu’un est triste, que peut-on proposer ?', o: [['🤗', 'un câlin'], ['🙉', 'de crier'], ['🚪', 'de partir']], a: 0, fact: 'Bravo ! On peut demander : « Tu veux un câlin ? »' },
      { q: 'Quand on est en colère, que peut-on faire ?', o: [['🎈', 'souffler doucement'], ['🦶', 'taper du pied très fort'], ['🍫', 'manger du chocolat']], a: 0, fact: 'Oui ! On souffle tout doucement, comme dans un ballon, et la colère s’envole.' },
      { q: 'Après une dispute, que dit-on ?', o: [['🙏', 'pardon'], ['🤐', 'rien du tout'], ['😜', 'bien fait']], a: 0, fact: 'Bravo ! On dit pardon, et on refait ami-ami.' },
      { q: 'Quand on attend son tour, que peut-on faire ?', o: [['🔢', 'compter jusqu’à dix'], ['🏃', 'passer devant'], ['😭', 'pleurer']], a: 0, fact: 'Oui ! On compte, ou on chante une chanson, et le temps passe plus vite.' },
      { q: 'Qui est le chef des farceurs ?', o: [['🧢', 'Capitaine Farfouille'], ['🦸', 'Ziggy'], ['🐸', 'une grenouille']], a: 0, fact: 'Bravo ! Capitaine Farfouille, avec sa casquette dorée trop grande et sa cape trop longue.' },
      { q: 'D’où viennent les farceurs ?', o: [['☄️', 'd’une petite comète'], ['🌊', 'du fond de la mer'], ['🏔️', 'd’une montagne']], a: 0, fact: 'Oui ! Ils vivent tout au bout du système solaire, sur une petite comète glacée.' },
      { q: 'Avec quoi Rose attrape-t-elle les farceurs ?', o: [['🫧', 'des bulles'], ['🥅', 'un filet'], ['🍯', 'du miel']], a: 0, fact: 'Bravo ! Des bulles toutes douces : personne n’a mal, les farceurs flottent, c’est tout !' },
      { q: 'Combien d’amis Rose a-t-elle libérés dans l’espace ?', o: [['2️⃣0️⃣', 'vingt'], ['3️⃣', 'trois'], ['1️⃣0️⃣0️⃣', 'cent']], a: 0, fact: 'Oui ! Vingt amis, sur dix mondes différents. Quel voyage !' },
      { q: 'Quand on rencontre quelqu’un de nouveau, que peut-on dire ?', o: [['👋', 'bonjour, comment tu t’appelles ?'], ['🙄', 'va-t’en'], ['🤫', 'rien']], a: 0, fact: 'Bravo ! Un sourire et un bonjour, et c’est peut-être le début d’une grande amitié.' },
    ],
    drawBg(A, time) {
      const { ctx, W, H, GY, zoom, camX, camY } = A;
      const g = ctx.createLinearGradient(0, 0, 0, GY); g.addColorStop(0, '#5bb8ff'); g.addColorStop(1, '#cdeeff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // soleil et nuages
      ctx.fillStyle = 'rgba(255,240,170,.9)'; ctx.beginPath(); ctx.arc(W * .85, H * .14, Math.min(W, H) * .07, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      for (let i = 0; i < 7; i++) { const x = ((i * 420 - camX * zoom * .08 + time * 6) % (W + 400) + W + 400) % (W + 400) - 200, y = H * (.1 + (i % 3) * .07);
        ctx.beginPath(); ctx.arc(x, y, 28, 0, 7); ctx.arc(x + 30, y - 12, 34, 0, 7); ctx.arc(x + 64, y, 26, 0, 7); ctx.fill(); }
      // des soucoupes partout dans le ciel, et la poudre violette qui tombe
      for (let i = 0; i < 9; i++) { const x = ((i * 337 - camX * zoom * .15 + Math.sin(time * .4 + i) * 60) % (W + 300) + W + 300) % (W + 300) - 150, y = H * (.08 + (i % 4) * .06) + Math.sin(time * 1.3 + i) * 8, s = .6 + (i % 3) * .25;
        ctx.fillStyle = '#b7c0d4'; ctx.beginPath(); ctx.ellipse(x, y, 34 * s, 10 * s, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(170,230,255,.9)'; ctx.beginPath(); ctx.ellipse(x, y - 7 * s, 15 * s, 11 * s, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = 'rgba(190,120,255,.55)'; for (let k = 0; k < 4; k++) { const py = y + 14 * s + ((time * 40 + k * 22 + i * 13) % 70); ctx.beginPath(); ctx.arc(x + Math.sin(time * 3 + k) * 8, py, 2, 0, 7); ctx.fill(); } }
      // la ville au loin (deux rangées d'immeubles en parallaxe)
      for (const [par, col, hb, sd] of [[.12, '#a9c6e8', .3, 1], [.25, '#86a8d6', .22, 2]]) {
        ctx.fillStyle = col; const step = 90;
        for (let i = -2; i < W / step + 3; i++) { const wx = i * step - ((camX * zoom * par) % step), idx = i + Math.floor(camX * zoom * par / step), h = (GY * hb) * (.55 + ((idx * 7919 * sd) % 100) / 160);
          ctx.fillRect(wx, GY - h - camY * zoom * .1, step - 8, h + 200); } }
    },
    drawGround(A, time) {
      const { ctx, W, H, zoom, SX, SY } = A;
      const gy = SY(0); ctx.fillStyle = '#d8d4cc'; ctx.fillRect(0, gy, W, 26 * zoom); ctx.fillStyle = '#efece6'; ctx.fillRect(0, gy, W, 5 * zoom);
      ctx.fillStyle = '#5a5f6e'; ctx.fillRect(0, gy + 26 * zoom, W, H);
      ctx.fillStyle = '#f5f0d8'; for (let x = ((SX(0) % (160 * zoom)) + 160 * zoom) % (160 * zoom) - 160 * zoom; x < W; x += 160 * zoom) ctx.fillRect(x, gy + 60 * zoom, 70 * zoom, 8 * zoom);
      // un peu de poudre violette sur le trottoir
      ctx.fillStyle = 'rgba(170,100,240,.5)'; for (let i = 0; i < 40; i++) { const x = SX(i * 230 + (i % 3) * 40); if (x < -10 || x > W + 10) continue; ctx.beginPath(); ctx.arc(x, gy + 10 * zoom, 3 * zoom, 0, 7); ctx.fill(); }
    },
  };
})();
