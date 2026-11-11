/* Autocollants : 5 pages de 12 (8 bronze, 3 argent, 1 or).
   - bronze : une bonne réponse à une énigme (les plus nombreux)
   - argent : toutes les étoiles d'une mission (moyennement rare)
   - or     : les 26 lettres d'une mission (le plus rare) */
(() => {
  const MM = (window.MM = window.MM || {});
  const row = (list, tier) => list.map(([e, n]) => ({ e, n, tier }));
  const PAGES = [
    { title: 'La ferme', icon: '🐮', color: '#7ecb6a', slots: [
      ...row([['🐮','la vache'],['🐷','le cochon'],['🐔','la poule'],['🐑','le mouton'],['🐴','le cheval'],['🦆','le canard'],['🐐','la chèvre'],['🐰','le lapin']], 'bronze'),
      ...row([['🚜','le tracteur'],['🌻','le tournesol'],['🥕','la carotte']], 'silver'),
      ...row([['🐓','le coq d’or']], 'gold')] },
    { title: 'La jungle', icon: '🦁', color: '#f0b040', slots: [
      ...row([['🦁','le lion'],['🐒','le singe'],['🐘','l’éléphant'],['🦒','la girafe'],['🦓','le zèbre'],['🐯','le tigre'],['🦜','le perroquet'],['🐍','le serpent']], 'bronze'),
      ...row([['🦏','le rhinocéros'],['🦛','l’hippopotame'],['🐊','le crocodile']], 'silver'),
      ...row([['🦚','le paon royal']], 'gold')] },
    { title: 'L’océan', icon: '🐬', color: '#4aa8e8', slots: [
      ...row([['🐠','le poisson'],['🐙','la pieuvre'],['🐢','la tortue'],['🐬','le dauphin'],['🦀','le crabe'],['🐳','la baleine'],['🦈','le requin'],['🐚','le coquillage']], 'bronze'),
      ...row([['🦑','le calmar'],['🐡','le poisson-globe'],['🦭','le phoque']], 'silver'),
      ...row([['🧜','la sirène']], 'gold')] },
    { title: 'L’espace', icon: '🚀', color: '#8c7ae6', slots: [
      ...row([['🚀','la fusée'],['🌙','la lune'],['⭐','l’étoile'],['🪐','la planète'],['☄️','la comète'],['👽','l’extraterrestre'],['🛸','la soucoupe'],['🌍','la Terre']], 'bronze'),
      ...row([['🔭','le télescope'],['🌞','le soleil'],['🛰️','le satellite']], 'silver'),
      ...row([['🧑‍🚀','l’astronaute']], 'gold')] },
    { title: 'Le pays magique', icon: '🦄', color: '#ee7fbf', slots: [
      ...row([['🦄','la licorne'],['🏰','le château'],['🌈','l’arc-en-ciel'],['🧚','la fée'],['🍭','la sucette'],['🎈','le ballon'],['🧁','le gâteau'],['🎪','le cirque']], 'bronze'),
      ...row([['👑','la couronne'],['🔮','la boule magique'],['🪄','la baguette']], 'silver'),
      ...row([['🐉','le dragon doré']], 'gold')] }
  ];
  const DESC = {"🐮": "La vache mange de l’herbe et nous donne du bon lait. Elle fait meuh !", "🐷": "Le cochon adore se rouler dans la boue pour se rafraîchir. Il fait groin groin !", "🐔": "La poule pond des œufs. Elle fait cot cot codec !", "🐑": "Le mouton a un manteau tout doux, la laine. Il fait bê !", "🐴": "Le cheval court très vite et adore les carottes. Il fait hiii !", "🦆": "Le canard nage sur la mare et fait coin coin !", "🐐": "La chèvre saute partout, même sur les rochers !", "🐰": "Le lapin a de longues oreilles et croque des carottes.", "🚜": "Le tracteur aide le fermier à préparer les champs.", "🌻": "Le tournesol tourne sa grande fleur jaune vers le soleil.", "🥕": "La carotte pousse sous la terre. Croc croc, c’est bon !", "🐓": "Le coq d’or chante cocorico dès que le soleil se lève !", "🦁": "Le lion est le roi de la savane. Il rugit très fort : grrr !", "🐒": "Le singe grimpe aux arbres et adore les bananes.", "🐘": "L’éléphant est très grand. Son long nez, c’est sa trompe !", "🦒": "La girafe a un très long cou pour manger les feuilles tout en haut.", "🦓": "Le zèbre a des rayures noires et blanches. Chaque zèbre a les siennes !", "🐯": "Le tigre a des rayures orange et noires. Il adore nager !", "🦜": "Le perroquet a des plumes colorées et sait répéter des mots.", "🐍": "Le serpent glisse sur le sol sans avoir de pattes.", "🦏": "Le rhinocéros a une grosse corne sur le nez.", "🦛": "L’hippopotame passe ses journées dans l’eau pour se rafraîchir.", "🐊": "Le crocodile vit dans la rivière. Attention à ses dents !", "🦚": "Le paon royal ouvre sa magnifique queue en éventail.", "🐠": "Le poisson respire sous l’eau et nage avec ses nageoires.", "🐙": "La pieuvre a huit bras et peut changer de couleur !", "🐢": "La tortue marine nage pendant très longtemps dans l’océan.", "🐬": "Le dauphin est très malin. Il adore sauter et jouer !", "🦀": "Le crabe marche de côté avec ses grosses pinces.", "🐳": "La baleine est le plus grand animal de la mer. Elle chante sous l’eau !", "🦈": "Le requin nage très vite et a plein de dents.", "🐚": "Le coquillage est la maison d’un petit animal. Écoute : on entend la mer !", "🦑": "Le calmar a dix bras et lance de l’encre pour se cacher.", "🐡": "Le poisson-globe se gonfle comme un ballon quand il a peur.", "🦭": "Le phoque aime se reposer au soleil sur les rochers.", "🧜": "La sirène a une queue de poisson et chante sous la mer.", "🚀": "La fusée décolle très haut, jusqu’aux étoiles !", "🌙": "La lune tourne autour de la Terre et éclaire la nuit.", "⭐": "Une étoile, c’est un soleil très lointain qui brille dans la nuit.", "🪐": "Cette planète a de grands anneaux autour d’elle.", "☄️": "La comète a une longue queue de lumière, comme Ziggy !", "👽": "L’extraterrestre vient d’une autre planète. Il dit bonjour !", "🛸": "La soucoupe volante voyage d’une planète à l’autre.", "🌍": "La Terre est notre planète. C’est là qu’on habite !", "🔭": "Le télescope sert à regarder les étoiles de très près.", "🌞": "Le soleil nous donne de la lumière et de la chaleur.", "🛰️": "Le satellite tourne autour de la Terre et prend des photos.", "🧑‍🚀": "L’astronaute voyage dans l’espace et flotte comme une plume !", "🦄": "La licorne a une corne magique et une crinière arc-en-ciel.", "🏰": "Dans le château vivent des princes et des princesses.", "🌈": "L’arc-en-ciel a sept couleurs. Il apparaît quand il pleut et qu’il y a du soleil.", "🧚": "La fée vole avec ses ailes et fait des vœux avec sa baguette.", "🍭": "La sucette est un bonbon tout rond et tout sucré.", "🎈": "Le ballon s’envole quand il est rempli d’un air très léger.", "🧁": "Le gâteau est délicieux, surtout avec une cerise dessus !", "🎪": "Au cirque, il y a des clowns, des acrobates et de la magie.", "👑": "La couronne se porte sur la tête des rois et des reines.", "🔮": "La boule magique montre des choses mystérieuses.", "🪄": "La baguette magique fait des étincelles. Abracadabra !", "🐉": "Le dragon doré est gentil et garde un trésor brillant."};
  const CITY_BASE = PAGES.length;
  (MM.cityBooks || []).forEach((b) => PAGES.push(b));
  const PER_PAGE = PAGES[0].slots.length;
  const TIERS = {
    bronze: { label: 'Bronze', medal: '🥉', color: '#c98443' },
    silver: { label: 'Argent', medal: '🥈', color: '#9db2c4' },
    gold: { label: 'Or', medal: '🥇', color: '#f4b81c' }
  };
  const info = (id) => { const page = Math.floor(id / PER_PAGE), slot = id % PER_PAGE; const s = PAGES[page].slots[slot]; return { id, page, slot, ...s, d: s.d || DESC[s.e] || '' }; };
  const ids = (tier) => PAGES.flatMap((p, pi) => p.slots.map((s, si) => (!tier || s.tier === tier) ? pi * PER_PAGE + si : -1)).filter((i) => i >= 0);
  // Tire un autocollant du niveau demandé, en privilégiant ceux qu'on n'a pas encore.
  function pick(tier, album, page) {
    const all = ids(tier).filter((id) => page == null || Math.floor(id / PER_PAGE) === page);
    const fresh = all.filter((id) => !(album[id] > 0));
    const pool = fresh.length ? fresh : all;
    const id = pool[Math.floor(Math.random() * pool.length)];
    return { id, isNew: !(album[id] > 0) };
  }
  const owned = (album) => Object.keys(album).filter((k) => album[k] > 0).length;
  const pageOwned = (album, page) => PAGES[page].slots.reduce((n, _, si) => n + (album[page * PER_PAGE + si] > 0 ? 1 : 0), 0);
  MM.stickers = { CITY_BASE, PAGES, PER_PAGE, TIERS, TOTAL: PAGES.length * PER_PAGE, info, ids, pick, owned, pageOwned };
})();
