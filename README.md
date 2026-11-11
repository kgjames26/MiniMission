# Mini Mission

PWA de plateforme 2D, en français, pour un jeune enfant : des missions d'entraide à enchaîner avec Ziggy la Comète, Filou le Tisseur ou Titan Puce. Rien n'est jamais punitif (ni mort, ni dégâts).

## Lancer en local

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`. Le service worker et l'installation PWA nécessitent HTTPS ou `localhost`.

## Les trois héros, trois façons de jouer

- **Filou — la ville (façon Spider-Man)** : immeubles de plus en plus hauts, ravins et anneaux violets suspendus. **ACTION** lance la toile sur l'anneau à portée et Filou se balance ; il est lâché automatiquement au bon moment. Pendant le balancement : **SAUT** = salto (on repart dans l'autre sens en tenant la direction opposée), **ACTION** = on relance tout de suite une autre toile (toile plus courte, lettres en plein vol). On peut aussi retisser en l'air. Chaque balancement du niveau est vérifié par simulation.
- **Ziggy — la piste de vitesse** : plaques de vitesse, grands ravins, barrières et plateformes hautes. **ACTION** déclenche le turbo (course très rapide, écrase les petits obstacles et défonce les barrières) ; **SAUT** en plein turbo donne un grand saut.
- **Titan — le chantier** : gros rochers et murs qui bloquent le chemin (il se met en garde en poussant). **ACTION** donne un gros coup de poing ; les gros obstacles se fissurent puis éclatent (2 à 3 coups). De la lave barre parfois la route : il faut sauter d'immeuble en immeuble.

## Les 20 petits monstres (pour apprendre à compter)

Chaque niveau cache 20 petits monstres méchants de 5 sortes (hérisson, limon qui rebondit, chauve-souris, golem costaud, lutin de feu qui lance des boules de feu sans danger). Le **3e bouton, au-dessus de SAUT**, tire : boule de feu (Ziggy), toile magique qui enroule (Filou), coup de poing projeté (Titan). Un monstre touché devient gentil, rejoint le héros, et le **nombre est affiché en grand et dit à voix haute**. Une barre de 20 cases (groupées par 5) se remplit ; une dizaine puis les 20 déclenchent une fête. On ne peut pas tirer sur un monstre hors de l'écran.

## Fonctionnalités

- Manette : croix verte à gauche, bouton **ACTION** puis bouton **SAUT** à droite ; les deux pouces agissent en même temps. Clavier : flèches/ZQSD, Espace, X, Échap.
- **Étoiles** (grosses, avec un petit visage) et **lettres** (cubes de jeu colorés) à ramasser. Les lettres sont placées dans des endroits de plus en plus difficiles d'accès.
- Trois caisses « ? » par mission, chacune une énigme ou un mini-jeu différent : questions pour enfants de 6 ans (bruits d'animaux, couleurs, compter, intrus, formes, plus grand/plus petit, qui mange quoi…), labyrinthe de la souris, puzzle à remettre en ordre, jeu de mémoire façon Simon. Les consignes sont lues à voix haute (gros bouton haut-parleur pour les relire), les réponses sont de grands dessins, et la croix ✕ permet de quitter à tout moment.
- **Album de 5 pages d'autocollants** (60 en tout) :
  - 🥉 **bronze** (40, les plus nombreux) : une bonne réponse à une énigme ;
  - 🥈 **argent** (15, moyennement rares) : attraper toutes les étoiles d'une mission ;
  - 🥇 **or** (5, très rares) : récolter les 26 lettres d'une mission.
- Petits farceurs à transformer en amis (dix petits amis deviennent un grand ami rouge), parade de fin.
- Musique de fond (`assets/music.mp3`, « A pocket of stars ») pendant les parties, effets visuels (particules, secousses), retours haptiques (vibrations ; iPhone : seulement pendant un geste), bruitages. Tout se règle dans les réglages ⚙.
- Plein écran sur tous les supports : accueil, choix du héros, mode d'emploi et album sont dessinés en CSS/SVG avec les sprites des héros.
- « Quitter la mission » propose d'en choisir une nouvelle. Minuteur de partie facultatif (5 minutes à 1 heure) qui ne coupe jamais une mission en cours.
- Sauvegarde locale, fonctionnement hors ligne, aucun compte ni service externe.

## Numéro de version

`version.json` (affiché en tout petit sur l'accueil) est incrémenté automatiquement à chaque nouveau message de l'utilisateur par le hook `UserPromptSubmit` de `.claude/settings.json` (`tools/bump-version.mjs`), qui met aussi à jour le nom du cache de `sw.js`.

## Structure

- `index.html`, `styles.css` : écrans et interface (décor SVG commun aux écrans hors jeu).
- `app.js` : boucle de jeu Canvas, commandes, missions, énigmes, sauvegarde, sons.
- `levels.js` : génération des niveaux par héros et physique de la toile (partagée avec le jeu).
- `stickers.js` : pages et règles de l'album. `fx.js` : particules, vibrations, musique. `minigames.js` : questions, labyrinthe, puzzle, Simon.
- `sw.js` : cache hors ligne. `assets/` : sprites des héros (`heroes-atlas.webp` marche/saut, `hero-moves.webp` coups de poing/course rapide/balancement, `heroes-hd.webp` pour les écrans), `monsters.webp` (10 monstres), musique.
