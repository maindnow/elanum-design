'use strict';
/* ============================================================
   ELANUM Gestaltungsatlas 4.5 · Bedienlogik
   Elemente (Beziehungsraum, Resonanzrad, Umfeld) liegen unter
   components/ und werden hier nur eingebunden. Bewegung steuert
   assets/motion.js; dieses Skript meldet Pause und Layoutwechsel.
   ============================================================ */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

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

/* ---------- Bewegung: eine Pause für alles ---------- */
const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
let paused = false;
const motionOn = () => !paused && !reducedMotion.matches;
function syncMotion() {
  const off = !motionOn();
  document.body.dataset.motion = off ? 'off' : 'on';
  window.ElanumBeziehung.setPaused(paused);
  $$('[data-motion-toggle]').forEach(button => {
    button.setAttribute('aria-pressed', String(off));
    button.disabled = reducedMotion.matches;
    button.textContent = reducedMotion.matches ? 'Bewegung reduziert' : paused ? 'Bewegung fortsetzen' : 'Bewegung pausieren';
  });
  $('#motionPreference').textContent = reducedMotion.matches ? 'Dein System bevorzugt reduzierte Bewegung. Alle Darstellungen bleiben ruhig.' : 'Die Systemeinstellung für reduzierte Bewegung wird respektiert.';
  document.dispatchEvent(new CustomEvent('elanum:motion', { detail: { off } }));
}
$$('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => { paused = !paused; syncMotion(); }));
reducedMotion.addEventListener('change', syncMotion);

/* ---------- Navigation ---------- */
const narrow = matchMedia('(max-width:1000px)');
function setMenu(open) {
  $('#sidebar').dataset.open = String(open);
  $('#menuToggle').setAttribute('aria-expanded', open);
  $('#menuToggle').setAttribute('aria-label', open ? 'Navigation schliessen' : 'Navigation öffnen');
  $('#menuScrim').hidden = !open;
  if (open && motionOn()) $('#menuScrim').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
  document.body.style.overflow = open && narrow.matches ? 'hidden' : '';
}
$('#menuToggle').addEventListener('click', () => setMenu($('#sidebar').dataset.open !== 'true'));
$('#menuScrim').addEventListener('click', () => setMenu(false));
narrow.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && $('#sidebar').dataset.open === 'true') { setMenu(false); $('#menuToggle').focus(); }
});
const navLinks = $$('.sidebar nav a');
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
const sections = $$('main > section[id]');
function updateNavigation() {
  let id = 'intro';
  for (const section of sections) if (section.getBoundingClientRect().top <= 180) id = section.id;
  navLinks.forEach(link => {
    const active = link.hash === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
addEventListener('scroll', updateNavigation, { passive: true }); updateNavigation();

/* ---------- 03 Beziehung ---------- */
window.ElanumBeziehung.mountAll();
const lab = $('#lab');
let labMode = 'spectrum';
function updateLab() {
  const value = id => +$('#' + id).value;
  const state = { proximity: value('proximity'), resonance: value('resonance'), openness: value('openness') };
  const words = {
    proximity: state.proximity < 34 ? 'weit' : state.proximity < 75 ? 'nah' : 'sehr nah',
    resonance: state.resonance === 0 ? 'keine' : state.resonance < 40 ? 'leise' : state.resonance < 80 ? 'spürbar' : 'stark',
    openness: state.openness < 30 ? 'klein' : state.openness < 60 ? 'offen' : 'weit offen'
  };
  Object.entries(words).forEach(([key, text]) => { $('#' + key + 'Value').textContent = text; $('#' + key).setAttribute('aria-valuetext', text); });
  $('#labReading').textContent = (state.proximity < 34 ? 'Viel eigener Raum' : state.proximity < 75 ? 'Nah beieinander' : 'Grosse Nähe, eigener Raum') + ' · ' +
    (state.resonance === 0 ? 'keine aktive Verbindung' : state.resonance < 40 ? 'leise Resonanz' : state.resonance < 80 ? 'spürbare Resonanz' : 'starke Resonanz');
  window.ElanumBeziehung.set(lab, state);
}
['proximity', 'resonance', 'openness'].forEach(id => $('#' + id).addEventListener('input', updateLab));
$$('[data-lab-mode]').forEach(button => button.addEventListener('click', () => {
  labMode = button.dataset.labMode;
  $$('[data-lab-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  window.ElanumBeziehung.setMode(lab, labMode);
}));
updateLab();
window.ElanumBeziehung.onPhase(text => { $('#breathPhase').textContent = text; });

/* ---------- 02 Zeichen: geprüfte Dateien aus tools/build_logo_geometrie.py, nie eine zur Laufzeit erzeugte Form ---------- */
/* Relief-Masken eingebettet, damit die Prägung auch unter file:// funktioniert (base64 der Ink-Dateien) */
const MASKS = { original: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiPjxkZWZzPjxjbGlwUGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpLXN5c3RlbS1saW1pdCI+PHBhdGggZD0iTSAxMDgyLjcwNTggNTY1LjUwMDAgQSA0NjAuNTQgNDYwLjU0IDAgMSAwIDEwODUuMTcxNSA2MTcuNDAwMCBDIDk4MC41MDAwIDY3NC45MDAwIDg4Ny45MDAwIDY1Mi44MDAwIDgwOS4wMDAwIDU0MC4wMDAwIEMgOTQwLjIxMTIgNzA2LjI1OTggMTA2OC4wMDU3IDU4Ni4yMzM3IDEwODIuNzA1OCA1NjUuNTAwMCBaIE0gNjUzLjE5OTk5OTk5OTk5OTkgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA0MDkuMDk5OTk5OTk5OTk5OTcgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJNIDEwODIuNzA1OCA1NjUuNTAwMCBBIDQ2MC41NCA0NjAuNTQgMCAxIDAgMTA4NS4xNzE1IDYxNy40MDAwIEMgOTgwLjUwMDAgNjc0LjkwMDAgODg3LjkwMDAgNjUyLjgwMDAgODA5LjAwMDAgNTQwLjAwMDAgQyA5NDAuMjExMiA3MDYuMjU5OCAxMDY4LjAwNTcgNTg2LjIzMzcgMTA4Mi43MDU4IDU2NS41MDAwIFogTSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDQwOS4wOTk5OTk5OTk5OTk5NyA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBaIE0gNjUzLjIwMDAgNjMzLjAwMDAgQyA2NDguODExNSA3MTYuNzU4OCA1ODQuMzY4MyA3ODIuMDY5NSA0OTkuNzAwMCA3ODEuNjU4MSBDIDQxMy4wMTA0IDc4MS4xNjI2IDM0Ny42MTgxIDcxMy4wMjkwIDM0NC43NDYzIDYyOS45MDg4IEMgMzQxLjc2NDAgNTEzLjM5NTUgNDQ5LjU1NTkgNDA4LjE0NjUgNTgwLjIwMDAgNDA3LjU0MTkgQyA2NzQuMjY3NiA0MDcuMDgxMiA3NTUuNzcyOSA0NTIuNjYyMCA4MDkuMDAwMCA1NDAuMDAwMCBDIDc1OC41Mzg3IDQ1MC45MjUwIDY3NS42Njk0IDQwMy4zMTg4IDU4MC4yMDAwIDQwMi44NTgxIEMgNDQ3LjAxNTUgNDAyLjI1MzUgMzM1LjUzMTMgNTA5LjU3MDEgMzM4Ljg1MzcgNjMwLjA5MTIgQyAzNDEuOTYyNCA3MTYuMzI5NCA0MTAuNjUwOCA3ODYuNDM3NCA0OTkuNzAwMCA3ODUuOTQxOSBDIDU4Ni41ODI0IDc4NS41MzA1IDY1MS44MTgwIDcxNy4wNTAyIDY1My4yMDAwIDYzMy4wMDAwIFogTSA0OTMuMDAwMCA1MTcuMDAwMCBDIDYxNi42OTY5IDQ2NS44MzY4IDc0Mi4yMzkxIDUyMC4wMjE3IDc3Ni41MzQyIDY1Ny4zMTQwIEMgODA5LjkxMDggODI0LjIzMzkgNjU5Ljk0MjcgOTY2LjI5NTEgNDg0Ljk3NjUgOTM3LjQ2MjYgQyA0MTAuNTkxMyA5MTMuOTcwNCAzNjAuMTU0NCA5MDguOTM0NSAzMjYuNTQ0OSA4NjEuODg1OSBDIDM1OC41NjI4IDkxMC40MDk5IDQxMC40MTA2IDkxNi40NTM5IDQ4NC4yMjM1IDk0MC41Mzc0IEMgNjYxLjIxNDEgOTcyLjAzMTEgODE2LjE4NTAgODI2Ljk1MTEgNzgxLjA2NTggNjU2LjI4NjAgQyA3NDUuNzYwOSA1MTYuMzc4MyA2MTUuMzAzMSA0NjIuMTYzMiA0OTMuMDAwMCA1MTcuMDAwMCBaIiBmaWxsPSIjMTYzNjNCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcGF0aD0idXJsKCNpLXN5c3RlbS1saW1pdCkiLz48L3N2Zz4=', Geometrisch: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiIHJvbGU9ImltZyI+PHRpdGxlPkVMQU5VTTogc2VjaHMgR3J1bmRrcmVpc2U8L3RpdGxlPjxkZXNjPk1hbnRlbCwgWmVudHJ1bSwgT2JlcmJvZ2VuLCBVbnRlcmJvZ2VuIHVuZCB6d2VpIE3DvG5kdW5nc2tyZWlzZS4gQmVuYW5udGUgQsOpemllcmJyw7xja2VuIHZlcmJpbmRlbiBkaWUgQsO2Z2VuLjwvZGVzYz48ZGVmcz48Y2xpcFBhdGggaWQ9ImVsYW51bS1saW1pdCI+PHBhdGggZD0iTSAxMDg1LjE5MDAxNzAyIDYxMy4yNzAxOTIzNCBBIDQ2MC41NDAwMDAwMCA0NjAuNTQwMDAwMDAgMCAxIDEgMTY0LjExMDAxNzAyIDYxMy4yNzAxOTIzNCBBIDQ2MC41NDAwMDAwMCA0NjAuNTQwMDAwMDAgMCAxIDEgMTA4NS4xOTAwMTcwMiA2MTMuMjcwMTkyMzQgWiBNIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDQwOS4xMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggZD0iTSAxMDgwLjcwODA3MzQwIDU0OS4xNzU0MTI0MiBBIDQ2MC41NDAwMDAwMCA0NjAuNTQwMDAwMDAgMCAxIDAgMTA4NC40MjYzNTcyNCA2MzkuNzgwNzI5MzIgQyAxMDg0LjUwNzkwNjI4IDYzOC4zNjY0MTE3NCAxMDg0LjU4MjkyOTQ1IDYzNi45NTE3MTc4OSAxMDg0LjUyNzM1MTQzIDYzNS41ODg1ODUwOSBDIDEwODQuNDcxNzczNDEgNjM0LjIyNTQ1MjI5IDEwODQuMjg1NTk0MjEgNjMyLjkxMzg4MDU0IDEwODMuOTM3MTkyMzggNjMxLjcxMjY3OTczIEMgMTA4My41ODg3OTA1NSA2MzAuNTExNDc4OTMgMTA4My4wNzgxNjYxMSA2MjkuNDIwNjQ5MDcgMTA4Mi40MDI3NTUzMyA2MjguNDkxMDk4MzggQyAxMDgxLjcyNzM0NDU2IDYyNy41NjE1NDc2OCAxMDgwLjg4NzE0NzQ1IDYyNi43OTMyNzYxNiAxMDc5LjkyMjcyMDAxIDYyNi4yMjA1NTY2OSBDIDEwNzguOTU4MjkyNTcgNjI1LjY0NzgzNzIxIDEwNzcuODY5NjM0NzkgNjI1LjI3MDY2OTc5IDEwNzYuNzA5MjIxODggNjI1LjEwMjczMjE3IEMgMTA3NS41NDg4MDg5NyA2MjQuOTM0Nzk0NTQgMTA3NC4zMTY2NDA5MiA2MjQuOTc2MDg2NzEgMTA3My4wNTc1NTUxMCA2MjUuMTk1NjEyODIgQyAxMDcxLjc5ODQ2OTI4IDYyNS40MTUxMzg5MiAxMDcwLjUxMjQ2NTY4IDYyNS44MTI4OTg5NyAxMDY5LjIzNjMzMjY4IDYyNi4zMjk0OTc4NiBDIDEwNjcuOTYwMTk5NjggNjI2Ljg0NjA5Njc1IDEwNjYuNjkzOTM3MjkgNjI3LjQ4MTUzNDQ4IDEwNjUuNDIwNjQ1NzIgNjI4LjEwMjU2MDI3IEEgMTg3Ljc0MzMwMDAwIDE4Ny43NDMzMDAwMCAwIDAgMSA4NjEuOTczNTAxMzcgNjAyLjc4NjY5ODg0IEMgODU4LjYyMzk2ODIwIDU5OS45NTc1MDMxMCA4NTUuMzczNTQzMDAgNTk3LjAxMDk3MTc1IDg1Mi4yMTQ1ODgzNyA1OTMuOTcwNDU1MDEgQyA4NDkuMDU1NjMzNzUgNTkwLjkyOTkzODI3IDg0NS45ODgxNDk3MiA1ODcuNzk1NDM2MTQgODQyLjk5OTk3Mzc5IDU4NC41ODcwMjc5MSBDIDg0MC4wMTE3OTc4NiA1ODEuMzc4NjE5NjggODM3LjEwMjkzMDAzIDU3OC4wOTYzMDUzNCA4MzQuMjU5NzYyODYgNTc0Ljc1ODU0NjE2IEMgODMxLjQxNjU5NTcwIDU3MS40MjA3ODY5NyA4MjguNjM5MTI5MTkgNTY4LjAyNzU4Mjk0IDgyNS45MTEyNzUyMSA1NjQuNTk1MDQ1MTQgQyA4MjMuMTgzNDIxMjIgNTYxLjE2MjUwNzM0IDgyMC41MDUxNzk3NyA1NTcuNjkwNjM1NzcgODE3Ljg1OTU1ODEyIDU1NC4xOTQyNjI4MSBDIDgxNS4yMTM5MzY0OCA1NTAuNjk3ODg5ODUgODEyLjYwMDkzNDY1IDU0Ny4xNzcwMTU0OSA4MTAuMDAyNjI1NDYgNTQzLjY0NTM4MjQzIEMgODA3LjQwNDMxNjI2IDU0MC4xMTM3NDkzNyA4MDQuODIwNjk5NzAgNTM2LjU3MTM1NzYwIDgwMi4yMzM1NTA0NiA1MzMuMDMxNTAyMzIgQyA3OTkuNjQ2NDAxMjIgNTI5LjQ5MTY0NzA0IDc5Ny4wNTU3MTkyOSA1MjUuOTU0MzI4MjUgNzk0LjQ0MzQzNTIwIDUyMi40MzMwMzIxMCBDIDc5MS44MzExNTExMSA1MTguOTExNzM1OTYgNzg5LjE5NzI2NDg1IDUxNS40MDY0NjI0NyA3ODYuNTIzOTg2ODcgNTExLjkzMTE2MTA2IEMgNzgzLjg1MDcwODg5IDUwOC40NTU4NTk2NCA3ODEuMTM4MDM5MTkgNTA1LjAxMDUzMDI5IDc3OC4zNjk1NzAzMSA1MDEuNjEwNzA0MTMgQyA3NzUuNjAxMTAxNDIgNDk4LjIxMDg3Nzk2IDc3Mi43NzY4MzMzNSA0OTQuODU2NTU0OTkgNzY5Ljg4MTE0MDIwIDQ5MS41NjQzMzQ5NyBDIDc2Ni45ODU0NDcwNCA0ODguMjcyMTE0OTUgNzY0LjAxODMyODgwIDQ4NS4wNDE5OTc5MCA3NjAuOTY3MDc3NDYgNDgxLjg5MzQxMzA5IEEgMjQ2LjEyNjU4Mjg1IDI0Ni4xMjY1ODI4NSAwIDAgMCA1NzEuODAxMzMzNTEgNDA3LjM2NDY1NjkyIEMgNTYxLjMxMzA5MTkzIDQwNy44OTQ0Nzk2NCA1NTAuODYwODI3MTcgNDA5LjA5NTQ1OTA5IDU0MC41MzUyODc2NCA0MTAuOTg3NjI0NTcgQyA1MzAuMjA5NzQ4MTAgNDEyLjg3OTc5MDA0IDUyMC4wMTA5MzM3OCA0MTUuNDYzMTQxNTUgNTEwLjA0MTk3MTgwIDQxOC43Mzk0OTk0MSBDIDUwMC4wNzMwMDk4MyA0MjIuMDE1ODU3MjggNDkwLjMzMzkwMDIxIDQyNS45ODUyMjE1MSA0ODAuOTMyMDI0MTggNDMwLjYzNTM4OTM5IEMgNDcxLjUzMDE0ODE2IDQzNS4yODU1NTcyNyA0NjIuNDY1NTA1NzQgNDQwLjYxNjUyODgwIDQ1My44NTEzMjAzMyA0NDYuNTk0MzExNDkgQyA0NDUuMjM3MTM0OTIgNDUyLjU3MjA5NDE4IDQzNy4wNzM0MDY1MyA0NTkuMTk2Njg4MDQgNDI5LjQ3Mjg1ODgwIDQ2Ni40MTMzMDg0MiBDIDQyMS44NzIzMTEwOCA0NzMuNjI5OTI4ODEgNDE0LjgzNDk0NDAyIDQ4MS40Mzg1NzU3MyA0MDguNDcwMDU4MTIgNDg5Ljc2MDMwMTEzIEMgNDAyLjEwNTE3MjIyIDQ5OC4wODIwMjY1MyAzOTYuNDEyNzY3NDcgNTA2LjkxNjgzMDQxIDM5MS40OTI4NTMxNiA1MTYuMTYxODA0NjggQyAzODYuNTcyOTM4ODYgNTI1LjQwNjc3ODk0IDM4Mi40MjU1MTQ5OSA1MzUuMDYxOTIzNTcgMzc5LjEzNTk3MzM0IDU0NS4wMDAxMTY0OSBDIDM3NS44NDY0MzE2OSA1NTQuOTM4MzA5NDEgMzczLjQxNDc3MjI1IDU2NS4xNTk1NTA2MiAzNzEuOTA1NjQ5MjEgNTc1LjUxNDQ3NDEyIEMgMzcwLjM5NjUyNjE2IDU4NS44NjkzOTc2MSAzNjkuODA5OTM5NTIgNTk2LjM1ODAwMzQwIDM3MC4xODM1MDczNyA2MDYuODExNDg0MjcgQyAzNzAuNTU3MDc1MjMgNjE3LjI2NDk2NTE0IDM3MS44OTA3OTc1OSA2MjcuNjgzMzIxMDggMzc0LjE4OTkxMDE5IDYzNy44ODM0ODU2NiBDIDM3Ni40ODkwMjI4MCA2NDguMDgzNjUwMjMgMzc5Ljc1MzUyNTY0IDY1OC4wNjU2MjM0MyAzODMuOTQ5OTcyOTAgNjY3LjYzNzg3NDE3IEMgMzg4LjE0NjQyMDE2IDY3Ny4yMTAxMjQ5MSAzOTMuMjc0ODExODIgNjg2LjM3MjY1MzE4IDM5OS4yNTMwODAwOCA2OTQuOTQyMDAwNzkgQyA0MDUuMjMxMzQ4MzMgNzAzLjUxMTM0ODQxIDQxMi4wNTk0OTMxOCA3MTEuNDg3NTE1MzYgNDE5LjYyMjI1OTI3IDcxOC42OTc4NTM0NiBDIDQyNy4xODUwMjUzNiA3MjUuOTA4MTkxNTcgNDM1LjQ4MjQxMjY5IDczMi4zNTI3MDA4NCA0NDQuMzYxNTk5OTQgNzM3Ljg3NDM2MTQ3IEMgNDUzLjI0MDc4NzE4IDc0My4zOTYwMjIwOSA0NjIuNzAxNzc0MzUgNzQ3Ljk5NDgzNDA5IDQ3Mi41NTM1NjY3MiA3NTEuNTM4NzQ2NjcgQyA0ODIuNDA1MzU5MTAgNzU1LjA4MjY1OTI1IDQ5Mi42NDc5NTY2OCA3NTcuNTcxNjcyNDEgNTAzLjA1MTUzODc0IDc1OC45MDk5OTc1MSBDIDUxMy40NTUxMjA3OSA3NjAuMjQ4MzIyNjEgNTI0LjAxOTY4NzMyIDc2MC40MzU5NTk2NSA1MzQuNDg0MjgyNzkgNzU5LjQyNzQxODc3IEMgNTQ0Ljk0ODg3ODI3IDc1OC40MTg4Nzc4OSA1NTUuMzEzNTAyNzAgNzU2LjIxNDE1OTEwIDU2NS4yOTI4MDQxOSA3NTIuODMwOTMxNzkgQyA1NzUuMjcyMTA1NjkgNzQ5LjQ0NzcwNDQ3IDU4NC44NjYwODQyNiA3NDQuODg1OTY4NjMgNTkzLjc5MDE1MzAyIDczOS4yMzg2NzA4NCBDIDYwMi43MTQyMjE3NyA3MzMuNTkxMzczMDQgNjEwLjk2ODM4MDcwIDcyNi44NTg1MTMyOSA2MTguMjc2OTI3MTcgNzE5LjIxMTMzMDM5IEMgNjI1LjU4NTQ3MzY0IDcxMS41NjQxNDc0OCA2MzEuOTQ4NDA3NjUgNzAzLjAwMjY0MTQyIDYzNy4xNTEyMjE0NyA2OTMuNzc3MTc0NDYgQyA2NDIuMzU0MDM1MjkgNjg0LjU1MTcwNzQ5IDY0Ni4zOTY3Mjg5NCA2NzQuNjYyMjc5NjIgNjQ5LjEwODIyMDExIDY2NC40MTg3NTcwNiBDIDY1MS44MTk3MTEyOSA2NTQuMTc1MjM0NTAgNjUzLjIwMDAwMDAwIDY0My41Nzc2MTcyNSA2NTMuMjAwMDAwMDAgNjMyLjk4MDAwMDAwIEMgNjUzLjIwMDAwMDAwIDY0My41Nzc2MTcyNSA2NTEuODE5NzExMjkgNjU0LjE3NTIzNDUwIDY0OS4xMjg5NDMzNiA2NjQuNDI2Mzk3NzQgQyA2NDYuNDM4MTc1NDMgNjc0LjY3NzU2MDk4IDY0Mi40MzY5MjgyOSA2ODQuNTgyMjcwMjEgNjM3LjI5MDk2NjU2IDY5My44NTQzMjMzNyBDIDYzMi4xNDUwMDQ4MiA3MDMuMTI2Mzc2NTMgNjI1Ljg1NDMyODUxIDcxMS43NjU3NzM2MiA2MTguNjE1MzUyMjcgNzE5LjUzMTMxMTU4IEMgNjExLjM3NjM3NjAzIDcyNy4yOTY4NDk1MyA2MDMuMTg5MDk5ODcgNzM0LjE4ODUyODM2IDU5NC4zMDIzNzQ0NCA3NDAuMDMxOTMwODcgQyA1ODUuNDE1NjQ5MDIgNzQ1Ljg3NTMzMzM4IDU3NS44Mjk0NzQzNCA3NTAuNjcwNDU5NTYgNTY1LjgwOTEzNDEzIDc1NC4zMDI4MTk5MSBDIDU1NS43ODg3OTM5MiA3NTcuOTM1MTgwMjYgNTQ1LjMzNDI4ODE3IDc2MC40MDQ3NzQ3OCA1MzQuNzI1MjYwOTkgNzYxLjY2NDQ1Njc2IEMgNTI0LjExNjIzMzgwIDc2Mi45MjQxMzg3NCA1MTMuMzUyNjg1MTcgNzYyLjk3MzkwODE4IDUwMi43MDcyNzM4OCA3NjEuODMwMDkxMzUgQyA0OTIuMDYxODYyNjAgNzYwLjY4NjI3NDUyIDQ4MS41MzQ1ODg2NyA3NTguMzQ4ODcxNDEgNDcxLjM3OTcyMzM4IDc1NC44OTUwNjA5OSBDIDQ2MS4yMjQ4NTgxMCA3NTEuNDQxMjUwNTcgNDUxLjQ0MjQwMTQ3IDc0Ni44NzEwMzI4NCA0NDIuMjUyNzQ1ODYgNzQxLjMxMzYzNDAzIEMgNDMzLjA2MzA5MDI2IDczNS43NTYyMzUyMiA0MjQuNDY2MjM1NjggNzI5LjIxMTY1NTM0IDQxNi42MzgwODUyMCA3MjEuODQ5Njc1MDggQyA0MDguODA5OTM0NzMgNzE0LjQ4NzY5NDgzIDQwMS43NTA0ODgzNiA3MDYuMzA4MzE0MjAgMzk1LjU4MzU5ODc4IDY5Ny41MDczNzI1MSBDIDM4OS40MTY3MDkyMSA2ODguNzA2NDMwODIgMzg0LjE0MjM3NjQzIDY3OS4yODM5MjgwNyAzNzkuODI4NTQwMTMgNjY5LjQ0NDYyNzg4IEMgMzc1LjUxNDcwMzgzIDY1OS42MDUzMjc2OSAzNzIuMTYxMzY0MDEgNjQ5LjM0OTIzMDA2IDM2OS44MDAxMjUzMSA2MzguODcyOTcwMjggQyAzNjcuNDM4ODg2NjIgNjI4LjM5NjcxMDQ5IDM2Ni4wNjk3NDkwNSA2MTcuNzAwMjg4NTUgMzY1LjY4NjMxMTIyIDYwNi45NzIxNDQ3OCBDIDM2NS4zMDI4NzM0MCA1OTYuMjQ0MDAxMDEgMzY1LjkwNTEzNTMyIDU4NS40ODQxMzU0MSAzNjcuNDUyNzIzMjQgNTc0Ljg2NTQ4NjA2IEMgMzY5LjAwMDMxMTE1IDU2NC4yNDY4MzY3MSAzNzEuNDkzMjI1MDYgNTUzLjc2OTQwMzYxIDM3NC44NjM5MDEyNCA1NDMuNTg2MDM1OTYgQyAzNzguMjM0NTc3NDEgNTMzLjQwMjY2ODMwIDM4Mi40ODMwMTU4NCA1MjMuNTEzMzY2MTAgMzg3LjUyMDM2OTEyIDUxNC4wNDc3MzA3NyBDIDM5Mi41NTc3MjI0MCA1MDQuNTgyMDk1NDQgMzk4LjM4Mzk5MDUyIDQ5NS41NDAxMjY5OSA0MDQuODk1NzAyNjYgNDg3LjAyNjQyNjMzIEMgNDExLjQwNzQxNDgxIDQ3OC41MTI3MjU2OCA0MTguNjA0NTcwOTcgNDcwLjUyNzI5MjgxIDQyNi4zNzQzODE4NiA0NjMuMTQ5OTYxMDggQyA0MzQuMTQ0MTkyNzUgNDU1Ljc3MjYyOTM1IDQ0Mi40ODY2NTgzNyA0NDkuMDAzMzk4NzUgNDUxLjI4NTc5OTk0IDQ0Mi44OTcyNjU2NyBDIDQ2MC4wODQ5NDE1MSA0MzYuNzkxMTMyNTkgNDY5LjM0MDc1OTAyIDQzMS4zNDgwOTcwMiA0NzguOTM3MDAwNjggNDI2LjYwMTc5NDE0IEMgNDg4LjUzMzI0MjM0IDQyMS44NTU0OTEyNyA0OTguNDY5OTA4MTMgNDE3LjgwNTkyMTA4IDUwOC42MzcwMTU3NSA0MTQuNDY0NDQzMDcgQyA1MTguODA0MTIzMzcgNDExLjEyMjk2NTA3IDUyOS4yMDE2NzI4MSA0MDguNDg5NTc5MjMgNTM5LjcyNDIxNzExIDQwNi41NjEzMTIyOCBDIDU1MC4yNDY3NjE0MSA0MDQuNjMzMDQ1MzIgNTYwLjg5NDMwMDU3IDQwMy40MDk4OTcyNCA1NzEuNTc0MzAxNTYgNDAyLjg3MDM4NzYzIEEgMjUwLjYyNjU4Mjg1IDI1MC42MjY1ODI4NSAwIDAgMSA3NzcuMTM5NDg3OTMgNDkzLjE5MjUxMjU1IEMgNzc5LjEyMjY3MDczIDQ5NS41ODM5NjM2NSA3ODEuMDYxMzg2NzggNDk4LjAxMjI5MDE1IDc4Mi45NjM5OTg4MSA1MDAuNDY4MzI5NzAgQyA3ODQuODY2NjEwODMgNTAyLjkyNDM2OTI0IDc4Ni43MzMxMTg4MiA1MDUuNDA4MTIxODQgNzg4LjU3Mjg2NjU1IDUwNy45MTE1Njk4NSBDIDc5MC40MTI2MTQyOCA1MTAuNDE1MDE3ODYgNzkyLjIyNTYwMTc1IDUxMi45MzgxNjEyOCA3OTQuMDIxNDIwNDUgNTE1LjQ3MzM1MzgwIEMgNzk1LjgxNzIzOTE1IDUxOC4wMDg1NDYzMSA3OTcuNTk1ODg5MTAgNTIwLjU1NTc4NzkxIDc5OS4zNjczOTY1OSA1MjMuMTA3OTk2NTYgQyA4MDEuMTM4OTA0MDkgNTI1LjY2MDIwNTIwIDgwMi45MDMyNjkxNCA1MjguMjE3MzgwODggODA0LjY3MDU2NDUzIDUzMC43NzI1Mjc3NSBDIDgwNi40Mzc4NTk5MyA1MzMuMzI3Njc0NjIgODA4LjIwODA4NTY4IDUzNS44ODA3OTI2OCA4MDkuOTkxMjg3NDcgNTM4LjQyNDg0ODU0IEMgODExLjc3NDQ4OTI3IDU0MC45Njg5MDQ0MCA4MTMuNTcwNjY3MTEgNTQzLjUwMzg5ODA1IDgxNS4zODk2NzE3NiA1NDYuMDIyNDk3MTIgQyA4MTcuMjA4Njc2NDEgNTQ4LjU0MTA5NjIwIDgxOS4wNTA1MDc4NiA1NTEuMDQzMzAwNjkgODIwLjkyNDU0NjgyIDU1My41MjExOTQ5NiBDIDgyMi43OTg1ODU3OSA1NTUuOTk5MDg5MjQgODI0LjcwNDgzMjI1IDU1OC40NTI2NzMyOSA4MjYuNjUyMjIwNjUgNTYwLjg3MzM5NTA2IEMgODI4LjU5OTYwOTA1IDU2My4yOTQxMTY4NCA4MzAuNTg4MTM5MzggNTY1LjY4MTk3NjMyIDgzMi42MjU2MzU1OSA1NjguMDI3MjgxNDEgQyA4MzQuNjYzMTMxNzkgNTcwLjM3MjU4NjUwIDgzNi43NDk1OTM4OCA1NzIuNjc1MzM3MTkgODM4Ljg5MjE5MTQ4IDU3NC45MjUwNzc1MSBDIDg0MS4wMzQ3ODkwOSA1NzcuMTc0ODE3ODMgODQzLjIzMzUyMjIwIDU3OS4zNzE1NDc3OCA4NDUuNDkzNjE1MTggNTgxLjUwMzIyMTM0IEEgMTYxLjg5NjUwMDAwIDE2MS44OTY1MDAwMCAwIDAgMCAxMDY0LjkwNjcwMzIxIDU4NC4wNDA1NDYyNCBDIDEwNjYuMjY5MTM1MzkgNTgyLjgxMzgwNjc5IDEwNjcuNjEwNzI5OTggNTgxLjU2MzkyNDg2IDEwNjguOTE2MzYwODggNTgwLjMxMjM3MDcxIEMgMTA3MC4yMjE5OTE3OSA1NzkuMDYwODE2NTcgMTA3MS40OTE2NTkwMSA1NzcuODA3NTkwMjEgMTA3Mi42ODc1ODcwOSA1NzYuNTQzMDAxNDAgQyAxMDczLjg4MzUxNTE3IDU3NS4yNzg0MTI1OSAxMDc1LjAwNTcwNDExIDU3NC4wMDI0NjEzMSAxMDc2LjAxNjczNzk1IDU3Mi42OTk0MDc4NyBDIDEwNzcuMDI3NzcxNzggNTcxLjM5NjM1NDQyIDEwNzcuOTI3NjUwNTEgNTcwLjA2NjE5ODgwIDEwNzguNjgzMTQwNzAgNTY4LjY4NjA1MTMyIEMgMTA3OS40Mzg2MzA4OCA1NjcuMzA1OTAzODQgMTA4MC4wNDk3MzI1MiA1NjUuODc1NzY0NTAgMTA4MC40OTYyNTc0NyA1NjQuMzc2NzE5ODcgQyAxMDgwLjk0Mjc4MjQxIDU2Mi44Nzc2NzUyNCAxMDgxLjIyNDczMDY3IDU2MS4zMDk3MjUzMiAxMDgxLjM1NjU2NTY0IDU1OS42NzI5NDM0NSBDIDEwODEuNDg4NDAwNjAgNTU4LjAzNjE2MTU4IDEwODEuNDcwMTIyMjcgNTU2LjMzMDU0Nzc2IDEwODEuMzM4ODI4MTQgNTU0LjU2OTIzMzMzIEMgMTA4MS4yMDc1MzQwMSA1NTIuODA3OTE4OTEgMTA4MC45NjMyMjQwOCA1NTAuOTkwOTAzODggMTA4MC43MDgwNzM0MCA1NDkuMTc1NDEyNDIgWiBNIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDQwOS4xMDAwMDAwMCA2MzIuOTgwMDAwMDAgQSAxMjIuMDUwMDAwMDAgMTIyLjA1MDAwMDAwIDAgMSAxIDY1My4yMDAwMDAwMCA2MzIuOTgwMDAwMDAgWiBNIDQ5My4wMDkyODc3MiA1MTcuMDQyNTY2MTYgQyA0OTYuMTQ0MjkwNTkgNTE2LjAxMTIyMzMxIDQ5OS4zMjExMjU0NiA1MTUuMTA3MDM4NDAgNTAyLjUxNTIzODg2IDUxNC4yNjY4MTI2OCBDIDUwNS43MDkzNTIyNiA1MTMuNDI2NTg2OTYgNTA4LjkyMDc0NDE5IDUxMi42NTAzMjA0MyA1MTIuMTQyOTYzMTYgNTExLjkyOTgxMDUwIEMgNTE1LjM2NTE4MjEzIDUxMS4yMDkzMDA1OCA1MTguNTk4MjI4MTQgNTEwLjU0NDU0NzI3IDUyMS44Mzk5NzIxMCA1MDkuOTQwNDQ4MzcgQyA1MjUuMDgxNzE2MDYgNTA5LjMzNjM0OTQ4IDUyOC4zMzIxNTc5NSA1MDguNzkyOTA1MDEgNTMxLjU5MzAxODQ5IDUwOC4zMjY2MTgzOSBDIDUzNC44NTM4NzkwMiA1MDcuODYwMzMxNzggNTM4LjEyNTE1ODIwIDUwNy40NzEyMDMwMiA1NDEuNDA4MjM0MzggNTA3LjE3NDYzMzM2IEMgNTQ0LjY5MTMxMDU1IDUwNi44NzgwNjM3MCA1NDcuOTg2MTgzNzIgNTA2LjY3NDA1MzEzIDU1MS4yODQwMTg1MiA1MDYuNTQ2Nzg2NjYgQSAyMTIuNzI5MjQ1MDYgMjEyLjcyOTI0NTA2IDAgMCAxIDYxNC41NDU3MDkwMCA5MjQuNTk4NDc1NzkgQyA2MTAuNjM0NDkwMjkgOTI1LjY0NjQ4MzY5IDYwNi42OTMzNDkxNCA5MjYuNTgyODE5NTMgNjAyLjcxMTA5ODg3IDkyNy40MjM0OTQzMCBDIDU5OC43Mjg4NDg2MSA5MjguMjY0MTY5MDYgNTk0LjcwNTQ4OTIzIDkyOS4wMDkxODI3NCA1OTAuNjM1OTM2NTIgOTI5LjY2OTY0NDgyIEMgNTg2LjU2NjM4MzgyIDkzMC4zMzAxMDY5MSA1ODIuNDUwNjM3NzcgOTMwLjkwNjAxNzM5IDU3OC4yODYzNDU3NSA5MzEuNDA2MzA2NTYgQyA1NzQuMTIyMDUzNzMgOTMxLjkwNjU5NTczIDU2OS45MDkyMTU3MyA5MzIuMzMxMjYzNTkgNTY1LjY0OTg0MzAxIDkzMi42ODU3NTEwMCBDIDU2MS4zOTA0NzAyOSA5MzMuMDQwMjM4NDEgNTU3LjA4NDU2Mjg0IDkzMy4zMjQ1NDUzNiA1NTIuNzM2NzA3NDUgOTMzLjU0MjA0NTg4IEMgNTQ4LjM4ODg1MjA3IDkzMy43NTk1NDY0MSA1NDMuOTk5MDQ4NzUgOTMzLjkxMDI0MDUyIDUzOS41NzQ2OTM3MSA5MzMuOTk1MjEyMzUgQyA1MzUuMTUwMzM4NjcgOTM0LjA4MDE4NDE5IDUzMC42OTE0MzE5MCA5MzQuMDk5NDMzNzUgNTI2LjIwNzMxNDQ0IDkzNC4wNTIzOTk0MiBDIDUyMS43MjMxOTY5OCA5MzQuMDA1MzY1MDkgNTE3LjIxMzg2ODgyIDkzMy44OTIwNDY4NSA1MTIuNjkwMzQ5MTMgOTMzLjcxMDM5MDcyIEMgNTA4LjE2NjgyOTQ1IDkzMy41Mjg3MzQ1OCA1MDMuNjI5MTE4MjQgOTMzLjI3ODc0MDUzIDQ5OS4wODkzMzMwMSA5MzIuOTU3MjY1NDMgQyA0OTQuNTQ5NTQ3NzggOTMyLjYzNTc5MDM0IDQ5MC4wMDc2ODg1NCA5MzIuMjQyODM0MjAgNDg1LjQ3NjU2MzUzIDkzMS43NzQ0MzU2MCBDIDQ4MC45NDU0Mzg1MiA5MzEuMzA2MDM3MDEgNDc2LjQyNTA0Nzc1IDkzMC43NjIxOTU5NiA0NzEuOTI4Mzk2NTQgOTMwLjEzODQ4NjE2IEMgNDY3LjQzMTc0NTM0IDkyOS41MTQ3NzYzNyA0NjIuOTU4ODMzNzAgOTI4LjgxMTE5NzgyIDQ1OC41MjI0MTU1MiA5MjguMDIzMTk1MjQgQyA0NTQuMDg1OTk3MzMgOTI3LjIzNTE5MjY3IDQ0OS42ODYwNzI1OSA5MjYuMzYyNzY2MDYgNDQ1LjMzNDY3OTA0IDkyNS40MDE2MDIxMyBDIDQ0MC45ODMyODU0OSA5MjQuNDQwNDM4MTkgNDM2LjY4MDQyMzEyIDkyMy4zOTA1MzY5MiA0MzIuNDM2OTQ0NjkgOTIyLjI0ODIyNDA0IEMgNDI4LjE5MzQ2NjI2IDkyMS4xMDU5MTExNyA0MjQuMDA5MzcxNzggOTE5Ljg3MTE4NjY5IDQxOS44OTM4ODQ5MSA5MTguNTQxNDEzMjAgQyA0MTUuNzc4Mzk4MDQgOTE3LjIxMTYzOTcxIDQxMS43MzE1MTg3OSA5MTUuNzg2ODE3MTkgNDA3Ljc2MDMzODIxIDkxNC4yNjU4MDcxOSBDIDQwMy43ODkxNTc2MiA5MTIuNzQ0Nzk3MTkgMzk5Ljg5MzY3NTcwIDkxMS4xMjc1OTk3MCAzOTYuMDc4NDU5MzggOTA5LjQxNDk1NjQ2IEMgMzkyLjI2MzI0MzA1IDkwNy43MDIzMTMyMiAzODguNTI4MjkyMzMgOTA1Ljg5NDIyNDIzIDM4NC44NzUwNDE3MCA5MDMuOTkzODY5NjQgQyAzODEuMjIxNzkxMDYgOTAyLjA5MzUxNTA2IDM3Ny42NTAyNDA1MSA5MDAuMTAwODk0ODggMzc0LjE1ODQ4NTg1IDg5OC4wMjE4NTQ0MCBDIDM3MC42NjY3MzEyMCA4OTUuOTQyODEzOTMgMzY3LjI1NDc3MjQ0IDg5My43NzczNTMxNiAzNjMuOTE2NDA1NjIgODkxLjUzNDgwNDY0IEMgMzYwLjU3ODAzODgwIDg4OS4yOTIyNTYxMyAzNTcuMzEzMjYzOTIgODg2Ljk3MjYxOTg3IDM1NC4xMTIwMTc1MyA4ODQuNTg4Mzg1NzQgQyAzNTAuOTEwNzcxMTMgODgyLjIwNDE1MTYxIDM0Ny43NzMwNTMyMyA4NzkuNzU1MzE5NjEgMzQ0LjY4MjgxNzc3IDg3Ny4yNTkyNTU4MyBDIDM0MS41OTI1ODIzMSA4NzQuNzYzMTkyMDYgMzM4LjU0OTgyOTI5IDg3Mi4yMTk4OTY1MSAzMzUuNTM0NzU2NzMgODY5LjY0OTc5ODU4IEMgMzMyLjUxOTY4NDE4IDg2Ny4wNzk3MDA2NSAzMjkuNTMyMjkyMDkgODY0LjQ4MjgwMDMyIDMyNi41NDQ5MDAwMCA4NjEuODg1OTAwMDAgQyAzMjkuNTMyMjkyMDkgODY0LjQ4MjgwMDMyIDMzMi41MTk2ODQxOCA4NjcuMDc5NzAwNjUgMzM1LjUzNDczMTQ5IDg2OS42NDc4ODU4OCBDIDMzOC41NDk3Nzg4MSA4NzIuMjE2MDcxMTIgMzQxLjU5MjQ4MTM2IDg3NC43NTU1NDEyNyAzNDQuNjgyNTkwNzEgODc3LjI0NDU2MDM4IEMgMzQ3Ljc3MjcwMDA3IDg3OS43MzM1Nzk0OSAzNTAuOTEwMjE2MjMgODgyLjE3MjE0NzU2IDM1NC4xMTExMjIzMCA4ODQuNTQxNzg4OTYgQyAzNTcuMzEyMDI4MzYgODg2LjkxMTQzMDM2IDM2MC41NzYzMjQzNCA4ODkuMjEyMTQ1MDkgMzYzLjkxMzk4ODU1IDg5MS40MzA2NTgzNyBDIDM2Ny4yNTE2NTI3NSA4OTMuNjQ5MTcxNjUgMzcwLjY2MjY4NTE4IDg5NS43ODU0ODM0NyAzNzQuMTUzMTg2MTEgODk3LjgyOTYwNzc2IEMgMzc3LjY0MzY4NzA1IDg5OS44NzM3MzIwNiAzODEuMjEzNjU2NDcgOTAxLjgyNTY2ODg0IDM4NC44NjQ4NzE2MSA5MDMuNjc5MTExOTUgQyAzODguNTE2MDg2NzUgOTA1LjUzMjU1NTA2IDM5Mi4yNDg1NDc2MCA5MDcuMjg3NTA0NTEgMzk2LjA2MDY3MDM3IDkwOC45NDA0OTcxNCBDIDM5OS44NzI3OTMxMyA5MTAuNTkzNDg5NzcgNDAzLjc2NDU3NzgxIDkxMi4xNDQ1MjU1NyA0MDcuNzMxMjg2MzIgOTEzLjU5MjgzMTkzIEMgNDExLjY5Nzk5NDgzIDkxNS4wNDExMzgyOCA0MTUuNzM5NjI3MTcgOTE2LjM4NjcxNTE4IDQxOS44NDg5MDQwMSA5MTcuNjMwOTc0NDggQyA0MjMuOTU4MTgwODYgOTE4Ljg3NTIzMzc4IDQyOC4xMzUxMDIxOSA5MjAuMDE4MTc1NTAgNDMyLjM3MDI0NjA3IDkyMS4wNjMwNzgzMSBDIDQzNi42MDUzODk5NiA5MjIuMTA3OTgxMTIgNDQwLjg5ODc1NjQwIDkyMy4wNTQ4NDUwMyA0NDUuMjM5Mjk1MjUgOTIzLjkwODM4NTk1IEMgNDQ5LjU3OTgzNDExIDkyNC43NjE5MjY4NyA0NTMuOTY3NTQ1MzkgOTI1LjUyMjE0NDc5IDQ1OC4zOTAyMDgzMSA5MjYuMTk0Nzk2OTQgQyA0NjIuODEyODcxMjMgOTI2Ljg2NzQ0OTA5IDQ2Ny4yNzA0ODU4MCA5MjcuNDUyNTM1NDcgNDcxLjc1MDE0NTE0IDkyNy45NTY0MTUyMyBDIDQ3Ni4yMjk4MDQ0OCA5MjguNDYwMjk0OTggNDgwLjczMTUwODU4IDkyOC44ODI5NjgxMSA0ODUuMjQyMTQ1MTYgOTI5LjIzMDkzNDk0IEMgNDg5Ljc1Mjc4MTczIDkyOS41Nzg5MDE3NyA0OTQuMjcyMzUwNzggOTI5Ljg1MjE2MjI5IDQ5OC43ODc5OTg5MCA5MzAuMDU2ODkzNTAgQyA1MDMuMzAzNjQ3MDMgOTMwLjI2MTYyNDcyIDUwNy44MTUzNzQyMyA5MzAuMzk3ODI2NjEgNTEyLjMxMTA5MTM5IDkzMC40NzA4MjU5MCBDIDUxNi44MDY4MDg1NSA5MzAuNTQzODI1MTkgNTIxLjI4NjUxNTY2IDkzMC41NTM2MjE4NyA1MjUuNzM5MzA0NzIgOTMwLjUwNDI0MzY0IEMgNTMwLjE5MjA5Mzc5IDkzMC40NTQ4NjU0MSA1MzQuNjE3OTY0ODAgOTMwLjM0NjMxMjI4IDUzOS4wMDc3Njg5MSA5MzAuMTgwNjkwMTkgQyA1NDMuMzk3NTczMDIgOTMwLjAxNTA2ODEwIDU0Ny43NTEzMTAyMiA5MjkuNzkyMzc3MDUgNTUyLjA2MTg1NTQzIDkyOS41MTI1MDQyNSBDIDU1Ni4zNzI0MDA2NSA5MjkuMjMyNjMxNDQgNTYwLjYzOTc1Mzg5IDkyOC44OTU1NzY4OCA1NjQuODU5NjUxNzYgOTI4LjQ5ODEyNjgwIEMgNTY5LjA3OTU0OTYzIDkyOC4xMDA2NzY3MyA1NzMuMjUxOTkyMTMgOTI3LjY0MjgzMTE1IDU3Ny4zNzUzMzU1MiA5MjcuMTE4NTI3MTAgQyA1ODEuNDk4Njc4OTAgOTI2LjU5NDIyMzA2IDU4NS41NzI5MjMxNyA5MjYuMDAzNDYwNTQgNTg5LjYwMDc2MzQ1IDkyNS4zMzU1NjU2NyBDIDU5My42Mjg2MDM3MyA5MjQuNjY3NjcwODAgNTk3LjYxMDA0MDAyIDkyMy45MjI2NDM1NiA2MDEuNTUwNDg2MzcgOTIzLjA4NjkxMzc1IEMgNjA1LjQ5MDkzMjcxIDkyMi4yNTExODM5NCA2MDkuMzkwMzg5MTAgOTIxLjMyNDc1MTU1IDYxMy4yNjAyMzk1NCA5MjAuMjg3ODI4MjUgQSAyMTAuNDc5MjQ1MDYgMjEwLjQ3OTI0NTA2IDAgMCAwIDU1MC42Njc2NTY4OSA1MDYuNjU3Nzk4NjggQyA1NDcuNDA0NzAyNzEgNTA2Ljc4MzcxOTA4IDU0NC4xNDQ2Nzg4NCA1MDYuOTg1NTcxODYgNTQwLjg5NjE5NzkwIDUwNy4yNzg2MTE3OCBDIDUzNy42NDc3MTY5NyA1MDcuNTcxNjUxNjkgNTM0LjQxMDc3ODk4IDUwNy45NTU4Nzg3MyA1MzEuMTg0MTQxMTggNTA4LjQxNjQyMjQ4IEMgNTI3Ljk1NzUwMzM4IDUwOC44NzY5NjYyMiA1MjQuNzQxMTY1NzggNTA5LjQxMzgyNjY3IDUyMS41MzM1NTQ5MSA1MTAuMDExMDY3MTcgQyA1MTguMzI1OTQ0MDQgNTEwLjYwODMwNzY4IDUxNS4xMjcwNTk5MSA1MTEuMjY1OTI4MjQgNTExLjkzOTA0MjY3IDUxMS45NzkxODQ5MyBDIDUwOC43NTEwMjU0NCA1MTIuNjkyNDQxNjEgNTA1LjU3Mzg3NTEwIDUxMy40NjEzMzQ0MiA1MDIuNDEzOTAxODAgNTE0LjI5Mzc1NjkzIEMgNDk5LjI1MzkyODQ5IDUxNS4xMjYxNzk0NCA0OTYuMTExMTMyMjIgNTE2LjAyMjEzMTY0IDQ5My4wMDkyODc3MiA1MTcuMDQyNTY2MTYgWiIgZmlsbD0iIzE2MzYzQiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXBhdGg9InVybCgjZWxhbnVtLWxpbWl0KSIvPjwvc3ZnPg==' };
let signatureMode = 'master';
function updateSignature() {
  const blueprint = signatureMode === 'blueprint';
  const original = $('#showOriginal').checked && !blueprint;
  const base = signatureMode === 'master' ? 'ELANUM-Master-Spektrum' : 'ELANUM-System-Ink';
  const mode = { master: 'Spektrum', ink: 'Ink', inverse: 'Invers', relief: 'Papierrelief', blueprint: 'Blueprint' }[signatureMode];
  const variant = original ? 'Unverändertes Original' : 'Sechs Grundkreise';
  $('#signatureImage').src = blueprint ? 'assets/ELANUM-Konstruktion-Geometrisch.svg' : `assets/${base}${original ? '' : '-Geometrisch'}.svg`;
  $('#signatureImage').alt = blueprint ? 'Blueprint des ELANUM-Zeichens mit sechs Grundkreisen und fünf Brücken' : 'ELANUM-Zeichen in ' + mode + ', ' + variant;
  $('#signatureStage').dataset.mode = signatureMode;
  $('#signatureImage').hidden = signatureMode === 'relief';
  $('#signatureRelief').hidden = signatureMode !== 'relief';
  const mask = 'url("' + MASKS[original ? 'original' : 'Geometrisch'] + '")';
  $('#signatureRelief span').style.webkitMaskImage = mask;
  $('#signatureRelief span').style.maskImage = mask;
  $('#showOriginal').disabled = blueprint;
  $('#signatureLabel').textContent = mode + ' · ' + variant;
  $$('[data-signature-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.signatureMode === signatureMode)));
}
$$('[data-signature-mode]').forEach(button => button.addEventListener('click', () => { signatureMode = button.dataset.signatureMode; updateSignature(); }));
$('#showOriginal').addEventListener('change', updateSignature);
updateSignature();

/* ---------- 04 Resonanzrad ---------- */
const rad = window.ElanumResonanzrad;
rad.mount($('[data-resonanzrad]'), { heading: 'h3' });

/* ---------- 05 Farbe: Werte kommen live aus tokens.css ---------- */
function swatch(name, token, dark) {
  const hex = css(token), button = document.createElement('button');
  button.className = 'swatch glow-edge'; button.style.setProperty('--swatch', hex);
  if (dark) button.dataset.dark = '';
  button.setAttribute('aria-label', `${name} ${hex} kopieren`);
  button.innerHTML = `<strong>${name}</strong><span>${hex}</span>`;
  button.addEventListener('click', () => copyText(hex, hex + ' kopiert'));
  return button;
}
[['Canvas', '--canvas'], ['Papier', '--paper'], ['Ink', '--ink', true], ['Text sekundär', '--ink-2', true]].forEach(([name, token, dark]) => $('#neutralPalette').append(swatch(name, token, dark)));

const STEPS = [['Tief · Schrift', 'tief'], ['Element 1', 1], ['Element 2', 2], ['Element 3', 3], ['Hauch · Ring und offen', 'hauch']];
rad.groups.forEach(group => {
  const card = document.createElement('article');
  card.className = 'area-card area'; card.dataset.area = group.id;
  const ramp = STEPS.map(([step, n]) => {
    const hex = css(`--${group.id}-${n}`);
    return `<button type="button" class="glow-edge" style="--swatch:${hex}" data-copy="${hex}" aria-label="${group.label} ${step} ${hex} kopieren"><span class="ramp__bar"></span><span>${step}</span><span>${hex}</span></button>`;
  }).join('');
  const fields = rad.items.filter(item => item.group === group.id).map(item => `<li>${rad.iconSvg(item.id)}${item.label}</li>`).join('');
  card.innerHTML = `<h4 class="area-card__name">${group.label}</h4><div class="ramp" data-anim="ramp">${ramp}</div><ul class="area-card__fields">${fields}</ul>`;
  $('#areaPalette').append(card);
});
$('#areaPalette').addEventListener('click', event => { const b = event.target.closest('[data-copy]'); if (b) copyText(b.dataset.copy, b.dataset.copy + ' kopiert'); });

const SPECTRUM = [['Violet', '#6756D9'], ['Blue', '#4D7FE8'], ['Orchid', '#9466DF'], ['Rose', '#D85BA9'], ['Pink', '#F0719A']];
$('#spectrumPalette').innerHTML = '<div class="spectrum__bar" role="img" aria-label="Markenspektrum von Violett bis Pink"></div><div class="spectrum__values">' +
  SPECTRUM.map(([name, hex]) => `<button type="button" class="glow-edge" data-copy="${hex}" aria-label="${name} ${hex} kopieren">${name} ${hex}</button>`).join('') + '</div>';
$('#spectrumPalette').addEventListener('click', event => { const b = event.target.closest('[data-copy]'); if (b) copyText(b.dataset.copy, b.dataset.copy + ' kopiert'); });

/* Verläufe: Farbstopps als kommaseparierte Liste, live aus tokens.css */
const GRADIENTS = [
  ['Markenspektrum', 'Zeichen und Verbindung', css('--spectrum-stops')],
  ['Verbindung', 'Linie zwischen zwei Menschen', css('--bridge-stops')],
  ['Glührand', 'Rand bei Hover, Fokus und Auswahl, wandert im Kreis', css('--edge-stops'), true],
  ...rad.groups.map(group => [group.label, 'Tief bis Hauch', ['tief', 1, 2, 3, 'hauch'].map(n => css(`--${group.id}-${n}`)).join(', ')])
];
GRADIENTS.forEach(([name, use, stops, edge]) => {
  const row = document.createElement('div');
  row.className = 'gradient';
  row.innerHTML = `<span class="gradient__bar${edge ? ' gradient__bar--edge' : ''}" style="--stops:${stops}" aria-hidden="true"></span>` +
    `<span><span class="gradient__name">${name}</span> <span class="secondary t-label">· ${use}</span><code class="gradient__stops">${stops}</code></span>` +
    `<button type="button" class="gradient__copy glow-edge" aria-label="${name} als Liste kopieren">Kopieren</button>`;
  row.querySelector('button').addEventListener('click', () => copyText(stops, name + ' kopiert'));
  $('#gradientList').append(row);
});

const STATUS = {
  info: { name: 'Info', sign: 'i', token: '--info', text: 'Deine Angaben kannst du später ergänzen.', role: 'Sachliche Orientierung.' },
  hint: { name: 'Hinweis', sign: '!', token: '--hint', text: 'Hier fehlen noch Angaben. Du kannst trotzdem weitergehen.', role: 'Aufmerksamkeit, kein Alarm.' },
  error: { name: 'Fehler', sign: '×', token: '--error', text: 'Das hat nicht geklappt. Bitte versuche es erneut.', role: 'Ein konkreter nächster Schritt.' },
  success: { name: 'Erfolg', sign: '✓', token: '--success', text: 'Gespeichert. Du findest es unter Heute.', role: 'Bestätigt, was gerade geklappt hat.' }
};
const statusInner = (key, text) => `<span class="status__sign" aria-hidden="true">${STATUS[key].sign}</span><div><strong class="status__title">${STATUS[key].name}</strong><p class="status__text">${text}</p></div>`;
Object.entries(STATUS).forEach(([key, item]) => {
  const hex = css(item.token), button = document.createElement('button');
  button.type = 'button'; button.className = 'status glow-edge'; button.dataset.role = key;
  button.setAttribute('aria-label', `${item.name} ${hex} kopieren`);
  button.innerHTML = statusInner(key, item.role).replace('</p></div>', `<span class="status__hex">${hex}</span></p></div>`);
  button.addEventListener('click', () => copyText(hex, hex + ' kopiert'));
  $('#statusPalette').append(button);
});

/* ---------- 08 Bedienung: alles bleibt in diesem Dokument ---------- */
$('#demoContinue').addEventListener('click', () => notify('Primäraktion ausgelöst · lokale Vorschau'));
$('#demoLater').addEventListener('click', () => notify('Sekundäraktion ausgelöst · lokale Vorschau'));
$('#choiceButton').addEventListener('click', event => { const b = event.currentTarget; b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); });
$('#demoForm').addEventListener('submit', event => {
  event.preventDefault();
  const value = $('#demoInput').value.trim();
  $('#demoResult').textContent = value ? 'Deine Vorschau: «' + value + '»' : 'Schreibe zuerst einen Gedanken.';
  $('#demoInput').setAttribute('aria-invalid', String(!value));
});
$$('[data-status-pick]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.statusPick, demo = $('#statusDemo');
  demo.dataset.role = key; demo.innerHTML = statusInner(key, STATUS[key].text);
  $$('[data-status-pick]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.dispatchEvent(new CustomEvent('elanum:status', { detail: { element: demo } }));
}));

/* ---------- 09 Produkt ---------- */
window.ElanumUmfeld.mount($('[data-umfeld]'), { link: 'components/beziehungsraum/', heading: 'h3' });
const tabs = $$('.product-tab');
function selectProduct(tab) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    $('#' + item.getAttribute('aria-controls')).hidden = !active;
  });
  document.dispatchEvent(new CustomEvent('elanum:layout', { detail: { panel: $('#' + tab.getAttribute('aria-controls')) } }));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProduct(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); tabs[next].focus(); selectProduct(tabs[next]);
  });
});

/* ---------- 10 Elemente: Icon-Set ---------- */
rad.items.forEach(item => {
  const li = document.createElement('li');
  li.className = 'area'; li.dataset.area = item.group;
  li.innerHTML = rad.iconSvg(item.id) + item.label;
  $('#iconSet').append(li);
});

/* ---------- 13 Prüfung ---------- */
const RULES = [
  ['Das Zeichen bleibt', 'Grundform, Linien und Proportionen bleiben. Das Zeichen bewegt sich nie.'],
  ['Kreise bleiben rund', 'Auch in Bewegung und auf kleinen Bildschirmen.'],
  ['Fünf Schriftstufen', 'Yrsa nur gross, kein Kursiv, nichts unter 15 px.'],
  ['Farbe hat eine Rolle', 'Neutral, Bereich oder Status. Die Rollen mischen sich nicht.'],
  ['Text auf Farbe ist lesbar', 'Weisse Schrift nur auf Tief, Ink auf dem Hauch. Elemente tragen nur Icons.'],
  ['Raum statt Rahmen', 'Abstand gliedert, Linien trennen nur Kapitel.'],
  ['Bewegung erklärt', 'Jede Animation zeigt eine Beziehung, eine Reihenfolge oder einen Zustand. Pause und reduzierte Bewegung wirken.'],
  ['Bedienbar für alle', 'Tastatur, sichtbarer Fokus, 44-px-Ziele, lesbare mobile Beschriftung.'],
  ['Begriffe aus dem Glossar', 'Alles heisst so wie im Glossar. Keine alten Arbeitsnamen.']
];
RULES.forEach(([title, text]) => {
  const label = document.createElement('label');
  label.className = 'glow-edge';
  label.innerHTML = `<input type="checkbox"><span><strong>${title}</strong><span>${text}</span></span>`;
  $('#checklist').append(label);
});
$$('#checklist input').forEach(input => input.addEventListener('change', () => {
  const count = $$('#checklist input:checked').length;
  $('#scoreNumber').textContent = count;
  $('#scoreMessage').textContent = count === RULES.length ? 'Alle ' + RULES.length + ' Regeln bestätigt. Die visuelle Freigabe erfolgt separat.' : count + ' von ' + RULES.length + ' Regeln bestätigt. Eine Checkliste ersetzt kein visuelles Review.';
}));

/* ---------- 14 Glossar: verbindliche Begriffe aus assets/glossar.js ---------- */
const G = window.ELANUM_GLOSSAR;
$('#glossarRule').textContent = G.rule;
$('#glossarSentence').textContent = '«' + G.sentence + '»';
G.groups.forEach(group => {
  const section = document.createElement('section');
  section.className = 'glossary__group';
  section.innerHTML = `<h3 class="block-title">${group.title}</h3>${group.intro ? `<p class="secondary">${group.intro}</p>` : ''}<dl></dl>`;
  group.terms.forEach(t => {
    const row = document.createElement('div');
    row.className = 'glossary__row';
    row.dataset.search = (t.term + ' ' + t.meaning + ' ' + (t.code || '')).toLowerCase();
    row.innerHTML = `<dt>${t.term}</dt><dd><span>${t.meaning}</span>${t.code ? `<code>${t.code}</code>` : ''}</dd>`;
    section.querySelector('dl').append(row);
  });
  $('#glossar-list').append(section);
});
G.avoid.forEach(([old, now]) => {
  const row = document.createElement('div');
  row.innerHTML = `<dt><s>${old}</s></dt><dd>${now}</dd>`;
  $('#glossarAvoid').append(row);
});
const glossarRows = $$('.glossary__row');
function filterGlossar() {
  const q = $('#glossarSearch').value.trim().toLowerCase();
  let shown = 0;
  glossarRows.forEach(row => { const on = !q || row.dataset.search.includes(q); row.hidden = !on; if (on) shown++; });
  $$('.glossary__group').forEach(group => { group.hidden = !group.querySelector('.glossary__row:not([hidden])'); });
  $('#glossarCount').textContent = q ? (shown === 1 ? '1 Begriff' : shown + ' Begriffe') : glossarRows.length + ' Begriffe';
}
$('#glossarSearch').addEventListener('input', filterGlossar);
filterGlossar();

/* ---------- 15 Tokens: der Block liest die Werte aus tokens.css ---------- */
const TOKEN_GROUPS = [
  ['Fläche und Schrift', ['--canvas', '--paper', '--ink', '--ink-2', '--line']],
  ['Bereiche: tief · Element 1–3 · Hauch', ['--grund-tief', '--grund-1', '--grund-2', '--grund-3', '--grund-hauch', '--ich-tief', '--ich-1', '--ich-2', '--ich-3', '--ich-hauch', '--bezug-tief', '--bezug-1', '--bezug-2', '--bezug-3', '--bezug-hauch']],
  ['Status', ['--info', '--info-bg', '--hint', '--hint-bg', '--error', '--error-bg', '--success', '--success-bg']],
  ['Typografie', ['--type-display', '--type-title', '--type-heading', '--type-body', '--type-label']],
  ['Raum und Form', ['--gutter', '--section', '--content', '--radius-control', '--radius-button', '--radius-surface', '--raised', '--pressed']],
  ['Linien und Bewegung', ['--trace', '--bridge', '--ease', '--motion-ui', '--motion-reveal', '--motion-breath']]
];
$('#tokenCode').textContent = ':root {\n' + TOKEN_GROUPS.map(([title, names]) =>
  `  /* ${title} */\n` + names.map(name => `  ${name}: ${css(name)};`).join('\n')).join('\n\n') + '\n}';
$('#copyTokens').addEventListener('click', () => copyText($('#tokenCode').textContent, 'Tokens kopiert'));

syncMotion();
