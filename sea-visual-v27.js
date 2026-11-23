// Maritime depth plan. Pure functions so motion and visibility can be tested without a browser.
export const SEA_FIRST_CHAMBER=16;
export const SEA_LAST_CHAMBER=21;
export const SEA_COMBAT_FOG_MAX=.14;
export const SEA_FOREGROUND_ALPHA=.18;
export const SEA_LAYERS=Object.freeze([
  Object.freeze({key:'seaFar',factor:.09,alpha:.52,order:'behind'}),
  Object.freeze({key:'seaMid',factor:.31,alpha:.35,order:'behind'}),
  Object.freeze({key:'seaFoam',factor:1.12,alpha:SEA_FOREGROUND_ALPHA,order:'front'})
]);
export const isSeaRegion=area=>Number.isInteger(area)&&area>=SEA_FIRST_CHAMBER&&area<=SEA_LAST_CHAMBER;
export function seaLayerShift(camera,factor,screenWidth){
 if(!Number.isFinite(camera)||camera<0||!Number.isFinite(factor)||factor<=0||!Number.isFinite(screenWidth)||screenWidth<=0)throw new RangeError('Invalid parallax position');
 return (camera*factor)%screenWidth;
}
export function seaVisualPlan(area){
 return isSeaRegion(area)?SEA_LAYERS:[];
}
