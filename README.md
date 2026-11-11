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

## Dix villes par héros
Après le choix du héros, on choisit une ville (`cities.js`) : Paris, New York, Tokyo, Rio, Le Caire, Londres, Venise, Sydney, Marrakech, Pékin. Chaque ville a ses couleurs, son monument en arrière-plan, ses maisons, ses arbres et son petit mobilier. Le niveau suivant s'ouvre quand on arrive au bout du précédent. La ville est toujours la même (graine fixe) : la progression (étoiles, lettres, monstres, questions, autocollants) est conservée et la carte indique ce qu'il reste à faire.
À la fin d'un niveau, une feuille de statistiques résume ce qui a été réussi et ce qu'il reste à faire, avec un bouton « Menu ».

## Le diablotin de feu (le seul ennemi)
Les 20 petits monstres de chaque niveau : 10 diablotins de feu (lanceurs) et 10 petits monstres tranquilles (hérisson, limon, chauve-souris, golem). Les diablotins ont des attaques variées : boule de feu, double tir (dont un tir en cloche), flèche de feu (arc), tornade de feu (avec avertissement au sol) et grand saut. S'il touche le héros 3 fois en 14 secondes, celui-ci revient au dernier drapeau (point de passage). On les capture en les touchant : Ziggy et Filou avec leur tir, Titan avec son coup de poing de près ou son poing projeté à distance (qui casse aussi les obstacles). Un diablotin capturé devient un ami.

## Ziggy
Le turbo ne démarre que sur ACTION ; il s'arrête tout seul après ~1 s, en changeant de direction ou en rappuyant sur ACTION.

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

## Albums
360 autocollants à débloquer : 10 villes × 3 héros × 12. Chaque héros gagne ses propres autocollants dans chaque ville. Deux classements, avec un bouton pour basculer : 3 albums de personnages (rangés par ville) ou 10 albums de villes (rangés par personnage). Toucher un autocollant ouvre sa description (écrite et lue). L'accueil invite à les trouver tous.

## Mini-jeux
Chaque caisse tire au hasard un jeu parmi : puzzle, labyrinthe, jeu des paires, rythme façon Simon (couleurs + notes) ou énigme. La difficulté monte avec la ville. Environ 100 images pour les puzzles et les paires, 50 duos pour les labyrinthes (labyrinthe généré à chaque fois).

## Parcours
Trous remplis de lave ou d'eau (avec un requin qui patrouille et saute), pierres flottantes en mobilier de la ville, barres à escalader pour passer un grand immeuble, balancements par-dessus un immeuble pour Filou (demi-tour en l'air possible après la toile). Toucher un monstre compte comme un impact. Après une chute, on repart bien avant le trou.

## Difficulté croissante
Quand tout a été attrapé dans une ville (étoiles, lettres, 20 monstres, questions), la carte propose « ↻⚔️ » : on peut la refaire avec un cran de difficulté en plus (⚔️1, ⚔️2…). La progression est remise à zéro, les mêmes autocollants sont à regagner (ils s'ajoutent en doublon), les ennemis ont plus de points de vie, attaquent plus souvent et plus vite, et à partir du niveau 2 tirent un coup de plus.

## Parcours par héros (v0.17)
- Filou : grands escaliers d'immeubles à gravir en se balançant (jusqu'à ~500 px de haut), plus de balanciers ; la caméra suit en hauteur.
- Titan : un grand trou par niveau avec un pilier devant ; 3 coups de poing le font tomber en pont de pierre.
- Ziggy : parfois un grand immeuble avec un trampoline puissant devant ; la caméra monte avec lui.

## Balancement de Filou (v0.22)
Filou reste accroché à sa toile tant qu'on ne saute pas (le bouton SAUT clignote au meilleur moment ; maintenir ← ou → donne de l'élan). Les anneaux sont placés plus haut et le liquide des trous (eau avec requin, lave) est plus profond : Filou ne les touche jamais en se balançant. Nouveaux « saute-mouton » : une suite de 4 anneaux qui montent vers un trésor visible en haut de l'écran.

## Commandes, minuteur, repos (v0.28)
- Deux gros boutons ◀ ▶ (plus de croix : le saut a son bouton) ; le mode d'emploi est mis à jour.
- Minuteur : bouton ⏱️ en haut à droite de l'accueil (5 à 60 min). Une fois le temps écoulé, la partie en cours se termine, puis les héros dorment 1 heure (écran de repos animé, JOUER est bloqué). Le parent remet le minuteur à zéro en gardant appuyé « Réinitialiser le minuteur » dans les réglages.
- La musique se coupe après 45 s sans toucher l'écran et revient au premier contact.
- Au lancement, on passe toujours par accueil → héros → ville : le jeu ne reprend plus une partie tout seul.
