from PIL import Image,ImageDraw,ImageFilter,ImageEnhance
import math,random
from pathlib import Path
R=Path(__file__).resolve().parents[1]
A=R/'assets';A.mkdir(exist_ok=True)
rng=random.Random(250122)
# Original 2D backgrounds, separate geometry/composition per stage, rasterized at game-space 960x540.
settings=[('submerged',(6,24,39),(21,78,88)),('tidehall',(7,28,45),(40,89,103)),('drownedchapel',(12,29,46),(42,80,83)),('abyssboss',(7,13,33),(46,65,89))]
for scene,(top,bottom) in enumerate([(s[1],s[2]) for s in settings]):
 name=settings[scene][0]
 im=Image.new('RGB',(960,540));pix=im.load()
 for y in range(540):
  q=y/540;v=math.sin(y*.028)*2
  for x in range(960):
   shimmer=math.sin(x*.016+y*.009)*3
   pix[x,y]=tuple(max(0,min(255,int(top[k]*(1-q)+bottom[k]*q+v+shimmer))) for k in range(3))
 d=ImageDraw.Draw(im,'RGBA')
 # Vertical underwater light shafts with soft blue translucence
 for j in range(7):
  px=70+j*146+rng.randint(-22,22)
  d.polygon([(px-22,0),(px+40,0),(px+220,500),(px+145,500)], fill=(111,211,214,11))
 # distant jagged cliffs / wreckage silhouettes
 for i in range(22):
  x=i*55-40;h=80+rng.randint(0,155)
  d.polygon([(x,410),(x+5,410-h),(x+17,405-h),(x+21,410)],fill=(2,12,23,110))
 if scene==0: spacing=205; topY=135; archW=150
 elif scene==1: spacing=240; topY=115; archW=205
 elif scene==2: spacing=174; topY=90; archW=145
 else: spacing=280; topY=55; archW=242
 for i,x in enumerate(range(-130,1100,spacing)):
  # monumental ribbed stone columns
  d.rectangle((x,topY+64,x+28,462),fill=(24,43,51,255),outline=(92,123,126,230),width=4)
  d.rectangle((x-8,topY+40,x+39,topY+67),fill=(49,77,84,255),outline=(107,137,137,255),width=3)
  d.rectangle((x-11,453,x+41,472),fill=(53,73,78,255),outline=(138,134,110,210),width=3)
  d.polygon([(x-38,topY+42),(x+14,topY-32),(x+66,topY+42)], fill=(24,40,49,230),outline=(116,133,125,230),width=4)
  # lancet aperture
  d.polygon([(x+56,353),(x+59,topY+102),(x+94,topY+56),(x+131,topY+104),(x+134,353)],fill=(7,25,39,250),outline=(116,147,150,230),width=3)
  for j in range(5):
   yy=topY+118+j*45
   d.line((x+62,yy,x+129,yy),fill=(63,101,107,140),width=2)
 # skyline silhouettes, stairs, arcades
 if scene==0:
  for x in [215,495,778]:
   d.polygon([(x-30,425),(x-15,230),(x+5,198),(x+22,232),(x+34,425)],fill=(32,59,67,220),outline=(125,152,151,190),width=3)
   d.ellipse((x-7,250,x+11,267),fill=(94,180,181,145))
 elif scene==1:
  x,y=485,275
  for r in [126,97,70,47]:d.ellipse((x-r,y-r,x+r,y+r),outline=(146,158,141,195),width=6)
  for i in range(12):
   t=i*math.pi/6;d.line((x,y,x+120*math.cos(t),y+120*math.sin(t)),fill=(176,159,119,140),width=4)
  d.ellipse((x-31,y-31,x+31,y+31),fill=(15,46,53,255),outline=(190,174,129,255),width=6)
 elif scene==2:
  for x in [225,475,730]:
   d.polygon([(x-45,425),(x-40,240),(x,194),(x+42,240),(x+45,425)], fill=(28,49,59,230),outline=(134,155,145,245),width=4)
   d.ellipse((x-16,262,x+16,287),fill=(132,190,186,170))
   for j in range(3):d.line((x-29,311+j*30,x+29,311+j*30),fill=(98,145,147,160),width=3)
 else:
  # flooded throne / luminous circular window and abyssal crown
  for r in (174,146,110):d.ellipse((480-r,239-r,480+r,239+r),outline=(121,183,183,160),width=8)
  for i in range(13):
   t=i*math.pi*2/13;d.line((480+150*math.cos(t),239+150*math.sin(t),480+183*math.cos(t),239+183*math.sin(t)),fill=(171,176,145,180),width=6)
  d.polygon([(445,406),(453,275),(475,243),(493,275),(505,406)],fill=(18,47,59,255),outline=(147,196,180,205),width=5)
 # submerged rubble, ship ribs, scattered shells (environment only, not hitbox)
 for i in range(34):
  x=rng.randrange(960);yy=424+rng.randrange(50)
  d.polygon([(x-42,yy+12),(x-13,yy-18),(x+8,yy-22),(x+35,yy+10)],fill=(27,44,50,230),outline=(93,119,119,120),width=2)
 for i in range(110):
  x=rng.randrange(960);y=rng.randrange(110,450)
  r=rng.choice([1,1,2,3]);d.ellipse((x-r,y-r,x+r,y+r),outline=(149,231,220,rng.randrange(22,100)),width=1)
 # horizontal surface ripples in distant water
 for yy in [379,405,435]:
  for x in range(25,930,90):
   d.arc((x,yy-3,x+65,yy+6),math.pi*1.1,math.pi*1.9,fill=(118,199,191,90),width=2)
 im=im.resize((960,540),Image.Resampling.BILINEAR)
 out=A/f'room-{name}.webp';im.save(out,'WEBP',quality=90,method=5);print('wrote',out,round(out.stat().st_size/1024),'KB')
# 20-frame transparent sprites, authored on a native low-resolution pixel grid.
def sprite_sheet(kind):
 sheet=Image.new('RGBA',(128*20,160),(0,0,0,0))
 for k in range(20):
  img=Image.new('RGBA',(64,80),(0,0,0,0));d=ImageDraw.Draw(img)
  step=[0,1,2,1,0,1,2,1][k%8];t=k*.45
  if kind=='drowned':
   # Splayed fin-like legs, barnacled cuirass, coral harpoon and hollow skull
   drift=int(math.sin(t)*2);attack=(8<=k<=11)
   d.polygon([(15,30),(10,65+step),(21,69),(29,43),(42,68),(52,65-step),(47,30)],fill='#152d37',outline='#6897a0',width=1)
   d.polygon([(10,20),(18,8),(36,9),(52,21),(48,43),(13,44)],fill='#335861',outline='#b0c7bb',width=2)
   d.polygon([(17,7),(20,2),(36,1),(42,9),(39,19),(19,19)],fill='#a9babb',outline='#34454d',width=2)
   d.line((23,12,27,12),fill='#081b28',width=3);d.line((35,12,39,12),fill='#081b28',width=3)
   d.polygon([(4,24),(14,18),(24,41),(9,46)],fill='#355c67',outline='#9db5b6')
   d.line((40,27,50,38),(124,146,149),width=7)
   d.line((50,38,55+(12 if attack else 0),5+(12 if attack else 0)),fill='#acbbae',width=3)
   d.polygon([(50+(12 if attack else 0),7+(12 if attack else 0)),(55+(12 if attack else 0),-2+(12 if attack else 0)),(61+(12 if attack else 0),8+(12 if attack else 0))],fill='#d9c5a1')
   for j in range(8):
    a=j*2.3;xx=int(26+math.sin(a)*12);yy=int(23+math.cos(a)*10)
    d.ellipse((xx,yy,xx+2,yy+2),fill='#c4a979')
   if k>=14:d.polygon([(7,67),(12,59),(33,62),(46,70),(51,74)],fill='#42616b')
  else:
   drift=int(math.sin(t)*4);blast=8<=k<=13
   # Wraith of a drowned singer, independent shape from gravebound or mourner.
   d.polygon([(24,20),(15,31),(3,68),(22,62),(32,76),(46,62),(63,70),(49,31),(42,18)],fill=(45,94,107,210),outline='#b6e5d4',width=2)
   d.polygon([(22,7),(30,1),(39,8),(42,24),(18,24)],fill='#629ca2',outline='#c8d5c5',width=2)
   d.ellipse((24,10,38,24),fill='#ced9c3',outline='#466d79',width=2)
   for x in [28,35]:d.rectangle((x,16,x+3,18),fill='#153a53')
   d.line((32,20,34,21),fill='#18394c',width=2)
   for j in range(5):
    x=13+j*9
    d.line((x,31,x+drift+j-3,62+j%3*3),fill=(144,200,208,210),width=3)
   d.line((42,30,55+(5 if blast else 0),25),fill='#8cced0',width=3)
   if blast:
    d.ellipse((48,11,63,26),fill=(89,204,214,110),outline='#c2f9f0',width=2)
   d.line((17,34,10,48),fill='#86bfc0',width=3)
   if k>=16:d.polygon([(8,67),(17,58),(44,63),(57,74)],fill=(44,99,107,160))
  # Two-stage pixel enlargement retains bold pixel readability at 960x540.
  sprite=img.resize((128,160),Image.Resampling.NEAREST)
  sheet.alpha_composite(sprite,(k*128,0))
 out=A/f'{kind}-v25.png';sheet.save(out);print('wrote',out,round(out.stat().st_size/1024),'KB')
for k in ('drowned','sirene'):sprite_sheet(k)
# The original image-generated 4x5 boss board is transformed into isolated frames.
original=R/'art-source'/'sea-v25'/'novia-sprites-fuente.png'
if original.exists():
 source=Image.open(original).convert('RGB');tw=source.width/4;th=source.height/5
 frames=[]
 for i in range(20):
  cx,cy=i%4,i//4
  crop=source.crop((round(cx*tw),round(cy*th),round((cx+1)*tw),round((cy+1)*th))).convert('RGBA')
  px=crop.load()
  for y in range(crop.height):
   for x in range(crop.width):
    r,g,b,_=px[x,y]
    # Soft color-key the white sheet without erasing dark cloth or trident details.
    whiteness=min(r,g,b)
    ach=0 if whiteness>248 else max(0,min(255,int((248-whiteness)*255/31))) if whiteness>217 and max(r,g,b)-whiteness<20 else 255
    px[x,y]=(r,g,b,ach)
  bbox=crop.getbbox()
  if bbox:crop=crop.crop(bbox)
  crop.thumbnail((112,148),Image.Resampling.LANCZOS)
  tile=Image.new('RGBA',(128,160),(0,0,0,0));tile.alpha_composite(crop,((128-crop.width)//2,160-crop.height-6))
  # Quantize color detail to a consistent limited palette while preserving alpha.
  frames.append(tile)
 sprite=Image.new('RGBA',(128*20,160),(0,0,0,0))
 for i,tile in enumerate(frames):sprite.alpha_composite(tile,(128*i,0))
 out=A/'bride-v25.png';sprite.save(out);print('wrote',out,round(out.stat().st_size/1024),'KB')
