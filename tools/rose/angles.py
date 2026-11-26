# Ajoute à rose.json l'inclinaison de Rose dans chaque image (« ang », en degrés, négatif = penchée vers l'avant).
# Mesure : centre de la plaque orange du casque → centre de la masse du bas du corps (sans les flammes).
from PIL import Image; import numpy as np, json, math, sys
J = sys.argv[1] if len(sys.argv) > 1 else 'assets/rose.json'; W = J.replace('.json', '.webp')
d = json.load(open(J)); A = np.asarray(Image.open(W).convert('RGBA')).astype(int)
for k, f in d.items():
    if k.startswith('rose_pick'): continue
    a = A[f['y']:f['y']+f['h'], f['x']:f['x']+f['w']]; r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    yy = np.mgrid[0:a.shape[0], 0:a.shape[1]][0]
    o = (al > 200) & (r > 200) & (g > 100) & (g < 170) & (b < 90)
    if not o.any(): f['ang'] = 0; continue
    ys, xs = np.nonzero(o); top = ys.min(); m = o & (yy < top + 12); ys, xs = np.nonzero(m); hx, hy = xs.mean(), ys.mean()
    suit = (al > 200) & (((b > r + 30) & (b > 120)) | ((r > 185) & (g > 185) & (b > 185))) & ~((r > 200) & (g > 150) & (b < 120))
    body = suit & (yy > hy + 70)
    if body.sum() < 50: f['ang'] = 0; continue
    ys2, xs2 = np.nonzero(body)
    f['ang'] = round(math.degrees(math.atan2(xs2.mean() - hx, ys2.mean() - hy)), 1)
json.dump(d, open(J, 'w'), separators=(',', ':'))
for p in ['idle', 'walk', 'lift', 'up', 'down', 'hover', 'fly', 'dash', 'win']:
    v = [d[k]['ang'] for k in d if k.startswith('rose_' + p) and k[len('rose_' + p):].isdigit()]
    print(p, 'début', v[0], 'fin', v[-1], 'moy', round(sum(v) / len(v), 1))
