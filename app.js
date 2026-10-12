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

// Logo: modes use the reviewed assets from tools/build_logo_geometrie.py, never a shape generated at runtime.
let signatureMode='master';
// Relief masks are embedded so the paper view also works when index.html is opened from disk.
const reliefMasks={
  original:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiPjxkZWZzPjxjbGlwUGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpLXN5c3RlbS1saW1pdCI+PHBhdGggZD0iTSAxMDgyLjcwNTggNTY1LjUwMDAgQSA0NjAuNTQgNDYwLjU0IDAgMSAwIDEwODUuMTcxNSA2MTcuNDAwMCBDIDk4MC41MDAwIDY3NC45MDAwIDg4Ny45MDAwIDY1Mi44MDAwIDgwOS4wMDAwIDU0MC4wMDAwIEMgOTQwLjIxMTIgNzA2LjI1OTggMTA2OC4wMDU3IDU4Ni4yMzM3IDEwODIuNzA1OCA1NjUuNTAwMCBaIE0gNjUzLjE5OTk5OTk5OTk5OTkgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA0MDkuMDk5OTk5OTk5OTk5OTcgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJNIDEwODIuNzA1OCA1NjUuNTAwMCBBIDQ2MC41NCA0NjAuNTQgMCAxIDAgMTA4NS4xNzE1IDYxNy40MDAwIEMgOTgwLjUwMDAgNjc0LjkwMDAgODg3LjkwMDAgNjUyLjgwMDAgODA5LjAwMDAgNTQwLjAwMDAgQyA5NDAuMjExMiA3MDYuMjU5OCAxMDY4LjAwNTcgNTg2LjIzMzcgMTA4Mi43MDU4IDU2NS41MDAwIFogTSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDQwOS4wOTk5OTk5OTk5OTk5NyA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBaIE0gNjUzLjIwMDAgNjMzLjAwMDAgQyA2NDguODExNSA3MTYuNzU4OCA1ODQuMzY4MyA3ODIuMDY5NSA0OTkuNzAwMCA3ODEuNjU4MSBDIDQxMy4wMTA0IDc4MS4xNjI2IDM0Ny42MTgxIDcxMy4wMjkwIDM0NC43NDYzIDYyOS45MDg4IEMgMzQxLjc2NDAgNTEzLjM5NTUgNDQ5LjU1NTkgNDA4LjE0NjUgNTgwLjIwMDAgNDA3LjU0MTkgQyA2NzQuMjY3NiA0MDcuMDgxMiA3NTUuNzcyOSA0NTIuNjYyMCA4MDkuMDAwMCA1NDAuMDAwMCBDIDc1OC41Mzg3IDQ1MC45MjUwIDY3NS42Njk0IDQwMy4zMTg4IDU4MC4yMDAwIDQwMi44NTgxIEMgNDQ3LjAxNTUgNDAyLjI1MzUgMzM1LjUzMTMgNTA5LjU3MDEgMzM4Ljg1MzcgNjMwLjA5MTIgQyAzNDEuOTYyNCA3MTYuMzI5NCA0MTAuNjUwOCA3ODYuNDM3NCA0OTkuNzAwMCA3ODUuOTQxOSBDIDU4Ni41ODI0IDc4NS41MzA1IDY1MS44MTgwIDcxNy4wNTAyIDY1My4yMDAwIDYzMy4wMDAwIFogTSA0OTMuMDAwMCA1MTcuMDAwMCBDIDYxNi42OTY5IDQ2NS44MzY4IDc0Mi4yMzkxIDUyMC4wMjE3IDc3Ni41MzQyIDY1Ny4zMTQwIEMgODA5LjkxMDggODI0LjIzMzkgNjU5Ljk0MjcgOTY2LjI5NTEgNDg0Ljk3NjUgOTM3LjQ2MjYgQyA0MTAuNTkxMyA5MTMuOTcwNCAzNjAuMTU0NCA5MDguOTM0NSAzMjYuNTQ0OSA4NjEuODg1OSBDIDM1OC41NjI4IDkxMC40MDk5IDQxMC40MTA2IDkxNi40NTM5IDQ4NC4yMjM1IDk0MC41Mzc0IEMgNjYxLjIxNDEgOTcyLjAzMTEgODE2LjE4NTAgODI2Ljk1MTEgNzgxLjA2NTggNjU2LjI4NjAgQyA3NDUuNzYwOSA1MTYuMzc4MyA2MTUuMzAzMSA0NjIuMTYzMiA0OTMuMDAwMCA1MTcuMDAwMCBaIiBmaWxsPSIjMTYzNjNCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcGF0aD0idXJsKCNpLXN5c3RlbS1saW1pdCkiLz48L3N2Zz4=",
  Geometrisch:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiIHJvbGU9ImltZyI+PHRpdGxlPkVMQU5VTTogc2VjaHMgR3J1bmRrcmVpc2U8L3RpdGxlPjxkZXNjPk1hbnRlbCwgWmVudHJ1bSwgT2JlcmJvZ2VuLCBVbnRlcmJvZ2VuIHVuZCB6d2VpIE3DvG5kdW5nc2tyZWlzZS4gQmVuYW5udGUgQsOpemllcmJyw7xja2VuIHZlcmJpbmRlbiBkaWUgQsO2Z2VuLjwvZGVzYz48ZGVmcz48Y2xpcFBhdGggaWQ9ImVsYW51bS1saW1pdCI+PHBhdGggZD0iTSAxMDg1LjE5MDAxNzAyIDYxMy4yNzAxOTIzNCBBIDQ2MC41NDAwMDAwMCA0NjAuNTQwMDAwMDAgMCAxIDEgMTY0LjExMDAxNzAyIDYxMy4yNzAxOTIzNCBBIDQ2MC41NDAwMDAwMCA0NjAuNTQwMDAwMDAgMCAxIDEgMTA4NS4xOTAwMTcwMiA2MTMuMjcwMTkyMzQgWiBNIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDQwOS4xMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggZD0iTSAxMDgwLjcwODA3MzQwIDU0OS4xNzU0MTI0MiBBIDQ2MC41NDAwMDAwMCA0NjAuNTQwMDAwMDAgMCAxIDAgMTA4NC40MjYzNTcyNCA2MzkuNzgwNzI5MzIgQyAxMDg0LjUwNzkwNjI4IDYzOC4zNjY0MTE3NCAxMDg0LjU4MjkyOTQ1IDYzNi45NTE3MTc4OSAxMDg0LjUyNzM1MTQzIDYzNS41ODg1ODUwOSBDIDEwODQuNDcxNzczNDEgNjM0LjIyNTQ1MjI5IDEwODQuMjg1NTk0MjEgNjMyLjkxMzg4MDU0IDEwODMuOTM3MTkyMzggNjMxLjcxMjY3OTczIEMgMTA4My41ODg3OTA1NSA2MzAuNTExNDc4OTMgMTA4My4wNzgxNjYxMSA2MjkuNDIwNjQ5MDcgMTA4Mi40MDI3NTUzMyA2MjguNDkxMDk4MzggQyAxMDgxLjcyNzM0NDU2IDYyNy41NjE1NDc2OCAxMDgwLjg4NzE0NzQ1IDYyNi43OTMyNzYxNiAxMDc5LjkyMjcyMDAxIDYyNi4yMjA1NTY2OSBDIDEwNzguOTU4MjkyNTcgNjI1LjY0NzgzNzIxIDEwNzcuODY5NjM0NzkgNjI1LjI3MDY2OTc5IDEwNzYuNzA5MjIxODggNjI1LjEwMjczMjE3IEMgMTA3NS41NDg4MDg5NyA2MjQuOTM0Nzk0NTQgMTA3NC4zMTY2NDA5MiA2MjQuOTc2MDg2NzEgMTA3My4wNTc1NTUxMCA2MjUuMTk1NjEyODIgQyAxMDcxLjc5ODQ2OTI4IDYyNS40MTUxMzg5MiAxMDcwLjUxMjQ2NTY4IDYyNS44MTI4OTg5NyAxMDY5LjIzNjMzMjY4IDYyNi4zMjk0OTc4NiBDIDEwNjcuOTYwMTk5NjggNjI2Ljg0NjA5Njc1IDEwNjYuNjkzOTM3MjkgNjI3LjQ4MTUzNDQ4IDEwNjUuNDIwNjQ1NzIgNjI4LjEwMjU2MDI3IEEgMTg3Ljc0MzMwMDAwIDE4Ny43NDMzMDAwMCAwIDAgMSA4NjEuOTczNTAxMzcgNjAyLjc4NjY5ODg0IEMgODU4LjYyMzk2ODIwIDU5OS45NTc1MDMxMCA4NTUuMzczNTQzMDAgNTk3LjAxMDk3MTc1IDg1Mi4yMTQ1ODgzNyA1OTMuOTcwNDU1MDEgQyA4NDkuMDU1NjMzNzUgNTkwLjkyOTkzODI3IDg0NS45ODgxNDk3MiA1ODcuNzk1NDM2MTQgODQyLjk5OTk3Mzc5IDU4NC41ODcwMjc5MSBDIDg0MC4wMTE3OTc4NiA1ODEuMzc4NjE5NjggODM3LjEwMjkzMDAzIDU3OC4wOTYzMDUzNCA4MzQuMjU5NzYyODYgNTc0Ljc1ODU0NjE2IEMgODMxLjQxNjU5NTcwIDU3MS40MjA3ODY5NyA4MjguNjM5MTI5MTkgNTY4LjAyNzU4Mjk0IDgyNS45MTEyNzUyMSA1NjQuNTk1MDQ1MTQgQyA4MjMuMTgzNDIxMjIgNTYxLjE2MjUwNzM0IDgyMC41MDUxNzk3NyA1NTcuNjkwNjM1NzcgODE3Ljg1OTU1ODEyIDU1NC4xOTQyNjI4MSBDIDgxNS4yMTM5MzY0OCA1NTAuNjk3ODg5ODUgODEyLjYwMDkzNDY1IDU0Ny4xNzcwMTU0OSA4MTAuMDAyNjI1NDYgNTQzLjY0NTM4MjQzIEMgODA3LjQwNDMxNjI2IDU0MC4xMTM3NDkzNyA4MDQuODIwNjk5NzAgNTM2LjU3MTM1NzYwIDgwMi4yMzM1NTA0NiA1MzMuMDMxNTAyMzIgQyA3OTkuNjQ2NDAxMjIgNTI5LjQ5MTY0NzA0IDc5Ny4wNTU3MTkyOSA1MjUuOTU0MzI4MjUgNzk0LjQ0MzQzNTIwIDUyMi40MzMwMzIxMCBDIDc5MS44MzExNTExMSA1MTguOTExNzM1OTYgNzg5LjE5NzI2NDg1IDUxNS40MDY0NjI0NyA3ODYuNTIzOTg2ODcgNTExLjkzMTE2MTA2IEMgNzgzLjg1MDcwODg5IDUwOC40NTU4NTk2NCA3ODEuMTM4MDM5MTkgNTA1LjAxMDUzMDI5IDc3OC4zNjk1NzAzMSA1MDEuNjEwNzA0MTMgQyA3NzUuNjAxMTAxNDIgNDk4LjIxMDg3Nzk2IDc3Mi43NzY4MzMzNSA0OTQuODU2NTU0OTkgNzY5Ljg4MTE0MDIwIDQ5MS41NjQzMzQ5NyBDIDc2Ni45ODU0NDcwNCA0ODguMjcyMTE0OTUgNzY0LjAxODMyODgwIDQ4NS4wNDE5OTc5MCA3NjAuOTY3MDc3NDYgNDgxLjg5MzQxMzA5IEEgMjQ2LjEyNjU4Mjg1IDI0Ni4xMjY1ODI4NSAwIDAgMCA1NzEuODAxMzMzNTEgNDA3LjM2NDY1NjkyIEMgNTYxLjMxMzA5MTkzIDQwNy44OTQ0Nzk2NCA1NTAuODYwODI3MTcgNDA5LjA5NTQ1OTA5IDU0MC41MzUyODc2NCA0MTAuOTg3NjI0NTcgQyA1MzAuMjA5NzQ4MTAgNDEyLjg3OTc5MDA0IDUyMC4wMTA5MzM3OCA0MTUuNDYzMTQxNTUgNTEwLjA0MTk3MTgwIDQxOC43Mzk0OTk0MSBDIDUwMC4wNzMwMDk4MyA0MjIuMDE1ODU3MjggNDkwLjMzMzkwMDIxIDQyNS45ODUyMjE1MSA0ODAuOTMyMDI0MTggNDMwLjYzNTM4OTM5IEMgNDcxLjUzMDE0ODE2IDQzNS4yODU1NTcyNyA0NjIuNDY1NTA1NzQgNDQwLjYxNjUyODgwIDQ1My44NTEzMjAzMyA0NDYuNTk0MzExNDkgQyA0NDUuMjM3MTM0OTIgNDUyLjU3MjA5NDE4IDQzNy4wNzM0MDY1MyA0NTkuMTk2Njg4MDQgNDI5LjQ3Mjg1ODgwIDQ2Ni40MTMzMDg0MiBDIDQyMS44NzIzMTEwOCA0NzMuNjI5OTI4ODEgNDE0LjgzNDk0NDAyIDQ4MS40Mzg1NzU3MyA0MDguNDcwMDU4MTIgNDg5Ljc2MDMwMTEzIEMgNDAyLjEwNTE3MjIyIDQ5OC4wODIwMjY1MyAzOTYuNDEyNzY3NDcgNTA2LjkxNjgzMDQxIDM5MS40OTI4NTMxNiA1MTYuMTYxODA0NjggQyAzODYuNTcyOTM4ODYgNTI1LjQwNjc3ODk0IDM4Mi40MjU1MTQ5OSA1MzUuMDYxOTIzNTcgMzc5LjEzNTk3MzM0IDU0NS4wMDAxMTY0OSBDIDM3NS44NDY0MzE2OSA1NTQuOTM4MzA5NDEgMzczLjQxNDc3MjI1IDU2NS4xNTk1NTA2MiAzNzEuOTA1NjQ5MjEgNTc1LjUxNDQ3NDEyIEMgMzcwLjM5NjUyNjE2IDU4NS44NjkzOTc2MSAzNjkuODA5OTM5NTIgNTk2LjM1ODAwMzQwIDM3MC4xODM1MDczNyA2MDYuODExNDg0MjcgQyAzNzAuNTU3MDc1MjMgNjE3LjI2NDk2NTE0IDM3MS44OTA3OTc1OSA2MjcuNjgzMzIxMDggMzc0LjE4OTkxMDE5IDYzNy44ODM0ODU2NiBDIDM3Ni40ODkwMjI4MCA2NDguMDgzNjUwMjMgMzc5Ljc1MzUyNTY0IDY1OC4wNjU2MjM0MyAzODMuOTQ5OTcyOTAgNjY3LjYzNzg3NDE3IEMgMzg4LjE0NjQyMDE2IDY3Ny4yMTAxMjQ5MSAzOTMuMjc0ODExODIgNjg2LjM3MjY1MzE4IDM5OS4yNTMwODAwOCA2OTQuOTQyMDAwNzkgQyA0MDUuMjMxMzQ4MzMgNzAzLjUxMTM0ODQxIDQxMi4wNTk0OTMxOCA3MTEuNDg3NTE1MzYgNDE5LjYyMjI1OTI3IDcxOC42OTc4NTM0NiBDIDQyNy4xODUwMjUzNiA3MjUuOTA4MTkxNTcgNDM1LjQ4MjQxMjY5IDczMi4zNTI3MDA4NCA0NDQuMzYxNTk5OTQgNzM3Ljg3NDM2MTQ3IEMgNDUzLjI0MDc4NzE4IDc0My4zOTYwMjIwOSA0NjIuNzAxNzc0MzUgNzQ3Ljk5NDgzNDA5IDQ3Mi41NTM1NjY3MiA3NTEuNTM4NzQ2NjcgQyA0ODIuNDA1MzU5MTAgNzU1LjA4MjY1OTI1IDQ5Mi42NDc5NTY2OCA3NTcuNTcxNjcyNDEgNTAzLjA1MTUzODc0IDc1OC45MDk5OTc1MSBDIDUxMy40NTUxMjA3OSA3NjAuMjQ4MzIyNjEgNTI0LjAxOTY4NzMyIDc2MC40MzU5NTk2NSA1MzQuNDg0MjgyNzkgNzU5LjQyNzQxODc3IEMgNTQ0Ljk0ODg3ODI3IDc1OC40MTg4Nzc4OSA1NTUuMzEzNTAyNzAgNzU2LjIxNDE1OTEwIDU2NS4yOTI4MDQxOSA3NTIuODMwOTMxNzkgQyA1NzUuMjcyMTA1NjkgNzQ5LjQ0NzcwNDQ3IDU4NC44NjYwODQyNiA3NDQuODg1OTY4NjMgNTkzLjc5MDE1MzAyIDczOS4yMzg2NzA4NCBDIDYwMi43MTQyMjE3NyA3MzMuNTkxMzczMDQgNjEwLjk2ODM4MDcwIDcyNi44NTg1MTMyOSA2MTguMjc2OTI3MTcgNzE5LjIxMTMzMDM5IEMgNjI1LjU4NTQ3MzY0IDcxMS41NjQxNDc0OCA2MzEuOTQ4NDA3NjUgNzAzLjAwMjY0MTQyIDYzNy4xNTEyMjE0NyA2OTMuNzc3MTc0NDYgQyA2NDIuMzU0MDM1MjkgNjg0LjU1MTcwNzQ5IDY0Ni4zOTY3Mjg5NCA2NzQuNjYyMjc5NjIgNjQ5LjEwODIyMDExIDY2NC40MTg3NTcwNiBDIDY1MS44MTk3MTEyOSA2NTQuMTc1MjM0NTAgNjUzLjIwMDAwMDAwIDY0My41Nzc2MTcyNSA2NTMuMjAwMDAwMDAgNjMyLjk4MDAwMDAwIEMgNjUzLjIwMDAwMDAwIDY0My41Nzc2MTcyNSA2NTEuODE5NzExMjkgNjU0LjE3NTIzNDUwIDY0OS4xMjg5NDMzNiA2NjQuNDI2Mzk3NzQgQyA2NDYuNDM4MTc1NDMgNjc0LjY3NzU2MDk4IDY0Mi40MzY5MjgyOSA2ODQuNTgyMjcwMjEgNjM3LjI5MDk2NjU2IDY5My44NTQzMjMzNyBDIDYzMi4xNDUwMDQ4MiA3MDMuMTI2Mzc2NTMgNjI1Ljg1NDMyODUxIDcxMS43NjU3NzM2MiA2MTguNjE1MzUyMjcgNzE5LjUzMTMxMTU4IEMgNjExLjM3NjM3NjAzIDcyNy4yOTY4NDk1MyA2MDMuMTg5MDk5ODcgNzM0LjE4ODUyODM2IDU5NC4zMDIzNzQ0NCA3NDAuMDMxOTMwODcgQyA1ODUuNDE1NjQ5MDIgNzQ1Ljg3NTMzMzM4IDU3NS44Mjk0NzQzNCA3NTAuNjcwNDU5NTYgNTY1LjgwOTEzNDEzIDc1NC4zMDI4MTk5MSBDIDU1NS43ODg3OTM5MiA3NTcuOTM1MTgwMjYgNTQ1LjMzNDI4ODE3IDc2MC40MDQ3NzQ3OCA1MzQuNzI1MjYwOTkgNzYxLjY2NDQ1Njc2IEMgNTI0LjExNjIzMzgwIDc2Mi45MjQxMzg3NCA1MTMuMzUyNjg1MTcgNzYyLjk3MzkwODE4IDUwMi43MDcyNzM4OCA3NjEuODMwMDkxMzUgQyA0OTIuMDYxODYyNjAgNzYwLjY4NjI3NDUyIDQ4MS41MzQ1ODg2NyA3NTguMzQ4ODcxNDEgNDcxLjM3OTcyMzM4IDc1NC44OTUwNjA5OSBDIDQ2MS4yMjQ4NTgxMCA3NTEuNDQxMjUwNTcgNDUxLjQ0MjQwMTQ3IDc0Ni44NzEwMzI4NCA0NDIuMjUyNzQ1ODYgNzQxLjMxMzYzNDAzIEMgNDMzLjA2MzA5MDI2IDczNS43NTYyMzUyMiA0MjQuNDY2MjM1NjggNzI5LjIxMTY1NTM0IDQxNi42MzgwODUyMCA3MjEuODQ5Njc1MDggQyA0MDguODA5OTM0NzMgNzE0LjQ4NzY5NDgzIDQwMS43NTA0ODgzNiA3MDYuMzA4MzE0MjAgMzk1LjU4MzU5ODc4IDY5Ny41MDczNzI1MSBDIDM4OS40MTY3MDkyMSA2ODguNzA2NDMwODIgMzg0LjE0MjM3NjQzIDY3OS4yODM5MjgwNyAzNzkuODI4NTQwMTMgNjY5LjQ0NDYyNzg4IEMgMzc1LjUxNDcwMzgzIDY1OS42MDUzMjc2OSAzNzIuMTYxMzY0MDEgNjQ5LjM0OTIzMDA2IDM2OS44MDAxMjUzMSA2MzguODcyOTcwMjggQyAzNjcuNDM4ODg2NjIgNjI4LjM5NjcxMDQ5IDM2Ni4wNjk3NDkwNSA2MTcuNzAwMjg4NTUgMzY1LjY4NjMxMTIyIDYwNi45NzIxNDQ3OCBDIDM2NS4zMDI4NzM0MCA1OTYuMjQ0MDAxMDEgMzY1LjkwNTEzNTMyIDU4NS40ODQxMzU0MSAzNjcuNDUyNzIzMjQgNTc0Ljg2NTQ4NjA2IEMgMzY5LjAwMDMxMTE1IDU2NC4yNDY4MzY3MSAzNzEuNDkzMjI1MDYgNTUzLjc2OTQwMzYxIDM3NC44NjM5MDEyNCA1NDMuNTg2MDM1OTYgQyAzNzguMjM0NTc3NDEgNTMzLjQwMjY2ODMwIDM4Mi40ODMwMTU4NCA1MjMuNTEzMzY2MTAgMzg3LjUyMDM2OTEyIDUxNC4wNDc3MzA3NyBDIDM5Mi41NTc3MjI0MCA1MDQuNTgyMDk1NDQgMzk4LjM4Mzk5MDUyIDQ5NS41NDAxMjY5OSA0MDQuODk1NzAyNjYgNDg3LjAyNjQyNjMzIEMgNDExLjQwNzQxNDgxIDQ3OC41MTI3MjU2OCA0MTguNjA0NTcwOTcgNDcwLjUyNzI5MjgxIDQyNi4zNzQzODE4NiA0NjMuMTQ5OTYxMDggQyA0MzQuMTQ0MTkyNzUgNDU1Ljc3MjYyOTM1IDQ0Mi40ODY2NTgzNyA0NDkuMDAzMzk4NzUgNDUxLjI4NTc5OTk0IDQ0Mi44OTcyNjU2NyBDIDQ2MC4wODQ5NDE1MSA0MzYuNzkxMTMyNTkgNDY5LjM0MDc1OTAyIDQzMS4zNDgwOTcwMiA0NzguOTM3MDAwNjggNDI2LjYwMTc5NDE0IEMgNDg4LjUzMzI0MjM0IDQyMS44NTU0OTEyNyA0OTguNDY5OTA4MTMgNDE3LjgwNTkyMTA4IDUwOC42MzcwMTU3NSA0MTQuNDY0NDQzMDcgQyA1MTguODA0MTIzMzcgNDExLjEyMjk2NTA3IDUyOS4yMDE2NzI4MSA0MDguNDg5NTc5MjMgNTM5LjcyNDIxNzExIDQwNi41NjEzMTIyOCBDIDU1MC4yNDY3NjE0MSA0MDQuNjMzMDQ1MzIgNTYwLjg5NDMwMDU3IDQwMy40MDk4OTcyNCA1NzEuNTc0MzAxNTYgNDAyLjg3MDM4NzYzIEEgMjUwLjYyNjU4Mjg1IDI1MC42MjY1ODI4NSAwIDAgMSA3NzcuMTM5NDg3OTMgNDkzLjE5MjUxMjU1IEMgNzc5LjEyMjY3MDczIDQ5NS41ODM5NjM2NSA3ODEuMDYxMzg2NzggNDk4LjAxMjI5MDE1IDc4Mi45NjM5OTg4MSA1MDAuNDY4MzI5NzAgQyA3ODQuODY2NjEwODMgNTAyLjkyNDM2OTI0IDc4Ni43MzMxMTg4MiA1MDUuNDA4MTIxODQgNzg4LjU3Mjg2NjU1IDUwNy45MTE1Njk4NSBDIDc5MC40MTI2MTQyOCA1MTAuNDE1MDE3ODYgNzkyLjIyNTYwMTc1IDUxMi45MzgxNjEyOCA3OTQuMDIxNDIwNDUgNTE1LjQ3MzM1MzgwIEMgNzk1LjgxNzIzOTE1IDUxOC4wMDg1NDYzMSA3OTcuNTk1ODg5MTAgNTIwLjU1NTc4NzkxIDc5OS4zNjczOTY1OSA1MjMuMTA3OTk2NTYgQyA4MDEuMTM4OTA0MDkgNTI1LjY2MDIwNTIwIDgwMi45MDMyNjkxNCA1MjguMjE3MzgwODggODA0LjY3MDU2NDUzIDUzMC43NzI1Mjc3NSBDIDgwNi40Mzc4NTk5MyA1MzMuMzI3Njc0NjIgODA4LjIwODA4NTY4IDUzNS44ODA3OTI2OCA4MDkuOTkxMjg3NDcgNTM4LjQyNDg0ODU0IEMgODExLjc3NDQ4OTI3IDU0MC45Njg5MDQ0MCA4MTMuNTcwNjY3MTEgNTQzLjUwMzg5ODA1IDgxNS4zODk2NzE3NiA1NDYuMDIyNDk3MTIgQyA4MTcuMjA4Njc2NDEgNTQ4LjU0MTA5NjIwIDgxOS4wNTA1MDc4NiA1NTEuMDQzMzAwNjkgODIwLjkyNDU0NjgyIDU1My41MjExOTQ5NiBDIDgyMi43OTg1ODU3OSA1NTUuOTk5MDg5MjQgODI0LjcwNDgzMjI1IDU1OC40NTI2NzMyOSA4MjYuNjUyMjIwNjUgNTYwLjg3MzM5NTA2IEMgODI4LjU5OTYwOTA1IDU2My4yOTQxMTY4NCA4MzAuNTg4MTM5MzggNTY1LjY4MTk3NjMyIDgzMi42MjU2MzU1OSA1NjguMDI3MjgxNDEgQyA4MzQuNjYzMTMxNzkgNTcwLjM3MjU4NjUwIDgzNi43NDk1OTM4OCA1NzIuNjc1MzM3MTkgODM4Ljg5MjE5MTQ4IDU3NC45MjUwNzc1MSBDIDg0MS4wMzQ3ODkwOSA1NzcuMTc0ODE3ODMgODQzLjIzMzUyMjIwIDU3OS4zNzE1NDc3OCA4NDUuNDkzNjE1MTggNTgxLjUwMzIyMTM0IEEgMTYxLjg5NjUwMDAwIDE2MS44OTY1MDAwMCAwIDAgMCAxMDY0LjkwNjcwMzIxIDU4NC4wNDA1NDYyNCBDIDEwNjYuMjY5MTM1MzkgNTgyLjgxMzgwNjc5IDEwNjcuNjEwNzI5OTggNTgxLjU2MzkyNDg2IDEwNjguOTE2MzYwODggNTgwLjMxMjM3MDcxIEMgMTA3MC4yMjE5OTE3OSA1NzkuMDYwODE2NTcgMTA3MS40OTE2NTkwMSA1NzcuODA3NTkwMjEgMTA3Mi42ODc1ODcwOSA1NzYuNTQzMDAxNDAgQyAxMDczLjg4MzUxNTE3IDU3NS4yNzg0MTI1OSAxMDc1LjAwNTcwNDExIDU3NC4wMDI0NjEzMSAxMDc2LjAxNjczNzk1IDU3Mi42OTk0MDc4NyBDIDEwNzcuMDI3NzcxNzggNTcxLjM5NjM1NDQyIDEwNzcuOTI3NjUwNTEgNTcwLjA2NjE5ODgwIDEwNzguNjgzMTQwNzAgNTY4LjY4NjA1MTMyIEMgMTA3OS40Mzg2MzA4OCA1NjcuMzA1OTAzODQgMTA4MC4wNDk3MzI1MiA1NjUuODc1NzY0NTAgMTA4MC40OTYyNTc0NyA1NjQuMzc2NzE5ODcgQyAxMDgwLjk0Mjc4MjQxIDU2Mi44Nzc2NzUyNCAxMDgxLjIyNDczMDY3IDU2MS4zMDk3MjUzMiAxMDgxLjM1NjU2NTY0IDU1OS42NzI5NDM0NSBDIDEwODEuNDg4NDAwNjAgNTU4LjAzNjE2MTU4IDEwODEuNDcwMTIyMjcgNTU2LjMzMDU0Nzc2IDEwODEuMzM4ODI4MTQgNTU0LjU2OTIzMzMzIEMgMTA4MS4yMDc1MzQwMSA1NTIuODA3OTE4OTEgMTA4MC45NjMyMjQwOCA1NTAuOTkwOTAzODggMTA4MC43MDgwNzM0MCA1NDkuMTc1NDEyNDIgWiBNIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDQwOS4xMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgWiBNIDQ5My4wMDkyODc3MiA1MTcuMDQyNTY2MTYgQyA0OTYuMTQ0MjkwNTkgNTE2LjAxMTIyMzMxIDQ5OS4zMjExMjU0NiA1MTUuMTA3MDM4NDAgNTAyLjUxNTIzODg2IDUxNC4yNjY4MTI2OCBDIDUwNS43MDkzNTIyNiA1MTMuNDI2NTg2OTYgNTA4LjkyMDc0NDE5IDUxMi42NTAzMjA0MyA1MTIuMTQyOTYzMTYgNTExLjkyOTgxMDUwIEMgNTE1LjM2NTE4MjEzIDUxMS4yMDkzMDA1OCA1MTguNTk4MjI4MTQgNTEwLjU0NDU0NzI3IDUyMS44Mzk5NzIxMCA1MDkuOTQwNDQ4MzcgQyA1MjUuMDgxNzE2MDYgNTA5LjMzNjM0OTQ4IDUyOC4zMzIxNTc5NSA1MDguNzkyOTA1MDEgNTMxLjU5MzAxODQ5IDUwOC4zMjY2MTgzOSBDIDUzNC44NTM4NzkwMiA1MDcuODYwMzMxNzggNTM4LjEyNTE1ODIwIDUwNy40NzEyMDMwMiA1NDEuNDA4MjM0MzggNTA3LjE3NDYzMzM2IEMgNTQ0LjY5MTMxMDU1IDUwNi44NzgwNjM3MCA1NDcuOTg2MTgzNzIgNTA2LjY3NDA1MzEzIDU1MS4yODQwMTg1MiA1MDYuNTQ2Nzg2NjYgQSAyMTIuNzI5MjQ1MDYgMjEyLjcyOTI0NTA2IDAgMCAxIDYxNC41NDU3MDkwMCA5MjQuNTk4NDc1NzkgQyA2MTAuNjM0NDkwMjkgOTI1LjY0NjQ4MzY5IDYwNi42OTMzNDkxNCA5MjYuNTgyODE5NTMgNjAyLjcxMTA5ODg3IDkyNy40MjM0OTQzMCBDIDU5OC43Mjg4NDg2MSA5MjguMjY0MTY5MDYgNTk0LjcwNTQ4OTIzIDkyOS4wMDkxODI3NCA1OTAuNjM1OTM2NTIgOTI5LjY2OTY0NDgyIEMgNTg2LjU2NjM4MzgyIDkzMC4zMzAxMDY5MSA1ODIuNDUwNjM3NzcgOTMwLjkwNjAxNzM5IDU3OC4yODYzNDU3NSA5MzEuNDA2MzA2NTYgQyA1NzQuMTIyMDUzNzMgOTMxLjkwNjU5NTczIDU2OS45MDkyMTU3MyA5MzIuMzMxMjYzNTkgNTY1LjY0OTg0MzAxIDkzMi42ODU3NTEwMCBDIDU2MS4zOTA0NzAyOSA5MzMuMDQwMjM4NDEgNTU3LjA4NDU2Mjg0IDkzMy4zMjQ1NDUzNiA1NTIuNzM2NzA3NDUgOTMzLjU0MjA0NTg4IEMgNTQ4LjM4ODg1MjA3IDkzMy43NTk1NDY0MSA1NDMuOTk5MDQ4NzUgOTMzLjkxMDI0MDUyIDUzOS41NzQ2OTM3MSA5MzMuOTk1MjEyMzUgQyA1MzUuMTUwMzM4NjcgOTM0LjA4MDE4NDE5IDUzMC42OTE0MzE5MCA5MzQuMDk5NDMzNzUgNTI2LjIwNzMxNDQ0IDkzNC4wNTIzOTk0MiBDIDUyMS43MjMxOTY5OCA5MzQuMDA1MzY1MDkgNTE3LjIxMzg2ODgyIDkzMy44OTIwNDY4NSA1MTIuNjkwMzQ5MTMgOTMzLjcxMDM5MDcyIEMgNTA4LjE2NjgyOTQ1IDkzMy41Mjg3MzQ1OCA1MDMuNjI5MTE4MjQgOTMzLjI3ODc0MDUzIDQ5OS4wODkzMzMwMSA5MzIuOTU3MjY1NDMgQyA0OTQuNTQ5NTQ3NzggOTMyLjYzNTc5MDM0IDQ5MC4wMDc2ODg1NCA5MzIuMjQyODM0MjAgNDg1LjQ3NjU2MzUzIDkzMS43NzQ0MzU2MCBDIDQ4MC45NDU0Mzg1MiA5MzEuMzA2MDM3MDEgNDc2LjQyNTA0Nzc1IDkzMC43NjIxOTU5NiA0NzEuOTI4Mzk2NTQgOTMwLjEzODQ4NjE2IEMgNDY3LjQzMTc0NTM0IDkyOS41MTQ3NzYzNyA0NjIuOTU4ODMzNzAgOTI4LjgxMTE5NzgyIDQ1OC41MjI0MTU1MiA5MjguMDIzMTk1MjQgQyA0NTQuMDg1OTk3MzMgOTI3LjIzNTE5MjY3IDQ0OS42ODYwNzI1OSA5MjYuMzYyNzY2MDYgNDQ1LjMzNDY3OTA0IDkyNS40MDE2MDIxMyBDIDQ0MC45ODMyODU0OSA5MjQuNDQwNDM4MTkgNDM2LjY4MDQyMzEyIDkyMy4zOTA1MzY5MiA0MzIuNDM2OTQ0NjkgOTIyLjI0ODIyNDA0IEMgNDI4LjE5MzQ2NjI2IDkyMS4xMDU5MTExNyA0MjQuMDA5MzcxNzggOTE5Ljg3MTE4NjY5IDQxOS44OTM4ODQ5MSA5MTguNTQxNDEzMjAgQyA0MTUuNzc4Mzk4MDQgOTE3LjIxMTYzOTcxIDQxMS43MzE1MTg3OSA5MTUuNzg2ODE3MTkgNDA3Ljc2MDMzODIxIDkxNC4yNjU4MDcxOSBDIDQwMy43ODkxNTc2MiA5MTIuNzQ0Nzk3MTkgMzk5Ljg5MzY3NTcwIDkxMS4xMjc1OTk3MCAzOTYuMDc4NDU5MzggOTA5LjQxNDk1NjQ2IEMgMzkyLjI2MzI0MzA1IDkwNy43MDIzMTMyMiAzODguNTI4MjkyMzMgOTA1Ljg5NDIyNDIzIDM4NC44NzUwNDE3MCA5MDMuOTkzODY5NjQgQyAzODEuMjIxNzkxMDYgOTAyLjA5MzUxNTA2IDM3Ny42NTAyNDA1MSA5MDAuMTAwODk0ODggMzc0LjE1ODQ4NTg1IDg5OC4wMjE4NTQ0MCBDIDM3MC42NjY3MzEyMCA4OTUuOTQyODEzOTMgMzY3LjI1NDc3MjQ0IDg5My43NzczNTMxNiAzNjMuOTE2NDA1NjIgODkxLjUzNDgwNDY0IEMgMzYwLjU3ODAzODgwIDg4OS4yOTIyNTYxMyAzNTcuMzEzMjYzOTIgODg2Ljk3MjYxOTg3IDM1NC4xMTIwMTc1MyA4ODQuNTg4Mzg1NzQgQyAzNTAuOTEwNzcxMTMgODgyLjIwNDE1MTYxIDM0Ny43NzMwNTMyMyA4NzkuNzU1MzE5NjEgMzQ0LjY4MjgxNzc3IDg3Ny4yNTkyNTU4MyBDIDM0MS41OTI1ODIzMSA4NzQuNzYzMTkyMDYgMzM4LjU0OTgyOTI5IDg3Mi4yMTk4OTY1MSAzMzUuNTM0NzU2NzMgODY5LjY0OTc5ODU4IEMgMzMyLjUxOTY4NDE4IDg2Ny4wNzk3MDA2NSAzMjkuNTMyMjkyMDkgODY0LjQ4MjgwMDMyIDMyNi41NDQ5MDAwMCA4NjEuODg1OTAwMDAgQyAzMjkuNTMyMjkyMDkgODY0LjQ4MjgwMDMyIDMzMi41MTk2ODQxOCA4NjcuMDc5NzAwNjUgMzM1LjUzNDczMTQ5IDg2OS42NDc4ODU4OCBDIDMzOC41NDk3Nzg4MSA4NzIuMjE2MDcxMTIgMzQxLjU5MjQ4MTM2IDg3NC43NTU1NDEyNyAzNDQuNjgyNTkwNzEgODc3LjI0NDU2MDM4IEMgMzQ3Ljc3MjcwMDA3IDg3OS43MzM1Nzk0OSAzNTAuOTEwMjE2MjMgODgyLjE3MjE0NzU2IDM1NC4xMTExMjIzMCA4ODQuNTQxNzg4OTYgQyAzNTcuMzEyMDI4MzYgODg2LjkxMTQzMDM2IDM2MC41NzYzMjQzNCA4ODkuMjEyMTQ1MDkgMzYzLjkxMzk4ODU1IDg5MS40MzA2NTgzNyBDIDM2Ny4yNTE2NTI3NSA4OTMuNjQ5MTcxNjUgMzcwLjY2MjY4NTE4IDg5NS43ODU0ODM0NyAzNzQuMTUzMTg2MTEgODk3LjgyOTYwNzc2IEMgMzc3LjY0MzY4NzA1IDg5OS44NzM3MzIwNiAzODEuMjEzNjU2NDcgOTAxLjgyNTY2ODg0IDM4NC44NjQ4NzE2MSA5MDMuNjc5MTExOTUgQyAzODguNTE2MDg2NzUgOTA1LjUzMjU1NTA2IDM5Mi4yNDg1NDc2MCA5MDcuMjg3NTA0NTEgMzk2LjA2MDY3MDM3IDkwOC45NDA0OTcxNCBDIDM5OS44NzI3OTMxMyA5MTAuNTkzNDg5NzcgNDAzLjc2NDU3NzgxIDkxMi4xNDQ1MjU1NyA0MDcuNzMxMjg2MzIgOTEzLjU5MjgzMTkzIEMgNDExLjY5Nzk5NDgzIDkxNS4wNDExMzgyOCA0MTUuNzM5NjI3MTcgOTE2LjM4NjcxNTE4IDQxOS44NDg5MDQwMSA5MTcuNjMwOTc0NDggQyA0MjMuOTU4MTgwODYgOTE4Ljg3NTIzMzc4IDQyOC4xMzUxMDIxOSA5MjAuMDE4MTc1NTAgNDMyLjM3MDI0NjA3IDkyMS4wNjMwNzgzMSBDIDQzNi42MDUzODk5NiA5MjIuMTA3OTgxMTIgNDQwLjg5ODc1NjQwIDkyMy4wNTQ4NDUwMyA0NDUuMjM5Mjk1MjUgOTIzLjkwODM4NTk1IEMgNDQ5LjU3OTgzNDExIDkyNC43NjE5MjY4NyA0NTMuOTY3NTQ1MzkgOTI1LjUyMjE0NDc5IDQ1OC4zOTAyMDgzMSA5MjYuMTk0Nzk2OTQgQyA0NjIuODEyODcxMjMgOTI2Ljg2NzQ0OTA5IDQ2Ny4yNzA0ODU4MCA5MjcuNDUyNTM1NDcgNDcxLjc1MDE0NTE0IDkyNy45NTY0MTUyMyBDIDQ3Ni4yMjk4MDQ0OCA5MjguNDYwMjk0OTggNDgwLjczMTUwODU4IDkyOC44ODI5NjgxMSA0ODUuMjQyMTQ1MTYgOTI5LjIzMDkzNDk0IEMgNDg5Ljc1Mjc4MTczIDkyOS41Nzg5MDE3NyA0OTQuMjcyMzUwNzggOTI5Ljg1MjE2MjI5IDQ5OC43ODc5OTg5MCA5MzAuMDU2ODkzNTAgQyA1MDMuMzAzNjQ3MDMgOTMwLjI2MTYyNDcyIDUwNy44MTUzNzQyMyA5MzAuMzk3ODI2NjEgNTEyLjMxMTA5MTM5IDkzMC40NzA4MjU5MCBDIDUxNi44MDY4MDg1NSA5MzAuNTQzODI1MTkgNTIxLjI4NjUxNTY2IDkzMC41NTM2MjE4NyA1MjUuNzM5MzA0NzIgOTMwLjUwNDI0MzY0IEMgNTMwLjE5MjA5Mzc5IDkzMC40NTQ4NjU0MSA1MzQuNjE3OTY0ODAgOTMwLjM0NjMxMjI4IDUzOS4wMDc3Njg5MSA5MzAuMTgwNjkwMTkgQyA1NDMuMzk3NTczMDIgOTMwLjAxNTA2ODEwIDU0Ny43NTEzMTAyMiA5MjkuNzkyMzc3MDUgNTUyLjA2MTg1NTQzIDkyOS41MTI1MDQyNSBDIDU1Ni4zNzI0MDA2NSA5MjkuMjMyNjMxNDQgNTYwLjYzOTc1Mzg5IDkyOC44OTU1NzY4OCA1NjQuODU5NjUxNzYgOTI4LjQ5ODEyNjgwIEMgNTY5LjA3OTU0OTYzIDkyOC4xMDA2NzY3MyA1NzMuMjUxOTkyMTMgOTI3LjY0MjgzMTE1IDU3Ny4zNzUzMzU1MiA5MjcuMTE4NTI3MTAgQyA1ODEuNDk4Njc4OTAgOTI2LjU5NDIyMzA2IDU4NS41NzI5MjMxNyA5MjYuMDAzNDYwNTQgNTg5LjYwMDc2MzQ1IDkyNS4zMzU1NjU2NyBDIDU5My42Mjg2MDM3MyA5MjQuNjY3NjcwODAgNTk3LjYxMDA0MDAyIDkyMy45MjI2NDM1NiA2MDEuNTUwNDg2MzcgOTIzLjA4NjkxMzc1IEMgNjA1LjQ5MDkzMjcxIDkyMi4yNTExODM5NCA2MDkuMzkwMzg5MTAgOTIxLjMyNDc1MTU1IDYxMy4yNjAyMzk1NCA5MjAuMjg3ODI4MjUgQSAyMTAuNDc5MjQ1MDYgMjEwLjQ3OTI0NTA2IDAgMCAwIDU1MC42Njc2NTY4OSA1MDYuNjU3Nzk4NjggQyA1NDcuNDA0NzAyNzEgNTA2Ljc4MzcxOTA4IDU0NC4xNDQ2Nzg4NCA1MDYuOTg1NTcxODYgNTQwLjg5NjE5NzkwIDUwNy4yNzg2MTE3OCBDIDUzNy42NDc3MTY5NyA1MDcuNTcxNjUxNjkgNTM0LjQxMDc3ODk4IDUwNy45NTU4Nzg3MyA1MzEuMTg0MTQxMTggNTA4LjQxNjQyMjQ4IEMgNTI3Ljk1NzUwMzM4IDUwOC44NzY5NjYyMiA1MjQuNzQxMTY1NzggNTA5LjQxMzgyNjY3IDUyMS41MzM1NTQ5MSA1MTAuMDExMDY3MTcgQyA1MTguMzI1OTQ0MDQgNTEwLjYwODMwNzY4IDUxNS4xMjcwNTk5MSA1MTEuMjY1OTI4MjQgNTExLjkzOTA0MjY3IDUxMS45NzkxODQ5MyBDIDUwOC43NTEwMjU0NCA1MTIuNjkyNDQxNjEgNTA1LjU3Mzg3NTEwIDUxMy40NjEzMzQ0MiA1MDIuNDEzOTAxODAgNTE0LjI5Mzc1NjkzIEMgNDk5LjI1MzkyODQ5IDUxNS4xMjYxNzk0NCA0OTYuMTExMTMyMjIgNTE2LjAyMjEzMTY0IDQ5My4wMDkyODc3MiA1MTcuMDQyNTY2MTYgWiIgZmlsbD0iIzE2MzYzQiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXBhdGg9InVybCgjZWxhbnVtLWxpbWl0KSIvPjwvc3ZnPg=="
};
function updateSignature(){
  const blueprint=signatureMode==='blueprint';
  const original=$('#showOriginal').checked&&!blueprint;
  const base=signatureMode==='master'?'ELANUM-Master-Spektrum':'ELANUM-System-Ink';
  $('#signatureImage').src=blueprint?'assets/ELANUM-Konstruktion-Geometrisch.svg':`assets/${base}${original?'':'-Geometrisch'}.svg`;
  $('#signatureStage').dataset.mode=signatureMode;
  const mode={master:'Spektrum',ink:'Ink',inverse:'Invers',relief:'Papierrelief',blueprint:'Blueprint'}[signatureMode];
  const variant=original?'Unverändertes Original':'Sechs Grundkreise';
  $('#signatureImage').hidden=signatureMode==='relief';
  $('#signatureRelief').hidden=signatureMode!=='relief';
  $('#signatureRelief span').style.maskImage='url("'+reliefMasks[original?'original':'Geometrisch']+'")';
  $('#showOriginal').disabled=blueprint;
  $('#signatureLabel').textContent=mode+' · '+variant;
  $('#signatureImage').alt=blueprint?'ELANUM Blueprint mit sechs Grundkreisen und fünf Brücken':'ELANUM '+mode+', '+variant;
  $$('[data-signature-mode]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.signatureMode===signatureMode));
}
$$('[data-signature-mode]').forEach(button=>button.addEventListener('click',()=>{signatureMode=button.dataset.signatureMode;updateSignature();}));
$('#showOriginal').addEventListener('change',updateSignature);
updateSignature();

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
