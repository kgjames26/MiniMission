# Mini Mission

PWA de plateforme 2D, en français, avec des missions d'entraide à enchaîner avec Ziggy la Comète, Filou le Tisseur ou Titan Puce.

## Lancer en local

Depuis ce dossier, lancez un serveur statique, par exemple :

```bash
python3 -m http.server 4173
```

Puis ouvrez `http://localhost:4173`. Le service worker et l'installation PWA nécessitent une origine HTTPS ou `localhost`.

## Fonctionnalités

- Écran d'accueil utilisant l'illustration fournie.
- Choix du héros, niveau 2D à défilement et commandes tactiles/clavier.
- Trois petites énigmes tirées d'une banque de 1 000 questions ; la question et toutes les réponses sont lues en français avant d'activer les choix.
- Plusieurs missions à la suite, sans limite quotidienne ; après chacune, le joueur peut repartir ou terminer la partie.
- Minuteur de 10 minutes facultatif et discret au choix du héros. À son expiration, une voix prévient l'enfant ; il termine sa mission en cours, puis le héros se repose. Le minuteur ne coupe jamais la partie.
- Plateformes à différentes hauteurs, pièces à collecter et petits farceurs que le héros transforme en amis avec une étoile magique.
- Sauvegarde locale, réglages sonores et fonctionnement hors ligne après le premier chargement.
- Aucun compte, publicité, collecte de données ni service externe.

## Structure

- `index.html` : écrans et interface.
- `styles.css` : mise en page responsive et styles.
- `app.js` : boucle Canvas, missions, commandes, sauvegarde et sons synthétiques.
- `sw.js` : cache PWA hors ligne.
- `assets/mini-mission-start.jpg` : image d'accueil fournie.

Les niveaux restent bienveillants : aucun héros ne meurt ou ne subit de dégâts, et le minuteur ne force jamais l'arrêt d'une mission en cours.


Les parcours contiennent maintenant dix-huit petits ennemis colorés. Une étoile magique les transforme en compagnons inoffensifs : ils suivent le héros en file pendant le parcours et apparaissent dans la parade de fin de mission. Aucun ennemi n'est blessé ou éliminé.

Les petits amis restent derrière le héros. Quand dix petits amis se regroupent, ils sont remplacés par un grand compagnon rouge qui compte pour dix. Chaque parcours propose aussi les 26 lettres à ramasser ; le récapitulatif de fin distingue les lettres trouvées des lettres manquantes et annonce à voix haute celles qui ont été récoltées lorsque la lecture vocale est disponible.
