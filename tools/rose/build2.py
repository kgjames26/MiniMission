# Planche de Rose : chaque animation mise à la même échelle (taille du casque → pieds) et calée sur le sol.
from PIL import Image; import json, os
FINAL=.5
# nom, fichiers, échelle, (x du casque, y du sol dans le GIF découpé), images gardées
A=[('rose_idle','statvol',.88,(191,538),range(0,10)),
   ('rose_lift','statvol',.88,(192,538),range(10,30)),     # statique -> vol (à l'envers : vol -> statique)
   ('rose_walk','marche',.964,(202,442),range(0,30)),
   ('rose_up','decollage',.99,(201,500),range(12,30)),      # marche -> vol
   ('rose_down','atterrissage',.91,(190,511),range(10,30)), # vol -> marche
   ('rose_win','victoire',.873,(193,540),range(0,30)),
   ('rose_pick','choix',.6/FINAL*.5,None,range(0,30))]
FEET=424*.964
AIR=[('rose_hover','stationnaire',.93,(197,24),range(0,30)),('rose_fly','vol_lent',.82,(198,29),range(0,30)),('rose_dash','vol_rapide',1.02,(321,25),range(0,30))]
import numpy as np
# Dans le GIF « statique -> vol » (et un peu dans la victoire), Rose est plus longiligne : tête plus petite pour la même taille.
# On agrandit l'image pour que la tête ait la même taille qu'ailleurs, puis on tasse doucement le bas du corps
# pour garder la même hauteur casque -> pieds : la silhouette rejoint celle des autres animations.
FIX={'statvol':(1.16,538),'victoire':(1.08,540)}
def refit(im,src,gy):
    if src not in FIX: return im, gy
    g,gy0=FIX[src]; a=np.asarray(im); al=a[...,3]>40; ys=np.where(al.any(1))[0]; top=ys[0]
    W,H=im.size; big=im.resize((round(W*g),round(H*g)),Image.LANCZOS); B=np.asarray(big)
    t2=top*g; ground2=gy0*g; Hf=gy0-top                     # hauteur voulue casque -> sol
    split=t2+(ground2-t2)*.42                               # au-dessus : tête et épaules intactes
    keep=split-t2; rest=Hf-keep; src_rest=ground2-split     # en dessous : tassé pour retomber sur le sol
    out_h=round(top+Hf+(B.shape[0]-ground2)*(rest/src_rest)+2)
    ys_out=np.arange(out_h); ysrc=np.where(ys_out<top+keep, t2+(ys_out-top), split+(ys_out-top-keep)*src_rest/rest)
    ysrc=np.clip(ysrc,0,B.shape[0]-1)
    y0=np.floor(ysrc).astype(int); y1=np.minimum(y0+1,B.shape[0]-1); w=(ysrc-y0)[:,None,None]
    O=(B[y0]*(1-w)+B[y1]*w).astype(np.uint8)
    xoff=round((big.width-W)/2); O=O[:,xoff:xoff+W] if big.width>=W else O
    return Image.fromarray(O,'RGBA'), gy0
ims=[]
for nm,src,s,anc,rg in A:
    k=s*FINAL
    for j,i in enumerate(rg):
        im=Image.open(f'{src}_{i:02d}.png')
        if anc: im,_=refit(im,src,anc[1])
        im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
        ax,ay=(anc[0]*k,anc[1]*k) if anc else (im.width/2,im.height)
        ims.append((f'{nm}{j}',im,ax,ay))
for nm,src,s,(px,py),rg in AIR:
    k=s*FINAL
    for j,i in enumerate(rg):
        im=Image.open(f'{src}_{i:02d}.png'); im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
        ims.append((f'{nm}{j}',im,px*k,(py+FEET/s)*k))
Wt=2048; x=y=rowh=0; place={}
for nm,im,ax,ay in ims:
    if x+im.width+2>Wt: x=0; y+=rowh+2; rowh=0
    place[nm]=(x,y); x+=im.width+2; rowh=max(rowh,im.height)
At=Image.new('RGBA',(Wt,y+rowh)); fr={}
for nm,im,ax,ay in ims:
    X,Y=place[nm]; At.alpha_composite(im,(X,Y)); fr[nm]={'x':X,'y':Y,'w':im.width,'h':im.height,'ax':round(ax,1),'ay':round(ay,1)}
# hauteur du casque au-dessus du sol pour chaque image (sert à raccorder les animations)
for nm,f in fr.items():
    bb=At.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])).getbbox(); f['top']=round(f['ay']-bb[1],1)
At.save('rose.webp','WEBP',quality=76,method=6); json.dump(fr,open('rose.json','w'),separators=(',',':'))
print(At.size, os.path.getsize('rose.webp')//1024,'Ko', len(fr))
for n in ['rose_idle0','rose_lift0','rose_lift9','rose_walk0','rose_up0','rose_up8','rose_hover0','rose_down0','rose_down9','rose_win0']: print(n, fr[n]['top'])
