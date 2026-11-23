"""Import the originally commissioned Mourner sheet from this project conversation.
Split a transparent 4x5 conceptual sheet into the engine's 20x (128x160) horizontal atlas.
This is a derivative conversion of project source, NOT a frame-by-frame artist-authored animation.
"""
from PIL import Image
from pathlib import Path
P=Path(__file__).resolve().parents[1]
source=P/'art-source/premium-v32/mourner-source.png'
assert source.is_file()
source_dir=P/'art-source/premium-v32';source_dir.mkdir(parents=True,exist_ok=True)
im=Image.open(source).convert('RGBA');W,H=im.size
atlas=Image.new('RGBA',(128*20,160))
for idx in range(20):
 row,col=divmod(idx,4)
 a=int(col*W/4);b=int((col+1)*W/4);c=int(row*H/5);d=int((row+1)*H/5)
 cell=im.crop((a,c,b,d))
 rgba=cell.load()
 for y in range(cell.height):
  for x in range(cell.width):
   r,g,bv,al=rgba[x,y]
   # Remove near-transparent checkerboard artifacts and anomalous magenta debris.
   if al < 62 or (r>220 and bv>210 and g<105 and r>g*1.6):
    rgba[x,y]=(0,0,0,0)
   elif al<108:
    rgba[x,y]=(r,g,bv,max(0,(al-62)*255//(108-62)))
 mask=cell.getchannel('A');bounds=mask.getbbox()
 if not bounds:continue
 # Keep each pose inside a consistent available space with a common floor anchor.
 cropped=cell.crop(bounds)
 scale=min(112/cropped.width,146/cropped.height)
 tw,th=max(1,round(cropped.width*scale)),max(1,round(cropped.height*scale))
 cropped=cropped.resize((max(1,tw//2),max(1,th//2)),Image.Resampling.LANCZOS).resize((tw,th),Image.Resampling.NEAREST)
 frame=Image.new('RGBA',(128,160));frame.alpha_composite(cropped,((128-tw)//2,154-th))
 atlas.alpha_composite(frame,(128*idx,0))
atlas.save(P/'assets/mourner-premium-v32.png',optimize=True)
# preview, arranged in 4 columns and 5 rows with a neutral background.
preview=Image.new('RGBA',(4*128,5*160),(12,17,22,255))
for idx in range(20):
 preview.alpha_composite(atlas.crop((idx*128,0,(idx+1)*128,160)),((idx%4)*128,(idx//4)*160))
preview.convert('RGB').save(P/'docs/MOURNER-v3.2.png')
print('Imported mourner:',(P/'assets/mourner-premium-v32.png').stat().st_size)
