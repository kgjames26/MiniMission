from PIL import Image; import numpy as np, json, os
S={'marche':.964,'stationnaire':.93,'vol_lent':.82,'vol_rapide':1.02}
PL={'marche':(209,20),'stationnaire':(197,24),'vol_lent':(198,29),'vol_rapide':(321,25)}
NAME={'marche':'rose_walk','stationnaire':'rose_hover','vol_lent':'rose_fly','vol_rapide':'rose_dash'}
FINAL=.70; FEET=424*.964; STEP=3
frames={}; ims=[]
for n,s in S.items():
    k=s*FINAL; px,py=PL[n]
    for j,i in enumerate(range(0,30,STEP)):
        im=Image.open(f'{n}_{i:02d}.png'); W,H=im.size; im=im.resize((round(W*k),round(H*k)),Image.LANCZOS)
        ax=px*k; ay=(py+FEET/s)*k if n!='marche' else 444*k
        ims.append((f'{NAME[n]}{j}',im,ax,ay))
for j,i in enumerate(range(0,30,STEP)):
    im=Image.open(f'choix_{i:02d}.png'); k=.6; im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
    ims.append((f'rose_pick{j}',im,im.width/2,im.height))
Wt=2048; x=y=rowh=0; place={}
for nm,im,ax,ay in ims:
    if x+im.width+2>Wt: x=0; y+=rowh+2; rowh=0
    place[nm]=(x,y); x+=im.width+2; rowh=max(rowh,im.height)
At=Image.new('RGBA',(Wt,y+rowh))
for nm,im,ax,ay in ims:
    X,Y=place[nm]; At.alpha_composite(im,(X,Y)); frames[nm]={'x':X,'y':Y,'w':im.width,'h':im.height,'ax':round(ax,1),'ay':round(ay,1)}
At.save('rose.webp','WEBP',quality=82,method=6); json.dump(frames,open('rose.json','w'),separators=(',',':'))
print(At.size, os.path.getsize('rose.webp')//1024,'Ko', len(frames))
