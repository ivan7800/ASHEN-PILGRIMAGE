#!/usr/bin/env python3
"""Regenerate seven original 12-frame pixel-art atlases; needs Pillow.
Run: python tools/generate-pixel-art.py
"""
from PIL import Image, ImageDraw
from pathlib import Path
import math
assets=Path(__file__).resolve().parents[1]/'assets'
P={'line':'#10151c','black':'#19212a','shadow':'#28323b','steel':'#48525a','metal':'#798486','light':'#b3b6a8','ivory':'#ead8b6','gold':'#b99461','bright':'#e2ba78','rust':'#854342','red':'#8c2734','scarlet':'#bf4652','cape':'#531c29','bone':'#cdbfa7','purp':'#60496d','violet':'#a38fb8','shroud':'#37313f','white':'#ebe5d4'}
S=2

def atlas(kind):
    out=Image.new('RGBA',(128*12,160),(0,0,0,0))
    for frame in range(12):
        im=Image.new('RGBA',(64,80),(0,0,0,0)); d=ImageDraw.Draw(im)
        # 0-3 walk, 4-5 idle, 6 jump, 7 evade, 8-11 attack, 7 damage for hostile sprites
        stride=[-5,0,5,0][frame] if frame<4 else 0
        breathe=frame==5
        jump=frame==6
        roll=frame==7
        swing=frame-8 if frame>=8 else -1
        dx=(3 if swing>=2 else -2 if roll else 0)
        bx=31+dx; by=5+(2 if breathe else -5 if jump else 8 if roll else 0)
        def poly(pts,color,outline=None,width=1):d.polygon([(int(x),int(y)) for x,y in pts],fill=color);outline and d.line([(int(x),int(y)) for x,y in pts+[pts[0]]],fill=outline,width=width)
        def rect(a,c,border=None):d.rectangle(tuple(map(int,a)),fill=c,outline=border)
        def line(pts,c,w=1):d.line([(int(x),int(y)) for x,y in pts],fill=c,width=w)
        def circ(a,c,border=None):d.ellipse(tuple(map(int,a)),fill=c,outline=border)
        if kind in ('pilgrim','caldris','warden'):
            heavy=kind=='warden'; royal=kind=='caldris'; rad=1.22 if heavy else 1
            helm_y=by+(2 if heavy else 0)
            # Torn cape with folds, asymmetrical readable silhouette
            tail=9+(frame%4)*2 if frame<4 else 4 if frame in (4,5) else 12
            cape=P['rust'] if royal else P['red']
            poly([(bx-7,by+25),(bx-20-tail//2,by+37),(bx-24-tail,by+64),(bx-14,by+58),(bx-12,by+72),(bx+7,by+60),(bx+4,by+26)],P['line'])
            poly([(bx-8,by+26),(bx-17-tail//2,by+40),(bx-21-tail,by+62),(bx-13,by+56),(bx-10,by+68),(bx+5,by+59),(bx+2,by+27)],cape)
            poly([(bx-7,by+27),(bx-13,by+38),(bx-16,by+53),(bx-9,by+58)],P['scarlet'] if not royal else P['gold'])
            line([(bx-8,by+33),(bx-16,by+55),(bx-10,by+61)],P['cape'],2)
            # Shin plates / walking articulation
            for side in (-1,1):
                footshift=(stride*side if frame<4 else (9 if jump else -7 if roll else 0))
                x=bx+side*7+footshift//2
                y=by+55
                poly([(x-5,y-3),(x+4,y-3),(x+3,y+12),(x+5+footshift//2,y+17),(x-7+footshift//2,y+17),(x-4,y+10)],P['black'],P['line'])
                poly([(x-4,y),(x+3,y),(x+2,y+10),(x-4,y+11)],P['metal'])
                rect((x-5+footshift//2,y+15,x+7+footshift//2,y+19),P['steel'],P['line'])
                line([(x-2,y+3),(x+2,y+3)],P['light'])
            # torso scale armor
            poly([(bx-13,by+23),(bx-16,by+34),(bx-12,by+55),(bx+12,by+55),(bx+17,by+34),(bx+12,by+22)],P['steel'],P['line'],2)
            poly([(bx-11,by+27),(bx-12,by+40),(bx-5,by+49),(bx+5,by+49),(bx+12,by+39),(bx+9,by+27)],P['shadow'])
            for j in range(3):
                line([(bx-8,by+35+j*5),(bx+9,by+35+j*5)],P['metal'])
            poly([(bx-13,by+50),(bx+14,by+50),(bx+12,by+59),(bx-11,by+59)],P['rust'] if royal else P['black'],P['line'])
            for j in range(4):
                rect((bx-10+j*6,by+53,bx-9+j*6,by+56),P['gold'])
            # bell embedded in breastplate
            circ((bx-4,by+34,bx+5,by+43),'#653326',P['gold']);rect((bx-2,by+37,bx+3,by+42),P['bright']);circ((bx,by+41,bx+2,by+43),P['line'])
            # shoulders pauldrons
            for side in (-1,1):
                x=bx+side*14
                poly([(x-7,by+22),(x+6,by+24),(x+8,by+35),(x-7,by+34)],P['metal'],P['line'],2)
                line([(x-5,by+27),(x+5,by+28)],P['light'])
                for j in range(3):rect((x-3+j*3,by+31,x-2+j*3,by+32),P['gold'])
                poly([(x-3,by+34),(x+5,by+34),(x+5,by+50),(x-3,by+48)],P['steel'],P['line'])
            # Head/helmet with slit and spiked mourning crown
            poly([(bx-10,helm_y+18),(bx-12,helm_y+8),(bx-7,helm_y+1),(bx+6,helm_y+1),(bx+11,helm_y+10),(bx+10,helm_y+22)],P['steel'],P['line'],2)
            poly([(bx-9,helm_y+8),(bx-5,helm_y+3),(bx+5,helm_y+3),(bx+9,helm_y+8)],P['metal'])
            for sx in (-8,-3,3,8):
                line([(bx+sx,helm_y+5),(bx+sx+(-2 if sx<0 else 2),helm_y-3 if royal or heavy else helm_y)],P['gold'])
            rect((bx-9,helm_y+12,bx+9,helm_y+16),P['line'])
            rect((bx-7,helm_y+13,bx+7,helm_y+14),P['bright'] if heavy else '#d9a88c')
            for xx in (bx-5,bx-1,bx+3):rect((xx,helm_y+16,xx+1,helm_y+22),P['metal'])
            line([(bx-8,helm_y+22),(bx+8,helm_y+22)],P['light'])
            # crown halo
            if royal or heavy:
                d.arc((bx-15,helm_y-12,bx+15,helm_y+18),195,345,fill=P['gold'],width=1)
                for ang in (210,240,270,300,330):
                    a=math.radians(ang);xx=bx+16*math.cos(a);yy=helm_y+2+16*math.sin(a)
                    line([(xx,yy),(xx+6*math.cos(a),yy+6*math.sin(a))],P['gold'],1)
            # Weapon pose distinctly different for 8..11
            if royal:
                ang=[-7,-10,-3,2][swing] if swing>=0 else -8
                line([(bx+22,by+49),(bx+22+ang,by-5)],P['black'],5)
                line([(bx+22,by+49),(bx+22+ang,by-5)],P['gold'],2)
                poly([(bx+19+ang,by-5),(bx+22+ang,by-18),(bx+25+ang,by-5)],P['ivory'],P['line'])
                poly([(bx-24,by+27),(bx-12,by+32),(bx-11,by+57),(bx-27,by+57)],P['metal'],P['gold'])
                for j in range(3):line([(bx-21+j*3,by+35),(bx-20+j*3,by+53)],P['gold'])
            else:
                # sword length and rotation varies by swing frame
                angle=[-1.25,-.4,.6,1.2][swing] if swing>=0 else .5
                if roll:angle=1.5
                sx=bx+16; sy=by+44
                ex=sx+int(math.cos(angle)*37);ey=sy-int(math.sin(angle)*37)
                line([(sx,sy),(ex,ey)],P['line'],6)
                line([(sx,sy),(ex,ey)],P['light'],3)
                line([(sx,sy),(ex,ey)],P['ivory'])
                line([(sx-6,sy-3),(sx+5,sy+3)],P['gold'],3)
                if swing>=0:line([(ex-3,ey-2),(ex+4,ey+1)],P['bright'])
            if heavy:
                # fractured horns and chains distinguish the boss
                for side in (-1,1):
                    poly([(bx+side*9,helm_y+3),(bx+side*17,helm_y-14),(bx+side*15,helm_y+8)],P['bone'],P['line'])
                    for j in range(3):line([(bx+side*15,by+38+j*6),(bx+side*21,by+42+j*6)],P['gold'])
                for j in range(4):rect((bx-16+j*10,by+51,bx-15+j*10,by+56),P['scarlet'])
        elif kind=='gravebound':
            # Uneven silhouette, enormous grave-digger's shovel and corpse burden
            poly([(bx-14,by+25),(bx-26,by+29),(bx-29,by+47),(bx-20,by+60),(bx-8,by+52),(bx+14,by+62),(bx+18,by+33)],P['shroud'],P['line'],2)
            for j in range(5):line([(bx-22+j*7,by+52),(bx-24+j*8,by+67+(j%2)*3)],P['rust'])
            for side in (-1,1):
                x=bx+side*11+stride*side//2
                poly([(x-7,by+44),(x+4,by+42),(x+7,by+70),(x-8,by+72)],P['steel'],P['line'],2)
                rect((x-8,by+69,x+8,by+74),P['bone'],P['line'])
            poly([(bx-19,by+26),(bx-10,by+19),(bx+12,by+23),(bx+18,by+51),(bx-16,by+54)],P['rust'],P['line'],2)
            poly([(bx-14,by+30),(bx-10,by+27),(bx+14,by+34),(bx+7,by+48),(bx-10,by+48)],P['shadow'])
            # back frame with skulls
            poly([(bx-13,by+22),(bx-10,by+4),(bx+12,by+9),(bx+21,by+29)],P['steel'],P['line'])
            for sx,sy in [(-12,12),(6,17),(16,26)]:
                circ((bx+sx-4,by+sy-4,bx+sx+5,by+sy+5),P['bone'],P['line']);rect((bx+sx-2,by+sy,bx+sx,by+sy+2),P['line']);rect((bx+sx+3,by+sy,bx+sx+4,by+sy+2),P['line'])
            # faceless shadow hood with narrow red pupils
            poly([(bx-13,by+21),(bx-14,by+7),(bx-4,by-3),(bx+10,by+4),(bx+13,by+21)],P['shroud'],P['line'],2)
            circ((bx-9,by+7,bx+9,by+26),P['line']);rect((bx-6,by+14,bx-4,by+15),P['scarlet']);rect((bx+4,by+14,bx+6,by+15),P['scarlet'])
            # hanging chains and huge shovel
            for j in range(6):rect((bx-16,by+30+j*4,bx-14,by+32+j*4),P['gold'])
            ex=bx+25+(swing*2 if swing>=0 else 0)
            line([(ex,by+15),(ex-5,by+63)],P['line'],5);line([(ex,by+15),(ex-5,by+63)],P['bone'],2)
            poly([(ex-13,by+56),(ex+6,by+53),(ex+7,by+68),(ex-4,by+75),(ex-15,by+66)],P['steel'],P['line'],2)
            line([(ex-8,by+63),(ex+3,by+61)],P['light'])
        elif kind=='mourner':
            lean=int(2*math.sin(frame*.55))
            # flowing fabric, deep purples with ivory mask, no legs
            poly([(bx-8,by+23),(bx-18,by+42),(bx-30,by+67),(bx-18,by+62),(bx-22,by+77),(bx,by+67),(bx+19,by+77),(bx+16,by+60),(bx+28,by+68),(bx+16,by+34)],P['line'])
            poly([(bx-9,by+22),(bx-16,by+43),(bx-26,by+65),(bx-12,by+57),(bx-18,by+73),(bx,by+62),(bx+17,by+73),(bx+11,by+56),(bx+24,by+66),(bx+13,by+33)],P['purp'])
            poly([(bx-12,by+32),(bx-19,by+53),(bx-6,by+46),(bx-1,by+64)],P['shroud'])
            for j in range(6):line([(bx-21+j*8,by+56),(bx-26+j*9+lean,by+75-j%2*4)],P['violet'] if j%2 else P['shroud'])
            poly([(bx-12,by+16),(bx-15,by+2),(bx-4,by-3),(bx+11,by+4),(bx+13,by+19)],P['shroud'],P['line'],2)
            circ((bx-8,by+10,bx+8,by+29),P['bone'],P['line']);circ((bx-5,by+17,bx-2,by+21),P['line']);circ((bx+3,by+17,bx+6,by+21),P['line']);line([(bx,by+22),(bx-1,by+26)],P['line'],2)
            poly([(bx+13,by+30),(bx+31+lean,by+37),(bx+33+lean,by+43),(bx+15,by+37)],P['bone'],P['line'])
            for j in range(3):line([(bx+22+j*4+lean,by+42),(bx+25+j*5+lean,by+49)],P['violet'])
        elif kind=='maera':
            poly([(bx-8,by+20),(bx-18,by+37),(bx-22,by+73),(bx+20,by+73),(bx+14,by+36),(bx+7,by+21)],P['line'])
            poly([(bx-8,by+22),(bx-15,by+38),(bx-18,by+69),(bx+17,by+69),(bx+12,by+38),(bx+6,by+23)],'#4d3444')
            for j in (-1,1):poly([(bx+j*8,by+31),(bx+j*13,by+46),(bx+j*17,by+67),(bx+j*10,by+67)],P['rust'])
            poly([(bx-12,by+25),(bx-13,by+10),(bx-5,by+1),(bx+6,by+1),(bx+13,by+12),(bx+10,by+26)],P['shroud'],P['gold'])
            circ((bx-7,by+12,bx+7,by+29),P['bone'],P['line']);rect((bx-5,by+17,bx-2,by+18),P['line']);rect((bx+2,by+17,bx+5,by+18),P['line'])
            for j in range(3):line([(bx-12,by+38+j*8),(bx+12,by+38+j*8)],P['gold'])
            # illuminated lantern and manuscript
            line([(bx+18,by+28),(bx+19,by+42)],P['gold'],2);poly([(bx+13,by+42),(bx+24,by+42),(bx+22,by+54),(bx+14,by+54)],P['gold'],P['line']);rect((bx+17,by+45,bx+20,by+51),'#ffd08a')
            rect((bx-23,by+39,bx-8,by+53),P['bone'],P['line']);line([(bx-15,by+40),(bx-15,by+51)],P['gold'])
        elif kind=='saint':
            poly([(bx-9,by+17),(bx-18,by+32),(bx-26,by+71),(bx-8,by+65),(bx,by+74),(bx+17,by+64),(bx+25,by+74),(bx+13,by+27)],P['line'])
            poly([(bx-9,by+17),(bx-16,by+34),(bx-23,by+68),(bx-10,by+62),(bx,by+71),(bx+14,by+62),(bx+22,by+69),(bx+10,by+26)],P['white'])
            for j in (-1,1):poly([(bx+j*8,by+26),(bx+j*15,by+48),(bx+j*18,by+65),(bx+j*9,by+66)],P['bone'])
            poly([(bx-10,by+23),(bx-12,by+2),(bx,by-4),(bx+12,by+2),(bx+10,by+24)],P['white'],P['gold'])
            circ((bx-6,by+7,bx+6,by+24),P['bone'],P['line'])
            # no face whatsoever, sacred halo
            d.arc((bx-17,by-17,bx+17,by+17),190,350,fill=P['gold'],width=1)
            for angle in range(0,360,45):
                a=math.radians(angle);line([(bx+18*math.cos(a),by+18*math.sin(a)),(bx+24*math.cos(a),by+24*math.sin(a))],P['gold'])
            poly([(bx+10,by+29),(bx+31,by+28),(bx+35,by+33),(bx+12,by+34)],P['white'])
            for j in range(4):line([(bx-6+j*4,by+38),(bx-6+j*4,by+58)],P['gold'])
        # shared local pixel highlights for every atlas
        if kind in ('pilgrim','caldris','warden'):
            for sx,sy in [(-10,33),(-8,44),(8,46),(-6,61),(6,61)]:rect((bx+sx,by+sy,bx+sx+1,by+sy+1),P['light'])
        # nearest-neighbor scale; no anti-aliasing, true alpha
        out.paste(im.resize((128,160),Image.Resampling.NEAREST),(frame*128,0))
    out.save(assets/f'{kind}-v13.png',optimize=True)
    return out
for k in ('pilgrim','gravebound','mourner','warden','maera','caldris','saint'):
    im=atlas(k)
    print(k, im.size,(assets/f'{k}-v13.png').stat().st_size)
