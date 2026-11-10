# Mini Mission

PWA de plateforme 2D, en français, avec des missions d'entraide à enchaîner avec Ziggy la Comète, Filou le Tisseur ou Titan Puce.

## Lancer en local

Depuis ce dossier, lancez un serveur statique, par exemple :

```bash
python3 -m http.server 4173
```

Puis ouvrez `http://localhost:4173`. Le service worker et l'installation PWA nécessitent une origine HTTPS ou `localhost`.

## Fonctionnalités

- Accueil, choix du héros, mode d'emploi et album dessinés en CSS/SVG avec les sprites des héros : aucun écran n'est une image figée, tout remplit n'importe quel support (téléphone en portrait ou en paysage, tablette, ordinateur, écran très large) et s'installe en plein écran comme une application.
- Trois parcours longs adaptés aux pouvoirs de Ziggy, Filou et Titan, avec animations de sprites : marche rythmée par la distance parcourue, saut, réception, esquive en cas de choc, fête sur place, écrasement/étirement.
- Manette calquée sur le mode d’emploi : croix verte sur socle bleu à gauche (gauche/droite pour avancer, haut pour sauter, bas pour descendre d’une plateforme ; on peut glisser le doigt en diagonale), puis à droite le bouton rouge **ACTION !** (pouvoir du héros : vitesse, laine ou force) et, tout à droite, le bouton jaune **SAUT**. Les deux pouces peuvent agir en même temps. Au clavier : flèches, ZQSD ou WASD, espace pour sauter, X ou E pour l’action, Échap pour la pause.
- Les trois caisses peuvent être ouvertes dans n’importe quel ordre, ou pas du tout : la mission se termine dès qu'on rejoint la maison 🏡 au bout du chemin.
- « Quitter la mission » (dans la pause) efface la mission en cours et propose d'en choisir une nouvelle.
- Questions et ordre des réponses tirés au hasard à chaque mission (trois thèmes différents, sans répéter les questions récentes).
- On peut répondre à une énigme sans attendre la fin de la lecture vocale.
- Récompense : une bonne réponse du premier coup ouvre un cadeau surprise avec un autocollant à collectionner (24 animaux et objets, album consultable depuis l'accueil) et 5 pièces.
- Caisses de mission intégrées aux obstacles : un saut par-dessous lance la question vocale.
- Pause avec reprise, redémarrage du parcours et statistiques de mission.
- Trois petites énigmes tirées d'une banque de 1 000 questions ; la question et toutes les réponses sont lues en français.
- Plusieurs missions à la suite, sans limite quotidienne ; après chacune, le joueur peut repartir ou terminer la partie.
- Minuteur de 10 minutes facultatif et discret au choix du héros. À son expiration, une voix prévient l'enfant ; il termine sa mission en cours, puis le héros se repose. Le minuteur ne coupe jamais la partie.
- Plateformes et obstacles à différentes hauteurs, pièces, lettres et petits farceurs à transformer en amis.
- Sauvegarde locale, réglages sonores et fonctionnement hors ligne après le premier chargement.
- Aucun compte, publicité, collecte de données ni service externe.

## Structure

- `index.html` : écrans et interface (décor SVG commun aux écrans hors jeu).
- `styles.css` : mise en page responsive et styles.
- `app.js` : boucle Canvas, missions, commandes, sauvegarde et sons synthétiques.
- `sw.js` : cache PWA hors ligne (réseau d’abord pour le code, cache d’abord pour les images).
- `icons/` : icône SVG et icônes PNG (192, 512, Apple) pour l’installation.
- `assets/home-art.jpg`, `assets/hero-select-art.jpg` et `assets/controls-art.jpg` : visuels des écrans d'accueil, de sélection et d'aide.
- `assets/heroes-atlas.webp` : planche des héros pour l'animation en jeu (3 lignes × 6 poses : marcher ×2, éviter ×2, sauter, atterrir), détourée et alignée sur les pieds.
- `assets/heroes-hd.webp` : mêmes héros en haute définition (4 poses) pour l'accueil, le choix du héros, le mode d'emploi et la fin de mission.

Les niveaux restent bienveillants : aucun héros ne meurt ou ne subit de dégâts, et le minuteur ne force jamais l'arrêt d'une mission en cours.


Les parcours contiennent vingt-sept petits farceurs colorés. Une étoile magique les transforme en compagnons inoffensifs : ils suivent le héros en file pendant le parcours et apparaissent dans la parade de fin de mission. Aucun ennemi n'est blessé ou éliminé.

Les petits amis restent derrière le héros. Quand dix petits amis se regroupent, ils sont remplacés par un grand compagnon rouge qui compte pour dix. Chaque parcours propose aussi les 26 lettres à ramasser ; le récapitulatif de fin distingue les lettres trouvées des lettres manquantes et annonce à voix haute celles qui ont été récoltées lorsque la lecture vocale est disponible.
