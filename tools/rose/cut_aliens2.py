from PIL import Image; import numpy as np, cv2, json
from scipy import ndimage
src=np.asarray(Image.open('page2.png').convert('RGB'))
XS=[(312,562),(575,826),(836,1089)]; ROWS=[(477,702),(844,1071)]
NAMES=['bidou','zigzag']; SUF=['f1','f2','ami']
meta={}
for (y0,gy),nm in zip(ROWS,NAMES):
    for (x0,x1),sf in zip(XS,SUF):
        c=src[y0+3:gy-1, x0+4:x1-4].copy().astype(np.uint8); h,w,_=c.shape
        c[:30,:]=255; c[:, :4]=255; c[:, -4:]=255                   # étiquette et pointillés
        a=c.astype(float); white=np.sqrt(((a-252)**2).sum(2))
        R,G,B=[c[...,i].astype(int) for i in range(3)]
        near=white<38
        band=np.zeros((h,w),bool); band[h-8:,:]=True; near|=band
        l,_=ndimage.label(near); border=set(np.unique(np.concatenate([l[0],l[-1],l[:,0],l[:,-1]])))-{0}
        bg=np.isin(l,list(border))
        # ombre grise au sol : gris clair peu saturé près du bas
        sat=c.max(2).astype(int)-c.min(2).astype(int); lowband=np.zeros((h,w),bool); lowband[int(h*.8):,:]=True
        bg|=lowband&(sat<45)&(white<150)
        al=np.where(bg,0.,255.); e=bg&ndimage.binary_dilation(~bg,iterations=2); al[e]=np.clip((white[e]-10)/30*255,0,255)
        fg=al>60; l2,n=ndimage.label(fg)
        if n>1:
            sz=ndimage.sum(fg,l2,range(1,n+1)); keep=[1+int(np.argmax(sz))]
            al[~ndimage.binary_dilation(np.isin(l2,keep),iterations=2)]=0
        im=Image.fromarray(np.dstack([a,al]).astype(np.uint8),'RGBA'); bb=im.getbbox(); im=im.crop(bb)
        im.save(f'{nm}_{sf}.png'); meta[f'{nm}_{sf}']={'w':im.width,'h':im.height,'cx':(x0+4+bb[0]+im.width/2)-(x0+x1)/2,'feet':(gy-1-(y0+3))-bb[3]}
json.dump(meta,open('meta.json','w'),indent=0)
sh=Image.new('RGB',(3*280,2*250),(40,40,90))
for i,nm in enumerate(NAMES):
    for j,sf in enumerate(SUF):
        im=Image.open(f'{nm}_{sf}.png'); sh.paste(im,(int(j*280+140-im.width/2),int(i*250+240-im.height)),im)
sh.save('check.png'); print(meta)
