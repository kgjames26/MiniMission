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

## Le lutin de feu (le seul ennemi)
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

## Fluidité, toile et tout-petits (v0.30)
- Boucle de jeu : sur un téléphone lent, le temps écoulé est découpé en petits pas (le jeu garde la même vitesse) ; la finesse du canvas baisse toute seule (2 → 1,5 → 1,25) si l'appareil n'arrive pas à suivre, et revient en arrière si ça n'aide pas.
- Sauts : le héros s'étire en montant, se tasse en retombant et s'écrase d'autant plus que la chute est haute.
- Toile de Filou : corde souple (petite simulation de Verlet, purement visuelle) qui ondule à l'accroche et retombe quand on lâche ; petit ralenti et son « zip » à l'accroche ; pointillés vers l'anneau à portée et bouton TOILE qui pulse.
- Fenêtres de saut plus larges : appui mémorisé 0,2 s, saut possible 0,14 s après le bord.
- Réglage « 👶 Un seul bouton » : seuls ◀ ▶ et un très gros SAUT restent ; le tir part tout seul vers les farceurs devant, Filou lance sa toile en l'air et lâche au meilleur moment, Ziggy déclenche le turbo devant les barrières, petits obstacles et grands ravins (et saute tout seul au bord en turbo), Titan donne ses coups de poing devant les blocs.
- Récompenses : étoiles et lettres s'envolent vers leur compteur ; « B, comme ballon ! » avec son dessin ; petit visage joyeux au-dessus du héros.
- Verrou parent : ⚙ et ⏱️ s'ouvrent en gardant le doigt appuyé 1,5 seconde (un anneau se remplit, « ✋ 1,5 s » sur un simple tapotement) ; boutons agrandis en v0.44.
- Hors ligne : si le réseau traîne plus de 3 secondes, la version en cache s'affiche.
- Le lutin de feu est redessiné (v0.31) : une petite flamme vivante grognonne, sans cornes ni queue de diable, pour qu'on le reconnaisse toujours comme le méchant sans rien d'effrayant. Une fois attrapé, il devient une flamme jaune toute souriante (`assets/friend-flame.webp`). Ses 28 images sont dans `assets/sprites2.webp` (noms `imp_*` dans `sprites2.json`, positions et points d'ancrage inchangés).

## Ce qu'il reste à trouver (v0.36)
- Lettres : le compteur montre la dernière lettre ramassée dans un anneau qui se remplit ; une lettre dépassée sans être prise apparaît en gris et la voix dit « Oh ! Tu as oublié le D ! ».
- Étoiles : un bocal qui se remplit (il brille quand on les a toutes) ; à chaque drapeau, de petites étoiles grises montrent les oubliées du morceau, ou le drapeau devient doré si tout est ramassé.
- Écran de pause : l'alphabet (lettres trouvées allumées) et la ligne des drapeaux.
- Autocollants : les moins parlants ou en double (mime, cabine téléphonique, papyrus, amulette, quatre ponts identiques…) remplacés par des thèmes que tous les enfants connaissent (trottinette, skate, camion de pompiers, renard, guitare, manchot…), à la même place dans l'album.

## Langues et paysage (v0.38)
- 6 langues : français, anglais, espagnol, allemand, japonais, coréen. Choix au premier lancement (drapeaux), puis « 🌐 Language » dans les réglages (toujours en anglais).
- Voix de la langue choisie (meilleure voix installée, choix de l'adulte retenu par langue) ; message si aucune voix n'est installée.
- Lettres à ramasser selon la langue : A–Z, + Ñ (espagnol), + Ä Ö Ü ß (allemand), 46 hiragana (japonais), 24 lettres du hangeul (coréen), avec leur vrai nom dit par la voix et « B comme ballon » dans chaque langue.
- Devinettes, cris d'animaux, couleurs, villes et 120 autocollants traduits. Les énigmes « coups de main » (banque française) restent en français uniquement.
- Paysage : zoom (héros ~40 % plus grand), sol toujours visible au-dessus des boutons, dézoom doux quand un anneau de Filou doit rester visible, héros jamais caché sous ◀ ▶, barre du haut plus fine.

## Prénom de l'enfant (v0.40)
- Après le choix de la langue (une seule fois), un écran « Pour le parent » propose le prénom (facultatif, bouton « Passer »), un bouton 🔊 pour l'écouter et une case pour l'écrire comme il se prononce si la voix se trompe. Modifiable dans ⚙ Réglages (« 👧 Prénom »).
- Utilisé avec parcimonie : bonjour après la saisie, « Choisis une ville, Léa ! », fin de niveau, autocollant d'or, au revoir du minuteur. Coréen : 아/야 selon le 받침.
- Le prénom reste uniquement sur l'appareil (localStorage), jamais envoyé.

## Transitions d'animation (v0.41)
- Images dessinées entre deux états (`TRANS` dans app.js) : arrêt ↔ marche pour les 3 héros, marche ↔ course turbo pour Ziggy ; elles sont ajoutées en bas de `assets/sprites2.webp` (noms `*_iw0`, `*_wi0`, `ziggy_wr*`, `ziggy_rw*`).
- Sinon, fondu de 0,08 s entre l'ancienne et la nouvelle image (sauts, atterrissages, actions).
- La course de Ziggy suit sa vitesse et repart toujours du même pied ; Ziggy et Titan ont un saut complet dessiné (`*_j0` à `*_j6`), comme Filou.
- Marche de Ziggy redessinée (v0.43) : 7 images `ziggy_m0`…`ziggy_m6` où les jambes alternent vraiment (`ziggy_w1` reste l'image à l'arrêt).
- Voix (v0.46) : `sayText(texte, fin, true)` = phrase secondaire (lettre ramassée, encouragement, compte des étoiles, autocollant trouvé, « oups ») : abandonnée si une voix parle déjà. Les autres (actions de l'enfant ou de l'adulte, devinette, minuteur, fin de mission) passent toujours.
- Marche de Ziggy (v0.46) : seulement les 5 images debout (`ZIGGY_WALK`) ; `ziggy_m0` et `ziggy_m4`, trop accroupies, sont écartées.

## « Ce que j'ai déjà trouvé » (v0.47)
- Toucher un compteur du haut (⭐ étoiles, 👾 monstres, 🔤 lettres, drapeaux) ouvre une petite fenêtre juste en dessous : lettres allumées/éteintes, étoiles qui restent dans chaque morceau du niveau (▼ = où est le héros), monstres déjà amis.
- Le jeu est en pause pendant ce temps ; la voix dit ce qu'il reste (`peekLeft` / `peekAll`) ; un toucher n'importe où referme.

## 20 monstres tous différents (v0.48)
- Par ville : 5 lutins de feu (un par façon d'attaquer, chacun sa couleur : `IMP_HUE`, teinte calculée une fois au chargement) + les 15 petits monstres tranquilles (`CALM` : case farceur, case ami, façon de bouger), dans un ordre mélangé.
- `assets/monsters.webp` : 7 lignes de 5 cases (400×264) ; les 11 nouveaux monstres sont dans les cases 10 à 31 (farceur puis ami).
- Monstres vivants (v0.50) : sans dessin en plus, dans `drawFriend` — ils se retournent, respirent ; les sauteurs s'écrasent et s'étirent, les marcheurs se dandinent, les costauds font des pas lourds avec de la poussière, l'escargot et la chenille ondulent, les volants penchent, le nuage gonfle et laisse tomber une goutte, le dragon souffle de la fumée ; les amis font des petits sauts de joie et un cœur s'envole de temps en temps (le robot danse, l'arc-en-ciel du nuage scintille).
- 2e image d'animation (v0.53) : cases 35 à 40 de `monsters.webp` (`MON_ALT`), calées sur le dessin principal ; ailes qui battent (`MON_FLAP`, battements par seconde) pour la chauve-souris, la fée, les abeilles et le papillon ; la chenille fait sa bosse en rampant.
- Sons des amis (v0.55) : `friendSound(m)` joue un petit son différent pour chacun des 15 monstres tranquilles et une note par couleur de flamme, quand il devient ami (fabriqués en code avec Web Audio, aucun fichier) ; il remplace le « ding » habituel et passe avant la voix qui compte (v0.56).
- Nuage d'aide (v0.59) : après 2 chutes dans le même trou (`cloudHelp`), un petit nuage souriant attend dedans ; s'il rattrape le héros, il le fait rebondir jusqu'à l'autre bord (`cloudBounce`, trajectoire calculée). Un enfant qui réussit ne le voit jamais. Remis à zéro à chaque mission.

## Rose (en préparation)
- `assets/rose.webp` + `rose.json` : TOUTES les images des GIF (`tools/rose/`), à la même échelle et calées sur le sol ; le jeu fond chaque image dans la suivante (60 images/s) ; `top` = hauteur du casque au-dessus du sol, pour raccorder les animations.
- `rose.html` : page d'essai des mouvements (pas encore dans le jeu). Marche lente d'exosquelette, pieds qui ne glissent pas ; décollage depuis l'arrêt ou depuis la marche, vol stationnaire / lent / rapide selon la vitesse, atterrissage vers l'arrêt ou vers la marche, victoire. Chaque changement passe par son animation de jonction, sinon par un fondu court.
