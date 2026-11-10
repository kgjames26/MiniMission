# Mini Mission

PWA de plateforme 2D, en français, conçue pour une mission d'entraide courte avec Ziggy la Comète, Filou le Tisseur ou Titan Puce.

## Lancer en local

Depuis ce dossier, lancez un serveur statique, par exemple :

```bash
python3 -m http.server 4173
```

Puis ouvrez `http://localhost:4173`. Le service worker et l'installation PWA nécessitent une origine HTTPS ou `localhost`.

## Fonctionnalités

- Écran d'accueil utilisant l'illustration fournie.
- Choix du héros, niveau 2D à défilement et commandes tactiles/clavier.
- Trois petites énigmes d'entraide avec essais sans pénalité ; la question et toutes les réponses sont lues en français par la synthèse vocale de l'appareil avant d'activer les choix.
- Mission quotidienne choisie par date locale ; le jeu reprend la mission inachevée et marque la journée comme terminée après sa réussite.
- Sauvegarde locale, réglages sonores et fonctionnement hors ligne après le premier chargement.
- Aucun compte, publicité, collecte de données ni service externe.

## Structure

- `index.html` : écrans et interface.
- `styles.css` : mise en page responsive et styles.
- `app.js` : boucle Canvas, missions, commandes, sauvegarde et sons synthétiques.
- `sw.js` : cache PWA hors ligne.
- `assets/mini-mission-start.jpg` : image d'accueil fournie.

Le niveau actuel est un premier prototype jouable : les variantes sont assemblées à partir de modèles sûrs et l'ensemble des missions utilise actuellement les mêmes trois familles d'énigmes simples.
