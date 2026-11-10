# Mini Mission

PWA de plateforme 2D, en français, pour un jeune enfant : des missions d'entraide à enchaîner avec Ziggy la Comète, Filou le Tisseur ou Titan Puce. Rien n'est jamais punitif (ni mort, ni dégâts).

## Lancer en local

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`. Le service worker et l'installation PWA nécessitent HTTPS ou `localhost`.

## Les trois héros, trois façons de jouer

- **Filou — la ville (façon Spider-Man)** : immeubles, ravins et anneaux violets suspendus. **ACTION** lance la toile sur l'anneau à portée et Filou se balance ; il est lâché automatiquement au bon moment (ACTION ou SAUT pour lâcher plus tôt). Certains immeubles ne s'atteignent qu'en se balançant. Chaque balancement du niveau est vérifié par simulation.
- **Ziggy — la piste de vitesse** : plaques de vitesse, grands ravins et barrières. **ACTION** déclenche le turbo (course très rapide, écrase les petits obstacles et défonce les barrières) ; **SAUT** en plein turbo donne un grand saut qui franchit les ravins et atteint les plateformes hautes.
- **Titan — le chantier** : gros rochers et murs qui bloquent le chemin. **ACTION** donne un gros coup de poing ; les gros obstacles se fissurent puis éclatent (2 à 3 coups).

## Fonctionnalités

- Manette : croix verte à gauche, bouton **ACTION** puis bouton **SAUT** à droite ; les deux pouces agissent en même temps. Clavier : flèches/ZQSD, Espace, X, Échap.
- **Étoiles** (grosses, avec un petit visage) et **lettres** (cubes de jeu colorés) à ramasser. Les lettres sont placées dans des endroits de plus en plus difficiles d'accès.
- Trois énigmes par mission, tirées au hasard dans une banque de 1 000 questions (3 thèmes différents, sans répétition récente). La question est lue à voix haute (gros bouton haut-parleur pour la relire) mais on peut répondre sans attendre la fin.
- **Album de 5 pages d'autocollants** (60 en tout) :
  - 🥉 **bronze** (40, les plus nombreux) : une bonne réponse à une énigme ;
  - 🥈 **argent** (15, moyennement rares) : attraper toutes les étoiles d'une mission ;
  - 🥇 **or** (5, très rares) : récolter les 26 lettres d'une mission.
- Petits farceurs à transformer en amis (dix petits amis deviennent un grand ami rouge), parade de fin.
- Musique de fond (`assets/music.mp3`, « A pocket of stars ») pendant les parties, effets visuels (particules, secousses), retours haptiques (vibrations ; iPhone : seulement pendant un geste), bruitages. Tout se règle dans les réglages ⚙.
- Plein écran sur tous les supports : accueil, choix du héros, mode d'emploi et album sont dessinés en CSS/SVG avec les sprites des héros.
- « Quitter la mission » propose d'en choisir une nouvelle. Minuteur de partie facultatif (10 minutes) qui ne coupe jamais une mission en cours.
- Sauvegarde locale, fonctionnement hors ligne, aucun compte ni service externe.

## Numéro de version

`version.json` (affiché en tout petit sur l'accueil) est incrémenté automatiquement à chaque nouveau message de l'utilisateur par le hook `UserPromptSubmit` de `.claude/settings.json` (`tools/bump-version.mjs`), qui met aussi à jour le nom du cache de `sw.js`.

## Structure

- `index.html`, `styles.css` : écrans et interface (décor SVG commun aux écrans hors jeu).
- `app.js` : boucle de jeu Canvas, commandes, missions, énigmes, sauvegarde, sons.
- `levels.js` : génération des niveaux par héros et physique de la toile (partagée avec le jeu).
- `stickers.js` : pages et règles de l'album. `fx.js` : particules, vibrations, musique.
- `sw.js` : cache hors ligne. `assets/` : sprites des héros (`heroes-atlas.webp` en jeu, `heroes-hd.webp` pour les écrans), musique.
