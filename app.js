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
  // Planche des héros : une ligne par héros (Ziggy, Filou, Titan), six poses chacune. Voir « Animation des héros ».
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
  let view = { scale: 1, ox: 0, oy: 0, w: 960, h: 540 };
  let world = { width: 6200, floor: 426, camera: 0, checkpoint: 60, stations: [], gaps: [], bumps: [], platforms: [], coins: [], letters: [], enemies: [], bigFriends: [] };
  let player = { x: 70, y: 0, vx: 0, vy: 0, w: 58, h: 86, grounded: true, jumping: false, facing: 1, bob: 0 };
  let lastPromptStation = -1;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function readSave() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
  }
  function writeSave() { try { localStorage.setItem(STORE, JSON.stringify(save)); } catch {} }
  function dayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function todaysMission(heroId) {
    const template = missionTemplates[Math.floor(Math.random()*missionTemplates.length)];
    // Questions et ordre des réponses tirés au hasard à chaque mission.
    const tasks = pickQuestions(3).map(task => {
      const order = shuffle([0,1,2]);
      return { ...task, options: order.map(i => task.options[i]), answer: order.indexOf(task.answer) };
    });
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
  function createMission(heroId) { const created = todaysMission(heroId); created.title = missionTitles[heroId]; created.palette = missionPalettes[heroId].slice(); created.levelVersion = 3; return created; }
  // Recale une position de départ hors des ravins pour éviter une chute en boucle.
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
  function chooseHero(heroId) {
    if (!heroes[heroId]) return;
    if(!sessionActive){sessionActive=true;sessionElapsed=0;sessionTimerLimit=Number($('#session-timer-select').value)||0;stopAfterMission=false;timerWarningSent=false;timerAnnouncementPending=false;save.sessionActive=true;save.sessionElapsed=0;save.sessionTimerLimit=sessionTimerLimit;save.stopAfterMission=false;save.timerWarningSent=false;}$('#session-timer-row').classList.toggle('hidden',sessionActive);
    activeHero = heroId;
    mission = createMission(heroId);
    save.missionNumber=(Number(save.missionNumber)||0)+1;save.activeDate = dayKey(); save.activeHero = heroId; save.activeMission = mission; save.progress = 0; writeSave();
    beginGame(false);
  }
  function beginGame(resume) {
    if (!mission || !activeHero) return;
    // missions sauvegardées avant les nouveaux niveaux : on repart sur une mission neuve
    if (mission.levelVersion !== 3) { mission = createMission(activeHero); save.activeMission = mission; save.progress = 0; resume = false; }
    if (!Array.isArray(mission.stationsDone)) mission.stationsDone = [false, false, false];
    save.progress = mission.stationsDone.filter(Boolean).length;
    $('#mission-title').textContent = mission.title;
    $('#progress-dots').innerHTML = mission.tasks.map((_,i)=>`<span class="progress-dot ${mission.stationsDone[i] ? 'done' : ''}"></span>`).join('');
    const rnd = seeded(mission.seed);
    const level = LV.build(activeHero, seeded(mission.seed));
    world.width = level.width; world.floor = level.floor; world.camera = 0; world.checkpoint = 60;
    world.gaps = level.gaps; world.platforms = level.platforms; world.anchors = level.anchors; world.pads = level.pads;
    const broken = new Set(mission.brokenBumps || []), damage = mission.damage || {};
    world.bumps = level.bumps.filter(b => !broken.has(b.id)).map(b => ({ ...b, hp: Math.max(1, b.maxHp - (damage[b.id] || 0)), hit: -9 }));
    world.stations = level.stations.map((x, i) => ({ x, y: world.floor - 190, i, done: mission.stationsDone[i] === true, hit: false, bob: rnd()*6 }));
    world.decorations = Array.from({ length: 56 }, (_, i) => ({ x: 210 + i * 196, kind: i % 5, flower: i % 4 }));
    if (!Array.isArray(mission.coins)) mission.coins = level.stars.map((s, i) => ({ id: `s${i}`, x: s.x, y: s.y, collected: false, bob: rnd()*6 }));
    if (!Array.isArray(mission.enemies)) mission.enemies = level.enemyXs.map((x, i) => ({ id: i, x, friendly: false, bob: rnd()*6, variant: i % 4 }));
    if (!Array.isArray(mission.bigFriends)) mission.bigFriends = [];
    if (!Array.isArray(mission.letters)) mission.letters = level.letterSpots.map((spot, i) => ({ letter: ALPHABET[i], x: spot.x, y: spot.y, diff: spot.diff, collected: false, bob: rnd()*6 }));
    world.coins = mission.coins; world.enemies = mission.enemies; world.bigFriends = mission.bigFriends; world.letters = mission.letters;
    world.hintAnchor = null;
    updateStarCounter(); updateFriendCounter(); updateLetterCounter();
    $('#home-hint').classList.toggle('hidden', !world.stations.every(station => station.done));
    player = { x: 70, y: world.floor - 86, vx: 0, vy: 0, w: 58, h: 86, grounded: true, jumping: false, facing: 1, bob: 0, carryVx: 0 };
    player.x = safeGroundX(resume ? (mission.checkpointX || 200) : 200);
    world.checkpoint = player.x;
    swing = null; fizzle = null; turboUntil = 0; turboReady = 0; punchReady = 0; coyote = 0; gt = 0; jumpBuffer = 0;
    FX.clear(); heroAnim = newHeroAnim(); lastPromptStation = -1;
    lastActiveTick = performance.now(); lastTime = performance.now();
    const power = { ziggy: ['☄️', 'TURBO', 'Action : turbo, très rapide'], filou: ['🕸️', 'TOILE', 'Action : lancer la toile et se balancer'], titan: ['👊', 'POING', 'Action : gros coup de poing'] }[activeHero];
    $('#attack-button .action-power').textContent = power[0]; $('#attack-button small').textContent = power[1]; $('#attack-button').setAttribute('aria-label', power[2]);
    $('#attack-button').classList.remove('cooldown', 'active'); abilityReadyShown = true;
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
    view.scale = Math.min(canvas.height/540, canvas.width/520);
    view.w = canvas.width/view.scale; view.h = canvas.height/view.scale;
    view.ox = 0; view.oy = (view.h-540)*view.scale;
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
    const turboOn = gt < turboUntil;
    if (move && !swing) player.facing = move;
    const speed = hero === 'ziggy' ? 270 : 235;
    if (swing) player.vx = 0;
    else if (!player.grounded && player.carryVx) { player.vx = player.carryVx + move * 90; player.facing = player.vx >= 0 ? 1 : -1; }
    else player.vx = turboOn ? player.facing * TURBO_SPEED : move * speed;
    updateHeroAnimation(dt);
    updateAbilityButton();
    // saut : l'appui est mémorisé un instant, et on peut sauter juste après avoir quitté le sol
    if (keys.jump) { jumpBuffer = .14; keys.jump = false; }
    coyote = player.grounded ? .09 : Math.max(0, coyote - dt);
    if (jumpBuffer > 0) {
      jumpBuffer -= dt;
      if (swing) { releaseSwing(true); jumpBuffer = 0; }
      else if (player.grounded || coyote > 0) { doJump(turboOn); jumpBuffer = 0; coyote = 0; }
    }
    if (swing) updateSwing(dt);
    else if (moveAndCollide(dt, turboOn)) return;
    if (player.y > 650) respawn();
    // la maison au bout du chemin termine la mission, qu'on ait ouvert toutes les caisses ou non
    if (player.x + player.w >= world.width - 150 && player.grounded && !swing) { finishMission(); return; }
    // plaques de vitesse (Ziggy)
    if (hero === 'ziggy' && player.grounded && gt >= turboUntil) {
      const cx = player.x + player.w/2;
      if (world.pads.some(p => cx > p.x && cx < p.x + p.w)) startTurbo(1.3, true);
    }
    // les amis suivent le héros
    let leaderX = player.x + player.w/2 - player.facing*56;
    const followers = [...world.bigFriends, ...world.enemies.filter(enemy => enemy.friendly)].sort((a,b) => (a.friendOrder ?? 0) - (b.friendOrder ?? 0));
    followers.forEach((friend, index) => {
      const spacing = friend.giant ? 84 : 54, targetX = leaderX - player.facing*spacing, targetY = player.y + player.h - 20;
      const fy = Number.isFinite(friend.y) ? friend.y : world.floor - 20;
      friend.x += (targetX - friend.x) * Math.min(1, dt*7); friend.y = fy + (targetY - fy) * Math.min(1, dt*6); friend.followIndex = index; leaderX = friend.x;
    });
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
    drawSky(time); drawHills(); drawTown(time); drawWorld(time); drawPlayer(time); FX.draw(ctx, world.camera); drawAmbient(time);
  }
  function drawSky(time){const W=view.w,p=mission?.palette||[],extra=Math.max(0,view.h-540);const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,p[0]||'#70d0f4');g.addColorStop(.67,p[2]||'#c8f1fa');g.addColorStop(1,'#e8f9e9');ctx.fillStyle=g;ctx.fillRect(0,-extra-2,W,extra+544);for(let i=0;i<Math.ceil(W/260)+2;i++){const x=((i*260-world.camera*.16+time*3)%(W+260))-130,y=55+(i%3)*48;cloud(x,y,1+(i%2)*.18);}if(extra>40)for(let i=0;i<Math.ceil(W/300)+2;i++){const x=((i*300-world.camera*.1+time*2)%(W+300))-150,y=-extra*(.2+(i%3)*.25);cloud(x,y,1.1+(i%2)*.25);}}
  function cloud(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.ellipse(0,12,49,18,0,0,Math.PI*2);ctx.ellipse(-23,2,24,20,0,0,Math.PI*2);ctx.ellipse(0,-5,28,27,0,0,Math.PI*2);ctx.ellipse(26,4,24,19,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawHills(){const W=view.w,p=mission?.palette||[];ctx.fillStyle=p[1]||'#9edba8';ctx.beginPath();ctx.moveTo(0,355);for(let x=0;x<=W;x+=5){ctx.lineTo(x,350+28*Math.sin((x+world.camera*.18)/160)+16*Math.sin(x/63));}ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();ctx.fillStyle='#78c98e';ctx.beginPath();ctx.moveTo(0,395);for(let x=0;x<=W;x+=5)ctx.lineTo(x,390+22*Math.sin((x+world.camera*.31)/125));ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();}
  function drawTown(time) {
    const W = view.w, cam = world.camera;
    if (activeHero === 'filou') {
      // la ville : deux rangées d'immeubles qui défilent à des vitesses différentes
      const layers = [{ k: .2, base: 392, col: '#c4cdf0', win: '#dfe6fb', min: 150, max: 330, step: 118 }, { k: .4, base: 400, col: '#a9b8ea', win: '#cdd8f6', min: 120, max: 260, step: 140 }];
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
      return;
    }
    for (let i = 0; i < Math.ceil(W/430)+3; i++) {
      const wx = i*430 + 80, x = wx - cam*.48; if (x < -130 || x > W+130) continue;
      const h = 110 + (i%3)*22, w = 108 + (i%2)*25, y = 390 - h;
      ctx.fillStyle = ['#f8bb86','#f3d27f','#b9dcec','#d7b7e6'][i%4]; roundRect(x, y, w, h, 10, true);
      ctx.fillStyle = '#e8877d'; ctx.beginPath(); ctx.moveTo(x-9, y+4); ctx.lineTo(x+w/2, y-44); ctx.lineTo(x+w+9, y+4); ctx.closePath(); ctx.fill();
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { ctx.fillStyle = 'rgba(255,255,255,.86)'; roundRect(x+18+c*44, y+26+r*34, 19, 23, 6, true); ctx.fillStyle = '#90cadf'; ctx.fillRect(x+26+c*44, y+26+r*34, 3, 23); ctx.fillRect(x+18+c*44, y+36+r*34, 19, 3); }
      ctx.fillStyle = '#ab7860'; roundRect(x+w/2-13, y+h-53, 26, 53, 12, true);
    }
    for (let i = 0; i < Math.ceil(W/600)+2; i++) {
      const x = i*600 + 230 - cam*.75; if (x < -70 || x > W+70) continue;
      ctx.fillStyle = '#946b53'; roundRect(x-7, 326, 14, 100, 7, true);
      ctx.fillStyle = ['#69c57c','#82d58d','#60b978'][i%3]; ctx.beginPath(); ctx.arc(x, 310, 43, 0, Math.PI*2); ctx.arc(x-26, 321, 30, 0, Math.PI*2); ctx.arc(x+25, 320, 31, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.23)'; ctx.beginPath(); ctx.arc(x-13, 291, 14, 0, Math.PI*2); ctx.fill();
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
  function drawWorld(time) {
    const W = view.w, p = mission?.palette || [], F = world.floor, cam = world.camera;
    const inGap = (x, m = 0) => world.gaps.some(g => x > g.x - m && x < g.x + g.w + m);
    ctx.fillStyle = p[1] || '#76c78d'; ctx.fillRect(0, F, W, 120);
    ctx.fillStyle = '#8ed49c'; ctx.fillRect(0, F+13, W, 7);
    ctx.fillStyle = '#d6b785'; ctx.fillRect(0, F+25, W, 145);
    ctx.fillStyle = '#c5a577'; for (let i = -1; i < Math.ceil(W/80)+2; i++) { const x = ((i*80 - cam*.9) % (W+80)); ctx.fillRect(x, F+42, 48, 3); }
    world.gaps.forEach(gap => {
      const x = gap.x - cam; if (x + gap.w < 0 || x > W) return;
      ctx.fillStyle = '#956b49'; ctx.fillRect(x, F, gap.w, 66); ctx.fillStyle = '#65c9e9'; ctx.fillRect(x, F+16, gap.w, 96);
      ctx.fillStyle = '#a4eff8'; for (let i = 0; i < Math.ceil(gap.w/47); i++) { ctx.beginPath(); ctx.ellipse(x+18+i*47, F+43+(i%2)*19, 20, 4, 0, 0, Math.PI*2); ctx.fill(); }
      ctx.fillStyle = '#398faa'; ctx.fillRect(x, F+106, gap.w, 60);
    });
    for (let i = 0; i < Math.ceil(W/120)+2; i++) { const x = (i*120 + 35 - cam*.9) % (W+120); if (!inGap(x + cam, 10)) flower(x, F+7, i%4); }
    world.platforms.forEach(pl => { if (pl.bld) drawBuilding(pl); });
    world.decorations.forEach(item => {
      const x = item.x - cam; if (x < -90 || x > W+90 || inGap(item.x, 40)) return;
      if (activeHero === 'filou' && world.platforms.some(pl => pl.bld && item.x > pl.x - 30 && item.x < pl.x + pl.w + 30)) return;
      const y = F; ctx.save();
      if (item.kind === 0) { ctx.fillStyle = '#8d6046'; ctx.fillRect(x-25, y-27, 50, 5); ctx.fillRect(x-23, y-40, 46, 5); ctx.fillRect(x-18, y-22, 4, 18); ctx.fillRect(x+14, y-22, 4, 18); }
      else if (item.kind === 1) { ctx.fillStyle = '#8b6748'; ctx.fillRect(x-3, y-56, 6, 56); ctx.fillStyle = '#ffedb0'; roundRect(x-25, y-70, 50, 25, 7, true); ctx.fillStyle = '#557c76'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('➜', x, y-52); }
      else if (item.kind === 2) { ctx.fillStyle = '#c48461'; roundRect(x-24, y-19, 48, 19, 5, true); flower(x-12, y-19, item.flower); flower(x+3, y-21, (item.flower+1)%4); flower(x+15, y-18, (item.flower+2)%4); }
      else if (item.kind === 3) { ctx.fillStyle = '#8b6748'; ctx.fillRect(x-3, y-68, 6, 68); ctx.fillStyle = '#f7d66e'; roundRect(x-12, y-78, 24, 18, 8, true); ctx.fillStyle = 'rgba(255,239,163,.35)'; ctx.beginPath(); ctx.arc(x, y-64, 24, 0, Math.PI*2); ctx.fill(); }
      else { ctx.fillStyle = '#b6a27e'; ctx.beginPath(); ctx.ellipse(x, y-3, 24, 6, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#fff0c0'; ctx.beginPath(); ctx.arc(x-7, y-4, 2, 0, Math.PI*2); ctx.arc(x+6, y-3, 2, 0, Math.PI*2); ctx.fill(); }
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
      const top = platform.y;
      ctx.fillStyle = platform.type === 0 ? '#9c755a' : '#73be84'; roundRect(x, top, platform.w, platform.h, 8, true);
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
    [...world.enemies, ...world.bigFriends].forEach(enemy => {
      const x = enemy.x - cam; if (x < -75 || x > W + 75) return;
      const y = enemy.friendly ? (enemy.y ?? F-20) + Math.sin(time*4 + enemy.bob)*2 : F-20 + Math.sin(time*3 + enemy.bob)*4;
      drawCuteEnemy(x, y, time, enemy);
    });
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
  function drawCuteEnemy(x,y,time,enemy={}){const friendly=enemy.friendly;const palettes=[['#8d82d8','#c5bafa'],['#68b8ce','#a8e1e8'],['#e89b69','#ffd1a0'],['#80b779','#c3e49a']];const colors=palettes[enemy.variant%palettes.length]||palettes[0];ctx.save();ctx.translate(x,y);if(enemy.giant)ctx.scale(1.48,1.48);ctx.fillStyle=enemy.giant?'#e9575c':friendly?'#ffb5c8':colors[0];ctx.beginPath();ctx.ellipse(0,0,24,21,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=enemy.giant?'#ffad67':friendly?'#ffdf8d':colors[1];ctx.beginPath();ctx.arc(-10,-15,8,0,Math.PI*2);ctx.arc(10,-15,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-8,-2,5,7,0,0,Math.PI*2);ctx.ellipse(8,-2,5,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#34425e';ctx.beginPath();ctx.arc(-7,-1,2.2,0,Math.PI*2);ctx.arc(9,-1,2.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a94f68';ctx.lineWidth=2;ctx.beginPath();ctx.arc(1,6,5,.15,Math.PI-.15);ctx.stroke();ctx.fillStyle='#fff0a3';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(friendly?'♥':'✦',0,-28-Math.sin(time*5)*2);ctx.restore();}
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
    const a = heroAnim, t = a.timers;
    if (swing) return POSE.jump;                                                 // en train de se balancer au bout de la toile
    if (t.punch) return POSE.land;                                               // coup de poing : posture de force
    if (t.stumble) return a.stumbleAge < .18 ? POSE.duck : POSE.dodge;          // choc : on se protège, puis on recule
    if (t.ability) return activeHero === 'ziggy' ? POSE.dodge : activeHero === 'filou' ? POSE.jump : POSE.land;
    if (t.drop) return POSE.duck;                                                // on se baisse pour descendre d'une plateforme
    if (t.celebrate) return POSE.jump;                                           // bravo !
    if (!player.grounded) return POSE.jump;                                      // montée et descente
    if (t.land && t.land > .14) return POSE.land;                                // réception
    if (Math.abs(player.vx) > 12) return Math.floor(a.phase) % 2 ? POSE.walkB : POSE.walkA;
    return HERO_IDLE[activeHero] ?? POSE.walkB;
  }
  function drawHero(c, x, feetY, time) {
    if (!heroAtlas.complete || !heroAtlas.naturalWidth) return;
    const A = HERO_ATLAS, a = heroAnim, pose = choosePose(), row = HERO_ROW[activeHero] ?? 0;
    const dw = A.cellW * A.scale, dh = A.cellH * A.scale;
    const walking = player.grounded && Math.abs(player.vx) > 12 && !a.timers.ability;
    // ombre au sol : suit le héros, rétrécit quand il saute, disparaît au-dessus d'un ravin
    const overGap = world.gaps.some(g => player.x + player.w * .5 > g.x && player.x + player.w * .5 < g.x + g.w);
    const groundY = player.grounded ? feetY : Math.max(feetY, world.floor);
    if (player.grounded || !overGap) {
      const lift = clamp((groundY - feetY) / 260, 0, .6);
      c.save(); c.fillStyle = `rgba(34,76,96,${.22 * (1 - lift)})`; c.beginPath(); c.ellipse(x, groundY + 1, 30 * (1 - lift * .8), 7 * (1 - lift * .8), 0, 0, Math.PI * 2); c.fill(); c.restore();
    }
    // mouvements du corps
    const lunge = a.timers.punch ? Math.sin(Math.min(1, (.32 - a.timers.punch) / .32) * Math.PI) * 18 : 0;
    const hop = a.timers.celebrate ? Math.abs(Math.sin((a.time - a.celebrateStart) * 10)) * 15 : 0;
    const bob = walking ? Math.abs(Math.sin(a.phase * Math.PI)) * 3.5 : 0;
    const breathe = !walking && player.grounded && pose === (HERO_IDLE[activeHero] ?? POSE.walkB) ? Math.sin(a.time * 2.6) * .012 : 0;
    let tilt = 0;
    if (swing) tilt = clamp(-swing.theta * player.facing * .8, -.9, .9);
    else if (!player.grounded) tilt = clamp(player.vy * .00018, -.09, .14);
    else if (a.timers.ability && activeHero === 'ziggy') tilt = .1;
    else if (walking) tilt = .03;
    const sx = 1 - a.squash * .6 - breathe * .5, sy = 1 + a.squash + breathe;
    c.save();
    const prevSmoothing = c.imageSmoothingEnabled; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    const drawPose = (offsetX, alpha) => {
      c.save(); c.globalAlpha = alpha;
      c.translate(x + offsetX + player.facing * lunge, feetY - hop - bob + A.pad * A.scale); c.scale(player.facing, 1);
      const pivot = swing ? .85 : .35; c.translate(0, -dh * pivot); c.rotate(tilt); c.translate(0, dh * pivot);   // on s'incline depuis les hanches
      c.scale(sx, sy);
      c.drawImage(heroAtlas, pose * A.cellW, row * A.cellH, A.cellW, A.cellH, -dw / 2, -dh, dw, dh);
      c.restore();
    };
    // Ziggy fonce : trois images fantômes derrière lui
    if (a.timers.ability && activeHero === 'ziggy') for (let i = 3; i >= 1; i--) drawPose(-player.facing * i * 24, .16 / i * 1.6);
    drawPose(0, 1);
    c.imageSmoothingEnabled = prevSmoothing;
    c.restore();
  }
  function roundRect(x,y,w,h,r,fill=true){ctx.beginPath();if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else{ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);}if(fill)ctx.fill();else ctx.stroke();}
  function cancelSpeech(requeueTimer=true){speechToken++;MM.music.duck(false);if(timerNoticePlaying){timerNoticePlaying=false;if(requeueTimer){timerAnnouncementPending=true;save.timerAnnouncementPending=true;writeSave();}}if('speechSynthesis'in window)window.speechSynthesis.cancel();}
  function sayText(text,onComplete){if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window))return false;cancelSpeech(false);const token=++speechToken;const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.88;utterance.pitch=1.02;utterance.volume=1;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>/^fr-BE/i.test(v.lang))||voices.find(v=>/^fr-FR/i.test(v.lang))||voices.find(v=>/^fr/i.test(v.lang))||null;utterance.voice=voice;utterance.lang=voice?.lang||'fr-FR';MM.music.duck(true);utterance.onend=()=>{if(token===speechToken){MM.music.duck(false);onComplete?.(true);}};utterance.onerror=()=>{if(token===speechToken){MM.music.duck(false);onComplete?.(false);}};window.speechSynthesis.speak(utterance);return true;}
  function speakTimerNotice(onComplete){if(!timerAnnouncementPending){onComplete?.();return;}timerAnnouncementPending=false;const started=sayText('On va bientôt terminer. Tu peux finir cette mission tranquillement. Après, ton héros ira se reposer.',()=>{timerNoticePlaying=false;save.timerAnnouncementPending=false;save.sessionElapsed=sessionElapsed;writeSave();onComplete?.();if(scene==='puzzle-screen'&&puzzleTask&&!puzzleResolved&&!onComplete)readPuzzleAloud();});timerNoticePlaying=started;if(!started){save.timerAnnouncementPending=false;writeSave();onComplete?.();}}
  function readPuzzleAloud() {
    if (!puzzleTask || puzzleResolved || timerNoticePlaying) return;
    const text = `${puzzleTask.prompt} Choisis une réponse : ${puzzleTask.options.map(option => option[1]).join('. ')}.`;
    const btn = $('#puzzle-read-button');
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
    $('#puzzle-main').classList.remove('hidden'); $('#puzzle-reward').classList.add('hidden');
    $('#puzzle-icon').textContent = puzzleTask.icon || mission.icon;
    $('#puzzle-question').textContent = puzzleTask.prompt;
    $('#puzzle-feedback').textContent = ''; $('#puzzle-read-button').classList.remove('speaking');
    const list = $('#choice-list'); list.innerHTML = '';
    puzzleTask.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-button';
      b.innerHTML = `<span>${escapeHtml(opt[0])}</span><span>${escapeHtml(opt[1])}</span>`;
      b.addEventListener('click', () => chooseOption(i, b));
      list.appendChild(b);
    });
    setScreen('puzzle-screen');
    if (!timerNoticePlaying) readPuzzleAloud();
  }
  function advanceAfterPuzzle() {
    if (scene !== 'puzzle-screen') return;
    const advance = () => {
      if (scene !== 'puzzle-screen') return;
      puzzleTask = null; puzzleStation = null; world.checkpoint = Math.max(world.checkpoint, safeGroundX(player.x)); mission.checkpointX = world.checkpoint;
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
    puzzleResolved = true;
    choices.forEach(choice => choice.disabled = true);
    const station = puzzleStation;
    if (station && !station.done) { station.done = true; mission.stationsDone[station.i] = true; save.progress = mission.stationsDone.filter(Boolean).length; writeSave(); $('#progress-dots').children[station.i]?.classList.add('done'); sprinkle(station.x, world.floor - 90); }
    triggerHeroAnimation('celebrate', 1250);
    $('#puzzle-feedback').textContent = '👏';
    sound('success'); MM.haptic('good');
    showReward(praisePhrases[Math.floor(Math.random()*praisePhrases.length)]); // chaque bonne réponse : un autocollant de bronze
  }
  function friendScore(){return (mission?.bigFriends?.length||0)*10+(mission?.enemies||[]).filter(enemy=>enemy.friendly).length;}
  function updateFriendCounter(){const node=$('#friend-count');if(node)node.textContent=String(friendScore());}
  function updateLetterCounter(){const node=$('#letter-count');if(node)node.textContent=`${(mission?.letters||[]).filter(letter=>letter.collected).length}/26`;}
  function finishMission() {
    if (scene === 'ending-screen') return;
    save.activeMission = null; save.activeHero = null; save.activeDate = null; save.progress = 0; save.sessionElapsed = sessionElapsed; save.stopAfterMission = stopAfterMission; writeSave();
    $('#ending-hero').innerHTML = `<span class="sprite" style="--col:2;--row:${HERO_ROW[activeHero] ?? 0}"></span>`;
    const littleFriends = mission.enemies.filter(enemy => enemy.friendly).sort((a, b) => (a.friendOrder ?? 0) - (b.friendOrder ?? 0));
    const parade = [...littleFriends, ...(mission.bigFriends || [])].sort((a, b) => (a.friendOrder ?? 0) - (b.friendOrder ?? 0));
    const friendCount = friendScore();
    $('#ending-friends').innerHTML = friendCount ? `<div class="friend-parade" aria-label="${friendCount} amis">${parade.map((friend, index) => `<span class="parade-friend ${friend.giant ? 'parade-giant' : ''}" style="--friend-delay:${index*45}ms" aria-hidden="true"><i></i><b>♥</b></span>`).join('')}</div><small>♥ ${friendCount}</small>` : '';
    $('#ending-friends').classList.toggle('hidden', friendCount === 0);
    const won = mission.stickersWon || [], S = MM.stickers, box = $('#ending-stickers');
    box.classList.toggle('hidden', !won.length);
    box.innerHTML = won.length ? `<div class="sticker-row">${won.map((w, n) => { const info = S.info(w.id); return `<span class="${w.tier}" style="--r:${n % 2 ? 5 : -5}deg;--d:${n * 90}ms" aria-label="${escapeHtml(cap(info.n))}">${info.e}</span>`; }).join('')}</div>` : '';
    const found = mission.letters.filter(item => item.collected).map(item => item.letter);
    const stars = mission.coins.filter(s => s.collected).length;
    $('#ending-stars').textContent = `⭐ ${stars}/${mission.coins.length}`;
    $('#alphabet-grid').innerHTML = ALPHABET.map(letter => `<span class="alphabet-letter ${found.includes(letter) ? 'found' : 'missing'}" aria-label="${letter} ${found.includes(letter) ? 'récoltée' : 'pas encore récoltée'}">${letter}</span>`).join('');
    $('#alphabet-summary').textContent = `${found.length}/26`;
    $('.rest-card').classList.toggle('hidden', !stopAfterMission);
    $('#new-mission-button').classList.toggle('hidden', stopAfterMission);
    $('#finish-button').innerHTML = stopAfterMission ? 'Terminer <span>♥</span>' : 'Terminer <span>♥</span>';
    setScreen('ending-screen'); sound('finish'); MM.haptic('good');
  }
  function quitMission() {
    cancelSpeech();
    save.activeMission = null; save.activeHero = null; save.activeDate = null; save.progress = 0; writeSave();
    mission = null; activeHero = null; puzzleTask = null; puzzleStation = null;
    releaseControls();
    startToday(); // propose de choisir une nouvelle mission (ou le repos si le minuteur est écoulé)
  }
  // Récompense : un autocollant (nouveau de préférence) et quelques pièces.
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
    if (turbo) { turboUntil = Math.max(turboUntil, gt + .55); FX.ring(x, y, '#ffe36e', 70, .35, 6); FX.sparkle(x, y, 10, ['#fff3a0', '#ffb0d0', '#a8e8ff'], 200); MM.haptic('turbo'); }
    else MM.haptic('jump');
    FX.dust(x, y, 0, 4);
    triggerHeroAnimation('jump', 360); sound('jump');
  }
  function respawn() {
    swing = null; turboUntil = 0; player.carryVx = 0;
    FX.sparkle(player.x + player.w/2, world.floor - 40, 8, ['#d6ecff', '#ffffff'], 120);
    player.x = safeGroundX(world.checkpoint); player.y = world.floor - player.h; player.vx = 0; player.vy = 0; player.grounded = true;
  }
  function findAnchor() {
    const hx = player.x + player.w/2, hy = player.y + 12;
    let best = null, bd = 1e9;
    for (const a of world.anchors) {
      const dir = a.x >= hx ? 1 : -1, d = Math.abs(a.x - hx);
      if (d < bd && SW.canReach(a, hx, hy, dir)) { bd = d; best = a; }
    }
    return best;
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
  function releaseSwing(manual) {
    const s = swing; if (!s) return;
    const v = SW.velocity(s);
    player.carryVx = v.vx; player.vx = v.vx; player.vy = v.vy - (manual ? 140 : 0);
    if (Math.abs(player.carryVx) < 120) player.carryVx = 120 * s.dir;
    player.grounded = false; player.jumping = true; swing = null;
    const x = player.x + player.w/2, y = player.y + 20;
    FX.ring(x, y, '#e7d8ff', 50, .3, 4); FX.sparkle(x, y, 8, ['#ffffff', '#d8c8ff'], 160);
    triggerHeroAnimation('jump', 360); MM.haptic('jump');
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
  function ziggyTurbo() {
    if (gt < turboReady) return;
    startTurbo(1.4, false);
    convertNearbyEnemy(150);
  }
  function filouWeb() {
    if (swing) { releaseSwing(true); return; }
    const a = findAnchor();
    if (a) { attachWeb(a); return; }
    // pas d'ancre à portée : la toile part dans le vide, et un farceur proche devient ami
    fizzle = { x: player.x + player.w/2, y: player.y + 20, dir: player.facing, t: 0 };
    sound('web'); MM.haptic('tap');
    convertNearbyEnemy(175);
  }
  function titanPunch() {
    if (gt < punchReady) return;
    punchReady = gt + .42;
    triggerHeroAnimation('punch', 320);
    const dir = player.facing, cx = player.x + player.w/2;
    const x0 = dir > 0 ? cx : cx - 170, x1 = dir > 0 ? cx + 170 : cx;
    const fx = cx + dir * 96, fy = player.y + 38;
    FX.ring(fx, fy, '#fff6c4', 62, .3, 7); FX.sparkle(fx, fy, 8, ['#fff3a0', '#ffffff', '#ffb02e'], 220);
    sound('punch'); MM.haptic('punch'); FX.shake(3, .16);
    let hit = false;
    for (const b of world.bumps.slice()) if (b.kind !== 'small' && b.x < x1 && b.x + b.w > x0) { hitBump(b, 'punch'); hit = true; }
    if (!convertNearbyEnemy(170) && !hit) FX.dust(fx, world.floor, dir, 3);
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
  function convertNearbyEnemy(radius) {
    const cx = player.x + player.w/2;
    const nearby = world.enemies.filter(enemy => !enemy.friendly && Math.abs(enemy.x - cx) < radius).sort((a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx))[0];
    if (nearby) { collectFriendlyEnemy(nearby); return true; }
    return false;
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
      }
    }
    void cx;
  }
  function awardSticker(tier) {
    const album = save.album = save.album || {};
    const { id, isNew } = MM.stickers.pick(tier, album);
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
  function renderAlbum(page) {
    const S = MM.stickers, album = save.album || {};
    page = Math.max(0, Math.min(S.PAGES.length - 1, page ?? save.albumPage ?? 0)); save.albumPage = page;
    $('#album-tabs').innerHTML = S.PAGES.map((p, i) => {
      const n = S.pageOwned(album, i), done = n === S.PER_PAGE;
      return `<button type="button" class="album-tab ${i === page ? 'on' : ''} ${done ? 'full' : ''}" data-page="${i}" role="tab" aria-selected="${i === page}" aria-label="${escapeHtml(p.title)} : ${n} sur ${S.PER_PAGE}" style="--c:${p.color}"><span>${p.icon}</span><small>${n}/${S.PER_PAGE}</small></button>`;
    }).join('');
    const pg = S.PAGES[page];
    $('#album-page-title').innerHTML = `<span style="--c:${pg.color}">${pg.icon} ${escapeHtml(pg.title)}</span>`;
    $('#album-grid').style.setProperty('--c', pg.color);
    $('#album-grid').innerHTML = pg.slots.map((slot, si) => {
      const id = page * S.PER_PAGE + si, count = album[id] || 0;
      return count > 0
        ? `<div class="album-slot got ${slot.tier}" role="listitem" aria-label="${escapeHtml(cap(slot.n))}"><i class="medal">${S.TIERS[slot.tier].medal}</i><span>${slot.e}</span>${count > 1 ? `<b class="count">×${count}</b>` : ''}</div>`
        : `<div class="album-slot ${slot.tier}" role="listitem" aria-label="Autocollant ${S.TIERS[slot.tier].label.toLowerCase()} à gagner"><i class="medal">${S.TIERS[slot.tier].medal}</i><span class="ghost">${slot.e}</span></div>`;
    }).join('');
    $('#album-total').textContent = `${S.owned(album)}/${S.TOTAL}`;
  }
  function showReward(praise) {
    const { id, isNew } = awardSticker('bronze');
    const info = MM.stickers.info(id);
    const panel = $('#puzzle-reward');
    $('#puzzle-main').classList.add('hidden'); panel.classList.remove('hidden');
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
  function collectFriendlyEnemy(enemy) {
    triggerHeroAnimation('collect', 400); MM.haptic('friend');
    enemy.friendly = true;
    enemy.friendOrder = Math.max(-1, ...mission.enemies.map(item => Number(item.friendOrder) || 0), ...mission.bigFriends.map(item => Number(item.friendOrder) || 0)) + 1;
    enemy.x = player.x + player.w/2; enemy.y = player.y + player.h - 20;
    FX.heart(enemy.x, enemy.y - 10); FX.sparkle(enemy.x, enemy.y, 8, ['#ffb5c8', '#ffdf8d', '#ffffff'], 140);
    const smallFriends = mission.enemies.filter(item => item.friendly).sort((a, b) => (a.friendOrder ?? 0) - (b.friendOrder ?? 0));
    if (smallFriends.length >= 10) {
      const gathered = smallFriends.slice(0, 10);
      mission.enemies = mission.enemies.filter(item => !gathered.includes(item)); world.enemies = mission.enemies;
      mission.bigFriends.push({ id: `red-friend-${mission.bigFriends.length + 1}`, x: player.x + player.w/2, y: player.y + player.h - 20, friendly: true, giant: true, bob: 0, friendOrder: Math.max(...gathered.map(item => item.friendOrder)) });
      world.bigFriends = mission.bigFriends;
      FX.confetti(player.x + player.w/2, player.y, 20);
    }
    updateFriendCounter(); writeSave();
  }
  function drawBuilding(pl) {
    const W = view.w, F = world.floor, x = pl.x - world.camera; if (x < -260 || x > W + 60) return;
    const top = pl.y, h = F - top, w = pl.w, c = pl.bld.color;
    ctx.fillStyle = c; roundRect(x, top + 6, w, h - 6, 6, true);
    ctx.strokeStyle = 'rgba(80,50,40,.35)'; ctx.lineWidth = 4; roundRect(x, top + 6, w, h - 6, 6, false);
    ctx.fillStyle = 'rgba(0,0,0,.09)'; ctx.fillRect(x + w - 14, top + 14, 14, h - 14);
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(x + 6, top + 14, 6, h - 20);
    const cols = Math.max(1, Math.floor((w - 28) / 38)), rows = Math.max(1, Math.floor((h - 70) / 44));
    const gx = x + (w - cols * 38 + 12) / 2;
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const lit = (hash(`${pl.x}-${r}-${k}`) % 3) === 0;
      ctx.fillStyle = lit ? '#ffe9a0' : '#e8f5ff'; roundRect(gx + k * 38, top + 28 + r * 44, 26, 30, 6, true);
      ctx.fillStyle = 'rgba(70,120,160,.35)'; ctx.fillRect(gx + k * 38 + 12, top + 28 + r * 44, 2, 30); ctx.fillRect(gx + k * 38, top + 42 + r * 44, 26, 2);
    }
    ctx.fillStyle = '#a56f58'; roundRect(x + w / 2 - 15, F - 46, 30, 46, 14, true);
    // toit : la plateforme sur laquelle on atterrit
    ctx.fillStyle = pl.bld.roof; roundRect(x - 8, top - 4, w + 16, 20, 7, true);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; roundRect(x - 2, top - 2, w + 4, 6, 4, true);
    if (hash(`${pl.x}`) % 2) { ctx.fillStyle = '#9aa6bd'; roundRect(x + w - 56, top - 22, 34, 20, 4, true); ctx.fillStyle = '#7d8aa3'; ctx.fillRect(x + w - 56, top - 8, 34, 4); }
    else { ctx.strokeStyle = '#7d8aa3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 40, top - 4); ctx.lineTo(x + 40, top - 36); ctx.stroke(); ctx.fillStyle = '#ff6b6b'; ctx.beginPath(); ctx.arc(x + 40, top - 38, 4, 0, Math.PI*2); ctx.fill(); }
  }
  function drawBump(b, time) {
    const W = view.w, F = world.floor, x0 = b.x - world.camera; if (x0 < -140 || x0 > W + 140) return;
    const wob = gt - b.hit < .25 ? Math.sin((gt - b.hit) * 60) * 3 * (1 - (gt - b.hit) / .25) : 0, x = x0 + wob, top = F - b.h, damaged = b.hp < b.maxHp;
    ctx.save();
    if (b.kind === 'boulder') {
      ctx.fillStyle = '#8c9a9a'; ctx.beginPath(); ctx.moveTo(x + 4, F); ctx.lineTo(x + 2, F - b.h * .62); ctx.lineTo(x + b.w * .2, top + b.h * .12); ctx.lineTo(x + b.w * .5, top); ctx.lineTo(x + b.w * .82, top + b.h * .1); ctx.lineTo(x + b.w, F - b.h * .5); ctx.lineTo(x + b.w - 4, F); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#d6dfdb'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.ellipse(x + b.w * .34, top + b.h * .34, b.w * .16, b.h * .09, -.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.ellipse(x + b.w * .66, F - b.h * .22, b.w * .2, b.h * .12, .3, 0, Math.PI*2); ctx.fill();
      if (damaged) { ctx.strokeStyle = '#4d5656'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + b.w * .5, top + 6); ctx.lineTo(x + b.w * .44, top + b.h * .3); ctx.lineTo(x + b.w * .56, top + b.h * .5); ctx.lineTo(x + b.w * .46, top + b.h * .75); ctx.stroke(); }
    } else if (b.kind === 'wall') {
      ctx.fillStyle = '#c4673f'; roundRect(x, top, b.w, b.h, 8, true);
      ctx.strokeStyle = '#f0c0a0'; ctx.lineWidth = 3; roundRect(x, top, b.w, b.h, 8, false);
      ctx.strokeStyle = 'rgba(255,230,210,.7)'; ctx.lineWidth = 2.5;
      for (let r = 1; r < b.h / 28; r++) { const yy = top + r * 28; ctx.beginPath(); ctx.moveTo(x + 2, yy); ctx.lineTo(x + b.w - 2, yy); ctx.stroke(); const off = r % 2 ? b.w * .3 : b.w * .62; ctx.beginPath(); ctx.moveTo(x + off, yy); ctx.lineTo(x + off, yy - 28); ctx.stroke(); }
      if (damaged) { ctx.strokeStyle = '#5a2c18'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + b.w * .3, top + 4); ctx.lineTo(x + b.w * .6, top + b.h * .32); ctx.lineTo(x + b.w * .38, top + b.h * .6); ctx.lineTo(x + b.w * .66, top + b.h * .9); ctx.stroke(); }
    } else if (b.kind === 'fence') {
      ctx.fillStyle = '#b97b45'; roundRect(x + 2, top, 8, b.h, 4, true); roundRect(x + b.w - 10, top, 8, b.h, 4, true);
      for (let r = 0; r < 3; r++) {
        const yy = top + 14 + r * (b.h - 56) / 2;
        ctx.fillStyle = '#e8b06a'; roundRect(x - 4, yy, b.w + 8, 24, 5, true);
        ctx.save(); ctx.beginPath(); ctx.rect(x - 4, yy, b.w + 8, 24); ctx.clip(); ctx.fillStyle = '#e04a3a';
        for (let s = -2; s < 6; s++) { ctx.beginPath(); ctx.moveTo(x - 4 + s * 14, yy + 24); ctx.lineTo(x - 4 + s * 14 + 8, yy + 24); ctx.lineTo(x - 4 + s * 14 + 20, yy); ctx.lineTo(x - 4 + s * 14 + 12, yy); ctx.closePath(); ctx.fill(); }
        ctx.restore();
        ctx.strokeStyle = '#a96a35'; ctx.lineWidth = 2.5; roundRect(x - 4, yy, b.w + 8, 24, 5, false);
      }
    } else if (b.type === 0) { ctx.fillStyle = '#c78c62'; roundRect(x, top, b.w, b.h, 10, true); ctx.fillStyle = '#efd0a0'; roundRect(x + 4, top + 3, b.w - 8, 7, 5, true); }
    else if (b.type === 1) { ctx.fillStyle = '#69bc7d'; ctx.beginPath(); ctx.ellipse(x + b.w/2, F - b.h/2, b.w/2, b.h/2, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#8cd491'; ctx.beginPath(); ctx.arc(x + b.w*.35, F - b.h*.48, 6, 0, Math.PI*2); ctx.fill(); }
    else { ctx.fillStyle = '#f2ca5d'; roundRect(x, top, b.w, b.h, 8, true); ctx.fillStyle = '#fff0ad'; ctx.beginPath(); ctx.arc(x + b.w/2, top, 6, 0, Math.PI*2); ctx.fill(); }
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
  $('#restart-button').addEventListener('click',()=>{if(!activeHero)return;mission=createMission(activeHero);save.activeMission=mission;save.activeHero=activeHero;save.progress=0;writeSave();beginGame(false);});
  $('#stats-button').addEventListener('click',showStats);$('#stats-back-button').addEventListener('click',()=>setScreen('pause-screen'));
  $('#stats-resume-button').addEventListener('click',()=>$('#resume-button').click());
  $('#puzzle-read-button').addEventListener('click',readPuzzleAloud);
  $('#quit-button').addEventListener('click',quitMission);
  $('#album-open').addEventListener('click',()=>{renderAlbum();setScreen('album-screen');});
  $('#reward-continue').addEventListener('click',()=>{cancelSpeech();rewardAdvance?.();});
  $('#music-bg-toggle').checked = musicEnabled; $('#haptics-toggle').checked = hapticsEnabled;
  $('#music-bg-toggle').addEventListener('change', e => { musicEnabled = e.target.checked; save.musicEnabled = musicEnabled; writeSave(); updateMusic(); });
  $('#haptics-toggle').addEventListener('change', e => { hapticsEnabled = e.target.checked; save.hapticsEnabled = hapticsEnabled; writeSave(); MM.setHaptics(hapticsEnabled); if (hapticsEnabled) MM.haptic('good'); });
  $('#album-tabs').addEventListener('click', e => { const tab = e.target.closest('.album-tab'); if (tab) { renderAlbum(Number(tab.dataset.page)); MM.haptic('tap'); } });
  document.addEventListener('visibilitychange', updateMusic);
  fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(v => { $('#home-version').textContent = `v${v.version}`; }).catch(() => {});
  $('#new-mission-button').addEventListener('click',()=>{if(!stopAfterMission)setScreen('hero-select');});
  $('#finish-button').addEventListener('click',endSession);
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
  // Clavier : flèches, ZQSD ou WASD ; espace / haut pour sauter, bas pour descendre, X ou E pour l'action.
  const KEY_LEFT=['ArrowLeft','a','A','q','Q'],KEY_RIGHT=['ArrowRight','d','D'],KEY_JUMP=[' ','ArrowUp','w','W','z','Z'],KEY_DOWN=['ArrowDown','s','S'],KEY_ACTION=['x','X','e','E'];
  const GAME_KEYS=[...KEY_LEFT,...KEY_RIGHT,...KEY_JUMP,...KEY_DOWN,...KEY_ACTION];
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');return;}if(scene!=='game-screen')return;const k=e.key;if(GAME_KEYS.includes(k))e.preventDefault();if(KEY_LEFT.includes(k))keys.left=true;if(KEY_RIGHT.includes(k))keys.right=true;if(KEY_JUMP.includes(k)){if(!e.repeat)keys.jump=true;}if(KEY_DOWN.includes(k)&&!e.repeat)keys.down=true;if(KEY_ACTION.includes(k)&&!e.repeat)useAbility();});
  window.addEventListener('keyup',e=>{const k=e.key;if(KEY_LEFT.includes(k))keys.left=false;if(KEY_RIGHT.includes(k))keys.right=false;});
  window.addEventListener('resize',resizeCanvas);window.addEventListener('orientationchange',()=>setTimeout(resizeCanvas,250));if('ResizeObserver' in window)new ResizeObserver(()=>{if(scene==='game-screen')resizeCanvas();}).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}});
  setAudioEnabled(audioEnabled,true);
  lastActiveTick=performance.now();setInterval(tickMissionClock,250);
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  requestAnimationFrame((t)=>{lastTime=t;});
})();
