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

## Langues (fr, en, es, de, ja, ko) : les traductions doivent être parfaites
- Moteur et français : `i18n.js` ; autres langues : `lang-en.js`, `lang-es.js`, `lang-de.js`, `lang-ja.js`, `lang-ko.js` (mêmes clés que le français).
- Textes de la page : attributs `data-i18n` / `data-i18n-aria` / `data-i18n-title` ; dans le code : `T('clé', { variables })`.
- Chaque langue a son alphabet à ramasser (`letters.alpha` : 26 lettres, ñ en espagnol, ä ö ü ß en allemand, 46 hiragana, 24 lettres du hangeul), le nom des lettres À DIRE (`letters.say`) et un mot par lettre (`letters.words`, avec une phrase complète en 3e position si besoin : « を », « ん », « ß »…).
- Tout ce que la voix dit doit être écrit pour être bien PRONONCÉ par la synthèse vocale de la langue, pas seulement bien orthographié.
- Coréen : écrire les particules {은} {이} {을} {과} après une variable, i18n.js choisit la bonne forme selon le 받침.
- Toute nouvelle phrase : l'ajouter dans les 6 langues ; écouter avec la voix du téléphone ; faire relire par une personne dont c'est la langue maternelle.
