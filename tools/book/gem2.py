"""Les 24 images suivantes du livre (fins de ville, fins de planète, fin du chapitre 1, final). Usage : python3 tools/book/gem2.py <dossier>"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import gem, ref
H = "Wide children's picture-book illustration in a glossy, thick-outline cartoon style. Draw the characters of image 1 exactly like them, keeping their relative sizes. "
HR = "Wide children's picture-book illustration in a glossy, thick-outline cartoon style. Draw the characters of image 1 and Rose of image 2 exactly like them, keeping their relative sizes. "
E = " Rich colours, detailed background, expressive faces, no text."
H3 = "Ziggy, Filou and Titan"
HAP = "the little monsters, now happy friends (no purple glitter anymore)"
RS = "Rose (the girl from image 2): light-blue and white armour with orange chest plates, round glass helmet with orange ear pieces ON her head, long wavy auburn hair, brown eyes, freckles"
SAU = "far away in the sky a tiny grey flying saucer sneaks off"
MON = ['herisson', 'limon', 'golem', 'chauvesouris']
CITY = [
 ('c0c-w1', f"Paris at the foot of the Eiffel Tower. Left: {H3} share a big picnic of croissants and fruit on a checkered blanket with {HAP}, everyone smiling. Right: the Eiffel Tower in close-up being repainted by a little painter on a rope; {SAU}."),
 ('c1c-w1', f"New York, Central Park with skyscrapers. Left: {H3} and {HAP} breathe in slowly smelling a flower, then blow out like on a candle, calm and relaxed. Right: the Statue of Liberty, and behind her torch a tiny grey flying saucer peeks out."),
 ('c2c-w1', f"Tokyo street with paper lanterns and cherry blossoms, Mount Fuji far away. Left: {H3} and {HAP} hold hands and walk together in a little train line. Right: everybody bows politely to an old Japanese lady, and Titan accidentally does a forward roll."),
 ('c3c-w1', f"Rio de Janeiro beach. Left: {HAP} wake up from a nap in the shade of a parasol with big glasses of water, Ziggy hands out water. Right: everyone dances samba on the beach with carnival confetti, {H3} included; {SAU}."),
 ('c4c-w1', f"Cairo, the pyramids. Left: Titan holds up a big hourglass and the little monsters take turns riding a proud camel, one at a time. Right: the others build sandcastles while waiting, Ziggy and Filou help; at the top of the biggest pyramid a little trail of purple powder."),
 ('c5c-w1', f"London, red double-decker bus, the clock tower Big Ben. Left: {HAP} wait in a neat queue counting on their fingers and singing with {H3}. Right: everyone climbs into the bus one by one, happy; a tiny grey flying saucer swings on the hand of the big clock."),
 ('c6c-w1', f"Venice canals with gondolas and little bridges. Left: Filou flies up and catches the red balloon; a crying little monster gets a hug and a handkerchief from Ziggy. Right: the little monster smiles with its balloon and the whole street smiles; under a bridge a tiny wet flying saucer hides."),
 ('c7c-w1', f"Sydney harbour, the Opera House. Left: {HAP} blow as if inflating a huge balloon and squeeze big cushions with {H3}, the anger flying away like a puff of smoke. Right: a mother kangaroo with a baby in her pouch, and a little purple powder in the pouch."),
 ('c8c-w1', f"Marrakech market full of spices and carpets. Left: Ziggy kneels and says hello with a big smile to a shy little monster peeking out from under a carpet. Right: the little monsters come out and play with {H3}; one mountain of spices is purple glitter and makes a monster sneeze."),
 ('c9c-w1', f"The Great Wall of China over green mountains at sunset. Left: two little monsters say sorry to each other and make up with a hug, {H3} cheering. Right: all {HAP} and {H3} together in one big happy group photo; far along the wall a tiny grey flying saucer waits in the dark."),
]
WORLD = [
 ('lune_c-w1', ['rose', 'glouglou', 'boing', 'zap', 'ami1', 'ami2'], "the grey Moon, big blue Earth in the black sky. Left: soap bubbles float away carrying the grumpy aliens of image 1, who sulk inside them; the freed little friends jump out of their open cages around Rose. Right: an old astronaut footprint in the moon dust next to a small flag, Rose looks at it amazed."),
 ('mars_c-w1', ['rose', 'bidou', 'zigzag', 'ami1', 'ami3'], "the red desert of Mars. Left: a little six-wheeled rover robot and a small helicopter drone help Rose open the cages, the little friends cheer. Right: Gros Bidou floats away in a big soap bubble; behind, a giant volcano and a blue sunset."),
 ('venus_c-w1', ['rose', 'glouglou', 'boing', 'zap', 'ami2', 'ami4'], "hot yellow-orange Venus. Left: the grumpy aliens of image 1 relax inside cool soap bubbles, sighing with relief. Right: Rose and the freed little friends drink big glasses of water together, laughing."),
 ('mercure_c-w1', ['rose', 'glouglou', 'boing', 'zap', 'ami1', 'ami3'], "cratered grey Mercury under a huge Sun. Left: Rose jumps from crater to crater opening cages, little friends hop out. Right: the grumpy aliens fly away squeezed together in soap bubbles, sulking."),
 ('jupiter_c-w1', ['rose', 'farfouille', 'ami1', 'ami2'], "an icy moon of Jupiter, giant striped Jupiter with its red spot. Left: Rose talks kindly to Captain Farfouille, a hand on her heart, freed little friends behind her. Right: Captain Farfouille flies off in his saucer, puzzled and muttering, scratching his head."),
 ('saturne_c-w1', ['rose', 'farfouille', 'glouglou', 'boing', 'zap', 'ami3'], "Saturn's icy rings. Left: Rose and the freed friends invite the aliens to slide down the rings together, arms open. Right: the aliens hesitate, but Captain Farfouille whistles from his saucer and they fly away sulking."),
 ('uranus_c-w1', ['rose', 'ami1', 'ami2', 'ami3', 'ami4'], "cold blue-green Uranus tilted on its side. Left: Rose bursts out laughing. Right: the freed little friends lie down on their sides in a row for a funny photo with Rose, everyone giggling."),
 ('neptune_c-w1', ['rose', 'zigzag', 'ami2', 'ami4'], "deep blue windy Neptune. Left: Rose kneels and talks gently to Zigzag. Right: Zigzag flies away in his soap bubble and gives a small shy wave goodbye to Rose."),
 ('terre_c-w1', ['rose', 'ami1', 'ami2', 'ami3'], "the space station above the Earth at night. Left: Rose frees the little friends one by one from cages on the solar panels. Right: the Earth's night side glows with the city lights of Paris, New York and Tokyo; Rose and the friends look down in wonder."),
 ('soleil_c-w1', ['rose', 'farfouille', 'glouglou', 'boing', 'zap', 'bidou', 'zigzag', 'ami1', 'ami4'], "floating rocks near the huge glowing Sun. Left: all twenty freed little friends jump for joy around Rose. Right: Captain Farfouille, inside a soap bubble, stamps his foot furiously and points toward the Earth, his aliens in bubbles behind him."),
]
FIN = [
 ('ch1end-w2', ['rose_cool', 'ziggy', 'filou', 'titan'], H, f"Left: in the morning, the empty garden; {H3} sit sadly on the grass, Rose in her inventor outfit smiles with an idea. Right: Rose opens her garden lab door: inside stands her light-blue and white armour with orange chest plates and the round glass helmet, glowing; Rose puts it on, rocket boots igniting."),
 ('final_a-w2', ['rose', 'ziggy', 'filou', 'titan', 'ami1', 'ami2', 'flamme'], HR, f"Left: {RS} points to the city and {H3} stand ready in heroic poses, each looking toward the avenues, the rooftops and a construction site. Right: the twenty little friends join them, ready to help, and everyone runs off toward a big city full of soap bubbles."),
 ('final_c-w1', ['farfouille', 'glouglou', 'boing', 'zap', 'bidou', 'zigzag'], H, "Left: a whole city filled with floating soap bubbles, each with a grumpy alien inside. Right: in the last bubble, Captain Farfouille cries big tears; the other aliens lower their heads, sad and lonely."),
 ('final_c-w3', ['farfouille', 'bidou', 'zigzag', 'rose', 'ziggy', 'filou', 'titan', 'ami1'], HR, f"Left: the aliens sweep away the purple glitter powder with brooms and the city throws a giant party with garlands; Gros Bidou hugs everyone with his arms, Zigzag blows heart-shaped bubbles. Right: everyone plays together on the aliens' icy comet among the stars: {RS}, {H3}, the little monsters and the aliens, friends forever."),
]
def run(out):
    os.makedirs(out, exist_ok=True); jobs = {}
    for name, scene in CITY:
        ref.board(os.path.join(out, name + '-ref.png'), MON + ['ziggy', 'filou', 'titan']); jobs[name] = {'rose': False, 'prompt': H + scene + E}
    for name, cast, scene in WORLD:
        ref.board(os.path.join(out, name + '-ref.png'), cast)
        jobs[name] = {'rose': True, 'prompt': HR + scene.replace('Rose', 'Rose (light-blue and white armour with orange chest plates, round glass helmet ON her head)', 1) + E}
    for name, cast, head, scene in FIN:
        ref.board(os.path.join(out, name + '-ref.png'), cast); jobs[name] = {'rose': head is HR, 'prompt': head + scene + E}
    json.dump(jobs, open(os.path.join(out, 'jobs2.json'), 'w'), ensure_ascii=False, indent=1); print(len(jobs))
if __name__ == '__main__': run(sys.argv[1])
