from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
from pathlib import Path
import math, random
random.seed(290)
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'assets'
src=Image.open(ROOT/'art-source'/'summit-v29'/'giant-source.png').convert('RGB')
# Cut generated 4x5 character sheet into frame-accurate transparent tiles; keep original proportions, align feet.
frames=[]
for row in range(5):
 for col in range(4):
  x0=round(col*src.width/4);x1=round((col+1)*src.width/4)
  y0=round(row*src.height/5);y1=round((row+1)*src.height/5)
  tile=src.crop((x0,y0,x1,y1)).convert('RGBA')
  pix=tile.load()
  for y in range(tile.height):
   for x in range(tile.width):
    r,g,b,_=pix[x,y];v=max(r,g,b)
    if v<18:alpha=0
    elif v<46:alpha=int((v-18)*255/28)
    else:alpha=255
    pix[x,y]=(r,g,b,alpha)
  frames.append(tile)
# Normalize across frames by common cell coordinate, rather than per-frame auto-cropping that causes image jitter.
atlas=Image.new('RGBA',(20*128,160))
for i,t in enumerate(frames):
 aspect=min(121/t.width,153/t.height)
 target=(round(t.width*aspect),round(t.height*aspect))
 t=t.resize(target,Image.Resampling.LANCZOS)
 atlas.alpha_composite(t,(i*128+(128-target[0])//2,160-target[1]))
atlas.save(base/'bellgiant-v29.png',optimize=True)
# 20 frames of individually detailed oath-keepers and bell cantors, made from existing hand-stylized winter atlas with bespoke tints and bells.
for output,source,shade in [('hushmonk-v29.png','icewarden-v28.png',(183,154,177)),('icechoir-v29.png','icewraith-v28.png',(148,199,212))]:
 orig=Image.open(base/source).convert('RGBA');result=Image.new('RGBA',orig.size)
 for k in range(20):
  fr=orig.crop((k*128,0,(k+1)*128,160));tint=Image.new('RGBA',fr.size,shade+(0,));pix=fr.load()
  for y in range(fr.height):
   for x in range(fr.width):
    r,g,b,a=pix[x,y]
    if a==0:continue
    if output.startswith('icechoir'):pix[x,y]=(int(r*.55+shade[0]*.45),int(g*.57+shade[1]*.43),int(b*.56+shade[2]*.44),a)
    else: pix[x,y]=(int(r*.69+shade[0]*.31),int(g*.67+shade[1]*.33),int(b*.65+shade[2]*.35),a)
  d=ImageDraw.Draw(fr)
  sway=int(3*math.sin(k*.65)); ax=57+sway
  if output.startswith('hushmonk'):
   # bell-chains, crescent helm, cracked reliquary and ritual pole
   d.line([(75,35),(85,29),(84,95)],fill=(160,135,92,235),width=3)
   d.ellipse((77,36+sway,88,51+sway),fill=(197,154,91,230),outline=(225,218,166,255),width=1)
   d.line([(80,43+sway),(85,54+sway)],fill=(31,23,33,255),width=2)
   d.polygon([(45,30),(55,14),(65,30),(61,30),(55,23),(49,31)],fill=(216,193,160,250))
   d.line([(48,85),(39,112+sway),(53,108)],fill=(140,113,161,225),width=3)
  else:
   # resonant choir: three suspended chimes and cold blue corona
   d.arc((38,20,90,83),210,330,fill=(154,237,241,230),width=3)
   for b in range(3):
    bx=82+b*9;by=63+b*10+sway
    d.line([(bx,40+b*4),(bx,by)],fill=(152,203,210,230),width=2)
    d.ellipse((bx-6,by,bx+6,by+11),fill=(100,202,220,240),outline=(231,247,244,230),width=1)
   d.line([(29,88),(17,109+sway),(42,120)],fill=(135,220,230,160),width=3)
  result.alpha_composite(fr,(k*128,0))
 result.save(base/output,optimize=True)
# Enhance existing original frozen architecture with strongly differentiated foreground and layered detail.
origins=['room-summitpass-v28.webp','room-silentcloister-v28.webp','room-silentcloister-v28.webp']
titles=['stairs','echo','giant']
for i,(f,name) in enumerate(zip(origins,titles)):
 scene=Image.open(base/f).convert('RGB').resize((1440,810),Image.Resampling.LANCZOS)
 scene=ImageEnhance.Color(scene).enhance([.84,.73,.62][i])
 lay=Image.new('RGBA',scene.size,(0,0,0,0));d=ImageDraw.Draw(lay)
 # towers and windows from a unique deep perspective; behind the player lane (~ y>590).
 d.rectangle([0,0,1440,805],outline=(6,17,26,0))
 for k in range(9):
  x=72+k*160+(i*29)%85;h=245+(k*53)%210;y=610-h
  stone=(31+3*i,48+4*i,61+3*i,165)
  d.rectangle((x,y,x+65,616),fill=stone)
  d.polygon([(x-8,y),(x+32,y-60),(x+74,y)],fill=(28,45,56,205))
  d.line((x+32,y-69,x+32,y-54),fill=(192,220,225,180),width=2)
  for j in range(3):
   cy=y+40+j*62
   d.rounded_rectangle((x+15,cy,x+50,cy+37),8,fill=(6,18,28,225),outline=(96,145,161,125),width=2)
   d.line((x+32,cy+2,x+32,cy+34),fill=(78,130,152,180),width=2)
  # bridges or cliff ornament
  d.line((x+60,605,x+157,605),fill=(78,101,117,140),width=9)
 for k in range(6):
  x=45+k*233+(i*37)%55
  d.line((x,245,x,315),fill=(114,143,154,150),width=3)
  d.polygon([(x-19,317),(x+19,317),(x+29,342),(x-29,342)],fill=(142,124,98,180))
  d.ellipse((x-8,318,x+8,328),fill=(225,206,160,170))
 if i==0:
  # sheer switchback staircase and handrails
  for j in range(7):
   x=85+j*169;y=580-35*j
   d.line((x,y,x+140,y),fill=(152,165,167,190),width=7)
   d.line((x,y+5,x+140,y+5),fill=(48,71,83,220),width=14)
 if i==1:
  # runic echo windows in observatory
  for k in range(5):
   x=185+k*245;z=242+(k%2)*36
   d.ellipse((x-36,z-36,x+36,z+36),outline=(107,200,228,138),width=5)
   d.line((x-39,z,x+39,z),fill=(128,225,239,135),width=2)
   d.line((x,z-39,x,z+39),fill=(128,225,239,135),width=2)
 if i==2:
  d.ellipse((540,90,915,465),outline=(144,194,222,128),width=11)
  d.ellipse((625,176,830,381),outline=(194,222,228,112),width=6)
  # chamber throne pillars and chains
  for x in (380,1090):
   d.rectangle((x,205,x+47,646),fill=(43,67,80,212))
   for j in range(5):d.arc((x-30,205+j*66,x+76,300+j*66),180,360,fill=(170,189,193,100),width=3)
 scene=Image.alpha_composite(scene.convert('RGBA'),lay).convert('RGB')
 # bottom combat lane is dark enough for readable silhouettes; sky remains luminous
 shade=Image.new('RGBA',scene.size,(0,0,0,0));shadepix=shade.load()
 for y in range(485,810):
  a=round(60*(y-485)/325)
  for x in range(1440):shadepix[x,y]=(3,12,25,a)
 scene=Image.alpha_composite(scene.convert('RGBA'),shade).convert('RGB')
 scene.save(base/f'room-snow{name}-v29.webp','WEBP',quality=87,method=5)
print('generated',[(f.name,f.stat().st_size) for f in base.glob('*v29*')])
