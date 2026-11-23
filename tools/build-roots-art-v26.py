from PIL import Image,ImageDraw,ImageFilter,ImageEnhance
from pathlib import Path
import numpy as np, math, random
P=Path(__file__).resolve().parents[1]/'assets'
P.mkdir(exist_ok=True)
S=2; W,H=64,80

def sprite(kind, frame):
 r=random.Random(frame*71+len(kind)*41);im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im)
 bob=round(math.sin(frame*1.4)*1.6) if frame<8 else 0
 walk=frame>=4 and frame<8
 lead=(-4 if frame%2 else 4) if walk else 0
 swing=frame in (10,11)
 low=frame in (12,13,18,19)
 if kind=='gardener':
  wood='#473529';gold='#b3a16c';leaf='#53664a';highlight='#83694c';dark='#171a17'
  offset=12 if frame==19 else (3 if low else 0)
  y=offset+bob
  # Huge antlered rooted creature, bell-like rose bloom and meat core.
  d.polygon([(19,53+y),(12,70+y),(2,76),(28,75),(32,58+y)],fill=wood)
  d.polygon([(42,55+y),(40,73+y),(58,77),(56,66+y),(51,50+y)],fill=wood)
  d.polygon([(15,25+y),(8,62+y),(53,66+y),(49,19+y),(29,9+y)],fill=dark)
  for k in range(8):
   x=8+k*6;d.line([(x,23+y),(x+((k%3)-1)*6,60+y)],fill=highlight,width=3)
  d.ellipse((19,18+y,47,54+y),fill='#553631',outline=gold,width=2)
  d.ellipse((27,29+y,38,42+y),fill='#cd6856',outline='#f0c39a',width=1)
  for k in range(7):
   x=12+k*6; d.line([(x,17+y),(x-8+((k%2)*13),2+k%3*4)],fill=wood,width=3)
   d.line([(x,15+y),(x-2+((k%2)*10),6+k%4*2)],fill=gold,width=1)
  d.ellipse((18,9+y,45,29+y),fill=dark,outline=gold,width=2)
  d.polygon([(25,17+y),(31,19+y),(43,17+y),(41,25+y),(28,27+y)],fill='#a98a65')
  # One oversized pruning cleaver (attacks distinct).
  if swing:
   d.line([(35,48+y),(59,26+y)],fill='#cbb98f',width=4)
   d.polygon([(55,26+y),(62,18+y),(63,38+y),(50,32+y)],fill='#9eacad',outline=gold)
  elif frame in (8,9,14,15):
   d.line([(40,47+y),(45,4+y)],fill='#a2a28a',width=4)
   d.polygon([(42,6+y),(54,0),(58,15+y),(46,17+y)],fill='#b9b7a1')
  else:
   d.line([(43,43+y),(55,61+y)],fill='#9d9473',width=5)
   d.polygon([(48,60+y),(62,57+y),(60,75+y),(52,70+y)],fill='#a9ad91',outline='#d0b987')
  if frame in (16,17):
   for k in range(8):d.line([(26,39+y),(r.randint(0,63),r.randint(1,80))],fill='#cf625d',width=2)
  if frame in (18,19):
   d.rectangle((0,68,63,79),fill=(0,0,0,0))
   d.ellipse((9,62,62,78),fill='#4a292b',outline='#b59079')
 elif kind=='barkguard':
  y=bob+(12 if frame==19 else 0)
  d.polygon([(15,31+y),(7,60+y),(15,74),(46,74),(54,36+y),(39,18+y)],fill='#332e25',outline='#7e7457')
  for k in range(6):d.line([(14+k*6,31+y),(12+k*7,67+y)],fill=('#6c6950' if k%2 else '#987d51'),width=2)
  d.polygon([(19,20+y),(8,36+y),(47,40+y),(48,24+y),(35,16+y)],fill='#46523c',outline='#a4a278')
  d.ellipse((21,8+y,44,29+y),fill='#2a3025',outline='#b99b61',width=2)
  d.polygon([(25,7+y),(13,2+y),(21,15+y),(28,19+y),(30,3+y),(38,15+y),(52,1+y),(47,22+y)],fill='#806a49')
  d.line([(26,20+y),(42,20+y)],fill='#b7dda7',width=2)
  ax,ay=(58,29+y) if swing else (52,44+y)
  d.line([(44,39+y),(ax,ay)],fill='#846e49',width=6)
  d.polygon([(ax-5,ay-10),(ax+7,ay-10),(ax+9,ay+14),(ax-5,ay+13)],fill='#635b3e',outline='#a49b74')
  d.line([(13,39+y),(11,65+y)],fill='#ad9365',width=5)
 elif kind=='sporeseer':
  y=bob
  d.polygon([(18,23+y),(9,62+y),(7,76),(54,76),(49,35+y),(38,18+y)],fill='#3c3046',outline='#8e778a')
  for k in range(8):d.line([(19+k*3,39+y),(r.randint(0,60),72)],fill=['#9a748e','#536d52','#d5b3aa'][k%3])
  d.ellipse((22,14+y,44,38+y),fill='#1b2224',outline='#b7a5a4',width=2)
  d.ellipse((24,3+y,45,27+y),fill='#5c6651',outline='#c9ad87',width=2)
  d.ellipse((19,6+y,48,20+y),fill='#756c62',outline='#b6ad80')
  d.line([(29,30+y),(38,30+y)],fill='#b6e2ac',width=2)
  d.line([(45,41+y),(55,11+y)],fill='#b7ab78',width=3)
  for k in range(5):
   xx=52+r.randrange(-10,8);yy=8+r.randrange(-5,6)
   d.ellipse((xx-3,yy-3,xx+3,yy+3),fill='#a2db9b',outline='#dad3aa')
  if frame in (10,11,16,17):d.ellipse((39,15,60,37),outline='#b3efa0',width=2)
 elif kind=='liria':
  y=bob
  d.polygon([(19,29+y),(8,68+y),(7,77),(55,77),(48,32+y),(37,17+y)],fill='#3e4236',outline='#b49a6d')
  d.polygon([(24,24+y),(14,64+y),(33,71+y),(47,57+y),(45,24+y)],fill='#7c6a50')
  d.ellipse((23,16+y,40,32+y),fill='#c2a38b',outline='#43352c')
  d.polygon([(17,26+y),(20,8+y),(34,1+y),(48,16+y),(46,30+y),(37,22+y),(28,17+y)],fill='#394936',outline='#a9b58b')
  d.line([(43,45+y),(54,62+y)],fill='#b8a481',width=3)
  d.ellipse((49,56+y,62,72+y),fill='#77764e',outline='#d6c680',width=2)
  d.ellipse((51,59+y,59,66+y),fill='#def2ab')
  d.line([(18,50+y),(7,58+y)],fill='#bca08b',width=4)
 # feet shadow + fine grained highlights
 d.line([(9,77),(56,77)],fill='#151b17',width=2)
 if frame!=19:
  for k in range(24):
   x=r.randrange(11,54);y=r.randrange(20,75)
   if im.getpixel((x,y))[3]>0: d.point((x,y),fill=r.choice(['#6c725d','#9d9474','#3a3033','#ba9772']))
 return im.resize((128,160),Image.Resampling.NEAREST)

for kind in ['gardener','barkguard','sporeseer','liria']:
 atlas=Image.new('RGBA',(128*20,160),(0,0,0,0))
 for i in range(20):atlas.paste(sprite(kind,i),(128*i,0))
 if kind=='gardener' and (P.parent/'art-source/v26-jardinero-source.png').is_file():
  original=Image.open(P.parent/'art-source/v26-jardinero-source.png').convert('RGBA')
  atlas=Image.new('RGBA',(128*20,160))
  for i in range(20):
   col,row=i%4,i//4
   xy=(round(col*original.width/4),round(row*original.height/5),round((col+1)*original.width/4),round((row+1)*original.height/5))
   atlas.paste(original.crop(xy).resize((128,160),Image.Resampling.LANCZOS),(128*i,0))
 atlas.save(P/f'{kind}-v26.png',optimize=True)
 print(kind,atlas.size,(P/f'{kind}-v26.png').stat().st_size)

# Original composite scenery: tone/grade the project's own gothic crypt illustrations and
# grow illustrated bark, branches, bioluminescent spores and roots behind gameplay sprites.
base_files=['room-cloister.webp','room-crypt.webp','room-ossuary.webp','room-arena.webp']
for idx,stem in enumerate(['rootgate','hojaclara','injertos','gardener']):
 rnd=random.Random(100+idx)
 bg=Image.open(P/base_files[idx]).convert('RGB').resize((1600,900))
 a=np.asarray(bg,dtype=np.float32).copy()
 # teal/olive nocturnal palette, keep existing high-frequency stone texture
 a[:,:,0]=np.clip(a[:,:,0]*(0.62 if idx<2 else .73)+8,0,255)
 a[:,:,1]=np.clip(a[:,:,1]*(.86 if idx<2 else .76)+6,0,255)
 a[:,:,2]=np.clip(a[:,:,2]*(.66 if idx<2 else .74)+3,0,255)
 bg=Image.fromarray(a.astype('uint8'),'RGB').convert('RGBA')
 overlay=Image.new('RGBA',bg.size,(0,0,0,0));d=ImageDraw.Draw(overlay,'RGBA')
 def bezier(a,b,c,e,n=55):
  pts=[]
  for t in np.linspace(0,1,n):
   u=1-t;pts.append((int(u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*e[0]),int(u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*e[1])))
  return pts
 # Massive woody organic arches, woven between stone gothic spires, not over the ground combat lane.
 for k in range(12):
  x=rnd.randrange(-80,1700);endx=x+rnd.choice([-160,-90,90,160]);top=rnd.randrange(90,350)
  pts=bezier((x,920),(x+rnd.randrange(-210,210),560),(endx+rnd.randrange(-200,200),320),(endx,top))
  d.line(pts,fill=(24,42,30,184),width=rnd.randint(24,53),joint='curve')
  d.line(pts,fill=(116,111,65,120),width=5)
  for j in [15,26,35,43]:
   rx,ry=pts[j];dr=rnd.choice([-1,1]);d.line(bezier((rx,ry),(rx+dr*38,ry-40),(rx+dr*90,ry-96),(rx+dr*150,ry-133),24),fill=(36,71,45,180),width=rnd.randrange(9,20))
 # golden spores as light and red growths in back /upper planes
 for k in range(250):
  x=rnd.randrange(1600);y=rnd.randrange(40,760);rad=rnd.choice([1,2,3,4]);col=(168,211,123,145) if idx!=3 else (212,137,110,150)
  d.ellipse((x-rad,y-rad,x+rad,y+rad),fill=col)
 for k in range(85):
  x=rnd.randrange(1600);y=rnd.randrange(100,660)
  d.ellipse((x-18,y-12,x+18,y+12),fill=(48,83,56,88))
  d.ellipse((x-7,y-5,x+11,y+2),fill=(105,141,83,116))
 if idx==3:
  # Giant living rose / organic altar: painted into background but distinct from boss sprite.
  d.ellipse((635,195,1060,670),outline=(171,104,84,135),width=21)
  for j in range(9):
   x=840+math.cos(j*math.tau/9)*210;y=390+math.sin(j*math.tau/9)*211
   d.line([(840,385),(x,y)],fill=(162,105,96,114),width=13)
 final=Image.alpha_composite(bg,overlay).convert('RGB')
 final=ImageEnhance.Contrast(final).enhance(1.09)
 final.save(P/f'room-{stem}.webp','WEBP',quality=87,method=6)
 print(stem,(P/f'room-{stem}.webp').stat().st_size)

# audit thumbnail of actual atlas frames, not a gameplay screenshot
sheet=Image.new('RGB',(1024,580),(11,17,19))
for row,kind in enumerate(['gardener','barkguard','sporeseer','liria']):
 a=Image.open(P/f'{kind}-v26.png').convert('RGBA')
 for col,fi in enumerate([0,4,7,8,10,11,16,19]):
  frame=a.crop((128*fi,0,128*(fi+1),160))
  sheet.paste(frame,(col*128,row*145-15),frame) if row else sheet.paste(frame,(col*128,0),frame)
sheet.save(P.parent/'docs'/'REPARTO-v2.6.png')
