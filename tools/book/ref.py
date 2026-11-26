"""Planche de référence pour UNE page du livre : les personnages à leur VRAIE taille les uns par rapport aux autres, avec leur nom.
Usage : python3 tools/book/ref.py <sortie.png> perso1 perso2 ...   (noms : voir CAST)"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
import planche as P
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
# nom affiché, image, hauteur par rapport à Rose (= 1)
CAST = {
 'rose': ('Rose', P.ROSE, 1.0), 'ziggy': ('Ziggy', P.hero(0, 0), .95), 'filou': ('Filou', P.hero(2, 1), .95), 'titan': ('Titan', P.hero(2, 2), .95),
 'glouglou': ('Glouglou', P.alien('glouglou_f1'), .5), 'boing': ('Boing', P.alien('boing_f1'), .58), 'zap': ('Zap', P.alien('zap_f1'), .55),
 'bidou': ('Gros Bidou', P.alien('bidou_f1'), .72), 'zigzag': ('Zigzag', P.alien('zigzag_f1'), .55),
 'herisson': ('hedgehog', P.mon(0), .42), 'limon': ('slime', P.mon(1), .4), 'chauvesouris': ('bat', P.mon(2), .38), 'golem': ('stone golem', P.mon(3), .5),
 'ami1': ('friend', P.mon(5), .42), 'ami2': ('friend', P.mon(6), .4), 'ami3': ('friend', P.mon(7), .4), 'ami4': ('friend', P.mon(8), .5),
 'flamme': ('little flame', P.FLAME, .36),
}
def board(out, names):
    W, H, base = 1800, 1000, 900; maxh = 760
    items = [CAST[n] for n in names]
    sc = [(lab, im.resize((max(1, int(im.width * maxh * k / im.height)), int(maxh * k)))) for lab, im, k in items]
    FT = ImageFont.truetype(FB, 30); dd = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    slot = lambda lab, im: max(im.width, dd.textlength(lab, font=FT) + 10)
    tot = sum(slot(l, i) for l, i in sc) + 30 * (len(sc) - 1)
    while tot > W - 60:
        f = (W - 60) / tot * .98; sc = [(lab, im.resize((max(1, int(im.width * f)), max(1, int(im.height * f))))) for lab, im in sc]
        FT = ImageFont.truetype(FB, max(16, int(FT.size * f))); tot = sum(slot(l, i) for l, i in sc) + 30 * (len(sc) - 1)
    B = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(B); x = (W - tot) // 2
    d.line([(30, base), (W - 30, base)], fill=(200, 200, 210), width=3)
    x = (W - tot) // 2
    for lab, im in sc:
        sw = slot(lab, im); B.paste(im, (int(x + (sw - im.width) / 2), base - im.height), im); tw = d.textlength(lab, font=FT)
        d.text((x + sw / 2 - tw / 2, base + 22), lab, fill=(40, 30, 90), font=FT); x += sw + 30
    d.text((30, 20), 'CHARACTER REFERENCE — true relative sizes (do not copy this sheet, no text in the final image)', fill=(120, 120, 140), font=ImageFont.truetype(FB, 26))
    top = base - max(im.height for _, im in sc) - 60; B = B.crop((0, max(0, top), W, H)); d = ImageDraw.Draw(B)
    d.text((30, 12), 'CHARACTER REFERENCE — true relative sizes (do not copy this sheet, no text in the final image)', fill=(120, 120, 140), font=ImageFont.truetype(FB, 26))
    B.save(out)
if __name__ == '__main__': board(sys.argv[1], sys.argv[2:])
