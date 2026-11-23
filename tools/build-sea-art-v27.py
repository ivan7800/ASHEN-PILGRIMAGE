#!/usr/bin/env python3
"""Recursos originales para la revisión visual de Salmuera v2.7.
Regenera los atlas 20x128x160 y tres capas de parallax sin tocar los de v2.5.
Requiere Pillow; no utiliza recursos comerciales ni servicios externos.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import math,random
R=Path(__file__).resolve().parents[1]
A=R/'assets'; A.mkdir(exist_ok=True)
S=R/'art-source'/'sea-v27'
S.mkdir(parents=True,exist_ok=True)
TILE_W,TILE_H,COUNT=128,160,20

# AHOGADO: hojas originales de 20 poses generadas para este juego, editadas al formato del motor.
src=Image.open(S/'ahogado-marino-fuente.png').convert('RGBA')
sheet=Image.new('RGBA',(TILE_W*COUNT,TILE_H))
for i in range(COUNT):
    row,col=divmod(i,4)
    left=round(col*src.width/4);right=round((col+1)*src.width/4)
    top=round(row*src.height/5);bottom=round((row+1)*src.height/5)
    cell=src.crop((left,top,right,bottom))
    alpha=cell.getchannel('A').point(lambda a:0 if a<32 else a)
    cell.putalpha(alpha)
    bounds=cell.getbbox()
    if not bounds: raise RuntimeError(f'Frame vacío: {i}')
    cell=cell.crop(bounds)
    cell.thumbnail((112,149),Image.Resampling.LANCZOS)
    dst=Image.new('RGBA',(TILE_W,TILE_H))
    dst.alpha_composite(cell,((TILE_W-cell.width)//2,TILE_H-cell.height-4))
    sheet.alpha_composite(dst,(TILE_W*i,0))
sheet.save(A/'drowned-v27.png',optimize=True)

# GUARDIÁN DE SAL: original, 20 poses independientes, casco de escafandra, coral y asta marina.
bronze='#c29c6e'; iron='#294b57'; deep='#102831'; foam='#9cdbd5'; rust='#874b43'

def saltguard(frame):
    im=Image.new('RGBA',(128,160)); d=ImageDraw.Draw(im,'RGBA')
    t=frame; step=math.sin(frame*1.8)*3 if 4<=frame<8 else math.sin(frame*1.5)*1.6
    attack=8<=frame<14; fall=frame>=16
    slump=max(0,frame-15)*14 if fall else 0
    vy=int(slump); ox=int(step); wind=10 if 8<=frame<=9 else -3 if 10<=frame<=13 else 0
    if fall and frame>=19: vy=43
    # Heavy boots and barnacled knees.
    for dx in (-19,18):
        x=64+dx+ox
        d.polygon([(x-11,109+vy),(x+10,109+vy),(x+15,147),(x-17,148)],fill='#213640',outline='#79959b',width=2)
        d.polygon([(x-19,145),(x+15,141),(x+19,155),(x-22,155)],fill='#15212d',outline='#b8a58a',width=2)
        for j in range(3): d.ellipse((x-12+j*9,113+j*7+vy,x-8+j*9,117+j*7+vy),fill=bronze)
    # Towering cuirass, unlike existing cloaked soldiers.
    body=[(36,59+vy),(49,50+vy),(80,50+vy),(96,66+vy),(90,113+vy),(40,114+vy)]
    d.polygon(body,fill='#234650',outline='#a3abb0',width=3)
    d.polygon([(47,69+vy),(78,65+vy),(83,104+vy),(43,105+vy)],fill='#142b38',outline=bronze,width=3)
    d.arc((45,75+vy,81,108+vy),30,158,fill='#61aeb7',width=3)
    for x,y in [(45,76),(82,71),(55,98),(74,102),(63,86)]:
        d.ellipse((x-3,y-3+vy,x+3,y+3+vy),fill=bronze)
    # Coral shoulder epaulettes and asymmetric armor.
    d.ellipse((19,49+vy,51,82+vy),fill='#425966',outline='#d2b891',width=3)
    d.ellipse((80,47+vy,112,82+vy),fill='#426b73',outline='#e0c394',width=3)
    for base in (31,100):
        for n in range(5):
            x=base-12+n*5; y=50+vy-(n%3)*5
            d.line((x,64+vy,x+4,y-7),fill=rust,width=3)
            d.ellipse((x+1,y-9,x+5,y-5),fill='#bd6e68')
    # Sphere diving helmet with glowing circular viewing port.
    d.ellipse((39,11+vy,90,67+vy),fill='#6d7779',outline=bronze,width=4)
    d.polygon([(42,27+vy),(45,14+vy),(63,6+vy),(85,20+vy),(89,52+vy),(41,53+vy)],fill='#334e53',outline='#c5ad82',width=3)
    d.ellipse((48,25+vy,81,57+vy),fill='#0a2436',outline='#e5c58b',width=4)
    d.ellipse((56,33+vy,74,50+vy),fill='#46aab4',outline='#a9f2e7',width=2)
    d.polygon([(58,44+vy),(66,32+vy),(73,45+vy)],fill='#c6ffdc')
    for x,y in [(49,14),(75,15),(43,43),(84,43),(63,61)]: d.ellipse((x-2,y-2+vy,x+2,y+2+vy),fill='#e3c59c')
    # Arm and unique sea-glaive/harpoon, motion follows attack frames.
    d.line((92,73+vy,106+wind,99+vy),fill='#678d8e',width=12)
    d.line((92,73+vy,106+wind,99+vy),fill=bronze,width=3)
    if attack and t>=10:
        shaft=((103,94+vy),(125,57+vy-(t-10)*3))
    else:
        shaft=((99,117+vy),(105+wind,3+vy))
    d.line((*shaft[0],*shaft[1]),fill='#dbc092',width=5)
    hx,hy=shaft[1]
    d.polygon([(hx,hy-9),(hx-8,hy+8),(hx,hy+3),(hx+8,hy+8)],fill='#9ed6d1',outline='#cddad0',width=2)
    d.line((37,77+vy,28,111+vy),fill='#687c7b',width=10)
    d.ellipse((20,107+vy,36,126+vy),fill='#2c555c',outline='#bfad82',width=2)
    # Visible hit / collapse silhouette.
    if t in (14,15):d.line((45,68+vy,73,89+vy),fill='#ecb5a9',width=4)
    # Animated specular glint on the porthole (20 distinct atlas cells).
    gx=57+(t%10);gy=37+3*(t//10)+vy
    d.rectangle((gx,gy,gx+2,gy+2),fill='#d4fff1')
    if fall:
        mask=Image.new('RGBA',(128,160));mask.alpha_composite(im)
        if t==19:
            cut=mask.crop((4,34,124,159)); cut=cut.resize((120,55),Image.Resampling.NEAREST)
            im=Image.new('RGBA',(128,160));im.alpha_composite(cut,(4,101))
    return im

# SIRENA ABISAL: silueta totalmente diferente (rostro de porcelana, cabellera espectral y cola).
def sirene(frame):
    im=Image.new('RGBA',(128,160));d=ImageDraw.Draw(im,'RGBA')
    t=frame; w=math.sin(t*.6)*4
    attack=8<=t<=13; hurt=14<=t<=15; collapse=t>=16
    sink=(t-15)*18 if collapse else 0
    for i in range(11):
        xx=56+(i-5)*6;yy=52 + (i%4)*8 +int(w)
        d.line((xx,yy,xx+math.sin(t*.45+i)*12,125+(i%4)*8+int(w)),fill=(44+i*3,123+i*5,137+i*4,170),width=4)
    # floating fins / translucent tail, no physical legs.
    d.polygon([(49,88),(37,105),(20,139),(46,133),(59,157-sink),(75,129),(108,150),(84,113),(77,83)],fill=(29,107,127,188),outline='#82cbd0',width=3)
    for i in range(7):
        x=28+i*11
        d.line((60,101+int(w),x,139+math.sin(t*.5+i)*8-sink),fill='#5895ac',width=2)
    # skeletal ribs under bronze sea-bodice.
    d.polygon([(46,55),(77,55),(82,99),(54,111),(43,92)],fill='#263e55',outline='#b4d5c8',width=3)
    for j in range(5):d.arc((50,67+j*6,74,87+j*6),5,175,fill='#b8c3a8',width=2)
    d.polygon([(45,58),(65,51),(82,59),(77,73),(50,73)],fill='#406675',outline='#c6b18b',width=2)
    # Pearl death mask and kelp crown.
    d.ellipse((49,17,76,59),fill='#d7d9cb',outline='#8e9e9f',width=3)
    d.ellipse((51,29,60,34),fill='#17495b');d.ellipse((68,29,77,34),fill='#17495b')
    d.line((60,48,70,48),fill='#53626c',width=2)
    for j in range(10):
        x=44+j*4;d.line((x,18,x+int(5*math.sin(t*.4+j)),8+(j%3)*3),fill='#668d94',width=3)
    d.arc((44,7,81,43),188,342,fill='#b8af9a',width=2)
    # Long floating hair silhouette, moved differently by frame.
    for i in range(8):
        x=47+i*4;y=24
        d.line((x,y,x-11+int(w)+i%3,67+(i*7)),fill=(66,112+i*7,125+i*5,220),width=3)
    # Open-hand spellcasting with visible cyan projectile / warning.
    d.line((76,70,91+int(w),91 if not attack else 59),fill='#a0c2bc',width=5)
    d.ellipse((87,85 if not attack else 51,98,95 if not attack else 61),fill='#d5e6cc')
    if attack:
        a=1+(t-8)%6
        d.ellipse((89,32,89+11+a*2,52+a*2),fill=(100,226,237,55+a*15),outline='#bdf8f3',width=2)
        d.arc((80,22,121,65),t*25,t*25+190,fill='#b6f1e4',width=2)
    d.line((43,72,32,94),fill='#a6c7c0',width=4)
    if hurt:d.line((40,62,78,70),fill='#edc6bb',width=3)
    if collapse:
        collapsed=im.crop((10,20,119,159)).resize((109,50+(19-t)*8),Image.Resampling.NEAREST)
        im=Image.new('RGBA',(128,160));im.alpha_composite(collapsed,(10,160-collapsed.height))
    return im

for name,fn in [('saltguard-v27',saltguard),('sirene-v27',sirene)]:
    atlas=Image.new('RGBA',(TILE_W*COUNT,TILE_H))
    for idx in range(COUNT):
        tile=fn(idx)
        assert tile.getbbox() is not None,(name,idx)
        atlas.alpha_composite(tile,(idx*TILE_W,0))
    atlas.save(A/f'{name}.png',optimize=True)

# Original 3-layer looping maritime scenery: all geometry is outside the gameplay path.
W,H=960,540
seed=random.Random(270123)
for name in ('far','mid','foam'):
    im=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(im,'RGBA')
    if name=='far':
        # silhouettes of distant ship rigs and monasteries above sea-level
        for j in range(9):
            x=j*120+24
            h=100+int(seed.random()*95)
            d.polygon([(x-29,359),(x-17,359-h),(x+5,350-h-25),(x+24,359)],fill=(17,42,55,75),outline=(85,120,130,100),width=2)
            d.line((x+5,355-h,x+5,359-h-45),fill=(116,157,158,85),width=2)
        for x in (100,380,720,890):
            d.line((x,275,x+7,386),fill=(116,158,163,130),width=3)
            for y in (291,319,342):d.line((x-22,y,x+35,y+12),fill=(122,154,162,100),width=1)
        for i in range(20):
            x=seed.randrange(W);y=seed.randrange(110,350)
            d.line((x,y,x+seed.randrange(30,80),y),fill=(113,177,188,25),width=2)
    elif name=='mid':
        # wreck ribs, pylons and half-lost rose windows at mid-distance
        for x in range(-45,1060,230):
            d.polygon([(x+9,427),(x+25,340),(x+48,315),(x+65,342),(x+74,427)],fill=(19,51,65,100),outline=(95,158,168,78),width=3)
            d.arc((x-18,327,x+96,426),191,356,fill=(153,180,171,94),width=3)
            d.line((x+42,312,x+42,425),fill=(86,127,134,70),width=2)
            d.polygon([(x+101,426),(x+115,385),(x+190,385),(x+209,428)],fill=(28,62,67,100))
            for i in range(3):d.arc((x+111+i*24,393,x+133+i*24,416),180,360,fill=(91,167,173,85),width=1)
        for i in range(42):
            x=seed.randrange(W);y=seed.randrange(300,429)
            d.ellipse((x,y,x+2,y+2),fill=(110,188,185,55))
    else:
        # transparent spray anchored below the playfield, minimal occlusion
        for i in range(15):
            x=(i*79)%W;y=454+(i%4)*17
            d.arc((x-30,y,x+55,y+24),187,349,fill=(139,222,224,53),width=2)
            d.arc((x-20,y+17,x+70,y+39),190,335,fill=(91,176,179,43),width=2)
        for i in range(65):
            x=seed.randrange(W);y=seed.randrange(442,525)
            r=seed.randrange(1,4)
            d.ellipse((x,y,x+r,y+r),fill=(136,228,213,35))
    im.save(A/f'sea-{name}-v27.png',optimize=True)

print('Generated:',*[str(p.name) for p in sorted(A.glob('*-v27.png'))])
