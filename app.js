(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const screens = [...document.querySelectorAll('.screen')];
  const canvas = $('#game-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const STORE = 'mini-mission-v1';
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const MM = window.MM;
  const LV = MM.level, SW = LV.swing, FX = MM.fx;
  const TURBO_SPEED = 520;
  const LETTER_COLORS = ['#ff6b6b', '#ffb02e', '#4cc36a', '#4aa3ff', '#a074ff', '#ff7ac8'];
  const WORLD_H = LV.H;
  const MOVES = { cellW: 617, cellH: 421, foot: 376, scale: .48, rows: { titan: 0, ziggy: 1, filou: 2 }, hands: { filou: [[421.8, 230.3], [380.4, 290.1], [313.3, 188.1], [307.8, 242.3]] } };
  // monstres : [hauteur dans le monde, largeur/hauteur, hauteur du sprite dans sa case] ; 0-4 méchants, 5-9 gentils
  const MON = [[66, 1.246, 252], [62, 1.044, 252], [72, 2.098, 183], [104, 1.111, 252], [104, .734, 252], [66, 1.056, 252], [62, 1.02, 252], [74, 1.032, 252], [104, 1.242, 252], [104, .841, 252]];
  const MON_CELL = { w: 400, h: 264, pad: 6 };
  const HIT_WINDOW = 14, HIT_MAX = 3;
  const MON_COLORS = ['#5fa8ee', '#ffd23f', '#ffb8d8', '#8c9a7a', '#6fbf6a'];
  const MON_TOTAL = 20;
  const theme = () => MM.cities[(mission && mission.city) || 0];
  const SHOT_SPEED = { ziggy: 560, filou: 500, titan: 470 };
  const COUNT_WORDS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
  const leafImg = new Image(); leafImg.src = 'assets/friend-leaf.webp';
  const monsterImg = new Image(); monsterImg.src = 'assets/monsters.webp';
  const movesImg = new Image(); movesImg.src = 'assets/hero-moves.webp';
  // Planche des héros : une ligne par héros (Ziggy, Filou, Titan), six poses chacune. Voir « Animation des héros ».
  const S2 = { img: new Image(), map: null };
  S2.img.src = 'assets/sprites2.webp';
  fetch('assets/sprites2.json').then(r => r.json()).then(j => { S2.map = j; }).catch(() => {});
  const s2ok = () => !!(S2.map && S2.img.complete && S2.img.naturalWidth);
  const HERO_K = .5, HERO_PX = 280;     // échelle d'affichage des planches animées (hauteur de référence 280 px)
  const heroAtlas = new Image();
  heroAtlas.src = 'assets/heroes-atlas.webp';
  const heroes = {
    ziggy: { name: 'Ziggy la Comète', power: 'Bond lumineux', suit: '#ef5a53', accent: '#ffd34f', skin: '#f3bf91', hair: '#6e483e', cape: '#f5a542', icon: '☄️', message: 'Ziggy a laissé un chemin de lumière pour les voisins.' },
    filou: { name: 'Filou le Tisseur', power: 'Fil doux et pont sûr', suit: '#438ccc', accent: '#a980e6', skin: '#eeb993', hair: '#463c59', cape: '#7561cf', icon: '🧶', message: 'Filou a tissé un passage tout doux pour les amis.' },
    titan: { name: 'Titan Puce', power: 'Force douce', suit: '#55b77b', accent: '#ffda56', skin: '#aa6844', hair: '#302b34', cape: '#f0c54f', icon: '🌿', message: 'Titan a aidé tout le monde avec sa grande force douce.' }
  };
  const missionTemplates = [
    { title: 'Le chaton dans l’arbre', place: 'Parc des Lucioles', icon: '🐱', friend: 'Mimi le chaton', outro: 'Mimi a retrouvé son panier bien douillet.', tasks: [
      { prompt: 'Pour aider Mimi à descendre, que peut-on préparer ?', options: [['🧺','Un panier doux'],['🎈','Un ballon'],['🪁','Un cerf-volant']], answer: 0 },
      { prompt: 'Quel chemin est le plus confortable pour Mimi ?', options: [['🪜','Une petite passerelle'],['🧊','Un chemin glacé'],['🌪️','Une grande tornade']], answer: 0 },
      { prompt: 'Où Mimi pourra-t-elle se reposer ?', options: [['🛏️','Un coussin moelleux'],['🚲','Un vélo'],['🛁','Une baignoire']], answer: 0 }
    ]},
    { title: 'Le jardin qui sourit', place: 'Jardin du quartier', icon: '🌱', friend: 'Les petites fleurs', outro: 'Le jardin a retrouvé ses jolies couleurs.', tasks: [
      { prompt: 'Qu’est-ce qu’on plante pour faire pousser des fleurs ?', options: [['🌰','Des graines'],['🧸','Un doudou'],['🪨','Des cailloux']], answer: 0 },
      { prompt: 'De quoi les jeunes pousses ont-elles besoin ?', options: [['💧','Un peu d’eau'],['🍬','Des bonbons'],['🧦','Des chaussettes']], answer: 0 },
      { prompt: 'Où les fleurs aiment-elles grandir ?', options: [['🪴','Dans la terre'],['🛋️','Sur un canapé'],['🧺','Dans un panier fermé']], answer: 0 }
    ]},
    { title: 'Le goûter du voisinage', place: 'Place des Maisons', icon: '🍐', friend: 'Les voisins du parc', outro: 'Tout le monde a trouvé une place au goûter.', tasks: [
      { prompt: 'Qu’apporte-t-on pour partager le goûter ?', options: [['🍎','Des fruits'],['🧱','Des briques'],['🧼','Du savon']], answer: 0 },
      { prompt: 'Que peut-on poser pour que chacun s’assoie ?', options: [['🧺','Une couverture'],['⛵','Un bateau'],['🪣','Un seau']], answer: 0 },
      { prompt: 'Comment inviter les voisins ?', options: [['💌','Une petite carte'],['🔒','Un cadenas'],['🎣','Une canne à pêche']], answer: 0 }
    ]},
    { title: 'La tortue cherche la mer', place: 'Sentier de la plage', icon: '🐢', friend: 'Toupie la tortue', outro: 'Toupie avance tranquillement vers les vagues.', tasks: [
      { prompt: 'Quel chemin aide Toupie à avancer sans danger ?', options: [['🐾','Le sentier doux'],['🚗','La route des voitures'],['🌵','Le chemin des cactus']], answer: 0 },
      { prompt: 'Que peut-on ramasser pour garder la plage propre ?', options: [['🧴','Une bouteille vide'],['🐚','Un coquillage vivant'],['🪸','Un morceau de corail']], answer: 0 },
      { prompt: 'Que fait-on quand Toupie arrive près de l’eau ?', options: [['🌊','On la laisse rejoindre la mer'],['🧱','On construit un mur'],['🧺','On la cache dans un panier']], answer: 0 }
    ]},
    { title: 'Le sentier du parc', place: 'Grand parc vert', icon: '🌳', friend: 'Les promeneurs', outro: 'Le chemin du parc est prêt pour tout le monde.', tasks: [
      { prompt: 'Une branche bloque le chemin. Que faire ?', options: [['🪵','La déplacer doucement'],['🔥','Y mettre le feu'],['🧗','Grimper dessus']], answer: 0 },
      { prompt: 'Quel panneau aide les familles à trouver le parc ?', options: [['🪧','Un panneau avec une flèche'],['🪞','Un miroir'],['🧸','Un ours en peluche']], answer: 0 },
      { prompt: 'Comment rendre le banc plus agréable ?', options: [['🧽','Le nettoyer doucement'],['🎨','Le cacher sous la peinture'],['🛞','Poser une roue dessus']], answer: 0 }
    ]}
  ];

  // 10 thèmes × 10 personnages × 10 formulations = 1 000 questions illustrées.
  const questionThemes = [
    {goal:'boire un peu d’eau',people:['le chaton','le petit chien','le lapin','le hérisson','l’écureuil','la tortue','le petit oiseau','la grand-mère du quartier','le jardinier','les fleurs du jardin'],answers:[['🥤','Un peu d’eau'],['🧸','Un doudou'],['🧹','Un balai']]},
    {goal:'se reposer tranquillement',people:['le chiot fatigué','le chaton','le petit lapin','la tortue','le hérisson','le bébé du voisin','la promeneuse','le grand-père','le petit oiseau','le jardinier'],answers:[['🛏️','Un coussin douillet'],['🚲','Un vélo'],['🔔','Une clochette']]},
    {goal:'rester bien au chaud',people:['le petit chien','le chaton','le hérisson','le lapin','la tortue','le bébé du voisin','la grand-mère','le promeneur','le petit oiseau','le jardinier'],answers:[['🧣','Une couverture chaude'],['🧊','Un glaçon'],['🪁','Un cerf-volant']]},
    {goal:'manger un goûter',people:['le petit chien','le chaton','le lapin','l’écureuil','le hérisson','la tortue','le petit oiseau','les enfants du parc','la promeneuse','le jardinier'],answers:[['🍎','Un fruit à partager'],['🧼','Du savon'],['🧱','Une brique']]},
    {goal:'retrouver son chemin',people:['le petit chien','le chaton','le lapin','la tortue','l’écureuil','le petit oiseau','la fillette du parc','le garçon du quartier','la grand-mère','le promeneur'],answers:[['🪧','Un panneau avec une flèche'],['🛁','Une baignoire'],['🧦','Une chaussette']]},
    {goal:'garder le parc propre',people:['les promeneurs','les enfants du parc','le jardinier','la grand-mère','le petit chien','le chaton','les familles','le cycliste','la tortue','les amis du quartier'],answers:[['🗑️','Mettre le papier à la poubelle'],['🌼','Cueillir les fleurs'],['🐚','Ramasser un coquillage vivant']]},
    {goal:'passer sur un chemin sans danger',people:['la promeneuse','le grand-père','le petit chien','le chaton','la tortue','les enfants du parc','le cycliste','la grand-mère','le jardinier','le lapin'],answers:[['🪵','Déplacer la branche avec un adulte'],['🔥','Mettre le feu à la branche'],['🧱','Construire un mur']]},
    {goal:'se protéger du grand soleil',people:['le petit chien','le chaton','le lapin','la tortue','le petit oiseau','les enfants du parc','la grand-mère','le promeneur','le jardinier','les fleurs du jardin'],answers:[['🌳','Se mettre à l’ombre'],['🔥','S’approcher du feu'],['🧣','Mettre une grosse écharpe']]},
    {goal:'retrouver son jouet',people:['le petit chien','le chaton','le lapin','l’écureuil','le hérisson','la fillette du parc','le garçon du quartier','la tortue','le petit oiseau','le bébé du voisin'],answers:[['🔎','Chercher doucement ensemble'],['🗑️','Le jeter à la poubelle'],['🔒','Fermer la porte à clé']]},
    {goal:'faire pousser de jolies fleurs',people:['les graines du jardin','les petites fleurs','le jardinier','les jeunes pousses','la plante du parc','les fleurs du quartier','le papillon du jardin','les enfants jardiniers','le rosier du voisin','le petit arbre'],answers:[['🌱','De la terre et un peu d’eau'],['🍬','Des bonbons'],['🧸','Un ours en peluche']]}
  ];
  const questionPatterns = [
    'Que choisir pour aider {person} à {goal} ?',
    'Quelle idée aiderait {person} à {goal} ?',
    'Pour aider {person} à {goal}, quelle est la bonne idée ?',
    '{person} a besoin d’aide pour {goal}. Que peut faire le héros ?',
    'Quelle aide convient le mieux à {person} pour {goal} ?',
    'Comment aider {person} à {goal} ?',
    'Parmi ces idées, laquelle aide {person} à {goal} ?',
    'Le héros cherche une idée pour aider {person} à {goal}. Laquelle choisit-il ?',
    'Que choisit le héros pour aider {person} à {goal} ?',
    'Quelle action convient pour aider {person} à {goal} ?'
  ];
  const questionBank = questionThemes.flatMap((theme,themeIndex)=>theme.people.flatMap((person,personIndex)=>questionPatterns.map((pattern,patternIndex)=>({
    id:`q-${themeIndex}-${personIndex}-${patternIndex}`,
    prompt:(t=>t.charAt(0).toUpperCase()+t.slice(1))(pattern.replace('{person}',person).replace('{goal}',theme.goal)),
    options:theme.answers.map(option=>[...option]), answer:0, icon:['💧','☁️','🧣','🍎','🪧','🌳','🪵','🌞','🧸','🌱'][themeIndex]
  }))));
  const praisePhrases = [
    'Bravo, tu as trouvé une belle idée !','Oui, c’est exactement ce qu’il fallait !','Super coup de main, petit héros !','Quelle bonne réponse !','Tu as très bien réfléchi !','Bien joué, tu aides tout le monde !','Ton idée fait plaisir !','Oui, tu as trouvé !','Quel beau geste !','Tu peux être fier de toi !',
    'Tu as choisi la bonne aide !','Génial, on peut continuer !','Tu as un grand cœur !','C’est une réponse formidable !','Merci pour ton aide !','Tu as trouvé tout seul, bravo !','Cette idée va beaucoup aider !','Tu es un vrai champion de l’entraide !','Quelle belle équipe !','Tu as très bien écouté !',
    'Bravo, tu as pris soin de ton ami !','Oui, c’est la bonne solution !','Une étoile pour cette belle idée !','Tu as fait le bon choix !','Ton héros est fier de toi !','Tu sais vraiment aider les autres !','C’est une super idée de héros !','Bravo, mission réussie !','Tu as vu juste !','Merci, petit héros !'
  ];
  const retryPhrases = [
    'Pas tout à fait. On regarde ensemble.','Ce n’est pas grave, essayons encore.','Presque ! Écoutons bien les choix.','On peut chercher une autre idée.','Essaie encore, je t’accompagne.','Regardons les images une nouvelle fois.','Ce choix n’aide pas encore notre ami.','On recommence tranquillement.','Pas de souci, tu peux réessayer.','Prenons le temps de réfléchir.',
    'Il y a une meilleure idée. À toi de la trouver !','On va trouver ensemble.','Ce n’est pas la bonne réponse cette fois.','Regarde bien les grands dessins.','Tu peux changer de réponse.','On essaie encore doucement.','L’ami a besoin d’une autre aide.','Écoute encore les réponses.','Pas grave, chaque héros peut réessayer.','On cherche une idée qui aide vraiment.',
    'Tu apprends en essayant. À nouveau !','Regardons ce dont notre ami a besoin.','Essaie une autre image.','On peut faire une nouvelle tentative.','Tu es tout près de la bonne idée.','Choisis encore, sans te presser.','Le héros peut réfléchir encore un peu.','Cette idée ne convient pas. On continue !','Réessayons tous les deux.','Une autre réponse pourrait mieux aider.',
    'Pas de souci, il reste deux idées.','Observe les symboles et recommence.','Tu as le droit de changer d’avis.','On écoute la question une fois de plus.','Cherchons une réponse douce et utile.','Cette fois, choisissons autre chose.','Le bon choix est juste là.','Tu peux prendre ton temps.','Essayons avec une autre image.','Chaque essai nous rapproche de l’aide.',
    'On y est presque. Réessaie !','Pas grave, le héros ne se décourage pas.','Quel choix aiderait le plus notre ami ?','Regarde encore les trois réponses.','On va trouver la bonne solution.','Réessaie, je reste avec toi.','Tu peux écouter les réponses à nouveau.','Ce n’est pas encore ça, mais tu peux continuer.','Une autre idée fera davantage plaisir.','On essaie encore, tout doucement.'
  ];

  let save = readSave();
  let activeHero = null;
  let mission = null;
  let scene = 'home';
  let puzzleTask = null;
  let puzzleWrong = 0;
  let puzzleResolved = false;
  let speechToken = 0;
  let lastTime = 0;
  let sessionElapsed = Number(save.sessionElapsed)||0;
  let sessionTimerLimit = Number(save.sessionTimerLimit)||0;
  let sessionActive = save.sessionActive===true;
  let stopAfterMission = save.stopAfterMission===true;
  let timerWarningSent = save.timerWarningSent===true;
  let timerAnnouncementPending = save.timerAnnouncementPending===true;
  let timerNoticePlaying = false;
  let lastActiveTick = 0;
  let lastClockSave = 0;
  let pausedFrom = 'game-screen';
  let toastTimer = 0;
  let rafId = 0;
  let puzzleStation = null;
  let dpadPointer = null;
  const dpadState = { left:false, right:false, up:false, down:false };
  let heroAnim = newHeroAnim();
  let audio = null;
  let audioEnabled = save.audioEnabled !== false;
  let effectsEnabled = save.effectsEnabled !== false;
  let keys = { left: false, right: false, jump: false, down: false };
  let jumpBuffer = 0;
  let rewardAdvance = null;
  let gt = 0;                 // temps de jeu en secondes (figé pendant la pause)
  let swing = null;           // toile en cours (Filou)
  let fizzle = null;          // toile lancée dans le vide
  let turboUntil = 0, turboReady = 0, punchReady = 0, coyote = 0;
  let lastDustAt = 0, lastBonkAt = 0, lastStreakAt = 0, abilityReadyShown = true;
  let musicEnabled = save.musicEnabled !== false;
  let hapticsEnabled = save.hapticsEnabled !== false;
  MM.setHaptics(hapticsEnabled);
  let shots = [], fireballs = [], tornados = [], hitTimes = [], rewindAt = 0, litShown = -1;
  let airTurnUntil = 0, shootReady = 0, flipUntil = 0, flipDir = 1, hurtUntil = 0;
  let gameCtl = null;
  let view = { scale: 1, ox: 0, oy: 0, w: 960, h: 540 };
  let world = { passPts: [200], passX: 200, width: 6200, floor: 426, camera: 0, checkpoint: 60, stations: [], gaps: [], bumps: [], platforms: [], coins: [], letters: [], enemies: [], bigFriends: [] };
  let player = { x: 70, y: 0, vx: 0, vy: 0, w: 58, h: 86, grounded: true, jumping: false, facing: 1, bob: 0 };
  let lastPromptStation = -1, lastFinished = null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function readSave() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
  }
  function writeSave() { try { localStorage.setItem(STORE, JSON.stringify(save)); } catch {} }
  function dayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function todaysMission(heroId, index = 0) {
    const template = missionTemplates[Math.floor(Math.random()*missionTemplates.length)];
    // chaque caisse ouvre une énigme ou un mini-jeu différent (labyrinthe, puzzle, jeu de mémoire…)
    const legacy = () => { const task = pickQuestions(1)[0]; const order = shuffle([0,1,2]); return { ...task, options: order.map(i => task.options[i]), answer: order.indexOf(task.answer) }; };
    const tasks = MM.games.makeTasks(legacy, index);
    return { ...template, title:'Les petits coups de main', friend:'les amis du quartier', outro:'Les amis du quartier ont reçu de jolis coups de main.', tasks, seed: Math.floor(Math.random()*4294967294)+1, palette:['#fff2bb','#ffc96b','#e28a6e'] };
  }
  function shuffle(list) { const a = list.slice(); for (let i=a.length-1;i>0;i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
  const cap = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  // Trois questions de trois thèmes différents, en évitant celles vues récemment.
  function pickQuestions(count) {
    const recent = new Set(save.recentQuestions || []);
    const chosen = shuffle([...questionThemes.keys()]).slice(0, count).map(themeIndex => {
      const pool = questionBank.filter(q => q.id.startsWith(`q-${themeIndex}-`));
      const fresh = pool.filter(q => !recent.has(q.id));
      const list = fresh.length ? fresh : pool;
      return list[Math.floor(Math.random()*list.length)];
    });
    save.recentQuestions = [...(save.recentQuestions || []), ...chosen.map(q => q.id)].slice(-150);
    return chosen;
  }
  const missionTitles = { ziggy:'La piste des étoiles', filou:'Le grand pont de Filou', titan:'Le parcours des gros blocs' };
  const missionPalettes = { ziggy:['#b9edff','#66bd82','#ffd68a'], filou:['#c9f2ff','#65b9a4','#a8a3ef'], titan:['#bce9f7','#58a96f','#f2c76d'] };
  function createMission(heroId, index = 0) {
    const created = todaysMission(heroId, index), city = MM.cities[index] || MM.cities[0];
    created.tier = readLevel(heroId, index).tier || 0; created.title = `${city.flag} ${city.name}${created.tier ? ' ' + swords(created.tier) : ''}`; created.city = index; created.level = { hero: heroId, index };
    created.seed = hash(`${heroId}-${index}-v5`) || 1;      // la ville est toujours la même : on peut la rejouer pour trouver ce qui manque
    created.palette = [city.sky[0], city.grass, city.sky[1]]; created.levelVersion = 6; return created;
  }
  /* ----- progression par ville : 10 niveaux par héros, le suivant s'ouvre quand on arrive au bout ----- */
  const swords = (n) => n <= 5 ? '⚔️'.repeat(n) : '⚔️×' + n;
  const BLANK_LEVEL = { tier: 0, done: false, stars: [], letters: [], monsters: [], q: 0, silver: false, gold: false, mon: false, tot: null };
  function readLevel(hero, i) { return (save.levels && save.levels[hero] && save.levels[hero][i]) || BLANK_LEVEL; }
  function levelEntry(hero, i) { save.levels = save.levels || {}; const arr = save.levels[hero] = save.levels[hero] || []; return arr[i] = arr[i] || { ...BLANK_LEVEL, stars: [], letters: [], monsters: [] }; }
  // tout a été attrapé : la ville peut être refaite avec une difficulté de plus (mêmes autocollants à regagner)
  function levelComplete(L) { const t = L.tot; return !!(t && L.stars.length >= t.s && L.letters.length >= t.l && L.monsters.length >= t.m && L.q >= t.q && L.silver && L.gold && L.mon); }
  const levelUnlocked = (hero, i) => i === 0 || readLevel(hero, i - 1).done;
  function commitProgress(done) {
    if (!mission || !mission.level || !Array.isArray(mission.coins)) return;
    const L = levelEntry(mission.level.hero, mission.level.index);
    L.stars = mission.coins.filter(c => c.collected).map(c => c.id);
    L.letters = mission.letters.filter(l => l.collected).map(l => l.letter);
    L.monsters = (mission.monsters || []).filter(m => m.friendly).map(m => m.id);
    L.q = Math.max(L.q || 0, (mission.stationsDone || []).filter(Boolean).length);
    L.silver = !!(L.silver || mission.silverGiven); L.gold = !!(L.gold || mission.goldGiven); L.mon = !!(L.mon || mission.monGiven);
    L.tot = { s: mission.coins.length, l: mission.letters.length, m: MON_TOTAL, q: 3 };
    if (done) L.done = true;
    writeSave();
  }
  let levelHero = 'ziggy';
  function openLevels(heroId) {
    levelHero = heroId; const h = heroes[heroId], row = HERO_ROW[heroId] ?? 0;
    $('#level-hero').innerHTML = `<span class="sprite" style="--col:${heroId === 'ziggy' ? 0 : 2};--row:${row}"></span>`;
    $('#level-title').textContent = h.name;
    renderLevels(); setScreen('level-screen');
    if (!timerNoticePlaying) sayText('Choisis une ville !');
  }
  function renderLevels() {
    const grid = $('#level-grid');
    grid.innerHTML = MM.cities.map((c, i) => {
      const L = readLevel(levelHero, i), open = levelUnlocked(levelHero, i), t = L.tot;
      let inner;
      if (!open) inner = '<span class="lv-lock" aria-hidden="true">🔒</span>';
      else if (!t) inner = '<span class="lv-new">NOUVEAU</span>';
      else {
        const chip = (icon, a, b) => `<span class="lv-chip ${a >= b ? 'full' : ''}"><i style="--p:${b ? a / b : 0}"></i>${icon} ${a}/${b}</span>`;
        inner = `<div class="lv-chips">${chip('⭐', L.stars.length, t.s)}${chip('🔤', L.letters.length, t.l)}${chip('👾', L.monsters.length, t.m)}${chip('❓', L.q, t.q)}</div><div class="lv-chips"><span class="lv-chip ${L.silver ? 'med' : ''}" style="opacity:${L.silver ? 1 : .55}">🥈${L.silver ? '✓' : ''}</span><span class="lv-chip ${L.gold ? 'med' : ''}" style="opacity:${L.gold ? 1 : .55}">🥇${L.gold ? '✓' : ''}</span></div>`;
      }
      const tierBadge = (L.tier ? `<span class="lv-tier" aria-label="Difficulté ${L.tier}">${swords(L.tier)}</span>` : '') + (levelComplete(L) ? '<span class="lv-again" aria-label="Refaire plus difficile">↻⚔️</span>' : '');
      const rem = t ? ` Il reste ${t.s - L.stars.length} étoiles, ${t.l - L.letters.length} lettres, ${t.m - L.monsters.length} monstres.` : '';
      return `<button type="button" role="listitem" class="level-card ${open ? '' : 'locked'} ${L.done ? 'done' : ''} ${L.tier ? 'hard' : ''}" data-i="${i}" style="--a:${c.sky[0]};--b:${c.sky[1]};--g:${c.grass}" aria-label="Niveau ${i + 1} : ${escapeHtml(c.name)}${open ? '' : ', verrouillé'}.${rem}"><span class="lv-num">${i + 1}</span><span class="lv-flag">${c.flag}</span><span class="lv-icon">${c.icon}</span><b class="lv-name">${escapeHtml(c.name)}</b>${inner}${tierBadge}</button>`;
    }).join('');
  }
  function pickLevel(i) {
    const card = $(`#level-grid .level-card[data-i="${i}"]`);
    if (!levelUnlocked(levelHero, i)) { if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); } MM.haptic('oops'); showToast('Termine la ville d’avant !'); sayText('Termine d’abord la ville d’avant !'); return; }
    startLevel(levelHero, i);
  }
  function safeGroundX(x) {
    x = Math.max(70, Number(x) || 70);
    for (let k = 0; k < 6; k++) {
      let moved = false;
      for (const g of world.gaps || []) if (x + 58 > g.x - 20 && x < g.x + g.w + 20) { x = g.x - 120; moved = true; }
      for (const b of world.bumps || []) if (x + 58 > b.x - 24 && x < b.x + b.w + 24) { x = b.x - 110; moved = true; }
      if (!moved) break;
    }
    return Math.max(70, Math.min(x, (world.width || 9300) - 260));
  }
  function hash(value) { let h = 2166136261; for (let i=0;i<value.length;i++) { h ^= value.charCodeAt(i); h = Math.imul(h,16777619); } return h >>> 0; }
  function seeded(seed) { let s = seed || 1; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function setScreen(id) { if(id!=='puzzle-screen')cancelSpeech(); if(id!=='game-screen'){$('#toast')?.classList.remove('show');$('#award-banner')?.classList.remove('show');} screens.forEach(s => s.classList.toggle('active', s.id === id)); scene = id; if (id !== 'game-screen') releaseControls(); if (!['game-screen','puzzle-screen'].includes(id)) lastActiveTick=performance.now(); if (id === 'game-screen') resizeCanvas(); updateMusic(); }
  // la musique accompagne la partie ; elle se met en pause avec le jeu
  function updateMusic() {
    const should = audioEnabled && musicEnabled && !document.hidden && (scene === 'game-screen' || scene === 'puzzle-screen');
    if (should) MM.music.play('assets/music.mp3'); else MM.music.stop();
  }
  function startToday() {
    if (save.activeHero && save.activeMission) { activeHero = save.activeHero; mission = save.activeMission; beginGame(true); return; }
    if(sessionActive&&stopAfterMission){endSession();showToast('Le héros va se reposer maintenant.');sayText('Le héros va se reposer maintenant.');return;}
    $('#session-timer-row').classList.toggle('hidden',sessionActive);
    setScreen('hero-select');
  }
  function chooseHero(heroId) { if (!heroes[heroId]) return; openLevels(heroId); }
  function showTierSplash(tier) {
    const node = $('#tier-splash'); if (!node) return;
    node.querySelector('.ts-swords').textContent = swords(tier);
    node.querySelector('.ts-text').textContent = 'Plus difficile !';
    node.classList.remove('show'); void node.offsetWidth; node.classList.add('show');
    clearTimeout(showTierSplash.t); showTierSplash.t = setTimeout(() => node.classList.remove('show'), 3200);
    sound('turbo'); MM.haptic('gold');
    if (!timerNoticePlaying) sayText(`Niveau de difficulté ${COUNT_WORDS[Math.min(tier, 20)] || tier} ! Les monstres sont plus costauds.`);
  }
  function startLevel(heroId, index) {
    if(!sessionActive){sessionActive=true;sessionElapsed=0;sessionTimerLimit=Number($('#session-timer-select').value)||0;stopAfterMission=false;timerWarningSent=false;timerAnnouncementPending=false;save.sessionActive=true;save.sessionElapsed=0;save.sessionTimerLimit=sessionTimerLimit;save.stopAfterMission=false;save.timerWarningSent=false;}$('#session-timer-row').classList.toggle('hidden',sessionActive);
    activeHero = heroId;
    if (levelComplete(readLevel(heroId, index))) {
      const E = levelEntry(heroId, index); E.tier = (E.tier || 0) + 1;
      E.stars = []; E.letters = []; E.monsters = []; E.q = 0; E.silver = E.gold = E.mon = false; writeSave();
    }
    mission = createMission(heroId, index);
    save.missionNumber=(Number(save.missionNumber)||0)+1;save.activeDate = dayKey(); save.activeHero = heroId; save.activeMission = mission; save.progress = 0; writeSave();
    beginGame(false);
    const c = MM.cities[index];
    if (mission.tier) showTierSplash(mission.tier); else if (c && !timerNoticePlaying) sayText(c.say);
  }
  function beginGame(resume) {
    if (!mission || !activeHero) return;
    // missions sauvegardées avant les nouveaux niveaux : on repart sur une mission neuve
    if (mission.levelVersion !== 6) { mission = createMission(activeHero); save.activeMission = mission; save.progress = 0; resume = false; }
    if (!Array.isArray(mission.stationsDone)) mission.stationsDone = [false, false, false];
    save.progress = mission.stationsDone.filter(Boolean).length;
    $('#mission-title').textContent = mission.title;
    if (mission.city == null) { mission.city = 0; mission.level = { hero: activeHero, index: 0 }; }
    $('#progress-dots').innerHTML = mission.tasks.map((_,i)=>`<span class="progress-dot ${mission.stationsDone[i] ? 'done' : ''}"></span>`).join('');
    const rnd = seeded(mission.seed);
    const level = LV.build(activeHero, seeded(mission.seed));
    world.width = level.width; world.floor = level.floor; world.camera = 0; world.checkpoint = 60;
    world.gaps = level.gaps; world.platforms = level.platforms; world.anchors = level.anchors; world.pads = [];
    const broken = new Set(mission.brokenBumps || []), damage = mission.damage || {};
    world.bumps = level.bumps.filter(b => !broken.has(b.id)).map(b => ({ ...b, hp: Math.max(1, b.maxHp - (damage[b.id] || 0)), hit: -9 }));
    world.stations = level.stations.map((x, i) => ({ x, y: world.floor - 190, i, done: mission.stationsDone[i] === true, hit: false, bob: rnd()*6 }));
    world.decorations = Array.from({ length: 56 }, (_, i) => ({ x: 210 + i * 196, kind: i % 5, flower: i % 4 }));
    if (!Array.isArray(mission.coins)) mission.coins = level.stars.map((s, i) => ({ id: `s${i}`, x: s.x, y: s.y, collected: false, bob: rnd()*6 }));
    if (!Array.isArray(mission.letters)) mission.letters = level.letterSpots.map((spot, i) => ({ letter: ALPHABET[i], x: spot.x, y: spot.y, diff: spot.diff, collected: false, bob: rnd()*6 }));
    world.coins = mission.coins; world.letters = mission.letters;
    world.hintAnchor = null;
    initMonsters(level, rnd);
    if (!mission.priorApplied && mission.level) {       // ce qui a déjà été réussi dans cette ville est conservé
      mission.priorApplied = true; const L = readLevel(mission.level.hero, mission.level.index);
      mission.coins.forEach(c => { if (L.stars.includes(c.id)) c.collected = true; });
      mission.letters.forEach(l => { if (L.letters.includes(l.letter)) l.collected = true; });
      let o = 0; mission.monsters.forEach(m => { if (L.monsters.includes(m.id)) { m.friendly = true; m.prev = true; m.order = ++o; } });
      mission.silverGiven = !!L.silver; mission.goldGiven = !!L.gold; mission.monGiven = !!L.mon;
    }
    updateStarCounter(); updateFriendCounter(); updateLetterCounter();
    $('#home-hint').classList.toggle('hidden', !world.stations.every(station => station.done));
    player = { x: 70, y: world.floor - 86, vx: 0, vy: 0, w: 58, h: 86, grounded: true, jumping: false, facing: 1, bob: 0, carryVx: 0 };
    player.x = safeGroundX(resume ? (mission.checkpointX || 200) : 200);
    world.checkpoint = player.x;
    world.passPts = [200, ...level.stations.map(x => x - 330)]; world.passX = Math.max(...world.passPts.filter(cp => cp <= player.x + 1));
    mission.monsters.forEach(m => { if (m.friendly && !m.prev) { m.x = player.x; m.y = player.y + player.h; } });
    shots = []; fireballs = []; tornados = []; hitTimes = []; rewindAt = 0; litShown = -1; shootReady = 0; flipUntil = 0; hurtUntil = 0;
    swing = null; fizzle = null; turboUntil = 0; turboReady = 0; punchReady = 0; coyote = 0; gt = 0; jumpBuffer = 0;
    FX.clear(); heroAnim = newHeroAnim(); lastPromptStation = -1;
    lastActiveTick = performance.now(); lastTime = performance.now();
    const power = { ziggy: ['☄️', 'TURBO', 'Action : turbo, très rapide'], filou: ['🕸️', 'TOILE', 'Action : lancer la toile et se balancer'], titan: ['👊', 'POING', 'Action : gros coup de poing'] }[activeHero];
    $('#attack-button .action-power').textContent = power[0]; $('#attack-button small').textContent = power[1]; $('#attack-button').setAttribute('aria-label', power[2]);
    $('#attack-button').classList.remove('cooldown', 'active'); abilityReadyShown = true;
    const shootInfo = { ziggy: ['🔥', 'Boule de feu'], filou: ['🕸️', 'Toile magique'], titan: ['👊', 'Poing projeté'] }[activeHero];
    $('#shoot-button .shoot-icon').textContent = shootInfo[0]; $('#shoot-button').setAttribute('aria-label', 'Tirer : ' + shootInfo[1]); $('#shoot-button').dataset.hero = activeHero;
    setScreen('game-screen'); startLoop();
    if (resume && timerAnnouncementPending) speakTimerNotice();
    if (!resume) sound('start');
  }
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width*dpr); canvas.height = Math.round(rect.height*dpr);
    // Le monde fait 540 unités de haut. Sur un écran étroit (téléphone en portrait) on garde au moins 520 unités de large
    // et le décor se prolonge simplement vers le haut : le jeu remplit toujours tout l'espace disponible.
    view.scale = Math.min(canvas.height/WORLD_H, canvas.width/520);
    view.w = canvas.width/view.scale; view.h = canvas.height/view.scale;
    view.ox = 0; view.oy = (view.h-WORLD_H)*view.scale;
  }
  // Une seule boucle à la fois, même après une pause/reprise très rapide.
  function startLoop() { lastTime = performance.now(); if (!rafId) rafId = requestAnimationFrame(loop); }
  function loop(now) {
    rafId = 0;
    if (scene !== 'game-screen') return;
    const dt = Math.min(.033,Math.max(0,(now-lastTime)/1000)); lastTime=now;
    update(dt); draw(now/1000);
    if (scene === 'game-screen') rafId = requestAnimationFrame(loop);
  }
  function tickMissionClock(){const now=performance.now();if(!mission||!sessionActive||!['game-screen','puzzle-screen'].includes(scene)){lastActiveTick=now;return;}if(!lastActiveTick){lastActiveTick=now;return;}sessionElapsed+=Math.min(1,Math.max(0,(now-lastActiveTick)/1000));lastActiveTick=now;save.sessionElapsed=sessionElapsed;if(sessionTimerLimit>0&&!timerWarningSent&&sessionElapsed>=sessionTimerLimit){timerWarningSent=true;stopAfterMission=true;timerAnnouncementPending=true;save.timerWarningSent=true;save.stopAfterMission=true;save.timerAnnouncementPending=true;writeSave();if(scene!=='puzzle-screen'||!window.speechSynthesis?.speaking)speakTimerNotice();}if(now-lastClockSave>3000){lastClockSave=now;writeSave();}}
  function update(dt) {
    gt += dt;
    const hero = activeHero;
    const move = (keys.right?1:0) - (keys.left?1:0);
    if (gt < turboUntil && move && move !== player.facing) turboUntil = 0;   // changer de direction arrête le turbo
    const turboOn = gt < turboUntil;
    if (move && !swing) player.facing = move;
    const speed = hero === 'ziggy' ? 270 : 235;
    if (swing) player.vx = 0;
    else if (!player.grounded && player.carryVx) {
      // demi-tour immédiat en l'air après un balancement si le joueur le demande
      if (move && Math.sign(move) !== Math.sign(player.carryVx) && gt < airTurnUntil) {
        player.carryVx = move * Math.max(260, Math.abs(player.carryVx) * .85); player.facing = move; airTurnUntil = 0; flipUntil = gt + .5; flipDir = move; player.vy = Math.min(player.vy, 40);
        FX.ring(player.x + player.w / 2, player.y + 30, '#e7d8ff', 46, .3, 4); FX.sparkle(player.x + player.w / 2, player.y + 30, 8, ['#ffffff', '#d8c8ff'], 150); MM.haptic('good');
      }
      player.vx = player.carryVx + move * 90; player.facing = player.vx >= 0 ? 1 : -1;
    }
    else player.vx = turboOn ? player.facing * TURBO_SPEED : move * speed;
    updateHeroAnimation(dt);
    updateAbilityButton();
    // saut : l'appui est mémorisé un instant, et on peut sauter juste après avoir quitté le sol
    if (keys.jump) { jumpBuffer = .14; keys.jump = false; }
    coyote = player.grounded ? .09 : Math.max(0, coyote - dt);
    if (jumpBuffer > 0) {
      jumpBuffer -= dt;
      if (swing) { releaseSwing(true, true); jumpBuffer = 0; }
      else if (player.grounded || coyote > 0) { doJump(turboOn); jumpBuffer = 0; coyote = 0; }
    }
    if (swing) updateSwing(dt);
    else if (moveAndCollide(dt, turboOn)) return;
    if (player.y > 650) respawn(fallSpot());
    // la maison au bout du chemin termine la mission, qu'on ait ouvert toutes les caisses ou non
    if (player.x + player.w >= world.width - 150 && player.grounded && !swing) { finishMission(); return; }
    // plaques de vitesse (Ziggy)
    if (rewindAt && gt >= rewindAt) { rewindAt = 0; hitTimes = []; updateHitMeter(); respawn(world.passX); }
    updateFollowers(dt); updateMonsters(dt); updateShots(dt); updateHitMeter();
    for (const cp of world.passPts) if (player.grounded && player.x > cp) world.passX = Math.max(world.passX, cp);
    collectPickups();
    // effets de course
    const onGround = player.grounded && !swing;
    if (onGround && Math.abs(player.vx) > 200 && gt - lastDustAt > .11) { lastDustAt = gt; FX.dust(player.x + player.w/2 - player.facing*14, player.y + player.h, player.facing, 2); }
    if (gt < turboUntil && gt - lastStreakAt > .035) { lastStreakAt = gt; FX.streak(player.x + player.w/2, player.y + player.h/2, player.facing); if (Math.random() < .5) FX.dots(player.x + player.w/2 - player.facing*20, player.y + player.h/2 + 10, 1, ['#fff3a0', '#ffb0d0', '#a8e8ff'], 60); }
    if (swing && Math.random() < .6) { const h = SW.hand(swing); FX.glitter(h.x + (swing.ax - h.x) * Math.random(), h.y + (swing.ay - h.y) * Math.random()); }
    if (fizzle) { fizzle.t += dt; if (fizzle.t > .35) fizzle = null; }
    world.hintAnchor = hero === 'filou' && !swing ? findAnchor() : null;
    world.camera = Math.max(0, Math.min(world.width - view.w, player.x - view.w*.34));
    player.bob += dt*(Math.abs(player.vx) > .1 ? 12 : 3);
    FX.update(dt);
  }
  function draw(time) {
    ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle = '#93ddf5'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sh = FX.shakeOffset();
    ctx.setTransform(view.scale, 0, 0, view.scale, view.ox + sh.x*view.scale, view.oy + sh.y*view.scale);
    drawSky(time);
    ctx.save(); ctx.translate(0, world.floor - 426); drawHills(); drawTown(time); ctx.restore();   // décors lointains posés sur l'horizon
    drawWorld(time); drawPlayer(time); drawShots(time); FX.draw(ctx, world.camera); drawAmbient(time);
  }
  function drawSky(time){const W=view.w,p=mission?.palette||[],extra=Math.max(0,view.h-WORLD_H);const g=ctx.createLinearGradient(0,0,0,WORLD_H);g.addColorStop(0,p[0]||'#70d0f4');g.addColorStop(.67,p[2]||'#c8f1fa');g.addColorStop(1,'#e8f9e9');ctx.fillStyle=g;ctx.fillRect(0,-extra-2,W,extra+WORLD_H+4);for(let i=0;i<Math.ceil(W/260)+2;i++){const x=((i*260-world.camera*.16+time*3)%(W+260))-130,y=55+(i%3)*48;cloud(x,y,1+(i%2)*.18);}if(extra>40)for(let i=0;i<Math.ceil(W/300)+2;i++){const x=((i*300-world.camera*.1+time*2)%(W+300))-150,y=-extra*(.2+(i%3)*.25);cloud(x,y,1.1+(i%2)*.25);}}
  function cloud(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.ellipse(0,12,49,18,0,0,Math.PI*2);ctx.ellipse(-23,2,24,20,0,0,Math.PI*2);ctx.ellipse(0,-5,28,27,0,0,Math.PI*2);ctx.ellipse(26,4,24,19,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawHills(){const W=view.w,TH=theme();if(TH.far)MM.farDraw[TH.far](ctx,W,372,world.camera,TH.far==='fuji'?'#a9a4d0':TH.far==='dunes'?TH.dirt:TH.hill[1]);ctx.fillStyle=TH.hill[0];ctx.beginPath();ctx.moveTo(0,355);for(let x=0;x<=W;x+=5){ctx.lineTo(x,350+28*Math.sin((x+world.camera*.18)/160)+16*Math.sin(x/63));}ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();ctx.fillStyle=TH.hill[1];ctx.beginPath();ctx.moveTo(0,395);for(let x=0;x<=W;x+=5)ctx.lineTo(x,390+22*Math.sin((x+world.camera*.31)/125));ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();}
  function drawTown(time) {
    const W = view.w, cam = world.camera;
    if (activeHero === 'filou') {
      // la ville : deux rangées d'immeubles qui défilent à des vitesses différentes
      const TW = theme().towers, layers = [{ k: .2, base: 392, col: TW[0], win: TW[1], min: 150, max: 330, step: 118 }, { k: .4, base: 400, col: TW[2], win: TW[3], min: 120, max: 260, step: 140 }];
      layers.forEach((L, li) => {
        const i0 = Math.floor(cam * L.k / L.step) - 1;
        for (let i = i0; i < i0 + Math.ceil(W / L.step) + 3; i++) {
          const hv = hash(`${li}-${i}`), w = L.step - 18 + (hv % 14), h = L.min + (hv >>> 4) % (L.max - L.min), x = i * L.step - cam * L.k;
          ctx.fillStyle = L.col; roundRect(x, L.base - h, w, h + 40, 6, true);
          ctx.fillStyle = L.win;
          for (let r = 0; r < h / 34 - 1; r++) for (let c = 0; c < w / 28 - 1; c++) if ((hv >>> (r + c)) % 3) ctx.fillRect(x + 12 + c * 26, L.base - h + 14 + r * 30, 12, 16);
          if (hv % 4 === 0) { ctx.fillStyle = L.col; ctx.fillRect(x + w / 2 - 2, L.base - h - 26, 4, 28); }
        }
      });
      drawLandmark();
      return;
    }
    drawLandmark();
    const TH = theme();
    for (let i = 0; i < Math.ceil(W/430)+3; i++) {
      const wx = i*430 + 80, x = wx - cam*.48; if (x < -130 || x > W+130) continue;
      drawHouse(i, x, 390, 108 + (i%2)*25, 110 + (i%3)*22, TH);
    }
    for (let i = 0; i < Math.ceil(W/600)+2; i++) {
      const x = i*600 + 230 - cam*.75; if (x < -90 || x > W+90) continue;
      drawTree(x, TH.treeCols[i%3], TH.tree);
    }
  }
  function drawLandmark() {
    const TH = theme(), W = view.w, cam = world.camera, fn = MM.landmarks[TH.lm]; if (!fn) return;
    const period = 2000, i0 = Math.floor((cam * .3 - 500) / period);
    for (let i = i0; i < i0 + 3; i++) { const lx = i * period + 900 - cam * .3; if (lx > -320 && lx < W + 320) fn(ctx, lx, 404, 1.25, TH.lmCol); }
  }
  function winShape(x, y, w, h, style) {
    ctx.beginPath();
    if (style === 'arch') { ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); }
    else if (style === 'round') ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    else if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, 5); else ctx.rect(x, y, w, h);
    ctx.fill();
  }
  function drawHouse(i, x, base, w, h, TH) {
    const y = base - h, hv = hash('h' + i);
    ctx.fillStyle = TH.houses[i % 4]; roundRect(x, y, w, h, 8, true);
    ctx.fillStyle = TH.roofCol;
    if (TH.house === 'peak') { ctx.beginPath(); ctx.moveTo(x - 9, y + 4); ctx.lineTo(x + w / 2, y - 46); ctx.lineTo(x + w + 9, y + 4); ctx.closePath(); ctx.fill(); }
    else if (TH.house === 'mansard') { ctx.beginPath(); ctx.moveTo(x - 7, y + 5); ctx.lineTo(x + 12, y - 34); ctx.lineTo(x + w - 12, y - 34); ctx.lineTo(x + w + 7, y + 5); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; winShape(x + w / 2 - 8, y - 28, 16, 20, 'arch'); }
    else if (TH.house === 'flat') { ctx.fillRect(x - 5, y - 9, w + 10, 12); if (hv % 2) { ctx.fillStyle = '#8a6a50'; ctx.fillRect(x + 14, y - 40, 26, 30); ctx.beginPath(); ctx.moveTo(x + 10, y - 40); ctx.lineTo(x + 27, y - 52); ctx.lineTo(x + 44, y - 40); ctx.fill(); } }
    else if (TH.house === 'dome') { ctx.beginPath(); ctx.arc(x + w / 2, y + 2, w * .46, Math.PI, 0); ctx.fill(); ctx.fillRect(x + w / 2 - 2, y - w * .46 - 12, 4, 12); }
    else if (TH.house === 'terrace') { ctx.fillRect(x - 4, y - 8, w + 8, 11); for (let k = 0; k < 5; k++) ctx.fillRect(x + k * (w / 4.4), y - 18, 9, 11); }
    else if (TH.house === 'pagoda') {
      for (let t = 0; t < 2; t++) { const yy = y + 2 - t * 30, ww = w + 16 - t * 24; ctx.beginPath(); ctx.moveTo(x + w / 2 - ww / 2 - 8, yy + 2); ctx.quadraticCurveTo(x + w / 2 - ww / 4, yy - 4, x + w / 2, yy - 24); ctx.quadraticCurveTo(x + w / 2 + ww / 4, yy - 4, x + w / 2 + ww / 2 + 8, yy + 2); ctx.lineTo(x + w / 2 + ww / 2, yy + 8); ctx.lineTo(x + w / 2 - ww / 2, yy + 8); ctx.closePath(); ctx.fill(); if (!t) { ctx.fillStyle = TH.houses[(i + 1) % 4]; ctx.fillRect(x + w / 2 - 22, yy - 20, 44, 20); ctx.fillStyle = TH.roofCol; } }
    }
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { ctx.fillStyle = 'rgba(255,255,255,.88)'; winShape(x + 18 + c * 44, y + 26 + r * 34, 19, 23, TH.win); ctx.fillStyle = 'rgba(70,130,170,.55)'; ctx.fillRect(x + 26 + c * 44, y + 28 + r * 34, 3, 20); }
    ctx.fillStyle = 'rgba(80,50,40,.55)'; roundRect(x + w / 2 - 13, y + h - 50, 26, 50, 12, true);
  }
  function drawTree(x, col, kind) {
    ctx.fillStyle = '#946b53';
    if (kind === 'palm') {
      ctx.beginPath(); ctx.moveTo(x - 6, 426); ctx.quadraticCurveTo(x + 8, 360, x + 4, 300); ctx.lineTo(x + 11, 300); ctx.quadraticCurveTo(x + 18, 360, x + 8, 426); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .62; ctx.beginPath(); ctx.moveTo(x + 7, 300); ctx.quadraticCurveTo(x + 7 + Math.cos(a) * 36, 300 + Math.sin(a) * 36 - 12, x + 7 + Math.cos(a) * 66, 300 + Math.sin(a) * 40 + 24); ctx.quadraticCurveTo(x + 7 + Math.cos(a) * 34, 300 + Math.sin(a) * 30 + 2, x + 7, 304); ctx.fill(); }
    } else if (kind === 'pine') {
      roundRect(x - 6, 396, 12, 30, 5, true); ctx.fillStyle = col; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x - 34 + k * 7, 404 - k * 36); ctx.lineTo(x, 340 - k * 36); ctx.lineTo(x + 34 - k * 7, 404 - k * 36); ctx.closePath(); ctx.fill(); }
    } else {
      roundRect(x - 7, 326, 14, 100, 7, true);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, 310, 43, 0, Math.PI*2); ctx.arc(x-26, 321, 30, 0, Math.PI*2); ctx.arc(x+25, 320, 31, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.23)'; ctx.beginPath(); ctx.arc(x-13, 291, 14, 0, Math.PI*2); ctx.fill();
      if (kind === 'cherry') { ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc(x - 40 + k * 13, 300 + (k % 3) * 14, 3, 0, 6.3); ctx.fill(); } }
    }
  }
  // petites lucioles qui flottent dans l'air
  function drawAmbient(time) {
    const W = view.w;
    ctx.save();
    for (let i = 0; i < 16; i++) {
      const x = ((i * 173 + time * (6 + i % 5) - world.camera * (.5 + (i % 3) * .15)) % (W + 40) + (W + 40)) % (W + 40) - 20;
      const y = 80 + ((i * 97) % 330) + Math.sin(time * .8 + i) * 14;
      ctx.globalAlpha = .25 + .25 * Math.sin(time * 1.6 + i * 2);
      ctx.fillStyle = i % 3 === 0 ? '#fff3a0' : '#ffffff';
      ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  const gapLava = (g) => (hash('g' + Math.round(g.x)) & 1) === 0;
  function drawWater(gap, x, t) {
    const F = world.floor, gw = gap.w, surf = (px) => F + 18 + Math.sin(t * 2 + (gap.x + px) * .05) * 3 + Math.sin(t * 1.1 + (gap.x + px) * .13) * 1.5;
    ctx.fillStyle = '#2d6f93'; ctx.fillRect(x, F, gw, 170);
    const g = ctx.createLinearGradient(0, F + 14, 0, F + 150); g.addColorStop(0, '#7fe0f6'); g.addColorStop(.35, '#3fb0dc'); g.addColorStop(1, '#1f6f9e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, F + 170); for (let px = 0; px <= gw; px += 8) ctx.lineTo(x + px, surf(px)); ctx.lineTo(x + gw, F + 170); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.beginPath(); for (let px = 0; px <= gw; px += 8) ctx[px ? 'lineTo' : 'moveTo'](x + px, surf(px)); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < Math.ceil(gw / 60); i++) { ctx.beginPath(); ctx.ellipse(x + 24 + i * 60 + Math.sin(t + i) * 8, F + 60 + (i % 3) * 22, 18, 3.5, 0, 0, Math.PI * 2); ctx.fill(); }
    // le requin : ailerons qui patrouillent, et de temps en temps un grand saut
    const cyc = (t * .16 + gap.x * .0031) % 1, leap = cyc < .2 ? cyc / .2 : -1;
    const sx = x + gw * (.5 + .38 * Math.sin(t * .55 + gap.x * .01)), dirR = Math.cos(t * .55 + gap.x * .01) >= 0 ? 1 : -1;
    ctx.save();
    if (leap >= 0) {
      const lx = x + gw * (.2 + .6 * leap), ly = surf(lx - x) + 8 - Math.sin(leap * Math.PI) * 96, ang = Math.cos(leap * Math.PI) * -.9;
      ctx.translate(lx, ly); ctx.rotate(ang);
      ctx.fillStyle = '#7f98ad'; ctx.strokeStyle = '#2b3a4a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-34, 0); ctx.quadraticCurveTo(-4, -22, 34, -2); ctx.quadraticCurveTo(10, 20, -34, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f1f6fa'; ctx.beginPath(); ctx.moveTo(-26, 6); ctx.quadraticCurveTo(4, 14, 30, 2); ctx.quadraticCurveTo(6, 20, -26, 8); ctx.fill();
      ctx.fillStyle = '#7f98ad'; ctx.beginPath(); ctx.moveTo(-34, 3); ctx.lineTo(-52, -16); ctx.lineTo(-48, 6); ctx.lineTo(-54, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-6, -14); ctx.lineTo(-14, -34); ctx.lineTo(8, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(20, -4, 4.5, 0, 6.3); ctx.fill(); ctx.fillStyle = '#1b2430'; ctx.beginPath(); ctx.arc(21, -4, 2.2, 0, 6.3); ctx.fill();
      ctx.strokeStyle = '#1b2430'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(26, 6, 6, .2, 2.6); ctx.stroke();
      FX.dots(lx, surf(lx - x), 1, ['#ffffff', '#bfeaff'], 70);
    } else {
      ctx.translate(sx, surf(sx - x) + 3); ctx.scale(dirR, 1);
      ctx.fillStyle = '#7f98ad'; ctx.strokeStyle = '#2b3a4a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-14, 2); ctx.quadraticCurveTo(-8, -26, 6, -34); ctx.quadraticCurveTo(8, -12, 16, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-26, 4); ctx.quadraticCurveTo(-34, 7, -42, 4); ctx.moveTo(22, 4); ctx.quadraticCurveTo(30, 8, 38, 4); ctx.stroke();
    }
    ctx.restore();
  }
  function drawWorld(time) {
    const W = view.w, p = mission?.palette || [], F = world.floor, cam = world.camera;
    const inGap = (x, m = 0) => world.gaps.some(g => x > g.x - m && x < g.x + g.w + m);
    ctx.fillStyle = p[1] || '#76c78d'; ctx.fillRect(0, F, W, 120);
    const TH = theme();
    ctx.fillStyle = TH.edge; ctx.fillRect(0, F+13, W, 7);
    ctx.fillStyle = TH.dirt; ctx.fillRect(0, F+25, W, 145);
    ctx.fillStyle = TH.line; for (let i = -1; i < Math.ceil(W/80)+2; i++) { const x = ((i*80 - cam*.9) % (W+80)); ctx.fillRect(x, F+42, 48, 3); }
    world.gaps.forEach(gap => {
      const x = gap.x - cam; if (x + gap.w < 0 || x > W) return;
      if (gapLava(gap)) {
        const gw = gap.w, t = time;
        ctx.fillStyle = '#4a1c14'; ctx.fillRect(x, F, gw, 160);
        const lg = ctx.createLinearGradient(0, F + 14, 0, F + 150); lg.addColorStop(0, '#ffd23a'); lg.addColorStop(.25, '#ff7a1f'); lg.addColorStop(1, '#b81f0c');
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x, F + 150);
        for (let px = 0; px <= gw; px += 8) ctx.lineTo(x + px, F + 16 + Math.sin(t * 2.4 + (x + px) * .045) * 4 + Math.sin(t * 1.3 + (x + px) * .11) * 2);
        ctx.lineTo(x + gw, F + 150); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,240,150,.8)'; ctx.beginPath();
        for (let px = 0; px <= gw; px += 8) ctx.lineTo(x + px, F + 16 + Math.sin(t * 2.4 + (x + px) * .045) * 4 + Math.sin(t * 1.3 + (x + px) * .11) * 2);
        for (let px = gw; px >= 0; px -= 8) ctx.lineTo(x + px, F + 24 + Math.sin(t * 2.4 + (x + px) * .045) * 4 + Math.sin(t * 1.3 + (x + px) * .11) * 2);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffc13a'; for (let i = 0; i < Math.ceil(gw / 52); i++) { ctx.beginPath(); ctx.ellipse(x + 22 + i * 52 + Math.sin(t * .8 + i) * 8, F + 56 + (i % 3) * 20, 22, 5, 0, 0, Math.PI * 2); ctx.fill(); }
        for (let i = 0; i < Math.ceil(gw / 70); i++) {                       // grosses bulles qui éclatent + étincelles qui montent
          const ph = (t * .7 + i * .37) % 1, bx = x + 26 + i * 70 + Math.sin(i * 3) * 14, by = F + 40 - ph * 90;
          ctx.globalAlpha = 1 - ph; ctx.fillStyle = ph < .85 ? '#ffe07a' : '#fff'; ctx.beginPath(); ctx.arc(bx, by, 5 + (1 - ph) * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'lighter'; const glow = ctx.createLinearGradient(0, F - 90, 0, F + 20); glow.addColorStop(0, 'rgba(255,120,30,0)'); glow.addColorStop(1, 'rgba(255,140,40,.4)'); ctx.fillStyle = glow; ctx.fillRect(x - 10, F - 90, gw + 20, 110);
        for (let i = 0; i < Math.ceil(gw / 90); i++) {                       // petites flammes qui lèchent le bord
          const fx0 = x + 30 + i * 90 + Math.sin(i * 5) * 18, h = 20 + Math.sin(t * 7 + i * 2) * 8;
          ctx.fillStyle = 'rgba(255,170,40,.75)'; ctx.beginPath(); ctx.moveTo(fx0 - 9, F + 14); ctx.quadraticCurveTo(fx0 - 4, F + 14 - h * .6, fx0 + Math.sin(t * 9 + i) * 4, F + 14 - h); ctx.quadraticCurveTo(fx0 + 6, F + 14 - h * .5, fx0 + 9, F + 14); ctx.closePath(); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        return;
      }
      drawWater(gap, x, time);
    });
    for (let i = 0; i < Math.ceil(W/120)+2; i++) { const x = (i*120 + 35 - cam*.9) % (W+120); if (!inGap(x + cam, 10)) flower(x, F+7, i%4); }
    world.platforms.forEach(pl => { if (pl.bld) drawBuilding(pl); });
    world.passPts.forEach((cp, i) => {       // drapeaux : points de passage
      if (!i) return; const x = cp - cam; if (x < -40 || x > W + 40) return; const on = world.passX >= cp;
      ctx.fillStyle = '#8b6748'; ctx.fillRect(x - 2, F - 78, 4, 78); ctx.fillStyle = on ? '#4cc36a' : '#cfd6d8';
      ctx.beginPath(); ctx.moveTo(x + 2, F - 78); ctx.lineTo(x + 40, F - 66 + Math.sin(time * 4) * 2); ctx.lineTo(x + 2, F - 52); ctx.closePath(); ctx.fill();
    });
    world.decorations.forEach(item => {
      const x = item.x - cam; if (x < -90 || x > W+90 || inGap(item.x, 40)) return;
      if (activeHero === 'filou' && world.platforms.some(pl => pl.bld && item.x > pl.x - 30 && item.x < pl.x + pl.w + 30)) return;
      const y = F; ctx.save();
      const prop = TH.props[item.kind % 5], size = [40, 36, 44, 34, 38][item.kind % 5];
      ctx.fillStyle = 'rgba(40,60,80,.16)'; ctx.beginPath(); ctx.ellipse(x, y + 1, size * .42, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(prop, x, y - 2);
      ctx.restore();
    });
    world.pads.forEach(pad => {
      const x = pad.x - cam; if (x < -120 || x > W + 120) return;
      ctx.fillStyle = '#ffb02e'; roundRect(x, F-8, pad.w, 12, 6, true); ctx.fillStyle = '#fff3a0'; roundRect(x+4, F-8, pad.w-8, 4, 3, true);
      ctx.fillStyle = '#ff5d82'; for (let i = 0; i < 3; i++) { const ax = x + 16 + i*26 + ((time*60) % 26) * .3; ctx.beginPath(); ctx.moveTo(ax, F-26); ctx.lineTo(ax+14, F-18); ctx.lineTo(ax, F-10); ctx.lineTo(ax+4, F-18); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,235,120,.25)'; ctx.beginPath(); ctx.ellipse(x + pad.w/2, F-4, pad.w*.7, 12, 0, 0, Math.PI*2); ctx.fill();
    });
    world.bumps.forEach(b => drawBump(b, time));
    world.platforms.forEach((platform, i) => {
      if (platform.bld) return;
      const x = platform.x - cam; if (x < -150 || x > W + 150) return;
      const top = platform.y, TH2 = theme();
      if (platform.kind === 'bar') {                         // barre pour grimper
        ctx.fillStyle = 'rgba(30,40,60,.18)'; ctx.fillRect(x + 8, top + 18, platform.w - 16, 4);
        ctx.fillStyle = '#9aa6b8'; roundRect(x, top, platform.w, 14, 7, true); ctx.strokeStyle = '#2b2f3a'; ctx.lineWidth = 3; roundRect(x, top, platform.w, 14, 7, false);
        ctx.fillStyle = '#e9eef6'; roundRect(x + 5, top + 2, platform.w - 10, 4, 2, true);
        ctx.fillStyle = '#6c7788'; ctx.fillRect(x + 8, top + 14, 6, 10); ctx.fillRect(x + platform.w - 14, top + 14, 6, 10);
        return;
      }
      if (platform.kind === 'furn') {                        // mobilier de la ville qui flotte au-dessus du vide
        const bh = 46;
        ctx.fillStyle = 'rgba(30,40,60,.18)'; ctx.beginPath(); ctx.ellipse(x + platform.w / 2, top + bh + 8, platform.w * .4, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = TH2.wall; roundRect(x, top, platform.w, bh, 10, true); ctx.strokeStyle = '#2b2f3a'; ctx.lineWidth = 3.5; roundRect(x, top, platform.w, bh, 10, false);
        ctx.fillStyle = TH2.brick; roundRect(x + 4, top + 3, platform.w - 8, 7, 4, true);
        ctx.font = '34px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(TH2.props[(platform.icon || 0) % 5], x + platform.w / 2, top + bh / 2 + 6);
        return;
      }
      ctx.fillStyle = platform.type === 0 ? '#9c755a' : '#73be84'; roundRect(x, top, platform.w, platform.h, 8, true); ctx.strokeStyle = 'rgba(43,47,58,.75)'; ctx.lineWidth = 3.5; roundRect(x, top, platform.w, platform.h, 8, false);
      ctx.fillStyle = platform.type === 0 ? '#e4bd83' : '#b8e5a5'; roundRect(x+4, top+2, platform.w-8, 6, 5, true);
      ctx.fillStyle = platform.type === 0 ? '#fff0c2' : '#fff4b2'; for (let j = 0; j < 3; j++) { const dotX = x + 18 + j*34; if (dotX < x + platform.w - 8) { ctx.beginPath(); ctx.arc(dotX, top-2, 3, 0, Math.PI*2); ctx.fill(); } }
    });
    // ancres de toile
    world.anchors.forEach(a => {
      const x = a.x - cam; if (x < -60 || x > W + 60) return;
      const active = world.hintAnchor === a || (swing && swing.anchor === a), pulse = 1 + Math.sin(time * 5) * (active ? .14 : .06);
      ctx.save(); ctx.translate(x, a.y);
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, active ? 46 : 32); glow.addColorStop(0, active ? 'rgba(200,170,255,.85)' : 'rgba(200,170,255,.45)'); glow.addColorStop(1, 'rgba(200,170,255,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, active ? 46 : 32, 0, Math.PI*2); ctx.fill();
      ctx.scale(pulse, pulse);
      ctx.strokeStyle = '#7d5bd6'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k < 6; k++) { const ang = k * Math.PI / 3; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * 13, Math.sin(ang) * 13); } ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    });
    world.coins.forEach(star => { if (star.collected) return; const x = star.x - cam; if (x < -30 || x > W + 30) return; drawStarItem(x, star.y, time, star.bob); });
    world.letters.forEach((letter, i) => { if (letter.collected) return; const x = letter.x - cam; if (x < -40 || x > W + 40) return; drawLetterItem(x, letter, i, time); });
    world.monsters.forEach(m => drawMonster(m, time));
    world.stations.forEach(station => {
      const x = station.x - cam; if (x < -100 || x > W + 100) return;
      const bob = Math.sin(time*2 + station.bob)*2;
      ctx.fillStyle = '#a96343'; roundRect(x-57, station.y-5+bob, 35, 49, 7, true); roundRect(x+22, station.y-5+bob, 35, 49, 7, true);
      ctx.fillStyle = '#8c563c';
      for (let row = 0; row < 2; row++) for (let col = -2; col <= 2; col++) { if (Math.abs(col) <= 1) continue; roundRect(x+col*29-13, station.y+row*25+bob, 26, 22, 5, true); ctx.fillStyle = '#bf7954'; roundRect(x+col*29-10, station.y+row*25+2+bob, 20, 5, 3, true); ctx.fillStyle = '#8c563c'; }
      ctx.fillStyle = station.done ? '#9bdca8' : '#ffcd52'; roundRect(x-27, station.y+bob, 54, 48, 11, true);
      ctx.strokeStyle = '#fff1af'; ctx.lineWidth = 4; roundRect(x-27, station.y+bob, 54, 48, 11, false);
      ctx.fillStyle = '#fff8da'; ctx.beginPath(); ctx.arc(x, station.y+23+bob, 15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#e76158'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(station.done ? '♥' : '?', x, station.y+30+bob);
    });
    const finishX = world.width - cam - 90;
    ctx.fillStyle = '#fff7cd'; ctx.beginPath(); ctx.arc(finishX, F-58, 32, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#f1bd45'; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = '25px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🏡', finishX, F-49);
  }
  function flower(x,y,i){ctx.fillStyle='#438f5d';ctx.fillRect(x,y-10,2,13);ctx.fillStyle=['#ff7e77','#fff0a5','#8b79d8','#fff'][i];for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ctx.beginPath();ctx.arc(x+Math.cos(a)*4,y-11+Math.sin(a)*4,3,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f7be43';ctx.beginPath();ctx.arc(x,y-11,2.3,0,Math.PI*2);ctx.fill();}
  function drawPlayer(time) {
    const x = player.x - world.camera + player.w/2, y = player.y + player.h/2;
    if (swing) {
      const h = SW.hand(swing), hx = h.x - world.camera, hy = h.y, ax = swing.ax - world.camera, k = Math.min(1, swing.t / .08);
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(120,90,200,.35)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + (ax - hx) * k, hy + (swing.ay - hy) * k); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + (ax - hx) * k, hy + (swing.ay - hy) * k); ctx.stroke();
      ctx.restore();
    }
    if (fizzle) {
      const k = Math.min(1, fizzle.t / .12), a = 1 - fizzle.t / .35, sx = fizzle.x - world.camera;
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(sx, fizzle.y); ctx.lineTo(sx + fizzle.dir * 120 * k, fizzle.y - 150 * k); ctx.stroke(); ctx.restore();
    }
    drawHero(ctx, x, player.y + player.h, time);
  }

  // ===== Animation des héros =====
  // assets/heroes-atlas.webp : 3 lignes (Ziggy, Filou, Titan) × 6 poses. Chaque case est alignée sur les pieds
  // (bas de la case) et centrée sur le corps, donc on dessine toujours « pieds au sol » sans décalage.
  // Une seule pose est dessinée à la fois : pas de fondu, pas de superposition.
  const HERO_ATLAS = { cellW: 262, cellH: 303, pad: 3, scale: 0.48 };
  const HERO_ROW = { ziggy: 0, filou: 1, titan: 2 };
  const POSE = { walkA: 0, walkB: 1, duck: 2, dodge: 3, jump: 4, land: 5 };
  const HERO_IDLE = { ziggy: POSE.walkB, filou: POSE.land, titan: POSE.land };
  const STRIDE = 34; // unités de monde parcourues par pose de marche : les pieds ne glissent pas
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  // Toute l'animation est pilotée par le temps de jeu (dt) : une pause la fige, elle ne « saute » pas à la reprise.
  function newHeroAnim() { return { time:0, phase:0, squash:0, timers:{}, stumbleAge:0, celebrateStart:0 }; }
  // Action ponctuelle ; ms = durée. L'écrasement/étirement (squash) donne du poids aux sauts et aux arrivées.
  function triggerHeroAnimation(name, ms = 400) {
    const a = heroAnim;
    if (name === 'stumble') {
      // Plusieurs chocs d'affilée contre le même obstacle prolongent juste l'action, sans la rejouer.
      if (!a.timers.stumble) { a.stumbleAge = 0; a.squash = -.08; }
      a.timers.stumble = Math.max(a.timers.stumble || 0, .25);
      return;
    }
    a.timers[name] = ms / 1000;
    if (name === 'jump') a.squash = .14;
    else if (name === 'land') a.squash = -.15;
    else if (name === 'collect') a.squash = .09;
    else if (name === 'celebrate') a.celebrateStart = a.time;
    else if (name === 'ability' && activeHero === 'titan') a.squash = -.12;
  }
  function updateHeroAnimation(dt) {
    const a = heroAnim;
    a.time += dt;
    for (const name in a.timers) { a.timers[name] -= dt; if (a.timers[name] <= 0) delete a.timers[name]; }
    if (a.timers.stumble) a.stumbleAge += dt;
    const moving = player.grounded && Math.abs(player.vx) > 12;
    if (moving) a.phase += Math.abs(player.vx) * dt / STRIDE; else if (player.grounded) a.phase = 0;
    // On ne fête que sur place : dès que le héros bouge, la fête s'arrête.
    if (a.timers.celebrate && (moving || !player.grounded)) delete a.timers.celebrate;
    a.squash *= Math.exp(-dt * 14);
    if (Math.abs(a.squash) < .002) a.squash = 0;
  }
  // Quelle pose afficher, selon ce que fait le héros (du plus prioritaire au moins prioritaire).
  function choosePose() {
    const a = heroAnim, t = a.timers, hero = activeHero, air = !player.grounded;
    const main = (col) => ({ s: 'main', col }), mv = (col) => ({ s: 'moves', col, row: MOVES.rows[hero] });
    const n = (f) => s2ok() && S2.map[f] ? { s: 's2', f } : null;
    const walkN = (name, N, mul) => {
      const t = a.phase * mul, i = Math.floor(t) % N, q = n(`${name}${i}`); if (!q) return null;
      const f2 = `${name}${(i + 1) % N}`; if (S2.map[f2]) { q.f2 = f2; const fr = t - Math.floor(t); q.mix = fr * fr * (3 - 2 * fr); } return q;
    };
    const moving = Math.abs(player.vx) > 12;
    if (hero === 'filou') {
      let q;
      if (swing) { q = n(swing.theta * swing.omega > 0 ? 'filou_s1' : 'filou_s0'); if (q) return q; return mv(Math.abs(swing.theta) < .45 ? 1 : swing.theta * swing.omega > 0 ? 2 : 0); }
      if (t.shot) { q = n(t.shot > .12 ? 'filou_launch' : 'filou_aim'); if (q) return q; return mv(2); }
      if (gt < flipUntil && (q = n('filou_s4'))) return q;
      if (t.release && (q = n('filou_s3'))) return q;
      if (air) { if (Math.abs(player.carryVx) > 60 && !s2ok()) return mv(3); const vy = player.vy; q = n(vy < -300 ? 'filou_j1' : vy < 60 ? 'filou_j2' : vy < 380 ? 'filou_j3' : 'filou_j4'); if (q) return q; return main(POSE.jump); }
      if (t.land && (q = n(t.land > .14 ? 'filou_j5' : 'filou_j6'))) return q;
      if (t.stumble && (q = n(a.stumbleAge < .18 ? 'filou_j0' : 'filou_j6'))) return q;
      if (t.celebrate && (q = n('filou_j3'))) return q;
      if (moving && (q = walkN('filou_w', 8, 1.94))) return q;
      if (!moving && (q = n('filou_w7'))) return q;
    }
    if (hero === 'titan') {
      if (t.punch) return t.punch > .22 ? mv(1) : t.punch > .08 ? mv(2) : mv(5);                                         // armé, coup de poing, retour en garde
      if (t.shot) return mv(4);
      if (t.stumble) return mv(Math.floor(a.time * 6) % 2);
      let q;
      if (!air && !t.celebrate && !t.land) { if (moving && (q = walkN('titan_w', 7, 1.7))) return q; if (!moving && (q = n('titan_w7'))) return q; }
    }
    if (hero === 'ziggy') {
      if (t.shot) return main(POSE.dodge);
      let q;
      if (gt < turboUntil && (q = air ? n('ziggy_r1') : n('ziggy_r' + (Math.floor(a.time * 13) % 4)))) return q;
      if (!air && !t.celebrate && !t.land && !t.stumble) { if (moving && (q = walkN('ziggy_w', 5, 1.21))) return q; if (!moving && (q = n('ziggy_w1'))) return q; }
    }
    if (swing) return main(POSE.jump);
    if (t.punch) return main(POSE.land);
    if (t.stumble) return main(a.stumbleAge < .18 ? POSE.duck : POSE.dodge);
    if (t.ability) return main(hero === 'ziggy' ? POSE.dodge : hero === 'filou' ? POSE.jump : POSE.land);
    if (t.drop) return main(POSE.duck);
    if (t.celebrate) return main(POSE.jump);
    if (air) return main(POSE.jump);
    if (t.land && t.land > .14) return main(POSE.land);
    if (moving) return main(Math.floor(a.phase) % 2 ? POSE.walkB : POSE.walkA);
    return main(HERO_IDLE[hero] ?? POSE.walkB);
  }
  function drawHero(c, x, feetY, time) {
    if (!heroAtlas.complete || !heroAtlas.naturalWidth) return;
    const A = HERO_ATLAS, a = heroAnim, pose = choosePose(), hero = activeHero, row = HERO_ROW[hero] ?? 0;
    const isMoves = pose.s === 'moves', isS2 = pose.s === 's2', M = MOVES, K = HERO_K;
    const dw = isMoves ? M.cellW * M.scale : A.cellW * A.scale, dh = isS2 ? HERO_PX * K : isMoves ? M.foot * M.scale : A.cellH * A.scale;
    const walking = player.grounded && Math.abs(player.vx) > 12 && !a.timers.ability && gt >= turboUntil;
    // ombre au sol : suit le héros, rétrécit quand il saute, disparaît au-dessus d'un ravin
    const overGap = world.gaps.some(g => player.x + player.w * .5 > g.x && player.x + player.w * .5 < g.x + g.w);
    const groundY = player.grounded ? feetY : Math.max(feetY, world.floor);
    if ((player.grounded || !overGap) && !(swing && hero === 'filou')) {
      const lift = clamp((groundY - feetY) / 260, 0, .6);
      c.save(); c.fillStyle = `rgba(34,76,96,${.22 * (1 - lift)})`; c.beginPath(); c.ellipse(x, groundY + 1, 30 * (1 - lift * .8), 7 * (1 - lift * .8), 0, 0, Math.PI * 2); c.fill(); c.restore();
    }
    const lunge = a.timers.punch ? Math.sin(Math.min(1, (.32 - a.timers.punch) / .32) * Math.PI) * 14 : 0;
    const hop = a.timers.celebrate ? Math.abs(Math.sin((a.time - a.celebrateStart) * 10)) * 15 : 0;
    const bob = walking && !isS2 ? Math.abs(Math.sin(a.phase * Math.PI)) * 3.5 : 0;
    const breathe = !walking && player.grounded && !isS2 && pose.s === 'main' && pose.col === (HERO_IDLE[hero] ?? POSE.walkB) ? Math.sin(a.time * 2.6) * .012 : 0;
    let tilt = 0;
    if (swing) tilt = clamp(-swing.theta * .25, -.35, .35);
    else if (!player.grounded) tilt = clamp(player.vy * .00018, -.09, .14);
    else if (a.timers.ability && hero === 'ziggy') tilt = .06;
    else if (walking) tilt = .03;
    const flipAngle = gt < flipUntil ? (1 - (flipUntil - gt) / .55) * Math.PI * 2 * flipDir : 0;
    const sx = 1 - a.squash * .6 - breathe * .5, sy = 1 + a.squash + breathe;
    c.save();
    const prevSmoothing = c.imageSmoothingEnabled; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    const drawPose = (offsetX, alpha) => {
      c.save(); c.globalAlpha = alpha;
      if (isS2 && swing && hero === 'filou') {
        // en balancement : la main du héros est exactement au bout de la corde, et le bras pointe vers l'accroche
        const h = SW.hand(swing), f = S2.map[pose.f], side = swing.ax >= h.x ? 1 : -1;
        const ang = Math.atan2(swing.ay - h.y, Math.abs(swing.ax - h.x)), phi = pose.f === 'filou_s1' ? -.52 : -.65;
        c.translate(h.x - world.camera + offsetX, h.y); c.scale(side, 1); c.rotate(clamp((ang - phi) * .85, -.9, .9));
        c.drawImage(S2.img, f.x, f.y, f.w, f.h, -f.hx * K, -f.hy * K, f.w * K, f.h * K);
      } else if (isS2) {
        const f = S2.map[pose.f];
        c.translate(x + offsetX + player.facing * lunge, feetY - hop); c.scale(player.facing, 1);
        if (flipAngle) { c.translate(0, -dh * .5); c.rotate(flipAngle * player.facing); c.translate(0, dh * .5); }
        c.translate(0, -dh * .35); c.rotate(tilt); c.translate(0, dh * .35);
        c.scale(sx, sy);
        c.drawImage(S2.img, f.x, f.y, f.w, f.h, -f.ax * K, -f.ay * K, f.w * K, f.h * K);
        if (pose.f2 && pose.mix > .02) { const g2 = S2.map[pose.f2]; c.globalAlpha = alpha * pose.mix; c.drawImage(S2.img, g2.x, g2.y, g2.w, g2.h, -g2.ax * K, -g2.ay * K, g2.w * K, g2.h * K); }
      } else if (isMoves && swing && hero === 'filou') {
        // en balancement : la main du héros est exactement au bout de la corde
        const h = SW.hand(swing), hnd = M.hands.filou[pose.col], s = M.scale, side = swing.ax >= h.x ? 1 : -1;
        c.translate(h.x - world.camera + offsetX, h.y); c.scale(side, 1); c.rotate(tilt * side);
        c.drawImage(movesImg, pose.col * M.cellW, pose.row * M.cellH, M.cellW, M.cellH, -hnd[0] * s, -hnd[1] * s, M.cellW * s, M.cellH * s);
      } else {
        c.translate(x + offsetX + player.facing * lunge, feetY - hop - bob + (isMoves ? 0 : A.pad * A.scale)); c.scale(player.facing, 1);
        if (flipAngle) { c.translate(0, -dh * .5); c.rotate(flipAngle * player.facing); c.translate(0, dh * .5); }
        const pivot = swing ? .85 : .35; c.translate(0, -dh * pivot); c.rotate(tilt); c.translate(0, dh * pivot);   // on s'incline depuis les hanches
        c.scale(sx, sy);
        if (isMoves) c.drawImage(movesImg, pose.col * M.cellW, pose.row * M.cellH, M.cellW, M.cellH, -dw / 2, -dh, dw, M.cellH * M.scale);
        else c.drawImage(heroAtlas, pose.col * A.cellW, row * A.cellH, A.cellW, A.cellH, -dw / 2, -dh, dw, dh);
      }
      c.restore();
    };
    if ((a.timers.ability || gt < turboUntil) && hero === 'ziggy' && !isMoves) for (let i = 2; i >= 1; i--) drawPose(-player.facing * i * 24, .12 / i * 1.6);
    drawPose(0, 1);
    c.imageSmoothingEnabled = prevSmoothing;
    c.restore();
  }
  function roundRect(x,y,w,h,r,fill=true){ctx.beginPath();if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else{ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);}if(fill)ctx.fill();else ctx.stroke();}
  function cancelSpeech(requeueTimer=true){speechToken++;MM.music.duck(false);if(timerNoticePlaying){timerNoticePlaying=false;if(requeueTimer){timerAnnouncementPending=true;save.timerAnnouncementPending=true;writeSave();}}if('speechSynthesis'in window)window.speechSynthesis.cancel();}
  /* ----- voix : on choisit la plus agréable disponible (voix naturelles/neuronales d'abord), ou celle choisie dans les réglages ----- */
  function voiceScore(v) {
    const n = v.name || '', l = v.lang || '';
    if (!/^fr/i.test(l)) return -1e9;
    let sc = 0;
    if (/natural|neural|online|premium|enhanced|améliorée|siri/i.test(n)) sc += 60;
    if (/google/i.test(n)) sc += 35;
    if (/denise|eloise|élo|amélie|amelie|audrey|marie|julie|hortense|céline|celine|vivienne|brigitte|sylvie|chloé|chloe/i.test(n)) sc += 15;
    if (/espeak|compact|robot|novelty/i.test(n)) sc -= 80;
    if (/^fr-FR/i.test(l)) sc += 6; else if (/^fr-CA/i.test(l)) sc += 3;
    if (!v.localService) sc += 4;
    return sc;
  }
  function frenchVoices() { return (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(v => /^fr/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a)); }
  function pickVoice() {
    const list = frenchVoices(); if (!list.length) return null;
    return (save.voiceName && list.find(v => v.name === save.voiceName)) || list[0];
  }
  function fillVoiceSelect() {
    const sel = $('#voice-select'); if (!sel) return;
    const list = frenchVoices(), cur = save.voiceName || '';
    sel.innerHTML = '<option value="">Automatique (la plus agréable)</option>' + list.map(v => `<option value="${escapeHtml(v.name)}" ${v.name === cur ? 'selected' : ''}>${escapeHtml(v.name)} (${escapeHtml(v.lang)})</option>`).join('');
  }
  if ('speechSynthesis' in window) { try { speechSynthesis.addEventListener('voiceschanged', fillVoiceSelect); } catch {} }
  function sayText(text,onComplete){if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window))return false;cancelSpeech(false);const token=++speechToken;const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.92;utterance.pitch=1.06;utterance.volume=1;const voice=pickVoice();utterance.voice=voice;utterance.lang=voice?.lang||'fr-FR';MM.music.duck(true);utterance.onend=()=>{if(token===speechToken){MM.music.duck(false);onComplete?.(true);}};utterance.onerror=()=>{if(token===speechToken){MM.music.duck(false);onComplete?.(false);}};window.speechSynthesis.speak(utterance);return true;}
  function speakTimerNotice(onComplete){if(!timerAnnouncementPending){onComplete?.();return;}timerAnnouncementPending=false;const started=sayText('On va bientôt terminer. Tu peux finir cette mission tranquillement. Après, ton héros ira se reposer.',()=>{timerNoticePlaying=false;save.timerAnnouncementPending=false;save.sessionElapsed=sessionElapsed;writeSave();onComplete?.();if(scene==='puzzle-screen'&&puzzleTask&&!puzzleResolved&&!onComplete)readPuzzleAloud();});timerNoticePlaying=started;if(!started){save.timerAnnouncementPending=false;writeSave();onComplete?.();}}
  function readPuzzleAloud() {
    if (!puzzleTask || puzzleResolved || timerNoticePlaying) return;
    const kind = puzzleTask.kind || 'quiz';
    const btn = $(kind === 'quiz' ? '#puzzle-read-button' : '#game-read-button');
    const text = kind === 'quiz' ? `${puzzleTask.say || puzzleTask.prompt} Choisis une réponse : ${puzzleTask.options.map(option => option[1]).join('. ')}.` : puzzleTask.say;
    const started = sayText(text, () => {
      btn.classList.remove('speaking');
      if (scene !== 'puzzle-screen' || puzzleResolved) return;
      if (timerAnnouncementPending) speakTimerNotice();
    });
    // les réponses restent toujours cliquables : on peut répondre sans attendre la fin de la lecture
    btn.classList.toggle('speaking', started);
  }
  function openPuzzle(station) {
    if (!station || station.done) return;
    puzzleStation = station; puzzleTask = mission.tasks[station.i]; puzzleWrong = 0; puzzleResolved = false;
    const kind = puzzleTask.kind || 'quiz';
    $('#puzzle-reward').classList.add('hidden'); destroyGame();
    $('#puzzle-feedback').textContent = ''; $('#puzzle-read-button').classList.remove('speaking'); $('#game-read-button').classList.remove('speaking');
    if (kind === 'quiz') {
      $('#game-area').classList.add('hidden'); $('#puzzle-main').classList.remove('hidden');
      $('#puzzle-question').textContent = puzzleTask.prompt;
      const visual = $('#puzzle-visual'); visual.textContent = puzzleTask.visual || ''; visual.classList.toggle('hidden', !puzzleTask.visual);
      const list = $('#choice-list'); list.innerHTML = '';
      puzzleTask.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'choice-button';
        b.innerHTML = `<span>${escapeHtml(opt[0])}</span><span>${escapeHtml(opt[1])}</span>`;
        b.addEventListener('click', () => chooseOption(i, b));
        list.appendChild(b);
      });
    } else {
      $('#puzzle-main').classList.add('hidden'); $('#game-area').classList.remove('hidden');
      $('#game-title').textContent = MM.games.icon(kind);
      gameCtl = MM.games.start(puzzleTask, $('#game-board'), { onSolved: puzzleSolved, tone: playTone });
    }
    setScreen('puzzle-screen');
    if (!timerNoticePlaying) readPuzzleAloud();
  }
  function advanceAfterPuzzle() {
    if (scene !== 'puzzle-screen') return;
    destroyGame();
    const advance = () => {
      if (scene !== 'puzzle-screen') return;
      puzzleTask = null; puzzleStation = null; world.checkpoint = Math.max(world.checkpoint, safeGroundX(player.x)); mission.checkpointX = world.checkpoint; commitProgress(false);
      setScreen('game-screen'); startLoop();
      $('#home-hint').classList.toggle('hidden', !world.stations.every(station => station.done));
    };
    if (timerAnnouncementPending) speakTimerNotice(advance); else advance();
  }
  function chooseOption(index, button) {
    if (!puzzleTask || puzzleResolved) return;
    cancelSpeech(); $('#puzzle-read-button').classList.remove('speaking'); // pas besoin d'attendre la fin de la lecture
    const choices = [...$('#choice-list').querySelectorAll('button')];
    if (index !== puzzleTask.answer) {
      puzzleWrong++;
      button.classList.add('try-again'); button.disabled = true;
      $('#puzzle-feedback').textContent = '🤔';
      if (puzzleWrong >= 2) choices[puzzleTask.answer].classList.add('hint-answer');
      sound('soft'); MM.haptic('oops');
      sayText(retryPhrases[Math.floor(Math.random()*retryPhrases.length)], () => { if (timerAnnouncementPending && scene === 'puzzle-screen') speakTimerNotice(); });
      return;
    }
    choices.forEach(choice => choice.disabled = true);
    puzzleSolved();
  }
  function updateLetterCounter(){const node=$('#letter-count');if(node)node.textContent=`${(mission?.letters||[]).filter(letter=>letter.collected).length}/26`;}
  function finishMission() {
    if (scene === 'ending-screen') return;
    commitProgress(true);
    const lv = mission.level || { hero: activeHero, index: 0 }, city = MM.cities[lv.index] || MM.cities[0];
    lastFinished = { hero: lv.hero, index: lv.index };
    save.activeMission = null; save.activeHero = null; save.activeDate = null; save.progress = 0; save.sessionElapsed = sessionElapsed; save.stopAfterMission = stopAfterMission; writeSave();
    $('#ending-hero').innerHTML = `<span class="sprite" style="--col:2;--row:${HERO_ROW[activeHero] ?? 0}"></span>`;
    $('#ending-city').textContent = `${city.flag} ${city.name} ${city.icon}`;
    const caught = mission.monsters.filter(m => m.friendly).sort((a, b) => a.order - b.order), friendCount = caught.length;
    const found = mission.letters.filter(item => item.collected).map(item => item.letter);
    const stars = mission.coins.filter(s => s.collected).length, qDone = Math.max(readLevel(lv.hero, lv.index).q || 0, (mission.stationsDone || []).filter(Boolean).length);
    const rows = [['⭐', 'étoiles', stars, mission.coins.length], ['🔤', 'lettres', found.length, mission.letters.length || 26], ['👾', 'monstres', friendCount, MON_TOTAL], ['❓', 'questions', qDone, 3]];
    $('#ending-stats').innerHTML = rows.map(([icon, label, a, b]) => `<div class="stat ${a >= b ? 'full' : ''}" aria-label="${label} : ${a} sur ${b}"><span class="stat-i" aria-hidden="true">${icon}</span><div class="stat-bar"><i style="--w:${b ? Math.round(a / b * 100) : 0}%"></i></div><b>${a}/${b}</b><em>${a >= b ? '✓' : 'reste ' + (b - a)}</em></div>`).join('');
    const left = rows.filter(r => r[2] < r[3]);
    const rem = $('#ending-remaining');
    rem.classList.toggle('all', !left.length);
    rem.innerHTML = left.length ? 'Il reste : ' + left.map(([icon, , a, b]) => `<span class="rem">${icon} ${b - a}</span>`).join('') : '🎉 Tout est réussi dans cette ville !';
    $('#ending-friends').innerHTML = `<div class="ten-frame" aria-label="${friendCount} monstres capturés sur ${MON_TOTAL}">${Array.from({ length: MON_TOTAL }, (_, i) => caught[i] ? `<span class="mon-chip on" style="${monsterChipStyle(caught[i].imp ? -1 : caught[i].type + 5, 38)}"></span>` : '<span class="mon-chip"></span>').join('')}</div>`;
    $('#ending-friends').classList.toggle('hidden', !friendCount);
    const won = mission.stickersWon || [], S = MM.stickers, box = $('#ending-stickers');
    box.classList.toggle('hidden', !won.length);
    box.innerHTML = won.length ? `<div class="sticker-row">${won.map((w, n) => { const info = S.info(w.id); return `<span class="${w.tier}" style="--r:${n % 2 ? 5 : -5}deg;--d:${n * 90}ms" aria-label="${escapeHtml(cap(info.n))}">${info.e}</span>`; }).join('')}</div>` : '';
    $('#alphabet-grid').innerHTML = ALPHABET.map(letter => `<span class="alphabet-letter ${found.includes(letter) ? 'found' : 'missing'}" aria-label="${letter} ${found.includes(letter) ? 'récoltée' : 'pas encore récoltée'}">${letter}</span>`).join('');
    $('#alphabet-summary').textContent = `${found.length}/26`;
    $('.rest-card').classList.toggle('hidden', !stopAfterMission);
    $('#replay-button').classList.toggle('hidden', stopAfterMission); $('#replay-button').classList.toggle('newround', levelComplete(readLevel(lv.hero, lv.index)));
    $('#next-level-button').classList.toggle('hidden', stopAfterMission || lv.index >= MM.cities.length - 1);
    setScreen('ending-screen'); sound('finish'); MM.haptic('good');
    const parts = left.map(([, label, a, b]) => `${b - a} ${label}`);
    if (!timerNoticePlaying) setTimeout(() => { if (scene === 'ending-screen') sayText(left.length ? `Bravo ! Il te reste ${parts.join(', ')}.` : 'Bravo ! Tu as tout réussi dans cette ville !'); }, 900);
  }
  function quitMission() {
    cancelSpeech(); commitProgress(false);
    const hero = activeHero;
    save.activeMission = null; save.activeHero = null; save.activeDate = null; save.progress = 0; writeSave();
    mission = null; activeHero = null; puzzleTask = null; puzzleStation = null;
    releaseControls();
    if (hero && !(sessionActive && stopAfterMission)) openLevels(hero); else startToday();
  }
  function moveAndCollide(dt, turboOn) {
    const F = world.floor, wasGrounded = player.grounded;
    const previousX = player.x, previousY = player.y, previousFeet = previousY + player.h;
    player.x += player.vx * dt; player.x = Math.max(18, Math.min(world.width - player.w, player.x));
    // obstacles au sol : ils bloquent tant qu'on ne les a pas sautés ou détruits
    for (const b of world.bumps) {
      const overlap = player.x + player.w > b.x && player.x < b.x + b.w;
      if (!overlap || player.y + player.h <= F - b.h + 6) continue;
      const crossesSide = (previousX + player.w <= b.x && player.x + player.w > b.x) || (previousX >= b.x + b.w && player.x < b.x + b.w);
      if (!crossesSide) continue;
      if (turboOn && b.kind === 'small') continue;                       // le turbo écrase les petits obstacles
      if (turboOn && b.kind === 'fence') { hitBump(b, 'turbo'); continue; }
      player.x = previousX; player.vx = 0;
      triggerHeroAnimation('stumble');
      if (gt - lastBonkAt > .5) { lastBonkAt = gt; MM.haptic('bump'); FX.dust(b.x + (previousX < b.x ? 0 : b.w), F, previousX < b.x ? 1 : -1, 4); }
    }
    player.vy += 1450*dt; player.y += player.vy*dt; player.grounded = false;
    // les plateformes se traversent par-dessous et rattrapent le héros quand il descend
    let landingY = Infinity;
    if (player.vy >= 0) {
      const overGap = world.gaps.some(g => player.x + player.w*.55 > g.x && player.x + player.w*.45 < g.x + g.w);
      const feet = player.y + player.h;
      if (!overGap && previousFeet <= F && feet >= F) landingY = F;
      for (const p of world.platforms) { const o = player.x + player.w > p.x && player.x < p.x + p.w; if (o && previousFeet <= p.y && feet >= p.y && p.y < landingY) landingY = p.y; }
      for (const b of world.bumps) { const top = F - b.h, o = player.x + player.w*.8 > b.x && player.x + player.w*.2 < b.x + b.w; if (o && previousFeet <= top + 4 && feet >= top && top < landingY) landingY = top; }
    }
    if (landingY !== Infinity) {
      const impact = player.vy;
      player.y = landingY - player.h; player.vy = 0; player.grounded = true; player.jumping = false; player.carryVx = 0;
      if (!wasGrounded) onLand(impact);
      if (landingY === F && player.x > world.checkpoint) { world.checkpoint = player.x; mission.checkpointX = player.x; }
    }
    if (player.vy < 0) {
      const box = world.stations.find(station => !station.done && !station.hit && player.x + player.w > station.x - 39 && player.x < station.x + 39 && previousY >= station.y + 54 && player.y <= station.y + 54);
      if (box) { box.hit = true; player.y = box.y + 54; player.vy = 100; triggerHeroAnimation('question', 700); sprinkle(box.x, box.y + 54); sound('open'); MM.haptic('tap'); openPuzzle(box); return true; }
    }
    return false;
  }
  function onLand(impact) {
    if (impact < 300) return;
    triggerHeroAnimation('land', 300);
    const x = player.x + player.w/2, y = player.y + player.h;
    FX.dust(x, y, 0, impact > 700 ? 9 : 5);
    if (impact > 750) { FX.ring(x, y - 4, 'rgba(255,255,255,.9)', 46, .3, 4); FX.shake(2.5, .15); MM.haptic('land'); }
  }
  function doJump(turbo) {
    player.vy = turbo ? -780 : -600; player.grounded = false; player.jumping = true;
    const x = player.x + player.w/2, y = player.y + player.h;
    if (turbo) { FX.ring(x, y, '#ffe36e', 70, .35, 6); FX.sparkle(x, y, 10, ['#fff3a0', '#ffb0d0', '#a8e8ff'], 200); MM.haptic('turbo'); }
    else MM.haptic('jump');
    FX.dust(x, y, 0, 4);
    triggerHeroAnimation('jump', 360); sound('jump');
  }
  function fallSpot() {                                   // on repart assez loin avant le trou pour reprendre de l'élan sans reculer
    const cx = player.x + player.w / 2;
    let g = world.gaps.find(q => cx > q.x - 40 && cx < q.x + q.w + 40);
    if (!g) g = world.gaps.filter(q => q.x > cx).sort((a, b) => a.x - b.x)[0];
    if (!g) return world.checkpoint;
    let x = g.x - 430;
    for (let k = 0; k < 8; k++) { const inside = world.gaps.find(q => x > q.x - 20 && x < q.x + q.w + 20); if (!inside) break; x = inside.x - 130; }
    return safeGroundX(Math.max(120, x));
  }
  function respawn(toX) {
    swing = null; turboUntil = 0; player.carryVx = 0;
    FX.sparkle(player.x + player.w/2, player.y + 30, 10, ['#d6ecff', '#ffffff'], 140);
    player.x = safeGroundX(toX ?? world.checkpoint); player.y = world.floor - player.h; player.vx = 0; player.vy = 0; player.grounded = true; hurtUntil = gt + 1.5;
    FX.sparkle(player.x + player.w/2, world.floor - 40, 10, ['#ffe36e', '#ffffff'], 140);
  }
  function attachWeb(a) {
    const hx = player.x + player.w/2, hy = player.y + 12, dir = a.x >= hx ? 1 : -1;
    swing = SW.start(a.x, a.y, hx, hy, dir); swing.anchor = a;
    player.facing = dir; player.carryVx = 0; player.grounded = false; player.jumping = true;
    FX.ring(a.x, a.y, '#e7d8ff', 46, .35, 5); FX.sparkle(a.x, a.y, 10, ['#ffffff', '#d8c8ff', '#a98cf5'], 150);
    sound('web'); MM.haptic('web');
  }
  function updateSwing(dt) {
    const s = swing, steps = Math.max(1, Math.ceil(dt / (1/120)));
    let release = false;
    for (let i = 0; i < steps && !release; i++) release = SW.step(s, dt / steps);
    const h = SW.hand(s);
    player.x = h.x - player.w/2; player.y = h.y - 12; player.vy = 0; player.grounded = false;
    if (Math.abs(s.omega) > .4) player.facing = s.omega > 0 ? 1 : -1;
    if (release) releaseSwing(false);
  }
  function useAbility() {
    if (scene !== 'game-screen') return;
    if (activeHero === 'ziggy') ziggyTurbo();
    else if (activeHero === 'filou') filouWeb();
    else titanPunch();
  }
  function startTurbo(seconds, free) {
    turboUntil = gt + seconds;
    if (!free) turboReady = gt + 3.2;
    triggerHeroAnimation('ability', seconds * 1000);
    const x = player.x + player.w/2, y = player.y + player.h/2;
    FX.ring(x, y, '#ffe36e', 80, .4, 7); FX.sparkle(x, y, 12, ['#fff3a0', '#ffb0d0', '#a8e8ff', '#ffffff'], 220);
    sound('turbo'); MM.haptic('turbo');
  }
  // un obstacle encaissé un coup : fissures, puis éclats quand il cède
  function hitBump(b, by) {
    b.hp--; b.hit = gt;
    mission.damage = mission.damage || {}; mission.damage[b.id] = (mission.damage[b.id] || 0) + 1;
    const F = world.floor, x = b.x + b.w/2, y = F - b.h/2;
    const colors = b.kind === 'fence' ? ['#c98a4a', '#e8b06a', '#ffffff', '#e04a3a'] : b.kind === 'wall' ? ['#c4673f', '#e08a5a', '#a04f2f', '#f0c0a0'] : ['#8c9a9a', '#b9c6c6', '#6f7d7d', '#d5dede'];
    if (b.hp > 0) { FX.shards(x, y, colors, 5, 160); FX.dust(x, F, 0, 3); FX.shake(2.5, .14); return; }
    world.bumps = world.bumps.filter(item => item !== b);
    mission.brokenBumps = [...(mission.brokenBumps || []), b.id]; writeSave();
    FX.shards(x, y, colors, 18, 340); FX.dust(x, F, 0, 9); FX.ring(x, y, '#ffffff', 90, .4, 7);
    FX.shake(by === 'punch' ? 6 : 3, .3); sound('smash'); MM.haptic('smash');
  }
  function updateAbilityButton() {
    const node = $('#attack-button');
    const waiting = activeHero === 'ziggy' ? gt < turboReady : activeHero === 'titan' ? gt < punchReady : false;
    if (waiting === abilityReadyShown) { abilityReadyShown = !waiting; node.classList.toggle('cooldown', waiting); }
    node.classList.toggle('active', !!swing);
  }
  function collectPickups() {
    const cx = player.x + player.w/2;
    for (const star of world.coins) {
      if (star.collected) continue;
      if (player.x + player.w > star.x - 22 && player.x < star.x + 22 && player.y < star.y + 24 && player.y + player.h > star.y - 24) {
        star.collected = true; updateStarCounter();
        triggerHeroAnimation('collect', 330);
        FX.sparkle(star.x, star.y, 7, ['#ffd84a', '#fff1a0', '#ffffff'], 130); FX.ring(star.x, star.y, '#fff1a0', 34, .3, 4);
        sound('star'); MM.haptic('star'); writeSave();
        if (!mission.silverGiven && world.coins.every(s => s.collected)) { mission.silverGiven = true; awardSticker('silver'); }
        commitProgress(false);
      }
    }
    for (const letter of world.letters) {
      if (letter.collected) continue;
      if (player.x + player.w > letter.x - 26 && player.x < letter.x + 26 && player.y < letter.y + 28 && player.y + player.h > letter.y - 28) {
        letter.collected = true; updateLetterCounter();
        triggerHeroAnimation('collect', 500);
        FX.sparkle(letter.x, letter.y, 14, LETTER_COLORS, 190); FX.ring(letter.x, letter.y, '#ffffff', 56, .4, 5); FX.text(letter.x, letter.y - 26, letter.letter, '#ffffff', 40);
        sound('coin'); MM.haptic('letter'); if (!timerNoticePlaying) sayText(letter.letter); writeSave();
        if (!mission.goldGiven && world.letters.every(l => l.collected)) { mission.goldGiven = true; awardSticker('gold'); }
        commitProgress(false);
      }
    }
    void cx;
  }
  function awardSticker(tier) {
    const album = save.album = save.album || {};
    const { id, isNew } = MM.stickers.pick(tier, album, MM.stickers.CITY_BASE + ((mission && mission.city) || 0));
    album[id] = (album[id] || 0) + 1;
    mission.stickersWon = [...(mission.stickersWon || []), { id, tier }];
    writeSave();
    if (tier !== 'bronze') showAwardBanner(tier, id, isNew);
    return { id, isNew };
  }
  let bannerTimer = 0;
  function showAwardBanner(tier, id, isNew) {
    const info = MM.stickers.info(id), T = MM.stickers.TIERS[tier];
    const node = $('#award-banner');
    node.className = `award-banner ${tier}`;
    node.querySelector('.award-medal').textContent = T.medal;
    node.querySelector('.award-sticker').textContent = info.e;
    node.querySelector('.award-name').textContent = cap(info.n);
    node.querySelector('.award-new').classList.toggle('hidden', !isNew);
    void node.offsetWidth; node.classList.add('show');
    clearTimeout(bannerTimer); bannerTimer = setTimeout(() => node.classList.remove('show'), 3600);
    FX.confetti(player.x + player.w/2, player.y, 30); FX.shake(2, .2);
    sound('sticker'); MM.haptic(tier === 'gold' ? 'gold' : 'silver');
    if (!timerNoticePlaying) sayText(`${tier === 'gold' ? 'Autocollant d’or' : 'Autocollant d’argent'} : ${info.n} !`);
  }
  function openStickerDetail(id) {
    const info = MM.stickers.info(id), T = MM.stickers.TIERS[info.tier];
    $('#sd-emoji').textContent = info.e; $('#sd-medal').textContent = T.medal; $('#sd-name').textContent = cap(info.n); $('#sd-desc').textContent = info.d || '';
    $('#sticker-detail').classList.remove('hidden');
    stickerSpeech = `${cap(info.n)}. ${info.d || ''}`; if (!timerNoticePlaying) sayText(stickerSpeech);
    MM.haptic('tap');
  }
  function closeStickerDetail() { $('#sticker-detail').classList.add('hidden'); cancelSpeech(); }
  let stickerSpeech = '';
  function openCityAlbum(i) { renderAlbum(MM.stickers.CITY_BASE + i); setScreen('album-screen'); }
  function renderAlbum(page) {
    const S = MM.stickers, album = save.album || {}, nB = S.PAGES.length;
    if (page === undefined) page = save.albumPage ?? -1;
    page = page < 0 ? -1 : Math.min(nB - 1, page); save.albumPage = page;
    const order = Array.from({ length: nB - S.CITY_BASE }, (_, i) => S.CITY_BASE + i).concat(Array.from({ length: S.CITY_BASE }, (_, i) => i));
    const face = (i) => i >= S.CITY_BASE ? MM.cities[i - S.CITY_BASE].flag : S.PAGES[i].icon;
    $('#album-tabs').innerHTML = `<button type="button" class="album-tab ${page === -1 ? 'on' : ''}" data-page="-1" role="tab" aria-selected="${page === -1}" aria-label="Tous les livres" style="--c:#ff9f43"><span>📚</span><small>${S.owned(album)}/${S.TOTAL}</small></button>` + order.map((i) => {
      const n = S.pageOwned(album, i), done = n === S.PER_PAGE, p = S.PAGES[i];
      return `<button type="button" class="album-tab ${i === page ? 'on' : ''} ${done ? 'full' : ''}" data-page="${i}" role="tab" aria-selected="${i === page}" aria-label="${escapeHtml(p.title)} : ${n} sur ${S.PER_PAGE}" style="--c:${p.color}"><span>${face(i)}</span><small>${n}/${S.PER_PAGE}</small></button>`;
    }).join('');
    const grid = $('#album-grid');
    if (page === -1) {
      $('#album-page-title').innerHTML = '<span style="--c:#e4741a">📚 Tous mes livres</span>';
      grid.className = 'album-grid books';
      grid.innerHTML = order.map((i) => { const p = S.PAGES[i], n = S.pageOwned(album, i); return `<button type="button" class="book-card ${n === S.PER_PAGE ? 'full' : ''}" data-page="${i}" style="--c:${p.color}" aria-label="${escapeHtml(p.title)} : ${n} sur ${S.PER_PAGE}"><span class="bk-face">${face(i)}</span><span class="bk-icon">${i >= S.CITY_BASE ? p.icon : ''}</span><b>${escapeHtml(p.title.replace(/^Livre (de |du )?/, ''))}</b><small>${n}/${S.PER_PAGE}</small><i style="--p:${n / S.PER_PAGE}"></i></button>`; }).join('');
    } else {
      const pg = S.PAGES[page];
      $('#album-page-title').innerHTML = `<span style="--c:${pg.color}">${face(page)} ${escapeHtml(pg.title)}</span>`;
      grid.className = 'album-grid'; grid.style.setProperty('--c', pg.color);
      grid.innerHTML = pg.slots.map((slot, si) => {
        const id = page * S.PER_PAGE + si, count = album[id] || 0;
        return count > 0
          ? `<div class="album-slot got ${slot.tier}" role="listitem" data-id="${id}" tabindex="0" aria-label="${escapeHtml(cap(slot.n))}"><i class="medal">${S.TIERS[slot.tier].medal}</i><span>${slot.e}</span>${count > 1 ? `<b class="count">×${count}</b>` : ''}</div>`
          : `<div class="album-slot ${slot.tier}" role="listitem" aria-label="Autocollant ${S.TIERS[slot.tier].label.toLowerCase()} à gagner"><i class="medal">${S.TIERS[slot.tier].medal}</i><span class="ghost">${slot.e}</span></div>`;
      }).join('');
    }
    $('#album-total').textContent = `${S.owned(album)}/${S.TOTAL}`;
  }
  function showReward(praise) {
    const { id, isNew } = awardSticker('bronze');
    const info = MM.stickers.info(id);
    const panel = $('#puzzle-reward');
    $('#puzzle-main').classList.add('hidden'); $('#game-area').classList.add('hidden'); destroyGame(); panel.classList.remove('hidden');
    const stage = panel.querySelector('.reward-stage'); const clone = stage.cloneNode(true); stage.replaceWith(clone); // relance les animations
    $('#reward-sticker').textContent = info.e;
    $('#reward-name').textContent = cap(info.n);
    $('#reward-new').classList.toggle('hidden', !isNew);
    MM.haptic('gift');
    let advanced = false;
    const go = () => { if (advanced) return; advanced = true; advanceAfterPuzzle(); };
    rewardAdvance = go;
    const started = sayText(`${praise} Un autocollant : ${info.n} !`, () => setTimeout(go, 1600));
    if (!started) setTimeout(go, 4200);
  }
  function updateStarCounter() { const node = $('#coin-count'); if (node) node.textContent = `${(mission?.coins || []).filter(s => s.collected).length}/${(mission?.coins || []).length}`; }
  function sprinkle(x, y) { FX.sparkle(x, y, 14); }
  function drawBuilding(pl) {
    const W = view.w, F = world.floor, x = pl.x - world.camera; if (x < -260 || x > W + 60) return;
    const TH = theme(), top = pl.y, h = F - top, w = pl.w, c = TH.houses[hash(`${pl.x}`) % 4];
    ctx.fillStyle = c; roundRect(x, top + 6, w, h - 6, 6, true);
    ctx.strokeStyle = 'rgba(80,50,40,.35)'; ctx.lineWidth = 4; roundRect(x, top + 6, w, h - 6, 6, false);
    ctx.fillStyle = 'rgba(0,0,0,.09)'; ctx.fillRect(x + w - 14, top + 14, 14, h - 14);
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(x + 6, top + 14, 6, h - 20);
    const cols = Math.max(1, Math.floor((w - 28) / 38)), rows = Math.max(1, Math.floor((h - 70) / 44));
    const gx = x + (w - cols * 38 + 12) / 2;
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const lit = (hash(`${pl.x}-${r}-${k}`) % 3) === 0;
      ctx.fillStyle = lit ? '#ffe9a0' : '#e8f5ff'; winShape(gx + k * 38, top + 28 + r * 44, 26, 30, TH.win);
      ctx.fillStyle = 'rgba(70,120,160,.35)'; ctx.fillRect(gx + k * 38 + 12, top + 28 + r * 44, 2, 30); ctx.fillRect(gx + k * 38, top + 42 + r * 44, 26, 2);
    }
    ctx.fillStyle = '#a56f58'; roundRect(x + w / 2 - 15, F - 46, 30, 46, 14, true);
    // toit : la plateforme sur laquelle on atterrit
    ctx.fillStyle = TH.roof; roundRect(x - 8, top - 4, w + 16, 20, 7, true);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; roundRect(x - 2, top - 2, w + 4, 6, 4, true);
    if (hash(`${pl.x}`) % 2) { ctx.fillStyle = '#9aa6bd'; roundRect(x + w - 56, top - 22, 34, 20, 4, true); ctx.fillStyle = '#7d8aa3'; ctx.fillRect(x + w - 56, top - 8, 34, 4); }
    else { ctx.strokeStyle = '#7d8aa3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 40, top - 4); ctx.lineTo(x + 40, top - 36); ctx.stroke(); ctx.fillStyle = '#ff6b6b'; ctx.beginPath(); ctx.arc(x + 40, top - 38, 4, 0, Math.PI*2); ctx.fill(); }
  }
  function drawBump(b, time) {
    const W = view.w, F = world.floor, x0 = b.x - world.camera; if (x0 < -260 || x0 > W + 260) return;
    if (b.kind === 'tower') { drawBuilding({ x: b.x, y: F - b.h, w: b.w, bld: {} }); return; }
    const wob = gt - b.hit < .25 ? Math.sin((gt - b.hit) * 60) * 3 * (1 - (gt - b.hit) / .25) : 0, x = x0 + wob, top = F - b.h, damaged = b.hp < b.maxHp;
    const DARK = '#2b2f3a';
    ctx.save(); ctx.lineJoin = 'round';
    // halo clair + ombre au sol : les obstacles se détachent bien du décor
    ctx.fillStyle = 'rgba(30,40,60,.28)'; ctx.beginPath(); ctx.ellipse(x + b.w / 2, F + 2, b.w * .62, 8, 0, 0, Math.PI * 2); ctx.fill();
    const halo = () => { ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 11; ctx.stroke(); ctx.strokeStyle = DARK; ctx.lineWidth = 5; ctx.stroke(); };
    if (b.kind === 'boulder') {
      ctx.beginPath(); ctx.moveTo(x + 4, F); ctx.lineTo(x + 2, F - b.h * .62); ctx.lineTo(x + b.w * .2, top + b.h * .12); ctx.lineTo(x + b.w * .5, top); ctx.lineTo(x + b.w * .82, top + b.h * .1); ctx.lineTo(x + b.w, F - b.h * .5); ctx.lineTo(x + b.w - 4, F); ctx.closePath();
      halo(); const g = ctx.createLinearGradient(x, top, x, F); g.addColorStop(0, theme().rock[0]); g.addColorStop(1, theme().rock[1]); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = DARK; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(x + b.w * .34, top + b.h * .34, b.w * .16, b.h * .09, -.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(x + b.w * .66, F - b.h * .22, b.w * .2, b.h * .12, .3, 0, Math.PI * 2); ctx.fill();
      if (damaged) { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + b.w * .5, top + 6); ctx.lineTo(x + b.w * .44, top + b.h * .3); ctx.lineTo(x + b.w * .56, top + b.h * .5); ctx.lineTo(x + b.w * .46, top + b.h * .75); ctx.stroke(); }
    } else if (b.kind === 'wall') {
      ctx.beginPath(); ctx.rect(x, top, b.w, b.h); halo(); ctx.fillStyle = theme().wall; ctx.fillRect(x, top, b.w, b.h);
      ctx.strokeStyle = theme().brick; ctx.lineWidth = 3;
      for (let r = 1; r < b.h / 28; r++) { const yy = top + r * 28; ctx.beginPath(); ctx.moveTo(x + 2, yy); ctx.lineTo(x + b.w - 2, yy); ctx.stroke(); const off = r % 2 ? b.w * .3 : b.w * .62; ctx.beginPath(); ctx.moveTo(x + off, yy); ctx.lineTo(x + off, yy - 28); ctx.stroke(); }
      ctx.strokeStyle = DARK; ctx.lineWidth = 4; ctx.strokeRect(x, top, b.w, b.h);
      if (damaged) { ctx.strokeStyle = '#3a1608'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + b.w * .3, top + 4); ctx.lineTo(x + b.w * .6, top + b.h * .32); ctx.lineTo(x + b.w * .38, top + b.h * .6); ctx.lineTo(x + b.w * .66, top + b.h * .9); ctx.stroke(); }
    } else if (b.kind === 'fence') {
      ctx.beginPath(); ctx.rect(x - 4, top, b.w + 8, b.h); halo();
      ctx.fillStyle = '#c47b3a'; ctx.fillRect(x + 2, top, 8, b.h); ctx.fillRect(x + b.w - 10, top, 8, b.h);
      for (let r = 0; r < 3; r++) {
        const yy = top + 14 + r * (b.h - 56) / 2;
        ctx.fillStyle = theme().fence[0]; ctx.fillRect(x - 4, yy, b.w + 8, 24);
        ctx.save(); ctx.beginPath(); ctx.rect(x - 4, yy, b.w + 8, 24); ctx.clip(); ctx.fillStyle = theme().fence[1];
        for (let s = -2; s < 6; s++) { ctx.beginPath(); ctx.moveTo(x - 4 + s * 14, yy + 24); ctx.lineTo(x - 4 + s * 14 + 8, yy + 24); ctx.lineTo(x - 4 + s * 14 + 20, yy); ctx.lineTo(x - 4 + s * 14 + 12, yy); ctx.closePath(); ctx.fill(); }
        ctx.restore(); ctx.strokeStyle = DARK; ctx.lineWidth = 3.5; ctx.strokeRect(x - 4, yy, b.w + 8, 24);
      }
    } else if (b.type === 0) { ctx.beginPath(); ctx.rect(x, top, b.w, b.h); halo(); ctx.fillStyle = '#d9894f'; ctx.fillRect(x, top, b.w, b.h); ctx.fillStyle = '#ffd9a8'; ctx.fillRect(x + 4, top + 3, b.w - 8, 7); ctx.strokeStyle = DARK; ctx.lineWidth = 4; ctx.strokeRect(x, top, b.w, b.h); }
    else if (b.type === 1) { ctx.beginPath(); ctx.ellipse(x + b.w/2, F - b.h/2, b.w/2, b.h/2, 0, Math.PI, 0); ctx.closePath(); halo(); ctx.fillStyle = '#4fbf6a'; ctx.fill(); ctx.strokeStyle = DARK; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = '#9be8a4'; ctx.beginPath(); ctx.arc(x + b.w*.35, F - b.h*.48, 6, 0, Math.PI*2); ctx.fill(); }
    else { ctx.beginPath(); ctx.rect(x, top, b.w, b.h); halo(); ctx.fillStyle = '#ffc93a'; ctx.fillRect(x, top, b.w, b.h); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(x + b.w/2, top + 8, 6, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = DARK; ctx.lineWidth = 4; ctx.strokeRect(x, top, b.w, b.h); }
    ctx.restore();
  }
  // étoile à ramasser : grosse, arrondie, avec un petit visage
  function drawStarItem(x, y0, time, seed) {
    const bob = Math.sin(time*3.2 + seed) * 5, y = y0 + bob, rot = Math.sin(time*2.4 + seed) * .14;
    ctx.save(); ctx.translate(x, y);
    const glow = ctx.createRadialGradient(0, 0, 6, 0, 0, 34); glow.addColorStop(0, 'rgba(255,230,120,.55)'); glow.addColorStop(1, 'rgba(255,230,120,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI*2); ctx.fill();
    ctx.rotate(rot); ctx.lineJoin = 'round';
    FX.starPath(ctx, 0, 1, 21, 11.5); ctx.strokeStyle = '#e8920a'; ctx.lineWidth = 9; ctx.stroke();
    FX.starPath(ctx, 0, 1, 21, 11.5); const grad = ctx.createLinearGradient(0, -20, 0, 20); grad.addColorStop(0, '#fff09a'); grad.addColorStop(.55, '#ffd23f'); grad.addColorStop(1, '#ffb02e'); ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = '#fff6c4'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(-6, -8, 4, 2.4, -.6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#6b3d00'; ctx.beginPath(); ctx.arc(-5.5, 1, 2.4, 0, Math.PI*2); ctx.arc(5.5, 1, 2.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-4.8, .2, .9, 0, Math.PI*2); ctx.arc(6.2, .2, .9, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#6b3d00'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 4.5, 4.2, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(255,120,150,.55)'; ctx.beginPath(); ctx.arc(-10, 6, 2.6, 0, Math.PI*2); ctx.arc(10, 6, 2.6, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  // lettre à ramasser : un gros cube de jeu coloré
  function drawLetterItem(x, letter, index, time) {
    const y = letter.y + Math.sin(time*3 + letter.bob) * 5, col = LETTER_COLORS[index % LETTER_COLORS.length], rot = Math.sin(time*2.3 + letter.bob) * .08;
    ctx.save(); ctx.translate(x, y);
    const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 44); glow.addColorStop(0, 'rgba(255,255,255,.5)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI*2); ctx.fill();
    ctx.rotate(rot);
    ctx.fillStyle = 'rgba(0,0,0,.22)'; roundRect(-25, -21, 50, 50, 14, true);                 // épaisseur du cube
    ctx.fillStyle = col; roundRect(-25, -25, 50, 50, 14, true);
    ctx.fillStyle = 'rgba(255,255,255,.34)'; roundRect(-20, -21, 40, 14, 8, true);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; roundRect(-25, -25, 50, 50, 14, false);
    ctx.font = "900 34px ui-rounded, 'Baloo 2', 'Nunito', 'Trebuchet MS', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.strokeText(letter.letter, 0, 3);
    ctx.fillStyle = '#fff'; ctx.fillText(letter.letter, 0, 2);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
    const tw = (Math.sin(time * 5 + letter.bob * 3) + 1) / 2;
    ctx.save(); ctx.globalAlpha = tw; ctx.fillStyle = '#fff'; FX.starPath(ctx, x + 27, y - 27, 7, 2.4); ctx.fill(); ctx.restore();
  }
  function monsterChipStyle(index, boxH) {
    if (index < 0) return `width:${Math.round(boxH * .78)}px;height:${boxH}px;background:url(assets/friend-leaf.webp) center/contain no-repeat`;
    const [, , sh] = MON[index], row = Math.floor(index / 5), col = index % 5;
    const sw = Math.round(MON_CELL.w * 0), s = boxH / sh; void sw;
    const meta = MON[index], w = Math.round(sh * meta[1]);
    return `width:${Math.round(w * s)}px;height:${Math.round(sh * s)}px;background:url(assets/monsters.webp) no-repeat;background-size:${MON_CELL.w * 5 * s}px ${MON_CELL.h * 2 * s}px;background-position:${-(col * MON_CELL.w + (MON_CELL.w - w) / 2) * s}px ${-(row * MON_CELL.h + (MON_CELL.h - MON_CELL.pad - sh)) * s}px`;
  }
  function initMonsters(level, rnd) {
    if (!Array.isArray(mission.monsters)) mission.monsters = level.monsters.map(m => {
      // moitié diablotins de feu (lanceurs), moitié petits monstres tranquilles : hérisson, limon, chauve-souris, golem
      const imp = m.id % 2 === 0, type = imp ? (m.id / 2) % 5 : ((m.id - 1) / 2) % 4, y = !imp && type === 2 ? m.y - 150 - rnd() * 100 : m.y;
      return { id: m.id, imp, type, x: m.x, y, homeX: m.x, homeY: y, hp: (type === 3 ? 2 : 1) + Math.min(4, mission.tier || 0), friendly: false, order: 0 };
    });
    mission.monsters.forEach(m => { m.dir = rnd() < .5 ? 1 : -1; m.pd = m.dir; m.phase = rnd() * 6; m.hop = 0; m.cool = 1.2 + rnd() * 2.2; m.st = 'walk'; m.stT = 0; m.jy = 0; m.jv = 0; m.flash = 0; m.wrap = 0; m.hitT = 0; m.moving = false; if (m.imp) patrolRange(m); if (m.friendly) { m.x = player ? player.x : m.x; } });
    world.monsters = mission.monsters;
  }
  function capturedCount() { return (mission?.monsters || []).filter(m => m.friendly).length; }
  function friendScore() { return capturedCount(); }
  function updateFriendCounter() {
    const n = capturedCount(), node = $('#friend-count');
    if (node) node.textContent = `${n}/${MON_TOTAL}`;
    updateMonsterBar();
  }
  function updateMonsterBar() {
    const bar = $('#monster-bar'); if (!bar) return;
    const caught = (mission?.monsters || []).filter(m => m.friendly).sort((a, b) => a.order - b.order);
    if (bar.children.length !== MON_TOTAL) bar.innerHTML = Array.from({ length: MON_TOTAL }, () => '<i></i>').join('');
    [...bar.children].forEach((chip, i) => {
      const m = caught[i], was = chip.dataset.t;
      if (m) { const key = m.imp ? 'L' : String(m.type); if (was !== key) { chip.dataset.t = key; chip.className = 'on pop'; chip.setAttribute('style', monsterChipStyle(m.imp ? -1 : m.type + 5, 22)); } }
      else { chip.className = ''; chip.removeAttribute('style'); delete chip.dataset.t; }
    });
  }
  function speakCount(n) {
    if (timerNoticePlaying) return;
    sayText(n === 10 ? 'Dix ! Bravo, une dizaine !' : n === 20 ? 'Vingt ! Tous les monstres sont gentils !' : COUNT_WORDS[n]);
  }
  function monsterBox(m) { if (!m.imp) { const [hw, ratio] = MON[m.type]; return { cx: m.x, cy: m.y - hw / 2, hw: hw * ratio * .42 + 6, hh: hw * .5 + 4 }; } const big = m.type === 3 ? 1.27 : 1; return { cx: m.x, cy: m.y - (m.jy || 0) - 44 * big, hw: 30 * big + 4, hh: 46 * big }; }
  function patrolRange(m) {
    const def = [90, 0, 45, 60, 75][m.type] ?? 60; let lo = m.x - def, hi = m.x + def;
    if (m.y >= world.floor - 4) {
      for (const g of world.gaps) { if (g.x + g.w <= m.x) lo = Math.max(lo, g.x + g.w + 26); else if (g.x >= m.x) hi = Math.min(hi, g.x - 26); }
      for (const b of world.bumps) { if (b.kind === 'small') continue; if (b.x + b.w <= m.x) lo = Math.max(lo, b.x + b.w + 20); else if (b.x >= m.x) hi = Math.min(hi, b.x - 20); }
    } else {
      const pl = world.platforms.find(q => Math.abs(q.y - m.y) < 8 && m.x >= q.x && m.x <= q.x + q.w);
      if (pl) { lo = Math.max(lo, pl.x + 26); hi = Math.min(hi, pl.x + pl.w - 26); }
    }
    m.lo = Math.min(lo, m.x); m.hi = Math.max(hi, m.x);
  }
  function onScreen(x, margin = 0) { return x > world.camera - margin && x < world.camera + view.w + margin; }
  /* ----- le diablotin de feu : le seul ennemi du jeu, malicieux, avec trois attaques ----- */
  function impK(m) { return m.type === 3 ? .56 : .44; }
  function setImp(m, st) { m.st = st; m.stT = 0; }
  function startAttack(m) {
    m.cool = (2.3 + Math.random() * 1.7) * (1.35 - (mission?.city || 0) * .045) * Math.max(.45, 1 - .12 * (mission?.tier || 0)); m.dir = Math.sign(player.x + player.w / 2 - m.x) || 1; m.shots = (m.type === 4 ? 2 : 1) + ((mission?.tier || 0) >= 2 ? 1 : 0);
    setImp(m, m.type === 1 ? 'crouch' : m.type === 3 ? 'channel' : 'charge'); m.tx = player.x + player.w / 2;
    FX.dots(m.x, m.y - 60, 4, ['#ff8a2a', '#ffd23f'], 70);
  }
  function launchFire(m) {
    const d = m.dir, k = impK(m) / .44, px = player.x + player.w / 2, py = player.y + player.h * .45;
    const x = m.x + d * 40 * k, y = m.y - (m.jy || 0) - 52 * k;
    if (m.type === 2) {                                                // flèche de feu : rapide et droite
      const sp = 430 * (1 + .1 * (mission?.tier || 0)), vx = d * sp, t = Math.max(.25, Math.abs(px - x) / sp);
      fireballs.push({ x, y, vx, vy: clamp((py - y) / t, -210, 210), g: 0, dir: d, life: 4, kind: 'arrow' }); sound('soft');
    } else if (m.type === 4 && m.shots === 1) {                        // 2e boule : un tir en cloche
      fireballs.push({ x, y, vx: d * clamp(Math.abs(px - x) * .8, 150, 260), vy: -330, g: 620, dir: d, life: 4, kind: 'lob' }); sound('soft');
    } else {
      const sp = 235 * (1 + .1 * (mission?.tier || 0)), vx = d * sp, t = Math.max(.3, Math.abs(px - x) / sp);
      fireballs.push({ x, y, vx, vy: clamp((py - y) / t, -140, 140), g: 0, dir: d, life: 5, kind: 'fire' }); sound('soft');
    }
    FX.sparkle(x, y, 7, ['#ffd23f', '#ff8a2a', '#fff3a0'], 140);
  }
  function updateMonsters(dt) {
    const px = player.x + player.w / 2;
    const pcy = player.y + player.h / 2;
    for (const m of world.monsters) {
      if (m.friendly) { m.flash = Math.max(0, m.flash - dt); m.wrap = Math.max(0, m.wrap - dt); continue; }
      m.flash = Math.max(0, m.flash - dt); m.hitT = Math.max(0, (m.hitT || 0) - dt);
      if (!onScreen(m.x, 140)) continue;
      { const bx = monsterBox(m); if (Math.abs(px - bx.cx) < bx.hw * .8 + player.w * .35 && Math.abs(pcy - bx.cy) < bx.hh * .85 + player.h * .4) playerHit(Math.sign(bx.cx - px) || 1); }   // toucher un monstre compte comme un impact
      m.phase += dt;
      if (!m.imp) {                                                  // petits monstres tranquilles : ils se promènent
        if (m.type === 0 || m.type === 3) { const sp = m.type === 0 ? 46 : 24, rg = m.type === 0 ? 90 : 55; m.x += (m.dir || 1) * sp * dt; if (Math.abs(m.x - m.homeX) > rg) m.dir = -(m.dir || 1); }
        else if (m.type === 1) { m.hop = Math.abs(Math.sin(m.phase * 3.2)) * 44; m.x = m.homeX + Math.sin(m.phase * .9) * 40; }
        else if (m.type === 2) { m.x = m.homeX + Math.sin(m.phase * .8) * 110; m.y = m.homeY + Math.sin(m.phase * 1.7) * 55; }
        continue;
      }
      m.stT += dt;
      const dist = Math.abs(px - m.x), toward = Math.sign(px - m.x) || 1;
      switch (m.st) {
        case 'walk': {
          const sp = [46, 0, 26, 28, 40][m.type] ?? 30;
          if (m.x <= m.lo + 2) m.pd = 1; else if (m.x >= m.hi - 2) m.pd = -1;
          m.dir = dist < 520 ? toward : m.pd;
          m.moving = sp > 0 && m.hi - m.lo > 12 && dist > 120;
          if (m.moving) m.x = clamp(m.x + m.pd * sp * dt * (dist < 520 ? .7 : 1), m.lo, m.hi);
          m.cool -= dt;
          if (m.cool <= 0 && dist < 650 && onScreen(m.x, -30) && gt > hurtUntil - .4) startAttack(m);
          break;
        }
        case 'charge': m.dir = toward; m.moving = false; if (m.stT > (m.type === 2 ? .75 : .55)) setImp(m, 'windup'); break;
        case 'windup': if (m.stT > .24) { launchFire(m); setImp(m, 'release'); } break;
        case 'release': if (m.stT > .22) { if (m.shots > 1) { m.shots--; setImp(m, 'windup'); } else setImp(m, 'follow'); } break;
        case 'follow': if (m.stT > .6) setImp(m, 'walk'); break;
        case 'crouch': m.dir = toward; if (m.stT > .4) { m.jv = 560; m.jvx = toward * clamp(dist * .9, 90, 230); setImp(m, 'air'); } break;
        case 'air':
          m.jv -= 1500 * dt; m.jy += m.jv * dt; m.x = clamp(m.x + m.jvx * dt, m.lo, m.hi);
          if (m.jy <= 0 && m.jv < 0) { m.jy = 0; setImp(m, 'land'); FX.dust(m.x, m.y, 0, 5); FX.shake(1.5, .1); }
          break;
        case 'land': if (m.stT > .32) { m.shots = 1; if (dist < 520 && m.type === 1) { m.dir = toward; setImp(m, 'windup'); } else setImp(m, 'follow'); } break;
        case 'channel':
          m.moving = false; if (m.stT < .6) m.tx = px;
          if (Math.random() < .5) FX.dots(m.x + (Math.random() - .5) * 40, m.y - 4, 1, ['#ff8a2a', '#ffd23f'], 60);
          if (m.stT > .95) { tornados.push({ x: clamp(m.tx, m.x - 340, m.x + 340), y: m.y, age: 0, life: 2.8, from: m }); setImp(m, 'emerge'); sound('turbo'); FX.shake(2, .2); }
          break;
        case 'emerge': if (m.stT > .5) setImp(m, 'hold'); break;
        case 'hold': if (m.stT > .7) setImp(m, 'follow'); break;
        default: setImp(m, 'walk');
      }
    }
  }
  function playerHit(dir) {
    if (swing || gt < hurtUntil || rewindAt) return;
    hurtUntil = gt + 1.3;
    hitTimes = hitTimes.filter(t => gt - t < HIT_WINDOW); hitTimes.push(gt);
    player.vy = -300; player.grounded = false; player.carryVx = -dir * 190; triggerHeroAnimation('stumble');
    FX.sparkle(player.x + player.w / 2, player.y + 30, 12, ['#ff8a2a', '#ffd23f', '#ffffff'], 190); FX.shake(3, .18); MM.haptic('oops'); sound('bump');
    updateHitMeter();
    if (hitTimes.length >= HIT_MAX) { rewindAt = gt + .7; showToast('Oups ! On revient au dernier point de passage.'); }
  }
  function updateHitMeter() {
    hitTimes = hitTimes.filter(t => gt - t < HIT_WINDOW);
    if (hitTimes.length === litShown) return; litShown = hitTimes.length;
    const meter = $('#hit-meter'); if (!meter) return;
    [...meter.children].forEach((chip, i) => chip.classList.toggle('on', i < hitTimes.length));
    meter.classList.toggle('show', hitTimes.length > 0);
  }
  function updateFollowers(dt) {
    let leaderX = player.x + player.w / 2 - player.facing * 56;
    const followers = world.monsters.filter(m => m.friendly && !m.prev).sort((a, b) => a.order - b.order);
    followers.forEach(m => {
      const spacing = 46, targetX = leaderX - player.facing * spacing, targetY = player.y + player.h - Math.sin(gt * 4 + m.id) * 3;
      m.x += (targetX - m.x) * Math.min(1, dt * 7); m.y += (targetY - m.y) * Math.min(1, dt * 6); leaderX = m.x;
    });
  }
  /* ----- tirs : boule de feu (Ziggy), enroulement magique de toile (Filou), coup de poing projeté (Titan) ----- */
  function shoot() {
    if (scene !== 'game-screen' || gt < shootReady) return;
    shootReady = gt + .38;
    const dir = player.facing, hero = activeHero;
    shots.push({ x: player.x + player.w / 2 + dir * 38, y: player.y + 36, vx: dir * SHOT_SPEED[hero], vy: 0, dir, hero, r: hero === 'titan' ? 26 : 18, born: gt });
    triggerHeroAnimation('shot', 260);
    FX.sparkle(player.x + player.w / 2 + dir * 40, player.y + 36, 6, hero === 'ziggy' ? ['#ffb02e', '#fff3a0', '#ff6a2a'] : hero === 'filou' ? ['#ffffff', '#d8c8ff'] : ['#fff3a0', '#ffd23f'], 130);
    sound(hero === 'titan' ? 'punch' : 'magic'); MM.haptic('tap');
  }
  function updateShots(dt) {
    const cam = world.camera;
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      // un léger guidage vers le monstre visible le plus proche, pour que les petits puissent viser
      let target = null, bd = 1e9;
      for (const m of world.monsters) {
        if (m.friendly || !onScreen(m.x, -10)) continue;
        const b = monsterBox(m), dx = (b.cx - s.x) * s.dir;
        if (dx > 0 && dx < 640 && Math.abs(b.cy - s.y) < 260 && dx < bd) { bd = dx; target = b; }
      }
      if (target) s.vy += (clamp((target.cy - s.y) / Math.max(.2, bd / Math.abs(s.vx)) * .9, -420, 420) - s.vy) * Math.min(1, dt * 7);
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (Math.random() < .8) FX.glitter(s.x - s.dir * 10, s.y);
      if (s.x < cam - 30 || s.x > cam + view.w + 30 || gt - s.born > 3) { shots.splice(i, 1); continue; }    // jamais plus loin que l'écran
      let used = false;
      if (s.hero === 'titan') {                                        // le poing projeté casse les obstacles comme le coup de poing
        const fl = world.floor, bump = world.bumps.find(b => b.kind !== 'small' && b.kind !== 'tower' && s.x > b.x - s.r && s.x < b.x + b.w + s.r && s.y > fl - b.h - 30);
        if (bump) { hitBump(bump, 'punch'); used = true; }
      }
      for (let j = fireballs.length - 1; j >= 0 && !used; j--) if (Math.hypot(fireballs[j].x - s.x, fireballs[j].y - s.y) < 34) { FX.sparkle(fireballs[j].x, fireballs[j].y, 8, ['#ffb02e', '#ffffff'], 140); fireballs.splice(j, 1); used = true; }
      for (const m of world.monsters) {
        if (used || m.friendly || !onScreen(m.x, -10)) continue;      // on ne peut pas tirer sur un monstre hors de l'écran
        const b = monsterBox(m);
        if (Math.abs(b.cx - s.x) < b.hw + s.r && Math.abs(b.cy - s.y) < b.hh + s.r) { hitMonster(m, s); used = true; }
      }
      if (used) shots.splice(i, 1);
    }
    for (let i = fireballs.length - 1; i >= 0; i--) {
      const f = fireballs[i];
      f.x += f.vx * dt; f.life -= dt; if (f.g) { f.vy += f.g * dt; } f.y += (f.vy || 0) * dt;
      if (Math.random() < .7) FX.dots(f.x - f.dir * 12, f.y, 1, ['#ff8a2a', '#ffd23f'], 50);
      if (f.life <= 0 || !onScreen(f.x, 160) || f.y > world.floor + 80) { fireballs.splice(i, 1); continue; }
      if (!swing && gt > hurtUntil && Math.abs(f.x - (player.x + player.w / 2)) < 32 && Math.abs(f.y - (player.y + player.h / 2)) < 52) {
        fireballs.splice(i, 1); playerHit(f.dir);
      }
    }
    for (let i = tornados.length - 1; i >= 0; i--) {
      const q = tornados[i]; q.age += dt;
      if (q.age > q.life || !onScreen(q.x, 200)) { tornados.splice(i, 1); continue; }
      if (q.age > .5) q.x += Math.sign(player.x + player.w / 2 - q.x) * 34 * dt;
      if (Math.random() < .6) FX.dots(q.x + (Math.random() - .5) * 50, q.y - Math.random() * 110, 1, ['#ff8a2a', '#ffd23f', '#fff3a0'], 40);
      if (q.age > .4 && q.age < q.life - .4 && !swing && gt > hurtUntil && Math.abs(player.x + player.w / 2 - q.x) < 30 && player.y + player.h > q.y - 120 && player.y < q.y) playerHit(Math.sign(q.x - (player.x + player.w / 2)) || 1);
    }
  }
  function hitMonster(m, s) {
    m.hp--; m.flash = .3;
    FX.ring(s.x, s.y, s.hero === 'ziggy' ? '#ffb02e' : s.hero === 'filou' ? '#e7d8ff' : '#fff3a0', 56, .3, 6);
    if (m.hp > 0) { m.hitT = .45; if (m.st !== 'air') { m.st = 'walk'; m.stT = 0; m.cool = Math.max(m.cool || 0, 1.5); } FX.sparkle(m.x, m.y - 40, 8, ['#ffffff', '#ffd23f'], 150); FX.shake(1.5, .12); MM.haptic('tap'); return; }
    captureMonster(m, s.hero);
  }
  function captureMonster(m, by) {
    m.friendly = true; m.order = capturedCount() + 0.5; m.flash = .7; m.wrap = by === 'filou' ? .9 : 0;
    const sorted = world.monsters.filter(q => q.friendly).sort((a, b) => a.order - b.order); sorted.forEach((q, i) => { q.order = i + 1; });
    const n = capturedCount(), hw = MON[m.type + 5][0]; m.st = 'walk'; m.jy = 0;
    triggerHeroAnimation('collect', 400);
    FX.heart(m.x, m.y - hw); FX.sparkle(m.x, m.y - hw / 2, 14, ['#ffb5c8', '#ffdf8d', '#ffffff', '#9fe3ff'], 190);
    FX.text(m.x, m.y - hw - 18, String(n), '#fff6c4', 50);
    sound('sticker'); MM.haptic('friend');
    if (n % 10 === 0) { FX.confetti(player.x + player.w / 2, player.y, 30); FX.shake(2, .25); MM.haptic('gold'); }
    const pop = $('#friend-counter'); if (pop) { pop.classList.remove('pop'); void pop.offsetWidth; pop.classList.add('pop'); }
    updateFriendCounter(); speakCount(n); writeSave(); commitProgress(false);
    if (!mission.monGiven && n >= MON_TOTAL) { mission.monGiven = true; setTimeout(() => { if (scene === 'game-screen') { awardSticker('silver'); commitProgress(false); } }, 2400); }
  }
  function drawMonster(m, time) {
    if (m.friendly || !m.imp || !s2ok()) return drawFriend(m, time);
    const cam = world.camera, x = m.x - cam; if (x < -160 || x > view.w + 160) return;
    let name;
    if (m.hitT > 0) name = 'imp_hit';
    else switch (m.st) {
      case 'charge': name = 'imp_charge'; break; case 'windup': name = 'imp_windup'; break; case 'release': name = 'imp_release'; break;
      case 'follow': name = 'imp_follow'; break; case 'crouch': name = 'imp_crouch'; break; case 'air': name = m.jv > 100 ? 'imp_arc' : 'imp_jump1'; break;
      case 'land': name = 'imp_land'; break; case 'channel': name = 'imp_channel'; break; case 'emerge': name = 'imp_emerge'; break; case 'hold': name = 'imp_hold'; break;
      default: name = m.moving ? `imp_w${Math.floor(m.phase * 7) % 6}` : 'imp_w0';
    }
    const f = S2.map[name]; if (!f) return;
    const k = impK(m), jy = m.jy || 0, lift = clamp(jy / 160, 0, 1);
    ctx.save();
    ctx.fillStyle = `rgba(60,30,20,${.22 * (1 - lift * .7)})`; ctx.beginPath(); ctx.ellipse(x, m.y + 1, 26 * k / .44 * (1 - lift * .4), 6, 0, 0, Math.PI * 2); ctx.fill();
    // lueur de feu : plus vive quand il prépare une attaque
    const charging = m.st === 'charge' || m.st === 'windup' || m.st === 'channel';
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(x, m.y - jy - 50 * k / .44, 4, x, m.y - jy - 50 * k / .44, (charging ? 78 : 56) * k / .44);
    gr.addColorStop(0, `rgba(255,150,50,${charging ? .5 + Math.sin(time * 25) * .1 : .1})`); gr.addColorStop(1, 'rgba(255,90,20,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, m.y - jy - 50 * k / .44, 80 * k / .44, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(x, m.y - jy);
    const pop = m.flash > 0 ? 1 + Math.sin(m.flash * 18) * .08 : 1, breathe = m.moving || m.st !== 'walk' ? 1 : 1 + Math.sin(time * 4 + m.id) * .015;
    ctx.scale(m.dir * pop, pop * breathe);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(S2.img, f.x, f.y, f.w, f.h, -f.ax * k, -f.ay * k, f.w * k, f.h * k);
    if (m.flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(.6, m.flash * 1.6); ctx.drawImage(S2.img, f.x, f.y, f.w, f.h, -f.ax * k, -f.ay * k, f.w * k, f.h * k); }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    if (m.type === 2 && (m.st === 'charge' || m.st === 'windup' || m.st === 'release')) {        // l'archer : arc de bois et flèche de feu
      const pull = m.st === 'charge' ? Math.min(1, m.stT / .7) : m.st === 'windup' ? 1 : 0;
      ctx.translate(44, -52); ctx.strokeStyle = '#8a5a34'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-6, 0, 30, -1.15, 1.15); ctx.stroke();
      ctx.strokeStyle = '#fff6d6'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-6 + Math.cos(-1.15) * 30, Math.sin(-1.15) * 30); ctx.lineTo(-6 - pull * 16, 0); ctx.lineTo(-6 + Math.cos(1.15) * 30, Math.sin(1.15) * 30); ctx.stroke();
      if (pull > 0) { ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6 - pull * 16, 0); ctx.lineTo(34, 0); ctx.stroke();
        const g2 = ctx.createRadialGradient(36, 0, 1, 36, 0, 14); g2.addColorStop(0, '#fff3a0'); g2.addColorStop(.5, '#ff8a2a'); g2.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(36, 0, 14, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }
  function drawFriend(m, time) {
    if (m.prev) return;
    const cam = world.camera, x = m.x - cam; if (x < -160 || x > view.w + 160) return;
    if (m.friendly && m.imp) {                               // un diablotin touché devient toujours le gentil petit monstre feuillu
      if (!leafImg.complete || !leafImg.naturalWidth) return;
      const hh = m.type === 3 ? 84 : 70, ww = hh * leafImg.naturalWidth / leafImg.naturalHeight, bob = Math.abs(Math.sin(time * 5 + m.id)) * 5;
      ctx.save(); ctx.fillStyle = 'rgba(40,60,80,.18)'; ctx.beginPath(); ctx.ellipse(x, m.y + 1, ww * .32, 5, 0, 0, Math.PI * 2); ctx.fill();
      const pop = m.flash > 0 ? 1 + Math.sin(m.flash * 18) * .1 : 1; ctx.translate(x, m.y - bob); ctx.scale(pop * (player.facing >= 0 ? 1 : -1), pop);
      ctx.imageSmoothingQuality = 'high'; ctx.drawImage(leafImg, -ww / 2, -hh, ww, hh);
      if (m.flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(.5, m.flash * 1.4); ctx.drawImage(leafImg, -ww / 2, -hh, ww, hh); }
      ctx.restore(); return;
    }
    const index = m.type + (m.friendly ? 5 : 0), [hw, , sh] = MON[index];
    const scale = m.friendly ? .8 : 1, k = hw * scale / sh;
    let feet = m.y;
    if (m.friendly) feet += Math.sin(time * 4 + m.id) * 2; else if (m.type === 1) feet -= m.hop; else if (m.type === 2) feet += Math.sin(time * 6 + m.id) * 2;
    if (!monsterImg.complete || !monsterImg.naturalWidth) return;
    ctx.save();
    if (m.type !== 2 && !m.friendly) { ctx.fillStyle = 'rgba(40,60,80,.2)'; ctx.beginPath(); ctx.ellipse(x, m.y + 1, hw * .45, 6, 0, 0, Math.PI * 2); ctx.fill(); }
    if (!m.friendly && m.type === 4 && m.charge) { const g = ctx.createRadialGradient(x - 30, feet - 70, 4, x - 30, feet - 70, 40); g.addColorStop(0, 'rgba(255,120,30,.9)'); g.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x - 30, feet - 70, 40, 0, Math.PI * 2); ctx.fill(); }
    const pop = m.flash > 0 ? 1 + Math.sin(m.flash * 18) * .08 : 1;
    ctx.translate(x, feet); ctx.scale(pop, pop);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(monsterImg, (index % 5) * MON_CELL.w, Math.floor(index / 5) * MON_CELL.h, MON_CELL.w, MON_CELL.h, -MON_CELL.w * k / 2, -(MON_CELL.h - MON_CELL.pad) * k, MON_CELL.w * k, MON_CELL.h * k);
    if (m.flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(.6, m.flash * 1.6); ctx.drawImage(monsterImg, (index % 5) * MON_CELL.w, Math.floor(index / 5) * MON_CELL.h, MON_CELL.w, MON_CELL.h, -MON_CELL.w * k / 2, -(MON_CELL.h - MON_CELL.pad) * k, MON_CELL.w * k, MON_CELL.h * k); }
    ctx.restore();
    if (m.wrap > 0) {   // enroulement de toile autour du monstre capturé
      ctx.save(); ctx.translate(x, feet - hw * scale / 2); ctx.globalAlpha = Math.min(1, m.wrap * 2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(0, 0, hw * .5 * (1 - (.9 - m.wrap) * .3), hw * (.22 + i * .09), (i - 1.5) * .55 + m.wrap * 4, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
    }
  }
  function drawShots(time) {
    const cam = world.camera;
    for (const s of shots) {
      const x = s.x - cam, y = s.y;
      ctx.save(); ctx.translate(x, y);
      if (s.hero === 'ziggy') {
        for (let i = 3; i >= 1; i--) { ctx.globalAlpha = .18 * (4 - i); ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.arc(-s.dir * i * 16, Math.sin(time * 30 + i) * 3, 15 - i * 2.2, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 1; const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 24); g.addColorStop(0, '#fffbe0'); g.addColorStop(.35, '#ffd23f'); g.addColorStop(.7, '#ff7a1a'); g.addColorStop(1, 'rgba(255,60,20,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 24 + Math.sin(time * 40) * 2, 0, Math.PI * 2); ctx.fill();
      } else if (s.hero === 'filou') {
        const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 26); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.55, 'rgba(206,186,255,.9)'); g.addColorStop(1, 'rgba(160,130,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.rotate(time * 9);
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 14, 6 + i * 2, i * 1.05, 0, Math.PI * 2); ctx.stroke(); }
      } else {
        ctx.globalAlpha = .6; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(-s.dir * (22 + i * 14), 0, 20 + i * 8, s.dir > 0 ? -1 : Math.PI - 1, s.dir > 0 ? 1 : Math.PI + 1); ctx.stroke(); }
        ctx.globalAlpha = 1; const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 34); g.addColorStop(0, 'rgba(255,240,160,.9)'); g.addColorStop(1, 'rgba(255,200,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
        ctx.scale(s.dir, 1); ctx.font = '46px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👊', 0, 3);
      }
      ctx.restore();
    }
    for (const q of tornados) {
      const x = q.x - cam, grow = Math.min(1, q.age / .45), fade = Math.min(1, (q.life - q.age) / .4), f = S2.map && S2.map.imp_tornado; if (!f) continue;
      ctx.save(); ctx.globalAlpha = fade;
      ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(x, q.y, 4, x, q.y, 70); gg.addColorStop(0, 'rgba(255,160,50,.55)'); gg.addColorStop(1, 'rgba(255,90,20,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(x, q.y, 70 * grow, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
      const kk = 135 * grow / f.h; ctx.translate(x, q.y); ctx.scale(1 + Math.sin(time * 14) * .05, 1); ctx.drawImage(S2.img, f.x, f.y, f.w, f.h, -f.ax * kk, -f.ay * kk, f.w * kk, f.h * kk);
      ctx.restore();
    }
    for (const m of world.monsters) {      // avertissement : le sol rougeoie là où la tornade va naître
      if (m.friendly || m.st !== 'channel') continue; const x = m.tx - cam, pulse = .5 + .5 * Math.sin(time * 18);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,${110 + pulse * 80},40,${.25 + m.stT * .35})`; ctx.beginPath(); ctx.ellipse(x, m.y, 20 + m.stT * 40, 7 + m.stT * 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    for (const f of fireballs) {
      const x = f.x - cam, y = f.y; ctx.save(); ctx.translate(x, y);
      if (f.kind === 'arrow') {
        ctx.scale(f.dir, 1); const ang = Math.atan2(f.vy, Math.abs(f.vx)); ctx.rotate(ang);
        ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(14, 0); ctx.stroke();
        ctx.strokeStyle = '#ff7a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(-33, -5); ctx.moveTo(-26, 0); ctx.lineTo(-33, 5); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(14, 0, 1, 14, 0, 20); g.addColorStop(0, '#fff3a0'); g.addColorStop(.45, '#ff8a2a'); g.addColorStop(1, 'rgba(255,60,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(14, 0, 20 + Math.sin(time * 40) * 2, 0, Math.PI * 2); ctx.fill();
      } else {
        const fr = S2.map && S2.map.imp_fireball;
        ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 30); g.addColorStop(0, 'rgba(255,230,140,.8)'); g.addColorStop(.5, 'rgba(255,120,30,.45)'); g.addColorStop(1, 'rgba(220,40,20,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 30 + Math.sin(time * 30) * 2, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
        if (fr) { ctx.scale(f.dir, 1); ctx.rotate(Math.atan2(f.vy, Math.abs(f.vx)) * .8); const kk = 64 / fr.h * 1.15; ctx.drawImage(S2.img, fr.x, fr.y, fr.w, fr.h, -fr.w * kk * .72, -fr.h * kk / 2, fr.w * kk, fr.h * kk); }
      }
      ctx.restore();
    }
  }
  function ziggyTurbo() {
    if (gt < turboUntil) { turboUntil = 0; return; }   // ACTION une 2e fois : on freine
    if (gt < turboReady) return;
    startTurbo(1.2, false);
  }
  function findAnchor(exclude) {
    const hx = player.x + player.w/2, hy = player.y + 12;
    let best = null, bd = 1e9;
    for (const a of world.anchors) {
      if (a === exclude) continue;
      const dir = a.x >= hx ? 1 : -1, d = Math.hypot(a.x - hx, a.y - hy);
      if (d < bd && SW.canReach(a, hx, hy, dir)) { bd = d; best = a; }
    }
    return best;
  }
  function filouWeb() {
    if (swing) {
      // en plein balancement : on relance directement une autre toile, sinon on lâche
      const next = findAnchor(swing.anchor);
      if (next) { releaseSwing(false, false); attachWeb(next); } else releaseSwing(true, false);
      return;
    }
    const a = findAnchor();
    if (a) { attachWeb(a); return; }
    fizzle = { x: player.x + player.w/2, y: player.y + 20, dir: player.facing, t: 0 };   // rien à portée : la toile part dans le vide
    sound('web'); MM.haptic('tap');
  }
  function releaseSwing(manual, flip) {
    const s = swing; if (!s) return;
    const v = SW.velocity(s);
    player.carryVx = v.vx; player.vx = v.vx; player.vy = v.vy - (manual ? 140 : 0);
    if (Math.abs(player.carryVx) < 120) player.carryVx = 120 * s.dir;
    if (flip) {
      // un saut pendant le balancement : salto arrière, et on peut repartir dans l'autre sens en tenant la direction opposée
      const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      if (move && Math.sign(move) !== Math.sign(player.carryVx)) { player.carryVx = move * Math.max(260, Math.abs(player.carryVx) * .8); player.facing = move; }
      flipUntil = gt + .55; flipDir = Math.sign(player.carryVx) || 1; player.vy -= 160;
    }
    player.grounded = false; player.jumping = true; swing = null; airTurnUntil = gt + 1.6;
    const x = player.x + player.w/2, y = player.y + 20;
    FX.ring(x, y, '#e7d8ff', 50, .3, 4); FX.sparkle(x, y, flip ? 12 : 8, ['#ffffff', '#d8c8ff'], 170);
    triggerHeroAnimation('jump', 360); if (!flip) triggerHeroAnimation('release', 320); MM.haptic(flip ? 'good' : 'jump');
  }
  function titanPunch() {
    if (gt < punchReady) return;
    punchReady = gt + .42;
    triggerHeroAnimation('punch', 320);
    const dir = player.facing, cx = player.x + player.w/2;
    const x0 = dir > 0 ? cx : cx - 190, x1 = dir > 0 ? cx + 190 : cx;
    const fx = cx + dir * 112, fy = player.y + 38;
    FX.ring(fx, fy, '#fff6c4', 62, .3, 7); FX.sparkle(fx, fy, 8, ['#fff3a0', '#ffffff', '#ffb02e'], 220);
    sound('punch'); MM.haptic('punch'); FX.shake(3, .16);
    let hit = false;
    for (const b of world.bumps.slice()) if (b.kind !== 'small' && b.kind !== 'tower' && b.x < x1 && b.x + b.w > x0) { hitBump(b, 'punch'); hit = true; }
    for (const m of world.monsters) {                                  // à portée de poing : le coup de poing capture aussi (même force que le poing projeté)
      if (m.friendly || !onScreen(m.x, -10)) continue;
      const b = monsterBox(m);
      if ((b.cx - cx) * dir > -30 && Math.abs(b.cx - cx) < b.hw + 125 && Math.abs(b.cy - (player.y + player.h / 2)) < b.hh + 55) { hitMonster(m, { hero: 'titan', x: b.cx, y: b.cy }); hit = true; }
    }
    if (!hit) FX.dust(fx, world.floor, dir, 3);
  }
  function playTone(freq, ms) {
    if (!audioEnabled) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const t0 = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(.0001, t0); gain.gain.exponentialRampToValueAtTime(.14, t0 + .02); gain.gain.exponentialRampToValueAtTime(.0001, t0 + ms / 1000);
      osc.connect(gain); gain.connect(audio.destination); osc.start(t0); osc.stop(t0 + ms / 1000 + .05);
    } catch {}
  }
  function destroyGame() { if (gameCtl) { gameCtl.destroy(); gameCtl = null; } }
  // fin d'une énigme ou d'un mini-jeu réussi : la caisse est ouverte et un autocollant de bronze est offert
  function puzzleSolved() {
    if (puzzleResolved) return;
    puzzleResolved = true;
    const station = puzzleStation;
    if (station && !station.done) { station.done = true; mission.stationsDone[station.i] = true; save.progress = mission.stationsDone.filter(Boolean).length; writeSave(); $('#progress-dots').children[station.i]?.classList.add('done'); sprinkle(station.x, world.floor - 90); }
    triggerHeroAnimation('celebrate', 1250);
    $('#puzzle-feedback').textContent = '👏';
    sound('success'); MM.haptic('good');
    showReward(praisePhrases[Math.floor(Math.random()*praisePhrases.length)]);
  }
  // on peut quitter l'énigme ou le mini-jeu quand on veut ; la caisse reste à ouvrir
  function closePuzzle() {
    if (scene !== 'puzzle-screen') return;
    cancelSpeech(); $('#puzzle-read-button').classList.remove('speaking'); $('#game-read-button').classList.remove('speaking');
    if (puzzleResolved) { rewardAdvance?.(); return; }
    destroyGame();
    if (puzzleStation) puzzleStation.hit = false;
    puzzleTask = null; puzzleStation = null;
    setScreen('game-screen'); startLoop();
  }
  function endSession(){sessionActive=false;sessionElapsed=0;sessionTimerLimit=0;stopAfterMission=false;timerWarningSent=false;timerAnnouncementPending=false;timerNoticePlaying=false;save.sessionActive=false;save.sessionElapsed=0;save.sessionTimerLimit=0;save.stopAfterMission=false;save.timerWarningSent=false;save.timerAnnouncementPending=false;save.activeMission=null;save.activeHero=null;save.activeDate=null;save.progress=0;writeSave();$('#session-timer-row').classList.remove('hidden');setScreen('home');}
  function showToast(message){const node=$('#toast');if(!node||!message)return;node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3800);sound('soft');}
  function setAudioEnabled(value,silent=false){audioEnabled=value;save.audioEnabled=value;if(!silent)writeSave();$('#sound-button').textContent=value?'♫':'♪';$('#sound-button').setAttribute('aria-label',value?'Couper les sons':'Activer les sons');$('#home-sound-toggle').textContent=value?'♫':'♪';$('#home-sound-toggle').setAttribute('aria-label',value?'Couper les sons':'Activer les sons');$('#music-toggle').checked=value;if(value&&!silent)sound('success');updateMusic();}
  function releaseControls(){keys={left:false,right:false,jump:false,down:false};jumpBuffer=0;dpadPointer=null;Object.assign(dpadState,{left:false,right:false,up:false,down:false});document.querySelectorAll('.dpad-btn.pressed,.action-button.pressed,.jump-button.pressed').forEach(button=>button.classList.remove('pressed'));}
  function sound(kind) {
    const NONESSENTIAL = ['jump', 'open', 'soft', 'magic', 'coin', 'star', 'web', 'turbo', 'punch', 'smash', 'bump'];
    if (!audioEnabled || (!effectsEnabled && NONESSENTIAL.includes(kind))) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const t0 = audio.currentTime;
      if (kind === 'punch' || kind === 'smash') {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(kind === 'smash' ? 190 : 150, t0); osc.frequency.exponentialRampToValueAtTime(45, t0 + .22);
        gain.gain.setValueAtTime(kind === 'smash' ? .16 : .12, t0); gain.gain.exponentialRampToValueAtTime(.0001, t0 + .26);
        osc.connect(gain); gain.connect(audio.destination); osc.start(t0); osc.stop(t0 + .28);
        if (kind === 'smash') {
          const len = audio.sampleRate * .3, buf = audio.createBuffer(1, len, audio.sampleRate), data = buf.getChannelData(0);
          for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
          const src = audio.createBufferSource(), ng = audio.createGain(), lp = audio.createBiquadFilter();
          lp.type = 'lowpass'; lp.frequency.value = 1800; ng.gain.value = .14; src.buffer = buf; src.connect(lp); lp.connect(ng); ng.connect(audio.destination); src.start(t0);
        }
        return;
      }
      const notes = { start: [523, 659], jump: [440], open: [392], soft: [330], magic: [784, 988], coin: [988, 1318], star: [1175, 1568], success: [659, 784, 988], finish: [523, 659, 784, 1047], web: [520, 740, 1040], turbo: [330, 440, 587, 784], sticker: [784, 988, 1175, 1568], bump: [180] };
      (notes[kind] || [440]).forEach((freq, i) => {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = kind === 'web' || kind === 'turbo' ? 'triangle' : 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(.0001, t0 + i*.07); gain.gain.exponentialRampToValueAtTime(kind === 'finish' || kind === 'sticker' ? .045 : .025, t0 + i*.07 + .02); gain.gain.exponentialRampToValueAtTime(.0001, t0 + i*.07 + .24);
        osc.connect(gain); gain.connect(audio.destination); osc.start(t0 + i*.07); osc.stop(t0 + i*.07 + .25);
      });
    } catch {}
  }
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  $('#start-button').addEventListener('click',startToday);
  document.querySelectorAll('.hero-card').forEach(card=>card.addEventListener('click',()=>chooseHero(card.dataset.hero)));
  $('#level-grid').addEventListener('click',e=>{const card=e.target.closest('.level-card');if(card)pickLevel(Number(card.dataset.i));});
  $('#album-grid').addEventListener('click',e=>{const book=e.target.closest('.book-card');if(book){renderAlbum(Number(book.dataset.page));MM.haptic('tap');return;}const slot=e.target.closest('.album-slot.got');if(slot)openStickerDetail(Number(slot.dataset.id));});
  $('#sticker-close').addEventListener('click',closeStickerDetail);
  $('#sd-listen').addEventListener('click',()=>{cancelSpeech();sayText(stickerSpeech);});
  $('#sticker-detail').addEventListener('click',e=>{if(e.target.id==='sticker-detail')closeStickerDetail();});
  $('#level-back').addEventListener('click',()=>setScreen('hero-select'));
  $('#replay-button').addEventListener('click',()=>{if(lastFinished)startLevel(lastFinished.hero,lastFinished.index);});
  $('#next-level-button').addEventListener('click',()=>{if(lastFinished)startLevel(lastFinished.hero,lastFinished.index+1);});
  document.querySelectorAll('[data-go="home"]').forEach(b=>b.addEventListener('click',()=>setScreen('home')));
  $('.settings-open').addEventListener('click',()=>setScreen('settings-screen'));
  $('#help-art-button').addEventListener('click',()=>setScreen('howto-screen'));
  $('#home-sound-toggle').addEventListener('click',()=>setAudioEnabled(!audioEnabled));
  $('#pause-button').addEventListener('click',()=>{if(scene==='game-screen'){pausedFrom='game-screen';setScreen('pause-screen');}});
  $('#resume-button').addEventListener('click',()=>{const target=pausedFrom;setScreen(target);lastActiveTick=performance.now();if(target==='game-screen'){startLoop();if(timerAnnouncementPending)speakTimerNotice();}else if(target==='puzzle-screen')readPuzzleAloud();});
  function showStats() {
    const letters = mission?.letters?.filter(item => item.collected).length || 0;
    $('#stat-coins').textContent = `${(mission?.coins || []).filter(s => s.collected).length}/${(mission?.coins || []).length}`;
    $('#stat-friends').textContent = String(friendScore());
    $('#stat-letters').textContent = `${letters}/26`;
    $('#stat-stickers').textContent = String((mission?.stickersWon || []).length);
    $('#stat-questions').textContent = `${save.progress || 0}/${mission?.tasks?.length || 3}`;
    setScreen('stats-screen');
  }
  $('#restart-button').addEventListener('click',()=>{if(!activeHero)return;mission=createMission(activeHero,mission?.level?.index??0);save.activeMission=mission;save.activeHero=activeHero;save.progress=0;writeSave();beginGame(false);});
  $('#stats-button').addEventListener('click',showStats);$('#stats-back-button').addEventListener('click',()=>setScreen('pause-screen'));
  $('#stats-resume-button').addEventListener('click',()=>$('#resume-button').click());
  $('#puzzle-read-button').addEventListener('click',readPuzzleAloud);
  $('#quit-button').addEventListener('click',quitMission);
  {   // réinitialisation : il faut garder le doigt appuyé 3 secondes
    const btn = $('#reset-button'); let timer = 0;
    const stop = () => { clearTimeout(timer); timer = 0; btn.classList.remove('holding'); };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault(); stop(); void btn.offsetWidth; btn.classList.add('holding');
      timer = setTimeout(() => { stop(); try { localStorage.removeItem(STORE); } catch {} save = {}; MM.haptic('gold'); location.reload(); }, 3000);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, stop));
    btn.addEventListener('contextmenu', e => e.preventDefault());
  }
  fillVoiceSelect();
  $('#voice-select').addEventListener('change', e => { save.voiceName = e.target.value; writeSave(); sayText('Bonjour ! Je suis ta nouvelle voix.'); });
  $('#album-open').addEventListener('click',()=>{renderAlbum(-1);setScreen('album-screen');});
  $('#reward-continue').addEventListener('click',()=>{cancelSpeech();rewardAdvance?.();});
  $('#puzzle-close').addEventListener('click', closePuzzle);
  $('#game-read-button').addEventListener('click', () => { readPuzzleAloud(); gameCtl?.replay?.(); });
  $('#music-bg-toggle').checked = musicEnabled; $('#haptics-toggle').checked = hapticsEnabled;
  $('#music-bg-toggle').addEventListener('change', e => { musicEnabled = e.target.checked; save.musicEnabled = musicEnabled; writeSave(); updateMusic(); });
  $('#haptics-toggle').addEventListener('change', e => { hapticsEnabled = e.target.checked; save.hapticsEnabled = hapticsEnabled; writeSave(); MM.setHaptics(hapticsEnabled); if (hapticsEnabled) MM.haptic('good'); });
  $('#album-tabs').addEventListener('click', e => { const tab = e.target.closest('.album-tab'); if (tab) { renderAlbum(Number(tab.dataset.page)); MM.haptic('tap'); } });
  document.addEventListener('visibilitychange', updateMusic);
  fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(v => { $('#home-version').textContent = `v${v.version}`; }).catch(() => {});
  $('#new-mission-button').addEventListener('click',()=>{if(stopAfterMission)endSession();else setScreen('home');});
  $('#end-album-button').addEventListener('click',()=>openCityAlbum(lastFinished?lastFinished.index:0));
  
  $('#sound-button').addEventListener('click',()=>setAudioEnabled(!audioEnabled));
  $('#music-toggle').checked=audioEnabled;$('#effects-toggle').checked=effectsEnabled;
  $('#music-toggle').addEventListener('change',e=>setAudioEnabled(e.target.checked));
  $('#effects-toggle').addEventListener('change',e=>{effectsEnabled=e.target.checked;save.effectsEnabled=effectsEnabled;writeSave();});
  // Croix de déplacement : un seul doigt peut glisser d'une direction à l'autre (diagonale haut + côté = sauter en avançant).
  const dpad=$('#dpad');const dpadButtons=[...dpad.querySelectorAll('.dpad-btn')];
  function setDpad(next){if(next.up&&!dpadState.up)keys.jump=true;if(next.down&&!dpadState.down)keys.down=true;Object.assign(dpadState,next);keys.left=next.left;keys.right=next.right;dpadButtons.forEach(button=>button.classList.toggle('pressed',!!dpadState[button.dataset.dir]));}
  function dpadFromPoint(e){const r=dpad.getBoundingClientRect();const nx=(e.clientX-(r.left+r.width/2))/(r.width/2),ny=(e.clientY-(r.top+r.height/2))/(r.height/2);if(Math.hypot(nx,ny)<.18)return {left:false,right:false,up:false,down:false};return {left:nx<-.3,right:nx>.3,up:ny<-.38,down:ny>.45&&Math.abs(nx)<.5};}
  dpad.addEventListener('pointerdown',e=>{e.preventDefault();if(dpadPointer!==null||scene!=='game-screen')return;dpadPointer=e.pointerId;dpad.setPointerCapture?.(e.pointerId);setDpad(dpadFromPoint(e));});
  dpad.addEventListener('pointermove',e=>{if(e.pointerId===dpadPointer)setDpad(dpadFromPoint(e));});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>dpad.addEventListener(type,e=>{if(e.pointerId!==dpadPointer)return;dpadPointer=null;setDpad({left:false,right:false,up:false,down:false});}));
  dpad.addEventListener('contextmenu',e=>e.preventDefault());
  // Grand bouton ACTION : réagit dès l'appui, sans attendre le relâchement du doigt.
  const actionButton=$('#attack-button');
  actionButton.addEventListener('pointerdown',e=>{e.preventDefault();actionButton.classList.add('pressed');useAbility();});
  ['pointerup','pointercancel','pointerleave'].forEach(type=>actionButton.addEventListener(type,()=>actionButton.classList.remove('pressed')));
  actionButton.addEventListener('click',e=>{if(e.detail===0)useAbility();});
  actionButton.addEventListener('contextmenu',e=>e.preventDefault());
  // Bouton SAUT : saute dès l'appui (un appui un peu avant l'atterrissage est mémorisé quelques instants).
  const jumpButton=$('#jump-button');
  jumpButton.addEventListener('pointerdown',e=>{e.preventDefault();jumpButton.classList.add('pressed');if(scene==='game-screen')keys.jump=true;});
  ['pointerup','pointercancel','pointerleave'].forEach(type=>jumpButton.addEventListener(type,()=>jumpButton.classList.remove('pressed')));
  jumpButton.addEventListener('click',e=>{if(e.detail===0&&scene==='game-screen')keys.jump=true;});
  jumpButton.addEventListener('contextmenu',e=>e.preventDefault());
  const shootButton = $('#shoot-button');
  shootButton.addEventListener('pointerdown', e => { e.preventDefault(); shootButton.classList.add('pressed'); shoot(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => shootButton.addEventListener(type, () => shootButton.classList.remove('pressed')));
  shootButton.addEventListener('click', e => { if (e.detail === 0) shoot(); });
  shootButton.addEventListener('contextmenu', e => e.preventDefault());
  // Clavier : flèches, ZQSD ou WASD ; espace / haut pour sauter, bas pour descendre, X ou E pour l'action.
  const KEY_LEFT=['ArrowLeft','a','A','q','Q'],KEY_RIGHT=['ArrowRight','d','D'],KEY_JUMP=[' ','ArrowUp','w','W','z','Z'],KEY_DOWN=['ArrowDown','s','S'],KEY_ACTION=['x','X','e','E'],KEY_SHOOT=['c','C','f','F'];
  const GAME_KEYS=[...KEY_LEFT,...KEY_RIGHT,...KEY_JUMP,...KEY_DOWN,...KEY_ACTION,...KEY_SHOOT];
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');return;}if(scene!=='game-screen')return;const k=e.key;if(GAME_KEYS.includes(k))e.preventDefault();if(KEY_LEFT.includes(k))keys.left=true;if(KEY_RIGHT.includes(k))keys.right=true;if(KEY_JUMP.includes(k)){if(!e.repeat)keys.jump=true;}if(KEY_DOWN.includes(k)&&!e.repeat)keys.down=true;if(KEY_ACTION.includes(k)&&!e.repeat)useAbility();if(KEY_SHOOT.includes(k)&&!e.repeat)shoot();});
  window.addEventListener('keyup',e=>{const k=e.key;if(KEY_LEFT.includes(k))keys.left=false;if(KEY_RIGHT.includes(k))keys.right=false;});
  window.addEventListener('resize',resizeCanvas);window.addEventListener('orientationchange',()=>setTimeout(resizeCanvas,250));if('ResizeObserver' in window)new ResizeObserver(()=>{if(scene==='game-screen')resizeCanvas();}).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}});
  setAudioEnabled(audioEnabled,true);
  lastActiveTick=performance.now();setInterval(tickMissionClock,250);
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  requestAnimationFrame((t)=>{lastTime=t;});
})();
