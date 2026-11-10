(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const screens = [...document.querySelectorAll('.screen')];
  const canvas = $('#game-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const STORE = 'mini-mission-v1';
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // Autocollants à collectionner (récompense quand l'enfant répond juste du premier coup).
  const STICKERS = [['🦁','le lion'],['🐼','le panda'],['🦊','le renard'],['🐸','la grenouille'],['🦄','la licorne'],['🐙','la pieuvre'],['🐢','la tortue'],['🦋','le papillon'],['🐬','le dauphin'],['🦖','le dinosaure'],['🚀','la fusée'],['🌈','l’arc-en-ciel'],['🐝','l’abeille'],['🐧','le pingouin'],['🦒','la girafe'],['🐘','l’éléphant'],['🐞','la coccinelle'],['🐳','la baleine'],['🦉','le hibou'],['🐨','le koala'],['🍓','la fraise'],['⭐','l’étoile d’or'],['🎈','le ballon'],['🏰','le château']];
  const REWARD_COINS = 5;
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
  let lastMagicTime = 0;
  let abilityUntil = 0;
  let abilityCooldownUntil = 0;
  let heroAnim = newHeroAnim();
  let ropeBridge = null;
  let audio = null;
  let audioEnabled = save.audioEnabled !== false;
  let effectsEnabled = save.effectsEnabled !== false;
  let keys = { left: false, right: false, jump: false, down: false };
  let jumpBuffer = 0;
  let rewardAdvance = null;
  let view = { scale: 1, ox: 0, oy: 0, w: 960, h: 540 };
  let world = { width: 6200, floor: 426, camera: 0, checkpoint: 60, stations: [], gaps: [], bumps: [], platforms: [], coins: [], letters: [], enemies: [], bigFriends: [] };
  let player = { x: 70, y: 0, vx: 0, vy: 0, w: 58, h: 86, grounded: true, jumping: false, facing: 1, bob: 0 };
  let particles = [];
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
  function createMission(heroId) { const created = todaysMission(heroId); created.title = missionTitles[heroId]; created.palette = missionPalettes[heroId].slice(); return created; }
  // Recale une position de départ hors des ravins pour éviter une chute en boucle.
  function safeGroundX(x) { x = Math.max(70, Number(x) || 70); for (const gap of world.gaps) { if (x + 58 > gap.x - 20 && x < gap.x + gap.w + 20) x = gap.x + gap.w + 30; } return Math.min(x, world.width - 260); }
  function hash(value) { let h = 2166136261; for (let i=0;i<value.length;i++) { h ^= value.charCodeAt(i); h = Math.imul(h,16777619); } return h >>> 0; }
  function seeded(seed) { let s = seed || 1; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function setScreen(id) { if(id!=='puzzle-screen')cancelSpeech(); if(id!=='game-screen')$('#toast')?.classList.remove('show'); screens.forEach(s => s.classList.toggle('active', s.id === id)); scene = id; if (id !== 'game-screen') releaseControls(); if (!['game-screen','puzzle-screen'].includes(id)) lastActiveTick=performance.now(); if (id === 'game-screen') resizeCanvas(); }
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
    if (!Array.isArray(mission.stationsDone)) mission.stationsDone = [0,1,2].map(i => i < (save.progress||0));
    save.progress = mission.stationsDone.filter(Boolean).length;
    $('#mission-title').textContent = mission.title;
    $('#progress-dots').innerHTML = mission.tasks.map((_,i)=>`<span class="progress-dot ${mission.stationsDone[i] ? 'done' : ''}"></span>`).join('');
    world.width = 9300; world.floor = 426; world.camera = 0; world.checkpoint = 60;
    // Trois secteurs conçus autour du pouvoir choisi : pointes à franchir,
    // ravins à tisser, ou rochers à dégager. Les chutes restent sans danger.
    const gapDesign={ziggy:[{x:1120,w:155},{x:4220,w:175},{x:7280,w:155}],filou:[{x:1250,w:205},{x:4310,w:220},{x:7340,w:205}],titan:[{x:1900,w:125},{x:5010,w:135},{x:8070,w:125}]};
    world.gaps=gapDesign[activeHero].map(g=>({...g}));
    const rnd = seeded(mission.seed);
    world.stations = [0,1,2].map((i) => ({x:[1650,4650,7650][i], y:world.floor-190, i, done:mission.stationsDone[i]===true, hit:false, bob:rnd()*6}));
    // Plusieurs petits obstacles à sauter, avec des plateformes basses et hautes pour varier le parcours.
    const bumpPatterns={
      ziggy:[250,355,465,535,830,945,1050,1160,1320,1510,1615,1740,1850,2040,2150,2290,2410,2535,2660,2790,2910],
      filou:[280,470,690,890,1110,1320,1740,1910,2130,2360,2580,2790,2910],
      titan:[250,405,560,760,910,1080,1240,1410,1580,1770,1940,2100,2280,2450,2640,2810,2930]
    };
    const bumpPattern=bumpPatterns[activeHero];
    const offsets=[0,3100,6200];
    world.bumps=offsets.flatMap((offset,section)=>bumpPattern.map((x,i)=>({id:`b${section}-${i}`,x:x+offset+rnd()*30,w:activeHero==='titan'?48+rnd()*25:34+rnd()*31,h:activeHero==='titan'?27+rnd()*28:19+rnd()*20,type:activeHero==='titan'&&i%2===0?0:i%3,section})));
    world.bumps.forEach(b=>{if(b.type===0&&world.stations.some(station=>Math.abs(b.x-station.x)<150))b.x+=190;});
    const platformLayouts={
      ziggy:[{x:405,h:82,w:118},{x:555,h:113,w:112},{x:900,h:75,w:126},{x:1115,h:108,w:112},{x:1480,h:90,w:120},{x:1685,h:118,w:112},{x:2010,h:78,w:128},{x:2225,h:110,w:112},{x:2570,h:84,w:128},{x:2775,h:114,w:112}],
      filou:[{x:405,h:95,w:126},{x:555,h:125,w:116},{x:900,h:86,w:132},{x:1115,h:132,w:116},{x:1480,h:94,w:124},{x:1685,h:126,w:116},{x:2010,h:82,w:132},{x:2225,h:129,w:116},{x:2570,h:92,w:132},{x:2775,h:124,w:116}],
      titan:[{x:405,h:66,w:132},{x:555,h:94,w:122},{x:900,h:72,w:142},{x:1115,h:102,w:122},{x:1480,h:68,w:134},{x:1685,h:96,w:122},{x:2010,h:76,w:142},{x:2225,h:102,w:122},{x:2570,h:72,w:142},{x:2775,h:96,w:122}]
    };
    const platformPattern=platformLayouts[activeHero].map((platform,index)=>({x:platform.x,y:world.floor-platform.h,w:platform.w,h:18,type:index%2}));
    world.platforms=offsets.flatMap((offset,section)=>platformPattern.map((platform,index)=>({...platform,x:platform.x+offset+(section===1&&index%3===0?70:section===2&&index%3===1?-55:0)}))).filter(platform=>!world.stations.some(station=>Math.abs(platform.x+platform.w/2-station.x)<145));
    world.bumps=world.bumps.filter(bump=>!world.stations.some(station=>Math.abs(bump.x+bump.w/2-station.x)<100));
    // Les rochers déjà cassés par Titan restent cassés après un rechargement.
    const brokenBumps=new Set(mission.brokenBumps||[]);world.bumps=world.bumps.filter(bump=>!brokenBumps.has(bump.id));
    world.decorations=Array.from({length:43},(_,i)=>({x:210+i*218,kind:i%5,flower:i%4}));
    if(!Array.isArray(mission.coins))mission.coins=world.platforms.flatMap((platform,platformIndex)=>[0,1,2].map(i=>({id:`${platformIndex}-${i}`,x:platform.x+25+i*31,y:platform.y-30,collected:false,bob:rnd()*6})));
    const enemyPositions=Array.from({length:27},(_,i)=>330+i*330);
    if(!Array.isArray(mission.enemies))mission.enemies=[];
    if(mission.enemyRosterVersion!==3){
      const oldEnemies=mission.enemies;
      mission.enemies=enemyPositions.map((x,i)=>{const old=oldEnemies[i];return old?{...old,id:i,x:old.friendly?old.x:x,bob:Number(old.bob)||rnd()*6,variant:i%4,friendOrder:old.friendOrder??i}:{id:i,x,friendly:false,bob:rnd()*6,variant:i%4};});
      mission.enemyRosterVersion=3;
    }
    if(!Array.isArray(mission.bigFriends))mission.bigFriends=[];
    if(!Array.isArray(mission.letters))mission.letters=ALPHABET.map((letter,i)=>{
      const x=150+i*280;
      const platform=world.platforms.filter(item=>Math.abs((item.x+item.w/2)-x)<85).sort((a,b)=>Math.abs(a.x+a.w/2-x)-Math.abs(b.x+b.w/2-x))[0];
      return {letter,x,y:platform?platform.y-29:world.floor-55,collected:false,bob:rnd()*6};
    });
    world.coins=mission.coins;world.enemies=mission.enemies;world.bigFriends=mission.bigFriends;world.letters=mission.letters;
    save.coinTotal=Number(save.coinTotal)||0;if(!Number.isFinite(mission.coinCount))mission.coinCount=mission.coins.filter(coin=>coin.collected).length+friendScore()*2;updateCoinCounter();
    updateFriendCounter();updateLetterCounter();
    const nextStation=world.stations.find(station=>!station.done);const startX=safeGroundX(!world.stations.some(station=>station.done)?70:nextStation?nextStation.x-460:world.stations[2].x+120);
    player = {x:Math.max(70,startX), y:world.floor-86, vx:0, vy:0, w:58,h:86,grounded:true,jumping:false,facing:1,bob:0};
    world.checkpoint=player.x;
    particles=[]; lastPromptStation=-1;jumpBuffer=0; ropeBridge=null;abilityUntil=0;abilityCooldownUntil=0;heroAnim=newHeroAnim();lastActiveTick=performance.now(); lastTime=performance.now();
    const power={ziggy:['☄️','VITESSE','Action : foncer très vite à travers les obstacles et transformer un farceur en ami'],filou:['🧶','LAINE','Action : tisser un pont de laine et transformer un farceur en ami'],titan:['✊','FORCE','Action : pousser doucement les rochers et transformer un farceur en ami']}[activeHero];$('#attack-button .action-power').textContent=power[0];$('#attack-button small').textContent=power[1];$('#attack-button').setAttribute('aria-label',power[2]);$('#attack-button').classList.remove('cooldown');
    setScreen('game-screen'); startLoop();if(resume&&timerAnnouncementPending)speakTimerNotice();
    if (!resume) { sound('start'); showToast('Cours jusqu’à la maison 🏡 ! Saute sous les caisses ? pour aider un ami.'); }
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
    const move = (keys.right?1:0)-(keys.left?1:0);
    if(move)player.facing=move;player.vx=performance.now()<abilityUntil&&activeHero==='ziggy'?player.facing*390:move*235;
    updateHeroAnimation(dt);
    if(keys.jump){jumpBuffer=.14;keys.jump=false;}
    if(jumpBuffer>0){jumpBuffer-=dt;if(player.grounded){jumpBuffer=0;player.vy=-600;player.grounded=false;player.jumping=true;triggerHeroAnimation('jump',360);sound('jump');}}
    if(keys.down&&player.grounded&&player.y+player.h<world.floor-2){triggerHeroAnimation('drop',300);player.dropUntil=performance.now()+260;player.grounded=false;player.y+=3;}
    keys.down=false;
    const wasGrounded=player.grounded;
    const previousX=player.x, previousY=player.y, previousFeet=previousY+player.h;
    player.x += player.vx*dt; player.x=Math.max(18,Math.min(world.width-player.w,player.x));
    // Les petits obstacles au sol bloquent seulement si le héros ne les a pas sautés.
    for(const b of world.bumps){if(activeHero==='ziggy'&&performance.now()<abilityUntil)continue;const overlap=player.x+player.w>b.x&&player.x<b.x+b.w;const crossesSide=(previousX+player.w<=b.x&&player.x+player.w>b.x)||(previousX>=b.x+b.w&&player.x<b.x+b.w);if(overlap&&crossesSide&&player.y+player.h>world.floor-b.h+3){player.x=previousX;player.vx=0;triggerHeroAnimation('stumble');}}
    player.vy += 1450*dt; player.y += player.vy*dt; player.grounded=false;
    // Les plateformes sont traversables par-dessous et attrapent le héros pendant sa descente.
    let landingY=Infinity;
    if(player.vy>=0){
      const overGap=world.gaps.some(g=>player.x+player.w*.55>g.x&&player.x+player.w*.45<g.x+g.w);
      if(!overGap&&previousFeet<=world.floor&&player.y+player.h>=world.floor)landingY=world.floor;
      const dropping=performance.now()<(player.dropUntil||0);for(const platform of world.platforms){if(dropping)break;const overlaps=player.x+player.w>platform.x&&player.x<platform.x+platform.w;if(overlaps&&previousFeet<=platform.y&&player.y+player.h>=platform.y&&platform.y<landingY)landingY=platform.y;}
      if(!dropping&&ropeBridge&&performance.now()<ropeBridge.until&&player.x+player.w>ropeBridge.x&&player.x<ropeBridge.x+ropeBridge.w&&previousFeet<=ropeBridge.y&&player.y+player.h>=ropeBridge.y&&ropeBridge.y<landingY)landingY=ropeBridge.y;
    }
    if(landingY!==Infinity){player.y=landingY-player.h;player.vy=0;player.grounded=true;player.jumping=false;if(!wasGrounded)triggerHeroAnimation('land',300);if(landingY===world.floor&&player.x>world.checkpoint)world.checkpoint=player.x;}
    if(player.vy<0){const box=world.stations.find(station=>!station.done&&!station.hit&&player.x+player.w>station.x-39&&player.x<station.x+39&&previousY>=station.y+54&&player.y<=station.y+54);if(box){box.hit=true;player.y=box.y+54;player.vy=100;triggerHeroAnimation('question',700);sprinkle(box.x,box.y+54);sound('open');openPuzzle(box);return;}}
    if(player.y>650) { player.x=world.checkpoint; player.y=world.floor-player.h; player.vy=0; player.grounded=true; }
    // La mission se termine en arrivant à la maison : on n'est pas obligé d'ouvrir toutes les caisses.
    if(player.x+player.w>=world.width-150&&player.grounded){finishMission();return;}
    let leaderX=player.x+player.w/2-player.facing*56;
    const followers=[...world.bigFriends,...world.enemies.filter(enemy=>enemy.friendly)].sort((a,b)=>(a.friendOrder??0)-(b.friendOrder??0));
    followers.forEach((friend,index)=>{const spacing=friend.giant?84:54;const targetX=leaderX-player.facing*spacing;const targetY=player.y+player.h-20;friend.x+=(targetX-friend.x)*Math.min(1,dt*7);friend.y=(Number.isFinite(friend.y)?friend.y:world.floor-20)+(targetY-(Number.isFinite(friend.y)?friend.y:world.floor-20))*Math.min(1,dt*6);friend.followIndex=index;leaderX=friend.x;});
    for(const coin of world.coins){if(coin.collected)continue;const closeX=player.x+player.w>coin.x-12&&player.x<coin.x+12;const closeY=player.y<coin.y+13&&player.y+player.h>coin.y-13;if(closeX&&closeY){coin.collected=true;addCoins(1);triggerHeroAnimation('collect',330);sprinkle(coin.x,coin.y);sound('coin');writeSave();}}
    for(const letter of world.letters){if(letter.collected)continue;const closeX=player.x+player.w>letter.x-17&&player.x<letter.x+17;const closeY=player.y<letter.y+17&&player.y+player.h>letter.y-17;if(closeX&&closeY){letter.collected=true;updateLetterCounter();triggerHeroAnimation('collect',500);sprinkle(letter.x,letter.y);sound('coin');if(!timerNoticePlaying)sayText(letter.letter);writeSave();}}
    world.camera=Math.max(0,Math.min(world.width-view.w,player.x-view.w*.34));
    if(ropeBridge&&performance.now()>ropeBridge.until)ropeBridge=null;
    player.bob += dt*(Math.abs(player.vx)>.1?12:3);
    particles=particles.filter(p=>p.life>0); particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.life-=dt;});
  }
  function draw(time) {
    const dpr=Math.min(window.devicePixelRatio||1,2); ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle='#93ddf5';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.setTransform(view.scale,0,0,view.scale,view.ox,view.oy);
    drawSky(time); drawHills(); drawTown(time); drawWorld(time); drawPlayer(time); drawParticles();
  }
  function drawSky(time){const W=view.w,p=mission?.palette||[],extra=Math.max(0,view.h-540);const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,p[0]||'#70d0f4');g.addColorStop(.67,p[2]||'#c8f1fa');g.addColorStop(1,'#e8f9e9');ctx.fillStyle=g;ctx.fillRect(0,-extra-2,W,extra+544);for(let i=0;i<Math.ceil(W/260)+2;i++){const x=((i*260-world.camera*.16+time*3)%(W+260))-130,y=55+(i%3)*48;cloud(x,y,1+(i%2)*.18);}if(extra>40)for(let i=0;i<Math.ceil(W/300)+2;i++){const x=((i*300-world.camera*.1+time*2)%(W+300))-150,y=-extra*(.2+(i%3)*.25);cloud(x,y,1.1+(i%2)*.25);}}
  function cloud(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.ellipse(0,12,49,18,0,0,Math.PI*2);ctx.ellipse(-23,2,24,20,0,0,Math.PI*2);ctx.ellipse(0,-5,28,27,0,0,Math.PI*2);ctx.ellipse(26,4,24,19,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawHills(){const W=view.w,p=mission?.palette||[];ctx.fillStyle=p[1]||'#9edba8';ctx.beginPath();ctx.moveTo(0,355);for(let x=0;x<=W;x+=5){ctx.lineTo(x,350+28*Math.sin((x+world.camera*.18)/160)+16*Math.sin(x/63));}ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();ctx.fillStyle='#78c98e';ctx.beginPath();ctx.moveTo(0,395);for(let x=0;x<=W;x+=5)ctx.lineTo(x,390+22*Math.sin((x+world.camera*.31)/125));ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();}
  function drawTown(time){const W=view.w;for(let i=0;i<Math.ceil(W/430)+3;i++){const wx=i*430+80;const x=wx-world.camera*.48;if(x<-130||x>W+130)continue;const h=110+(i%3)*22,w=108+(i%2)*25,y=390-h;ctx.fillStyle=['#f8bb86','#f3d27f','#b9dcec','#d7b7e6'][i%4];roundRect(x,y,w,h,10,true);ctx.fillStyle='#e8877d';ctx.beginPath();ctx.moveTo(x-9,y+4);ctx.lineTo(x+w/2,y-44);ctx.lineTo(x+w+9,y+4);ctx.closePath();ctx.fill();for(let r=0;r<2;r++)for(let c=0;c<2;c++){ctx.fillStyle='rgba(255,255,255,.86)';roundRect(x+18+c*44,y+26+r*34,19,23,6,true);ctx.fillStyle='#90cadf';ctx.fillRect(x+26+c*44,y+26+r*34,3,23);ctx.fillRect(x+18+c*44,y+36+r*34,19,3);}ctx.fillStyle='#ab7860';roundRect(x+w/2-13,y+h-53,26,53,12,true);}
    for(let i=0;i<Math.ceil(W/600)+2;i++){const x=i*600+230-world.camera*.75;if(x<-70||x>W+70)continue;ctx.fillStyle='#946b53';roundRect(x-7,326,14,100,7,true);ctx.fillStyle=['#69c57c','#82d58d','#60b978'][i%3];ctx.beginPath();ctx.arc(x,310,43,0,Math.PI*2);ctx.arc(x-26,321,30,0,Math.PI*2);ctx.arc(x+25,320,31,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.23)';ctx.beginPath();ctx.arc(x-13,291,14,0,Math.PI*2);ctx.fill();}}
  function drawWorld(time){const W=view.w,p=mission?.palette||[];const floorY=world.floor;ctx.fillStyle=p[1]||'#76c78d';ctx.fillRect(0,floorY,W,120);ctx.fillStyle='#8ed49c';ctx.fillRect(0,floorY+13,W,7);ctx.fillStyle='#d6b785';ctx.fillRect(0,floorY+25,W,145);ctx.fillStyle='#c5a577';for(let i=-1;i<Math.ceil(W/80)+2;i++){const x=((i*80-world.camera*.9)%(W+80));ctx.fillRect(x,floorY+42,48,3);}
    world.gaps.forEach(gap=>{const x=gap.x-world.camera;if(x+gap.w<0||x>W)return;ctx.fillStyle='#956b49';ctx.fillRect(x,floorY,gap.w,66);ctx.fillStyle='#65c9e9';ctx.fillRect(x,floorY+16,gap.w,96);ctx.fillStyle='#a4eff8';for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(x+18+i*47,floorY+43+(i%2)*19,20,4,0,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#398faa';ctx.fillRect(x,floorY+106,gap.w,60);});
    for(let i=0;i<Math.ceil(W/120)+2;i++){const x=(i*120+35-world.camera*.9)%(W+120);flower(x,world.floor+7,i%4);}
    world.decorations.forEach(item=>{const x=item.x-world.camera;if(x<-90||x>W+90)return;const y=world.floor;ctx.save();if(item.kind===0){ctx.fillStyle='#8d6046';ctx.fillRect(x-25,y-27,50,5);ctx.fillRect(x-23,y-40,46,5);ctx.fillRect(x-18,y-22,4,18);ctx.fillRect(x+14,y-22,4,18);}else if(item.kind===1){ctx.fillStyle='#8b6748';ctx.fillRect(x-3,y-56,6,56);ctx.fillStyle='#ffedb0';roundRect(x-25,y-70,50,25,7,true);ctx.fillStyle='#557c76';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('➜',x,y-52);}else if(item.kind===2){ctx.fillStyle='#c48461';roundRect(x-24,y-19,48,19,5,true);flower(x-12,y-19,item.flower);flower(x+3,y-21,(item.flower+1)%4);flower(x+15,y-18,(item.flower+2)%4);}else if(item.kind===3){ctx.fillStyle='#8b6748';ctx.fillRect(x-3,y-68,6,68);ctx.fillStyle='#f7d66e';roundRect(x-12,y-78,24,18,8,true);ctx.fillStyle='rgba(255,239,163,.35)';ctx.beginPath();ctx.arc(x,y-64,24,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#b6a27e';ctx.beginPath();ctx.ellipse(x,y-3,24,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff0c0';ctx.beginPath();ctx.arc(x-7,y-4,2,0,Math.PI*2);ctx.arc(x+6,y-3,2,0,Math.PI*2);ctx.fill();}ctx.restore();});
    world.bumps.forEach((b,i)=>{const x=b.x-world.camera;if(x<-80||x>W+80)return;if(b.type===0&&activeHero==='titan'){ctx.fillStyle='#8c9a9a';ctx.beginPath();ctx.moveTo(x+3,world.floor);ctx.lineTo(x+5,world.floor-b.h*.7);ctx.lineTo(x+b.w*.27,world.floor-b.h);ctx.lineTo(x+b.w*.76,world.floor-b.h*.91);ctx.lineTo(x+b.w,world.floor-b.h*.42);ctx.lineTo(x+b.w-4,world.floor);ctx.closePath();ctx.fill();ctx.strokeStyle='#c6d1c9';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#bac8c1';ctx.beginPath();ctx.ellipse(x+b.w*.36,world.floor-b.h*.68,7,3,-.3,0,Math.PI*2);ctx.fill();}else if(b.type===0){ctx.fillStyle='#c78c62';roundRect(x,world.floor-b.h,b.w,b.h,10,true);ctx.fillStyle='#efd0a0';roundRect(x+4,world.floor-b.h+3,b.w-8,7,5,true);}else if(b.type===1){ctx.fillStyle='#69bc7d';ctx.beginPath();ctx.ellipse(x+b.w/2,world.floor-b.h/2,b.w/2,b.h/2,0,Math.PI,0);ctx.fill();ctx.fillStyle='#8cd491';ctx.beginPath();ctx.arc(x+b.w*.35,world.floor-b.h*.48,6,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#f2ca5d';roundRect(x,world.floor-b.h,b.w,b.h,8,true);ctx.fillStyle='#fff0ad';ctx.beginPath();ctx.arc(x+b.w/2,world.floor-b.h,6,0,Math.PI*2);ctx.fill();}});
    world.platforms.forEach((platform,i)=>{const x=platform.x-world.camera;if(x<-150||x>W+150)return;const top=platform.y;ctx.fillStyle=platform.type===0?'#9c755a':'#73be84';roundRect(x,top,platform.w,platform.h,8,true);ctx.fillStyle=platform.type===0?'#e4bd83':'#b8e5a5';roundRect(x+4,top+2,platform.w-8,6,5,true);ctx.fillStyle=platform.type===0?'#fff0c2':'#fff4b2';for(let j=0;j<3;j++){const dotX=x+18+j*34;if(dotX<x+platform.w-8){ctx.beginPath();ctx.arc(dotX,top-2,3,0,Math.PI*2);ctx.fill();}}if(i%2===1){ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(x+platform.w/2,top-14,8,0,Math.PI*2);ctx.fill();}});
    if(ropeBridge&&performance.now()<ropeBridge.until){const bx=ropeBridge.x-world.camera;ctx.fillStyle='#9163c6';roundRect(bx,ropeBridge.y,ropeBridge.w,ropeBridge.h,9,true);ctx.strokeStyle='#d7b4ff';ctx.lineWidth=3;ctx.stroke();for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(bx+15+i*25,ropeBridge.y+8,4,0,Math.PI*2);ctx.fillStyle='#f1d9ff';ctx.fill();}}
    world.coins.forEach(coin=>{if(coin.collected)return;const x=coin.x-world.camera;if(x<-25||x>W+25)return;const y=coin.y+Math.sin(time*4+coin.bob)*4;ctx.fillStyle='rgba(74,91,73,.18)';ctx.beginPath();ctx.ellipse(x,y+12,10,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f6b934';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff0a3';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff8d6';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('★',x,y+5);});
    world.letters.forEach(letter=>{if(letter.collected)return;const x=letter.x-world.camera;if(x<-30||x>W+30)return;const y=letter.y+Math.sin(time*4+letter.bob)*4;ctx.fillStyle='rgba(60,80,100,.15)';ctx.beginPath();ctx.ellipse(x,y+17,15,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fffdf5';roundRect(x-17,y-17,34,34,11,true);ctx.strokeStyle='#a986df';ctx.lineWidth=3;roundRect(x-17,y-17,34,34,11,false);ctx.fillStyle='#7458b8';ctx.font='900 22px Nunito, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(letter.letter,x,y+1);ctx.textBaseline='alphabetic';});
    [...world.enemies,...world.bigFriends].forEach(enemy=>{const x=enemy.x-world.camera;if(x<-75||x>W+75)return;const y=enemy.friendly?(enemy.y??world.floor-20)+Math.sin(time*4+enemy.bob)*2:world.floor-20+Math.sin(time*3+enemy.bob)*4;drawCuteEnemy(x,y,time,enemy);});
    world.stations.forEach((station)=>{const x=station.x-world.camera;if(x<-100||x>W+100)return;const bob=Math.sin(time*2+station.bob)*2;ctx.fillStyle='#a96343';roundRect(x-57,station.y-5+bob,35,49,7,true);roundRect(x+22,station.y-5+bob,35,49,7,true);ctx.fillStyle='#8c563c';for(let row=0;row<2;row++)for(let col=-2;col<=2;col++){if(Math.abs(col)<=1)continue;roundRect(x+col*29-13,station.y+row*25+bob,26,22,5,true);ctx.fillStyle='#bf7954';roundRect(x+col*29-10,station.y+row*25+2+bob,20,5,3,true);ctx.fillStyle='#8c563c';}ctx.fillStyle=station.done?'#9bdca8':'#ffcd52';roundRect(x-27,station.y+bob,54,48,11,true);ctx.strokeStyle='#fff1af';ctx.lineWidth=4;roundRect(x-27,station.y+bob,54,48,11,false);ctx.fillStyle='#fff8da';ctx.beginPath();ctx.arc(x,station.y+23+bob,15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e76158';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.fillText(station.done?'♥':'?',x,station.y+30+bob);});
    const finishX=world.width-world.camera-90;ctx.fillStyle='#fff7cd';ctx.beginPath();ctx.arc(finishX,world.floor-58,32,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f1bd45';ctx.lineWidth=4;ctx.stroke();ctx.font='25px sans-serif';ctx.textAlign='center';ctx.fillText('🏡',finishX,world.floor-49);}
  function drawCuteEnemy(x,y,time,enemy={}){const friendly=enemy.friendly;const palettes=[['#8d82d8','#c5bafa'],['#68b8ce','#a8e1e8'],['#e89b69','#ffd1a0'],['#80b779','#c3e49a']];const colors=palettes[enemy.variant%palettes.length]||palettes[0];ctx.save();ctx.translate(x,y);if(enemy.giant)ctx.scale(1.48,1.48);ctx.fillStyle=enemy.giant?'#e9575c':friendly?'#ffb5c8':colors[0];ctx.beginPath();ctx.ellipse(0,0,24,21,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=enemy.giant?'#ffad67':friendly?'#ffdf8d':colors[1];ctx.beginPath();ctx.arc(-10,-15,8,0,Math.PI*2);ctx.arc(10,-15,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-8,-2,5,7,0,0,Math.PI*2);ctx.ellipse(8,-2,5,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#34425e';ctx.beginPath();ctx.arc(-7,-1,2.2,0,Math.PI*2);ctx.arc(9,-1,2.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a94f68';ctx.lineWidth=2;ctx.beginPath();ctx.arc(1,6,5,.15,Math.PI-.15);ctx.stroke();ctx.fillStyle='#fff0a3';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(friendly?'♥':'✦',0,-28-Math.sin(time*5)*2);ctx.restore();}
  function flower(x,y,i){ctx.fillStyle='#438f5d';ctx.fillRect(x,y-10,2,13);ctx.fillStyle=['#ff7e77','#fff0a5','#8b79d8','#fff'][i];for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ctx.beginPath();ctx.arc(x+Math.cos(a)*4,y-11+Math.sin(a)*4,3,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f7be43';ctx.beginPath();ctx.arc(x,y-11,2.3,0,Math.PI*2);ctx.fill();}
  function drawPlayer(time){
    const x=player.x-world.camera+player.w/2,y=player.y+player.h/2;
    if(activeHero==='filou'&&ropeBridge&&performance.now()<ropeBridge.until){ctx.save();ctx.strokeStyle='#9b65ce';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+player.facing*22,y-25);ctx.quadraticCurveTo((x+ropeBridge.x-world.camera)/2,y-105,ropeBridge.x-world.camera+ropeBridge.w/2,ropeBridge.y+5);ctx.stroke();ctx.restore();}
    drawHero(ctx,x,player.y+player.h,time);
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
    const hop = a.timers.celebrate ? Math.abs(Math.sin((a.time - a.celebrateStart) * 10)) * 15 : 0;
    const bob = walking ? Math.abs(Math.sin(a.phase * Math.PI)) * 3.5 : 0;
    const breathe = !walking && player.grounded && pose === (HERO_IDLE[activeHero] ?? POSE.walkB) ? Math.sin(a.time * 2.6) * .012 : 0;
    let tilt = 0;
    if (!player.grounded) tilt = clamp(player.vy * .00018, -.09, .14);
    else if (a.timers.ability && activeHero === 'ziggy') tilt = .1;
    else if (walking) tilt = .03;
    const sx = 1 - a.squash * .6 - breathe * .5, sy = 1 + a.squash + breathe;
    c.save();
    const prevSmoothing = c.imageSmoothingEnabled; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    const drawPose = (offsetX, alpha) => {
      c.save(); c.globalAlpha = alpha;
      c.translate(x + offsetX, feetY - hop - bob + A.pad * A.scale); c.scale(player.facing, 1);
      c.translate(0, -dh * .35); c.rotate(tilt); c.translate(0, dh * .35);   // on s'incline depuis les hanches
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
  function drawParticles(){particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x-world.camera,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;}
  function roundRect(x,y,w,h,r,fill=true){ctx.beginPath();if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else{ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);}if(fill)ctx.fill();else ctx.stroke();}
  function cancelSpeech(requeueTimer=true){speechToken++;if(timerNoticePlaying){timerNoticePlaying=false;if(requeueTimer){timerAnnouncementPending=true;save.timerAnnouncementPending=true;writeSave();}}if('speechSynthesis'in window)window.speechSynthesis.cancel();}
  function sayText(text,onComplete){if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window))return false;cancelSpeech(false);const token=++speechToken;const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.88;utterance.pitch=1.02;utterance.volume=1;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>/^fr-BE/i.test(v.lang))||voices.find(v=>/^fr-FR/i.test(v.lang))||voices.find(v=>/^fr/i.test(v.lang))||null;utterance.voice=voice;utterance.lang=voice?.lang||'fr-FR';utterance.onend=()=>{if(token===speechToken)onComplete?.(true);};utterance.onerror=()=>{if(token===speechToken)onComplete?.(false);};window.speechSynthesis.speak(utterance);return true;}
  function speakTimerNotice(onComplete){if(!timerAnnouncementPending){onComplete?.();return;}timerAnnouncementPending=false;const started=sayText('On va bientôt terminer. Tu peux finir cette mission tranquillement. Après, ton héros ira se reposer.',()=>{timerNoticePlaying=false;save.timerAnnouncementPending=false;save.sessionElapsed=sessionElapsed;writeSave();onComplete?.();if(scene==='puzzle-screen'&&puzzleTask&&!puzzleResolved&&!onComplete)readPuzzleAloud();});timerNoticePlaying=started;if(!started){save.timerAnnouncementPending=false;writeSave();onComplete?.();}}
  function readPuzzleAloud() {
    if (!puzzleTask || puzzleResolved || timerNoticePlaying) return;
    const status = $('#speech-status');
    const text = `${puzzleTask.prompt} Choisis une réponse : ${puzzleTask.options.map(option => option[1]).join('. ')}.`;
    const started = sayText(text, () => {
      if (scene !== 'puzzle-screen' || puzzleResolved) return;
      status.textContent = 'À toi de choisir !';
      if (timerAnnouncementPending) speakTimerNotice();
    });
    // Les réponses restent toujours cliquables : on peut répondre sans attendre la fin de la lecture.
    status.textContent = started ? 'Je lis la question… tu peux répondre tout de suite !' : 'La voix n’est pas disponible ici. Tu peux choisir une image.';
  }
  function openPuzzle(station) {
    if (!station || station.done) return;
    puzzleStation = station; puzzleTask = mission.tasks[station.i]; puzzleWrong = 0; puzzleResolved = false;
    $('#puzzle-main').classList.remove('hidden'); $('#puzzle-reward').classList.add('hidden');
    $('#puzzle-icon').textContent = puzzleTask.icon || mission.icon;
    $('#puzzle-question').textContent = puzzleTask.prompt;
    $('#puzzle-feedback').textContent = ''; $('#speech-status').textContent = '';
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
  function advanceAfterPuzzle(){if(scene!=='puzzle-screen')return;const advance=()=>{if(scene!=='puzzle-screen')return;puzzleTask=null;puzzleStation=null;world.checkpoint=safeGroundX(player.x);setScreen('game-screen');startLoop();if(world.stations.every(station=>station.done))showToast('Bravo ! Rejoins maintenant la maison 🏡 au bout du chemin.');};if(timerAnnouncementPending)speakTimerNotice(advance);else advance();}
  function chooseOption(index, button) {
    if (!puzzleTask || puzzleResolved) return;
    cancelSpeech(); // l'enfant n'a pas à attendre la fin de la lecture
    const choices = [...$('#choice-list').querySelectorAll('button')];
    if (index !== puzzleTask.answer) {
      puzzleWrong++;
      const feedback = retryPhrases[Math.floor(Math.random()*retryPhrases.length)];
      $('#puzzle-feedback').textContent = feedback; $('#speech-status').textContent = '';
      button.classList.add('try-again'); button.disabled = true;
      if (puzzleWrong >= 2) choices[puzzleTask.answer].classList.add('hint-answer');
      sound('soft');
      sayText(feedback, () => { if (timerAnnouncementPending && scene === 'puzzle-screen') speakTimerNotice(); });
      return;
    }
    puzzleResolved = true;
    choices.forEach(choice => choice.disabled = true);
    const station = puzzleStation;
    if (station && !station.done) { station.done = true; mission.stationsDone[station.i] = true; save.progress = mission.stationsDone.filter(Boolean).length; writeSave(); $('#progress-dots').children[station.i]?.classList.add('done'); sprinkle(station.x, world.floor-90); }
    triggerHeroAnimation('celebrate', 1250);
    const feedback = praisePhrases[Math.floor(Math.random()*praisePhrases.length)];
    $('#puzzle-feedback').textContent = feedback; $('#speech-status').textContent = '';
    sound('success');
    if (puzzleWrong === 0) { showReward(feedback); return; } // bonne réponse du premier coup : cadeau !
    const started = sayText(feedback, () => advanceAfterPuzzle());
    if (!started) setTimeout(advanceAfterPuzzle, 500);
  }
  function friendScore(){return (mission?.bigFriends?.length||0)*10+(mission?.enemies||[]).filter(enemy=>enemy.friendly).length;}
  function updateCoinCounter(){const node=$('#coin-count');if(node)node.textContent=String(mission?.coinCount||0);}
  function addCoins(amount){if(!mission)return;mission.coinCount=(Number(mission.coinCount)||0)+amount;save.coinTotal=(Number(save.coinTotal)||0)+amount;updateCoinCounter();}
  function updateFriendCounter(){const node=$('#friend-count');if(node)node.textContent=String(friendScore());}
  function updateLetterCounter(){const node=$('#letter-count');if(node)node.textContent=`${(mission?.letters||[]).filter(letter=>letter.collected).length}/26`;}
  function collectFriendlyEnemy(enemy){triggerHeroAnimation('collect',400);enemy.friendly=true;enemy.friendOrder=Math.max(-1,...mission.enemies.map(item=>Number(item.friendOrder)||0),...mission.bigFriends.map(item=>Number(item.friendOrder)||0))+1;enemy.x=player.x+player.w/2;enemy.y=player.y+player.h-20;addCoins(2);sprinkle(enemy.x,enemy.y);const smallFriends=mission.enemies.filter(item=>item.friendly).sort((a,b)=>(a.friendOrder??0)-(b.friendOrder??0));if(smallFriends.length>=10){const gathered=smallFriends.slice(0,10);mission.enemies=mission.enemies.filter(item=>!gathered.includes(item));world.enemies=mission.enemies;mission.bigFriends.push({id:`red-friend-${mission.bigFriends.length+1}`,x:player.x+player.w/2,y:player.y+player.h-20,friendly:true,giant:true,bob:0,friendOrder:Math.max(...gathered.map(item=>item.friendOrder))});world.bigFriends=mission.bigFriends;}updateFriendCounter();writeSave();}
  function attackNearestEnemy(){const now=performance.now();if(scene!=='game-screen'||now-lastMagicTime<500)return;lastMagicTime=now;if(now>=abilityCooldownUntil){abilityCooldownUntil=now+2600;const actionNode=$('#attack-button');actionNode.classList.add('cooldown');setTimeout(()=>actionNode.classList.remove('cooldown'),2600);abilityUntil=now+800;triggerHeroAnimation('ability',activeHero==='filou'?850:650);if(activeHero==='ziggy'){player.vx=player.facing*390;for(let i=0;i<7;i++)sprinkle(player.x+player.w/2-player.facing*i*19,player.y+player.h-8);}else if(activeHero==='filou'){const x=Math.max(35,Math.min(world.width-190,player.x+player.facing*100));ropeBridge={x,y:world.floor-112,w:158,h:18,until:now+5500};player.vy=-640;player.grounded=false;player.jumping=true;sprinkle(x+75,world.floor-112);}else{const direction=player.facing;const broken=world.bumps.filter(b=>b.type===0&&Math.abs((b.x+b.w/2)-(player.x+player.w/2+direction*105))<90);world.bumps=world.bumps.filter(b=>!broken.includes(b));if(broken.length)mission.brokenBumps=[...(mission.brokenBumps||[]),...broken.map(b=>b.id)];broken.forEach(b=>{sprinkle(b.x+b.w/2,world.floor-b.h);mission.coins.push({id:`smash-${Date.now()}-${b.x}`,x:b.x+b.w/2,y:world.floor-b.h-25,collected:false,bob:0});});if(broken.length)writeSave();}}
    const nearby=world.enemies.filter(enemy=>!enemy.friendly&&Math.abs(enemy.x-(player.x+player.w/2))<175).sort((a,b)=>Math.abs(a.x-player.x)-Math.abs(b.x-player.x))[0];sound('magic');if(nearby)collectFriendlyEnemy(nearby);else sprinkle(player.x+player.w/2+player.facing*65,player.y+player.h/2);}
  function finishMission(){if(scene==='ending-screen')return;save.activeMission=null;save.activeHero=null;save.activeDate=null;save.progress=0;save.sessionElapsed=sessionElapsed;save.stopAfterMission=stopAfterMission;writeSave();$('#ending-message').textContent=`${mission.outro} ${heroes[activeHero].message}`;$('#ending-hero').innerHTML=`<span class="sprite" style="--col:2;--row:${HERO_ROW[activeHero]??0}"></span>`;const littleFriends=mission.enemies.filter(enemy=>enemy.friendly).sort((a,b)=>(a.friendOrder??0)-(b.friendOrder??0));const bigFriends=mission.bigFriends||[];const friendCount=friendScore();const parade=[...littleFriends,...bigFriends].sort((a,b)=>(a.friendOrder??0)-(b.friendOrder??0));$('#ending-friends').innerHTML=friendCount?`<strong>Toute la bande te suit !</strong><div class="friend-parade" aria-label="${friendCount} amis suivent le héros">${parade.map((friend,index)=>`<span class="parade-friend ${friend.giant?'parade-giant':''}" style="--friend-delay:${index*45}ms" aria-hidden="true"><i></i><b>♥</b></span>`).join('')}</div><small>${friendCount} ami${friendCount>1?'s':''} en tout. Le grand ami rouge compte pour 10.</small>`:'';$('#ending-friends').classList.toggle('hidden',friendCount===0);const won=mission.stickersWon||[];const stickerBox=$('#ending-stickers');stickerBox.classList.toggle('hidden',!won.length);stickerBox.innerHTML=won.length?`<span>Autocollants gagnés : ${won.length}</span><div class="sticker-row">${won.map((i,n)=>`<span style="--r:${n%2?5:-5}deg" aria-label="${escapeHtml(cap(STICKERS[i][1]))}">${STICKERS[i][0]}</span>`).join('')}</div>`:'';const found=mission.letters.filter(item=>item.collected).map(item=>item.letter);$('#alphabet-grid').innerHTML=ALPHABET.map(letter=>`<span class="alphabet-letter ${found.includes(letter)?'found':'missing'}" aria-label="${letter} ${found.includes(letter)?'récoltée':'pas encore récoltée'}">${letter}</span>`).join('');$('#alphabet-summary').textContent=`${found.length} lettre${found.length>1?'s':''} sur 26 récoltée${found.length>1?'s':''}.`;$('#new-mission-button').classList.toggle('hidden',stopAfterMission);$('#ending-rest-title').textContent=stopAfterMission?'Le héros va se reposer maintenant.':'Belle mission !';$('#ending-rest-copy').textContent=stopAfterMission?'Tu as terminé ta mission tranquillement.':'Tu peux repartir ou terminer la partie.';$('#finish-button').innerHTML=stopAfterMission?'Terminer, le héros se repose <span>♥</span>':'Terminer <span>♥</span>';setScreen('ending-screen');sound('finish');if(found.length)sayText(`À la fin de ta mission, tu as récolté les lettres : ${found.join(', ')}.`);}
  function quitMission() {
    cancelSpeech();
    save.activeMission = null; save.activeHero = null; save.activeDate = null; save.progress = 0; writeSave();
    mission = null; activeHero = null; puzzleTask = null; puzzleStation = null;
    releaseControls();
    startToday(); // propose de choisir une nouvelle mission (ou le repos si le minuteur est écoulé)
  }
  function renderAlbum() {
    const owned = new Set(save.stickers || []);
    $('#album-grid').innerHTML = STICKERS.map(([emoji, name], i) => owned.has(i)
      ? `<div class="album-slot got" role="listitem" aria-label="${escapeHtml(cap(name))}"><span>${emoji}</span><small>${escapeHtml(cap(name))}</small></div>`
      : `<div class="album-slot" role="listitem" aria-label="Autocollant à gagner">?</div>`).join('');
    $('#album-count').textContent = `${owned.size} sur ${STICKERS.length}`;
  }
  // Récompense : un autocollant (nouveau de préférence) et quelques pièces.
  function grantReward() {
    const owned = new Set(save.stickers || []);
    const all = STICKERS.map((_, i) => i);
    const fresh = all.filter(i => !owned.has(i));
    const pool = fresh.length ? fresh : all;
    const index = pool[Math.floor(Math.random()*pool.length)];
    const isNew = !owned.has(index);
    owned.add(index); save.stickers = [...owned];
    mission.stickersWon = [...(mission.stickersWon || []), index];
    addCoins(REWARD_COINS); writeSave();
    return { index, isNew };
  }
  function showReward(praise) {
    const { index, isNew } = grantReward();
    const [emoji, name] = STICKERS[index];
    const panel = $('#puzzle-reward');
    $('#puzzle-main').classList.add('hidden'); panel.classList.remove('hidden');
    // relance les animations du cadeau
    const stage = panel.querySelector('.reward-stage'); const clone = stage.cloneNode(true); stage.replaceWith(clone);
    $('#reward-sticker').textContent = emoji;
    $('#reward-name').textContent = cap(name);
    $('#reward-extra').textContent = isNew ? `Nouveau dans ton album ! +${REWARD_COINS} pièces` : `Tu l’avais déjà, mais +${REWARD_COINS} pièces !`;
    let advanced = false;
    const go = () => { if (advanced) return; advanced = true; advanceAfterPuzzle(); };
    rewardAdvance = go;
    const started = sayText(`${praise} Du premier coup ! Tu gagnes un autocollant : ${name} !`, () => setTimeout(go, 1800));
    if (!started) setTimeout(go, 4500);
  }
  function endSession(){sessionActive=false;sessionElapsed=0;sessionTimerLimit=0;stopAfterMission=false;timerWarningSent=false;timerAnnouncementPending=false;timerNoticePlaying=false;save.sessionActive=false;save.sessionElapsed=0;save.sessionTimerLimit=0;save.stopAfterMission=false;save.timerWarningSent=false;save.timerAnnouncementPending=false;save.activeMission=null;save.activeHero=null;save.activeDate=null;save.progress=0;writeSave();$('#session-timer-row').classList.remove('hidden');setScreen('home');}
  function sprinkle(x,y){const rand=seeded(hash(`${performance.now()}-${x}`));for(let i=0;i<22;i++)particles.push({x:x+(rand()-.5)*60,y:y+(rand()-.5)*38,vx:(rand()-.5)*145,vy:-rand()*115-25,life:.6+rand()*.6,r:2+rand()*4,color:['#ffca56','#f2776f','#7abce7','#6bc487','#a991e6'][i%5]});}
  function showToast(message){const node=$('#toast');if(!node||!message)return;node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3800);sound('soft');}
  function setAudioEnabled(value,silent=false){audioEnabled=value;save.audioEnabled=value;if(!silent)writeSave();$('#sound-button').textContent=value?'♫':'♪';$('#sound-button').setAttribute('aria-label',value?'Couper les sons':'Activer les sons');$('#home-sound-toggle').textContent=value?'♫':'♪';$('#home-sound-toggle').setAttribute('aria-label',value?'Couper les sons':'Activer les sons');$('#music-toggle').checked=value;if(value&&!silent)sound('success');}
  function releaseControls(){keys={left:false,right:false,jump:false,down:false};jumpBuffer=0;dpadPointer=null;Object.assign(dpadState,{left:false,right:false,up:false,down:false});document.querySelectorAll('.dpad-btn.pressed,.action-button.pressed,.jump-button.pressed').forEach(button=>button.classList.remove('pressed'));}
  function sound(kind){if(!audioEnabled||(!effectsEnabled&&['jump','open','soft','magic','coin'].includes(kind)))return;try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const notes={start:[523,659],jump:[440],open:[392],soft:[330],magic:[784,988],coin:[988,1318],success:[659,784,988],finish:[523,659,784]};const arr=notes[kind]||[440];arr.forEach((freq,i)=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audio.currentTime+i*.07);gain.gain.exponentialRampToValueAtTime(kind==='finish'?.045:.025,audio.currentTime+i*.07+.02);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+i*.07+.24);osc.connect(gain);gain.connect(audio.destination);osc.start(audio.currentTime+i*.07);osc.stop(audio.currentTime+i*.07+.25);});}catch{}}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  $('#start-button').addEventListener('click',startToday);
  document.querySelectorAll('.hero-card').forEach(card=>card.addEventListener('click',()=>chooseHero(card.dataset.hero)));
  document.querySelectorAll('[data-go="home"]').forEach(b=>b.addEventListener('click',()=>setScreen('home')));
  $('.settings-open').addEventListener('click',()=>setScreen('settings-screen'));
  $('#help-art-button').addEventListener('click',()=>setScreen('howto-screen'));
  $('#home-sound-toggle').addEventListener('click',()=>setAudioEnabled(!audioEnabled));
  $('#pause-button').addEventListener('click',()=>{if(scene==='game-screen'){pausedFrom='game-screen';setScreen('pause-screen');}});
  $('#resume-button').addEventListener('click',()=>{const target=pausedFrom;setScreen(target);lastActiveTick=performance.now();if(target==='game-screen'){startLoop();if(timerAnnouncementPending)speakTimerNotice();}else if(target==='puzzle-screen')readPuzzleAloud();});
  function showStats(){const letters=mission?.letters?.filter(item=>item.collected).length||0;$('#stat-coins').textContent=String(mission?.coinCount||0);$('#stat-friends').textContent=String(friendScore());$('#stat-letters').textContent=String(letters);$('#stat-stickers').textContent=String((mission?.stickersWon||[]).length);$('#stat-questions').textContent=`${save.progress||0}/${mission?.tasks?.length||3}`;setScreen('stats-screen');}
  $('#restart-button').addEventListener('click',()=>{if(!activeHero)return;mission=createMission(activeHero);save.activeMission=mission;save.activeHero=activeHero;save.progress=0;writeSave();beginGame(false);});
  $('#stats-button').addEventListener('click',showStats);$('#stats-back-button').addEventListener('click',()=>setScreen('pause-screen'));
  $('#stats-resume-button').addEventListener('click',()=>$('#resume-button').click());
  $('#puzzle-read-button').addEventListener('click',readPuzzleAloud);
  $('#quit-button').addEventListener('click',quitMission);
  $('#album-open').addEventListener('click',()=>{renderAlbum();setScreen('album-screen');});
  $('#reward-continue').addEventListener('click',()=>{cancelSpeech();rewardAdvance?.();});
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
  actionButton.addEventListener('pointerdown',e=>{e.preventDefault();actionButton.classList.add('pressed');attackNearestEnemy();});
  ['pointerup','pointercancel','pointerleave'].forEach(type=>actionButton.addEventListener(type,()=>actionButton.classList.remove('pressed')));
  actionButton.addEventListener('click',e=>{if(e.detail===0)attackNearestEnemy();});
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
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');return;}if(scene!=='game-screen')return;const k=e.key;if(GAME_KEYS.includes(k))e.preventDefault();if(KEY_LEFT.includes(k))keys.left=true;if(KEY_RIGHT.includes(k))keys.right=true;if(KEY_JUMP.includes(k)){if(!e.repeat)keys.jump=true;}if(KEY_DOWN.includes(k)&&!e.repeat)keys.down=true;if(KEY_ACTION.includes(k)&&!e.repeat)attackNearestEnemy();});
  window.addEventListener('keyup',e=>{const k=e.key;if(KEY_LEFT.includes(k))keys.left=false;if(KEY_RIGHT.includes(k))keys.right=false;});
  window.addEventListener('resize',resizeCanvas);window.addEventListener('orientationchange',()=>setTimeout(resizeCanvas,250));if('ResizeObserver' in window)new ResizeObserver(()=>{if(scene==='game-screen')resizeCanvas();}).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}});
  setAudioEnabled(audioEnabled,true);
  lastActiveTick=performance.now();setInterval(tickMissionClock,250);
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  requestAnimationFrame((t)=>{lastTime=t;});
})();
