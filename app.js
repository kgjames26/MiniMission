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

  let save = readSave();
  let activeHero = null;
  let mission = null;
  let scene = 'home';
  let puzzleTask = null;
  let puzzleWrong = 0;
  let puzzleResolved = false;
  let lastTime = 0;
  let elapsed = 0;
  let lastActiveTick = 0;
  let timeWarningSent = false;
  let pausedFrom = 'game-screen';
  let toastTimer = 0;
  let audio = null;
  let audioEnabled = save.audioEnabled !== false;
  let effectsEnabled = save.effectsEnabled !== false;
  let keys = { left: false, right: false, jump: false };
  let view = { scale: 1, ox: 0, oy: 0, w: 960, h: 540 };
  let world = { width: 3100, floor: 426, camera: 0, checkpoint: 60, stations: [], bumps: [] };
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
    const index = ((dayIndex() % missionTemplates.length) + missionTemplates.length) % missionTemplates.length;
    const template = missionTemplates[index];
    const seed = hash(`${dayKey()}-${heroId}-${template.title}`);
    const random = seeded(seed);
    const variants = [
      { suffix: '', palette: ['#fff2bb','#ffc96b','#e28a6e'] },
      { suffix: ' — nouvelle aventure', palette: ['#d6f7ed','#7ac3a0','#8ea5dc'] },
      { suffix: ' — version surprise', palette: ['#eee5ff','#af9ce3','#f08d84'] }
    ];
    const variant = variants[Math.floor(random()*variants.length)];
    const tasks = template.tasks.map((task) => {
      const order = [0,1,2];
      for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
      const options = order.map(i => task.options[i]);
      return { ...task, options, answer: order.indexOf(task.answer) };
    });
    return { ...template, title: template.title + variant.suffix, tasks, seed, palette: variant.palette };
  }
  function hash(value) { let h = 2166136261; for (let i=0;i<value.length;i++) { h ^= value.charCodeAt(i); h = Math.imul(h,16777619); } return h >>> 0; }
  function seeded(seed) { let s = seed || 1; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function setScreen(id) { screens.forEach(s => s.classList.toggle('active', s.id === id)); scene = id; if (id !== 'game-screen') keys = { left:false, right:false, jump:false }; if (!['game-screen','puzzle-screen'].includes(id)) lastActiveTick=performance.now(); if (id === 'game-screen') resizeCanvas(); }
  function completedToday() { return save.completedDate === dayKey(); }
  function startToday() {
    if (completedToday()) { $('#done-hero-copy').textContent = `${heroes[save.completedHero]?.name || 'Ton héros'} se repose après cette belle aventure.`; setScreen('done-screen'); return; }
    if (save.activeDate === dayKey() && save.activeHero && save.activeMission) { activeHero = save.activeHero; mission = save.activeMission; beginGame(true); return; }
    setScreen('hero-select');
  }
  function chooseHero(heroId) {
    if (!heroes[heroId]) return;
    activeHero = heroId;
    mission = todaysMission(heroId);
    save.activeDate = dayKey(); save.activeHero = heroId; save.activeMission = mission; save.progress = 0; writeSave();
    beginGame(false);
  }
  function beginGame(resume) {
    if (!mission || !activeHero) return;
    $('#mission-title').textContent = mission.title;
    $('#hint-text').textContent = resume ? 'Ta mission t’attend. Avance doucement.' : `Avance, saute et retrouve ${mission.friend}.`;
    $('#progress-dots').innerHTML = mission.tasks.map((_,i)=>`<span class="progress-dot ${i < (save.progress||0) ? 'done' : ''}"></span>`).join('');
    world.width = 3100; world.floor = 426; world.camera = 0; world.checkpoint = 60;
    const rnd = seeded(mission.seed);
    world.stations = [0,1,2].map(i => ({x:620+i*780, i, done:i<(save.progress||0), bob:rnd()*6}));
    world.bumps = [350, 470, 910, 1080, 1330, 1670, 1830, 2110, 2340, 2630, 2820].map((x,i)=>({x:x+rnd()*70,w:34+rnd()*35,h:18+rnd()*24,type:i%3}));
    player = {x: Math.max(70, (save.progress||0)*770+120), y:world.floor-86, vx:0, vy:0, w:58,h:86,grounded:true,jumping:false,facing:1,bob:0};
    particles=[]; lastPromptStation=-1; elapsed=0; timeWarningSent=false; lastActiveTick=performance.now(); lastTime=performance.now();
    $('#interaction-prompt').classList.add('hidden');
    setScreen('game-screen'); requestAnimationFrame(loop);
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
  function tickMissionClock(){const now=performance.now();if(!mission||!['game-screen','puzzle-screen'].includes(scene)){lastActiveTick=now;return;}if(!lastActiveTick){lastActiveTick=now;return;}elapsed+=Math.min(1,Math.max(0,(now-lastActiveTick)/1000));lastActiveTick=now;if(elapsed>=480&&!timeWarningSent){$('#hint-text').textContent='Encore un petit coup de main, puis le héros rentrera se reposer.';timeWarningSent=true;}if(elapsed>=590)finishMission(true);}
  function update(dt) {
    const move = (keys.right?1:0)-(keys.left?1:0);
    player.vx = move*235; if(move) player.facing=move;
    if(keys.jump && player.grounded) { player.vy=-600; player.grounded=false; player.jumping=true; sound('jump'); }
    keys.jump=false;
    const previousX=player.x; player.x += player.vx*dt; player.x=Math.max(18,Math.min(world.width-player.w,player.x));
    player.vy += 1450*dt; player.y += player.vy*dt;
    for(const b of world.bumps){if(b.type!==0)continue;const overlap=player.x+player.w>b.x&&player.x<b.x+b.w;const stillBeside=player.y+player.h>world.floor-b.h+4;if(overlap&&stillBeside&&player.y+player.h>world.floor-b.h){player.x=previousX;player.vx=0;if(player.x>world.checkpoint)world.checkpoint=player.x;}}
    const feet=player.y+player.h;
    if(feet>=world.floor) { if(!player.grounded && player.vy>100) { player.y=world.floor-player.h; player.vy=0; player.grounded=true; player.jumping=false; if(player.x>world.checkpoint) world.checkpoint=player.x; } else if(player.grounded){player.y=world.floor-player.h;player.vy=0;} }
    if(player.y>650) { player.x=world.checkpoint; player.y=world.floor-player.h; player.vy=0; player.grounded=true; showToast('On reprend juste ici. Tout va bien !'); }
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
    drawSky(time); drawHills(); drawTown(time); drawWorld(); drawPlayer(time); drawParticles();
  }
  function drawSky(time){const W=view.w,p=mission?.palette||[];const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,p[0]||'#70d0f4');g.addColorStop(.67,p[2]||'#c8f1fa');g.addColorStop(1,'#e8f9e9');ctx.fillStyle=g;ctx.fillRect(0,0,W,540);for(let i=0;i<Math.ceil(W/260)+2;i++){const x=((i*260-world.camera*.16+time*3)%(W+260))-130,y=55+(i%3)*48;cloud(x,y,1+(i%2)*.18);}}
  function cloud(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.ellipse(0,12,49,18,0,0,Math.PI*2);ctx.ellipse(-23,2,24,20,0,0,Math.PI*2);ctx.ellipse(0,-5,28,27,0,0,Math.PI*2);ctx.ellipse(26,4,24,19,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawHills(){const W=view.w,p=mission?.palette||[];ctx.fillStyle=p[1]||'#9edba8';ctx.beginPath();ctx.moveTo(0,355);for(let x=0;x<=W;x+=5){ctx.lineTo(x,350+28*Math.sin((x+world.camera*.18)/160)+16*Math.sin(x/63));}ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();ctx.fillStyle='#78c98e';ctx.beginPath();ctx.moveTo(0,395);for(let x=0;x<=W;x+=5)ctx.lineTo(x,390+22*Math.sin((x+world.camera*.31)/125));ctx.lineTo(W,540);ctx.lineTo(0,540);ctx.fill();}
  function drawTown(time){const W=view.w;for(let i=0;i<Math.ceil(W/430)+3;i++){const wx=i*430+80;const x=wx-world.camera*.48;if(x<-130||x>W+130)continue;const h=110+(i%3)*22,w=108+(i%2)*25,y=390-h;ctx.fillStyle=['#f8bb86','#f3d27f','#b9dcec','#d7b7e6'][i%4];roundRect(x,y,w,h,10,true);ctx.fillStyle='#e8877d';ctx.beginPath();ctx.moveTo(x-9,y+4);ctx.lineTo(x+w/2,y-44);ctx.lineTo(x+w+9,y+4);ctx.closePath();ctx.fill();for(let r=0;r<2;r++)for(let c=0;c<2;c++){ctx.fillStyle='rgba(255,255,255,.86)';roundRect(x+18+c*44,y+26+r*34,19,23,6,true);ctx.fillStyle='#90cadf';ctx.fillRect(x+26+c*44,y+26+r*34,3,23);ctx.fillRect(x+18+c*44,y+36+r*34,19,3);}ctx.fillStyle='#ab7860';roundRect(x+w/2-13,y+h-53,26,53,12,true);}
    for(let i=0;i<Math.ceil(W/600)+2;i++){const x=i*600+230-world.camera*.75;if(x<-70||x>W+70)continue;ctx.fillStyle='#946b53';roundRect(x-7,326,14,100,7,true);ctx.fillStyle=['#69c57c','#82d58d','#60b978'][i%3];ctx.beginPath();ctx.arc(x,310,43,0,Math.PI*2);ctx.arc(x-26,321,30,0,Math.PI*2);ctx.arc(x+25,320,31,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.23)';ctx.beginPath();ctx.arc(x-13,291,14,0,Math.PI*2);ctx.fill();}}
  function drawWorld(){const W=view.w,p=mission?.palette||[];const floorY=world.floor;ctx.fillStyle=p[1]||'#76c78d';ctx.fillRect(0,floorY,W,120);ctx.fillStyle='#8ed49c';ctx.fillRect(0,floorY+13,W,7);ctx.fillStyle=p[0]||'#d6b785';ctx.fillRect(0,floorY+25,W,145);ctx.fillStyle='#c5a577';for(let i=-1;i<Math.ceil(W/80)+2;i++){const x=((i*80-world.camera*.9)%(W+80));ctx.fillRect(x,floorY+42,48,3);}
    for(let i=0;i<Math.ceil(W/120)+2;i++){const x=(i*120+35-world.camera*.9)%(W+120);flower(x,world.floor+7,i%4);}
    world.bumps.forEach((b,i)=>{const x=b.x-world.camera;if(x<-80||x>W+80)return;if(b.type===0){ctx.fillStyle='#d2ab79';roundRect(x,world.floor-b.h,b.w,b.h,10,true);ctx.fillStyle='#eccd9b';roundRect(x+4,world.floor-b.h+3,b.w-8,7,5,true);}else if(b.type===1){ctx.fillStyle='#69bc7d';ctx.beginPath();ctx.ellipse(x+b.w/2,world.floor-b.h/2,b.w/2,b.h/2,0,Math.PI,0);ctx.fill();ctx.fillStyle='#8cd491';ctx.beginPath();ctx.arc(x+b.w*.35,world.floor-b.h*.48,6,0,Math.PI*2);ctx.fill();}else{ctx.fillStyle='#f2ca5d';roundRect(x,world.floor-b.h,b.w,b.h,8,true);ctx.fillStyle='#fff0ad';ctx.beginPath();ctx.arc(x+b.w/2,world.floor-b.h,6,0,Math.PI*2);ctx.fill();}});
    world.stations.forEach((station)=>{const x=station.x-world.camera;if(x<-100||x>W+100)return;const bob=Math.sin(performance.now()/650+station.bob)*5;ctx.fillStyle=station.done?'#a7dfad':'rgba(255,255,255,.45)';ctx.beginPath();ctx.ellipse(x,world.floor-9,51,15,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=station.done?'#5fb983':'#fff6c8';ctx.beginPath();ctx.arc(x,world.floor-92+bob,37,0,Math.PI*2);ctx.fill();ctx.strokeStyle=station.done?'#47a76d':'#f1c44f';ctx.lineWidth=4;ctx.stroke();ctx.textAlign='center';ctx.font='27px sans-serif';ctx.fillText(station.done?'✓':mission.icon,x,world.floor-82+bob);if(!station.done){ctx.fillStyle='#fff';roundRect(x-30,world.floor-45+bob,60,25,12,true);ctx.fillStyle='#557b8e';ctx.font='bold 12px Nunito, sans-serif';ctx.fillText('AIDER',x,world.floor-28+bob);}});
    const finishX=world.width-world.camera-90;ctx.fillStyle='#fff7cd';ctx.beginPath();ctx.arc(finishX,world.floor-58,32,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f1bd45';ctx.lineWidth=4;ctx.stroke();ctx.font='25px sans-serif';ctx.textAlign='center';ctx.fillText('🏡',finishX,world.floor-49);}
  function flower(x,y,i){ctx.fillStyle='#438f5d';ctx.fillRect(x,y-10,2,13);ctx.fillStyle=['#ff7e77','#fff0a5','#8b79d8','#fff'][i];for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ctx.beginPath();ctx.arc(x+Math.cos(a)*4,y-11+Math.sin(a)*4,3,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f7be43';ctx.beginPath();ctx.arc(x,y-11,2.3,0,Math.PI*2);ctx.fill();}
  function drawPlayer(time){const x=player.x-world.camera+player.w/2,y=player.y+player.h/2+(player.grounded?Math.sin(player.bob)*1.5:0);drawHero(ctx,x,y,activeHero,time,player.facing,player.grounded);}
  function drawHero(c,x,y,id,time,facing=1,grounded=true){const h=heroes[id]||heroes.ziggy;const walking=grounded&&Math.abs(player.vx)>1;const step=walking?Math.sin(time*13)*.42:0;const armStep=walking?Math.sin(time*13+Math.PI)*.28:0;c.save();c.translate(x,y);c.scale(facing,1);const bob=grounded&&!walking?Math.sin(time*2)*1.3:walking?Math.abs(Math.sin(time*13))*2:0;c.translate(0,bob);c.fillStyle='rgba(36,87,107,.16)';c.beginPath();c.ellipse(0,44,28,7,0,0,Math.PI*2);c.fill();c.fillStyle=h.cape;c.beginPath();c.moveTo(-10,-19);c.lineTo(-32,25+Math.sin(time*5)*2);c.quadraticCurveTo(-5,23,1,-18);c.fill();for(const side of [-1,1]){c.save();c.translate(side*17,-7);c.rotate(side*armStep);c.fillStyle=h.suit;roundRect(-6,0,12,25,6,true);c.fillStyle=h.accent;roundRect(-7,20,14,9,5,true);c.restore();}for(const side of [-1,1]){c.save();c.translate(side*10,16);c.rotate(side*step);c.fillStyle=h.suit;roundRect(-7,0,14,24,7,true);c.fillStyle='#547bad';roundRect(-10,18,20,10,5,true);c.restore();}c.fillStyle=h.suit;roundRect(-21,-19,42,44,14,true);c.strokeStyle='#76536e';c.lineWidth=3;c.stroke();c.fillStyle=h.accent;c.beginPath();c.moveTo(0,-11);c.lineTo(5,-1);c.lineTo(16,1);c.lineTo(8,8);c.lineTo(10,19);c.lineTo(0,13);c.lineTo(-10,19);c.lineTo(-8,8);c.lineTo(-16,1);c.lineTo(-5,-1);c.closePath();c.fill();c.fillStyle=h.skin;c.beginPath();c.arc(0,-35,23,0,Math.PI*2);c.fill();c.fillStyle=h.hair;c.beginPath();c.arc(0,-40,23,Math.PI,Math.PI*2);c.quadraticCurveTo(18,-57,22,-35);c.lineTo(12,-42);c.lineTo(2,-48);c.lineTo(-11,-39);c.lineTo(-21,-33);c.closePath();c.fill();c.fillStyle=id==='ziggy'?'#ffd34f':id==='filou'?'#e9f8ff':'#ffe17a';roundRect(-23,-37,46,13,6,true);c.fillStyle='#2e4257';c.beginPath();c.arc(-8,-32,2.3,0,Math.PI*2);c.arc(8,-32,2.3,0,Math.PI*2);c.fill();c.strokeStyle='#9b5b48';c.lineWidth=2;c.beginPath();c.arc(0,-24,6,.1,Math.PI-.1);c.stroke();c.fillStyle=h.accent;c.beginPath();c.arc(0,-19,4,0,Math.PI*2);c.fill();c.restore();}
  function drawParticles(){particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x-world.camera,p.y,p.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;}
  function roundRect(x,y,w,h,r,fill=true){ctx.beginPath();if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else{ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);}if(fill)ctx.fill();else ctx.stroke();}
  function openPuzzle(){const station=world.stations.find(s=>!s.done);if(!station)return;const index=station.i; puzzleTask=mission.tasks[index];puzzleWrong=0;puzzleResolved=false;$('#puzzle-icon').textContent=mission.icon;$('#puzzle-question').textContent=puzzleTask.prompt;$('#puzzle-feedback').textContent='';$('#choice-list').innerHTML='';puzzleTask.options.forEach((opt,i)=>{const b=document.createElement('button');b.className='choice-button';b.innerHTML=`<span>${escapeHtml(opt[0])}</span><span>${escapeHtml(opt[1])}</span>`;b.addEventListener('click',()=>chooseOption(i,b));$('#choice-list').appendChild(b);});setScreen('puzzle-screen');sound('open');}
  function chooseOption(index,button){if(!puzzleTask||puzzleResolved)return;if(index!==puzzleTask.answer){puzzleWrong++;$('#puzzle-feedback').textContent=puzzleWrong>=2?'Regarde bien l’image. On peut réessayer ensemble.':'Bonne idée. Regardons encore une fois.';button.classList.add('try-again');if(puzzleWrong>=2){const answer=$('#choice-list').children[puzzleTask.answer];answer.classList.add('hint-answer');}sound('soft');return;}puzzleResolved=true;$('#choice-list').querySelectorAll('button').forEach(choice=>choice.disabled=true);const station=world.stations.find(s=>!s.done);if(station){station.done=true;save.progress=(save.progress||0)+1;writeSave();$('#progress-dots').children[station.i]?.classList.add('done');sprinkle(station.x,world.floor-90);}$('#puzzle-feedback').textContent='Oui, c’est une belle idée !';sound('success');setTimeout(()=>{if(scene!=='puzzle-screen'||completedToday())return;puzzleTask=null;if(save.progress>=mission.tasks.length){finishMission(false);}else{world.checkpoint=player.x;$('#hint-text').textContent=`Bravo ! Continuons pour aider ${mission.friend}.`;setScreen('game-screen');lastTime=performance.now();requestAnimationFrame(loop);}},reduceMotion?300:700);}
  function finishMission(fromLimit){if(scene==='ending-screen'||scene==='done-screen')return;save.completedDate=dayKey();save.completedHero=activeHero;save.progress=mission.tasks.length;save.activeMission=null;save.activeHero=null;writeSave();$('#ending-message').textContent=fromLimit?'Tu as fait de ton mieux. Le héros rentre se reposer maintenant.':`${mission.outro} ${heroes[activeHero].message}`;$('#ending-hero').innerHTML=heroSvg(activeHero);setScreen('ending-screen');sound('finish');}
  function heroSvg(id){const colors=heroes[id];const className=`${id}`;return `<svg class="${className}" viewBox="0 0 180 210" aria-hidden="true"><ellipse cx="90" cy="194" rx="53" ry="10" fill="#c5e7f5"/><path d="M48 110 17 145l37-7M132 110l31 35-37-7" fill="${colors.cape}" stroke="#76536e" stroke-width="5" stroke-linejoin="round"/><path d="M63 100h54l15 61H49z" fill="${colors.suit}" stroke="#76536e" stroke-width="5"/><path d="m90 111 6 12 13 2-10 9 2 13-11-7-11 7 2-13-10-9 13-2z" fill="${colors.accent}"/><path d="M58 157h27l-7 29H51zM96 157h27l9 29h-29z" fill="${colors.suit}" stroke="#76536e" stroke-width="4"/><path d="M46 187h36q6 0 6 6v6H45q-8 0-8-6t9-6zm49 0h38q8 0 8 7t-8 5h-35z" fill="#47b8eb" stroke="#386c9e" stroke-width="4"/><circle cx="90" cy="66" r="39" fill="${colors.skin}" stroke="#76536e" stroke-width="4"/><path d="M51 66Q48 23 90 22q40 0 40 45l-17-12-20-14-23 18z" fill="${colors.hair}" stroke="#76536e" stroke-width="5"/><path d="M57 68q33-24 66 0v19q-33 15-66 0z" fill="${colors.accent}" stroke="#76536e" stroke-width="4"/><ellipse cx="76" cy="76" rx="6" ry="8" fill="#293b5b"/><ellipse cx="104" cy="76" rx="6" ry="8" fill="#293b5b"/><path d="M79 96q11 10 22 0" fill="none" stroke="#9d4b40" stroke-width="4" stroke-linecap="round"/></svg>`;}
  function sprinkle(x,y){const rand=seeded(hash(`${performance.now()}-${x}`));for(let i=0;i<22;i++)particles.push({x:x+(rand()-.5)*60,y:y+(rand()-.5)*38,vx:(rand()-.5)*145,vy:-rand()*115-25,life:.6+rand()*.6,r:2+rand()*4,color:['#ffca56','#f2776f','#7abce7','#6bc487','#a991e6'][i%5]});}
  function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
  function sound(kind){if(!audioEnabled||(!effectsEnabled&&['jump','open','soft'].includes(kind)))return;try{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const notes={start:[523,659],jump:[440],open:[392],soft:[330],success:[659,784,988],finish:[523,659,784]};const arr=notes[kind]||[440];arr.forEach((freq,i)=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audio.currentTime+i*.07);gain.gain.exponentialRampToValueAtTime(kind==='finish'?.045:.025,audio.currentTime+i*.07+.02);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+i*.07+.24);osc.connect(gain);gain.connect(audio.destination);osc.start(audio.currentTime+i*.07);osc.stop(audio.currentTime+i*.07+.25);});}catch{}}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  $('#start-button').addEventListener('click',startToday);
  document.querySelectorAll('.hero-card').forEach(card=>card.addEventListener('click',()=>chooseHero(card.dataset.hero)));
  document.querySelectorAll('[data-go="home"]').forEach(b=>b.addEventListener('click',()=>setScreen('home')));
  $('.settings-open').addEventListener('click',()=>setScreen('settings-screen'));
  $('#pause-button').addEventListener('click',()=>{if(scene==='game-screen'){pausedFrom='game-screen';setScreen('pause-screen');}});
  $('#resume-button').addEventListener('click',()=>{const target=pausedFrom;setScreen(target);lastActiveTick=performance.now();if(target==='game-screen'){lastTime=performance.now();requestAnimationFrame(loop);}});
  $('#help-button').addEventListener('click',openPuzzle);
  $('#finish-button').addEventListener('click',()=>{setScreen('done-screen');$('#done-hero-copy').textContent=`${heroes[save.completedHero]?.name||'Ton héros'} se repose après cette belle aventure.`;});
  $('#sound-button').addEventListener('click',()=>{audioEnabled=!audioEnabled;save.audioEnabled=audioEnabled;writeSave();$('#sound-button').textContent=audioEnabled?'♫':'♪';$('#sound-button').setAttribute('aria-label',audioEnabled?'Couper les sons':'Activer les sons');$('#music-toggle').checked=audioEnabled;if(audioEnabled)sound('success');});
  $('#music-toggle').checked=audioEnabled;$('#effects-toggle').checked=effectsEnabled;
  $('#music-toggle').addEventListener('change',e=>{audioEnabled=e.target.checked;save.audioEnabled=audioEnabled;writeSave();});
  $('#effects-toggle').addEventListener('change',e=>{effectsEnabled=e.target.checked;save.effectsEnabled=effectsEnabled;writeSave();});
  let resetTimer=0;$('#reset-day-button').addEventListener('pointerdown',()=>{resetTimer=setTimeout(()=>{save.completedDate=null;save.activeDate=null;save.activeHero=null;save.activeMission=null;save.progress=0;writeSave();showToast('La mission du jour est prête.');},1800);});
  ['pointerup','pointercancel','pointerleave'].forEach(e=>$('#reset-day-button').addEventListener(e,()=>clearTimeout(resetTimer)));
  document.querySelectorAll('.touch-button').forEach(button=>{const key=button.dataset.control;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);keys[key]=true;button.classList.add('pressed');});['pointerup','pointercancel','pointerleave'].forEach(type=>button.addEventListener(type,()=>{keys[key]=false;button.classList.remove('pressed');}));});
  window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','a','d','A','D'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keys.left=true;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keys.right=true;if(e.key===' '||e.key==='ArrowUp')keys.jump=true;if(e.key==='Escape'&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}if(e.key==='Enter'&&scene==='game-screen'&&!$('#interaction-prompt').classList.contains('hidden'))openPuzzle();});
  window.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')keys.left=false;if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')keys.right=false;});
  window.addEventListener('resize',resizeCanvas);document.addEventListener('visibilitychange',()=>{if(document.hidden&&(scene==='game-screen'||scene==='puzzle-screen')){pausedFrom=scene;setScreen('pause-screen');}});
  $('#home').addEventListener('click',()=>{});
  $('#sound-button').textContent=audioEnabled?'♫':'♪';
  $('#sound-button').setAttribute('aria-label',audioEnabled?'Couper les sons':'Activer les sons');
  lastActiveTick=performance.now();setInterval(tickMissionClock,250);
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  requestAnimationFrame((t)=>{lastTime=t;});
})();
