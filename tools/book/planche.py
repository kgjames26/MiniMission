"""Planches de 4 pages du livre pour le générateur d'images : chaque case montre les personnages modèles + la consigne.
Usage : python3 tools/book/planche.py <dossier de sortie> [livre ...]"""
import json, sys, textwrap, os
from PIL import Image, ImageDraw, ImageFont
R = os.path.join(os.path.dirname(__file__), '..', '..')
A = lambda p: os.path.join(R, 'assets', p)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s, b=False: ImageFont.truetype(FB if b else F, s)
HERO = Image.open(A('heroes-hd.webp')).convert('RGBA'); HW, HH = HERO.width // 4, HERO.height // 3
def hero(col, row): return tight(HERO.crop((col * HW, row * HH, (col + 1) * HW, (row + 1) * HH)))
MON = Image.open(A('monsters.webp')).convert('RGBA')
def tight(im): bb = im.getbbox(); return im.crop(bb) if bb else im
def mon(i): return tight(MON.crop(((i % 5) * 400, (i // 5) * 264, (i % 5) * 400 + 400, (i // 5) * 264 + 264)))
AL = Image.open(A('aliens.webp')).convert('RGBA'); AJ = json.load(open(A('aliens.json')))
def alien(k): q = AJ[k]; return AL.crop((q['x'], q['y'], q['x'] + q['w'], q['y'] + q['h']))
FLAME = Image.open(A('friend-flame.webp')).convert('RGBA')
ROSE = None
for p in ['/mnt/user-data/uploads/530e08df-image.gif']:
    if os.path.exists(p): g = Image.open(p); g.seek(0); ROSE = g.convert('RGBA')
if ROSE is None: ROSE = Image.open(A('rose-card.webp')).convert('RGBA')
def crop_white(im):
    px = im.convert('RGB'); bg = Image.new('RGB', px.size, (255, 255, 255)); from PIL import ImageChops
    d = ImageChops.difference(px, bg).convert('L').point(lambda v: 255 if v > 18 else 0); bb = d.getbbox(); return im.crop(bb) if bb else im
ROSE = crop_white(ROSE)
def note(text, w=300, h=420, col=(255, 240, 200)):
    im = Image.new('RGBA', (w, h), col + (255,)); d = ImageDraw.Draw(im); d.rectangle([2, 2, w - 3, h - 3], outline=(150, 110, 40), width=4)
    y = 20
    for line in textwrap.wrap(text, 13): d.text((16, y), line, fill=(90, 60, 20), font=font(34, True)); y += 44
    return im
GRUMPY = [mon(i) for i in (0, 1, 2, 3, 10, 12)]
HAPPY = [mon(i) for i in (5, 6, 7, 8, 11, 13)]
C = {
  'aliens': [alien(k) for k in ('glouglou_f1', 'boing_f1', 'zap_f1', 'bidou_f1', 'zigzag_f1')],
  'farfouille': [note('Capitaine Farfouille : utiliser SA fiche de personnage')],
  'monsters': GRUMPY[:4], 'happy': HAPPY[:4] + [FLAME],
  'heroes': [hero(0, 0), hero(2, 1), hero(2, 2)],
  'rose_cool': [note('Rose en TENUE COOL (sa fiche), PAS d’exo-squelette', 330, 460, (255, 225, 240)), ROSE],
  'rose': [ROSE], 'saucer': [alien('zap_f1')],
  'lune3': [alien('glouglou_f1'), alien('boing_f1'), alien('zap_f1')], 'mars2': [alien('bidou_f1'), alien('zigzag_f1')],
}
STYLE = ('Children’s picture book. Make ONE image split into a 2x2 grid of 4 separate illustrations (each 4:3, thin white gutters). '
         'In each panel, REPLACE the models and the text with a finished, full-bleed illustration of the scene written in that panel. '
         'Keep every character exactly as in its model (face, colors, proportions). Soft cartoon style, bold dark outlines, warm bright colors. '
         'NO text, no letters, no speech bubbles, no panel numbers. The picture alone must let a 4-year-old understand what happens.')
BOOKS = {
 'prologue': [
  (['aliens'], 'On a small icy comet floating among the stars, the five cute aliens sit in a row with their chins in their hands, bored. Empty space all around, a tiny blue Earth far away.'),
  (['farfouille', 'aliens'], 'Captain Farfouille raises one finger, a glowing light bulb above his head (big idea!). The aliens load two wooden crates into their flying saucer: one crate full of grumpy little monsters peeking out, one overflowing with sparkly purple powder.'),
  (['monsters', 'saucer'], 'Evening over a big city park: a wooden crate falls from the sky with a sparkling tail, like a shooting star. Far above, a tiny flying saucer. On the grass the crate has burst open and small monsters roll out, covered in purple glitter.'),
  (['monsters', 'rose_cool', 'heroes'], 'Left half: the grumpy little monsters sneeze purple glitter, pout and run off toward far-away city skylines. Right half: in her garden workshop full of gadgets, Rose talks into a big radio while Ziggy, Filou and Titan run toward her.'),
 ],
 'c0a': [
  (['monsters'], 'A Paris street, the Eiffel Tower behind. A bakery with croissants in the window. Two grumpy little monsters with a small purple glitter cloud on their noses run off holding croissants; the baker is surprised.'),
  (['heroes', 'rose_cool'], 'Rose appears on a small round radio screen in a corner. Ziggy runs along a wide avenue, Filou swings between rooftops on his web, Titan heads to a construction site: three directions, Eiffel Tower behind.'),
  (['heroes', 'happy'], 'A happy picnic on a red-and-white checkered blanket at the foot of the Eiffel Tower: Ziggy, Filou, Titan and the little monsters, now smiling, share croissants and strawberries.'),
  (['saucer'], 'Night in Paris: the Eiffel Tower sparkles with golden lights. High up behind it, a tiny flying saucer sneaks away; the alien at the window giggles.'),
 ],
 'lune_a+c': [
  (['rose'], 'Rose in her exosuit lands softly on the grey Moon, kicking up a little dust. Huge blue Earth in the black starry sky. She makes light, bouncy steps.'),
  (['lune3', 'monsters'], 'Behind a grey moon rock, small cages hold sad little monsters. Around them, Glouglou, Boing and Zap (in his saucer) stick their tongues out at Rose.'),
  (['rose', 'lune3', 'happy'], 'Rose shoots big shiny soap bubbles: the three aliens float away inside bubbles, arms crossed, pouting. The freed little monsters jump for joy around Rose.'),
  (['rose'], 'Close-up: an old astronaut boot print in the grey moon dust. Rose carefully puts her boot right next to it. Blue Earth in the sky.'),
 ],
 'mars_a+c': [
  (['rose'], 'Rose in her exosuit on the red rocky desert of Mars. Caramel sky with two small potato-shaped moons. Swirling dust devils dance like spinning tops.'),
  (['mars2', 'rose'], 'Gros Bidou (orange, arms crossed, sulking) and Zigzag (purple) blowing two small bubbles at Rose. Rose laughs and shows her own much bigger bubble.'),
  (['rose', 'mars2', 'happy'], 'Rose with a little white six-wheeled rover robot and a tiny Mars helicopter, surrounded by the freed little monsters. In the sky, Gros Bidou floats away inside a big bubble.'),
  (['rose'], 'A blue sunset on Mars behind a gigantic flat volcano. Rose and the little rover robot watch it, seen from behind.'),
 ],
}
NAMES = {'prologue': ['prologue-1', 'prologue-2', 'prologue-3', 'prologue-4'], 'c0a': ['c0a-1', 'c0a-2', 'c0c-1', 'c0c-2'],
         'lune_a+c': ['lune_a-1', 'lune_a-2', 'lune_c-1', 'lune_c-2'], 'mars_a+c': ['mars_a-1', 'mars_a-2', 'mars_c-1', 'mars_c-2']}
def planche(bid, out):
    W, H, HEAD, G = 2400, 1880, 120, 14
    cw, ch = (W - G * 3) // 2, (H - HEAD - G * 3) // 2
    P = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(P)
    y = 10
    for line in textwrap.wrap(STYLE, 150): d.text((G, y), line, fill=(40, 30, 90), font=font(19, True)); y += 24
    for k, (cast, prompt) in enumerate(BOOKS[bid]):
        x0, y0 = G + (k % 2) * (cw + G), HEAD + G + (k // 2) * (ch + G)
        d.rectangle([x0, y0, x0 + cw, y0 + ch], fill=(244, 248, 255), outline=(180, 190, 220), width=3)
        d.text((x0 + 16, y0 + 10), f'{k + 1}', fill=(240, 112, 44), font=font(46, True))
        ty = y0 + 14
        for line in textwrap.wrap(prompt, 74): d.text((x0 + 70, ty), line, fill=(30, 30, 50), font=font(25)); ty += 32
        imgs = [im for c in cast for im in C[c]]
        top, bot = ty + 14, y0 + ch - 12; ah = bot - top; aw = cw - 24
        # on range les modèles sur 1, 2 ou 3 rangées : celle qui les montre le plus grand
        best = None
        for rows in (1, 2, 3):
            per = -(-len(imgs) // rows); groups = [imgs[i * per:(i + 1) * per] for i in range(rows)]; groups = [g for g in groups if g]
            rh = (ah - 12 * (len(groups) - 1)) / len(groups)
            f = min(rh / max(im.height for im in g) if True else 1 for g in groups for _ in [0])
            f = min(min(rh / im.height for im in g) for g in groups)
            for g in groups:
                wsum = sum(im.width * f for im in g) + 12 * (len(g) - 1)
                if wsum > aw: f = min(f, (aw - 12 * (len(g) - 1)) / sum(im.width for im in g))
            if not best or f > best[0]: best = (f, groups, rh)
        f, groups, rh = best
        yy = top
        for g in groups:
            sc = [im.resize((max(1, int(im.width * f)), max(1, int(im.height * f)))) for im in g]
            tot = sum(i.width for i in sc) + 12 * (len(sc) - 1); xx = x0 + 12 + (aw - tot) // 2
            for im in sc: P.paste(im, (xx, int(yy + rh - im.height)), im); xx += im.width + 12
            yy += rh + 12
    P.save(os.path.join(out, f'planche-{bid}.png')); return P
if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    for bid in (sys.argv[2:] or BOOKS): planche(bid, out); print('planche', bid, '→', NAMES[bid])
