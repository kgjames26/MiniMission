"""Découpe une planche 2x2 rendue par le générateur d'images en 4 pages du livre.
Usage : python3 tools/book/cut.py <image> <nom1> <nom2> <nom3> <nom4>   (ex. lune_a-1 lune_a-2 lune_c-1 lune_c-2)
Les pages vont dans assets/book/<nom>.webp, en 1200x900 (4:3)."""
import sys, os
import numpy as np
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); a = np.asarray(im).astype(int); H, W, _ = a.shape
def gutter(axis, n):   # la ligne la plus claire près du milieu = la marge blanche entre deux cases
    prof = a.mean(axis=(1 - axis, 2)) if axis == 0 else a.mean(axis=(0, 2)); mid = n // 2; r = n // 8
    return mid - r + int(np.argmax(prof[mid - r: mid + r]))
gy, gx = gutter(0, H), gutter(1, W)
out = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'book'); os.makedirs(out, exist_ok=True)
boxes = [(0, 0, gx, gy), (gx, 0, W, gy), (0, gy, gx, H), (gx, gy, W, H)]
for name, (x0, y0, x1, y1) in zip(sys.argv[2:6], boxes):
    c = im.crop((x0, y0, x1, y1)); g = np.asarray(c).astype(int).sum(2)
    rows = np.where((g < 735).mean(1) > .5)[0]; cols = np.where((g < 735).mean(0) > .5)[0]   # on retire le blanc autour
    if len(rows) and len(cols): c = c.crop((cols[0], rows[0], cols[-1] + 1, rows[-1] + 1))
    w, h = c.size; t = 4 / 3                                      # recadrage 4:3 au centre
    if w / h > t: nw = int(h * t); c = c.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w / t); c = c.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    c.resize((1200, 900), Image.LANCZOS).save(os.path.join(out, name + '.webp'), quality=86); print('→', name)
