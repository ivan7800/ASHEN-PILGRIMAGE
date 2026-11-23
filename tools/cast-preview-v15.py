from PIL import Image, ImageDraw,ImageFont
from pathlib import Path
root=Path(__file__).resolve().parents[1];assets=root/'assets';docs=root/'docs';docs.mkdir(exist_ok=True)
roster=[('El Portador de Ceniza','pilgrim-v14.png'),('Ser Caldris','caldris-v15.png'),('Maera','maera-v15.png'),('Santa Sin Rostro','saint-v15.png'),('Enterrador','gravebound-v15.png'),('Doliente','mourner-v15.png'),('Guardián','warden-v14.png'),('Guardia del Exilio','exile-v15.png'),('Vigía Erena','erena-v15.png')]
W=1120; cellW=210;cellH=270
out=Image.new('RGB',(W,940),'#121015');d=ImageDraw.Draw(out);d.text((40,22),'ASHEN PILGRIMAGE   ·   REPARTO PIXEL ART  v1.5',fill='#ddbaa1');d.line((35,53,W-35,53),fill='#9d6156',width=3)
for idx,(label,name) in enumerate(roster):
 col=idx%5;row=idx//5;x=32+col*216;y=95+row*390
 im=Image.open(assets/name).convert('RGBA').crop((4*128,0,5*128,160))
 im=im.resize((190,238),Image.Resampling.NEAREST)
 bg=Image.new('RGBA',im.size,'#252028');bg.alpha_composite(im)
 out.paste(bg.convert('RGB'),(x,y)); d.text((x,y+251),label,fill='#efc69d')
out.save(docs/'REPARTO-v1.5.png',optimize=True)
print(docs/'REPARTO-v1.5.png')
