#!/usr/bin/env python3
"""Reconstruct 23 transparent, 20-cell 128x160 sprite atlases from project-owned concept art.
These are animated cut-out poses with deliberate offsets/tilts and effects;
not 20 individually hand-illustrated anatomical poses. Pillow + NumPy required to regenerate.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
import math
BASE=Path(__file__).resolve().parents[1]
SRC=BASE/'art-source/bestiary-v37/concepto-23-enemigos.png'
DEST=BASE/'assets/bestiary-v37'; DEST.mkdir(exist_ok=True,parents=True)
NAMES=['corruptpilgrim','vesperaguard','sunfanatic','cryptscavenger','ashhound',
'wailingspecter','severedmonk','brineworm','namelessdrowned','rottensiren','chainedcastaway',
'fungalsporer','crustplague','sporematriarch','saltgolem','abyssraven','ruinsentinel',
'voidherald','sigilabomination','disfigured','dreamweaver','namecorrupter','devotedflesh']
ROWS=[(103,277,5),(330,482,6),(541,700,6),(745,928,6)]
SOURCE=Image.open(SRC).convert('RGB')
assert SOURCE.size==(1536,1024)
assert sum(r[2] for r in ROWS)==len(NAMES)
# Individual sprites have their own custom animated silhouette; stage sprites remain 128x160.
for pos,name in enumerate(NAMES):
 row=next(i for i,b in enumerate([5,11,17,23]) if pos < b)
 start=[0,5,11,17][row]; idx=pos-start
 top,bottom,cols=ROWS[row]; cell_w=1536/cols
 left=int(idx*cell_w)+9; right=int((idx+1)*cell_w)-9
 crop=SOURCE.crop((left,top,right,bottom))
 rgb=np.asarray(crop,dtype=np.uint8)
 mx=rgb.max(axis=2).astype('int16'); mn=rgb.min(axis=2).astype('int16')
 # Remove the near-black print-board background while retaining colored pixel detail.
 foreground=((mx>49)|((mx>35)&((mx-mn)>12))).astype('uint8')*255
 # Discard small isolated stars and board flecks. Keep the darkest interior details near the opaque artwork.
 alpha=Image.fromarray(foreground,'L').filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MedianFilter(3))
 alpha=np.array(alpha)
 # Tiny dust motifs near cell edges have no gameplay value.
 alpha[:2,:]=0; alpha[-2:,:]=0; alpha[:,:2]=0; alpha[:,-2:]=0
 sprite=Image.fromarray(np.dstack((rgb,alpha)),'RGBA')
 bbox=sprite.getbbox()
 if not bbox:raise RuntimeError(f'Empty sprite: {name}')
 sprite=sprite.crop(bbox)
 # Minimum 7 px safety margin, preserve proportions for multi-legged creatures.
 sw,sh=sprite.size; factor=min(119/sw,148/sh)
 sprite=sprite.resize((max(1,round(sw*factor)),max(1,round(sh*factor))),Image.Resampling.LANCZOS)
 # The print-board poses include long horizontal weapons; without a vertical art pass
 # they look like tiny dwarves when rendered at game scale. Restore a readable torso.
 upright={'corruptpilgrim','vesperaguard','sunfanatic','wailingspecter','severedmonk',
 'namelessdrowned','rottensiren','chainedcastaway','ruinsentinel','voidherald',
 'disfigured','dreamweaver','namecorrupter'}
 imposing={'saltgolem','sporematriarch','sigilabomination','devotedflesh'}
 min_h=125 if name in upright else 115 if name in imposing else 0
 if sprite.height<min_h:
  sprite=sprite.resize((sprite.width,min_h),Image.Resampling.BICUBIC)
 atlas=Image.new('RGBA',(128*20,160),(0,0,0,0))
 for frame in range(20):
  f=Image.new('RGBA',(128,160),(0,0,0,0))
  # Poses: 0-7 breathe/stride, 8-9 anticipation, 10-11 strike, 12-15 agitation,
  # 16 stagger, 17-19 dissolve. Pivot is the feet, not the image center.
  phase=frame*math.pi/3
  sx,sy=1.0,1.0
  offset_x=0; offset_y=0; rotate=0
  if frame<=7:
   offset_y=(-2 if frame%4 in (1,2) else 0)
   offset_x=(-3 if frame%4==0 else 3 if frame%4==2 else 0)
   rotate=1.6*math.sin(phase)
  elif frame in (8,9):
   sx,sy=(.96,1.055);offset_y=-4;rotate=-5 if frame==8 else -8
  elif frame in (10,11):
   sx,sy=(1.10,.95);offset_x=8 if frame==10 else 11;rotate=11 if frame==10 else 6
  elif frame in (12,13,14,15):
   sx=1+.035*math.sin(phase);sy=1+.035*math.cos(phase);offset_y=-3;rotate=2*math.sin(phase)
  elif frame==16:
   offset_x=-7;rotate=-9
  else:
   offset_y=3*(frame-16);rotate=-15-12*(frame-17);sy=max(.60,1-.12*(frame-16))
  pose=sprite.resize((round(sprite.width*sx),round(sprite.height*sy)),Image.Resampling.BICUBIC)
  if rotate:pose=pose.rotate(rotate,Image.Resampling.BICUBIC,expand=True)
  px=64-pose.width//2+offset_x
  py=157-pose.height+offset_y
  f.alpha_composite(pose,(px,py))
  if frame in (9,10,11):
   d=ImageDraw.Draw(f,'RGBA')
   if frame==9:
    d.arc((16,22,114,132),195,330,fill=(235,166,91,150),width=2)
   else:
    d.arc((15,28,124,147),320 if frame==10 else 350,425 if frame==10 else 455,fill=(255,193,127,140),width=3)
  if frame>=17:
   a=f.getchannel('A').point(lambda a:round(a*(1-.19*(frame-16))))
   f.putalpha(a)
  atlas.alpha_composite(f,(frame*128,0))
 out=DEST/f'{name}.png';atlas.save(out,optimize=True)
 print(f'{name}: {out.stat().st_size//1024} KiB')
# Stable one-image atlas inspection: 23 names + poses for a graphical design audit.
from PIL import ImageFont
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,14) if Path(font_path).exists() else ImageFont.load_default()
width,height=920,4*224+44
contact=Image.new('RGB',(width,height),(10,13,19));dr=ImageDraw.Draw(contact)
dr.text((25,15),'ASHEN PILGRIMAGE · 23 ENEMIGOS · BESTIARIO v3.7',font=font,fill=(226,200,169))
for i,name in enumerate(NAMES):
 col=i%6;row=i//6;atlas=Image.open(DEST/f'{name}.png').convert('RGBA');img=atlas.crop((0,0,128,160))
 x=16+col*152;y=51+row*218
 contact.paste(img,(x+11,y),img)
 dr.text((x,y+164),f'{i+1:02d} {name[:16]}',font=font,fill=(205,179,151))
contact.save(BASE/'docs/BESTIARIO-23-v3.7.png',optimize=True)
