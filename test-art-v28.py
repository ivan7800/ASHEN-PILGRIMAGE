#!/usr/bin/env python3
"""Independent image-integrity gate for updated atlases."""
from pathlib import Path
from PIL import Image
import hashlib
P=Path(__file__).resolve().parent
for name in ('saltguard-v28','sirene-v28','icewarden-v28','icewraith-v28','elda-v28'):
 im=Image.open(P/'assets'/f'{name}.png').convert('RGBA')
 assert im.size==(2560,160),name
 digests=set()
 for i in range(20):
  cell=im.crop((128*i,0,128*(i+1),160))
  ext=cell.getchannel('A').getbbox()
  assert ext and ext[2]-ext[0]>=24 and ext[3]-ext[1]>=(34 if name=='elda-v28' and i>=16 else 65),(name,i,ext)
  digests.add(hashlib.sha256(cell.tobytes()).digest())
 assert len(digests)>=12,(name,len(digests))
 print(name,len(digests),'distinct frames, nonempty alpha')
for f in ['room-summitpass-v28.webp','room-silentcloister-v28.webp']:
 im=Image.open(P/'assets'/f)
 assert im.width>=960 and im.height>=540 and (P/'assets'/f).stat().st_size>100000
print('OK v2.8 image integrity and frame variation')
