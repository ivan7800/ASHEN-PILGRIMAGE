"""Convert user-approved, original 4x5 illustrated sheets to the engine's 20x(128x160) RGBA format.
No generative call at build time. Source files remain available beside this script's directory when provided.
"""
from PIL import Image, ImageOps
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'art-source'
TARGET=ROOT/'assets'
FILES={
 'pilgrim-v21.png':('el_portador_de_ceniza_animaciones_pixel_art.png',[4,5,6,7,0,1,7,9,8,10,13,15,16,17,16,17,18,19,12,14]),
 'king-v21.png':('sprite_de_animación_del_rey_esquelético.png',list(range(20))),
 'caldris-v21.png':('hoja_de_sprites_del_caballero_grimdark.png',[4,5,6,7,0,1,7,9,8,10,11,12,13,14,15,16,17,18,19,3]),
 'maera-v21.png':('sprite_de_maera_en_20_poses.png',[4,5,6,7,0,1,7,9,8,10,11,12,13,14,15,16,17,18,19,3]),
 'gravebound-v21.png':('hojas_de_animación_del_enterrador.png',[4,5,6,7,0,1,7,9,8,10,11,12,13,14,15,16,17,18,19,3])
}
for name,(input_name,frame_order) in FILES.items():
 source=Image.open(SOURCE/input_name).convert('RGBA');sw,sh=source.size
 target=Image.new('RGBA',(128*20,160),(0,0,0,0))
 for frame,target_index in enumerate(frame_order):
  col=target_index%4;row=target_index//4
  l=round(col*sw/4);r=round((col+1)*sw/4);u=round(row*sh/5);b=round((row+1)*sh/5)
  img=source.crop((l,u,r,b))
  # Geometry, rather than arbitrary edges, is the source of this sprite frame.
  a=img.getchannel('A').point(lambda v:0 if v<42 else min(255,(v-42)*255//213))
  img.putalpha(a)
  bbox=img.getchannel('A').getbbox()
  if bbox:
   img=img.crop(bbox)
   # Preserve visual proportions with a consistent foot baseline across all frames.
   maxw=123; maxh=156
   scale=min(maxw/img.width,maxh/img.height)
   size=(max(1,round(img.width*scale)),max(1,round(img.height*scale)))
   img=img.resize(size,Image.Resampling.LANCZOS)
   cell=Image.new('RGBA',(128,160),(0,0,0,0))
   cell.alpha_composite(img,((128-size[0])//2,158-size[1]))
   target.alpha_composite(cell,(frame*128,0))
 target.save(TARGET/name,optimize=True)
 print(name, target.size)
