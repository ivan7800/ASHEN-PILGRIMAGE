from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import random, math
root=Path(__file__).resolve().parents[1]
out=root/'assets'; out.mkdir(exist_ok=True)
source=root/'art-source/premium-v32';source.mkdir(parents=True,exist_ok=True)
rng=random.Random(40432)
# Subtle hand-crafted stone tile art at half working resolution and nearest-neighbor output.
w,h=128,64
im=Image.new('RGBA',(w,h),(22,29,33,255));d=ImageDraw.Draw(im)
# Shadow under the walking surface; consistent line across tiles.
d.rectangle((0,0,w,5),fill=(101,94,83,255))
d.line([(0,1),(w,1)],fill=(182,162,131,255),width=1)
d.line([(0,5),(w,5)],fill=(50,56,56,255),width=2)
# Rough-hewn horizontal stone courses, seamless at x edges.
for j,(y,hh) in enumerate([(7,16),(24,19),(44,21)]):
  shift=[12,33,1][j]
  x=-shift
  while x<w:
    bw=rng.randint(18,37)
    base=rng.choice([(39,45,47,255),(45,50,50,255),(34,42,44,255),(49,53,53,255)])
    d.rectangle((x+1,y+1,x+bw-2,y+hh-2),fill=base)
    d.line((x+1,y+1,x+bw-2,y+1),fill=(79,76,69,255))
    d.line((x+bw-2,y+1,x+bw-2,y+hh-2),fill=(21,29,31,255))
    for k in range(3):
      xx=x+rng.randint(3,max(4,bw-3)); yy=y+rng.randint(3,max(4,hh-3))
      d.point((xx,yy),fill=(94,91,83,255) if k%2 else (28,35,38,255))
    x+=bw
# grime at the seam
for i in range(90):
  x=rng.randint(0,w-1);y=rng.randint(10,h-1)
  d.point((x,y),fill=rng.choice([(21,32,34,255),(70,76,70,255),(59,66,65,255)]))
im=im.resize((256,128),Image.Resampling.NEAREST)
im.save(out/'ground-premium-v32.png');im.save(source/'ground-premium-v32.png')
# Separate raised walkable slab, designed to remain legible even over busy backgrounds.
w,h=128,32
p=Image.new('RGBA',(w,h),(0,0,0,0));d=ImageDraw.Draw(p)
d.rectangle((0,1,w-1,9),fill=(99,91,79,255));d.line((0,0,w-1,0),fill=(202,180,139,255),width=1)
d.rectangle((0,9,w-1,30),fill=(45,48,50,255))
for x in range(0,w,22):
  d.line((x,9,x,30),fill=(23,29,32,255))
  d.line((x+1,13,x+1,25),fill=(69,68,64,255))
  d.line((x+5,5,x+18,5),fill=(138,120,96,255))
for x in range(2,w,7):
  y=13+rng.randrange(14)
  d.point((x,y),fill=(86,85,77,255))
p=p.resize((256,64),Image.Resampling.NEAREST)
p.save(out/'platform-premium-v32.png');p.save(source/'platform-premium-v32.png')
print('Created',out/'ground-premium-v32.png',out/'platform-premium-v32.png')
# Final throne: preserve the source artwork in the edition assets for reproducibility.
source_final=source/'final-throne-original-v32.png'
if source_final.is_file():
    artwork=Image.open(source_final).convert('RGB')
    artwork=artwork.resize((1440,810),Image.Resampling.LANCZOS)
    artwork.save(out/'room-final-trono-premium-v32.webp',quality=89,method=6)
    print('Integrated original final-throne illustration,', (out/'room-final-trono-premium-v32.webp').stat().st_size,'bytes')
