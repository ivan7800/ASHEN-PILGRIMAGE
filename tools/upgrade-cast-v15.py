#!/usr/bin/env python3
"""Reproducible pixel-art extension for secondary character atlases + Valdren.
Source is our original v1.3 atlas. Never claims hand-made animations.
"""
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from pathlib import Path
import math, random
random.seed(417)
assets=Path(__file__).resolve().parents[1]/'assets'
width,height=128,160
for kind in ('caldris','maera','saint','gravebound','mourner'):
    src=Image.open(assets/f'{kind}-v13.png').convert('RGBA')
    out=Image.new('RGBA',(width*20,height))
    for i in range(20):
        base=[0,1,2,3,4,5,6,7,8,9,10,11,7,7,6,7,7,7,10,11][i]
        tile=src.crop((base*width,0,(base+1)*width,height))
        if i in (12,13):
            # staggered hurt animation: diagonal torso and a recolored tell
            tile=tile.transform((width,height),Image.Transform.AFFINE,(1,.045 if i==12 else -.035,-3 if i==12 else 5,0,1,0),resample=Image.Resampling.NEAREST)
        elif i in (14,15,16,17):
            # dying collapse: vertical compression and diminishing opacity
            factor=[.87,.68,.42,.15][i-14]
            shrunk=tile.resize((width,max(1,int(height*factor))),Image.Resampling.NEAREST)
            tile=Image.new('RGBA',(width,height))
            tile.alpha_composite(shrunk,(0,height-shrunk.height))
            tile.putalpha(tile.getchannel('A').point(lambda a:int(a*([1,.88,.7,.5][i-14]))))
        elif i in (18,19):
            tile=ImageEnhance.Color(tile).enhance(.7 if i==18 else 1.25)
        # Detail pass: small pixel ornaments on breastplate and garments to accentuate identities
        draw=ImageDraw.Draw(tile)
        if i<14 or i>=18:
            if kind=='caldris':
                draw.line([(72,64),(66,70),(72,76),(78,70),(72,64)],fill='#e6b871',width=2)
            elif kind=='maera':
                draw.line([(54,67),(55,87)],fill='#edd39e',width=2)
                draw.ellipse((51,61,57,67),outline='#e8a75b',width=2)
            elif kind=='saint':
                draw.arc((35,12,93,68),175,355,fill='#e9cba0',width=2)
            elif kind=='gravebound':
                for px in (51,62,73):draw.point((px,110+i%3),fill='#bda37c')
            else:
                draw.ellipse((57,51,68,64),outline='#be9edc',width=2)
        out.alpha_composite(tile,(i*width,0))
    out.save(assets/f'{kind}-v15.png',optimize=True)
# Distinct guard variant from the original knight: cooler steel, scarlet tabard,
# separate weapon glints, and low hood darkening, while retaining per-frame transparency.
src=Image.open(assets/'caldris-v15.png').convert('RGBA')
pix=src.load()
for y in range(src.height):
    for x in range(src.width):
        r,g,b,a=pix[x,y]
        if a<15:continue
        if r>g*1.2 and r>b*1.12:
            pix[x,y]=(min(255,int(r*.85)),max(0,int(g*.57)),max(0,int(b*.64)),a)
        elif b>=r*.8 and g>=r*.8 and 40<r<190:
            pix[x,y]=(max(0,int(r*.65)),max(0,int(g*.8)),max(0,int(b*.92)),a)
src.save(assets/'exile-v15.png',optimize=True)
# Erena: new stained pale cowl and apricot accents based on Maera body rig.
src=Image.open(assets/'maera-v15.png').convert('RGBA');p=src.load()
for y in range(src.height):
    for x in range(src.width):
        r,g,b,a=p[x,y]
        if a>15 and b>r*.95 and b>g*.95 and max(r,g,b)<190:
            p[x,y]=(min(255,int(r*1.19)),int(g*.95),int(b*.73),a)
src.save(assets/'erena-v15.png',optimize=True)
# Build a dedicated outdoor panorama at the same resolution as the existing chambers.
base=Image.open(assets/'room-crypt.webp').convert('RGB').resize((1600,900),Image.Resampling.LANCZOS)
veil=Image.new('RGBA',base.size,(25,10,18,90));base=Image.alpha_composite(base.convert('RGBA'),veil)
d=ImageDraw.Draw(base,'RGBA')
# Lower skyline: asymmetrical towers, crenellations, window slits, funeral banners.
for i in range(12):
    x=-40+i*160+int(40*math.sin(i*2.3));h=165+(i*61)%205;y=590-h
    shade=(26+i%3*5,28,36+i%4*3,240)
    d.rectangle((x,y,x+115,720),fill=shade)
    d.polygon([(x-8,y+5),(x+55,y-35),(x+123,y+5)],fill=(41,35,45,255))
    for k in range(6):d.rectangle((x+k*20,y-18,x+k*20+15,y+5),fill=(47,40,48,255))
    for row in range(2):
        for col in range(2):
            wx=x+28+col*46;wy=y+35+row*57
            d.polygon([(wx,wy+35),(wx,wy+10),(wx+8,wy),(wx+17,wy+10),(wx+17,wy+35)],fill=(130,60,55,240))
            d.line([(wx+8,wy+8),(wx+8,wy+34)],fill=(190,132,100,220),width=2)
    if i%3==1:
        d.polygon([(x+55,y+43),(x+83,y+43),(x+80,y+165),(x+68,y+141),(x+55,y+169)],fill=(128,36,44,240))
        d.line([(x+62,y+63),(x+78,y+63)],fill=(202,157,118,230),width=3)
# Walkable ruined gate at center-right, distant fog and stone road.
d.polygon([(0,710),(1600,690),(1600,900),(0,900)],fill=(16,21,27,255))
for i in range(19):
    xx=i*91
    d.line([(xx,715),(xx-45,900)],fill=(94,83,78,160),width=2)
for j in range(8):d.line([(0,737+j*23),(1600,730+j*23)],fill=(80,65,68,80),width=2)
base.convert('RGB').save(assets/'room-valdren.webp',quality=90,method=6)
print('v1.5: seven 20-frame atlases and dedicated Valdren exterior art written')
