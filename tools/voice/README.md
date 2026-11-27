# Voix enregistrées (Google Cloud Text-to-Speech)

Le jeu lit d'abord les fichiers `voice/<langue>/<code>.mp3`. S'il manque un fichier pour une phrase, ou si la lecture échoue, il reprend la synthèse vocale du navigateur, comme avant. Pour l'instant, seul le français est enregistré.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `tools/voice/extract.mjs` | relève dans le code toutes les phrases dites en français et écrit `phrases.csv` |
| `tools/voice/phrases.csv` | le tableau, une ligne par phrase : code, personnage, phrase, vitesse, pauses, enthousiasme, style, fichier, source, note (séparateur `;`, s'ouvre dans Excel, LibreOffice ou Google Sheets) |
| `tools/voice/voices.json` | la voix Google de chaque personnage |
| `tools/voice/generate.mjs` | fabrique les MP3 et `voice/fr/index.json` |
| `voice-clips.js` | dans le jeu : trouve le fichier de chaque phrase et le joue, sinon passe à la voix du navigateur |

## Après un changement de texte

```
node tools/voice/extract.mjs       # met à jour le tableau ; vos réglages de ton sont gardés pour chaque code
node tools/voice/generate.mjs      # ne refait que les phrases nouvelles ou modifiées
```

Pour changer le ton d'une phrase, modifiez sa ligne dans `phrases.csv` (vitesse : 1 = normale ; pauses : aucune, courtes ou longues ; enthousiasme : de 1 à 5 ; style : une consigne libre), puis relancez `generate.mjs`.

## Ce qui reste à la voix du navigateur

- Les phrases avec le prénom de l'enfant (« Bravo Léa ! »). Le prénom ne quitte jamais l'appareil, il ne peut donc pas être enregistré à l'avance. Sans prénom, le jeu joue la version enregistrée (« Bravo ! »).
- Les phrases qui ont trop de combinaisons : les compteurs « 12 sur 40 », et « Il te reste 3 étoiles, 2 lettres… ».
- Les langues autres que le français, tant que leurs fichiers n'existent pas.
- Toutes les phrases quand l'adulte a choisi une voix précise du téléphone dans les réglages. Le choix « Voix du jeu (enregistrée) » remet les fichiers.

## Assemblage

Le jeu cherche d'abord la phrase entière. S'il ne la trouve pas, il la découpe en phrases (après . ! ? …) et cherche un fichier pour chacune. C'est ainsi que « Niveau de difficulté trois ! Les monstres sont plus costauds. » donne deux fichiers. Les énigmes sont lues en morceaux : la question, puis « Choisis une réponse : », puis une réponse par fichier, puisque leur ordre change à chaque partie.
