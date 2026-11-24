#!/usr/bin/env python3
"""Remaster the eight boss atlases on a consistent 2x pixel grid.

The existing animation timing and 20-frame layout are part of the runtime
contract. This pass only changes the visual sampling, palette and silhouette
edge, so combat and frame selection remain untouched.
"""
from pathlib import Path
from PIL import Image, ImageFilter

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets'
BOSSES={
    'warden-v14.png':(34,58,67), 'king-v21.png':(82,54,38),
    'mother-v20.png':(78,39,72), 'archivist-v22.png':(79,63,43),
    'bride-v25.png':(35,77,78), 'gardener-v26.png':(46,76,39),
    'bellgiant-v29.png':(84,57,35), 'firstwitness-v30.png':(91,40,31),
}

def remaster(path, accent):
    src=Image.open(path).convert('RGBA')
    if src.size!=(2560,160): raise SystemExit(f'{path.name}: tamaño inesperado {src.size}')
    out=Image.new('RGBA',src.size,(0,0,0,0))
    for i in range(20):
        frame=src.crop((i*128,0,(i+1)*128,160))
        alpha=frame.getchannel('A')
        # Pixel grid 2x: reduce the source before enlarging with nearest-neighbour.
        rgb=frame.convert('RGB').resize((64,80),Image.Resampling.LANCZOS)
        rgb=rgb.quantize(colors=28,method=Image.Quantize.MEDIANCUT).convert('RGB')
        pix=rgb.load()
        ar,ag,ab=accent
        for y in range(80):
            for x in range(64):
                r,g,b=pix[x,y]
                # Pull shadows toward the encounter's authored accent without
                # flattening highlights or the sprite's original identity.
                lum=(r+g+b)/3
                if lum<92:
                    pix[x,y]=(int(r*.72+ar*.28),int(g*.72+ag*.28),int(b*.72+ab*.28))
        rgb=rgb.resize((128,160),Image.Resampling.NEAREST)
        mask=alpha.resize((64,80),Image.Resampling.LANCZOS).resize((128,160),Image.Resampling.NEAREST)
        # One-pixel stepped edge keeps the sprite readable against dark rooms.
        edge=mask.filter(ImageFilter.MaxFilter(3))
        edge=Image.eval(edge,lambda v: min(v,105))
        rgba=Image.merge('RGBA',(*rgb.split(),mask))
        under=Image.new('RGBA',(128,160),(8,10,14,0)); under.putalpha(edge)
        out.alpha_composite(under,(i*128,0));out.alpha_composite(rgba,(i*128,0))
    out.save(path,optimize=True)

for name,accent in BOSSES.items():
    remaster(ASSETS/name,accent)
    print(name, (ASSETS/name).stat().st_size)
