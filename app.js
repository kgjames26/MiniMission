(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const screens = [...document.querySelectorAll('.screen')];
  const canvas = $('#game-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const STORE = 'mini-mission-v1';
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
    prompt:pattern.replace('{person}',person).replace('{goal}',theme.goal),
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
  let lastMagicTime = 0;
  let audio = null;
  let audioEnabled = save.audioEnabled !== false;
  let effectsEnabled = save.effectsEnabled !== false;
  let keys = { left: false, right: false, jump: false };
  let view = { scale: 1, ox: 0, oy: 0, w: 960, h: 540 };
  let world = { width: 6200, floor: 426, camera: 0, checkpoint: 60, stations: [], bumps: [], platforms: [], coins: [], enemies: [] };
  let player = { x: 70, y: 0, vx: 0, vy: 0, w: 58, h: 86, grounded: true, jumping: false, facing: 1, bob: 0 };
  let particles = [];
  let lastPromptStation = -1;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function readSave() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
  }
  function writeSave() { try { localStorage.setItem(STORE, JSON.stringify(save)); } catch {} }
  function dayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function dayIndex() { const n=new Date(); return Math.floor(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())/86400000); }
  function todaysMission(heroId) {
    const missionNumber=Number(save.missionNumber)||0;
    const index = ((dayIndex()+missionNumber) % missionTemplates.length + missionTemplates.length) % missionTemplates.length;
    const template = missionTemplates[index];
    const seed = hash(`${dayKey()}-${heroId}-${template.title}-${missionNumber}`);
    const random = seeded(seed);
    const variants = [
      { suffix: '', palette: ['#fff2bb','#ffc96b','#e28a6e'] },
      { suffix: ' — nouvelle aventure', palette: ['#d6f7ed','#7ac3a0','#8ea5dc'] },
      { suffix: ' — version surprise', palette: ['#eee5ff','#af9ce3','#f08d84'] }
    ];
    const variant = variants[Math.floor(random()*variants.length)];
    const unused = questionBank.slice();
    const tasks = [0,1,2].map(() => {
      const task = unused.splice(Math.floor(random()*unused.length),1)[0];
      const order = [0,1,2];
      for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
      const options = order.map(i => task.options[i]);
      return { ...task, options, answer: order.indexOf(task.answer) };
    });
    return { ...template, title: 'Les petits coups de main' + variant.suffix, friend:'les amis du quartier', outro:'Les amis du quartier ont reçu de jolis coups de main.', tasks, seed, palette: variant.palette };
  }
  function hash(value) { let h = 2166136261; for (let i=0;i<value.length;i++) { h ^= value.charCodeAt(i); h = Math.imul(h,16777619); } return h >>> 0; }
  function seeded(seed) { let s = seed || 1; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function setScreen(id) { if(id!=='puzzle-screen')cancelSpeech(); screens.forEach(s => s.classList.toggle('active', s.id === id)); scene = id; if (id !== 'game-screen') keys = { left:false, right:false, jump:false }; if (!['game-screen','puzzle-screen'].includes(id)) lastActiveTick=performance.now(); if (id === 'game-screen') resizeCanvas(); }
  function startToday() {
    if (save.activeHero && save.activeMission) { activeHero = save.activeHero; mission = save.activeMission; beginGame(true); return; }
    if(sessionActive&&stopAfterMission){endSession();showToast('Le héros va se reposer maintenant.');return;}
    $('#session-timer-row').classList.toggle('hidden',sessionActive);
    setScreen('hero-select');
  }
  function chooseHero(heroId) {
    if (!heroes[heroId]) return;
    if(!sessionActive){sessionActive=true;sessionElapsed=0;sessionTimerLimit=Number($('#session-timer-select').value)||0;stopAfterMission=false;timerWarningSent=false;timerAnnouncementPending=false;save.sessionActive=true;save.sessionElapsed=0;save.sessionTimerLimit=sessionTimerLimit;save.stopAfterMission=false;save.timerWarningSent=false;}$('#session-timer-row').classList.toggle('hidden',sessionActive);
    activeHero = heroId;
    mission = todaysMission(heroId);
    save.missionNumber=(Number(save.missionNumber)||0)+1;save.activeDate = dayKey(); save.activeHero = heroId; save.activeMission = mission; save.progress = 0; writeSave();
    beginGame(false);
  }
  function beginGame(resume) {
    if (!mission || !activeHero) return;
    $('#mission-title').textContent = mission.title;
    $('#hint-text').textContent = resume ? 'Ta mission t’attend. Avance doucement.' : `Avance, saute et aide ${mission.friend}. Attrape les pièces en montant sur les plateformes !`;
    $('#progress-dots').innerHTML = mission.tasks.map((_,i)=>`<span class="progress-dot ${i < (save.progress||0) ? 'done' : ''}"></span>`).join('');
    world.width = 6200; world.floor = 426; world.camera = 0; world.checkpoint = 60;
    const rnd = seeded(mission.seed);
    world.stations = [0,1,2].map((i) => ({x:[1100,3100,5100][i], i, done:i<(save.progress||0), bob:rnd()*6}));
    // Plusieurs petits obstacles à sauter, avec des plateformes basses et hautes pour varier le parcours.
    const bumpPattern=[250,355,465,535,830,945,1050,1160,1320,1510,1615,1740,1850,2040,2150,2290,2410,2535,2660,2790,2910];
    world.bumps=[0,3100].flatMap(offset=>bumpPattern.map((x,i)=>({x:x+offset+rnd()*38,w:34+rnd()*31,h:19+rnd()*20,type:i%3})));
    world.bumps.forEach(b=>{if(b.type===0&&world.stations.some(station=>Math.abs(b.x-station.x)<150))b.x+=190;});
    const platformPattern = [
      {x:405,y:world.floor-92,w:112,h:18,type:0},{x:555,y:world.floor-154,w:104,h:18,type:1},
      {x:900,y:world.floor-118,w:126,h:18,type:1},{x:1115,y:world.floor-176,w:108,h:18,type:0},
      {x:1480,y:world.floor-96,w:120,h:18,type:0},{x:1685,y:world.floor-158,w:112,h:18,type:1},
      {x:2010,y:world.floor-122,w:128,h:18,type:1},{x:2225,y:world.floor-180,w:108,h:18,type:0},
      {x:2570,y:world.floor-100,w:128,h:18,type:0},{x:2775,y:world.floor-160,w:110,h:18,type:1}
    ];
    world.platforms=[0,3100].flatMap(offset=>platformPattern.map(platform=>({...platform,x:platform.x+offset})));
    world.decorations=Array.from({length:28},(_,i)=>({x:210+i*218,kind:i%5,flower:i%4}));
    if(!Array.isArray(mission.coins))mission.coins=world.platforms.flatMap((platform,platformIndex)=>[0,1,2].map(i=>({id:`${platformIndex}-${i}`,x:platform.x+25+i*31,y:platform.y-30,collected:false,bob:rnd()*6})));
    const enemyPositions=[430,740,1010,1340,1660,1980,2320,2650,2990,3330,3660,4000,4330,4660,5000,5320,5650,5900];
    if(!Array.isArray(mission.enemies))mission.enemies=[];
    mission.enemies=enemyPositions.map((x,i)=>{const old=mission.enemies[i];return old?{...old,id:i,x:old.friendly?old.x:x,bob:Number(old.bob)||rnd()*6,variant:i%4}:{id:i,x,friendly:false,bob:rnd()*6,variant:i%4};});
    world.coins=mission.coins;world.enemies=mission.enemies;
    save.coinTotal=Number(save.coinTotal)||0;$('#coin-count').textContent=String(save.coinTotal);
    const startX=save.progress?world.stations[save.progress]?.x-460:70;
    player = {x:Math.max(70,startX), y:world.floor-86, vx:0, vy:0, w:58,h:86,grounded:true,jumping:false,facing:1,bob:0};
    world.checkpoint=player.x;
    particles=[]; lastPromptStation=-1; lastActiveTick=performance.now(); lastTime=performance.now();
    $('#interaction-prompt').classList.add('hidden');
    setScreen('game-screen'); requestAnimationFrame(loop);if(resume&&timerAnnouncementPending)speakTimerNotice();
    if (!resume) sound('start');
  }
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width*dpr); canvas.height = Math.round(rect.height*dpr);
    view.scale = canvas.height/540; view.w=canvas.width/view.scale; view.h=540; view.ox=0; view.oy=0;
  }
  function loop(now) {
    if (scene !== 'game-screen') return;
    const dt = Math.min(.033,Math.max(0,(now-lastTime)/1000)); lastTime=now;
    update(dt); draw(now/1000);
    requestAnimationFrame(loop);
  }
  function tickMissionClock(){const now=performance.now();if(!mission||!sessionActive||!['game-screen','puzzle-screen'].includes(scene)){lastActiveTick=now;return;}if(!lastActiveTick){lastActiveTick=now;return;}sessionElapsed+=Math.min(1,Math.max(0,(now-lastActiveTick)/1000));lastActiveTick=now;save.sessionElapsed=sessionElapsed;if(sessionTimerLimit>0&&!timerWarningSent&&sessionElapsed>=sessionTimerLimit){timerWarningSent=true;stopAfterMission=true;timerAnnouncementPending=true;save.timerWarningSent=true;save.stopAfterMission=true;save.timerAnnouncementPending=true;$('#hint-text').textContent='Tu peux finir cette mission tranquillement. Après, le héros ira se reposer.';writeSave();if(scene!=='puzzle-screen'||!window.speechSynthesis?.speaking)speakTimerNotice();}if(now-lastClockSave>3000){lastClockSave=now;writeSave();}}
  function update(dt) {
    const move = (keys.right?1:0)-(keys.left?1:0);
    player.vx = move*235; if(move) player.facing=move;
    if(keys.jump && player.grounded) { player.vy=-600; player.grounded=false; player.jumping=true; sound('jump'); }
    keys.jump=false;
    const previousX=player.x, previousY=player.y, previousFeet=previousY+player.h;
    player.x += player.vx*dt; player.x=Math.max(18,Math.min(world.width-player.w,player.x));
    // Les petits obstacles au sol bloquent seulement si le héros ne les a pas sautés.
    for(const b of world.bumps){if(b.type!==0)continue;const overlap=player.x+player.w>b.x&&player.x<b.x+b.w;const crossesSide=(previousX+player.w<=b.x&&player.x+player.w>b.x)||(previousX>=b.x+b.w&&player.x<b.x+b.w);if(overlap&&crossesSide&&player.y+player.h>world.floor-b.h+3){player.x=previousX;player.vx=0;}}
    player.vy += 1450*dt; player.y += player.vy*dt; player.grounded=false;
    // Les plateformes sont traversables par-dessous et attrapent le héros pendant sa descente.
    let landingY=Infinity;
    if(player.vy>=0){
      if(previousFeet<=world.floor&&player.y+player.h>=world.floor)landingY=world.floor;
      for(const platform of world.platforms){const overlaps=player.x+player.w>platform.x&&player.x<platform.x+platform.w;if(overlaps&&previousFeet<=platform.y&&player.y+player.h>=platform.y&&platform.y<landingY)landingY=platform.y;}
    }
    if(landingY!==Infinity){player.y=landingY-player.h;player.vy=0;player.grounded=true;player.jumping=false;if(landingY===world.floor&&player.x>world.checkpoint)world.checkpoint=player.x;}
    if(player.y>650) { player.x=world.checkpoint; player.y=world.floor-player.h; player.vy=0; player.grounded=true; showToast('On reprend juste ici. Tout va bien !'); }
    let leaderX=player.x+player.w/2-player.facing*56;
    const followers=world.enemies.filter(enemy=>enemy.friendly);
    followers.forEach((enemy,index)=>{const targetX=leaderX-player.facing*54;const targetY=player.y+player.h-20;enemy.x+= (targetX-enemy.x)*Math.min(1,dt*7);enemy.y=(Number.isFinite(enemy.y)?enemy.y:world.floor-20)+(targetY-(Number.isFinite(enemy.y)?enemy.y:world.floor-20))*Math.min(1,dt*6);enemy.followIndex=index;leaderX=enemy.x;});
    for(const coin of world.coins){if(coin.collected)continue;const closeX=player.x+player.w>coin.x-12&&player.x<coin.x+12;const closeY=player.y<coin.y+13&&player.y+player.h>coin.y-13;if(closeX&&closeY){coin.collected=true;save.coinTotal=(Number(save.coinTotal)||0)+1;$('#coin-count').textContent=String(save.coinTotal);sprinkle(coin.x,coin.y);sound('coin');writeSave();}}
    world.camera=Math.max(0,Math.min(world.width-view.w,player.x-view.w*.34));
    const current=world.stations.find(s=>!s.done);
    const canHelp=current&&Math.abs((player.x+player.w/2)-current.x)<95&&player.grounded;
    $('#interaction-prompt').classList.toggle('hidden',!canHelp);
    if(current&&player.x>current.x+130&&lastPromptStation!==current.i){ $('#hint-text').textContent='Le petit geste est juste derrière toi. Tu peux y aller doucement.'; lastPromptStation=current.i; }
    player.bob += dt*(Math.abs(player.vx)>.1?12:3);
    particles=particles.filter(p=>p.life>0); particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.life-=dt;});
  }
  function draw(time) {
    const dpr=Math.min(window.devicePixelRatio||1,2); ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle='#93ddf5';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.setTransform(view.scale,0,0,view.scale,view.ox,view.oy);
    drawSky(time); drawHills(); drawTown(time); drawWorld(time); drawPlayer(time); drawParticles();
  }
  function drawSky(time){const W=view.w,p=mission?.palette||[];const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,p[0]||'#70d0f4');g.addColorStop(.67,p[2]||'#c8f1fa');g.addColorStop(1,'#e8f9e9');ctx.fillStyle=g;ctx.fillRect(0,0,W,540);for(let i=0;i<Math.ceil(W/260)+2;i++){const x=((i*260-world.camera*.16+time*3)%(W+260))-130,y=55+(i%3)*48;cloud(x,y,1+(i%2)*.18);}}
  function cloud(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.ellipse(0,12,49,18,0,0,Math.PI*2);ctx.ellipse(-23,2,24,20,0,0,Math.PI*2);ctx.ellipse(0,-5,28,27,0,0,Math.PI*2);ctx.ellipse(26,4,24,19,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawHills(){const W=view.w,p=mission?.palette||[];ctx.fillStyle=p[1]||'#9edba8';ctx.beginPath();ctx.moveTo(0,355);for(let x=0;x<=W;x+=5){ctx.lineTo(x,350+28*Math.sin((x+world.camera*.18)/160)+16*Math.sin(x/63));}ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();ctx.fillStyle='#78c98e';ctx.beginPath();ctx.moveTo(0,395);for(let x=0;x<=W;x+=5)ctx.lineTo(x,390+22*Math.sin((x+world.camera*.31)/125));ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();}
  function drawTown(time){const W=view.w;for(let i=0;i<Math.ceil(W/430)+3;i++){const wx=i*430+80;const x=wx-world.camera*.48;if(x<-130||x>W+130)continue;const h=110+(i%3)*22,w=108+(i%2)*25,y=390-h;ctx.fillStyle=['#f8bb86','#f3d27f','#b9dcec','#d7b7e6'][i%4];roundRect(x,y,w,h,10,true);ctx.fillStyle='#e8877d';ctx.beginPath();ctx.moveTo(x-9,y+4);ctx.lineTo(x+w/2,y-44);ctx.lineTo(x+w+9,y+4);ctx.closePath();ctx.fill();for(let r=0;r<2;r++)for(let c=0;c<2;c++){ctx.fillStyle='rgba(255,255,255,.86)';roundRect(x+18+c*44,y+26+r*34,19,23,6,true);ctx.fillStyle='#90cadf';ctx.fillRect(x+26+c*44,y+26+r*34,3,23);ctx.fillRect(x+18+c*44,y+36+r*34,19,3);}ctx.fillStyle='#ab7860';roundRect(x+w/2-13,y+h-53,26,53,12,true);}
    for(let i=0;i<Math.ceil(W/600)+2;i++){const x=i*600+230-world.camera*.75;if(x<-70||x>W+70)continue;ctx.fillStyle='#946b53';roundRect(x-7,326,14,100,7,true);ctx.fillStyle=['#69c57c','#82d58d','#60b978'][i%3];ctx.beginPath();ctx.arc(x,310,43,0,Math.PI*2);ctx.arc(x-26,321,30,0,Math.PI*2);ctx.arc(x+25,320,31,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.23)';ctx.beginPath();ctx.arc(x-13,291,14,0,Math.PI*2);ctx.fill();}}
  function drawWorld(time){const W=view.w,p=mission?.palette||[];const floorY=world.floor;ctx.fillStyle=p[1]||'#76c78d';ctx.fillRect(0,floorY,W,120);ctx.fillStyle='#8ed49c';ctx.fillRect(0,floorY+13,W,7);ctx.fillStyle=p[0]||'#d6b785';ctx.fillRect(0,floorY+25,W,145);ctx.fillStyle='#c5a577';for(let i=-1;i<Math.ceil(W/80)+2;i++){const x=((i*80-world.camera*.9)%(W+80));ctx.fillRect(x,floorY+42,48,3);}
    for(let i=0;i<Math.ceil(W/120)+2;i++){const x=(i*120+35-world.camera*.9)%(W+120);flower(x,world.floor+7,i%4);}
    world.decorations.forEach(item=>{const x=item.x-world.camera;if(x<-90||x>W+90)return;const y=world.floor;ctx.save();if(item.kind===0){ctx.fillStyle='#8d6046';ctx.fillRect(x-25,y-27,50,5);ctx.fillRect(x-23,y-40,46,5);ctx.fillRect(x-18,y-22,4,18);ctx.fillRect(x+14,y-22,4,18);}else if(item.kind===1){ctx.fillStyle='#8b6748';ctx.fillRect(x-3,y-56,6,56);ctx.fillStyle='#ffedb0';roundRect(x-25,y-70,50,25,7,true);ctx.fillStyle='#557c76';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('➜',x,y-52);}else if(item.kind===2){ctx.fillStyle='#c48461';roundRect(x-24,y-19,48,19,5,true);flower(x-12,y-19,item.flower);flower(x+3,y-21,(item.flower+1)%4);flower(x+15,y-18,(item.flower+2)%4);}else if(item.kind===3){ctx.fillStyle='#8b6748';ctx.fillRect(x-3,y-68,6,68);ctx.fillStyle='#f7d66e';roundRect(x-12,y-78,24,18,8,true);ctx.fillStyle='rgba(255,239,163,.35)';ctx.beginPath();ctx.arc(x,y-64,24,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#b6a27e';ctx.beginPath();ctx.ellipse(x,y-3,24,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff0c0';ctx.beginPath();ctx.arc(x-7,y-4,2,0,Math.PI*2);ctx.arc(x+6,y-3,2,0,Math.PI*2);ctx.fill();}ctx.restore();});
    world.bumps.forEach((b,i)=>{const x=b.x-world.camera;if(x<-80||x>W+80)return;if(b.type===0){ctx.fillStyle='#c78c62';roundRect(x,world.floor-b.h,b.w,b.h,10,true);ctx.fillStyle='#efd0a0';roundRect(x+4,world.floor-b.h+3,b.w-8,7,5,true);}else if(b.type===1){ctx.fillStyle='#69bc7d';ctx.beginPath();ctx.ellipse(x+b.w/2,world.floor-b.h/2,b.w/2,b.h/2,0,Math.PI,0);ctx.fill();ctx.fillStyle='#8cd491';ctx.beginPath();ctx.arc(x+b.w*.35,world.floor-b.h*.48,6,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#f2ca5d';roundRect(x,world.floor-b.h,b.w,b.h,8,true);ctx.fillStyle='#fff0ad';ctx.beginPath();ctx.arc(x+b.w/2,world.floor-b.h,6,0,Math.PI*2);ctx.fill();}});
    world.platforms.forEach((platform,i)=>{const x=platform.x-world.camera;if(x<-150||x>W+150)return;const top=platform.y;ctx.fillStyle=platform.type===0?'#9c755a':'#73be84';roundRect(x,top,platform.w,platform.h,8,true);ctx.fillStyle=platform.type===0?'#e4bd83':'#b8e5a5';roundRect(x+4,top+2,platform.w-8,6,5,true);ctx.fillStyle=platform.type===0?'#fff0c2':'#fff4b2';for(let j=0;j<3;j++){const dotX=x+18+j*34;if(dotX<x+platform.w-8){ctx.beginPath();ctx.arc(dotX,top-2,3,0,Math.PI*2);ctx.fill();}}if(i%2===1){ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(x+platform.w/2,top-14,8,0,Math.PI*2);ctx.fill();}});
    world.coins.forEach(coin=>{if(coin.collected)return;const x=coin.x-world.camera;if(x<-25||x>W+25)return;const y=coin.y+Math.sin(time*4+coin.bob)*4;ctx.fillStyle='rgba(74,91,73,.18)';ctx.beginPath();ctx.ellipse(x,y+12,10,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f6b934';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff0a3';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff8d6';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('★',x,y+5);});
    world.enemies.forEach(enemy=>{const x=enemy.x-world.camera;if(x<-60||x>W+60)return;const y=enemy.friendly?(enemy.y??world.floor-20)+Math.sin(time*4+enemy.bob)*2:world.floor-20+Math.sin(time*3+enemy.bob)*4;drawCuteEnemy(x,y,time,enemy);});
    world.stations.forEach((station)=>{const x=station.x-world.camera;if(x<-100||x>W+100)return;const bob=Math.sin(performance.now()/650+station.bob)*5;ctx.fillStyle=station.done?'#a7dfad':'rgba(255,255,255,.45)';ctx.beginPath();ctx.ellipse(x,world.floor-9,51,15,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=station.done?'#5fb983':'#fff6c8';ctx.beginPath();ctx.arc(x,world.floor-92+bob,37,0,Math.PI*2);ctx.fill();ctx.strokeStyle=station.done?'#47a76d':'#f1c44f';ctx.lineWidth=4;ctx.stroke();ctx.textAlign='center';ctx.font='27px sans-serif';ctx.fillText(station.done?'✓':mission.icon,x,world.floor-82+bob);if(!station.done){ctx.fillStyle='#fff';roundRect(x-30,world.floor-45+bob,60,25,12,true);ctx.fillStyle='#557b8e';ctx.font='bold 12px Nunito, sans-serif';ctx.fillText('AIDER',x,world.floor-28+bob);}});
    const finishX=world.width-world.camera-90;ctx.fillStyle='#fff7cd';ctx.beginPath();ctx.arc(finishX,world.floor-58,32,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f1bd45';ctx.lineWidth=4;ctx.stroke();ctx.font='25px sans-serif';ctx.textAlign='center';ctx.fillText('🏡',finishX,world.floor-49);}
  function drawCuteEnemy(x,y,time,enemy={}){const friendly=enemy.friendly;const palettes=[['#8d82d8','#c5bafa'],['#68b8ce','#a8e1e8'],['#e89b69','#ffd1a0'],['#80b779','#c3e49a']];const colors=palettes[enemy.variant%palettes.length]||palettes[0];ctx.save();ctx.translate(x,y);ctx.fillStyle=friendly?'#ffb5c8':colors[0];ctx.beginPath();ctx.ellipse(0,0,24,21,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=friendly?'#ffdf8d':colors[1];ctx.beginPath();ctx.arc(-10,-15,8,0,Math.PI*2);ctx.arc(10,-15,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-8,-2,5,7,0,0,Math.PI*2);ctx.ellipse(8,-2,5,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#34425e';ctx.beginPath();ctx.arc(-7,-1,2.2,0,Math.PI*2);ctx.arc(9,-1,2.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a94f68';ctx.lineWidth=2;ctx.beginPath();ctx.arc(1,6,5,.15,Math.PI-.15);ctx.stroke();ctx.fillStyle='#fff0a3';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(friendly?'♥':'✦',0,-28-Math.sin(time*5)*2);ctx.restore();}
  function flower(x,y,i){ctx.fillStyle='#438f5d';ctx.fillRect(x,y-10,2,13);ctx.fillStyle=['#ff7e77','#fff0a5','#8b79d8','#fff'][i];for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ctx.beginPath();ctx.arc(x+Math.cos(a)*4,y-11+Math.sin(a)*4,3,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f7be43';ctx.beginPath();ctx.arc(x,y-11,2.3,0,Math.PI*2);ctx.fill();}
  function drawPlayer(time){const x=player.x-world.camera+player.w/2,y=player.y+player.h/2+(player.grounded?Math.sin(player.bob)*1.5:0);drawHero(ctx,x,y,activeHero,time,player.facing,player.grounded);}
  function drawHero(c,x,y,id,time,facing=1,grounded=true){const h=heroes[id]||heroes.ziggy;const walking=grounded&&Math.abs(player.vx)>1;const step=walking?Math.sin(time*13)*.42:0;const armStep=walking?Math.sin(time*13+Math.PI)*.28:0;c.save();c.translate(x,y);c.scale(facing,1);const bob=grounded&&!walking?Math.sin(time*2)*1.3:walking?Math.abs(Math.sin(time*13))*2:0;c.translate(0,bob);c.fillStyle='rgba(36,87,107,.16)';c.beginPath();c.ellipse(0,44,28,7,0,0,Math.PI*2);c.fill();c.fillStyle=h.cape;c.beginPath();c.moveTo(-10,-19);c.lineTo(-32,25+Math.sin(time*5)*2);c.quadraticCurveTo(-5,23,1,-18);c.fill();for(const side of [-1,1]){c.save();c.translate(side*17,-7);c.rotate(side*armStep);c.fillStyle=h.suit;roundRect(-6,0,12,25,6,true);c.fillStyle=h.accent;roundRect(-7,20,14,9,5,true);c.restore();}for(const side of [-1,1]){c.save();c.translate(side*10,16);c.rotate(side*step);c.fillStyle=h.suit;roundRect(-7,0,14,24,7,true);c.fillStyle='#547bad';roundRect(-10,18,20,10,5,true);c.restore();}c.fillStyle=h.suit;roundRect(-21,-19,42,44,14,true);c.strokeStyle='#76536e';c.lineWidth=3;c.stroke();c.fillStyle=h.accent;c.beginPath();c.moveTo(0,-11);c.lineTo(5,-1);c.lineTo(16,1);c.lineTo(8,8);c.lineTo(10,19);c.lineTo(0,13);c.lineTo(-10,19);c.lineTo(-8,8);c.lineTo(-16,1);c.lineTo(-5,-1);c.closePath();c.fill();c.fillStyle=h.skin;c.beginPath();c.arc(0,-35,23,0,Math.PI*2);c.fill();c.fillStyle=h.hair;c.beginPath();c.arc(0,-40,23,Math.PI,Math.PI*2);c.quadraticCurveTo(18,-57,22,-35);c.lineTo(12,-42);c.lineTo(2,-48);c.lineTo(-11,-39);c.lineTo(-21,-33);c.closePath();c.fill();c.fillStyle=id==='ziggy'?'#ffd34f':id==='filou'?'#e9f8ff':'#ffe17a';roundRect(-23,-37,46,13,6,true);c.fillStyle='#2e4257';c.beginPath();c.arc(-8,-32,2.3,0,Math.PI*2);c.arc(8,-32,2.3,0,Math.PI*2);c.fill();c.strokeStyle='#9b5b48';c.lineWidth=2;c.beginPath();c.arc(0,-24,6,.1,Math.PI-.1);c.stroke();c.fillStyle=h.accent;c.beginPath();c.arc(0,-19,4,0,Math.PI*2);c.fill();c.restore();}
  function drawParticles(){particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x-world.camera,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;}
  function roundRect(x,y,w,h,r,fill=true){ctx.beginPath();if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else{ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);}if(fill)ctx.fill();else ctx.stroke();}
  function cancelSpeech(requeueTimer=true){speechToken++;if(timerNoticePlaying){timerNoticePlaying=false;if(requeueTimer){timerAnnouncementPending=true;save.timerAnnouncementPending=true;writeSave();}}if('speechSynthesis'in window)window.speechSynthesis.cancel();}
  function sayText(text,onComplete){if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window))return false;cancelSpeech(false);const token=++speechToken;const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.88;utterance.pitch=1.02;utterance.volume=1;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>/^fr-BE/i.test(v.lang))||voices.find(v=>/^fr-FR/i.test(v.lang))||voices.find(v=>/^fr/i.test(v.lang))||null;utterance.voice=voice;utterance.lang=voice?.lang||'fr-FR';utterance.onend=()=>{if(token===speechToken)onComplete?.(true);};utterance.onerror=()=>{if(token===speechToken)onComplete?.(false);};window.speechSynthesis.speak(utterance);return true;}
  function speakTimerNotice(onComplete){if(!timerAnnouncementPending){onComplete?.();return;}timerAnnouncementPending=false;if(scene==='puzzle-screen'){ $('#puzzle-read-button').disabled=true;$('#choice-list').querySelectorAll('button').forEach(choice=>choice.disabled=true); }const started=sayText('On va bientôt terminer. Tu peux finir cette mission tranquillement. Après, ton héros ira se reposer.',()=>{timerNoticePlaying=false;save.timerAnnouncementPending=false;save.sessionElapsed=sessionElapsed;writeSave();onComplete?.();if(scene==='puzzle-screen'&&puzzleTask&&!onComplete)readPuzzleAloud();});timerNoticePlaying=started;if(!started){save.timerAnnouncementPending=false;writeSave();onComplete?.();}}
  function readPuzzleAloud(){if(!puzzleTask||puzzleResolved||timerNoticePlaying)return;const choices=[...$('#choice-list').querySelectorAll('button')];choices.forEach(choice=>choice.disabled=true);$('#puzzle-read-button').disabled=true;$('#speech-status').textContent='Écoute bien…';const text=`${puzzleTask.prompt} Choisis une réponse : ${puzzleTask.options.map(option=>option[1]).join('. ')}.`;const enableChoices=()=>{if(scene!=='puzzle-screen'||puzzleResolved)return;$('#puzzle-read-button').disabled=false;$('#speech-status').textContent='À toi de choisir.';choices.forEach(choice=>choice.disabled=false);};const started=sayText(text,(success)=>{if(scene!=='puzzle-screen'||puzzleResolved)return;if(timerAnnouncementPending){speakTimerNotice(enableChoices);return;}$('#puzzle-read-button').disabled=false;if(success){$('#speech-status').textContent='À toi de choisir.';choices.forEach(choice=>choice.disabled=false);}else{$('#speech-status').textContent='La lecture a été interrompue. Appuie sur le haut-parleur pour réessayer.';}});if(!started){$('#puzzle-read-button').disabled=false;$('#speech-status').textContent='La lecture vocale doit être activée sur cet appareil pour continuer.';}}
  function openPuzzle(){const station=world.stations.find(s=>!s.done);if(!station)return;const index=station.i; puzzleTask=mission.tasks[index];puzzleWrong=0;puzzleResolved=false;$('#puzzle-icon').textContent=puzzleTask.icon||mission.icon;$('#puzzle-question').textContent=puzzleTask.prompt;$('#puzzle-feedback').textContent='';$('#speech-status').textContent='';$('#choice-list').innerHTML='';puzzleTask.options.forEach((opt,i)=>{const b=document.createElement('button');b.className='choice-button';b.disabled=true;b.innerHTML=`<span>${escapeHtml(opt[0])}</span><span>${escapeHtml(opt[1])}</span>`;b.addEventListener('click',()=>chooseOption(i,b));$('#choice-list').appendChild(b);});setScreen('puzzle-screen');if(timerNoticePlaying)$('#puzzle-read-button').disabled=true;else readPuzzleAloud();}
  function advanceAfterPuzzle(){if(scene!=='puzzle-screen')return;const advance=()=>{if(scene!=='puzzle-screen')return;puzzleTask=null;if(save.progress>=mission.tasks.length){finishMission();}else{world.checkpoint=player.x;$('#hint-text').textContent=`Bravo ! Continuons pour aider ${mission.friend}.`;setScreen('game-screen');lastTime=performance.now();requestAnimationFrame(loop);}};if(timerAnnouncementPending)speakTimerNotice(advance);else advance();}
  function chooseOption(index,button){if(!puzzleTask||puzzleResolved||$('#choice-list').querySelector('button:disabled'))return;if(index!==puzzleTask.answer){puzzleWrong++;const feedback=retryPhrases[Math.floor(Math.random()*retryPhrases.length)];$('#puzzle-feedback').textContent=feedback;button.classList.add('try-again');if(puzzleWrong>=2){const answer=$('#choice-list').children[puzzleTask.answer];answer.classList.add('hint-answer');}$('#choice-list').querySelectorAll('button').forEach(choice=>choice.disabled=true);const restoreChoices=()=>{if(scene==='puzzle-screen'&&!puzzleResolved){$('#speech-status').textContent='À toi de choisir.';$('#choice-list').querySelectorAll('button').forEach(choice=>choice.disabled=false);}};sayText(feedback,()=>{if(timerAnnouncementPending)speakTimerNotice(restoreChoices);else restoreChoices();});sound('soft');return;}puzzleResolved=true;$('#choice-list').querySelectorAll('button').forEach(choice=>choice.disabled=true);const station=world.stations.find(s=>!s.done);if(station){station.done=true;save.progress=(save.progress||0)+1;writeSave();$('#progress-dots').children[station.i]?.classList.add('done');sprinkle(station.x,world.floor-90);}const feedback=praisePhrases[Math.floor(Math.random()*praisePhrases.length)];$('#puzzle-feedback').textContent=feedback;sound('success');const started=sayText(feedback,()=>advanceAfterPuzzle());if(!started)setTimeout(advanceAfterPuzzle,500);}
  function attackNearestEnemy(){if(scene!=='game-screen'||performance.now()-lastMagicTime<500)return;lastMagicTime=performance.now();const nearby=world.enemies.filter(enemy=>!enemy.friendly&&Math.abs(enemy.x-(player.x+player.w/2))<175).sort((a,b)=>Math.abs(a.x-player.x)-Math.abs(b.x-player.x))[0];sound('magic');if(nearby){nearby.friendly=true;save.coinTotal=(Number(save.coinTotal)||0)+2;$('#coin-count').textContent=String(save.coinTotal);sprinkle(nearby.x,world.floor-45);showToast('Il devient ton ami et te suit ! +2 pièces');writeSave();}else{sprinkle(player.x+player.w/2+player.facing*65,player.y+player.h/2);}}
  function finishMission(){if(scene==='ending-screen')return;save.activeMission=null;save.activeHero=null;save.activeDate=null;save.progress=0;save.sessionElapsed=sessionElapsed;save.stopAfterMission=stopAfterMission;writeSave();$('#ending-message').textContent=`${mission.outro} ${heroes[activeHero].message}`;$('#ending-hero').innerHTML=heroSvg(activeHero);const friendCount=mission.enemies.filter(enemy=>enemy.friendly).length;$('#ending-friends').innerHTML=friendCount?`<strong>Toute la bande te suit !</strong><div class="friend-parade" aria-label="${friendCount} petits amis suivent le héros">${mission.enemies.filter(enemy=>enemy.friendly).map((enemy,index)=>`<span class="parade-friend" style="--friend-delay:${index*45}ms" aria-hidden="true"><i></i><b>♥</b></span>`).join('')}</div><small>${friendCount} petit${friendCount>1?'s':''} ami${friendCount>1?'s':''} dans ta file de héros</small>`:'';$('#ending-friends').classList.toggle('hidden',friendCount===0);$('#new-mission-button').classList.toggle('hidden',stopAfterMission);$('#ending-rest-title').textContent=stopAfterMission?'Le héros va se reposer maintenant.':'Belle mission !';$('#ending-rest-copy').textContent=stopAfterMission?'Tu as terminé ta mission tranquillement.':'Tu peux repartir ou terminer la partie.';$('#finish-button').innerHTML=stopAfterMission?'Terminer, le héros se repose <span>♥</span>':'Terminer <span>♥</span>';setScreen('ending-screen');sound('finish');}
  function endSession(){sessionActive=false;sessionElapsed=0;sessionTimerLimit=0;stopAfterMission=false;timerWarningSent=false;timerAnnouncementPending=false;timerNoticePlaying=false;save.sessionActive=false;save.sessionElapsed=0;save.sessionTimerLimit=0;save.stopAfterMission=false;save.timerWarningSent=false;save.timerAnnouncementPending=false;save.activeMission=null;save.activeHero=null;save.activeDate=null;save.progress=0;writeSave();$('#session-timer-row').classList.remove('hidden');setScreen('home');}
  function heroSvg(id){const colors=heroes[id];const className=`${id}`;return `<svg class="${className}" viewBox="0 0 180 210" aria-hidden="true"><ellipse cx="90" cy="194" rx="53" ry="10" fill="#c5e7f5"/><path d="M48 110 17 145l37-7M132 110l31 35-37-7" fill="${colors.cape}" stroke="#76536e" stroke-width="5" stroke-linejoin="round"/><path d="M63 100h54l15 61H49z" fill="${colors.suit}" stroke="#76536e" stroke-width="5"/><path d="m90 111 6 12 13 2-10 9 2 13-11-7-11 7 2-13-10-9 13-2z" fill="${colors.accent}"/><path d="M58 157h27l-7 29H51zM96 157h27l9 29h-29z" fill="${colors.suit}" stroke="#76536e" stroke-width="4"/><path d="M46 187h36q6 0 6 6v6H45q-8 0-8-6t9-6zm49 0h38q8 0 8 7t-8 5h-35z" fill="#47b8eb" stroke="#386c9e" stroke-width="4"/><circle cx="90" cy="66" r="39" fill="${colors.skin}" stroke="#76536e" stroke-width="4"/><path d="M51 66Q48 23 90 22q40 0 40 45l-17-12-20-14-23 18z" fill="${colors.hair}" stroke="#76536e" stroke-width="5"/><path d="M57 68q33-24 66 0v19q-33 15-66 0z" fill="${colors.accent}" stroke="#76536e" stroke-width="4"/><ellipse cx="76" cy="76" rx="6" ry="8" fill="#293b5b"/><ellipse cx="104" cy="76" rx="6" ry="8" fill="#293b5b"/><path d="M79 96q11 10 22 0" fill="none" stroke="#9d4b40" stroke-width="4" stroke-linecap="round"/></svg>`;}
  function sprinkle(x,y){const rand=seeded(hash(`${performance.now()}-${x}`));for(let i=0;i<22;i++)particles.push({x:x+(rand()-.5)*60,y:y+(rand()-.5)*38,vx:(rand()-.5)*145,vy:-rand()*115-25,life:.6+rand()*.6,r:2+rand()*4,color:['#ffca56','#f2776f','#7abce7','#6bc487','#a991e6'][i%5]});}
  function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
  function sound(kind){if(!audioEnabled||(!effectsEnabled&&['jump','open','soft','magic','coin'].includes(kind)))return;try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const notes={start:[523,659],jump:[440],open:[392],soft:[330],magic:[784,988],coin:[988,1318],success:[659,784,988],finish:[523,659,784]};const arr=notes[kind]||[440];arr.forEach((freq,i)=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audio.currentTime+i*.07);gain.gain.exponentialRampToValueAtTime(kind==='finish'?.045:.025,audio.currentTime+i*.07+.02);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+i*.07+.24);osc.connect(gain);gain.connect(audio.destination);osc.start(audio.currentTime+i*.07);osc.stop(audio.currentTime+i*.07+.25);});}catch{}}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  $('#start-button').addEventListener('click',startToday);
  document.querySelectorAll('.hero-card').forEach(card=>card.addEventListener('click',()=>chooseHero(card.dataset.hero)));
  document.querySelectorAll('[data-go="home"]').forEach(b=>b.addEventListener('click',()=>setScreen('home')));
  $('.settings-open').addEventListener('click',()=>setScreen('settings-screen'));
  $('#pause-button').addEventListener('click',()=>{if(scene==='game-screen'){pausedFrom='game-screen';setScreen('pause-screen');}});
  $('#resume-button').addEventListener('click',()=>{const target=pausedFrom;setScreen(target);lastActiveTick=performance.now();if(target==='game-screen'){lastTime=performance.now();requestAnimationFrame(loop);if(timerAnnouncementPending)speakTimerNotice();}else if(target==='puzzle-screen')readPuzzleAloud();});
  $('#help-button').addEventListener('click',openPuzzle);
  canvas.addEventListener('click',(event)=>{
    if(scene!=='game-screen')return;
    const rect=canvas.getBoundingClientRect();
    const canvasX=(event.clientX-rect.left)/rect.width*view.w;
    const canvasY=(event.clientY-rect.top)/rect.height*view.h;
    const station=world.stations.find(item=>!item.done&&Math.abs(canvasX+world.camera-item.x)<58&&canvasY>world.floor-135&&canvasY<world.floor-12);
    if(!station)return;
    if(Math.abs(player.x+player.w/2-station.x)<150&&player.grounded)openPuzzle();
    else showToast('Approche-toi de la pancarte AIDER.');
  });
  $('#puzzle-read-button').addEventListener('click',readPuzzleAloud);
  $('#new-mission-button').addEventListener('click',()=>{if(!stopAfterMission)setScreen('hero-select');});
  $('#finish-button').addEventListener('click',endSession);
  $('#sound-button').addEventListener('click',()=>{audioEnabled=!audioEnabled;save.audioEnabled=audioEnabled;writeSave();$('#sound-button').textContent=audioEnabled?'♫':'♪';$('#sound-button').setAttribute('aria-label',audioEnabled?'Couper les sons':'Activer les sons');$('#music-toggle').checked=audioEnabled;if(audioEnabled)sound('success');});
  $('#music-toggle').checked=audioEnabled;$('#effects-toggle').checked=effectsEnabled;
  $('#music-toggle').addEventListener('change',e=>{audioEnabled=e.target.checked;save.audioEnabled=audioEnabled;writeSave();});
  $('#effects-toggle').addEventListener('change',e=>{effectsEnabled=e.target.checked;save.effectsEnabled=effectsEnabled;writeSave();});
  document.querySelectorAll('.touch-button[data-control]').forEach(button=>{const key=button.dataset.control;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);keys[key]=true;button.classList.add('pressed');});['pointerup','pointercancel','pointerleave'].forEach(type=>button.addEventListener(type,()=>{keys[key]=false;button.classList.remove('pressed');}));});
  $('#attack-button').addEventListener('click',attackNearestEnemy);
  window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','a','d','A','D','x','X'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keys.left=true;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keys.right=true;if(e.key===' '||e.key==='ArrowUp')keys.jump=true;if((e.key==='x'||e.key==='X')&&!e.repeat)attackNearestEnemy();if(e.key==='Escape'&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}if(e.key==='Enter'&&scene==='game-screen'&&!$('#interaction-prompt').classList.contains('hidden'))openPuzzle();});
  window.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keys.left=false;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keys.right=false;});
  window.addEventListener('resize',resizeCanvas);document.addEventListener('visibilitychange',()=>{if(document.hidden&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}});
  $('#home').addEventListener('click',()=>{});
  $('#sound-button').textContent=audioEnabled?'♫':'♪';
  $('#sound-button').setAttribute('aria-label',audioEnabled?'Couper les sons':'Activer les sons');
  lastActiveTick=performance.now();setInterval(tickMissionClock,250);
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  requestAnimationFrame((t)=>{lastTime=t;});
})();
