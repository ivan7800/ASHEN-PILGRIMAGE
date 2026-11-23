"""Deterministic original pixel-art detailing of the existing king atlas; never touches source asset."""
from PIL import Image, ImageDraw
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=Image.open(root/'assets/king-v16.png').convert('RGBA')
assert src.size==(2560,160)
out=Image.new('RGBA',src.size)
for frame in range(20):
    tile=src.crop((frame*128,0,(frame+1)*128,160))
    # Decorative layers, executed at native pixel resolution. The atlas remains 20 x 128x160.
    d=ImageDraw.Draw(tile,'RGBA')
    # Crown rivets and uneven ochre engraving on pauldrons.
    for x in (46,55,65,76,85):
        d.point((x,21),fill=(255,221,150,255))
    for x in (23,31,38,89,97,103):
        d.line([(x,53),(x+3,55),(x,58)],fill=(210,161,106,225),width=1)
    # Bell of the drowned monarchy, radiating in warning frames.
    d.ellipse((60,79,72,93),fill=(18,19,24,255),outline=(225,172,98,255),width=2)
    d.rectangle((64,76,68,81),fill=(244,206,128,255))
    d.line([(62,85),(70,85)],fill=(255,227,160,255),width=1)
    d.ellipse((65,91,68,94),fill=(255,197,110,255))
    # Break the symmetry with red scripture on cape and tassets.
    for j in range(4):
        y=65+j*13
        d.line([(29,y),(32,y+3),(28,y+7)],fill=(205,83,81,255),width=1)
        d.line([(100,y+1),(97,y+5)],fill=(205,83,81,255),width=1)
    if frame in (8,10,11,18,19):
        # Weapon and flowing cloth clearly change between anticipation, strike and empowered release.
        offsets={8:(12,-27),10:(28,-42),11:(37,6),18:(3,-58),19:(41,-19)}
        xx,yy=offsets[frame]
        d.polygon([(95,63),(98+xx//3,52+yy//3),(103+xx,18+yy),(107+xx,20+yy),(105+xx//3,56+yy//3)],fill=(170,178,186,255))
        d.line([(100,56),(101+xx//2,41+yy//2)],fill=(245,221,177,255),width=3)
        d.line([(94,61),(106,65)],fill=(242,184,111,255),width=3)
        for j in range(3):
            d.line([(21,69+j*11),(10-j*3,70+j*13+((frame%3)-1)*4)],fill=(154,42,49,230),width=3)
    if frame in (10,11,19):
        # In-sprite slash trails for the strike/release frames.
        accent=(252,115,68,225) if frame==19 else (235,202,147,195)
        d.arc((75,-20,159,92),290,345,fill=accent,width=3)
        d.arc((80,-15,156,88),292,335,fill=(250,227,172,140),width=1)
    if frame in (18,19):
        for x,y in [(38,29),(93,26),(58,47),(81,60)]:
            d.point((x,y),fill=(255,92,58,255))
            d.point((x+1,y),fill=(255,169,92,255))
    out.paste(tile,(frame*128,0))
out.save(root/'assets/king-v18.png',optimize=True)
# contact sheet with native resolution scaled for review
sheet=Image.new('RGBA',(128*5,160*4),(15,16,22,255))
for i in range(20):sheet.alpha_composite(out.crop((i*128,0,(i+1)*128,160)),((i%5)*128,(i//5)*160))
sheet.resize((1280,1280),Image.Resampling.NEAREST).convert('RGB').save(root/'docs/REY-v1.8-ATLAS.png')
print('king-v18.png generated, 20 poses')
