"""Reproducible non-destructive environmental cohesion pass on source-owned v2.2 rooms."""
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from pathlib import Path
import math
root=Path(__file__).resolve().parents[1]
original=root/'art-source'/'v22-crypt-rooms'
original.mkdir(parents=True,exist_ok=True)
scenes=['crypt','cloister','ossuary','bell','arena']
for idx,name in enumerate(scenes):
 path=root/'assets'/f'room-{name}.webp'
 backup=original/path.name
 if not backup.exists(): backup.write_bytes(path.read_bytes())
 base=Image.open(backup).convert('RGB')
 w,h=base.size
 # Restrained grade preserving source silhouettes and lower-screen gameplay visibility.
 base=ImageEnhance.Contrast(base).enhance(1.13)
 base=ImageEnhance.Color(base).enhance(.83)
 overlay=Image.new('RGBA',base.size,(0,0,0,0)); d=ImageDraw.Draw(overlay,'RGBA')
 stone=(154,139,126,85);gold=(197,163,117,125);red=(147,53,56,94)
 # Backlit pointed cathedral windows and thin stone tracery across the top third.
 for k in range(5):
  cx=int((k+.50)*w/5 + ((idx%2)*25))
  x0,x1=cx-48,cx+48;yb= int(h*.37)
  d.line([(x0,yb),(x0,yb-94),(cx,yb-152),(x1,yb-94),(x1,yb)],fill=stone,width=5)
  d.line([(cx,yb-141),(cx,yb-14)],fill=stone,width=2)
  d.arc((cx-22,yb-92,cx+22,yb-36),0,180,fill=gold,width=2)
  d.line([(x0+8,yb-57),(x1-8,yb-57)],fill=gold,width=2)
  # Tiny stained glass highlights, not opaque rectangles
  d.ellipse((cx-4,yb-120,cx+4,yb-112),fill=(205,83,73,100))
 # Depth-guiding carved reliefs over lower columns; avoid occluding player and floor.
 for k in range(4):
  cx=int((k+.6)*w/4)
  d.line([(cx-35,0),(cx-27,int(h*.29))], fill=(182,159,132,44),width=7)
  d.line([(cx+35,0),(cx+27,int(h*.29))], fill=(182,159,132,44),width=7)
 if name in ('crypt','ossuary'):
  for k in range(9):
   xx=int((k+.5)*w/9); yy=int(h*.43)
   d.arc((xx-12,yy-14,xx+12,yy+8),180,360,fill=(217,198,168,65),width=2)
   d.ellipse((xx-6,yy-4,xx-2,yy),fill=(22,18,24,75));d.ellipse((xx+2,yy-4,xx+6,yy),fill=(22,18,24,75))
 if name in ('bell','arena'):
  for k in range(3):
   cx=int((k+1)*w/4); y=int(h*.22)
   d.arc((cx-25,y-23,cx+25,y+20),190,350,fill=gold,width=3)
   d.line([(cx-27,y+10),(cx+27,y+10)],fill=gold,width=3)
 # Low-opacity tint gives the first five rooms the same cold-stone warm-brass language.
 wash=Image.new('RGBA',base.size,(19,33,40,20 if name!='arena' else 14))
 combined=Image.alpha_composite(Image.alpha_composite(base.convert('RGBA'),wash),overlay).convert('RGB')
 combined.save(path,'WEBP',quality=89,method=5)
 print(name,path.stat().st_size)
