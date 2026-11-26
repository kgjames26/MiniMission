/* Langues de Mini Mission : français, anglais, espagnol, japonais, allemand, coréen.
   - MM.i18n.t(clé, {variables}) donne le texte dans la langue choisie (repli sur le français).
   - Chaque langue a son alphabet (lettres à ramasser), le nom des lettres À DIRE par la voix, et un mot simple par lettre.
   - Les fichiers lang-xx.js complètent MM.L10N.xx ; ce fichier contient le moteur et le français (langue d'origine du jeu).
   Règle : tout ce que la voix lit est écrit pour être bien PRONONCÉ par la synthèse vocale de la langue. */
(() => {
  const MM = (window.MM = window.MM || {});
  const L10N = (MM.L10N = MM.L10N || {});

  const LANGS = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', tts: 'fr-FR', hello: 'Bonjour !' },
    { code: 'en', name: 'English', flag: '🇬🇧', tts: 'en-US', hello: 'Hello!' },
    { code: 'es', name: 'Español', flag: '🇪🇸', tts: 'es-ES', hello: '¡Hola!' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', tts: 'de-DE', hello: 'Hallo!' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', tts: 'ja-JP', hello: 'こんにちは！' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', tts: 'ko-KR', hello: '안녕하세요!' }
  ];
  const KEY = 'mini-mission-lang';
  let lang = null;
  try { lang = localStorage.getItem(KEY); } catch {}
  if (!LANGS.some((l) => l.code === lang)) lang = null;
  const guess = () => { const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'fr').slice(0, 2).toLowerCase(); return LANGS.some((l) => l.code === nav) ? nav : 'en'; };

  /* ---------- français ---------- */
  L10N.fr = {
    ui: {
      aHome: 'Accueil de Mini Mission', aSettingsHold: 'Réglages pour l’adulte : garder appuyé 1,5 seconde', tSettingsHold: 'Réglages (garder appuyé)',
      howto: 'Mode d’emploi', aTimerHold: 'Minuteur de jeu : garder appuyé 1,5 seconde', tTimerHold: 'Minuteur (garder appuyé)', aSoundToggle: 'Activer ou couper les sons',
      aAlbum: 'Mon album d’autocollants', myAlbums: 'Mes albums', tagline: 'Remplis tes albums !', play: 'JOUER !',
      aChooseHero: 'Choisir un héros', aBackHome: 'Retour à l’accueil', chooseHero1: 'Choisis ton', chooseHero2: 'héros !', giftLine: 'Cadeaux pour les amis :',
      aChooseChapter: 'Choisir un chapitre', chooseChap1: 'Choisis ton', chooseChap2: 'chapitre !', chap1: 'La Terre', chap2: 'L’espace', chap3: 'Le grand final', soon: 'Bientôt', sayChooseChapter: 'Choisis ton chapitre !', sayChooseChapterN: 'Choisis ton chapitre, {name} !', sayChooseHeroCity: 'Qui va aider à {city} ?', aChoosePlanet: 'Choisir une planète', sayChoosePlanet: 'Où va Rose ?', soonSay: 'Ce monde arrive bientôt !', finalSoonSay: 'Le grand final arrive bientôt !', lockedPlanetSay: 'Termine d’abord le monde d’avant !', aBackChapters: 'Retour aux chapitres', aBackCities: 'Retour aux villes', pLune: 'La Lune', pMars: 'Mars', pVenus: 'Vénus', pMercure: 'Mercure', pJupiter: 'Jupiter', pSaturne: 'Saturne', pUranus: 'Uranus', pNeptune: 'Neptune', pTerre: 'La Terre', pSoleil: 'Le Soleil',
      aZiggy: 'Choisir Ziggy la Comète, le héros rapide qui traverse les obstacles', aFilou: 'Choisir Filou le Tisseur, le héros agile qui tisse des ponts', aTitan: 'Choisir Titan Puce, le héros fort qui déplace les rochers',
      speed: 'Vitesse', agility: 'Agilité', strength: 'Force', choose: 'CHOISIR',
      sessionTimer: 'Minuteur de partie', optional: '(facultatif)', off: 'Désactivé', minutes: '{n} minutes', hour1: '1 heure',
      aChooseCity: 'Choisir une ville', aChangeHero: 'Changer de héros', city: 'Ville',
      aHowto: 'Comment jouer', how1: 'Comment', how2: 'jouer ?', leftRight: 'GAUCHE ⬌ DROITE !', holdToMove: 'Garde le doigt appuyé pour avancer !',
      jumpAction: 'SAUT ET ACTION !', action: 'ACTION !', jump: 'SAUT', turbo: 'TURBO', web: 'TOILE', punch: 'POING', keysHelp: '⌨ ← → · Espace · X · C · Échap',
      album1: 'Mon', album2: 'album', aStickerDetail: 'Détail de l’autocollant', aClose: 'Fermer', aListen: 'Écouter',
      aGame: 'Mission en cours', aCanvas: 'Jeu de plateforme 2D', pause: 'Pause', aStars: 'Étoiles ramassées', aFriends: 'Monstres capturés sur 20', aLetters: 'Lettres de l’alphabet récoltées',
      aProgress: 'Progression', aMute: 'Couper les sons', aUnmute: 'Activer les sons', aLR: 'Aller à gauche ou à droite', aLeft: 'Aller à gauche', aRight: 'Aller à droite',
      aAction: 'Action : utiliser le pouvoir du héros et transformer un farceur en ami', aShoot: 'Tirer sur les petits monstres', aJump: 'Sauter', newBadge: 'NOUVEAU',
      peekLeft: 'Encore {parts} à trouver !', peekAll: 'Tu as tout trouvé, bravo !', aPeek: 'Ce que tu as déjà trouvé', aLeftToFind: 'Ce qu’il te reste à trouver', resume: 'Reprendre', restart: 'Recommencer', stats: 'Statistiques', quit: 'Quitter la mission',
      aStatsScreen: 'Statistiques de la mission', aBackPause: 'Retour à la pause', statStars: '⭐ étoiles', statFriends: '♥ amis', statLetters: '🔤 lettres', statStickers: '🏅 autocollants', statPuzzles: '❓ énigmes',
      aPuzzle: 'Choisir comment aider', aQuit: 'Quitter', aListenQ: 'Écouter la question', aListenInstr: 'Écouter la consigne', question: 'Question', super: 'Super !',
      aEnd: 'Niveau terminé', bravo: 'Bravo !', aAlphabet: 'Alphabet récolté', aMenu: 'Menu principal', aReplay: 'Rejouer cette ville', aCityAlbum: 'Voir l’album de la ville', aNext: 'Ville suivante',
      aTimer: 'Minuteur de jeu', howLong: '⏱️ Combien de temps ?', timerNote: 'Ensuite, les héros vont dormir.', aRest: 'Les héros dorment', restTitle: 'Chut… les héros dorment !',
      aSettings: 'Réglages adulte', settings: '⚙ Réglages', sounds: '🔊 Sons', music: '🎵 Musique', sfx: '💥 Bruitages', vibr: '📳 Vibrations', oneBtn: '👶 Un seul bouton', oneBtnHint: '(3-4 ans : le pouvoir part tout seul)',
      voice: '🗣️ Voix', aVoice: 'Choisir la voix', auto: 'Automatique', autoBest: 'Automatique (la plus agréable)',
      resetTimer: '⏱️ Réinitialiser le minuteur', holdHint: '(garder appuyé)', aResetTimer: 'Réinitialiser le minuteur : garder appuyé 3 secondes', resetAll: '🗑️ Tout réinitialiser', aResetAll: 'Réinitialiser le jeu : garder appuyé 3 secondes',
      // textes du jeu
      sayChooseCity: 'Choisis une ville !', lockedToast: 'Termine la ville d’avant !', lockedSay: 'Termine d’abord la ville d’avant !',
      aDifficulty: 'Difficulté {n}', aAgain: 'Refaire plus difficile', aLevel: 'Niveau {n} : {city}', aLocked: ', verrouillé', aLevelLeft: ' Il reste {s} étoiles, {l} lettres, {m} monstres.',
      harder: 'Plus difficile !', tierSay: 'Niveau de difficulté {n} ! Les monstres sont plus costauds.', timerMin: 'min', timerNone: 'sans',
      actTurbo: 'Action : turbo, très rapide', actWeb: 'Action : lancer la toile et se balancer', actPunch: 'Action : gros coup de poing',
      shotFire: 'Boule de feu', shotWeb: 'Toile magique', shotPunch: 'Poing projeté', aShootX: 'Tirer : {x}',
      timerNotice: 'On va bientôt terminer. Tu peux finir cette mission tranquillement. Après, ton héros ira se reposer.',
      chooseAnswer: '{q} Choisis une réponse : {opts}.', lettersOf: '{n} lettres sur {t}', starsOf: '{n} étoiles sur {t}',
      forgot: 'Oh ! Tu as oublié le {l} !', letterLike: '{l}, comme {w} !',
      endStars: 'étoiles', endLetters: 'lettres', endMonsters: 'monstres', endGames: 'mini-jeux', endOf: '{label} : {a} sur {b}', endLeftN: 'reste {n}', endLeft: 'Il reste : ', endAll: '🎉 Tout est réussi dans cette ville !',
      friendsOf: '{n} monstres capturés sur {t}', letterGot: '{l} récoltée', letterMissing: '{l} pas encore récoltée',
      endSayLeft: 'Bravo ! Il te reste {parts}.', endSayAll: 'Bravo ! Tu as tout réussi dans cette ville !',
      goldSay: 'Autocollant d’or : {n} !', silverSay: 'Autocollant d’argent : {n} !', stickerAward: '{praise} Un autocollant : {n} !', aSlotToWin: 'Autocollant {tier} à gagner',
      tierBronze: 'Bronze', tierSilver: 'Argent', tierGold: 'Or',
      count10: 'Dix ! Bravo, une dizaine !', count20: 'Vingt ! Tous les monstres sont gentils !', oops: 'Oups ! On repart du drapeau.',
      restSay: 'Les héros vont se reposer maintenant. À tout à l’heure !', timerResetDone: 'Minuteur réinitialisé', newVoice: 'Bonjour ! Je suis ta nouvelle voix.',
      noVoice: 'Aucune voix {lang} n’est installée sur cet appareil : ajoute-la dans les réglages du téléphone (synthèse vocale).',
      langTitle: 'Choisis ta langue', aPuzzlePiece: 'Morceau de puzzle', aCardDown: 'Carte retournée', aColorN: 'Couleur {n}',
      // prénom de l'enfant (facultatif, reste sur l'appareil)
      nameTitle: 'Pour le parent', nameQ: 'Prénom de l’enfant (facultatif)', namePh: 'Prénom', nameSayLabel: 'Si la voix le dit mal, écrivez-le comme il se prononce', nameSayPh: 'ex. : Ma-é-liss', nameListen: 'Écouter le prénom', nameOk: 'C’est parti !', nameSkip: 'Passer', nameLocal: 'Le prénom reste uniquement sur cet appareil.', nameSetting: '👧 Prénom', nameNone: 'aucun', helloN: 'Bonjour {name} !', sayChooseCityN: 'Choisis une ville, {name} !', endSayLeftN: 'Bravo {name} ! Il te reste {parts}.', endSayAllN: 'Bravo {name} ! Tu as tout réussi dans cette ville !', goldSayN: 'Bravo {name} ! Autocollant d’or : {n} !', restSayN: 'Les héros vont se reposer maintenant. À tout à l’heure, {name} !',
      mazeSay: 'Aide {a} à trouver {b} !', jigsawSay: 'Remets l’image dans le bon ordre !', pairsSay: 'Retrouve les paires !', simonSay: 'Écoute la musique et regarde les couleurs, puis refais comme moi !'
    },
    plural: { stars: ['{n} étoile', '{n} étoiles'], letters: ['{n} lettre', '{n} lettres'], monsters: ['{n} monstre', '{n} monstres'], games: ['{n} mini-jeu', '{n} mini-jeux'] },
    count: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'],
    letters: {
      alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      // nom des lettres tel qu'il se prononce (la synthèse vocale lit mal une lettre seule : « Y » devient « i »)
      say: { A: 'a', B: 'bé', C: 'cé', D: 'dé', E: 'e', F: 'effe', G: 'gé', H: 'hache', I: 'i', J: 'ji', K: 'ka', L: 'elle', M: 'emme', N: 'enne', O: 'o', P: 'pé', Q: 'ku', R: 'erre', S: 'esse', T: 'té', U: 'u', V: 'vé', W: 'double vé', X: 'iks', Y: 'i grec', Z: 'zède' },
      words: { A: ['avion', '✈️'], B: ['ballon', '🎈'], C: ['chat', '🐱'], D: ['dauphin', '🐬'], E: ['éléphant', '🐘'], F: ['fusée', '🚀'], G: ['girafe', '🦒'], H: ['hibou', '🦉'], I: ['igloo', '🏠'], J: ['jus', '🧃'], K: ['koala', '🐨'], L: ['lion', '🦁'], M: ['maison', '🏡'], N: ['nuage', '☁️'], O: ['ours', '🐻'], P: ['pomme', '🍎'], Q: ['quatre', '4️⃣'], R: ['robot', '🤖'], S: ['soleil', '☀️'], T: ['tortue', '🐢'], U: ['ukulélé', '🎸'], V: ['vélo', '🚲'], W: ['wagon', '🚃'], X: ['xylophone', '🎶'], Y: ['yaourt', '🥛'], Z: ['zèbre', '🦓'] }
    },
    quiz: {
      animals: [['🐱', 'le chat', 'miaou'], ['🐶', 'le chien', 'ouaf ouaf'], ['🐮', 'la vache', 'meuh'], ['🐑', 'le mouton', 'bê'], ['🐷', 'le cochon', 'groin groin'], ['🦆', 'le canard', 'coin coin'], ['🐸', 'la grenouille', 'coa coa'], ['🐔', 'la poule', 'cot cot'], ['🦁', 'le lion', 'grrr'], ['🐝', 'l’abeille', 'bzzz'], ['🐴', 'le cheval', 'hiii'], ['🐓', 'le coq', 'cocorico']],
      colors: [['jaune', '🟡', [['🍌', 'la banane'], ['🌻', 'le tournesol'], ['⭐', 'l’étoile'], ['🐤', 'le poussin'], ['🧀', 'le fromage']]],
        ['rouge', '🔴', [['🍎', 'la pomme'], ['🍓', 'la fraise'], ['🍅', 'la tomate'], ['🚒', 'le camion de pompiers'], ['🌹', 'la rose']]],
        ['vert', '🟢', [['🐸', 'la grenouille'], ['🥦', 'le brocoli'], ['🌳', 'l’arbre'], ['🥒', 'le concombre'], ['🐢', 'la tortue']]],
        ['bleu', '🔵', [['🫐', 'les myrtilles'], ['🐳', 'la baleine'], ['🌊', 'la vague'], ['💙', 'le cœur bleu']]],
        ['orange', '🟠', [['🍊', 'l’orange'], ['🥕', 'la carotte'], ['🎃', 'la citrouille'], ['🦊', 'le renard']]],
        ['violet', '🟣', [['🍇', 'le raisin'], ['🍆', 'l’aubergine'], ['🔮', 'la boule magique'], ['🦄', 'la licorne']]]],
      countables: [['🎈', 'ballons'], ['⭐', 'étoiles'], ['🍎', 'pommes'], ['🐟', 'poissons'], ['🚗', 'voitures'], ['🌸', 'fleurs'], ['🐞', 'coccinelles'], ['🍪', 'gâteaux']],
      groups: [[['🍎', 'la pomme'], ['🍌', 'la banane'], ['🍇', 'le raisin'], ['🍓', 'la fraise'], ['🍊', 'l’orange']],
        [['🐶', 'le chien'], ['🐱', 'le chat'], ['🐰', 'le lapin'], ['🐻', 'l’ours'], ['🐼', 'le panda']],
        [['🚗', 'la voiture'], ['🚌', 'le bus'], ['🚲', 'le vélo'], ['🚂', 'le train'], ['✈️', 'l’avion']],
        [['👕', 'le t-shirt'], ['👖', 'le pantalon'], ['🧦', 'la chaussette'], ['🧢', 'la casquette'], ['👟', 'la chaussure']],
        [['🪑', 'la chaise'], ['🛏️', 'le lit'], ['🛋️', 'le canapé'], ['🚪', 'la porte'], ['🪟', 'la fenêtre']]],
      abilities: [['Qui peut voler ?', [['🐦', 'l’oiseau'], ['🦋', 'le papillon'], ['🐝', 'l’abeille'], ['🦉', 'le hibou']], [['🐢', 'la tortue'], ['🐘', 'l’éléphant'], ['🐄', 'la vache'], ['🐌', 'l’escargot']]],
        ['Qui sait nager ?', [['🐟', 'le poisson'], ['🐬', 'le dauphin'], ['🐙', 'la pieuvre'], ['🐳', 'la baleine']], [['🐱', 'le chat'], ['🦒', 'la girafe'], ['🐓', 'le coq'], ['🐘', 'l’éléphant']]],
        ['Qui vit à la ferme ?', [['🐮', 'la vache'], ['🐷', 'le cochon'], ['🐔', 'la poule'], ['🐑', 'le mouton']], [['🦁', 'le lion'], ['🐘', 'l’éléphant'], ['🐧', 'le pingouin'], ['🦒', 'la girafe']]],
        ['Qui a des roues ?', [['🚗', 'la voiture'], ['🚲', 'le vélo'], ['🚌', 'le bus'], ['🛴', 'la trottinette']], [['🐢', 'la tortue'], ['🏠', 'la maison'], ['🌳', 'l’arbre'], ['🍎', 'la pomme']]],
        ['Qu’est-ce qui est doux et sucré ?', [['🍭', 'la sucette'], ['🍰', 'le gâteau'], ['🍓', 'la fraise'], ['🍯', 'le miel']], [['🧅', 'l’oignon'], ['🪨', 'le caillou'], ['🧽', 'l’éponge'], ['🌵', 'le cactus']]]],
      shapes: [['🔴', 'le rond'], ['🟥', 'le carré'], ['🔺', 'le triangle'], ['⭐', 'l’étoile'], ['❤️', 'le cœur']],
      sizes: [['🐜', 'la fourmi'], ['🐭', 'la souris'], ['🐱', 'le chat'], ['🐕', 'le chien'], ['🐴', 'le cheval'], ['🐘', 'l’éléphant'], ['🐋', 'la baleine']],
      eats: [['🐰', 'le lapin', '🥕', 'la carotte'], ['🐵', 'le singe', '🍌', 'la banane'], ['🐱', 'le chat', '🐟', 'le poisson'], ['🐶', 'le chien', '🦴', 'l’os'], ['🐭', 'la souris', '🧀', 'le fromage'], ['🐻', 'l’ours', '🍯', 'le miel'], ['🐿️', 'l’écureuil', '🌰', 'la noisette'], ['🐮', 'la vache', '🌿', 'l’herbe']],
      wears: [['Que met-on aux pieds ?', '👟', 'les chaussures'], ['Que met-on sur la tête ?', '🧢', 'la casquette'], ['Que met-on aux mains ?', '🧤', 'les gants'], ['Que met-on sur le nez ?', '👓', 'les lunettes'], ['Que met-on autour du cou ?', '🧣', 'l’écharpe'], ['Que met-on quand il pleut ?', '☔', 'le parapluie']],
      wearOthers: [['🍎', 'la pomme'], ['⚽', 'le ballon'], ['📘', 'le livre'], ['🚗', 'la voiture'], ['🪁', 'le cerf-volant'], ['🍪', 'le gâteau']],
      numWords: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
      t: {
        whoSays: 'Qui fait « {s} » ?', whatColor: 'Qu’est-ce qui est {c} ?', howMany: 'Combien y a-t-il de {w} ?', howManySay: 'Combien y a-t-il de {w} ? Compte avec moi.',
        odd: 'Quel est l’intrus ?', oddSay: 'Quel est l’intrus ? Cherche celui qui ne va pas avec les autres.', showMe: 'Montre-moi {x} !', whereIs: 'Où est {x} ?',
        biggest: 'Qui est le plus grand ?', smallest: 'Qui est le plus petit ?', eats: 'Que mange {x} ?', after: 'Quel nombre vient après {n} ?'
      }
    },
    praise: ['Bravo, tu as trouvé une belle idée !', 'Oui, c’est exactement ce qu’il fallait !', 'Super coup de main, petit héros !', 'Quelle bonne réponse !', 'Tu as très bien réfléchi !', 'Bien joué, tu aides tout le monde !', 'Tu as choisi la bonne aide !', 'Génial, on peut continuer !', 'Tu as un grand cœur !', 'C’est une réponse formidable !', 'Merci pour ton aide !', 'Tu as trouvé tout seul, bravo !'],
    retry: ['Pas tout à fait. On regarde ensemble.', 'Ce n’est pas grave, essayons encore.', 'Presque ! Écoutons bien les choix.', 'On peut chercher une autre idée.', 'Essaie encore, je t’accompagne.', 'On va trouver ensemble.', 'Regarde bien les grands dessins.', 'Tu peux changer de réponse.', 'Tu es tout près de la bonne idée.', 'Choisis encore, sans te presser.']
  };

  /* ---------- moteur ---------- */
  const cur = () => L10N[lang || 'fr'] || L10N.fr;
  // coréen : particule après un nom selon qu'il finit par une consonne (받침) — {은}, {이}, {을}, {과}, {으로}
  const JOSA = { '은': ['은', '는'], '는': ['은', '는'], '이': ['이', '가'], '가': ['이', '가'], '을': ['을', '를'], '를': ['을', '를'], '과': ['과', '와'], '와': ['과', '와'], '으로': ['으로', '로'], '아': ['아', '야'], '야': ['아', '야'] };
  function koFix(s) {
    return s.replace(/([^\s{}])\{(은|는|이|가|을|를|과|와|으로|아|야)\}/g, (m, ch, p) => {
      const code = ch.charCodeAt(0); let batchim = false;
      if (code >= 0xAC00 && code <= 0xD7A3) batchim = (code - 0xAC00) % 28 !== 0; else if (/[0-9]/.test(ch)) batchim = '013678'.includes(ch);
      const [withB, without] = JOSA[p]; return ch + (batchim ? withB : without);
    });
  }
  function fill(s, vars) {
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return lang === 'ko' ? koFix(s) : s;
  }
  function t(key, vars) { const s = cur().ui[key] ?? L10N.fr.ui[key] ?? key; return fill(s, vars); }
  function plural(kind, n) {
    const forms = cur().plural?.[kind] || L10N.fr.plural[kind]; if (!forms) return String(n);
    let one = n === 1; try { one = new Intl.PluralRules(lang || 'fr').select(n) === 'one'; } catch {}
    return fill(forms[one || forms.length === 1 ? 0 : 1], { n });
  }
  const letters = () => cur().letters || L10N.fr.letters;
  const alphabet = () => letters().alpha;
  const letterSay = (l) => letters().say[l] || l;
  // « B, comme ballon ! » : la phrase à dire et le petit dessin, dans la langue choisie
  function letterPhrase(l) {
    const w = letters().words[l]; if (!w) return { say: letterSay(l), emoji: '' };
    return { say: w[2] || t('letterLike', { l: letterSay(l), w: w[0] }), emoji: w[1] };
  }
  function count(n) { const c = cur().count || L10N.fr.count; return c[n] != null ? c[n] : String(n); }
  const quiz = () => cur().quiz || L10N.fr.quiz;
  const list = (k) => cur()[k] || L10N.fr[k];
  const info = () => LANGS.find((l) => l.code === (lang || 'fr'));

  // Les textes de la page : data-i18n (texte), data-i18n-aria (aria-label), data-i18n-title (title)
  function applyDom(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n, el.dataset.i18nN ? { n: el.dataset.i18nN } : null); });
    root.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    root.querySelectorAll('[data-i18n-title]').forEach((el) => el.setAttribute('title', t(el.dataset.i18nTitle)));
    root.querySelectorAll('[data-i18n-ph]').forEach((el) => el.setAttribute('placeholder', t(el.dataset.i18nPh)));
    document.documentElement.lang = lang || 'fr';
  }
  // villes et autocollants : la version française reste en mémoire, la langue choisie la remplace à l'affichage
  function localizeData() {
    const L = cur();
    (MM.cities || []).forEach((c, i) => {
      if (!c._fr) c._fr = { name: c.name, say: c.say };
      const tr = L.cities && L.cities[i]; c.name = tr ? tr[0] : c._fr.name; c.say = tr ? tr[1] : c._fr.say;
    });
  }
  function stickerText(e, n, d) { const tr = cur().stickers && cur().stickers[e]; return tr ? { n: tr[0], d: tr[1] } : { n, d }; }

  const listeners = [];
  function setLang(code) {
    if (!LANGS.some((l) => l.code === code)) return;
    lang = code; try { localStorage.setItem(KEY, code); } catch {}
    localizeData(); applyDom(); listeners.forEach((fn) => fn(code));
  }
  MM.i18n = {
    LANGS, t, fill, plural, alphabet, letterSay, letterPhrase, count, quiz, list, info, applyDom, localizeData, stickerText, setLang, guess,
    get lang() { return lang || 'fr'; }, get chosen() { return !!lang; }, onChange(fn) { listeners.push(fn); }
  };
})();
