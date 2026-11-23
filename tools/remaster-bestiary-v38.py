#!/usr/bin/env python3
"""Regenerate 23 v3.8 pixel atlases from the project's authorized concept art.
The poses use silhouette-specific segmented cutout rigs and procedural action FX,
NOT individually hand-drawn skeletal animation. Re-runnable from the same source.
Requires Pillow and NumPy, used by build-bestiary-v37.py.
"""
from pathlib import Path
import subprocess,sys,math
from PIL import Image,ImageDraw,ImageFont
BASE=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(BASE/'tools/build-bestiary-v37.py')],cwd=BASE,check=True,stdout=subprocess.DEVNULL)
DEST=BASE/'assets/bestiary-v37'
FAMILIES={
'blade':'corruptpilgrim severedmonk namelessdrowned',
'shield':'vesperaguard ruinsentinel',
'hunter':'cryptscavenger ashhound crustplague',
'apparition':'wailingspecter abyssraven',
'ritual':'sunfanatic rottensiren fungalsporer sporematriarch voidherald dreamweaver namecorrupter',
'leviathan':'brineworm sigilabomination devotedflesh',
'brute':'chainedcastaway saltgolem disfigured',
}
RIG={name:family for family,names in FAMILIES.items() for name in names.split()}
assert len(RIG)==23
CELL=(128,160)
def center_composite(dst,src,dx=0,dy=0):
    bbox=src.getbbox()
    if bbox is None:return
    crop=src.crop(bbox)
    x=64-crop.width//2+int(dx);y=158-crop.height+int(dy)
    dst.alpha_composite(crop,(x,y))
def pose(src,f,rig):
    out=Image.new('RGBA',CELL)
    if f<=7:
        move= (math.sin(f*math.pi/2)*3 if rig not in ('brute','shield') else math.sin(f*math.pi/2)*1.3)
        rise=(-2 if f%4 in (1,2) else 0)
        if rig in ('ritual','apparition'):rise+=int(4*math.sin(f*.83))
        if rig=='hunter':move*=1.7
        center_composite(out,src,move,rise)
    elif f<=9:
        x={'blade':-4,'shield':-2,'hunter':-9,'apparition':0,'ritual':-3,'leviathan':-4,'brute':-2}[rig]
        h={'hunter':.91,'brute':.91,'leviathan':.92}.get(rig,1.035)
        transformed=src.resize((128,max(1,round(160*h))),Image.Resampling.NEAREST)
        center_composite(out,transformed,x,-4 if rig in ('ritual','apparition') else 0)
    elif f<=13:
        k=(f-10)/3
        lunge={'blade':11,'shield':7,'hunter':20,'apparition':6,'ritual':2,'leviathan':9,'brute':8}[rig]
        scale={'blade':1.04,'shield':1.01,'hunter':1.12,'apparition':1,'ritual':1.03,'leviathan':1.06,'brute':1.035}[rig]
        # Upper body advances before the feet; movements are joined by a small 4px overlap.
        seam=int(160*({'hunter':.53,'leviathan':.60,'apparition':.66}.get(rig,.68)))
        upper=src.crop((0,0,128,seam+4));lower=src.crop((0,seam-4,128,160))
        leg=Image.new('RGBA',CELL);leg.alpha_composite(lower,(0,seam-4));
        if rig=='hunter':leg=leg.resize((round(128*scale),160),Image.Resampling.NEAREST)
        center_composite(out,leg,-3+(f-10)*2,0)
        head=Image.new('RGBA',CELL);head.alpha_composite(upper,(0,0))
        if rig in ('ritual','apparition'):offset=-3-5*math.sin(math.pi*k)
        else:offset=-4*math.sin(math.pi*k)
        rotated=head.rotate((k-.5)*(-3 if rig=='brute' else 4),Image.Resampling.NEAREST,center=(64,seam),expand=False)
        out.alpha_composite(rotated,(round(lunge*(.30+k*.7)),round(offset)))
        # Add a small afterimage rather than hiding the silhouette during each attack.
        if rig in ('apparition','ritual'):
            ghost=out.copy();ghost.putalpha(ghost.getchannel('A').point(lambda a:round(a*.20)))
            out.alpha_composite(ghost,(-6,0))
    elif f<=15:
        center_composite(out,src,(f-14)*(-2),0)
    elif f==16:
        tilted=src.rotate(-8 if rig not in ('hunter','leviathan') else -3,Image.Resampling.NEAREST,center=(64,140),expand=False)
        center_composite(out,tilted,-7,3)
    else:
        k=f-17
        # Death: lower silhouette collapses, head tilts, translucency increases.
        squat=src.resize((128,max(1,round(160*(1-.16*k)))),Image.Resampling.NEAREST)
        tilted=squat.rotate(-8-9*k,Image.Resampling.NEAREST,center=(65,138),expand=False)
        center_composite(out,tilted,k*4,k*5)
        out.putalpha(out.getchannel('A').point(lambda a:round(a*(1-.23*k))))
    return out

def accents(frame,index,rig,color):
    # Pixel-sharp, rig-specific action animation in a separate layer.
    if index not in (8,9,10,11,12,13,16,17,18,19):return
    fx=Image.new('RGBA',CELL)
    d=ImageDraw.Draw(fx)
    red=(240,172,113,190);violet=(186,143,235,180);blue=(137,206,218,170)
    if index in (8,9):
        if rig=='ritual':
            d.ellipse((82,35,112,65),outline=violet,width=2)
            for x,y in [(98,25),(116,50),(97,76),(78,51)]:d.line((98,50,x,y),fill=violet,width=2)
        elif rig=='apparition':
            d.arc((5,16,121,149),60,130,fill=blue,width=3)
        elif rig=='hunter':
            d.line((34,146,105,146),fill=red,width=3)
            d.polygon([(101,139),(119,147),(101,155)],fill=red)
        elif rig=='brute':d.line((18,149,108,149),fill=red,width=3)
        elif rig=='shield':d.arc((75,33,126,123),250,490,fill=red,width=4)
        else:d.arc((7,14,123,144),235,321,fill=red,width=3)
    if 10<=index<=13:
        k=index-10
        if rig=='blade':d.arc((25,8,154,140),260-17*k,336+16*k,fill=red,width=5)
        elif rig=='shield':
            d.polygon([(88,38),(111+3*k,54),(111+3*k,120),(90,133)],outline=red,width=3)
        elif rig=='hunter':
            for dy in (0,10,19):d.line((18,130+dy,93,130+dy),fill=(227,157,124,110+25*k),width=2)
        elif rig=='apparition':
            for j in range(3):d.line((80,49+10*j,124,39+10*j),fill=blue,width=2)
        elif rig=='ritual':
            d.ellipse((91,34,124,68),outline=violet,width=3)
            d.arc((78,23,135,79),25*k,240+25*k,fill=violet,width=2)
        elif rig=='leviathan':
            d.ellipse((90,59,125,88),outline=red,width=2)
            for j in range(3):d.line((114+j*6,70,123+j*6,65-j*8),fill=red,width=2)
        elif rig=='brute':
            d.line((16,150,111,150),fill=red,width=4)
            d.line((73,115,66,151,49,155),fill=red,width=3)
    if index>=17:
        for t in range(7):
            x=24+(t*17+index*7)%91;y=44+(t*19+index*9)%110
            d.rectangle((x,y,x+2,y+2),fill=(205,155,128,110+20*(19-index)))
    frame.alpha_composite(fx)

names=sorted(RIG)
for name in names:
    old=Image.open(DEST/f'{name}.png').convert('RGBA')
    base=old.crop((0,0,128,160))
    atlas=Image.new('RGBA',(2560,160))
    for f in range(20):
        cell=pose(base,f,RIG[name]);accents(cell,f,RIG[name],name)
        atlas.alpha_composite(cell,(f*128,0))
    atlas.save(DEST/f'{name}.png',optimize=True)
# contact is derived from actual output atlas cells, not a concept-board mockup
preview=Image.new('RGB',(1280,6*215+42),(9,13,18))
d=ImageDraw.Draw(preview)
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(fontpath,13) if Path(fontpath).exists() else ImageFont.load_default()
d.text((12,12),'ASHEN PILGRIMAGE v3.8 | 23 criaturas | quieto, aviso, impacto, muerte',font=font,fill=(239,213,180))
for j,name in enumerate(names):
    col=j%4;row=j//4;x=9+col*320;y=39+row*215
    atlas=Image.open(DEST/f'{name}.png').convert('RGBA')
    for fi,f in enumerate((4,9,11,18)):
        cell=atlas.crop((f*128,0,(f+1)*128,160));cell.thumbnail((73,123))
        preview.paste(cell,(x+fi*77,y),cell)
    d.text((x+4,y+128),name,font=font,fill=(219,187,157))
preview.save(BASE/'docs/BESTIARIO-ANIMACION-v3.8.jpg',quality=87,optimize=True)
print('OK: 23 atlas cutout-rig, 20 frames each; contact',BASE/'docs/BESTIARIO-ANIMACION-v3.8.jpg')
