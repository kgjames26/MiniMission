# Mini Mission

PWA de plateforme 2D en français pour un enfant de 6 ans. Voir README.md.

## Numéro de version
- `version.json` contient le numéro affiché en tout petit sur l'accueil (`v0.N`).
- Il est incrémenté automatiquement à chaque nouveau message de l'utilisateur par le hook `UserPromptSubmit` (`.claude/settings.json` → `tools/bump-version.mjs`), qui met aussi à jour le nom du cache de `sw.js`.
- Si le hook n'a pas tourné, lancer `node tools/bump-version.mjs` une fois par nouvelle demande, avant de commiter.

## Règles de conception
- Peu de texte à l'écran : l'enfant ne lit pas encore couramment, privilégier icônes et voix.
- Aucun écran n'est une image figée : tout est en CSS/SVG/canvas pour remplir tous les supports.
- Rien n'est jamais punitif : pas de mort ni de dégâts.

## Traductions (à venir) : elles doivent être parfaites
- Tout ce que la voix dit doit être écrit pour être bien prononcé par la synthèse vocale, pas seulement bien orthographié. Exemple : les lettres seules sont dites via la table `LETTER_SAY` (« Y » → « i grec »), jamais la lettre brute.
- Pour chaque langue : refaire `LETTER_SAY` et les mots « B comme ballon » (`LETTER_WORDS`, un mot simple qui commence vraiment par la lettre dans cette langue), les questions des énigmes, les noms et phrases des autocollants.
- Écouter chaque phrase avec la voix du téléphone, et faire relire par une personne dont c'est la langue maternelle avant de publier.
