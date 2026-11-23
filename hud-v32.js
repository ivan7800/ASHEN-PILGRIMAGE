// HUD appearance is independent of game rules and saves.
export function hudTextForZone(zone = '') {
  return String(zone).length > 31 ? String(zone).slice(0,29) + '…' : String(zone);
}
export function renderCompactHud(ctx, {hp, stamina, flasks, desvelo, zone, area, percent, accent='#dfc0a0'}) {
  ctx.save();
  const x=14,y=14,w=222,h=114;
  const g=ctx.createLinearGradient(x,y,x,y+h);
  g.addColorStop(0,'rgba(7,12,18,.92)');g.addColorStop(1,'rgba(11,17,22,.78)');
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='rgba(186,154,115,.66)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  ctx.strokeStyle=accent;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x+8,y+7);ctx.lineTo(x+30,y+7);ctx.moveTo(x+w-30,y+h-7);ctx.lineTo(x+w-8,y+h-7);ctx.stroke();
  const cx=x+12;
  ctx.fillStyle='#42282c';ctx.fillRect(cx,y+12,196,11);
  ctx.fillStyle='#b94649';ctx.fillRect(cx,y+12,Math.round(196*Math.max(0,Math.min(1,hp/100))),11);
  ctx.strokeStyle='#d09d87';ctx.strokeRect(cx+.5,y+12.5,195,10);
  ctx.fillStyle='#293f41';ctx.fillRect(cx,y+29,165,6);
  ctx.fillStyle='#85b8a3';ctx.fillRect(cx,y+29,Math.round(165*Math.max(0,Math.min(1,stamina/100))),6);
  ctx.font='bold 12px Georgia';ctx.fillStyle='#e5d0b6';ctx.fillText('ASHEN PILGRIMAGE',cx,y+51);
  ctx.font='11px system-ui';ctx.fillStyle='#d6bea0';
  ctx.fillText(`AMPOLLAS ${flasks}    ${desvelo?'✦ DESVELO':'MUNDO VISIBLE'}`,cx,y+67);
  ctx.font='11px Georgia';ctx.fillStyle='#e3d7ca';
  ctx.fillText(hudTextForZone(zone),cx,y+84);
  ctx.font='10px system-ui';ctx.fillStyle='#aebcc1';
  const region=area>=31?'VII':area>=26?'VI':area>=22?'V':area>=16?'IV':area>=12?'III':area>=8?'II':area>=5?'I':'PRÓLOGO';
  ctx.fillText(`REGIÓN ${region}   ·   PEREGRINACIÓN ${percent}%`,cx,y+102);
  ctx.restore();
}
