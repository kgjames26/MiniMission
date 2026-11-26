from PIL import Image, ImageSequence; import numpy as np, json
from scipy import ndimage
U='/mnt/user-data/uploads/'
G={'choix':'530e08df','stationnaire':'fd12a3c4','vol_lent':'a8143323','vol_rapide':'e45a685f','marche':'16d79543'}
info={}
for n,f in G.items():
    frames=[x.convert('RGB') for x in ImageSequence.Iterator(Image.open(U+f+'-image.gif'))]
    outs=[]
    for i,fr in enumerate(frames):
        a=np.asarray(fr).astype(float); h,w,_=a.shape
        bg=np.median(np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3),a[:,:6].reshape(-1,3),a[:,-6:].reshape(-1,3)]),0)
        d=np.sqrt(((a-bg)**2).sum(2))
        near=d<30
        lab,_=ndimage.label(near); border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
        bgm=np.isin(lab,list(border))
        al=np.where(bgm,0.,255.)
        edge=bgm&ndimage.binary_dilation(~bgm,iterations=2); al[edge]=np.clip((d[edge]-8)/30*255,0,255)
        fg=al>60; l2,nn=ndimage.label(fg)
        if nn>1:
            sz=ndimage.sum(fg,l2,range(1,nn+1)); keep=np.isin(l2,1+np.where(sz>=sz.max()*0.004)[0]); al[~ndimage.binary_dilation(keep,iterations=2)]=0
        # dé-teinter le bord (retirer la couleur du fond)
        A=(al/255)[...,None]; rgb=np.where(A>0.02,(a-bg*(1-A))/np.maximum(A,.02),a); rgb=np.clip(rgb,0,255)
        outs.append(np.dstack([rgb,al]).astype(np.uint8))
    # boîte commune à toute l'animation (garde le mouvement interne)
    union=np.zeros(outs[0].shape[:2],bool)
    for o in outs: union|=o[...,3]>40
    ys,xs=np.nonzero(union); bb=(xs.min(),ys.min(),xs.max()+1,ys.max()+1)
    for i,o in enumerate(outs): Image.fromarray(o,'RGBA').crop(bb).save(f'{n}_{i:02d}.png')
    info[n]={'bb':[int(v) for v in bb],'n':len(outs)}
    print(n,bb)
json.dump(info,open('info.json','w'))
