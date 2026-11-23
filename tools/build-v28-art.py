"""Generates original/adapted in-game art for ASHEN PILGRIMAGE v2.8.
The underwater guard source was newly generated for this milestone.
The siren is a sea redesign of a user-owned original ghost animation sheet.
All outputs are deterministic, and the original sources remain unmodified.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np, random, math
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
SOURCE_GUARD=ROOT/'art-source'/'sea-v28'/'guardia-coral-fuente.png'
SOURCE_GHOST=ROOT/'art-source'/'sea-v28'/'espectro-fuente-original.png'
assert SOURCE_GUARD.is_file() and SOURCE_GHOST.is_file()
assets=ROOT/'assets'; art=ROOT/'art-source'/'sea-v28';art.mkdir(parents=True,exist_ok=True)
for source,label in [(SOURCE_GUARD,'guardia-coral-fuente.png'),(SOURCE_GHOST,'espectro-fuente-original.png')]:
 (art/label).write_bytes(source.read_bytes())

def extract(source,dest,retint=False):
 im=Image.open(source).convert('RGBA')
 frames=[]
 for i in range(20):
  col,row=i%4,i//4
  tile=im.crop((round(col*im.width/4),round(row*im.height/5),round((col+1)*im.width/4),round((row+1)*im.height/5)))
  a=np.array(tile)
  # source images occasionally contain opaque color-fringe debris at transparent edges
  if retint:
   r,g,b,alpha=[a[:,:,i].astype(np.int16) for i in range(4)]
   bad=((r>135)&(b>140)&(r>g*1.55)&(b>g*1.65)) | ((r>242)&(g>238)&(b>237))
   a[bad,3]=0
   present=(a[:,:,3]>15)
   vals=a[:,:,:3].astype(np.float32)
   lum=np.mean(vals,axis=2)
   # controlled violet -> deep sea slate / ghostly cyan preserving engraved value details
   vals[:,:,0]=lum*.40+4;vals[:,:,1]=lum*.84+12;vals[:,:,2]=lum*.89+23
   vals[:,:,0]+=np.where(present,(r>135)*17,0)
   a[:,:,:3]=np.clip(vals,0,255).astype('uint8')
  tile=Image.fromarray(a,'RGBA')
  bounds=tile.getbbox()
  if bounds:
   tile=tile.crop(bounds)
  max_w,max_h=(117,151) if not retint else (111,151)
  scale=min(max_w/tile.width,max_h/tile.height)
  tile=tile.resize((max(1,round(tile.width*scale)),max(1,round(tile.height*scale))),Image.Resampling.LANCZOS)
  frame=Image.new('RGBA',(128,160))
  frame.alpha_composite(tile,((128-tile.width)//2,156-tile.height))
  if retint:
   dr=ImageDraw.Draw(frame,'RGBA')
   # consistent luminous iris and shell-crown accents maintain marine identity
   cx=64+int(2*math.sin(i*.7)); cy=max(19,156-tile.height+29)
   dr.arc((cx-15,cy-5,cx+17,cy+20),200,335,fill=(118,238,217,145),width=2)
   if 8<=i<=15:
    dr.ellipse((78,72,85,79),fill=(111,225,235,180))
    dr.arc((70,65,95,90),120,330,fill=(119,207,231,145),width=2)
  frames.append(frame)
 atlas=Image.new('RGBA',(2560,160))
 for i,f in enumerate(frames):atlas.alpha_composite(f,(i*128,0))
 atlas.save(assets/dest,optimize=True)
 return atlas
sg=extract(SOURCE_GUARD,'saltguard-v28.png')
si=extract(SOURCE_GHOST,'sirene-v28.png',True)
# the earlier drowned 20-frame sheet remains, as it already uses the detailed style
thumb=Image.new('RGBA',(4*280,2*255),(11,18,23,255));dr=ImageDraw.Draw(thumb)
for row,(im,label) in enumerate(((sg,'GUARDIÁN DE SAL'),(si,'SIRENA ABISAL'))):
 dr.text((15,row*255+10),label,fill='#efd5b4')
 for col,fr in enumerate((0,5,11,15)):
  f=im.crop((fr*128,0,(fr+1)*128,160));f=f.resize((150,195),Image.Resampling.NEAREST)
  thumb.alpha_composite(f,(col*280+60,row*255+42))
thumb.convert('RGB').save(ROOT/'docs'/'NUEVOS-SPRITES-v2.8.png')

# Original stylized gothic ice landscapes with low-frequency layers and architecture.
W,H=1440,810
rng=random.Random(28417)
for region,name in enumerate(['room-summitpass-v28.webp','room-silentcloister-v28.webp']):
 im=Image.new('RGB',(W,H));px=im.load()
 for y in range(H):
  t=y/H
  col=tuple(int(v*(1-t)+w*t) for v,w in zip((15,31,55),(73+region*6,88,111)))
  for x in range(W):px[x,y]=col
 d=ImageDraw.Draw(im,'RGBA')
 # textured storm clouds
 for k in range(64):
  x=rng.randrange(-180,W);y=rng.randrange(40,440);a=rng.randrange(14,36)
  d.ellipse((x-130,y-25,x+130,y+25),fill=(172,191,199,a))
 # three mountain silhouettes, distant to near
 for layer in range(3):
  base=470+layer*68; pts=[(0,H)]
  for x in range(-100,W+180,90):
   peak=base-95-layer*8-rng.randrange(45,150)
   pts.extend([(x,base),(x+42,peak),(x+100,base+5)])
  pts.extend([(W,H)])
  shade=[(31,49,64,240),(39,54,65,255),(46,59,67,255)][layer]
  d.polygon(pts,fill=shade)
  for x in range(-100,W+180,90):
   kx=x+42;ky=base-95-layer*8-70
   d.polygon([(kx-30,ky+30),(kx,ky-18),(kx+32,ky+34),(kx+3,ky+17)],fill=(167,186,193,115))
 # snow ridge, allows clear dark middle band for silhouettes
 d.polygon([(0,720),(140,693),(260,710),(390,684),(620,724),(820,694),(1070,718),(1270,679),(W,701),(W,H),(0,H)],fill=(80,99,103,255))
 d.line([(0,720),(140,693),(260,710),(390,684),(620,724),(820,694),(1070,718),(1270,679),(W,701)],fill=(181,205,206,220),width=9)
 # monumental elevated abbey / crumbling bridge
 ox=450 if region==0 else 210
 for k in range(5 if region==0 else 7):
  x=ox+k*150;top=252+(k%3)*30
  d.rectangle((x,top,x+76,660),fill=(36,47,57,255),outline=(115,133,139,155),width=5)
  d.polygon([(x-14,top),(x+38,top-93),(x+93,top)],fill=(39,47,58,255))
  d.line([(x+38,top-86),(x+38,top-116)],fill=(173,168,156,230),width=5)
  for k2 in range(3):
   yy=top+55+k2*103
   d.polygon([(x+25,yy+53),(x+25,yy+16),(x+38,yy),(x+51,yy+16),(x+51,yy+53)],fill=(7,18,28,255))
   d.line([(x+26,yy+17),(x+38,yy),(x+50,yy+17)],fill=(155,179,181,145),width=3)
  if k>0:
   d.arc((x-111,top+58,x+4,top+169),180,360,fill=(126,147,151,165),width=6)
 # moon/glowing bell weathered vignette
 d.ellipse((1125,79,1274,228),fill=(189,207,207,55),outline=(226,225,211,120),width=3)
 for k in range(400):
  x=rng.randrange(W);y=rng.randrange(50,690);r=rng.choice([1,1,2,3]);d.line((x,y,x-8,y+10),fill=(228,239,240,rng.randrange(60,130)),width=r)
 im=im.filter(ImageFilter.GaussianBlur(.45))
 im.save(assets/name,quality=88,method=6)
# Make a new cold, low-alpha parallax image in the same dimensions as the viewport
for name,phase in [('snow-far-v28.png',0),('snow-mid-v28.png',1)]:
 im=Image.new('RGBA',(960,540));d=ImageDraw.Draw(im,'RGBA')
 for k in range(22):
  x=k*59+(k%3)*12;base=310+phase*72
  d.polygon([(x-75,base+80),(x+25,base-65-rng.randrange(30,110)),(x+130,base+100)],fill=(88,113,133,42 if phase==0 else 34))
 im.save(assets/name)
print('Created 2 20-frame atlases, 2 ice rooms, 2 mountain parallax layers')
# Glacier enemies use variants of the original detailed maritime source with a
# colder palette and frost crystals; identifiable variants, not copied assets.
def frost_variant(src,dst,mode):
 im=Image.open(assets/src).convert('RGBA');a=np.array(im)
 r,g,b=[a[:,:,i].astype(np.float32) for i in range(3)];l=(r+g+b)/3
 if mode=='warden':
  a[:,:,0]=np.clip(l*.68+14,0,255);a[:,:,1]=np.clip(l*.99+14,0,255);a[:,:,2]=np.clip(l*1.12+27,0,255)
 else:
  a[:,:,0]=np.clip(l*.83+10,0,255);a[:,:,1]=np.clip(l*.94+21,0,255);a[:,:,2]=np.clip(l*1.14+35,0,255)
 out=Image.fromarray(a,'RGBA')
 dr=ImageDraw.Draw(out,'RGBA')
 for i in range(20):
  x=i*128+70
  if mode=='warden':
   dr.line((x-23,24,x-10,8,x+5,24),fill=(181,220,240,170),width=2)
  else:
   dr.arc((x-25,22,x+25,63),215,325,fill=(175,232,248,170),width=2)
 out.save(assets/dst,optimize=True)
frost_variant('saltguard-v28.png','icewarden-v28.png','warden')
frost_variant('sirene-v28.png','icewraith-v28.png','wraith')
# Elda is a winter palette of Maera, with a bell-shaped halo: intentional NPC variant.
orig=Image.open(assets/'maera-v21.png').convert('RGBA');vals=np.array(orig)
rr,gg,bb=[vals[:,:,i].astype(np.float32) for i in range(3)]
vals[:,:,0]=np.clip(rr*.69+14,0,255);vals[:,:,1]=np.clip(gg*.84+13,0,255);vals[:,:,2]=np.clip(bb*1.13+18,0,255)
Image.fromarray(vals,'RGBA').save(assets/'elda-v28.png',optimize=True)
