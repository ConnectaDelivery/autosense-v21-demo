export const DURATION=10000;
export const SCENES=['01 / The road ahead','02 / A closer perspective','03 / The Alco-Sense collection','04 / A clearer road ahead'];
export function sceneAt(ms){return ms<2000?0:ms<5000?1:ms<8000?2:3}
export function initHero(hero){
 const control=hero.querySelector('#motion-control'),skip=hero.querySelector('#motion-skip'),label=hero.querySelector('#scene-label'),progress=hero.querySelector('[role=progressbar]'),bar=progress.querySelector('i'),media=matchMedia('(prefers-reduced-motion: reduce)');
 // A single clock drives paused native compositor animations. No scroll dependency,
 // separate transition timers, invented internal components or sliced product photos.
 const reduceControl=hero.querySelector('#motion-reduce');let userReduced=false;
 const tracks=[];
 function track(selector,keyframes){const element=hero.querySelector(selector);if(!element?.animate)return;const animation=element.animate(keyframes,{duration:DURATION,fill:'both',easing:'linear'});animation.pause();tracks.push(animation)}
 track('.film-road',[{offset:0,opacity:1,transform:'scale(1.02)'},{offset:.2,opacity:1,transform:'scale(1.07)'},{offset:.48,opacity:0,transform:'scale(1.38)'},{offset:1,opacity:0,transform:'scale(1.38)'}]);
 track('.film-cabin',[{offset:0,opacity:0,transform:'scale(1.14)'},{offset:.2,opacity:0,transform:'scale(1.14)'},{offset:.47,opacity:1,transform:'scale(1.02)'},{offset:.8,opacity:.85,transform:'scale(1.07)'},{offset:1,opacity:.68,transform:'scale(1.07)'}]);
 track('.film-product',[{offset:0,opacity:0,transform:'translate(25px,45px) scale(.76) rotate(-7deg)'},{offset:.50,opacity:0,transform:'translate(25px,45px) scale(.76) rotate(-7deg)'},{offset:.68,opacity:1,transform:'translate(0,-8px) scale(1.025) rotate(2deg)'},{offset:.82,opacity:1,transform:'translate(0,0) scale(1) rotate(0deg)'},{offset:1,opacity:1,transform:'translate(0,0) scale(1) rotate(0deg)'}]);
 track('.product-signature',[{offset:0,opacity:0},{offset:.78,opacity:0},{offset:.92,opacity:1},{offset:1,opacity:1}]);
 if(tracks.length)hero.dataset.animated='true';
 let elapsed=0,last=null,paused=false,done=false,frame;
 function render(){hero.dataset.scene=String(sceneAt(elapsed));label.textContent=SCENES[sceneAt(elapsed)];const pct=Math.min(100,elapsed/DURATION*100);bar.style.width=`${pct}%`;progress.setAttribute('aria-valuenow',String(Math.round(pct)));tracks.forEach(a=>{a.currentTime=elapsed})}
 function finish(){cancelAnimationFrame(frame);elapsed=DURATION;done=true;paused=false;hero.classList.add('settled');hero.classList.remove('paused');render();control.textContent='Replay ↻';control.setAttribute('aria-label','Replay visual sequence');skip.hidden=true}
 function tick(now){if(paused||done)return;if(last!==null)elapsed+=now-last;last=now;render();if(elapsed>=DURATION)finish();else frame=requestAnimationFrame(tick)}
 function start(){const reduced=media.matches||userReduced;hero.classList.toggle?.('reduced',reduced);if(reduceControl){reduceControl.setAttribute('aria-pressed',String(reduced));reduceControl.textContent=reduced?'Motion on':'Motion off';reduceControl.disabled=media.matches;reduceControl.setAttribute('aria-label',media.matches?'Reduced motion follows your system setting':reduced?'Enable cinematic motion':'Reduce cinematic motion')}cancelAnimationFrame(frame);elapsed=0;last=null;done=false;paused=false;hero.classList.remove('settled','paused');control.textContent='Pause Ⅱ';control.setAttribute('aria-label','Pause visual sequence');skip.hidden=false;render();if(reduced){finish();control.hidden=true;return}control.hidden=false;frame=requestAnimationFrame(tick)}
 function pause(){paused=true;last=null;cancelAnimationFrame(frame);hero.classList.add('paused');control.textContent='Resume ▷';control.setAttribute('aria-label','Resume visual sequence')}
 control.addEventListener('click',()=>{if(done)start();else if(paused){paused=false;last=null;hero.classList.remove('paused');control.textContent='Pause Ⅱ';control.setAttribute('aria-label','Pause visual sequence');frame=requestAnimationFrame(tick)}else pause()});
 reduceControl?.addEventListener('click',()=>{userReduced=!userReduced;start()});skip.addEventListener('click',finish);media.addEventListener('change',start);document.addEventListener('visibilitychange',()=>{if(document.hidden&&!done&&!paused)pause()});start();
}
