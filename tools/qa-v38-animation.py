#!/usr/bin/env python3
"""Check generated 23x20 animation sheets' completeness, transparency, frame diversity.
Pixel data QA does not certify animation attractiveness or human gameplay.
"""
from PIL import Image
from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[1]; files=sorted((root/'assets/bestiary-v37').glob('*.png'))
assert len(files)==23,(len(files),'Atlases missing')
record=[]
for file in files:
 with Image.open(file) as im:
  assert im.size==(2560,160) and im.mode=='RGBA',file.name
  frames=[im.crop((i*128,0,(i+1)*128,160)) for i in range(20)]
  bounds=[frame.getchannel('A').getbbox() for frame in frames]
  assert all(bounds),file.name+' transparent frames'
  distinct=len({hashlib.sha256(f.tobytes()).digest() for f in frames})
  assert distinct>=13,(file.name,distinct)
  # Pose changes must be real pixels, not repeated slide-strip references.
  for i,j in [(4,9),(9,11),(11,18)]:
   assert frames[i].tobytes()!=frames[j].tobytes(),(file.name,i,j)
  record.append((file.stem,distinct))
print('OK v3.8: 23 RGBA atlases x 20 frames, 460 non-empty frames, frame variety',record)
