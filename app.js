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

/* ---------- 02 Zeichen: dieselben geprüften Dateien, nie eine erzeugte Form ---------- */
const MASKS = { original: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiPjxkZWZzPjxjbGlwUGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpLXN5c3RlbS1saW1pdCI+PHBhdGggZD0iTSAxMDgyLjcwNTggNTY1LjUwMDAgQSA0NjAuNTQgNDYwLjU0IDAgMSAwIDEwODUuMTcxNSA2MTcuNDAwMCBDIDk4MC41MDAwIDY3NC45MDAwIDg4Ny45MDAwIDY1Mi44MDAwIDgwOS4wMDAwIDU0MC4wMDAwIEMgOTQwLjIxMTIgNzA2LjI1OTggMTA2OC4wMDU3IDU4Ni4yMzM3IDEwODIuNzA1OCA1NjUuNTAwMCBaIE0gNjUzLjE5OTk5OTk5OTk5OTkgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA0MDkuMDk5OTk5OTk5OTk5OTcgNjMyLjk4IEEgMTIyLjA1IDEyMi4wNSAwIDEgMSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJNIDEwODIuNzA1OCA1NjUuNTAwMCBBIDQ2MC41NCA0NjAuNTQgMCAxIDAgMTA4NS4xNzE1IDYxNy40MDAwIEMgOTgwLjUwMDAgNjc0LjkwMDAgODg3LjkwMDAgNjUyLjgwMDAgODA5LjAwMDAgNTQwLjAwMDAgQyA5NDAuMjExMiA3MDYuMjU5OCAxMDY4LjAwNTcgNTg2LjIzMzcgMTA4Mi43MDU4IDU2NS41MDAwIFogTSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDQwOS4wOTk5OTk5OTk5OTk5NyA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBaIE0gNjUzLjIwMDAgNjMzLjAwMDAgQyA2NDguODExNSA3MTYuNzU4OCA1ODQuMzY4MyA3ODIuMDY5NSA0OTkuNzAwMCA3ODEuNjU4MSBDIDQxMy4wMTA0IDc4MS4xNjI2IDM0Ny42MTgxIDcxMy4wMjkwIDM0NC43NDYzIDYyOS45MDg4IEMgMzQxLjc2NDAgNTEzLjM5NTUgNDQ5LjU1NTkgNDA4LjE0NjUgNTgwLjIwMDAgNDA3LjU0MTkgQyA2NzQuMjY3NiA0MDcuMDgxMiA3NTUuNzcyOSA0NTIuNjYyMCA4MDkuMDAwMCA1NDAuMDAwMCBDIDc1OC41Mzg3IDQ1MC45MjUwIDY3NS42Njk0IDQwMy4zMTg4IDU4MC4yMDAwIDQwMi44NTgxIEMgNDQ3LjAxNTUgNDAyLjI1MzUgMzM1LjUzMTMgNTA5LjU3MDEgMzM4Ljg1MzcgNjMwLjA5MTIgQyAzNDEuOTYyNCA3MTYuMzI5NCA0MTAuNjUwOCA3ODYuNDM3NCA0OTkuNzAwMCA3ODUuOTQxOSBDIDU4Ni41ODI0IDc4NS41MzA1IDY1MS44MTgwIDcxNy4wNTAyIDY1My4yMDAwIDYzMy4wMDAwIFogTSA0OTMuMDAwMCA1MTcuMDAwMCBDIDYxNi42OTY5IDQ2NS44MzY4IDc0Mi4yMzkxIDUyMC4wMjE3IDc3Ni41MzQyIDY1Ny4zMTQwIEMgODA5LjkxMDggODI0LjIzMzkgNjU5Ljk0MjcgOTY2LjI5NTEgNDg0Ljk3NjUgOTM3LjQ2MjYgQyA0MTAuNTkxMyA5MTMuOTcwNCAzNjAuMTU0NCA5MDguOTM0NSAzMjYuNTQ0OSA4NjEuODg1OSBDIDM1OC41NjI4IDkxMC40MDk5IDQxMC40MTA2IDkxNi40NTM5IDQ4NC4yMjM1IDk0MC41Mzc0IEMgNjYxLjIxNDEgOTcyLjAzMTEgODE2LjE4NTAgODI2Ljk1MTEgNzgxLjA2NTggNjU2LjI4NjAgQyA3NDUuNzYwOSA1MTYuMzc4MyA2MTUuMzAzMSA0NjIuMTYzMiA0OTMuMDAwMCA1MTcuMDAwMCBaIiBmaWxsPSIjMTYzNjNCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcGF0aD0idXJsKCNpLXN5c3RlbS1saW1pdCkiLz48L3N2Zz4=', curves: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTYwIiBoZWlnaHQ9Ijk2MCIgdmlld0JveD0iMTQ0IDEzMiA5NjAgOTYwIj4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpLXN5c3RlbS1saW1pdCI+CiAgICAgIDxwYXRoIGQ9Ik0gMTA4Mi43MDU4IDU2NS41MDAwIEEgNDYwLjU0IDQ2MC41NCAwIDEgMCAxMDg1LjE3MTUgNjE3LjQwMDAgQyA5ODAuNTAwMCA2NzQuOTAwMCA4ODcuOTAwMCA2NTIuODAwMCA4MDkuMDAwMCA1NDAuMDAwMCBDIDk0MC4yMTEyIDcwNi4yNTk4IDEwNjguMDA1NyA1ODYuMjMzNyAxMDgyLjcwNTggNTY1LjUwMDAgWiBNIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBBIDEyMi4wNSAxMjIuMDUgMCAxIDEgNDA5LjA5OTk5OTk5OTk5OTk3IDYzMi45OCBBIDEyMi4wNSAxMjIuMDUgMCAxIDEgNjUzLjE5OTk5OTk5OTk5OTkgNjMyLjk4IFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJNIDEwODIuNzA1OCA1NjUuNTAwMCBBIDQ2MC41NCA0NjAuNTQgMCAxIDAgMTA4NS4xNzE1IDYxNy40MDAwIEMgOTgwLjUwMDAgNjc0LjkwMDAgODg3LjkwMDAgNjUyLjgwMDAgODA5LjAwMDAgNTQwLjAwMDAgQyA5NDAuMjExMiA3MDYuMjU5OCAxMDY4LjAwNTcgNTg2LjIzMzcgMTA4Mi43MDU4IDU2NS41MDAwIFogTSA2NTMuMTk5OTk5OTk5OTk5OSA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDQwOS4wOTk5OTk5OTk5OTk5NyA2MzIuOTggQSAxMjIuMDUgMTIyLjA1IDAgMSAxIDY1My4xOTk5OTk5OTk5OTk5IDYzMi45OCBaIE0gNjUzLjIgNjMzIEMgNjUzLjIgNzE2Ljc1ODggNTg0LjM2ODEgNzgyLjEwNTggNDk5LjcgNzgxLjY1ODEgQyA0MTMuMDEwMiA3ODEuMTk5NyAzNDcuMjQ2MyA3MTMuMDQxIDM0NC43NDYzIDYyOS45MDg4IEMgMzQxLjI0MjkgNTEzLjQxIDQ0OS41NTYgNDA4LjE2NDEgNTgwLjIgNDA3LjU0MTkgQyA2NzQuMjY3NyA0MDcuMDkzOSA3NTUuNzcyOSA0NTIuNjYyIDgwOSA1NDAgQyA3NTguNTM4NyA0NTAuOTI1IDY3NS42Njk1IDQwMy4zMDUxIDU4MC4yIDQwMi44NTgxIEMgNDQ3LjAxNTYgNDAyLjIzNDUgMzM1LjAyMDggNTA5LjU4NTMgMzM4Ljg1MzcgNjMwLjA5MTIgQyAzNDEuNTk3MSA3MTYuMzQxOCA0MTAuNjUwNiA3ODYuNDAwNSA0OTkuNyA3ODUuOTQxOSBDIDU4Ni41ODIyIDc4NS40OTQ1IDY1My4yIDcxNy4wNTAyIDY1My4yIDYzMyBaICBNIDQ5MyA1MTcgQyA2MTYuNjk2OSA0NjUuODM2OCA3NDUuNTA0NiA1MTkuMjQ3IDc3Ni41MzQyIDY1Ny4zMTQgQyA4MTMuODU5OSA4MjMuMzk1NCA2NTcuNDQ0NSA5NzguNjg1IDQ4NC45NzY1IDkzNy40NjI2IEMgNDA5LjEwNjkgOTE5LjMyODYgMzYwLjE1NDQgOTA4LjkzNDUgMzI2LjU0NDkgODYxLjg4NTkgQyAzNTguNTYyOCA5MTAuNDA5OSA0MDguOTEzNiA5MjEuNjQ4OCA0ODQuMjIzNSA5NDAuNTM3NCBDIDY1OC41OTM0IDk4NC4yNzEzIDgxOS45NTExIDgyNi4xMzI2IDc4MS4wNjU4IDY1Ni4yODYgQyA3NDguODYzOSA1MTUuNjMxNyA2MTUuMzAzMSA0NjIuMTYzMiA0OTMgNTE3IFogIiBmaWxsPSIjMTYzNjNCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcGF0aD0idXJsKCNpLXN5c3RlbS1saW1pdCkiLz4KPC9zdmc+Cg==' };
let signatureMode = 'master';
function updateSignature() {
  const original = $('#showOriginal').checked;
  const base = signatureMode === 'master' ? 'ELANUM-Master-Spektrum' : 'ELANUM-System-Ink';
  const mode = { master: 'Spektrum', ink: 'Ink', inverse: 'Invers', relief: 'Papierrelief' }[signatureMode];
  $('#signatureImage').src = `assets/${base}${original ? '' : '-Curves'}.svg`;
  $('#signatureImage').alt = 'ELANUM ' + mode + ', ' + (original ? 'Original' : 'kurvenbereinigt');
  $('#signatureStage').dataset.mode = signatureMode;
  $('#signatureImage').hidden = signatureMode === 'relief';
  $('#signatureRelief').hidden = signatureMode !== 'relief';
  const mask = 'url("' + (original ? MASKS.original : MASKS.curves) + '")';
  $('#signatureRelief span').style.webkitMaskImage = mask;
  $('#signatureRelief span').style.maskImage = mask;
  $('#signatureLabel').textContent = mode + ' · ' + (original ? 'Unverändertes Original' : 'Kurvenkorrektur');
  $$('[data-signature-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.signatureMode === signatureMode)));
}
$$('[data-signature-mode]').forEach(button => button.addEventListener('click', () => { signatureMode = button.dataset.signatureMode; updateSignature(); }));
$('#showOriginal').addEventListener('change', updateSignature);

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
    return `<button type="button" style="--swatch:${hex}" data-copy="${hex}" aria-label="${group.label} ${step} ${hex} kopieren"><span class="ramp__bar"></span><span>${step}</span><span>${hex}</span></button>`;
  }).join('');
  const fields = rad.items.filter(item => item.group === group.id).map(item => `<li>${rad.iconSvg(item.id)}${item.label}</li>`).join('');
  card.innerHTML = `<h4 class="area-card__name">${group.label}</h4><div class="ramp" data-anim="ramp">${ramp}</div><ul class="area-card__fields">${fields}</ul>`;
  $('#areaPalette').append(card);
});
$('#areaPalette').addEventListener('click', event => { const b = event.target.closest('[data-copy]'); if (b) copyText(b.dataset.copy, b.dataset.copy + ' kopiert'); });

const SPECTRUM = [['Violet', '#6756D9'], ['Blue', '#4D7FE8'], ['Orchid', '#9466DF'], ['Rose', '#D85BA9'], ['Pink', '#F0719A']];
$('#spectrumPalette').innerHTML = '<div class="spectrum__bar" role="img" aria-label="Markenspektrum von Violett bis Pink"></div><div class="spectrum__values">' +
  SPECTRUM.map(([name, hex]) => `<button type="button" data-copy="${hex}" aria-label="${name} ${hex} kopieren">${name} ${hex}</button>`).join('') + '</div>';
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
    `<button type="button" class="gradient__copy" aria-label="${name} als Liste kopieren">Kopieren</button>`;
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
  ['Bedienbar für alle', 'Tastatur, sichtbarer Fokus, 44-px-Ziele, lesbare mobile Beschriftung.']
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
  $('#scoreMessage').textContent = count === RULES.length ? 'Alle acht Regeln bestätigt. Die visuelle Freigabe erfolgt separat.' : count + ' von 8 Regeln bestätigt. Eine Checkliste ersetzt kein visuelles Review.';
}));

/* ---------- 14 Tokens: der Block liest die Werte aus tokens.css ---------- */
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
