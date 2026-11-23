// Independent of browser DOM. Converts standard Gamepad buttons into debounced menu intentions.
export function menuIntent(gamepad,previous={up:false,down:false,confirm:false,back:false,start:false}){
 const buttons=gamepad?.buttons||[];
 const axes=gamepad?.axes||[];
 const curr={up:!!(buttons[12]?.pressed||(axes[1]??0)<-.62),down:!!(buttons[13]?.pressed||(axes[1]??0)>.62),confirm:!!(buttons[0]?.pressed),back:!!(buttons[1]?.pressed),start:!!(buttons[9]?.pressed)};
 return {event:curr.up&&!previous.up?'up':curr.down&&!previous.down?'down':curr.confirm&&!previous.confirm?'confirm':curr.back&&!previous.back?'back':curr.start&&!previous.start?'start':null,state:curr};
}
export function nextMenuIndex(current,length,direction){if(length<=0)return -1;return ((current+direction)%length+length)%length}
