"""Les 25 grandes images du livre (une par double page, format 8:3), par planches de 4 + une planche de référence des personnages.
Usage : python3 tools/book/planche3.py <dossier>"""
import sys, os, textwrap
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
import ref
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
import planche as P
ref.CAST['farfouille'] = ('Capt. Farfouille', P.note('Capitaine Farfouille : joindre SA fiche'), .75)
ref.CAST['rose_cool'] = ('Rose (casual)', P.note('Rose en TENUE COOL : joindre SA fiche', 330, 460, (255, 225, 240)), 1.0)
R = 'Rose (7-year-old girl, long auburn hair, freckles, light-blue/white/orange exosuit, round glass bubble helmet with orange ear pieces ALWAYS ON in space, exactly like the model)'
RC = 'Rose in her CASUAL outfit (see her sheet, no exosuit, no helmet)'
H3 = 'Ziggy (red star suit, red mask, yellow cape), Filou (blue hoodie with hood up, purple gloves, web line) and Titan (strong boy, green-and-yellow suit, yellow cape), each shown once'
GR = 'grumpy little monsters with frowning, pouting faces and a small purple glitter cloud on their noses'
FR = 'the happy little friends (fluffy blue one, round yellow one with a leaf, mossy golem, little orange flame)'
A3 = 'the green one-eyed alien, the pink alien on a spring and the purple alien in its little grey saucer'
A5 = A3 + ', Gros Bidou (big orange one-eyed alien with horns) and Zigzag (purple alien with orange-ball antennae)'
CITY = [('Paris, Eiffel Tower', 'two of them run out of a bakery holding croissants, the baker surprised'),
        ('New York, yellow taxis honking, skyscrapers, Statue of Liberty far away', 'they hide behind a trash can, hands over their ears'),
        ('Tokyo, a white bullet train passing, snowy Mount Fuji far away, paper lanterns', 'they turn in circles, lost and confused'),
        ('Rio de Janeiro beach under a hot sun, Sugarloaf Mountain', 'they lie exhausted and sweaty on the sand, very grumpy'),
        ('Cairo, the pyramids at the edge of the desert', 'they all pull on ONE puzzled camel, each wanting to ride it first'),
        ('London, a red double-decker bus, the clock tower', 'they push and shove at the bus door instead of queuing'),
        ('Venice canals with gondolas and little bridges', 'one monster cries because its balloon floats away on the canal, the others sulk with it'),
        ('Sydney harbour, the Opera House with its sail-shaped roofs, a kangaroo', 'they stomp their feet, red with anger'),
        ('Marrakech market full of spices and colorful carpets', 'only their shy eyes peek out from under the carpets'),
        ('the Great Wall of China winding over green mountains', 'they stand back to back, arms crossed, not talking to each other')]
WORLD = [('lune', 'the grey Moon, big blue Earth in the black sky', A3, 'stick out their tongues next to small cages of sad monsters behind a moon rock'),
         ('mars', 'the red desert of Mars, caramel sky, two potato-shaped moons, dust devils', 'Gros Bidou (big orange one-eyed alien, arms crossed) and Zigzag (purple, blowing two bubbles)', 'tease Rose next to the cages'),
         ('venus', 'Venus under thick yellow-orange clouds, steam rising from the hot ground, flat pancake volcanoes', A3 + ' wearing sunglasses', 'sweat and grumble next to the cages, pretending to be cool'),
         ('mercure', 'cratered grey Mercury, black sky, the Sun HUGE and blazing', 'the pink alien on its spring', 'bounces so high above a crater full of cages that Rose spots it with binoculars'),
         ('jupiter', 'one of Jupiter\'s icy moons, giant striped Jupiter with its red spot filling the sky', 'Captain Farfouille (his sheet) at the window of his flying saucer', 'shakes his fist at Rose; cages sit on the little moons around'),
         ('saturne', 'Saturn\'s icy rings seen up close, the golden planet behind', A3, 'slide down the rings like a toboggan, laughing, forgetting the cages'),
         ('uranus', 'cold blue-green Uranus tilted on its side with vertical rings', A3, 'lie down on their sides in a row, trying to "disguise" themselves, very silly'),
         ('neptune', 'deep blue Neptune, strong wind streaks, a tiny icy comet far away', 'Zigzag (purple alien with orange-ball antennae)', 'looks sadly at the far comet, his home, near the cages'),
         ('terre', 'the International Space Station above the blue Earth, cages hanging from its solar panels', 'astronauts floating behind a window with balls of orange juice', 'wave at Rose'),
         ('soleil', 'floating rocks near the HUGE glowing Sun with gentle flares', A5 + ' and Captain Farfouille (his sheet)', 'stand in a row guarding the last cages')]
IMGS = [
 ('prologue-w1', ['glouglou', 'boing', 'zap', 'bidou', 'zigzag', 'farfouille'], f'LEFT: on a small icy comet among the stars, {A5} sit in a row, chins in hands, bored and lonely. RIGHT: next to the comet, Captain Farfouille (his sheet) raises a finger under a glowing light bulb while the aliens load two crates into their saucer: one with grumpy monsters peeking out, one overflowing with sparkly purple powder.'),
 ('prologue-w2', ['herisson', 'limon', 'chauvesouris', 'golem', 'rose_cool', 'ziggy', 'filou', 'titan'], f'LEFT: evening over a big city park, a crate falls with a sparkling tail like a shooting star; {GR} roll out on the grass. RIGHT: in her garden workshop full of gadgets, {RC} calls into a big old radio while {H3} run toward her.'),
] + [(f'c{i}a-w1', ['herisson', 'limon', 'golem', 'rose_cool', 'ziggy', 'filou', 'titan'],
      f'{place}. LEFT: {GR}: {mis}. RIGHT: {H3} set off to help, each in a different direction; {RC} appears on a small round radio screen in a corner.') for i, (place, mis) in enumerate(CITY)] + [
 ('ch1end-w1', ['ami1', 'ami2', 'ami4', 'flamme', 'ziggy', 'filou', 'titan', 'zap'], f'LEFT: a joyful party in a garden at dusk with lanterns: {FR} and {H3} dance, little flames make fireworks. RIGHT: same garden at night, everyone asleep; a flying saucer silently lifts the sleeping friends up in a beam of light, an alien giggling at the window.'),
] + [(f'{w}_a-w1', ['rose'] + (['glouglou', 'boing', 'zap'] if 'green one-eyed' in who else ['bidou', 'zigzag'] if 'Gros Bidou' in who and 'Captain' not in who else ['boing'] if 'pink alien' in who else ['farfouille'] if who.startswith('Captain') else ['zigzag'] if who.startswith('Zigzag') else []) + (['farfouille', 'bidou', 'zigzag'] if w == 'soleil' else []) + ['herisson', 'limon'],
      f'{place}. LEFT: {R} arrives, amazed. RIGHT: {who} {act}. Little cages with sad little monsters inside.') for w, place, who, act in WORLD] + [
 ('final_a-w1', ['farfouille', 'glouglou', 'zigzag', 'rose', 'ziggy', 'filou', 'titan'], f'LEFT: dozens of flying saucers fill the morning sky over a big city; Captain Farfouille (his sheet) shakes a huge sack of purple glitter powder. RIGHT: {R} lands in the garden and {H3} run to hug her, overjoyed.'),
 ('final_c-w2', ['farfouille', 'rose', 'ziggy', 'filou', 'titan', 'glouglou', 'bidou', 'ami1', 'flamme'], f'LEFT: {R} kneels gently and holds out her hand to Captain Farfouille (his sheet), who sniffles with a big tear. RIGHT: Farfouille shyly asks to play and everyone jumps for joy: {H3}, {FR} and the aliens, all friends now, with hearts in the air.'),
]
HEAD = ('Make ONE image = a 2x2 grid of 4 SEPARATE WIDE panoramic children\'s picture-book illustrations (each 8:3, thin white gutters). Replace each panel (text included) with its finished illustration: '
        'one continuous scene whose LEFT half and RIGHT half tell two moments. Characters exactly as in the attached reference sheet (look AND relative size), each once per panel. '
        'Soft painterly cartoon style, bold dark outlines, warm light, depth, emotions easy to read. NO text, letters or speech bubbles.')
def run(out):
    groups = [IMGS[i:i + 4] for i in range(0, len(IMGS), 4)]
    for g, grp in enumerate(groups, 1):
        W, G, HEAD_H = 2400, 14, 100; cw = (W - 3 * G) // 2; chh = int(cw * 3 / 8); H = HEAD_H + 2 * chh + 3 * G
        Pg = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(Pg); y = 8
        for line in textwrap.wrap(HEAD, 165): d.text((G, y), line, fill=(40, 30, 90), font=font(18, True)); y += 22
        for k, (name, cast, prompt) in enumerate(grp):
            x0, y0 = G + (k % 2) * (cw + G), HEAD_H + G + (k // 2) * (chh + G)
            d.rectangle([x0, y0, x0 + cw, y0 + chh], fill=(246, 249, 255), outline=(180, 190, 220), width=3)
            d.line([(x0 + cw // 2, y0 + 8), (x0 + cw // 2, y0 + chh - 8)], fill=(215, 220, 235), width=2)
            d.text((x0 + 12, y0 + 8), str(k + 1), fill=(240, 112, 44), font=font(36, True)); ty = y0 + 12
            for line in textwrap.wrap(prompt, 92): d.text((x0 + 52, ty), line, fill=(30, 30, 50), font=font(20)); ty += 26
        Pg.save(os.path.join(out, f'planche3-{g}.png'))
        cast = []; [cast.append(c) for _, cc, _ in grp for c in cc if c not in cast]
        ref.board(os.path.join(out, f'planche3-{g}-personnages.png'), cast)
        print(f'planche3-{g}', [n for n, _, _ in grp])
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else '.')
