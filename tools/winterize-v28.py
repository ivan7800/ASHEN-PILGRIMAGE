"""Rework an original concept painting from this project into two cold alpine backdrops.
Source is bundled as an original project image; no third-party game assets.
"""
from PIL import Image,ImageDraw,ImageEnhance,ImageFilter,ImageOps
import numpy as np,random
from pathlib import Path
root=Path(__file__).resolve().parent.parent
src=root/'art-source'/'summit-v28'/'concepto-cripta-original.png'
if not src.is_file():raise SystemExit('Missing original art')
art=root/'art-source'/'summit-v28';art.mkdir(exist_ok=True,parents=True)
(art/'concepto-cripta-original.png').write_bytes(src.read_bytes())
base=Image.open(src).convert('RGB')
W,H=1440,810
for k,name in enumerate(['room-summitpass-v28.webp','room-silentcloister-v28.webp']):
 im=base if k else ImageOps.mirror(base)
 im=ImageOps.fit(im,(W,H),method=Image.Resampling.LANCZOS,centering=(.64 if k else .38,.54))
 a=np.array(im).astype(np.float32);r,g,b=a[:,:,0].copy(),a[:,:,1].copy(),a[:,:,2].copy();lum=.26*r+.59*g+.15*b
 mask=(r>g*1.24)&(r>b*1.12)&(r>55)
 # Convert crimson eclipse, ivy and banners to pale icy silver-blue with subtle ember remnant.
 a[:,:,0]=np.where(mask,.57*lum+15,r*.69+8)
 a[:,:,1]=np.where(mask,.9*lum+26,g*.92+9)
 a[:,:,2]=np.where(mask,1.16*lum+35,b*1.13+16)
 a=np.clip(a,0,255).astype('uint8')
 out=Image.fromarray(a,'RGB')
 out=ImageEnhance.Contrast(out).enhance(1.08)
 # atmospheric glacial veil, lighter in distance and less in the combat band
 veil=Image.new('RGBA',(W,H));d=ImageDraw.Draw(veil,'RGBA')
 d.polygon([(0,0),(W,0),(W,400),(0,470)],fill=(95,137,173,17 if k else 31))
 d.rectangle((0,H-95,W,H),fill=(2,13,21,78))
 rng=random.Random(2339+k)
 for i in range(550):
  x=rng.randint(0,W);y=rng.randint(20,680);sz=rng.choice([1,1,2,3])
  d.line((x,y,x-3,y+7),fill=(211,236,245,rng.randint(20,95)),width=sz)
 out=Image.alpha_composite(out.convert('RGBA'),veil).convert('RGB')
 out.save(root/'assets'/name,'WEBP',quality=90,method=6)
print('Prepared winter-graded painted gothic backgrounds',len(list(art.iterdir())))
