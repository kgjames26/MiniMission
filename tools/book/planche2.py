"""Planche de 4 pages (v2) : modèles à leur VRAIE taille relative, avec leur nom, et prompt détaillé par case.
Usage : python3 tools/book/planche2.py <dossier> [planche ...]"""
import sys, os, textwrap
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
import planche as P
from ref import CAST
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
CAST = dict(CAST)
CAST['farfouille'] = ('Capt. Farfouille', P.note('Capitaine Farfouille : joindre SA fiche'), .75)
CAST['rose_cool'] = ('Rose (casual)', P.note('Rose en TENUE COOL : joindre SA fiche', 330, 460, (255, 225, 240)), 1.0)
ROSE = 'Rose (7-year-old girl, long auburn hair, big brown eyes, freckles, light-blue/white/orange space exosuit with a white triangle on the chest, round glass helmet ALWAYS closed in space)'
ZIG = 'Ziggy (boy, red suit with yellow stars, red eye mask, yellow cape)'
FIL = 'Filou (boy, blue zip hoodie with the hood up, purple gloves, he swings on a thin web line)'
TIT = 'Titan (strong boy, dark skin, green and yellow suit, yellow cape)'
GRUMPY = 'grumpy little monsters with frowning, pouting faces and a small purple glitter cloud on their noses (the spiky purple hedgehog, the green slime, the dark bat, the mossy stone golem)'
FRIENDS = 'the little friends, smiling, much smaller than the heroes (fluffy blue one, round yellow one with a leaf, mossy stone golem, little orange flame)'
ALI3 = 'the green round one-eyed alien with two antennae, the pink alien on a metal spring, the purple alien riding a small grey flying saucer with a glass dome (each about half Rose\'s height)'
HEAD = ('ONE image = a 2x2 grid of 4 SEPARATE children\'s picture-book illustrations (each 4:3, thin white gutters). Replace each panel (models AND text) with its finished illustration. '
        'Use the models only as character references: exact look and TRUE RELATIVE SIZES as shown. Each character appears ONCE per panel, never mixed with another. '
        'Soft painterly cartoon style, bold dark outlines, warm light, depth. NO text, letters, numbers or speech bubbles.')
SHEETS = {
 'lune': (['lune_a-1', 'lune_a-2', 'lune_c-1', 'lune_c-2'], [
   (['rose'], f'{ROSE} lands softly on the grey cratered Moon with a small puff of dust; she floats a little as she lands, happy and amazed. Black starry sky, big blue Earth shining above. Wide shot, cold silver light, magical mood.'),
   (['glouglou', 'boing', 'zap', 'herisson', 'limon', 'golem'], f'Behind a big grey moon rock, small metal cages hold sad little monsters looking out. In front, {ALI3} stick out their tongues mischievously toward the viewer. Low angle, dramatic but funny.'),
   (['rose', 'glouglou', 'boing', 'zap', 'ami1', 'ami2', 'ami4', 'flamme'], f'{ROSE} laughs and points up: three shimmering rainbow soap bubbles float away, each holding one sulking alien with crossed arms ({ALI3}). At her feet {FRIENDS} jump for joy. Grey Moon ground, blue Earth on the horizon. Joyful, victorious.'),
   (['rose'], f'Close-up on the grey moon dust: an old astronaut boot print. The boot of {ROSE} steps carefully right next to it. Earth glowing in the corner. Quiet, wonder.'),
 ]),
 'mars': (['mars_a-1', 'mars_a-2', 'mars_c-1', 'mars_c-2'], [
   (['rose'], f'{ROSE} walks across the red rocky desert of Mars, helmet closed. Caramel-orange sky with two small potato-shaped moons; little swirling dust devils dance like spinning tops around her. Wide shot, warm dusty light, sense of adventure.'),
   (['bidou', 'zigzag', 'rose'], f'Gros Bidou (big round orange one-eyed alien with two horns, arms crossed, sulking) and Zigzag (purple alien with two orange-ball antennae) blowing two tiny bubbles at {ROSE}, who laughs and blows one HUGE shiny bubble. Funny face-off, medium shot.'),
   (['rose', 'bidou', 'ami1', 'ami2', 'flamme'], f'{ROSE} stands proudly with a small white six-wheeled rover robot and a tiny four-legged Mars helicopter; {FRIENDS} cheer around them. Far up in the sky, ONE Gros Bidou floats away inside a big bubble. Victory, warm light.'),
   (['rose'], f'Evening on Mars: a BLUE sunset glowing behind a gigantic, wide, gently sloping volcano. {ROSE} and the little rover robot sit side by side watching it, seen from behind. Calm, poetic.'),
 ]),
 'prologue': (['prologue-1', 'prologue-2', 'prologue-3', 'prologue-4'], [
   (['glouglou', 'boing', 'zap', 'bidou', 'zigzag'], 'On a small icy comet drifting among stars, the five aliens sit in a row, chins in their hands, bored and lonely; nobody else around. A tiny blue Earth far away. Wide shot, cold blue light, a little sad but cute.'),
   (['farfouille', 'glouglou', 'zigzag'], 'Inside their saucer: Captain Farfouille (use his character sheet) raises one finger with a glowing light bulb above his head. Behind him the aliens load two wooden crates: one full of grumpy little monsters peeking out, one overflowing with sparkly purple powder. Mischievous, funny.'),
   (['herisson', 'limon', 'chauvesouris', 'golem', 'zap'], 'Evening over a big city park: a wooden crate falls with a sparkling tail like a shooting star; far above, a tiny flying saucer. On the grass, the burst crate and grumpy little monsters rolling out, covered in purple glitter. Wide shot, twilight.'),
   (['herisson', 'limon', 'rose_cool', 'ziggy', 'filou', 'titan'], f'Left: grumpy little monsters sneeze purple glitter and run off toward far city skylines. Right: in her garden workshop full of gadgets, Rose in her CASUAL outfit (use her sheet, NO exosuit) talks into a big old radio, while {ZIG}, {FIL} and {TIT} run toward her. Energetic.'),
 ]),
 'paris': (['c0a-1', 'c0a-2', 'c0c-1', 'c0c-2'], [
   (['herisson', 'limon'], f'A sunny Paris street, the Eiffel Tower behind. A bakery full of croissants; the baker is surprised. Two {GRUMPY.split("(")[0]}— the spiky purple hedgehog and the green slime — run off, each holding a croissant, frowning. Funny, lively.'),
   (['rose_cool', 'ziggy', 'filou', 'titan'], f'Rose in her CASUAL outfit (her sheet, no exosuit) appears on a round radio screen in a corner, giving directions. {ZIG} sprints down a wide avenue, {FIL} swings high between rooftops, {TIT} marches toward a construction site with a crane. Eiffel Tower in the middle. Each hero once.'),
   (['ziggy', 'filou', 'titan', 'ami1', 'ami2', 'ami4', 'flamme'], f'Picnic on a red-and-white checkered blanket under the Eiffel Tower: {ZIG}, {FIL} and {TIT} share croissants and strawberries with {FRIENDS}. Everyone laughing. Golden afternoon light, cosy.'),
   (['zap'], 'Night: the Eiffel Tower sparkling with golden lights over Paris. High behind it, the purple alien in its tiny grey flying saucer sneaks away, giggling, leaving a little trail of purple sparkles. Magical, a hint of mystery.'),
 ]),
}
def sheet(sid, out, unit_fixed=None):
    names, cells = SHEETS[sid]
    W, H, HEAD_H, G = 2400, 1900, 104, 12
    cw, ch = (W - G * 3) // 2, (H - HEAD_H - G * 3) // 2
    Pg = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(Pg); y = 8; units = []
    for line in textwrap.wrap(HEAD, 160): d.text((G, y), line, fill=(40, 30, 90), font=font(19, True)); y += 23
    for k, (cast, prompt) in enumerate(cells):
        x0, y0 = G + (k % 2) * (cw + G), HEAD_H + G + (k // 2) * (ch + G)
        d.rectangle([x0, y0, x0 + cw, y0 + ch], fill=(246, 249, 255), outline=(180, 190, 220), width=3)
        d.text((x0 + 12, y0 + 6), str(k + 1), fill=(240, 112, 44), font=font(40, True)); ty = y0 + 10
        for line in textwrap.wrap(prompt, 84): d.text((x0 + 56, ty), line, fill=(30, 30, 50), font=font(22)); ty += 28
        items = [CAST[c] for c in cast]; FT = font(24, True)
        top, base = ty + 20, y0 + ch - 44; avail = base - top
        unit = unit_fixed if unit_fixed else avail / max(k_ for _, _, k_ in items)   # hauteur de Rose en pixels
        def layout(u):
            sc = [(lab, im.resize((max(1, int(im.width * u * kk / im.height)), max(1, int(u * kk))))) for lab, im, kk in items]
            ws = [max(im.width, d.textlength(lab, font=FT) + 8) for lab, im in sc]; return sc, ws, sum(ws) + 18 * (len(ws) - 1)
        sc, ws, tot = layout(unit)
        while tot > cw - 30: unit *= .94; FT = font(max(16, int(FT.size * .97)), True); sc, ws, tot = layout(unit)
        x = x0 + (cw - tot) / 2
        d.line([(x0 + 10, base), (x0 + cw - 10, base)], fill=(205, 210, 225), width=2)
        for (lab, im), w in zip(sc, ws):
            Pg.paste(im, (int(x + (w - im.width) / 2), int(base - im.height)), im); units.append(unit)
            tw = d.textlength(lab, font=FT); d.text((x + w / 2 - tw / 2, base + 8), lab, fill=(60, 50, 110), font=FT); x += w + 18
    if unit_fixed is None: return sheet(sid, out, min(units))           # 2e passage : la plus petite échelle pour toutes les cases
    Pg.save(os.path.join(out, f'planche2-{sid}.png')); return names
if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    for sid in (sys.argv[2:] or SHEETS): print(sid, '→', sheet(sid, out))
