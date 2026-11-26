from PIL import Image; import numpy as np, cv2, json
from scipy import ndimage
src=np.asarray(Image.open('/mnt/user-data/uploads/7d71223b-image.jpg').convert('RGB'))
XS=[(464,826),(862,1226),(1263,1626)]; ROWS=[(786,1067),(1293,1573),(1799,2080)]
NAMES=['glouglou','boing','zap']; SUF=['f1','f2','ami']
meta={}
for (y0,gy),nm in zip(ROWS,NAMES):
    for (x0,x1),sf in zip(XS,SUF):
        c=src[y0+4:gy-2, x0+5:x1-5].copy().astype(np.uint8); h,w,_=c.shape
        R,G,B=[c[...,i].astype(int) for i in range(3)]
        orange=(R>150)&(G>70)&(G<180)&(B<120)&(R-B>70)
        lab=np.zeros((h,w),bool); lab[:42,:]=True                 # étiquette en haut de la case
        txt=ndimage.binary_dilation(orange&lab,iterations=3)
        dashed=np.zeros((h,w),bool); dashed[:6,:]=True; dashed[:,:6]=True; dashed[:,-6:]=True
        c=cv2.inpaint(c,((txt|dashed)&(np.abs(c.astype(int)-255).sum(2)>40)).astype(np.uint8)*255,4,cv2.INPAINT_TELEA)
        a=c.astype(float); white=np.sqrt(((a-252)**2).sum(2))
        near=white<40
        gl=(G-R>15)&(G-B>15); band=np.zeros((h,w),bool); band[h-10:,:]=True
        near|=band&(gl|(white<90))                          # ligne verte du sol
        l,_=ndimage.label(near); border=set(np.unique(np.concatenate([l[0],l[-1],l[:,0],l[:,-1]])))-{0}
        bg=np.isin(l,list(border))
        al=np.where(bg,0.,255.); e=bg&ndimage.binary_dilation(~bg,iterations=2); al[e]=np.clip((white[e]-12)/30*255,0,255)
        fg0=al>60; l0,n0=ndimage.label(fg0)                # étiquette « FARCEUR · pose 1 » : petits morceaux tout en haut
        body=np.zeros((h,w),bool)
        for i,sl in enumerate(ndimage.find_objects(l0),1):
            if sl[0].stop>44: body|=l0==i
        top=np.zeros((h,w),bool); top[:46,:]=True
        al[top&~ndimage.binary_dilation(body,iterations=3)]=0
        fg=al>60; l2,n=ndimage.label(fg)
        if n>1:
            sz=ndimage.sum(fg,l2,range(1,n+1)); keep=1+np.where(sz>=sz.max()*0.01)[0]
            if nm=='zap' and sf=='f2': keep=[1+int(np.argmax(sz))]           # la bulle lancée sera dessinée par le jeu
            al[~ndimage.binary_dilation(np.isin(l2,keep),iterations=2)]=0
        im=Image.fromarray(np.dstack([a,al]).astype(np.uint8),'RGBA'); bb=im.getbbox(); im=im.crop(bb)
        im.save(f'{nm}_{sf}.png'); meta[f'{nm}_{sf}']={'w':im.width,'h':im.height,'cx':(x0+5+bb[0]+im.width/2)-(x0+x1)/2,'feet':(gy-2-(y0+4))-bb[1]}
json.dump(meta,open('meta.json','w'),indent=0)
# planche de contrôle
sh=Image.new('RGB',(3*380,3*300),(40,40,90))
for i,nm in enumerate(NAMES):
    for j,sf in enumerate(SUF):
        im=Image.open(f'{nm}_{sf}.png'); m=meta[f'{nm}_{sf}']; sh.paste(im,(int(j*380+190-im.width/2+m['cx']),int(i*300+290-m['feet'])),im)
sh.save('check.png'); print(meta)
