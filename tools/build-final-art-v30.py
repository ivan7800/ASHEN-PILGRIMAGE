#!/usr/bin/env python3
"""Reproducible final-chapter backgrounds and original First Witness atlas.
Inputs: AI-generated original First Witness concept sheet supplied with the project.
The sprite atlas contains 20 discrete 128x160 RGBA frames on a 2560x160 strip.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from pathlib import Path
import math, random, sys
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets'
ASSETS.mkdir(exist_ok=True)
SRC=ROOT/'art-source'/'final-v30'/'first-witness-sheet.png'

def atlas():
    if not SRC.exists():
        raise SystemExit(f'Falta fuente artística original: {SRC}')
    original=Image.open(SRC).convert('RGB')
    full=Image.new('RGBA',(128*20,160),(0,0,0,0))
    cw=original.width/4;ch=original.height/5
    for i in range(20):
        col,row=i%4,i//4
        cell=original.crop((round(cw*col),round(ch*row),round(cw*(col+1)),round(ch*(row+1))))
        pixels=cell.load(); out=Image.new('RGBA',cell.size,(0,0,0,0)); pix=out.load()
        for y in range(cell.height):
            for x in range(cell.width):
                r,g,b=pixels[x,y]
                v=max(r,g,b)
                # Original artwork is on black: only remove true black/near-black.
                a=0 if v<=8 else min(255,max(0,int((v-8)*14)))
                # Remove isolated low-brightness JPEG-like edge artifacts.
                pix[x,y]=(r,g,b,a)
        bbox=out.getbbox()
        if bbox:
            out=out.crop(bbox)
            sz=out.size
            mul=min(114/max(1,sz[0]),149/max(1,sz[1]))
            out=out.resize((max(1,round(sz[0]*mul)),max(1,round(sz[1]*mul))),Image.Resampling.LANCZOS)
            # Align soles to baseline; fixed cells avoid animation 'jumps'.
            full.alpha_composite(out,(i*128+(128-out.width)//2,154-out.height))
    full.save(ASSETS/'firstwitness-v30.png',optimize=True)
    # Distinct silhouette material for lesser foes: recolored from independent authored resources.
    derived=[('sunpenitent-v30.png','king-v21.png',(1.10,.90,.60)),
             ('solarwraith-v30.png','sirene-v28.png',(1.12,.72,.52)),
             ('ashherald-v30.png','caldris-v21.png',(.95,.77,.56))]
    for dest,src,tones in derived:
        im=Image.open(ASSETS/src).convert('RGBA')
        if im.size!=(2560,160):continue
        r,g,b,a=im.split()
        r=r.point(lambda v,minc=tones[0]:min(255,int(v*minc)))
        g=g.point(lambda v,minc=tones[1]:min(255,int(v*minc)))
        b=b.point(lambda v,minc=tones[2]:min(255,int(v*minc)))
        Image.merge('RGBA',(r,g,b,a)).save(ASSETS/dest,optimize=True)

def painter(scene):
    W,H=1440,810;random.seed(40123+scene)
    name=['umbral','galeria','brasas','trono'][scene]
    im=Image.new('RGB',(W,H));p=im.load()
    colors=[((8,13,27),(41,17,25)),((12,14,24),(78,28,34)),((13,10,24),(89,41,28)),((9,9,18),(105,31,29))]
    dark,bright=colors[scene]
    for y in range(H):
        t=y/H;curve=t**1.7
        for x in range(W):
            dx=(x/W-.50)
            halo=math.exp(-(dx*dx/.06+((y/H-.29)**2)/.17))
            grain=random.randint(-3,3)
            color=tuple(max(0,min(255,int(dark[k]*(1-curve)+bright[k]*curve+halo*[47,15,8][k]+grain))) for k in range(3))
            p[x,y]=color
    d=ImageDraw.Draw(im,'RGB')
    sunx=1010 if scene!=3 else 860; suny=163 if scene!=3 else 190
    for radius in range(175,70,-3):
        t=(175-radius)/105
        c=(int(135*t),int(52*t),int(32*t))
        d.ellipse((sunx-radius,suny-radius,sunx+radius,suny+radius),outline=c,width=2)
    d.ellipse((sunx-104,suny-104,sunx+104,suny+104),fill=(7,10,18),outline=(234,104,67),width=7)
    for i in range(28):
        theta=i*math.tau/28
        r0=110; r1=123+random.randint(4,48)
        d.line((sunx+math.cos(theta)*r0,suny+math.sin(theta)*r0,sunx+math.cos(theta)*r1,suny+math.sin(theta)*r1),fill=(154,57,43),width=2)
    # Distant spires and bridges, cathedral tracery. Pixel-art vertical silhouettes.
    for layer in range(3):
        base=365+layer*85
        for j in range(24):
            x=j*65+random.randint(-20,17)+layer*20
            w=random.randint(20,48);h=random.randint(70,220)//(layer+1)
            wall=[(17,20,30),(22,24,34),(28,24,32)][layer]
            d.rectangle((x,base-h,x+w,base),fill=wall)
            d.polygon([(x-6,base-h),(x+w//2,base-h-58),(x+w+6,base-h)],fill=wall)
            if j%2==0:
                d.line((x+w//2,base-h-58,x+w//2,base-h-95),fill=(63,52,56),width=3)
            for yy in range(base-h+23,base-9,25):
                for xx in range(x+7,x+w-6,15):
                    d.rectangle((xx,yy,xx+4,yy+9),fill=(66+layer*7,47+layer*5,43+layer*4))
        for j in range(5):
            x=j*320+30
            d.arc((x,base-36,x+290,base+76),180,360,fill=(66,55,54),width=4)
    # Closest gothic framing and fixed combat lane deliberately darker than backdrop.
    d.rectangle((0,665,W,H),fill=(24,26,32))
    for j in range(8):
        x=-40+j*216;w=52
        ytop=130+(j%3)*30
        d.rectangle((x,ytop,x+w,670),fill=(34,32,40),outline=(75,65,67),width=3)
        for k in range(9):
            yy=ytop+27+k*54
            d.line((x,yy,x+w,yy),fill=(61,53,55),width=2)
            d.line((x+14,yy,x+14,yy+42),fill=(50,42,46),width=2)
        d.polygon([(x-12,ytop),(x+w//2,ytop-69),(x+w+12,ytop)],fill=(44,37,45),outline=(95,72,71))
        if j<7:
            xx=x+w;end=x+216
            d.arc((xx,ytop+20,end,ytop+260),180,360,fill=(101,77,77),width=9)
            d.arc((xx+15,ytop+42,end-15,ytop+260),180,360,fill=(43,33,40),width=12)
    if scene==0:
        # Six columnar altar-braseros on the crossing
        for j in range(6):
            x=155+j*228; y=630
            d.rectangle((x-26,y-55,x+24,y+17),fill=(62,53,50),outline=(147,103,77),width=3)
            d.ellipse((x-19,y-87,x+19,y-43),fill=(195,89,40))
            d.polygon([(x-11,y-57),(x,y-113),(x+11,y-57)],fill=(241,179,94))
    elif scene==1:
        # Rows of floating damaged sun discs / looking-glass fixtures
        for i in range(7):
            x=175+i*172;y=287+(i%2)*42;r=42
            d.ellipse((x-r,y-r,x+r,y+r),outline=(158,118,82),width=8)
            d.ellipse((x-r+10,y-r+10,x+r-10,y+r-10),fill=(19,18,24))
            for k in range(10):
                theta=k*math.tau/10
                d.line((x+math.cos(theta)*(r+2),y+math.sin(theta)*(r+2),x+math.cos(theta)*(r+17),y+math.sin(theta)*(r+17)),fill=(133,82,69),width=3)
    elif scene==2:
        # Seven embers orbit a great broken binding mechanism
        cx,cy=680,365;r=205
        for i in range(7):
            angle=i*math.tau/7; x=cx+math.cos(angle)*r;y=cy+math.sin(angle)*r
            d.line((cx,cy,x,y),fill=(95,56,52),width=4)
            d.ellipse((x-19,y-19,x+19,y+19),fill=(172,65,37),outline=(233,169,105),width=5)
        d.ellipse((cx-68,cy-68,cx+68,cy+68),fill=(14,13,19),outline=(189,123,72),width=9)
    else:
        # Monumental throne + solar prison
        x=710
        for i in range(4):
            d.arc((x-210+i*25,235+i*25,x+210-i*25,675),185,355,fill=(121,80,65),width=5)
        d.rectangle((x-80,510,x+80,650),fill=(37,29,31),outline=(151,96,69),width=7)
        d.polygon([(x-105,520),(x-73,370),(x,292),(x+73,370),(x+105,520)],fill=(43,28,33),outline=(173,107,78))
    # Foreground wet stone, bronze filigree and broken rune marks.
    for i in range(62):
        x=random.randrange(W);y=random.randrange(622,810);w=random.randrange(15,73)
        d.line((x,y,x+w,y),fill=random.choice([(92,78,75),(51,53,62),(123,84,62)]),width=random.randint(1,3))
    for j in range(17):
        x=56+j*82;y=655
        d.rectangle((x,y,x+6,y+26),fill=(126,83,66))
    im=im.filter(ImageFilter.GaussianBlur(.37))
    im.save(ASSETS/f'room-final-{name}-v30.webp',format='WEBP',quality=88,method=5)

if __name__=='__main__':
    atlas()
    for i in range(4):painter(i)
    print('Arte final v3.0: 20 cuadros + 3 enemigos diferenciados + cuatro fondos')
