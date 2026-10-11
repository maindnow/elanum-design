'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const ns = 'http://www.w3.org/2000/svg';
const svgElement = (name, attrs = {}) => {
  const element = document.createElementNS(ns, name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
};
let toastTimer;
function notify(message) {
  $('#toast').textContent = message; $('#toast').classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2300);
}
async function copyText(value, message) {
  try { await navigator.clipboard.writeText(value); }
  catch {
    const field = document.createElement('textarea');
    field.value = value; field.style.position = 'fixed'; field.style.opacity = '0';
    document.body.append(field); field.select();
    const copied = document.execCommand('copy'); field.remove();
    if (!copied) { notify('Bitte den Wert markieren und manuell kopieren.'); return; }
  }
  notify(message);
}

// Navigation remains usable independently of decorative motion.
const mobile = matchMedia('(max-width:800px)');
function setMenu(open) {
  $('#sidebar').dataset.open = String(open);
  $('#menuToggle').setAttribute('aria-expanded', open);
  $('#menuToggle').setAttribute('aria-label', open ? 'Navigation schliessen' : 'Navigation öffnen');
  $('#menuScrim').hidden = !open;
  document.body.style.overflow = open && mobile.matches ? 'hidden' : '';
}
$('#menuToggle').addEventListener('click', () => setMenu($('#sidebar').dataset.open !== 'true'));
$('#menuScrim').addEventListener('click', () => setMenu(false));
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && $('#sidebar').dataset.open === 'true') { setMenu(false); $('#menuToggle').focus(); }
});
const navLinks = $$('.sidebar nav a');
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
const sections = $$('main > section[id]');
function updateNavigation() {
  let id = 'intro';
  for (const section of sections) if (section.getBoundingClientRect().top <= 170) id = section.id;
  navLinks.forEach(link => {
    const active = link.hash === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
addEventListener('scroll', updateNavigation, {passive: true}); updateNavigation();

// Shared, circular relationship geometry. One clock updates contours and their connections together.
const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
let paused = false, elapsed = 0, lastTime = 0, frameId = 0, previousPhase = '';
let labMode = 'spectrum';
const target = {proximity: 58, resonance: 72, openness: 34};
const current = {...target};
const frames = $$('[data-resonance]').map((container, index) => {
  const svg = $('svg', container), dark = container.dataset.dark === 'true';
  const ink = dark ? '#E8EEEA' : '#16363B';
  const defs = svgElement('defs');
  const gradient = svgElement('linearGradient', {id: 'relationship-gradient-' + index, gradientUnits: 'userSpaceOnUse', x1: 320, y1: 200, x2: 400, y2: 200});
  const colors = dark ? ['#B4A4FF','#8DBBFF','#D7B0F1','#F4A5C7','#F9B8CD'] : ['#6756D9','#4D7FE8','#9466DF','#D85BA9','#F0719A'];
  [0, .28, .53, .77, 1].forEach((offset, i) => gradient.append(svgElement('stop', {offset, 'stop-color': colors[i]})));
  const reliefGradient=svgElement('linearGradient',{id:'relief-fill-'+index,x1:'0%',y1:'0%',x2:'100%',y2:'100%'});
  [[0,dark?'#365359':'#FCF9F0'],[1,dark?'#1A343A':'#E2DBCD']].forEach(([offset,color])=>reliefGradient.append(svgElement('stop',{offset,'stop-color':color})));
  defs.append(gradient,reliefGradient); svg.append(defs);
  const discA=svgElement('circle',{fill:`url(#relief-fill-${index})`,class:'relief-disc'}),discB=discA.cloneNode();
  svg.append(discA,discB);
  const contour = () => svgElement('path', {fill: 'none', stroke: ink, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', 'data-contour': ''});
  const a = contour(), b = contour();
  const bridge = svgElement('path', {fill:'none',stroke:'url(#relationship-gradient-' + index + ')','stroke-width':2.8,'stroke-linecap':'round','vector-effect':'non-scaling-stroke','data-bridge':''});
  const nodeA = svgElement('circle', {r:3.3, fill:ink, 'data-node':'a'}), nodeB = svgElement('circle', {r:3.3, fill:ink, 'data-node':'b'});
  svg.append(a,b,bridge,nodeA,nodeB);
  return {container, svg, gradient, discA,discB,a,b,bridge,nodeA,nodeB,ink, id:index, visible:false, labelA:$('[data-person=a]',container),labelB:$('[data-person=b]',container)};
});
function breathAt(time) {
  const t = time % 7800;
  return t < 3400 ? (1-Math.cos(Math.PI*t/3400))/2 : (1+Math.cos(Math.PI*(t-3400)/4400))/2;
}
function drawRelationship(frame, breath) {
  const state = frame.container.dataset.resonance === 'lab' ? current : {proximity:58,resonance:72,openness:34};
  const radius = 128 * (1 + .075 * breath), cy = 200;
  const cxA = 172 + state.proximity * .4, cxB = 720 - cxA;
  [[frame.discA,cxA],[frame.discB,cxB]].forEach(([disc,cx])=>{disc.setAttribute('cx',cx);disc.setAttribute('cy',cy);disc.setAttribute('r',radius-5);});
  const halfGap = (8 + state.openness * .4) * Math.PI / 180;
  const dx = radius*Math.sin(halfGap), dy = radius*Math.cos(halfGap);
  const path = cx => `M${cx-dx} ${cy+dy} A${radius} ${radius} 0 1 1 ${cx+dx} ${cy+dy}`;
  frame.a.setAttribute('d',path(cxA)); frame.b.setAttribute('d',path(cxB));
  frame.a.dataset.radius = frame.b.dataset.radius = radius.toFixed(5);
  const xA = cxA + radius, xB = cxB - radius, distance = xB - xA;
  const bend = Math.min(28,distance*.3)*(1-.65*breath);
  frame.bridge.setAttribute('d',`M${xA} ${cy} C${xA+distance*.32} ${cy+bend} ${xB-distance*.32} ${cy+bend} ${xB} ${cy}`);
  frame.bridge.setAttribute('opacity',state.resonance === 0 ? 0 : (.25 + .75*state.resonance/100) * (.82+.18*breath));
  frame.bridge.setAttribute('stroke-width',1.5+state.resonance*.018);
  frame.bridge.setAttribute('stroke',labMode==='ink' && frame.container.dataset.resonance==='lab' ? frame.ink : `url(#relationship-gradient-${frame.id})`);
  frame.gradient.setAttribute('x1',xA); frame.gradient.setAttribute('x2',xB);
  [[frame.nodeA,xA],[frame.nodeB,xB]].forEach(([node,x])=>{node.setAttribute('cx',x);node.setAttribute('cy',cy);node.setAttribute('opacity',state.resonance===0 ? 0 : 1);});
  frame.labelA.style.left = cxA/720*100+'%';frame.labelB.style.left=cxB/720*100+'%';
}
function moving() { return !paused && !reducedMotion.matches && !document.hidden; }
function unsettled() { return Object.keys(target).some(key=>Math.abs(target[key]-current[key])>.02); }
function render(time) {
  frameId=0;
  const dt = lastTime ? Math.min(48,time-lastTime) : 0; lastTime=time;
  const anyVisible = frames.some(frame=>frame.visible);
  if(moving() && anyVisible) elapsed+=dt;
  const smoothing = reducedMotion.matches ? 1 : 1-Math.exp(-dt/75);
  Object.keys(target).forEach(key=>{current[key]+= (target[key]-current[key])*smoothing;if(Math.abs(target[key]-current[key])<.02)current[key]=target[key];});
  const breath = reducedMotion.matches ? 0 : breathAt(elapsed);
  frames.forEach(frame=>{if(frame.visible)drawRelationship(frame,breath);});
  const phase = reducedMotion.matches ? 'Reduzierte Bewegung · ruhende Darstellung' : paused ? 'Bewegung pausiert' : elapsed%7800<3400 ? 'Raum geben' : 'Zur Ruhe kommen';
  if(phase!==previousPhase){$('#breathPhase').textContent=phase;previousPhase=phase;}
  if((moving() && anyVisible) || unsettled())frameId=requestAnimationFrame(render);else lastTime=0;
}
function requestRender(){if(!frameId){lastTime=0;frameId=requestAnimationFrame(render);}}
frames.forEach(frame=>drawRelationship(frame,0));
const visibility = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{const frame=frames.find(f=>f.container===entry.target);frame.visible=entry.isIntersecting;if(frame.visible)drawRelationship(frame,reducedMotion.matches?0:breathAt(elapsed));});requestRender();
},{threshold:.05});
frames.forEach(frame=>visibility.observe(frame.container));
document.addEventListener('visibilitychange',()=>{lastTime=0;requestRender();});
function syncMotionButtons(){
  document.body.dataset.motion = paused || reducedMotion.matches ? 'off' : 'on';
  if (paused || reducedMotion.matches) document.getAnimations().forEach(animation=>animation.finish());
  $$('[data-motion-toggle]').forEach(button=>{
    button.setAttribute('aria-pressed',paused || reducedMotion.matches);
    button.disabled=reducedMotion.matches;
    button.textContent=reducedMotion.matches?'Bewegung reduziert':paused?'Bewegung fortsetzen':'Bewegung pausieren';
  });
  $('#motionPreference').textContent=reducedMotion.matches?'Dein System bevorzugt reduzierte Bewegung. Alle Darstellungen bleiben statisch.':'Die Systemeinstellung für reduzierte Bewegung wird respektiert.';
  requestRender();
}
$$('[data-motion-toggle]').forEach(button=>button.addEventListener('click',()=>{paused=!paused;syncMotionButtons();}));
reducedMotion.addEventListener('change',()=>{frames.forEach(frame=>drawRelationship(frame,reducedMotion.matches?0:breathAt(elapsed)));syncMotionButtons();});
syncMotionButtons();
function updateLab(){
  Object.keys(target).forEach(key=>{target[key]=+$('#'+key).value;});
  const labels={proximity:target.proximity<34?'weit':target.proximity<75?'nah':'sehr nah',resonance:target.resonance===0?'keine':target.resonance<40?'leise':target.resonance<80?'spürbar':'stark',openness:target.openness<30?'klein':target.openness<60?'offen':'weit offen'};
  Object.entries(labels).forEach(([key,value])=>{$('#'+key+'Value').textContent=value;$('#'+key).setAttribute('aria-valuetext',value);});
  $('#labReading').textContent=(target.proximity<34?'Viel eigener Raum':target.proximity<75?'Nah beieinander':'Grosse Nähe, eigener Raum')+' · '+(target.resonance===0?'keine aktive Verbindung':target.resonance<40?'leise Resonanz':target.resonance<80?'spürbare Resonanz':'starke Resonanz');
  if(reducedMotion.matches)Object.assign(current,target);
  requestRender();
}
['proximity','resonance','openness'].forEach(id=>$('#'+id).addEventListener('input',updateLab));
$$('[data-lab-mode]').forEach(button=>button.addEventListener('click',()=>{labMode=button.dataset.labMode;$$('[data-lab-mode]').forEach(item=>item.setAttribute('aria-pressed',item===button));frames.forEach(f=>drawRelationship(f,reducedMotion.matches?0:breathAt(elapsed)));}));
updateLab();

// Logo: variants use the same reviewed assets, never a generated replacement shape.
let signatureMode='master';
function updateSignature(){
  const original=$('#showOriginal').checked;
  const base=signatureMode==='master'?'ELANUM-Master-Spektrum':'ELANUM-System-Ink';
  $('#signatureImage').src=`assets/${base}${original?'':'-Curves'}.svg`;
  $('#signatureStage').dataset.mode=signatureMode;
  const mode={master:'Spektrum',ink:'Ink',inverse:'Invers',relief:'Papierrelief'}[signatureMode];
  $('#signatureImage').hidden=signatureMode==='relief';
  $('#signatureRelief').hidden=signatureMode!=='relief';
  $('#signatureRelief span').style.maskImage='url("'+(original?"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiPjxkZWZzPjxjbGlwUGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpLXN5c3RlbS1saW1pdCI+PHBhdGggZD0iTSAxMDgyLjcwNTggNTY1LjUwMDAgQSA0NjAuNTQgNDYwLjU0IDAgMSAwIDEwODUuMTcxNSA2MTcuNDAwMCBDIDk4MC41MDAwIDY3NC45MDAwIDg4Ny45MDAwIDY1Mi44MDAwIDgwOS4wMDAwIDU0MC4wMDAwIEMgOTQwLjIxMTIgNzA2LjI1OTggMTA2OC4wMDU3IDU4Ni4yMzM3IDEwODIuNzA1OCA1NjUuNTAwMCBaIE0gNjUzLjE5OTk5OTk5OTk5OTkgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA0MDkuMDk5OTk5OTk5OTk5OTcgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJNIDEwODIuNzA1OCA1NjUuNTAwMCBBIDQ2MC41NCA0NjAuNTQgMCAxIDAgMTA4NS4xNzE1IDYxNy40MDAwIEMgOTgwLjUwMDAgNjc0LjkwMDAgODg3LjkwMDAgNjUyLjgwMDAgODA5LjAwMDAgNTQwLjAwMDAgQyA5NDAuMjExMiA3MDYuMjU5OCAxMDY4LjAwNTcgNTg2LjIzMzcgMTA4Mi43MDU4IDU2NS41MDAwIFogTSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDQwOS4wOTk5OTk5OTk5OTk5NyA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBaIE0gNjUzLjIwMDAgNjMzLjAwMDAgQyA2NDguODExNSA3MTYuNzU4OCA1ODQuMzY4MyA3ODIuMDY5NSA0OTkuNzAwMCA3ODEuNjU4MSBDIDQxMy4wMTA0IDc4MS4xNjI2IDM0Ny42MTgxIDcxMy4wMjkwIDM0NC43NDYzIDYyOS45MDg4IEMgMzQxLjc2NDAgNTEzLjM5NTUgNDQ5LjU1NTkgNDA4LjE0NjUgNTgwLjIwMDAgNDA3LjU0MTkgQyA2NzQuMjY3NiA0MDcuMDgxMiA3NTUuNzcyOSA0NTIuNjYyMCA4MDkuMDAwMCA1NDAuMDAwMCBDIDc1OC41Mzg3IDQ1MC45MjUwIDY3NS42Njk0IDQwMy4zMTg4IDU4MC4yMDAwIDQwMi44NTgxIEMgNDQ3LjAxNTUgNDAyLjI1MzUgMzM1LjUzMTMgNTA5LjU3MDEgMzM4Ljg1MzcgNjMwLjA5MTIgQyAzNDEuOTYyNCA3MTYuMzI5NCA0MTAuNjUwOCA3ODYuNDM3NCA0OTkuNzAwMCA3ODUuOTQxOSBDIDU4Ni41ODI0IDc4NS41MzA1IDY1MS44MTgwIDcxNy4wNTAyIDY1My4yMDAwIDYzMy4wMDAwIFogTSA0OTMuMDAwMCA1MTcuMDAwMCBDIDYxNi42OTY5IDQ2NS44MzY4IDc0Mi4yMzkxIDUyMC4wMjE3IDc3Ni41MzQyIDY1Ny4zMTQwIEMgODA5LjkxMDggODI0LjIzMzkgNjU5Ljk0MjcgOTY2LjI5NTEgNDg0Ljk3NjUgOTM3LjQ2MjYgQyA0MTAuNTkxMyA5MTMuOTcwNCAzNjAuMTU0NCA5MDguOTM0NSAzMjYuNTQ0OSA4NjEuODg1OSBDIDM1OC41NjI4IDkxMC40MDk5IDQxMC40MTA2IDkxNi40NTM5IDQ4NC4yMjM1IDk0MC41Mzc0IEMgNjYxLjIxNDEgOTcyLjAzMTEgODE2LjE4NTAgODI2Ljk1MTEgNzgxLjA2NTggNjU2LjI4NjAgQyA3NDUuNzYwOSA1MTYuMzc4MyA2MTUuMzAzMSA0NjIuMTYzMiA0OTMuMDAwMCA1MTcuMDAwMCBaIiBmaWxsPSIjMTYzNjNCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcGF0aD0idXJsKCNpLXN5c3RlbS1saW1pdCkiLz48L3N2Zz4=":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTYwIiBoZWlnaHQ9Ijk2MCIgdmlld0JveD0iMTQ0IDEzMiA5NjAgOTYwIj4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpLXN5c3RlbS1saW1pdCI+CiAgICAgIDxwYXRoIGQ9Ik0gMTA4Mi43MDU4IDU2NS41MDAwIEEgNDYwLjU0IDQ2MC41NCAwIDEgMCAxMDg1LjE3MTUgNjE3LjQwMDAgQyA5ODAuNTAwMCA2NzQuOTAwMCA4ODcuOTAwMCA2NTIuODAwMCA4MDkuMDAwMCA1NDAuMDAwMCBDIDk0MC4yMTEyIDcwNi4yNTk4IDEwNjguMDA1NyA1ODYuMjMzNyAxMDgyLjcwNTggNTY1LjUwMDAgWiBNIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBBIDEyMi4wNSAxMjIuMDUgMCAxIDEgNDA5LjA5OTk5OTk5OTk5OTk3IDYzMi45OCBBIDEyMi4wNSAxMjIuMDUgMCAxIDEgNjUzLjE5OTk5OTk5OTk5OTkgNjMyLjk4IFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJNIDEwODIuNzA1OCA1NjUuNTAwMCBBIDQ2MC41NCA0NjAuNTQgMCAxIDAgMTA4NS4xNzE1IDYxNy40MDAwIEMgOTgwLjUwMDAgNjc0LjkwMDAgODg3LjkwMDAgNjUyLjgwMDAgODA5LjAwMDAgNTQwLjAwMDAgQyA5NDAuMjExMiA3MDYuMjU5OCAxMDY4LjAwNTcgNTg2LjIzMzcgMTA4Mi43MDU4IDU2NS41MDAwIFogTSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDQwOS4wOTk5OTk5OTk5OTk5NyA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBaIE0gNjUzLjIgNjMzIEMgNjUzLjIgNzE2Ljc1ODggNTg0LjM2ODEgNzgyLjEwNTggNDk5LjcgNzgxLjY1ODEgQyA0MTMuMDEwMiA3ODEuMTk5NyAzNDcuMjQ2MyA3MTMuMDQxIDM0NC43NDYzIDYyOS45MDg4IEMgMzQxLjI0MjkgNTEzLjQxIDQ0OS41NTYgNDA4LjE2NDEgNTgwLjIgNDA3LjU0MTkgQyA2NzQuMjY3NyA0MDcuMDkzOSA3NTUuNzcyOSA0NTIuNjYyIDgwOSA1NDAgQyA3NTguNTM4NyA0NTAuOTI1IDY3NS42Njk1IDQwMy4zMDUxIDU4MC4yIDQwMi44NTgxIEMgNDQ3LjAxNTYgNDAyLjIzNDUgMzM1LjAyMDggNTA5LjU4NTMgMzM4Ljg1MzcgNjMwLjA5MTIgQyAzNDEuNTk3MSA3MTYuMzQxOCA0MTAuNjUwNiA3ODYuNDAwNSA0OTkuNyA3ODUuOTQxOSBDIDU4Ni41ODIyIDc4NS40OTQ1IDY1My4yIDcxNy4wNTAyIDY1My4yIDYzMyBaICBNIDQ5MyA1MTcgQyA2MTYuNjk2OSA0NjUuODM2OCA3NDUuNTA0NiA1MTkuMjQ3IDc3Ni41MzQyIDY1Ny4zMTQgQyA4MTMuODU5OSA4MjMuMzk1NCA2NTcuNDQ0NSA5NzguNjg1IDQ4NC45NzY1IDkzNy40NjI2IEMgNDA5LjEwNjkgOTE5LjMyODYgMzYwLjE1NDQgOTA4LjkzNDUgMzI2LjU0NDkgODYxLjg4NTkgQyAzNTguNTYyOCA5MTAuNDA5OSA0MDguOTEzNiA5MjEuNjQ4OCA0ODQuMjIzNSA5NDAuNTM3NCBDIDY1OC41OTM0IDk4NC4yNzEzIDgxOS45NTExIDgyNi4xMzI2IDc4MS4wNjU4IDY1Ni4yODYgQyA3NDguODYzOSA1MTUuNjMxNyA2MTUuMzAzMSA0NjIuMTYzMiA0OTMgNTE3IFogIiBmaWxsPSIjMTYzNjNCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcGF0aD0idXJsKCNpLXN5c3RlbS1saW1pdCkiLz4KPC9zdmc+Cg==")+'")';
  $('#signatureLabel').textContent=mode+' · '+(original?'Unverändertes Original':'Kurvenkorrektur');
  $('#signatureImage').alt='ELANUM '+mode+', '+(original?'Original':'kurvenbereinigt');
  $$('[data-signature-mode]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.signatureMode===signatureMode));
}
$$('[data-signature-mode]').forEach(button=>button.addEventListener('click',()=>{signatureMode=button.dataset.signatureMode;updateSignature();}));
$('#showOriginal').addEventListener('change',updateSignature);

// Color roles stay explicit; names and numbers are never embedded in low-contrast fills.
const fieldColors=['#6756D9','#4D7FE8','#9466DF','#D85BA9','#F0719A','#E87872','#C9953E','#6D9477','#3E898D'];
const names=['Violet','Blue','Orchid','Rose','Pink','Coral','Amber','Moss','Teal'];
function colorButton(name,color,className){
  const button=document.createElement('button');button.className=className;button.dataset.color=color;button.style.setProperty('--swatch',color);button.setAttribute('aria-label',name+' '+color+' kopieren');
  button.addEventListener('click',()=>copyText(color,color+' kopiert'));return button;
}
[['Relief Ground','#F0ECE3'],['Relief Light','#F6F1E7'],['Ink','#16363B'],['Paper','#F2ECDD']].forEach(([name,color])=>{const button=colorButton(name,color,'swatch');button.innerHTML=`<strong>${name}</strong><code>${color}</code>`;$('#basePalette').append(button);});
fieldColors.slice(0,5).forEach((color,i)=>{const button=colorButton(names[i],color,'color-sample');button.innerHTML=`<strong>${names[i]}</strong><code>${color}</code>`;$('#spectrumPalette').append(button);});
['A','B','C'].forEach((group,g)=>{const section=document.createElement('div');section.className='field-family';section.innerHTML=`<h4>Gruppe ${group}<span>${g*3+1}–${g*3+3}</span></h4>`;for(let n=0;n<3;n++){const i=g*3+n,button=colorButton('Feld '+(i+1),fieldColors[i],'field-color');button.innerHTML=`<i aria-hidden="true"></i><span>${String(i+1).padStart(2,'0')} · ${names[i]}</span><code>${fieldColors[i]}</code>`;section.append(button);}$('#fieldPalette').append(section);});
const statuses={info:{name:'Info',sign:'ⓘ',color:'#286F9B',description:'Sachliche Orientierung.',example:'ⓘ Deine Angaben kannst du später ergänzen.'},signal:{name:'Signal / Hinweis',sign:'△',color:'#89560E',description:'Aufmerksamkeit, kein Alarm.',example:'△ Hier fehlen noch Angaben. Du kannst trotzdem weitergehen.'},error:{name:'Fehler',sign:'×',color:'#A7394D',description:'Ein konkreter nächster Schritt.',example:'× Das hat nicht geklappt. Bitte versuche es erneut.'}};
Object.values(statuses).forEach(item=>{const button=colorButton(item.name,item.color,'semantic-sample');button.style.setProperty('--semantic',item.color);button.innerHTML=`<strong><span aria-hidden="true">${item.sign}</span>${item.name}</strong><p>${item.description}</p><code>${item.color}</code>`;$('#semanticPalette').append(button);});

// Functional component studies — all actions stay in this local document.
$('#demoContinue').addEventListener('click',()=>notify('Primäraktion ausgelöst · lokale Demo'));
$('#demoLater').addEventListener('click',()=>notify('Sekundäraktion ausgelöst · lokale Demo'));
$('#choiceButton').addEventListener('click',event=>{const button=event.currentTarget;button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')!=='true');});
$('#demoForm').addEventListener('submit',event=>{event.preventDefault();const value=$('#demoInput').value.trim();$('#demoResult').textContent=value?'Deine Vorschau: „'+value+'“':'Schreibe zuerst einen Gedanken.';$('#demoInput').setAttribute('aria-invalid',!value);});
$$('[data-status]').filter(button=>button.tagName==='BUTTON').forEach(button=>button.addEventListener('click',()=>{const state=button.dataset.status;$('#statusDemo').dataset.status=state;$('#statusDemo').textContent=statuses[state].example;$$('button[data-status]').forEach(item=>item.setAttribute('aria-pressed',item===button));}));

// Product tabs: complete keyboard semantics, instantaneous content changes.
const tabs=$$('.product-tab');
function selectProduct(tab){tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',active);item.tabIndex=active?0:-1;$('#'+item.getAttribute('aria-controls')).hidden=!active;});requestRender();}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectProduct(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();selectProduct(tabs[next]);});});
const wheelPaths=[];
for(let i=0;i<9;i++){
  const group=Math.floor(i/3),field=i%3,start=-144+group*120+field*36;
  const point=(angle,r)=>[260+r*Math.cos(angle*Math.PI/180),260+r*Math.sin(angle*Math.PI/180)];
  const a=point(start,170),b=point(start+28,170),label=point(start+14,210);
  const path=svgElement('path',{d:`M${a.join(' ')} A170 170 0 0 1 ${b.join(' ')}`});$('#wheelSegments').append(path);wheelPaths.push(path);
  const text=svgElement('text',{x:label[0],y:label[1],'text-anchor':'middle','dominant-baseline':'middle',class:'diagram-small',style:'font-size:23px'});text.textContent=String(i+1).padStart(2,'0');$('#wheelSegments').append(text);
  const button=document.createElement('button');button.dataset.field=i;button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label','Feld '+(i+1)+' auswählen');button.addEventListener('click',()=>selectField(i));$('#wheelControls').append(button);
}
function selectField(index){wheelPaths.forEach((path,i)=>{path.setAttribute('stroke',i===index?fieldColors[i]:'#819692');path.setAttribute('stroke-width',i===index?7:2);});$$('[data-field]').forEach(button=>button.setAttribute('aria-pressed',+button.dataset.field===index));$('#wheelTitle').textContent='Feld '+String(index+1).padStart(2,'0');$('#wheelGroup').textContent='Gruppe '+['A','B','C'][Math.floor(index/3)];$('#wheelAccessibleTitle').textContent='Klangrad: Feld '+(index+1)+' aus Gruppe '+['A','B','C'][Math.floor(index/3)]+' ausgewählt.';}
selectField(1);

const rules=[['Logo respektiert','Grundform, Linien und Proportionen bleiben erhalten.'],['Kreise bleiben rund','Auch während Bewegung und auf kleinen Bildschirmen.'],['Verbindung ist verständlich','Konturen, Öffnung und Anschluss haben eine klare Funktion.'],['Farbe hat eine Rolle','Marke, Feldzugehörigkeit und Status werden unterschieden.'],['Typografie schafft Hierarchie','Albert Sans führt, Yrsa betont einzelne Aussagen.'],['Flächen bleiben offen','Keine unnötigen Karten, Schatten oder Verlaufskanten.'],['Bewegung ist kontrollierbar','Pause, reduzierte Bewegung und ruhende Beschriftungen.'],['Details sind lesbar','Kontrast, Tastaturbedienung und mobile Beschriftungen prüfen.']];
rules.forEach(([title,description])=>{const label=document.createElement('label');label.innerHTML=`<input type="checkbox"><div>${title}<span>${description}</span></div>`;$('#checklist').append(label);});
$$('#checklist input').forEach(input=>input.addEventListener('change',()=>{const count=$$('#checklist input:checked').length;$('#scoreNumber').textContent=count;$('#scoreMessage').textContent=count===8?'Alle acht Regeln bestätigt. Die visuelle Freigabe erfolgt separat.':count+' von 8 Gestaltungsregeln bestätigt. Eine Checkliste ersetzt kein visuelles Review.';}));
$('#copyTokens').addEventListener('click',()=>copyText($('#tokenCode').textContent,'Design-Tokens kopiert'));

// One-time paper-like entrances. Content is never hidden waiting for JavaScript.
document.addEventListener('keydown',()=>{document.body.dataset.input='keyboard';},{capture:true});
document.addEventListener('pointerdown',()=>{document.body.dataset.input='pointer';},{capture:true});
const revealTargets=$$('.section-heading,.relationship-top,.material-paper,.foundation-grid > *, .type-layout > *, .color-group, .component, .voice-list > *, .hero h1, .hero-copy > p');
const entranceObserver=new IntersectionObserver(entries=>{
  let stagger=0;
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entranceObserver.unobserve(entry.target);
    if(!moving() || document.body.dataset.input==='keyboard')return;
    entry.target.animate([{opacity:.2,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:Math.min(stagger++*65,195),easing:'cubic-bezier(.23,1,.32,1)'});
  });
},{threshold:.12});
revealTargets.forEach(element=>entranceObserver.observe(element));
const lineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  lineObserver.unobserve(entry.target);
  if(!moving())return;
  $$('[data-contour]',entry.target).forEach((path,index)=>{
    path.setAttribute('pathLength','1');
    path.animate([{strokeDasharray:'1',strokeDashoffset:'1',opacity:.2},{strokeDasharray:'1',strokeDashoffset:'0',opacity:1}],{duration:1800,delay:index*120,easing:'cubic-bezier(.23,1,.32,1)'});
  });
}),{threshold:.3});
frames.forEach(frame=>lineObserver.observe(frame.container));
tabs.forEach(tab=>tab.addEventListener('click',event=>{
  if(!event.detail || !moving())return;
  const panel=$('#'+tab.getAttribute('aria-controls'));
  panel.getAnimations().forEach(animation=>animation.cancel());
  panel.animate([{opacity:.3,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.23,1,.32,1)'});
}));
