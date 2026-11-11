'use strict';
/* ============================================================
   ELANUM Gestaltungsatlas 4.11 · Bedienlogik
   Elemente (Beziehungsraum, Resonanzrad, Umfeld, Zeichen, App-Rahmen, Fliesstext) liegen
   unter components/ und werden hier nur eingebunden. Bewegung steuert
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
  $$('[data-zeichen-nochmals]').forEach(button => { button.disabled = off; });
  $('#motionPreference').textContent = reducedMotion.matches ? 'Dein System bevorzugt reduzierte Bewegung. Alle Darstellungen bleiben ruhig.' : 'Die Systemeinstellung für reduzierte Bewegung wird respektiert.';
  document.dispatchEvent(new CustomEvent('elanum:motion', { detail: { off } }));
  if (window.ElanumVorschau) window.ElanumVorschau.setMotion(off);   /* auch in die Rahmen der App-Screens */
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

/* ---------- 02 Zeichen: geprüfte Dateien aus tools/build_logo_circles.py, nie eine zur Laufzeit erzeugte Form ---------- */
/* Relief-Maske eingebettet, damit die Prägung auch unter file:// funktioniert (python3 tools/build_logo_circles.py --masks) */
const RELIEF_MASK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iOTYwIiB2aWV3Qm94PSIxNDQgMTMyIDk2MCA5NjAiPjxkZWZzPjxjbGlwUGF0aCBpZD0iaS1zeXN0ZW0tbGltaXQiPjxwYXRoIGQ9Ik0gMTA3OS44NjU2IDU0My40NDI2IEEgNDYwLjU0IDQ2MC41NCAwIDEgMCAxMDg1LjE4OTkgNjEzLjU4MzkgQSAxOTguMzk4OCAxOTguMzk4OCAwIDAgMSA4MDkgNTQwIEEgMTU1Ljk3MTUgMTU1Ljk3MTUgMCAwIDAgMTA3OS44NjU2IDU0My40NDI2IFogTSA2NTMuNzY3MiA2MzIuOTggQSAxMjIuNjE3MiAxMjIuNjE3MiAwIDEgMSA0MDguNTMyOCA2MzIuOTggQSAxMjIuNjE3MiAxMjIuNjE3MiAwIDEgMSA2NTMuNzY3MiA2MzIuOTggWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PHBhdGggZD0iTSAxMDc5Ljg2NTYgNTQzLjQ0MjYgQSA0NjAuNTQgNDYwLjU0IDAgMSAwIDEwODUuMTg5OSA2MTMuNTgzOSBBIDE5OC4zOTg4IDE5OC4zOTg4IDAgMCAxIDgwOSA1NDAgQSAxNTUuOTcxNSAxNTUuOTcxNSAwIDAgMCAxMDc5Ljg2NTYgNTQzLjQ0MjYgWiBNIDY1My43NjcyIDYzMi45OCBBIDEyMi42MTcyIDEyMi42MTcyIDAgMSAxIDQwOC41MzI4IDYzMi45OCBBIDEyMi42MTcyIDEyMi42MTcyIDAgMSAxIDY1My43NjcyIDYzMi45OCBaIE0gNjUzLjc2NzIgNjMyLjk4IEEgMTM0LjY4NDYgMTM0LjY4NDYgMCAwIDEgNTQ3Ljk0NyA3NjQuNTM1MyBBIDE3Mi45MTA2IDE3Mi45MTA2IDAgMCAxIDM1MS43MjUyIDUyOC4wODA2IEEgMjIwLjc2MTggMjIwLjc2MTggMCAwIDEgNDUzLjQxMjIgNDE4LjMwNzUgQSAyNDkuMzY3MSAyNDkuMzY3MSAwIDAgMSA2NzIuMjk2MyA0MTMuMTg4NSBBIDI5OS4yOTgxIDI5OS4yOTgxIDAgMCAxIDgwOSA1NDAgQSAzNzUuNjA4MSAzNzUuNjA4MSAwIDAgMCA3NTQuMTUyIDQ2NC44Mjc2IEEgMjU1LjM2NzEgMjU1LjM2NzEgMCAwIDAgNDUwLjY1MjggNDEyLjk3OTcgQSAyMjYuNzYxOCAyMjYuNzYxOCAwIDAgMCAzNDYuMjAyMiA1MjUuNzM2MiBBIDE3OC45MTA2IDE3OC45MTA2IDAgMCAwIDUxNy4yNDgyIDc3NC40Mzk4IEEgMTQxLjU0OTIgMTQxLjU0OTIgMCAwIDAgNjUzLjc2NzIgNjMyLjk4IFogTSA0ODEuODY0MyA1MjAuNzA0IEEgMjM1Ljk4MTkgMjM1Ljk4MTkgMCAwIDEgNjM0LjMzMzggNTA3Ljk0MzkgQSAxOTUuODk4OCAxOTUuODk4OCAwIDAgMSA3NjIuNDI1OSA2MTEuNzMwMyBBIDIyMS4yNjE4IDIyMS4yNjE4IDAgMCAxIDY5MC45NTM0IDg5MC4wOTcyIEEgMjgyLjEyOTQgMjgyLjEyOTQgMCAwIDEgNTUzLjM4NTcgOTQwLjMyMjkgQSAzMDkuODY3MSAzMDkuODY3MSAwIDAgMSAzMjMuNDIwNiA4NjUuODU1NyBBIDM0Ni41NTQzIDM0Ni41NTQzIDAgMCAwIDQyNC4zNzg1IDkyNi43NyBBIDI4Ny4xMjk0IDI4Ny4xMjk0IDAgMCAwIDY5My44Mjg0IDg5NC4xODggQSAyMjYuMjYxOCAyMjYuMjYxOCAwIDAgMCA3NjYuOTE2IDYwOS41MzA2IEEgMjAwLjg5ODggMjAwLjg5ODggMCAwIDAgNTU5LjEwNjcgNDk4Ljg5MTkgQSAyOTAuODQ3MyAyOTAuODQ3MyAwIDAgMCA0ODEuODY0MyA1MjAuNzA0IFoiIGZpbGw9IiMxNjM2M0IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1wYXRoPSJ1cmwoI2ktc3lzdGVtLWxpbWl0KSIvPjwvc3ZnPgo=';
let signatureMode = 'master';
function updateSignature() {
  const blueprint = signatureMode === 'blueprint';
  const base = signatureMode === 'master' ? 'ELANUM-Master-Spektrum' : 'ELANUM-System-Ink';
  const mode = { master: 'Spektrum', ink: 'Ink', inverse: 'Invers', relief: 'Papierrelief', blueprint: 'Blueprint' }[signatureMode];
  $('#signatureImage').src = blueprint ? 'assets/ELANUM-Konstruktion-Harmonic.svg' : `assets/${base}-Harmonic.svg`;
  $('#signatureImage').alt = blueprint ? 'Blueprint des ELANUM-Zeichens mit allen Konstruktionskreisen im Goldenen Schnitt' : 'ELANUM-Zeichen in ' + mode + ', Goldener Schnitt';
  $('#signatureStage').dataset.mode = signatureMode;
  $('#signatureImage').hidden = signatureMode === 'relief';
  $('#signatureRelief').hidden = signatureMode !== 'relief';
  const mask = 'url("' + RELIEF_MASK + '")';
  $('#signatureRelief span').style.webkitMaskImage = mask;
  $('#signatureRelief span').style.maskImage = mask;
  $('#signatureLabel').textContent = mode + ' · Goldener Schnitt';
  $$('[data-signature-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.signatureMode === signatureMode)));
}
$$('[data-signature-mode]').forEach(button => button.addEventListener('click', () => { signatureMode = button.dataset.signatureMode; updateSignature(); }));
updateSignature();

/* Das Zeichen in Bewegung: Zeichenaufbau und Lichtlauf (components/zeichen). Die Form steht. */
window.ElanumZeichen.mountAll();
$$('[data-zeichen-nochmals]').forEach(button => button.addEventListener('click', () => {
  $$('[data-zeichen=aufbau]', button.closest('.bewegung')).forEach(node => node._zeichen.play());
}));

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

const STEPS = [['Tief · Schrift', 'tief'], ['Fläche · ausgefüllt', 'flaeche'], ['Hauch · Ring', 'hauch']];
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
$('#spectrumPalette').innerHTML = '<div class="spectrum__row"><div class="zeichen" data-zeichen="lichtlauf"><img src="assets/ELANUM-Master-Spektrum-Harmonic.svg" alt="" width="56" height="56"></div>' +
  '<div class="spectrum__bar" role="img" aria-label="Markenspektrum von Violett bis Pink"></div></div><div class="spectrum__values">' +
  SPECTRUM.map(([name, hex]) => `<button type="button" class="glow-edge" data-copy="${hex}" aria-label="${name} ${hex} kopieren">${name} ${hex}</button>`).join('') + '</div>';
window.ElanumZeichen.mountAll($('#spectrumPalette'));
$('#spectrumPalette').addEventListener('click', event => { const b = event.target.closest('[data-copy]'); if (b) copyText(b.dataset.copy, b.dataset.copy + ' kopiert'); });

/* Verläufe: Farbstopps als kommaseparierte Liste, live aus tokens.css */
const GRADIENTS = [
  ['Markenspektrum', 'Zeichen und Verbindung', css('--spectrum-stops')],
  ['Verbindung', 'Linie zwischen zwei Menschen', css('--bridge-stops')],
  ['Glührand', 'Rand bei Hover, Fokus und Auswahl, wandert im Kreis', css('--edge-stops'), true],
  ...rad.groups.map(group => [group.label, 'Tief, Fläche, Hauch', ['tief', 'flaeche', 'hauch'].map(n => css(`--${group.id}-${n}`)).join(', ')])
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

/* ---------- 10 In der App: Screens in Rahmen, Ziele je Kosmos aus dem App-Rahmen ---------- */
window.ElanumVorschau.mount($('[data-vorschau]'), { base: 'components/app/' });
const appNav = window.ElanumApp;
appNav.kosmen.forEach(kosmos => {
  const card = document.createElement('article');
  card.className = 'kosmos-nav__card';
  card.innerHTML = `<h4>${kosmos.name}</h4><p class="secondary">${kosmos.sentence}</p><ul>` +
    kosmos.items.map(item => `<li>${appNav.iconSvg(item.icon)}<span>${item.label}</span>${item.name ? `<span class="secondary t-label">· ${item.name}</span>` : ''}</li>`).join('') +
    `<li class="kosmos-nav__menu">${appNav.iconSvg('menue')}<span>Menü</span><span class="secondary t-label">· Kosmos wechseln, Wissen, Konto</span></li></ul>`;
  $('#kosmosNav').append(card);
});

/* ---------- 11 Bausteine: Icon-Set ---------- */
rad.items.forEach(item => {
  const li = document.createElement('li');
  li.className = 'area'; li.dataset.area = item.group;
  li.innerHTML = rad.iconSvg(item.id) + item.label;
  $('#iconSet').append(li);
});

/* ---------- 13 Sprache: Fliesstext, jede Aussage mit ihrer Quelle ---------- */
ElanumFliesstext.mount($('.atlas-fliesstext'), { quellen: {
  'human-design': { text: 'Profil 4/6: deine bewusste und unbewusste Linie sowie die Art, wie du auf Situationen reagierst.', href: 'components/fliesstext/' },
  'astrology': { text: 'Relevante Stellungen und Häuser aus Geburtsort, Geburtszeit und Planetenkonstellation.', href: 'components/fliesstext/' }
} });

/* ---------- 14 Prüfung ---------- */
const RULES = [
  ['Das Zeichen bleibt', 'Grundform, Linien und Proportionen bleiben. Seine Form bewegt sich nie, nur Licht und Farbe.'],
  ['Kreise bleiben rund', 'Auch in Bewegung und auf kleinen Bildschirmen.'],
  ['Fünf Schriftstufen', 'Yrsa nur gross, kein Kursiv, nichts unter 15 px.'],
  ['Farbe hat eine Rolle', 'Neutral, Bereich oder Status. Die Rollen mischen sich nicht.'],
  ['Text auf Farbe ist lesbar', 'Weisse Schrift nur auf Tief, Ink auf dem Hauch. Elemente tragen nur Icons.'],
  ['Raum statt Rahmen', 'Abstand gliedert, Linien trennen nur Kapitel.'],
  ['Bewegung erklärt', 'Jede Animation zeigt eine Beziehung, eine Reihenfolge oder einen Zustand. Pause und reduzierte Bewegung wirken.'],
  ['Bedienbar für alle', 'Tastatur, sichtbarer Fokus, 44-px-Ziele, lesbare mobile Beschriftung.'],
  ['Begriffe aus dem Glossar', 'Alles heisst so wie im Glossar. Keine alten Arbeitsnamen.'],
  ['Mobile zuerst', 'Geprüft auf 360, 390, 834, 1280 und 1440 px. Navigation und Hauptaktion in der Daumenzone, jede Geste mit Knopf.']
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

/* ---------- 15 Glossar: verbindliche Begriffe aus assets/glossar.js ---------- */
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

/* ---------- 16 Tokens: der Block liest die Werte aus tokens.css ---------- */
const TOKEN_GROUPS = [
  ['Fläche und Schrift', ['--canvas', '--paper', '--ink', '--ink-2', '--line']],
  ['Bereiche: tief · Fläche · Hauch, offen', ['--sterne-tief', '--sterne-flaeche', '--sterne-hauch', '--ich-tief', '--ich-flaeche', '--ich-hauch', '--bezug-tief', '--bezug-flaeche', '--bezug-hauch', '--offen']],
  ['Status', ['--info', '--info-bg', '--hint', '--hint-bg', '--error', '--error-bg', '--success', '--success-bg']],
  ['Typografie', ['--type-display', '--type-title', '--type-heading', '--type-body', '--type-label']],
  ['Raum und Form', ['--gutter', '--section', '--content', '--radius-control', '--radius-button', '--radius-surface', '--raised', '--pressed']],
  ['Linien und Bewegung', ['--trace', '--bridge', '--ease', '--motion-ui', '--motion-reveal', '--motion-breath']]
];
$('#tokenCode').textContent = ':root {\n' + TOKEN_GROUPS.map(([title, names]) =>
  `  /* ${title} */\n` + names.map(name => `  ${name}: ${css(name)};`).join('\n')).join('\n\n') + '\n}';
$('#copyTokens').addEventListener('click', () => copyText($('#tokenCode').textContent, 'Tokens kopiert'));

syncMotion();
