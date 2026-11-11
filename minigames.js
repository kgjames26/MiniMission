/* Énigmes et mini-jeux de Mini Mission : questions pour enfants de 6 ans, labyrinthe, puzzle, jeu de mémoire façon « Simon ».
   Chaque caisse « ? » ouvre l'un d'eux. On peut toujours quitter. */
(() => {
  const MM = (window.MM = window.MM || {});
  const G = (MM.games = {});
  const rand = Math.random;
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const shuffle = (list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (list, n) => shuffle(list).slice(0, n);
  const seeded = (seed) => { let s = seed || 1; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const PICS = ["🦁", "🐘", "🚀", "🐙", "🦄", "🏰", "🐢", "🚂", "🌈", "🦋", "🐬", "🐼", "🦊", "🐸", "🐵", "🐧", "🦉", "🐞", "🐝", "🦀", "🐳", "🦒", "🦓", "🐯", "🐻", "🐨", "🐰", "🐶", "🐱", "🐭", "🐹", "🐷", "🐮", "🐔", "🦆", "🦜", "🐠", "🐡", "🦈", "🐌", "🦖", "🦕", "🐉", "🚜", "🚒", "🚓", "🚑", "🚌", "🚲", "✈️", "🚁", "⛵", "🚢", "🛸", "🌙", "☀️", "⭐", "☁️", "⛄", "🌻", "🌷", "🌹", "🌲", "🌴", "🍄", "🍎", "🍌", "🍓", "🍒", "🍇", "🍉", "🍍", "🥕", "🌽", "🍕", "🍔", "🍦", "🍩", "🍪", "🎂", "🧁", "🎈", "🎁", "🎸", "🥁", "🎺", "⚽", "🏀", "🎨", "🧸", "🪁", "🚪", "🏠", "🗼", "🎡", "🏝️", "🌋", "🗻", "🦩", "🦔", "🍋", "🥝", "🌵", "🐾"];
  const MAZE_PAIRS = [["🐭", "🧀"], ["🐰", "🥕"], ["🐻", "🍯"], ["🐱", "🐟"], ["🐶", "🦴"], ["🐢", "🥬"], ["🐿️", "🌰"], ["🐝", "🌻"], ["🦊", "🍇"], ["🐸", "🪰"], ["🐵", "🍌"], ["🐼", "🎋"], ["🐮", "🌾"], ["🐴", "🍎"], ["🐷", "🍄"], ["🐔", "🌽"], ["🦆", "🍞"], ["🐧", "🐟"], ["🐨", "🌿"], ["🦒", "🍃"], ["🐘", "🥜"], ["🦕", "🌴"], ["🧒", "🍦"], ["👧", "🎈"], ["👦", "⚽"], ["🚀", "🌙"], ["🚂", "🏠"], ["🚜", "🌾"], ["⛵", "🏝️"], ["🚒", "🔥"], ["🚑", "🏥"], ["🚲", "🌳"], ["🦋", "🌷"], ["🐞", "🌹"], ["🐌", "🥬"], ["🐙", "💎"], ["🐠", "🪸"], ["🦀", "🐚"], ["🐬", "⭐"], ["🐳", "🌊"], ["🦄", "🌈"], ["🧚", "🪄"], ["🤖", "🔋"], ["👽", "🛸"], ["🦖", "🍖"], ["🐉", "💰"], ["🏴‍☠️", "🗝️"], ["🎅", "🎁"], ["🧑‍🚀", "🪐"], ["🦉", "🌙"]];
  /* Mémoire silencieuse : pour chaque sorte de mini-jeu, ce qui a déjà servi ; on repart de zéro quand tout est passé. */
  G.state = {};
  const seenOf = (kind) => { const s = (G.state.seen = G.state.seen || {}); return (s[kind] = s[kind] || []); };
  function fresh(kind, pool, key = (x) => String(x)) {
    const seen = seenOf(kind); let cand = pool.filter((x) => !seen.includes(key(x)));
    if (!cand.length) { seen.length = 0; cand = pool.slice(); }
    const x = pick(cand); seen.push(key(x)); return x;
  }
  function freshMany(kind, pool, n) {
    const seen = seenOf(kind), out = []; let cand = pool.filter((x) => !seen.includes(x));
    while (out.length < n) {
      if (!cand.length) { seen.length = 0; cand = pool.filter((x) => !out.includes(x)); }
      const x = pick(cand); out.push(x); seen.push(x); cand = cand.filter((y) => y !== x);
    }
    return out;
  }
  const SIMON_POOL = {};
  const simonSeq = (len) => { const pool = SIMON_POOL[len] || (SIMON_POOL[len] = Array.from({ length: 100 }, (_, i) => { const r = seeded(len * 7919 + i * 31 + 1); return Array.from({ length: len }, () => Math.floor(r() * 4)); })); return fresh('simon' + len, pool, (s) => s.join('')); };
  const NUM_WORDS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];

  /* ---------- Questions ---------- */
  const ANIMALS = [['🐱', 'le chat', 'miaou'], ['🐶', 'le chien', 'ouaf ouaf'], ['🐮', 'la vache', 'meuh'], ['🐑', 'le mouton', 'bê'], ['🐷', 'le cochon', 'groin groin'], ['🦆', 'le canard', 'coin coin'], ['🐸', 'la grenouille', 'coa coa'], ['🐔', 'la poule', 'cot cot'], ['🦁', 'le lion', 'grrr'], ['🐝', 'l’abeille', 'bzzz'], ['🐴', 'le cheval', 'hiii'], ['🐓', 'le coq', 'cocorico']];
  const COLORS = {
    jaune: ['🟡', [['🍌', 'la banane'], ['🌻', 'le tournesol'], ['⭐', 'l’étoile'], ['🐤', 'le poussin'], ['🧀', 'le fromage']]],
    rouge: ['🔴', [['🍎', 'la pomme'], ['🍓', 'la fraise'], ['🍅', 'la tomate'], ['🚒', 'le camion de pompiers'], ['🌹', 'la rose']]],
    vert: ['🟢', [['🐸', 'la grenouille'], ['🥦', 'le brocoli'], ['🌳', 'l’arbre'], ['🥒', 'le concombre'], ['🐢', 'la tortue']]],
    bleu: ['🔵', [['🫐', 'les myrtilles'], ['🐳', 'la baleine'], ['🌊', 'la vague'], ['💙', 'le cœur bleu']]],
    orange: ['🟠', [['🍊', 'l’orange'], ['🥕', 'la carotte'], ['🎃', 'la citrouille'], ['🦊', 'le renard']]],
    violet: ['🟣', [['🍇', 'le raisin'], ['🍆', 'l’aubergine'], ['🔮', 'la boule magique'], ['🦄', 'la licorne']]]
  };
  const COUNTABLES = [['🎈', 'ballons'], ['⭐', 'étoiles'], ['🍎', 'pommes'], ['🐟', 'poissons'], ['🚗', 'voitures'], ['🌸', 'fleurs'], ['🐞', 'coccinelles'], ['🍪', 'gâteaux']];
  const GROUPS = [
    [['🍎', 'la pomme'], ['🍌', 'la banane'], ['🍇', 'le raisin'], ['🍓', 'la fraise'], ['🍊', 'l’orange']],
    [['🐶', 'le chien'], ['🐱', 'le chat'], ['🐰', 'le lapin'], ['🐻', 'l’ours'], ['🐼', 'le panda']],
    [['🚗', 'la voiture'], ['🚌', 'le bus'], ['🚲', 'le vélo'], ['🚂', 'le train'], ['✈️', 'l’avion']],
    [['👕', 'le t-shirt'], ['👖', 'le pantalon'], ['🧦', 'la chaussette'], ['🧢', 'la casquette'], ['👟', 'la chaussure']],
    [['🪑', 'la chaise'], ['🛏️', 'le lit'], ['🛋️', 'le canapé'], ['🚪', 'la porte'], ['🪟', 'la fenêtre']]
  ];
  const ABILITIES = [
    ['Qui peut voler ?', [['🐦', 'l’oiseau'], ['🦋', 'le papillon'], ['🐝', 'l’abeille'], ['🦉', 'le hibou']], [['🐢', 'la tortue'], ['🐘', 'l’éléphant'], ['🐄', 'la vache'], ['🐌', 'l’escargot']]],
    ['Qui sait nager ?', [['🐟', 'le poisson'], ['🐬', 'le dauphin'], ['🐙', 'la pieuvre'], ['🐳', 'la baleine']], [['🐱', 'le chat'], ['🦒', 'la girafe'], ['🐓', 'le coq'], ['🐘', 'l’éléphant']]],
    ['Qui vit à la ferme ?', [['🐮', 'la vache'], ['🐷', 'le cochon'], ['🐔', 'la poule'], ['🐑', 'le mouton']], [['🦁', 'le lion'], ['🐘', 'l’éléphant'], ['🐧', 'le pingouin'], ['🦒', 'la girafe']]],
    ['Qui a des roues ?', [['🚗', 'la voiture'], ['🚲', 'le vélo'], ['🚌', 'le bus'], ['🛴', 'la trottinette']], [['🐢', 'la tortue'], ['🏠', 'la maison'], ['🌳', 'l’arbre'], ['🍎', 'la pomme']]],
    ['Qu’est-ce qui est doux et sucré ?', [['🍭', 'la sucette'], ['🍰', 'le gâteau'], ['🍓', 'la fraise'], ['🍯', 'le miel']], [['🧅', 'l’oignon'], ['🪨', 'le caillou'], ['🧽', 'l’éponge'], ['🌵', 'le cactus']]]
  ];
  const SHAPES = [['🔴', 'le rond'], ['🟥', 'le carré'], ['🔺', 'le triangle'], ['⭐', 'l’étoile'], ['❤️', 'le cœur']];
  const SIZES = [['🐜', 'la fourmi'], ['🐭', 'la souris'], ['🐱', 'le chat'], ['🐕', 'le chien'], ['🐴', 'le cheval'], ['🐘', 'l’éléphant'], ['🐋', 'la baleine']];
  const EATS = [['🐰', 'le lapin', '🥕', 'la carotte'], ['🐵', 'le singe', '🍌', 'la banane'], ['🐱', 'le chat', '🐟', 'le poisson'], ['🐶', 'le chien', '🦴', 'l’os'], ['🐭', 'la souris', '🧀', 'le fromage'], ['🐻', 'l’ours', '🍯', 'le miel'], ['🐿️', 'l’écureuil', '🌰', 'la noisette'], ['🐮', 'la vache', '🌿', 'l’herbe']];
  const WEARS = [['Que met-on aux pieds ?', '👟', 'les chaussures'], ['Que met-on sur la tête ?', '🧢', 'la casquette'], ['Que met-on aux mains ?', '🧤', 'les gants'], ['Que met-on sur le nez ?', '👓', 'les lunettes'], ['Que met-on autour du cou ?', '🧣', 'l’écharpe'], ['Que met-on quand il pleut ?', '☔', 'le parapluie']];
  const WEAR_OTHERS = [['🍎', 'la pomme'], ['⚽', 'le ballon'], ['📘', 'le livre'], ['🚗', 'la voiture'], ['🪁', 'le cerf-volant'], ['🍪', 'le gâteau']];

  const quiz = (prompt, visual, options, answerIndex, say) => ({ kind: 'quiz', prompt, say: say || prompt, visual, options, answer: answerIndex });
  // place la bonne réponse à une position aléatoire
  const withAnswer = (prompt, visual, correct, wrongs, say) => { const opts = shuffle([correct, ...wrongs]); return quiz(prompt, visual, opts, opts.indexOf(correct), say); };
  const FAMILIES = [
    () => { const a = pick(ANIMALS); return withAnswer(`Qui fait « ${a[2]} » ?`, '🔊', [a[0], a[1]], sample(ANIMALS.filter((x) => x !== a), 2).map((x) => [x[0], x[1]])); },
    () => { const name = pick(Object.keys(COLORS)), [dot, items] = COLORS[name]; const it = pick(items); const others = shuffle(Object.entries(COLORS).filter(([k]) => k !== name).flatMap(([, v]) => v[1])); return withAnswer(`Qu’est-ce qui est ${name} ?`, dot, it, others.slice(0, 2)); },
    () => { const [e, w] = pick(COUNTABLES), n = 1 + Math.floor(rand() * 6); const wrong = sample([1, 2, 3, 4, 5, 6, 7].filter((k) => k !== n), 2); return withAnswer(`Combien y a-t-il de ${w} ?`, e.repeat(n), [String(n), NUM_WORDS[n]], wrong.map((k) => [String(k), NUM_WORDS[k]]), `Combien y a-t-il de ${w} ? Compte avec moi.`); },
    () => { const [set, other] = sample(GROUPS, 2); const odd = pick(other), two = sample(set, 2); return withAnswer('Quel est l’intrus ?', '🕵️', odd, two, 'Quel est l’intrus ? Cherche celui qui ne va pas avec les autres.'); },
    () => { const [prompt, yes, no] = pick(ABILITIES); return withAnswer(prompt, '🤔', pick(yes), sample(no, 2)); },
    () => { const s = pick(SHAPES); return withAnswer(`Montre-moi ${s[1]} !`, '👆', s, sample(SHAPES.filter((x) => x !== s), 2), `Où est ${s[1]} ?`); },
    () => { const big = rand() < .5; const items = sample([0, 1, 2, 3, 4, 5, 6], 3).sort((x, y) => x - y).map((i) => SIZES[i]); const correct = big ? items[2] : items[0]; const opts = shuffle(items); return quiz(big ? 'Qui est le plus grand ?' : 'Qui est le plus petit ?', big ? '📏' : '🔍', opts, opts.indexOf(correct)); },
    () => { const e = pick(EATS); const foods = EATS.filter((x) => x !== e).map((x) => [x[2], x[3]]); return withAnswer(`Que mange ${e[1]} ?`, e[0], [e[2], e[3]], sample(foods, 2)); },
    () => { const w = pick(WEARS); return withAnswer(w[0], '🧑', [w[1], w[2]], sample(WEAR_OTHERS, 2)); },
    () => { const n = 1 + Math.floor(rand() * 8); const wrong = sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((k) => k !== n + 1), 2); return withAnswer(`Quel nombre vient après ${NUM_WORDS[n]} ?`, String(n), [String(n + 1), NUM_WORDS[n + 1]], wrong.map((k) => [String(k), NUM_WORDS[k]])); }
  ];
  G.makeQuiz = () => {
    const seen = seenOf('quiz'); let q = null;
    for (let i = 0; i < 40; i++) { q = pick(FAMILIES)(); const key = q.prompt + '|' + q.options.map((o) => o[1]).join(','); if (!seen.includes(key)) { seen.push(key); if (seen.length > 600) seen.shift(); return q; } }
    seen.length = 0; return q;          // tout a été vu : on recommence
  };

  /* ---------- Choix des trois jeux d'une mission ---------- */
  G.makeTasks = (legacyQuiz, level = 0) => {
    const lv = Math.max(0, Math.min(9, level));
    const makeOne = (kind) => {
      if (kind === 'maze') { const [seeker, goal] = fresh('maze', MAZE_PAIRS, (p) => p.join('')); return { kind: 'maze', size: 4 + Math.floor(lv / 3) + (rand() < .35 ? 1 : 0), seed: Math.floor(rand() * 4e9) + 1, seeker, goal, say: `Aide ${seeker} à trouver ${goal} !` }; }
      if (kind === 'jigsaw') return { kind: 'jigsaw', emoji: fresh('jigsaw', PICS), cols: lv < 3 ? 2 : 3, rows: lv < 3 ? 2 : lv < 6 ? 2 : 3, say: 'Remets l’image dans le bon ordre !' };
      if (kind === 'pairs') return { kind: 'pairs', cards: freshMany('pairs', PICS, Math.min(6, 3 + Math.floor(lv / 3) + (rand() < .3 ? 1 : 0))), say: 'Retrouve les paires !' };
      if (kind === 'simon') return { kind: 'simon', length: 3 + Math.floor(lv / 3), seq: simonSeq(3 + Math.floor(lv / 3)), say: 'Écoute la musique et regarde les couleurs, puis refais comme moi !' };
      return rand() < .18 && legacyQuiz ? { ...legacyQuiz(), kind: 'quiz' } : G.makeQuiz();
    };
    // trois jeux différents tirés au hasard parmi : puzzle, labyrinthe, paires, rythme, énigme
    // on prend toujours les sortes les moins servies : aucune n'est plus fréquente qu'une autre
    const counts = (G.state.count = G.state.count || {});
    const kinds = shuffle(['maze', 'jigsaw', 'pairs', 'simon', 'quiz']).sort((a, b) => (counts[a] || 0) - (counts[b] || 0)).slice(0, 3);
    kinds.forEach((k) => { counts[k] = (counts[k] || 0) + 1; });
    return shuffle(kinds).map(makeOne);
  };
  G.icon = (kind) => ({ maze: '🐭', jigsaw: '🧩', simon: '🎵', pairs: '🃏' }[kind] || '❓');

  /* ---------- Mini-jeux ---------- */
  // api : { onSolved(), tone(freq, ms), say(text) }
  G.start = (task, host, api) => {
    host.innerHTML = '';
    if (task.kind === 'maze') return startMaze(task, host, api);
    if (task.kind === 'jigsaw') return startJigsaw(task, host, api);
    if (task.kind === 'pairs') return startPairs(task, host, api);
    return startSimon(task, host, api);
  };

  function startMaze(task, host, api) {
    const n = task.size || 5, rnd = seeded(task.seed);
    // labyrinthe parfait par parcours en profondeur
    const cells = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ N: true, E: true, S: true, W: true, seen: false })));
    const dirs = { N: [0, -1, 'S'], E: [1, 0, 'W'], S: [0, 1, 'N'], W: [-1, 0, 'E'] };
    const stack = [[0, 0]]; cells[0][0].seen = true;
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const opts = Object.entries(dirs).map(([d, [dx, dy, back]]) => [d, x + dx, y + dy, back]).filter(([, nx, ny]) => nx >= 0 && ny >= 0 && nx < n && ny < n && !cells[ny][nx].seen);
      if (!opts.length) { stack.pop(); continue; }
      const [d, nx, ny, back] = opts[Math.floor(rnd() * opts.length)];
      cells[y][x][d] = false; cells[ny][nx][back] = false; cells[ny][nx].seen = true; stack.push([nx, ny]);
    }
    const wrap = document.createElement('div'); wrap.className = 'maze-wrap';
    const canvas = document.createElement('canvas'); canvas.className = 'maze-canvas'; wrap.appendChild(canvas); host.appendChild(wrap);
    const ctx = canvas.getContext('2d');
    let cur = [0, 0], solved = false, trail = [[0, 0]], raf = 0, stopped = false;
    const size = () => { const r = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); return r.width; };
    function draw(t) {
      if (stopped) return;
      const css = canvas.getBoundingClientRect().width; if (canvas.width !== Math.round(css * Math.min(window.devicePixelRatio || 1, 2))) size();
      const k = canvas.width / n, W = canvas.width;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, W);
      ctx.fillStyle = '#fff8e6'; ctx.fillRect(0, 0, W, W);
      trail.forEach(([x, y]) => { ctx.fillStyle = 'rgba(255,214,90,.45)'; ctx.fillRect(x * k + 3, y * k + 3, k - 6, k - 6); });
      ctx.font = `${k * .62}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(task.goal || '🧀', (n - .5) * k, (n - .5) * k + Math.sin(t / 300) * 3);
      ctx.strokeStyle = '#8a5a3c'; ctx.lineWidth = Math.max(5, k * .09); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const c = cells[y][x];
        if (c.N) { ctx.moveTo(x * k, y * k); ctx.lineTo((x + 1) * k, y * k); }
        if (c.W) { ctx.moveTo(x * k, y * k); ctx.lineTo(x * k, (y + 1) * k); }
        if (x === n - 1 && c.E) { ctx.moveTo((x + 1) * k, y * k); ctx.lineTo((x + 1) * k, (y + 1) * k); }
        if (y === n - 1 && c.S) { ctx.moveTo(x * k, (y + 1) * k); ctx.lineTo((x + 1) * k, (y + 1) * k); }
      }
      ctx.stroke();
      ctx.font = `${k * .62}px sans-serif`;
      ctx.fillText(task.seeker || '🐭', (cur[0] + .5) * k, (cur[1] + .5) * k + Math.sin(t / 220) * 2);
      raf = requestAnimationFrame(draw);
    }
    const open = (x, y, d) => !cells[y][x][d];
    function bfs(from, to) {
      const q = [[from[0], from[1], []]], seen = new Set([from.join()]);
      while (q.length) {
        const [x, y, path] = q.shift();
        if (x === to[0] && y === to[1]) return path.concat([[x, y]]);
        if (path.length > 4) continue;
        for (const [d, [dx, dy]] of Object.entries(dirs)) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n || !open(x, y, d) || seen.has(nx + ',' + ny)) continue; seen.add(nx + ',' + ny); q.push([nx, ny, path.concat([[x, y]])]); }
      }
      return null;
    }
    function moveTo(cell) {
      if (solved || (cell[0] === cur[0] && cell[1] === cur[1])) return;
      const path = bfs(cur, cell); if (!path) return;
      path.slice(1).forEach(([x, y], i) => setTimeout(() => { if (stopped || solved) return; cur = [x, y]; trail.push([x, y]); api.tone(330 + (x + y) * 40, 90); if (x === n - 1 && y === n - 1) win(); }, i * 90));
    }
    function win() { solved = true; api.tone(784, 160); setTimeout(() => api.tone(1047, 240), 160); setTimeout(() => { if (!stopped) api.onSolved(); }, 700); }
    const cellAt = (e) => { const r = canvas.getBoundingClientRect(); return [Math.max(0, Math.min(n - 1, Math.floor((e.clientX - r.left) / r.width * n))), Math.max(0, Math.min(n - 1, Math.floor((e.clientY - r.top) / r.height * n)))]; };
    let down = false;
    canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); down = true; canvas.setPointerCapture?.(e.pointerId); moveTo(cellAt(e)); });
    canvas.addEventListener('pointermove', (e) => { if (down) moveTo(cellAt(e)); });
    ['pointerup', 'pointercancel'].forEach((t) => canvas.addEventListener(t, () => { down = false; }));
    const onKey = (e) => { const m = { ArrowUp: 'N', ArrowRight: 'E', ArrowDown: 'S', ArrowLeft: 'W' }[e.key]; if (!m || solved) return; e.preventDefault(); if (open(cur[0], cur[1], m)) moveTo([cur[0] + dirs[m][0], cur[1] + dirs[m][1]]); };
    window.addEventListener('keydown', onKey);
    size(); raf = requestAnimationFrame(draw);
    return { destroy() { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey); host.innerHTML = ''; } };
  }

  function startJigsaw(task, host, api) {
    const cols = task.cols || 2, rows = task.rows || 2, total = cols * rows;
    // l'image : un grand dessin sur un fond coloré
    const S = 360, pic = document.createElement('canvas'); pic.width = pic.height = S;
    const pc = pic.getContext('2d'), hues = [200, 150, 30, 330, 270], hue = pick(hues);
    const g = pc.createLinearGradient(0, 0, 0, S); g.addColorStop(0, `hsl(${hue},85%,82%)`); g.addColorStop(1, `hsl(${(hue + 40) % 360},80%,70%)`);
    pc.fillStyle = g; pc.fillRect(0, 0, S, S);
    pc.fillStyle = 'rgba(255,255,255,.55)'; [[70, 70, 46], [300, 60, 36], [60, 300, 30], [310, 300, 40]].forEach(([x, y, r]) => { pc.beginPath(); pc.arc(x, y, r, 0, 7); pc.fill(); });
    pc.font = `${S * .62}px sans-serif`; pc.textAlign = 'center'; pc.textBaseline = 'middle'; pc.fillText(task.emoji, S / 2, S / 2 + 8);
    const url = pic.toDataURL('image/png');
    let order = shuffle([...Array(total).keys()]);
    while (order.every((v, i) => v === i)) order = shuffle(order);
    const board = document.createElement('div'); board.className = 'jigsaw'; board.style.setProperty('--cols', cols); board.style.setProperty('--rows', rows);
    const model = document.createElement('div'); model.className = 'jigsaw-model'; model.style.backgroundImage = `url(${url})`;
    host.appendChild(model); host.appendChild(board);
    let selected = -1, solved = false, stopped = false;
    function render() {
      board.innerHTML = '';
      order.forEach((piece, slot) => {
        const t = document.createElement('button'); t.type = 'button'; t.className = 'jig-tile' + (slot === selected ? ' sel' : '');
        t.style.backgroundImage = `url(${url})`; t.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        t.style.backgroundPosition = `${cols > 1 ? (piece % cols) / (cols - 1) * 100 : 0}% ${rows > 1 ? Math.floor(piece / cols) / (rows - 1) * 100 : 0}%`;
        t.setAttribute('aria-label', 'Morceau de puzzle');
        t.addEventListener('click', () => tap(slot));
        board.appendChild(t);
      });
    }
    function tap(slot) {
      if (solved || stopped) return;
      api.tone(440 + slot * 60, 80);
      if (selected < 0) { selected = slot; render(); return; }
      if (selected !== slot) { [order[selected], order[slot]] = [order[slot], order[selected]]; api.tone(660, 90); }
      selected = -1; render();
      if (order.every((v, i) => v === i)) { solved = true; board.classList.add('done'); api.tone(784, 160); setTimeout(() => api.tone(1047, 260), 160); setTimeout(() => { if (!stopped) api.onSolved(); }, 900); }
    }
    render();
    return { destroy() { stopped = true; host.innerHTML = ''; } };
  }

  function startPairs(task, host, api) {
    const deck = shuffle([...task.cards, ...task.cards].map((e, i) => ({ e, id: i })));
    const grid = document.createElement('div'); grid.className = 'pairs-grid'; grid.style.setProperty('--n', deck.length <= 6 ? 3 : 4);
    host.appendChild(grid);
    let first = -1, lock = false, matched = 0, stopped = false;
    const tiles = deck.map((c, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pair-card'; b.setAttribute('aria-label', 'Carte retournée');
      b.innerHTML = `<span class="pc-back">⭐</span><span class="pc-face">${c.e}</span>`;
      b.addEventListener('click', () => flip(i)); grid.appendChild(b); return b;
    });
    function flip(i) {
      if (lock || stopped || tiles[i].classList.contains('up') || tiles[i].classList.contains('ok')) return;
      tiles[i].classList.add('up'); api.tone(500 + i * 25, 90);
      if (first < 0) { first = i; return; }
      const a = first; first = -1;
      if (deck[a].e === deck[i].e) {
        tiles[a].classList.replace('up', 'ok'); tiles[i].classList.replace('up', 'ok'); matched++; api.tone(784, 140);
        if (matched === task.cards.length) { api.tone(1047, 240); setTimeout(() => { if (!stopped) api.onSolved(); }, 800); }
      } else {
        lock = true; setTimeout(() => { if (stopped) return; tiles[a].classList.remove('up'); tiles[i].classList.remove('up'); lock = false; }, 950);
      }
    }
    return { destroy() { stopped = true; host.innerHTML = ''; } };
  }

  function startSimon(task, host, api) {
    const COLS = [['#ef4b43', 262], ['#3fa4ea', 330], ['#ffd23f', 392], ['#4cc36a', 523]];
    const seq = task.seq || Array.from({ length: task.length || 3 }, () => Math.floor(rand() * 4));
    const wrap = document.createElement('div'); wrap.className = 'simon';
    const status = document.createElement('div'); status.className = 'simon-status'; status.textContent = '👀';
    const pads = COLS.map(([color], i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'simon-pad'; b.style.setProperty('--c', color); b.setAttribute('aria-label', 'Couleur ' + (i + 1)); b.addEventListener('click', () => press(i)); return b; });
    const grid = document.createElement('div'); grid.className = 'simon-grid'; pads.forEach((p) => grid.appendChild(p));
    wrap.appendChild(status); wrap.appendChild(grid); host.appendChild(wrap);
    let input = false, pos = 0, stopped = false, timers = [];
    const later = (fn, ms) => { const t = setTimeout(() => { if (!stopped) fn(); }, ms); timers.push(t); };
    const flash = (i, ms = 480) => { pads[i].classList.add('lit'); api.tone(COLS[i][1], ms - 60); later(() => pads[i].classList.remove('lit'), ms - 80); };
    function play(first) {
      const d0 = first ? 3600 : 800;
      input = false; pos = 0; status.textContent = '👀'; wrap.classList.remove('listening');
      seq.forEach((c, i) => later(() => flash(c), d0 + i * 800));
      later(() => { input = true; status.textContent = '👆'; wrap.classList.add('listening'); }, d0 + seq.length * 800);
    }
    function press(i) {
      if (!input || stopped) return;
      flash(i, 380);
      if (i !== seq[pos]) { input = false; wrap.classList.add('oops'); status.textContent = '🙂'; later(() => { wrap.classList.remove('oops'); play(); }, 900); return; }   // pas de pénalité : on rejoue la séquence
      pos++;
      if (pos === seq.length) { input = false; status.textContent = '🌟'; later(() => { api.tone(784, 160); }, 450); later(() => api.tone(1047, 260), 620); later(() => api.onSolved(), 1300); }
    }
    MM.music && MM.music.setQuiet && MM.music.setQuiet(true);      // la musique de fond se tait presque : on entend mieux les notes
    play(true);
    return { replay() { timers.forEach(clearTimeout); timers = []; pads.forEach((p) => p.classList.remove('lit')); play(); }, destroy() { stopped = true; timers.forEach(clearTimeout); host.innerHTML = ''; MM.music && MM.music.setQuiet && MM.music.setQuiet(false); } };
  }
})();
