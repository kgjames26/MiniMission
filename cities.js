/* Les 10 grandes villes de Mini Mission : chaque niveau a ses couleurs, ses bâtiments, son monument et son petit mobilier. */
(() => {
  const MM = (window.MM = window.MM || {});
  const CITIES = [
    { id: 'paris', name: 'Paris', flag: '🇫🇷', icon: '🗼', say: 'Paris, la ville de la tour Eiffel',
      sky: ['#8fd0ff', '#fff1d8'], hill: ['#b8dba6', '#9bcb8c'], grass: '#8cc983', edge: '#a8dc92', dirt: '#dcc8a6', line: '#c9b08a', sun: '#fff4b8',
      houses: ['#f3e8d6', '#e9d9bd', '#dbe4ef', '#f1dad2'], roofCol: '#6c7e96', house: 'mansard', win: 'arch', roof: '#5f7389', tree: 'round', treeCols: ['#79c56f', '#8fd47c', '#6bb865'],
      towers: ['#c9d3ec', '#dfe6fb', '#adbbe0', '#cdd8f6'], lm: 'eiffel', lmCol: '#8b97b3', far: null,
      wall: '#d9a679', brick: '#fff2e0', fence: ['#ffffff', '#2d4a9b'], rock: ['#a2abb8', '#6c7585'], props: ['🚲', '🥐', '⛲', '🌷', '🎨'] },
    { id: 'newyork', name: 'New York', flag: '🇺🇸', icon: '🗽', say: 'New York, la ville de la statue de la Liberté',
      sky: ['#7fb8f2', '#ffe3c2'], hill: ['#a9cba0', '#8fb88a'], grass: '#7fbf7a', edge: '#9ad48e', dirt: '#b9b2a6', line: '#a39c90', sun: '#ffe9a8',
      houses: ['#c2704f', '#d38963', '#9d5d44', '#b86e4e'], roofCol: '#7a6a62', house: 'flat', win: 'rect', roof: '#6f6258', tree: 'round', treeCols: ['#6fb76a', '#82c777', '#5fa65f'],
      towers: ['#9db3d6', '#c0d1ec', '#8aa1c8', '#b2c6e6'], lm: 'liberty', lmCol: '#6fb5a4', far: null,
      wall: '#b5573b', brick: '#f3d3bd', fence: ['#ffd23f', '#222a3a'], rock: ['#9aa0a8', '#686f7a'], props: ['🚕', '🌭', '🚏', '🧯', '🚴'] },
    { id: 'tokyo', name: 'Tokyo', flag: '🇯🇵', icon: '🗻', say: 'Tokyo, la ville du mont Fuji et des cerisiers',
      sky: ['#ffb7d5', '#fff0e6'], hill: ['#c9d9b4', '#a9c995'], grass: '#92c98a', edge: '#b4e0a0', dirt: '#d9c3b4', line: '#c6ac9c', sun: '#ffd9e6',
      houses: ['#f6efe6', '#efe0d0', '#e6d3d6', '#dfe6ef'], roofCol: '#5d6b86', house: 'pagoda', win: 'rect', roof: '#4f5d7a', tree: 'cherry', treeCols: ['#ffb3cf', '#ffc6dc', '#f79bbd'],
      towers: ['#d6c2e6', '#ece0f6', '#bba6d6', '#d8caea'], lm: 'tokyotower', lmCol: '#e9594a', far: 'fuji',
      wall: '#c84a3a', brick: '#ffe6d6', fence: ['#ff5d6a', '#ffffff'], rock: ['#a8a2b0', '#706a7c'], props: ['🏮', '⛩️', '🌸', '🍜', '🎎'] },
    { id: 'rio', name: 'Rio de Janeiro', flag: '🇧🇷', icon: '🌴', say: 'Rio de Janeiro, la ville du carnaval',
      sky: ['#56c8f5', '#fff2b8'], hill: ['#6fc27c', '#4fae6a'], grass: '#5fc46c', edge: '#7fdc86', dirt: '#e8cf9a', line: '#d4b97e', sun: '#fff08a',
      houses: ['#ffd23f', '#ff7aa8', '#5ec9e6', '#9be26b'], roofCol: '#e56a4f', house: 'peak', win: 'round', roof: '#e0604a', tree: 'palm', treeCols: ['#3fae5a', '#57c46c', '#2f9a4e'],
      towers: ['#ffc27a', '#ffe0b0', '#ff9fb4', '#ffd0a0'], lm: 'rio', lmCol: '#5ea06a', far: 'mountains',
      wall: '#ff8a3a', brick: '#fff0c0', fence: ['#ffd23f', '#1f9a4e'], rock: ['#98a58f', '#667262'], props: ['🌴', '🥁', '⚽', '🦜', '🍍'] },
    { id: 'cairo', name: 'Le Caire', flag: '🇪🇬', icon: '🔺', say: 'Le Caire, la ville des pyramides',
      sky: ['#ffc873', '#ffeccc'], hill: ['#f0d08a', '#e2bd6e'], grass: '#e8c97c', edge: '#f4dc98', dirt: '#d9b878', line: '#c4a262', sun: '#fff0b0',
      houses: ['#e8c590', '#dbb27a', '#f0d6a8', '#cfa56c'], roofCol: '#b98a52', house: 'flat', win: 'arch', roof: '#b98a52', tree: 'palm', treeCols: ['#6fae52', '#82c062', '#5c9a46'],
      towers: ['#e8c590', '#f4dcb0', '#d4aa70', '#ebcfa0'], lm: 'pyramids', lmCol: '#d9a860', far: 'dunes',
      wall: '#c99552', brick: '#fff0c8', fence: ['#2a8fb8', '#ffd23f'], rock: ['#c9b48c', '#9c8660'], props: ['🐪', '🌵', '🏺', '🪔', '🔺'] },
    { id: 'london', name: 'Londres', flag: '🇬🇧', icon: '🕰️', say: 'Londres, la ville de Big Ben',
      sky: ['#a9c3d8', '#eef1f4'], hill: ['#a8c8a0', '#8fb590'], grass: '#7fb88a', edge: '#98cc9c', dirt: '#c4bfb4', line: '#aaa598', sun: '#ffffff',
      houses: ['#b0583f', '#c06a4c', '#8f4a38', '#a85c44'], roofCol: '#4d5668', house: 'peak', win: 'rect', roof: '#4d5668', tree: 'round', treeCols: ['#6aa66a', '#7dba7a', '#5a9460'],
      towers: ['#b9c4d4', '#d4dce8', '#a4b0c4', '#c8d2e0'], lm: 'bigben', lmCol: '#a99a74', far: null,
      wall: '#a8503a', brick: '#f0d0c0', fence: ['#d8232a', '#ffffff'], rock: ['#9ea4ac', '#6a7078'], props: ['🚌', '☎️', '💂', '☔', '🫖'] },
    { id: 'venice', name: 'Venise', flag: '🇮🇹', icon: '🛶', say: 'Venise, la ville sur l’eau',
      sky: ['#9fd8f2', '#fff0d2'], hill: ['#b4d8c0', '#98c8aa'], grass: '#b8b4a4', edge: '#d2cebc', dirt: '#c9c2b0', line: '#b0a994', sun: '#fff2c0',
      houses: ['#f2a68a', '#f6c38a', '#e88f8f', '#f7d9a0'], roofCol: '#c8573e', house: 'peak', win: 'arch', roof: '#c8573e', tree: 'pine', treeCols: ['#4f9a68', '#62ae78', '#438a5c'],
      towers: ['#f0c8b0', '#f8dcc6', '#e0b098', '#f2d0b8'], lm: 'venice', lmCol: '#d8a88c', far: null,
      wall: '#c9704f', brick: '#fff0d6', fence: ['#c8232a', '#ffffff'], rock: ['#b4aa9c', '#847a6c'], props: ['🛶', '🎭', '🕊️', '🍦', '⚓'] },
    { id: 'sydney', name: 'Sydney', flag: '🇦🇺', icon: '🦘', say: 'Sydney, la ville de l’opéra aux voiles blanches',
      sky: ['#4fb6f0', '#e8fbff'], hill: ['#8fd0a0', '#6cbc86'], grass: '#78cc80', edge: '#98e09a', dirt: '#e6d0a4', line: '#d2ba88', sun: '#fff5b0',
      houses: ['#ffffff', '#f2f6fa', '#e4f0f8', '#f8efe0'], roofCol: '#2f7fb8', house: 'dome', win: 'round', roof: '#2f7fb8', tree: 'palm', treeCols: ['#46b468', '#5cc87a', '#38a05a'],
      towers: ['#bfe0f0', '#e0f4fb', '#a4d0e6', '#cde9f6'], lm: 'opera', lmCol: '#f4f8fb', far: null,
      wall: '#e0a060', brick: '#fff4dc', fence: ['#ffd23f', '#1f8a4e'], rock: ['#c4a47c', '#94764f'], props: ['🦘', '🐨', '🏄', '🪃', '🌴'] },
    { id: 'marrakech', name: 'Marrakech', flag: '🇲🇦', icon: '🕌', say: 'Marrakech, la ville rose',
      sky: ['#ffab73', '#ffe3b8'], hill: ['#e6b78a', '#d4a074'], grass: '#d9a97a', edge: '#ecc094', dirt: '#cf9d70', line: '#b98760', sun: '#ffe0a0',
      houses: ['#e58a6a', '#d97a5c', '#f0a080', '#cf6f52'], roofCol: '#a84e38', house: 'terrace', win: 'arch', roof: '#a84e38', tree: 'palm', treeCols: ['#5aa04c', '#6eb45c', '#4a8e42'],
      towers: ['#e8967a', '#f4b09a', '#d67e62', '#eea58a'], lm: 'minaret', lmCol: '#c9694e', far: 'dunes',
      wall: '#c86a4a', brick: '#ffe2c6', fence: ['#2a9a8a', '#ffd23f'], rock: ['#bc9c80', '#8a6c52'], props: ['🏺', '🍊', '🪘', '🌵', '🧞'] },
    { id: 'beijing', name: 'Pékin', flag: '🇨🇳', icon: '🐼', say: 'Pékin, la ville des dragons et des pandas',
      sky: ['#ff9f8a', '#fff0d0'], hill: ['#c4d8a4', '#a8c88c'], grass: '#8fc47e', edge: '#aedc98', dirt: '#d8c2a0', line: '#c2aa84', sun: '#ffe9a0',
      houses: ['#d9382c', '#e65a3a', '#c42f26', '#ee7a4a'], roofCol: '#e6b422', house: 'pagoda', win: 'rect', roof: '#e0a820', tree: 'pine', treeCols: ['#5aa05a', '#6ab46a', '#4a9050'],
      towers: ['#e8a090', '#f4c2b0', '#d68a7a', '#eeb2a2'], lm: 'temple', lmCol: '#d9382c', far: 'mountains',
      wall: '#c92f26', brick: '#ffd9a0', fence: ['#e6b422', '#c92f26'], rock: ['#a49c94', '#6e665e'], props: ['🏮', '🐼', '🥢', '🐉', '🎋'] }
  ];

  /* ---- monuments en silhouette (dessinés derrière le décor, ancrés au sol de l'arrière-plan) ---- */
  const LM = {
    eiffel(c, x, b, s, col) {
      c.fillStyle = col; c.beginPath(); c.moveTo(x - 62 * s, b); c.lineTo(x - 15 * s, b - 150 * s); c.lineTo(x - 7 * s, b - 222 * s); c.lineTo(x, b - 266 * s); c.lineTo(x + 7 * s, b - 222 * s); c.lineTo(x + 15 * s, b - 150 * s); c.lineTo(x + 62 * s, b);
      c.lineTo(x + 42 * s, b); c.quadraticCurveTo(x, b - 82 * s, x - 42 * s, b); c.closePath(); c.fill();
      c.fillRect(x - 24 * s, b - 152 * s, 48 * s, 8 * s); c.fillRect(x - 12 * s, b - 218 * s, 24 * s, 6 * s);
    },
    tokyotower(c, x, b, s, col) {
      c.fillStyle = col; c.beginPath(); c.moveTo(x - 40 * s, b); c.lineTo(x - 9 * s, b - 170 * s); c.lineTo(x - 3 * s, b - 235 * s); c.lineTo(x, b - 280 * s); c.lineTo(x + 3 * s, b - 235 * s); c.lineTo(x + 9 * s, b - 170 * s); c.lineTo(x + 40 * s, b); c.lineTo(x + 26 * s, b); c.lineTo(x, b - 70 * s); c.lineTo(x - 26 * s, b); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.fillRect(x - 17 * s, b - 150 * s, 34 * s, 10 * s); c.fillRect(x - 10 * s, b - 215 * s, 20 * s, 8 * s); c.fillStyle = col; c.fillRect(x - 20 * s, b - 160 * s, 40 * s, 8 * s);
    },
    liberty(c, x, b, s, col) {
      c.fillStyle = col; c.fillRect(x - 34 * s, b - 70 * s, 68 * s, 70 * s); c.fillRect(x - 26 * s, b - 90 * s, 52 * s, 20 * s);
      c.beginPath(); c.moveTo(x - 24 * s, b - 90 * s); c.lineTo(x - 14 * s, b - 190 * s); c.lineTo(x + 14 * s, b - 190 * s); c.lineTo(x + 28 * s, b - 90 * s); c.closePath(); c.fill();
      c.beginPath(); c.arc(x, b - 204 * s, 15 * s, 0, 6.3); c.fill();
      c.lineWidth = 9 * s; c.strokeStyle = col; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 10 * s, b - 185 * s); c.lineTo(x + 34 * s, b - 238 * s); c.stroke();
      c.fillStyle = '#ffd23f'; c.beginPath(); c.ellipse(x + 35 * s, b - 252 * s, 9 * s, 15 * s, .2, 0, 6.3); c.fill();
      c.fillStyle = col; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(x + i * 6 * s - 3 * s, b - 214 * s); c.lineTo(x + i * 11 * s, b - 236 * s); c.lineTo(x + i * 6 * s + 3 * s, b - 214 * s); c.fill(); }
    },
    rio(c, x, b, s, col) {
      c.fillStyle = col; c.beginPath(); c.moveTo(x - 190 * s, b); c.quadraticCurveTo(x - 150 * s, b - 200 * s, x - 90 * s, b - 150 * s); c.quadraticCurveTo(x - 40 * s, b - 120 * s, x - 10 * s, b); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(x - 20 * s, b); c.quadraticCurveTo(x + 40 * s, b - 250 * s, x + 110 * s, b - 140 * s); c.quadraticCurveTo(x + 170 * s, b - 60 * s, x + 190 * s, b); c.closePath(); c.fill();
      c.fillStyle = '#f4f4ee'; c.fillRect(x + 56 * s, b - 214 * s, 7 * s, 40 * s); c.fillRect(x + 36 * s, b - 208 * s, 47 * s, 7 * s); c.beginPath(); c.arc(x + 60 * s, b - 220 * s, 6 * s, 0, 6.3); c.fill();
    },
    pyramids(c, x, b, s, col) {
      [[-120, 120, 150], [20, 170, 210], [150, 90, 110]].forEach(([dx, w, h], i) => { c.fillStyle = i === 1 ? col : '#e0b66e'; c.beginPath(); c.moveTo(x + dx * s - w * s * .6, b); c.lineTo(x + dx * s, b - h * s); c.lineTo(x + dx * s + w * s * .6, b); c.closePath(); c.fill(); c.fillStyle = 'rgba(120,70,20,.18)'; c.beginPath(); c.moveTo(x + dx * s, b - h * s); c.lineTo(x + dx * s + w * s * .6, b); c.lineTo(x + dx * s, b); c.closePath(); c.fill(); });
    },
    bigben(c, x, b, s, col) {
      c.fillStyle = col; c.fillRect(x - 24 * s, b - 200 * s, 48 * s, 200 * s); c.fillRect(x - 30 * s, b - 218 * s, 60 * s, 22 * s);
      c.beginPath(); c.moveTo(x - 24 * s, b - 218 * s); c.lineTo(x, b - 290 * s); c.lineTo(x + 24 * s, b - 218 * s); c.closePath(); c.fill();
      c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(x, b - 168 * s, 17 * s, 0, 6.3); c.fill(); c.strokeStyle = '#3c3a30'; c.lineWidth = 2 * s; c.beginPath(); c.moveTo(x, b - 168 * s); c.lineTo(x, b - 180 * s); c.moveTo(x, b - 168 * s); c.lineTo(x + 8 * s, b - 164 * s); c.stroke();
      c.fillStyle = col; c.fillRect(x + 40 * s, b - 70 * s, 130 * s, 70 * s); for (let i = 0; i < 5; i++) c.fillRect(x + 48 * s + i * 24 * s, b - 84 * s, 12 * s, 14 * s);
    },
    venice(c, x, b, s, col) {
      c.fillStyle = col; c.fillRect(x - 90 * s, b - 80 * s, 180 * s, 80 * s);
      [-46, 46].forEach(dx => { c.beginPath(); c.arc(x + dx * s, b - 80 * s, 34 * s, Math.PI, 0); c.fill(); c.fillRect(x + dx * s - 3 * s, b - 140 * s, 6 * s, 26 * s); });
      c.beginPath(); c.arc(x, b - 84 * s, 26 * s, Math.PI, 0); c.fill();
      c.fillRect(x + 110 * s, b - 230 * s, 34 * s, 230 * s); c.beginPath(); c.moveTo(x + 106 * s, b - 230 * s); c.lineTo(x + 127 * s, b - 280 * s); c.lineTo(x + 148 * s, b - 230 * s); c.closePath(); c.fill();
    },
    opera(c, x, b, s, col) {
      c.fillStyle = '#c9b89a'; c.fillRect(x - 150 * s, b - 28 * s, 300 * s, 28 * s);
      const sail = (cx, w, h, flip) => { c.fillStyle = col; c.beginPath(); c.moveTo(cx - w / 2 * s, b - 28 * s); c.quadraticCurveTo(cx - w / 2 * s + (flip ? w * .9 : 0) * s, b - h * s, cx + (flip ? -w / 2 : w / 2) * s, b - h * .35 * s); c.quadraticCurveTo(cx + w / 2 * s, b - 28 * s, cx + w / 2 * s, b - 28 * s); c.closePath(); c.fill(); c.strokeStyle = 'rgba(80,110,140,.3)'; c.lineWidth = 2; c.stroke(); };
      sail(x - 90 * s, 90, 150, false); sail(x - 20 * s, 110, 210, false); sail(x + 55 * s, 100, 170, true); sail(x + 120 * s, 70, 110, true);
    },
    minaret(c, x, b, s, col) {
      c.fillStyle = col; c.fillRect(x - 30 * s, b - 210 * s, 60 * s, 210 * s); c.fillRect(x - 17 * s, b - 252 * s, 34 * s, 44 * s);
      c.beginPath(); c.moveTo(x - 17 * s, b - 252 * s); c.lineTo(x, b - 274 * s); c.lineTo(x + 17 * s, b - 252 * s); c.fill(); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(x, b - 282 * s, 6 * s, 0, 6.3); c.fill();
      c.fillStyle = 'rgba(255,240,210,.55)'; for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) { c.beginPath(); c.arc(x - 10 * s + k * 20 * s, b - 170 * s + r * 36 * s, 6 * s, Math.PI, 0); c.rect(x - 16 * s + k * 20 * s, b - 170 * s + r * 36 * s, 12 * s, 16 * s); c.fill(); }
    },
    temple(c, x, b, s, col) {
      c.fillStyle = '#e8d8c0'; c.fillRect(x - 110 * s, b - 20 * s, 220 * s, 20 * s); c.fillRect(x - 90 * s, b - 38 * s, 180 * s, 18 * s); c.fillRect(x - 70 * s, b - 56 * s, 140 * s, 18 * s);
      [[56, 120, 96], [118, 90, 68], [170, 60, 44]].forEach(([y, w, h], i) => { c.fillStyle = col; c.fillRect(x - (w - 30) / 2 * s, b - (y + 10) * s, (w - 30) * s, 18 * s); c.fillStyle = '#3a6fb0'; c.beginPath(); c.moveTo(x - w / 2 * s - 8 * s, b - (y + 10) * s); c.quadraticCurveTo(x, b - (y + 40) * s, x + w / 2 * s + 8 * s, b - (y + 10) * s); c.lineTo(x + w / 2 * s, b - y * s); c.lineTo(x - w / 2 * s, b - y * s); c.closePath(); c.fill(); });
      c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(x, b - 232 * s, 7 * s, 0, 6.3); c.fill(); c.fillRect(x - 2 * s, b - 224 * s, 4 * s, 14 * s);
    }
  };
  /* ---- fond lointain : mont Fuji, dunes, montagnes ---- */
  const FAR = {
    fuji(c, W, base, cam, col) { const x = ((1100 - cam * .06) % (W + 900) + W + 900) % (W + 900) - 300; c.fillStyle = col; c.beginPath(); c.moveTo(x - 330, base); c.lineTo(x - 40, base - 220); c.lineTo(x + 40, base - 220); c.lineTo(x + 330, base); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x - 60, base - 190); c.lineTo(x - 40, base - 220); c.lineTo(x + 40, base - 220); c.lineTo(x + 62, base - 190); c.lineTo(x + 30, base - 176); c.lineTo(x + 6, base - 192); c.lineTo(x - 22, base - 174); c.closePath(); c.fill(); },
    dunes(c, W, base, cam, col) { c.fillStyle = col; c.beginPath(); c.moveTo(0, base); for (let x = 0; x <= W; x += 8) c.lineTo(x, base - 70 - 38 * Math.sin((x + cam * .1) / 190) - 18 * Math.sin((x + cam * .1) / 70)); c.lineTo(W, base); c.fill(); },
    mountains(c, W, base, cam, col) { c.fillStyle = col; c.beginPath(); c.moveTo(0, base); for (let x = 0; x <= W; x += 10) { const t = (x + cam * .08) / 150; c.lineTo(x, base - 110 - 70 * Math.abs(Math.sin(t)) - 26 * Math.abs(Math.sin(t * 2.3))); } c.lineTo(W, base); c.fill(); }
  };
  MM.cities = CITIES; MM.landmarks = LM; MM.farDraw = FAR;
})();
