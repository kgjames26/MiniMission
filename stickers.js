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
  const PER_PAGE = PAGES[0].slots.length;
  const TIERS = {
    bronze: { label: 'Bronze', medal: '🥉', color: '#c98443' },
    silver: { label: 'Argent', medal: '🥈', color: '#9db2c4' },
    gold: { label: 'Or', medal: '🥇', color: '#f4b81c' }
  };
  const info = (id) => { const page = Math.floor(id / PER_PAGE), slot = id % PER_PAGE; const s = PAGES[page].slots[slot]; return { id, page, slot, ...s }; };
  const ids = (tier) => PAGES.flatMap((p, pi) => p.slots.map((s, si) => (!tier || s.tier === tier) ? pi * PER_PAGE + si : -1)).filter((i) => i >= 0);
  // Tire un autocollant du niveau demandé, en privilégiant ceux qu'on n'a pas encore.
  function pick(tier, album) {
    const all = ids(tier);
    const fresh = all.filter((id) => !(album[id] > 0));
    const pool = fresh.length ? fresh : all;
    const id = pool[Math.floor(Math.random() * pool.length)];
    return { id, isNew: !(album[id] > 0) };
  }
  const owned = (album) => Object.keys(album).filter((k) => album[k] > 0).length;
  const pageOwned = (album, page) => PAGES[page].slots.reduce((n, _, si) => n + (album[page * PER_PAGE + si] > 0 ? 1 : 0), 0);
  MM.stickers = { PAGES, PER_PAGE, TIERS, TOTAL: PAGES.length * PER_PAGE, info, ids, pick, owned, pageOwned };
})();
