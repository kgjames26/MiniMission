"""Prépare les 25 images du livre pour Gemini, une par une : une fiche de personnages (vraies tailles) + une consigne.
Usage : python3 tools/book/gem.py <dossier>  → <nom>-ref.png pour chaque image et prompts.json"""
import sys, os, json
from PIL import Image, ImageChops
sys.path.insert(0, os.path.dirname(__file__))
import ref, planche3 as P3
D = os.path.dirname(__file__)

def detour(im):
    """Fond blanc → transparent, puis recadrage serré."""
    im = im.convert('RGBA'); px = im.convert('RGB')
    m = ImageChops.difference(px, Image.new('RGB', px.size, (255, 255, 255))).convert('L').point(lambda v: 255 if v > 24 else 0)
    im.putalpha(m); bb = m.getbbox(); return im.crop(bb) if bb else im

ROSE = Image.open(os.path.join(D, 'refs', 'rose-sheet.webp')); FARF = Image.open(os.path.join(D, 'refs', 'farfouille-sheet.webp'))
rw = ROSE.width // 4
ref.CAST['rose_cool'] = ('Rose (inventor outfit)', detour(ROSE.crop((0, 0, rw, ROSE.height))), 1.0)
ref.CAST['rose'] = ('Rose (space suit, helmet ON)', detour(ROSE.crop((2 * rw, 0, 3 * rw, ROSE.height))), 1.05)
ref.CAST['farfouille'] = ('Captain Farfouille', detour(FARF.crop((0, 0, int(FARF.width * .36), FARF.height))), .75)

HEAD = ("Children's picture-book illustration: ONE wide 16:9 image, full bleed. "
        "The attached sheet shows each character with its exact look and TRUE relative size: draw them exactly like that "
        "(faces, colours, outfits, proportions, sizes), each character once. Do not copy the sheet itself, no labels. "
        "Style: bright glossy cartoon with thick dark outlines, rich detailed colourful background, warm light, depth, "
        "big expressive faces that a 4-year-old understands without words. "
        "It is one continuous scene whose LEFT half and RIGHT half show two moments of the story. "
        "Keep faces and important things in the middle band of the height (top and bottom may be cropped). "
        "NO text, no letters, no numbers, no speech bubbles. Scene: ")

def run(out):
    os.makedirs(out, exist_ok=True); jobs = []
    for name, cast, prompt in P3.IMGS:
        prompt = prompt.replace('(his sheet)', '(as on the sheet)').replace(P3.R, 'Rose in her space suit with her round glass helmet ON, as on the sheet')
        ref.board(os.path.join(out, name + '-ref.png'), cast)
        jobs.append({'name': name, 'ref': name + '-ref.png', 'prompt': HEAD + prompt})
    json.dump(jobs, open(os.path.join(out, 'prompts.json'), 'w'), ensure_ascii=False, indent=1)
    print(len(jobs), 'images')

if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else '.')
