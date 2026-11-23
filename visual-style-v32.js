// Graphics-only quality presets. No game state, physics, hitboxes or save schema changes.
export const GRAPHICS_MODES = ['cinematic', 'clarity', 'performance'];
export const GRAPHICS_LABELS = {
  cinematic: 'Cinematográfico',
  clarity: 'Legibilidad alta',
  performance: 'Rendimiento',
};
export const GRAPHICS_STORAGE_KEY = 'ashen-pilgrimage-graphics-v32';
export const DEFAULT_GRAPHICS_MODE = 'cinematic';
export function normalizeGraphicsMode(value) {
  return GRAPHICS_MODES.includes(value) ? value : DEFAULT_GRAPHICS_MODE;
}
export function nextGraphicsMode(current) {
  return GRAPHICS_MODES[(GRAPHICS_MODES.indexOf(normalizeGraphicsMode(current))+1) % GRAPHICS_MODES.length];
}
export function graphicsProfile(area, mode = DEFAULT_GRAPHICS_MODE) {
  const selected = normalizeGraphicsMode(mode);
  const snow = area >= 26 && area <= 30;
  const sea = area >= 16 && area <= 21;
  const final = area >= 31;
  const color = sea ? '#8fd3d4' : snow ? '#d5e9ef' : final ? '#e3b080' : area >= 22 ? '#c2ad8a' : '#dfc0a0';
  return {
    mode: selected,
    accent: color,
    layerFactor: selected === 'clarity' ? .42 : selected === 'performance' ? .2 : .68,
    foregroundFactor: selected === 'clarity' ? .18 : selected === 'performance' ? 0 : .44,
    fogFactor: selected === 'clarity' ? .24 : selected === 'performance' ? 0 : .45,
    vignette: selected === 'clarity' ? .11 : selected === 'performance' ? 0 : .22,
    dustCount: selected === 'clarity' ? 12 : selected === 'performance' ? 0 : 35,
    snowFactor: selected === 'clarity' ? .45 : selected === 'performance' ? .15 : .72,
    glowFactor: selected === 'clarity' ? .7 : selected === 'performance' ? 0 : 1,
  };
}
export function visibleTileStarts(camera, width, step=256) {
  if (![camera,width,step].every(Number.isFinite) || width<=0 || step<=0) return [];
  const start = Math.max(0,Math.floor(camera/step)*step);
  const end = camera + width;
  const tiles=[];
  for(let x=start;x<=end && tiles.length<=Math.ceil(width/step)+2;x+=step)tiles.push(x);
  return tiles;
}
