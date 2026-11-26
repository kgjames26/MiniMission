/* Mini Mission — le livre de l'histoire (texte français ; traductions plus tard).
   Chaque livre : bg = ambiance de l'image provisoire, pages = [{ t: texte affiché, s: texte dit (si différent), e: émojis de l'image provisoire }].
   Les vraies images iront dans assets/book/<livre>-<n>.webp (n = numéro de page à partir de 1) : dès qu'un fichier existe, il remplace l'image provisoire. */
(() => {
  const MM = (window.MM = window.MM || {});
  const P = (t, e, s) => (s ? { t, e, s } : { t, e });
  const S = {};
  S.prologue = { bg: 'space', pages: [
    P('Tout au bout du système solaire, sur une petite comète glacée, vivent les farceurs de l’espace. Ils sont ronds, ils sont rigolos… et ils adorent faire des blagues. Mais sur leur comète, il n’y a personne avec qui jouer.', '☄️👾👾👾'),
    P('Un jour, Capitaine Farfouille a une idée. « Allons faire une grosse farce sur la Terre ! » Les farceurs remplissent une caisse de petits monstres, et une autre de poudre Grognon. Hop, tout le monde dans la soucoupe !', '🛸📦✨'),
    P('Un soir, au-dessus d’un grand parc, la soucoupe lâche la caisse. Tout le monde croit voir une étoile filante. Badaboum ! La caisse s’ouvre, et vingt petits monstres roulent dans l’herbe, couverts de poudre Grognon.', '🌠📦🌳'),
    P('Atchoum ! La poudre les rend tout grognons. Ils boudent, ils tirent la langue, et ils filent dans toutes les grandes villes du monde. Dans sa cabane-labo, Rose appelle ses amis : « Ziggy, Filou, Titan… on a besoin de vous ! »', '😤📻🦸'),
  ] };
  // ---- chapitre 1 : les 10 villes (même ordre que cities.js) ----
  const CITY = [
    { a: [P('Bonjour Paris ! Ici, la tour Eiffel monte jusqu’aux nuages. Mais dans les rues, les petits monstres font la grimace et piquent les croissants des boulangeries.', '🗼🥐😤'),
          P('« Ils ont un petit nuage violet sur le nez, dit Rose à la radio. C’est de la poudre Grognon ! » Ziggy prend les avenues, Filou les toits, Titan le chantier. C’est parti !', '📻🦸🏙️')],
      h: { ziggy: '« Avenues : tout le monde est calmé ! »', filou: '« Sur les toits, plus un seul grognon ! »', titan: '« Au chantier, on a fait la paix ! »' },
      c: [P('En fait, les petits monstres avaient surtout très faim. Alors les héros ont fait un grand pique-nique au pied de la tour Eiffel. Quand on partage, tout le monde sourit !', '🧺🥐🍓😊'),
          P('Le savais-tu ? La tour Eiffel est en fer, et on la repeint tous les sept ans. Mais chut… tout là-haut, une petite soucoupe s’enfuit en ricanant.', '🗼🌙🛸')] },
    { a: [P('Hello New York ! Les immeubles sont si hauts qu’ils chatouillent le ciel. Mais tin-tin, pouet-pouet ! Les klaxons font tellement de bruit que les petits monstres se cachent en grognant.', '🏙️🚕🙉'),
          P('« Quand on a peur, on peut devenir grognon », explique Rose. Les héros partent les retrouver, tout doucement, pour ne pas les effrayer.', '🤫🦸')],
      h: { ziggy: '« Avenues : plus personne n’a peur ! »', filou: '« Les toits sont tout calmes ! »', titan: '« Le chantier est rassuré ! »' },
      c: [P('Les héros leur montrent un truc : on respire tout doucement, comme si on sentait une fleur, puis on souffle une bougie. Les petits monstres respirent, soufflent… et ils n’ont plus peur.', '🌸🕯️😌'),
          P('Le savais-tu ? La statue de la Liberté est un cadeau que la France a fait aux États-Unis. Et derrière sa torche… encore la petite soucoupe !', '🗽🛸')] },
    { a: [P('Konnichiwa Tokyo ! Ici, des trains au long nez pointu filent à toute vitesse, et le mont Fuji porte un chapeau de neige. Mais les petits monstres tournent en rond : ils sont perdus.', '🚄🗻😵‍💫', 'Konnitchiwa Tokyo ! Ici, des trains au long nez pointu filent à toute vitesse, et le mont Fuji porte un chapeau de neige. Mais les petits monstres tournent en rond : ils sont perdus.'),
          P('« Quand on est perdu, on reste sur place et on demande de l’aide », dit Rose. Les héros partent chercher tout le monde, quartier par quartier.', '🗺️📻🦸')],
      h: { ziggy: '« J’ai retrouvé tout le monde dans les avenues ! »', filou: '« Les toits, c’est bon ! »', titan: '« Plus personne de perdu au chantier ! »' },
      c: [P('Les héros donnent la main aux petits monstres, et tout le monde avance ensemble, en petit train. Ensemble, on ne se perd plus !', '🤝🏮🚂'),
          P('Le savais-tu ? Au Japon, on se salue souvent en s’inclinant un petit peu. Les monstres essaient… et Titan fait une roulade par erreur !', '🙇🤸😂')] },
    { a: [P('Olá Rio ! Il y a des plages, de la musique, et une montagne en forme de pain de sucre. Mais il fait si chaud que les petits monstres sont épuisés, et très, très grognons.', '🏖️☀️😩'),
          P('« Quand on est fatigué, tout devient difficile », dit Rose en bâillant presque. Les héros partent vite les aider.', '🥱📻🦸')],
      h: { ziggy: '« Avenues : tout le monde est reposé ! »', filou: '« Sur les toits, c’est la sieste ! »', titan: '« Le chantier fait une pause ! »' },
      c: [P('Un grand verre d’eau, un coin d’ombre, une petite sieste… Et voilà les monstres qui se réveillent avec le sourire. Ils dansent même la samba !', '💧😴💃🎶'),
          P('Le savais-tu ? Au Brésil, on parle portugais. Pendant le carnaval, toute la ville danse dans la rue. Et au loin… la soucoupe danse aussi, pour se cacher !', '🎉🪶🛸')] },
    { a: [P('Salam, Le Caire ! Ici se dressent les pyramides, au bord du désert. Mais les petits monstres se disputent : tout le monde veut monter sur le même chameau en même temps !', '🐫🔺😠'),
          P('« Ils sont jaloux, dit Rose. Il faut trouver une solution juste. » Les héros filent dans les trois quartiers de la ville.', '🤔📻🦸')],
      h: { ziggy: '« Avenues : fini les disputes ! »', filou: '« Les toits sont d’accord ! »', titan: '« Le chantier partage ! »' },
      c: [P('Titan sort un sablier. « Chacun son tour ! » Un tour de chameau chacun… et en attendant, on fait des châteaux de sable. Le chameau, lui, est très fier.', '⏳🐫🏰'),
          P('Le savais-tu ? Les pyramides ont été construites il y a plus de quatre mille cinq cents ans ! Et tout en haut de la plus grande… une trace de poudre violette.', '🔺✨💜')] },
    { a: [P('Hello Londres ! Les bus sont rouges, ils ont deux étages, et une grande horloge sonne dans sa tour : ding, dong ! Mais les petits monstres ne veulent pas attendre : ils se bousculent pour monter dans le bus.', '🚌🕰️😤'),
          P('« Attendre, c’est difficile, dit Rose. Mais ça s’apprend ! » Les héros partent apprendre la patience à tout le monde.', '⏱️📻🦸')],
      h: { ziggy: '« Moi qui suis si rapide… j’ai attendu mon tour ! »', filou: '« Les toits font la queue bien sagement ! »', titan: '« Au chantier, chacun attend son tour ! »' },
      c: [P('Le truc des héros : quand on attend, on compte jusqu’à dix, ou on chante une chanson. Un, deux, trois… et hop, tout le monde monte dans le bus, bien en file.', '🔟🎵🚌'),
          P('Le savais-tu ? Big Ben, c’est le nom de la grosse cloche cachée dans la tour de l’horloge. Et là-haut, sur l’aiguille… la soucoupe se balance !', '🔔🕰️🛸')] },
    { a: [P('Ciao Venise ! Ici, les rues sont faites d’eau, et on se promène en bateau. Mais un petit monstre pleure : son ballon est parti sur un canal. Et ses amis, tristes pour lui, deviennent tout grognons.', '🛶🎈😢'),
          P('« Quand on est triste, on a besoin d’un ami », dit Rose tout doucement. Les héros partent consoler tout le monde.', '💛📻🦸')],
      h: { ziggy: '« Avenues : les larmes sont séchées ! »', filou: '« J’ai attrapé le ballon avec ma toile ! »', titan: '« Au chantier, on a fait des câlins ! »' },
      c: [P('Un câlin, un mouchoir, et un ballon rattrapé par Filou. On peut demander : « Tu veux un câlin ? » Le petit monstre sourit, et toute la ville sourit avec lui.', '🤗🎈🌉'),
          P('Le savais-tu ? À Venise, il y a plus de quatre cents ponts ! Et sous l’un d’eux… une soucoupe se cache, toute mouillée.', '🌉💧🛸')] },
    { a: [P('G’day Sydney ! Au bord de la mer, il y a un opéra en forme de voiles de bateau. Mais aujourd’hui, les petits monstres sont très en colère : ils tapent du pied et deviennent tout rouges.', '⛵🎭😡', 'Gueudé Sydney ! Au bord de la mer, il y a un opéra en forme de voiles de bateau. Mais aujourd’hui, les petits monstres sont très en colère : ils tapent du pied et deviennent tout rouges.'),
          P('« La colère, c’est comme une tempête dans le ventre, dit Rose. Elle finit toujours par passer. » Les héros partent aider la tempête à passer.', '⛈️📻🦸')],
      h: { ziggy: '« Avenues : la tempête est finie ! »', filou: '« Les toits sont tout calmes ! »', titan: '« Même moi, j’ai respiré tranquille ! »' },
      c: [P('Les héros leur apprennent à souffler comme dans un gros ballon, et à serrer un coussin très fort. La colère s’envole, pouf ! Les monstres retrouvent leur couleur.', '🎈😮‍💨🦘'),
          P('Le savais-tu ? Le bébé kangourou grandit bien au chaud dans la poche de sa maman. Et dans cette poche… un peu de poudre violette. Les farceurs sont passés par ici !', '🦘✨🤧')] },
    { a: [P('Marhaba Marrakech ! Le marché sent bon les épices, et il y a des tapis de toutes les couleurs. Mais les petits monstres se cachent sous les tapis : ils sont timides, et ça les rend grognons.', '🧺🌶️👀'),
          P('« Ce n’est pas facile de parler à quelqu’un qu’on ne connaît pas », dit Rose. Les héros partent dire bonjour à tout le monde.', '👋📻🦸')],
      h: { ziggy: '« Avenues : on est tous copains ! »', filou: '« Sur les toits, tout le monde se connaît ! »', titan: '« Au chantier, on s’est présentés ! »' },
      c: [P('Le truc des héros : un sourire, un « bonjour », et « Comment tu t’appelles ? ». Un petit monstre répond tout bas… et c’est le début d’une grande amitié.', '😊👋🤝'),
          P('Le savais-tu ? Au marché de Marrakech, il y a des montagnes d’épices de toutes les couleurs. Atchoum ! Une de ces montagnes est violette… ce n’est pas une épice !', '🌶️🟡🟣')] },
    { a: [P('Ni hao Pékin ! Ici, la Grande Muraille serpente sur les montagnes, comme un immense dragon de pierre. Mais les petits monstres se sont disputés, et plus personne ne se parle.', '🧱🐉😒', 'Ni hao Pékin ! Ici, la Grande Muraille serpente sur les montagnes, comme un immense dragon de pierre. Mais les petits monstres se sont disputés, et plus personne ne se parle.'),
          P('« Après une dispute, il faut se réconcilier », dit Rose. C’est la dernière ville : les héros partent, bien décidés.', '✋📻🦸')],
      h: { ziggy: '« Avenues : tout le monde s’est dit pardon ! »', filou: '« Sur les toits, c’est la paix ! »', titan: '« Le chantier est réconcilié ! »' },
      c: [P('Chacun dit : « Pardon, je ne voulais pas te faire de peine. » Et l’autre répond : « D’accord, on refait ami-ami. » Les vingt petits monstres sont enfin tous des amis !', '🤝💛🧱'),
          P('Le savais-tu ? La Grande Muraille est si longue qu’il faudrait des mois pour la parcourir à pied. Et ce soir-là, tout au bout de la muraille, une soucoupe attend dans le noir…', '🌙🧱🛸')] },
  ];
  CITY.forEach((c, i) => {
    S['c' + i + 'a'] = { bg: 'city', city: i, pages: c.a };
    S['c' + i + 'c'] = { bg: 'city', city: i, pages: c.c };
    for (const h in c.h) S['c' + i + h] = { bg: 'city', city: i, hero: h, pages: [P(c.h[h], h === 'ziggy' ? '⚡' : h === 'filou' ? '🕸️' : '💪')] };
  });
  S.ch1end = { bg: 'night', pages: [
    P('Pour fêter ça, tout le monde fait une grande fête dans le jardin de Rose. Les vingt petits monstres chantent, les flammes de couleur font un feu d’artifice. Quelle belle journée !', '🎉🎆💛'),
    P('Mais pendant la nuit, vroum ! La soucoupe arrive sans bruit. Les farceurs aspirent les vingt amis avec un grand rayon lumineux. « Hi hi ! Maintenant, ce sont NOS amis ! » Et zou, ils repartent dans l’espace.', '🛸🔦😴'),
    P('Le matin, le jardin est vide. Ziggy, Filou et Titan sont très tristes. « On ne sait pas voler dans l’espace… » Rose sourit. « Moi, j’ai peut-être une idée. »', '🌅😢💡'),
    P('Rose ouvre la porte de son labo. Dedans, il y a l’exosquelette qu’elle construit depuis le début de l’histoire ! Elle l’enfile, clic, clac, et allume ses réacteurs. « Tenez bon, les amis. J’arrive ! »', '🧑‍🚀🚀🔥'),
  ] };
  // ---- chapitre 2 : les 10 mondes de Rose ----
  const W = {
    lune: { a: [P('Première étape : la Lune ! Ici, il n’y a pas d’air, alors Rose garde bien son casque. Elle fait des pas tout légers… boing, boing !', '🌙🧑‍🚀🌍'),
                P('Derrière un rocher, des cages ! Les amis sont dedans, tout tristes. Et autour, Glouglou, Boing et Zap ricanent. « Pfff, des bulles, ça ne fait pas peur ! »', '🔒👾😜')],
            c: [P('Pop, pop, pop ! Les bulles de Rose emportent les farceurs dans le ciel, et les amis sont libres. « Merci Rose ! » Les farceurs, eux, s’envolent en boudant.', '🫧👾🎉'),
                P('Le savais-tu ? En mille neuf cent soixante-neuf, Neil Armstrong a été le premier homme à marcher sur la Lune. Comme il n’y a pas de vent, ses traces de pas sont peut-être encore là !', '👣🌙')] },
    mars: { a: [P('Voici Mars, la planète rouge. Le sol est rouge parce qu’il est plein de rouille, comme un vieux clou ! Des tourbillons de poussière dansent comme des toupies.', '🔴🌪️🧑‍🚀'),
                P('Ici, de nouveaux farceurs : Gros Bidou, le costaud, et Zigzag, qui souffle des bulles. « Nous aussi, on a des bulles ! » dit Zigzag. Rose rigole. « Les miennes sont plus grosses ! »', '👾🫧😄')],
            c: [P('Un petit robot à six roues et un petit hélicoptère se sont réveillés pour aider Rose. Ensemble, ils libèrent tous les amis. Gros Bidou a eu besoin de deux bulles, mais il s’envole aussi !', '🤖🚁🫧'),
                P('Le savais-tu ? Sur Mars se trouve le plus grand volcan de tout le système solaire. Et le coucher de soleil y est bleu !', '🌋🌅🔵')] },
    venus: { a: [P('Vénus est cachée sous des nuages très épais. C’est la planète la plus chaude de toutes ! Heureusement, l’exosquelette de Rose a un petit ventilateur.', '☁️🔥🌀'),
                 P('Les farceurs ont mis des lunettes de soleil. « Ici, on est les rois du chaud ! » Mais ils transpirent, et ils râlent beaucoup.', '😎💦👾')],
             c: [P('Pop ! Pop ! Dans leurs bulles, les farceurs trouvent enfin un peu de fraîcheur. « Ahhh… » Les amis sont libres, et tout le monde boit un grand verre d’eau.', '🫧😌💧'),
                 P('Le savais-tu ? On voit Vénus briller le soir, comme une grosse étoile. Et là-bas, le Soleil se lève de l’autre côté, parce que Vénus tourne à l’envers !', '✨🌆🔄')] },
    mercure: { a: [P('Mercure est la plus petite planète, et la plus proche du Soleil. Le jour, il fait brûlant ; la nuit, il fait glacé ! Rose allume le chauffage, puis la clim, puis le chauffage…', '☀️🥶🔥'),
                   P('Les farceurs ont caché les cages dans les cratères. « Elle ne les trouvera jamais ! » dit Boing. Mais Boing rebondit tellement fort qu’on le voit de loin.', '🕳️👾🔭')],
               c: [P('Un cratère, deux cratères, dix cratères… Rose les visite tous, et les amis sont libres ! Les farceurs s’envolent en boudant, bien serrés dans leurs bulles.', '🕳️🫧🎉'),
                   P('Le savais-tu ? Mercure fait le tour du Soleil très vite : une année sur Mercure dure moins de trois mois !', '☀️💨')] },
    jupiter: { a: [P('Waouh, Jupiter ! C’est la plus grosse planète. On ne peut pas marcher dessus : elle est faite de gaz et de nuages. Rose vole entre ses bandes de couleur.', '🟠🧑‍🚀☁️'),
                   P('Les cages sont posées sur les lunes de Jupiter. Il y en a beaucoup ! Capitaine Farfouille apparaît à son hublot : « Rose ! Arrête de libérer nos amis ! »', '🌑🛸😠')],
               c: [P('« Ce ne sont pas vos amis s’ils sont dans des cages, répond Rose. Un ami, ça choisit de jouer avec toi. » Capitaine Farfouille ne sait pas quoi dire, et il s’en va en marmonnant.', '🗣️🤔💛'),
                   P('Le savais-tu ? La grosse tache rouge de Jupiter est une tempête plus grande que la Terre entière, qui tourne depuis très, très longtemps !', '🔴🌀🌍')] },
    saturne: { a: [P('Voici Saturne et ses magnifiques anneaux. Ils sont faits de morceaux de glace et de cailloux, gros comme des billes ou comme des maisons. Rose vole tout doucement entre eux.', '🪐🧊🧑‍🚀'),
                   P('Les farceurs font du toboggan sur les anneaux. Wiiii ! Ils s’amusent tellement qu’ils en oublient de surveiller les cages.', '🛝👾😆')],
               c: [P('Rose libère les amis, et propose : « On peut faire du toboggan tous ensemble ? » Les farceurs hésitent… mais Capitaine Farfouille siffle, et ils repartent en boudant.', '🛝💛😕'),
                   P('Le savais-tu ? Saturne est si légère que, dans une baignoire géante, elle flotterait comme un canard en plastique !', '🛁🪐🦆')] },
    uranus: { a: [P('Uranus est bleu-vert et très, très froide. Et c’est une planète bizarre : elle tourne couchée sur le côté, comme une roue qui roule !', '🩵🥶🛞'),
                  P('Les farceurs se sont tous couchés sur le côté pour faire comme la planète. « Comme ça, on est déguisés ! » Ce n’est pas très réussi.', '👾😴🤭')],
              c: [P('Rose ne peut pas s’empêcher de rire. Pop, pop ! Les amis sont libres, et ils se couchent sur le côté eux aussi, pour la photo.', '😂🫧📸'),
                  P('Le savais-tu ? Sur Uranus, chaque pôle reste dans le noir pendant quarante-deux ans d’affilée. C’est une très, très longue nuit !', '🌑🌙💤')] },
    neptune: { a: [P('Neptune est la planète la plus loin du Soleil. Elle est d’un bleu profond, et ses vents sont les plus rapides du système solaire. Rose s’accroche bien !', '🔵💨🧑‍🚀'),
                   P('Au loin, on voit une petite comète glacée. « C’est notre maison », dit Zigzag tout bas. Pour la première fois, il a l’air un peu triste.', '☄️👾🥺')],
               c: [P('Rose libère les amis, puis elle dit à Zigzag : « Si tu veux jouer, tu peux juste demander. » Zigzag ne répond pas… mais il fait un petit coucou en s’envolant dans sa bulle.', '🫧👋💛'),
                   P('Le savais-tu ? Neptune est si loin qu’elle met cent soixante-cinq ans à faire le tour du Soleil !', '🔵☀️⏳')] },
    terre: { a: [P('Retour près de la Terre, notre planète bleue ! Les farceurs ont accroché des cages aux satellites et à la station spatiale, où vivent des astronautes.', '🌍🛰️🔒'),
                 P('Dans la station, les astronautes flottent, et même leur jus d’orange flotte en petites boules ! Ils font coucou à Rose par le hublot.', '🧑‍🚀🍊👋')],
             c: [P('Rose libère les amis un par un. La nuit tombe sur la Terre, et on voit briller les lumières de Paris, New York, Tokyo… Toutes les villes du chapitre un !', '🌍✨🏙️'),
                 P('Le savais-tu ? La station spatiale fait le tour de la Terre en une heure et demie. Les astronautes voient donc seize levers de soleil par jour !', '🛰️🌅🔁')] },
    soleil: { a: [P('Dernière étape : le Soleil ! C’est une étoile, une immense boule de feu. Rose reste à bonne distance, et son exosquelette la protège de la chaleur.', '☀️🔥🧑‍🚀'),
                  P('Les dernières cages sont là, et tous les farceurs les gardent, avec Capitaine Farfouille au milieu. « Celles-là, tu ne les auras pas ! »', '👾👾👾🔒')],
              c: [P('Pop, pop, pop, pop ! Les vingt amis sont enfin tous libres ! Capitaine Farfouille tape du pied dans sa bulle. « Puisque c’est comme ça… on va TOUS sur la Terre ! »', '🎉🫧😤'),
                  P('Le savais-tu ? Le Soleil est si gros qu’on pourrait mettre plus d’un million de Terres dedans. Et attention : on ne le regarde jamais directement, même avec des lunettes de soleil !', '☀️🌍🙈')] },
  };
  for (const w in W) { S[w + '_a'] = { bg: 'space', world: w, pages: W[w].a }; S[w + '_c'] = { bg: 'space', world: w, pages: W[w].c }; }
  // ---- chapitre 3 : le grand final (la partie viendra plus tard) ----
  S.final_a = { bg: 'night', pages: [
    P('Un matin, le ciel se remplit de soucoupes ! Les farceurs débarquent sur la Terre, et Capitaine Farfouille secoue un énorme sac de poudre Grognon. « Toute la ville va bouder ! »', '🛸🛸🏙️'),
    P('Rose atterrit juste à temps dans le jardin. Ziggy, Filou et Titan courent vers elle. « Rose ! Tu es revenue ! » Les quatre amis se serrent très fort.', '🧑‍🚀🤗🦸'),
    P('« Cette fois, on y va tous les quatre, dit Rose. Ziggy, les avenues. Filou, les toits. Titan, le chantier. Et moi, le ciel ! » Les vingt amis veulent aider aussi.', '🗺️🦸💛'),
    P('Et toi, avec qui veux-tu jouer ? Choisis ton héros… les trois autres t’aideront. C’est parti pour la grande bataille de bulles !', '🦸🦸🦸🧑‍🚀'),
  ] };
  S.final_c = { bg: 'night', pages: [
    P('Pop, pop, pop ! Toute la ville est remplie de bulles, avec des farceurs dedans. La dernière bulle, c’est celle de Capitaine Farfouille. Et là… il se met à pleurer.', '🫧🫧😢'),
    P('« Sur notre comète, on est tout seuls, sanglote-t-il. On voulait juste des amis pour jouer… mais on ne savait pas comment faire. » Les autres farceurs baissent la tête. Eux aussi, ils se sentaient seuls.', '☄️😔👾'),
    P('Rose s’approche doucement. « Pour avoir un ami, on ne l’enferme pas, et on ne lui jette pas de poudre. On lui demande simplement : tu veux jouer avec moi ? »', '🧑‍🚀🤲💛'),
    P('Capitaine Farfouille renifle, prend une grande inspiration, et demande tout bas : « Tu… tu veux jouer avec moi ? » « OUI ! » crient les héros, les vingt amis, et même les farceurs.', '🥹🙌🎉'),
    P('Les farceurs balaient toute la poudre Grognon, et la ville fait une fête géante. Gros Bidou fait des câlins à quatre bras, Zigzag souffle des bulles en forme de cœur. Les farceurs sont devenus des amis !', '🎊🫧💖'),
    P('Depuis, les farceurs viennent souvent sur la Terre, et nos amis vont jouer sur leur comète. Et toi, avec qui vas-tu jouer aujourd’hui ? N’oublie pas : il suffit de demander. Fin.', '🛸☄️🌍'),
  ] };
  // titres de la bibliothèque (l'enfant ne lit pas encore : la couverture montre surtout les émojis)
  const CN = ['Paris', 'New York', 'Tokyo', 'Rio', 'Le Caire', 'Londres', 'Venise', 'Sydney', 'Marrakech', 'Pékin'];
  const WN = { lune: 'La Lune', mars: 'Mars', venus: 'Vénus', mercure: 'Mercure', jupiter: 'Jupiter', saturne: 'Saturne', uranus: 'Uranus', neptune: 'Neptune', terre: 'La Terre', soleil: 'Le Soleil' };
  S.prologue.title = 'La caisse'; S.ch1end.title = 'La soucoupe'; S.final_a.title = 'Le grand final'; S.final_c.title = 'Fin';
  CN.forEach((n, i) => { S['c' + i + 'a'].title = n + ' ①'; S['c' + i + 'c'].title = n + ' ②'; });
  for (const w in WN) { S[w + '_a'].title = WN[w] + ' ①'; S[w + '_c'].title = WN[w] + ' ②'; }
  // ordre de la bibliothèque
  MM.STORY_ORDER = ['prologue', ...CN.flatMap((_, i) => ['c' + i + 'a', 'c' + i + 'c']), 'ch1end', ...Object.keys(WN).flatMap(w => [w + '_a', w + '_c']), 'final_a', 'final_c'];
  // images à dessiner (25) : une grande image par double page marquée 'img' ; 'auto' = scène dessinée par le jeu
  S.prologue.art = ['img', 'img']; S.ch1end.art = ['img', 'auto']; S.final_a.art = ['img', 'auto']; S.final_c.art = ['auto', 'img', 'auto'];
  CN.forEach((_, i) => { S['c' + i + 'a'].art = ['img']; });
  for (const w in WN) S[w + '_a'].art = ['img'];
  MM.STORY = S;
})();
