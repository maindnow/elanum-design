/* ============================================================
   ELANUM App-Screens · Vorschau
   Inhalte und Abläufe der Beispielseiten. Nicht Teil des Pakets:
   Die App bringt ihre eigenen Daten mit und nutzt nur den Rahmen
   (app.css, app.js) und die Bausteine.
   Alles bleibt in diesem Dokument: kein Versand, keine Speicherung.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var A = window.ElanumApp, R = window.ElanumResonanzrad;
  var screen = document.body.dataset.screen;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var calm = function () { return reduced.matches || document.body.dataset.motion === 'off'; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(id) { return A.iconSvg(id); }
  function radIcon(id) { return R ? R.iconSvg(id) : ''; }
  function item(id) { return R ? R.items.filter(function (it) { return it.id === id; })[0] : null; }

  /* Seiten, die es als Vorschau gibt. Alle anderen Ziele zeigen „Folgt“. */
  var PAGES = ['heute', 'ich', 'umfeld', 'weg', 'entdecken', 'chats', 'aktivitaeten', 'ankommen'];
  var href = function (id) { return PAGES.indexOf(id) >= 0 ? id + '.html' : 'folgt.html?s=' + id; };
  var kosmosOf = function (id) {
    var k = A.kosmen.filter(function (k) { return k.items.some(function (it) { return it.id === id; }); })[0];
    return k ? k.id : 'resonanz';
  };

  var current = screen;
  if (screen === 'folgt') current = new URLSearchParams(location.search).get('s') || 'likes';
  A.mount({ kosmos: kosmosOf(current), current: current, href: href, base: '../../' });
  $$('svg[data-rad-icon]').forEach(function (s) { s.outerHTML = radIcon(s.getAttribute('data-rad-icon')); });

  /* ---------- Heute ---------- */
  if (screen === 'heute') {
    var mini = $('[data-mini-rad]');
    if (mini && R) { var st = R.mini(mini, { focus: 'personality' }); $('[data-mini-rad-count]').textContent = st.done + ' von ' + st.total + ' ausgefüllt'; }
    A.dayArc($('[data-day-arc]'), { now: '19:10', stations: ['07:40', '12:30'] });
    $('[data-note]').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#noteField').value.trim();
      $('[data-note-state]').textContent = v ? 'Behalten für heute. Nur in dieser Vorschau.' : 'Schreibe zuerst einen Satz.';
    });
  }

  /* ---------- Ich ---------- */
  if (screen === 'ich' && R) R.mount($('[data-resonanzrad]'), { heading: 'h2' });

  /* ---------- Umfeld ---------- */
  if (screen === 'umfeld' && window.ElanumUmfeld) window.ElanumUmfeld.mount($('[data-umfeld]'), { link: '../beziehungsraum/', heading: 'h2' });

  /* ---------- Weg: Zeitstufe ---------- */
  if (screen === 'weg') {
    $$('[data-scale]').forEach(function (b) {
      b.addEventListener('click', function () { $$('[data-scale]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
    });
  }

  /* ---------- Entdecken: drei Menschen, erklärt statt bewertet ---------- */
  var PEOPLE = [
    { id: 'noah', name: 'Noah', age: 38, city: 'Winterthur', km: 12, line: 'Ich höre lieber eine Frage zu viel als eine zu wenig.',
      space: { proximity: 64, resonance: 76, openness: 36 }, words: 'nah · spürbare Resonanz',
      notes: [
        { el: 'values', kind: 'Gemeinsam', text: 'Ehrlichkeit steht bei euch beiden zuerst, auch wenn sie etwas kostet.' },
        { el: 'attachment', kind: 'Gemeinsam', text: 'Ihr seid beide sicher gebunden. Nähe und Abstand dürfen sich abwechseln.' },
        { el: 'conflict', kind: 'Hier seid ihr unterschiedlich', diff: true, text: 'Du sprichst Dinge gleich an. Noah braucht zuerst etwas Abstand.' }
      ],
      prompts: [['Ein guter Sonntag', 'Lange frühstücken, dann irgendwohin, wo man weit sieht.'], ['Was ich gerade lerne', 'Nicht jede Frage sofort zu beantworten.']],
      done: ['astrology', 'numerology', 'human-design', 'direction', 'values', 'attachment', 'conflict'],
      facts: [['Sonne', 'Waage'], ['Human Design', 'Projektor'], ['Werte', 'Ehrlichkeit']] },
    { id: 'elias', name: 'Elias', age: 41, city: 'Zürich', km: 4, line: 'Am liebsten zu Fuss, egal wohin.',
      space: { proximity: 48, resonance: 58, openness: 52 }, words: 'nah · spürbare Resonanz',
      notes: [
        { el: 'direction', kind: 'Gemeinsam', text: 'Ihr seid beide gerade im Aufbruch und probiert Neues aus.' },
        { el: 'closeness', kind: 'Gemeinsam', text: 'Zuneigung zeigt ihr beide eher mit Zeit als mit Worten.' },
        { el: 'personality', kind: 'Hier seid ihr unterschiedlich', diff: true, text: 'Du tankst allein auf. Elias braucht dafür andere Menschen.' }
      ],
      prompts: [['Ein perfekter Abend', 'Ein Tisch draussen, zu viel Brot, niemand muss früh weg.'], ['Woran ich glaube', 'Dass man Orte zu Fuss besser kennenlernt.']],
      done: ['astrology', 'numerology', 'direction', 'personality', 'values', 'closeness'],
      facts: [['Sonne', 'Schütze'], ['Lebenszahl', '3'], ['Werte', 'Freiheit']] },
    { id: 'luca', name: 'Luca', age: 36, city: 'Bern', km: 96, line: 'Ich koche, du wählst die Musik.',
      space: { proximity: 30, resonance: 44, openness: 64 }, words: 'weit · spürbare Resonanz',
      notes: [
        { el: 'human-design', kind: 'Gemeinsam', text: 'Ihr entscheidet beide aus dem Bauch und merkt schnell, was stimmt.' },
        { el: 'values', kind: 'Gemeinsam', text: 'Verlässlichkeit ist euch beiden wichtig.' },
        { el: 'attachment', kind: 'Hier seid ihr unterschiedlich', diff: true, text: 'Luca braucht mehr Rückversicherung, du mehr eigenen Raum.' }
      ],
      prompts: [['Ein guter Sonntag', 'Markt am Morgen, Kochen am Nachmittag, Gäste am Abend.'], ['Was mich zum Lachen bringt', 'Hunde, die sich für Menschen halten.']],
      done: ['astrology', 'numerology', 'human-design', 'values', 'attachment', 'closeness', 'conflict', 'personality'],
      facts: [['Sonne', 'Stier'], ['Human Design', 'Generator'], ['Werte', 'Verlässlichkeit']] }
  ];

  if (screen === 'entdecken') {
    var at = 0, frame = null, resonated = {};
    var host = $('[data-discover-profile]');
    var stateOf = function (i) { return i < at ? 'done' : i === at ? 'now' : 'open'; };
    var renderProgress = function () {
      /* Die Auswahl als Stationen: gesehen, jetzt, noch offen. Jede Station ist ein Knopf. */
      $('[data-discover-steps]').innerHTML = PEOPLE.map(function (p, i) {
        var st = stateOf(i), word = st === 'done' ? (resonated[p.id] != null ? 'Resonanz gezeigt' : 'gesehen') : st === 'now' ? 'jetzt' : 'noch offen';
        return '<li data-state="' + st + '"><button type="button" data-pick="' + i + '"' + (i === at ? ' aria-current="step"' : '') + '>' + esc(p.name) +
          '<span class="visually-hidden">, ' + word + '</span></button></li>';
      }).join('');
    };
    var renderProfile = function () {
      if (at >= PEOPLE.length) {
        host.innerHTML = '<div class="app-card app-card--quiet app-end"><ol class="app-steps" aria-hidden="true">' +
          PEOPLE.map(function (p) { return '<li data-state="done">' + esc(p.name) + '</li>'; }).join('') + '</ol>' +
          '<h2 class="t-title">Für heute hast du alle gesehen.</h2><p class="secondary">Morgen kommen drei neue Menschen. Bis dahin warten deine Chats.</p>' +
          '<a class="button button--secondary glow-edge" href="chats.html">Zu den Chats</a></div>';
        $('[data-discover-actions]').hidden = true;
        $('[data-discover-steps]').hidden = true;
        return;
      }
      var p = PEOPLE[at];
      var notes = p.notes.map(function (n) {
        var it = item(n.el);
        return '<li class="note' + (n.diff ? ' note--diff' : '') + '"><span class="note__kind">' + esc(n.kind) + '</span>' +
          '<span class="element-chip area" data-area="' + it.group + '">' + radIcon(it.id) + esc(it.label) + '</span><p>' + esc(n.text) + '</p></li>';
      }).join('');
      var prompts = p.prompts.map(function (q, i) {
        var on = resonated[p.id] === i;
        return '<figure class="prompt"><figcaption>' + esc(q[0]) + '</figcaption><blockquote>' + esc(q[1]) + '</blockquote>' +
          '<button class="prompt__resonate glow-edge" type="button" data-prompt="' + i + '" aria-pressed="' + on + '" aria-label="Resonanz zeigen auf: ' + esc(q[0]) + '">' + icon('likes') + '</button></figure>';
      }).join('');
      host.innerHTML =
        '<article class="profile" aria-labelledby="profileName">' +
          '<header class="profile__head"><h2 class="profile__name" id="profileName">' + esc(p.name) + ', ' + p.age + '</h2>' +
            '<p class="profile__meta"><span>' + icon('ort') + esc(p.city) + ' · ' + p.km + ' km</span><span>' + icon('profil') + 'Verifiziert</span></p></header>' +
          '<div class="profile__media"><div class="photo" role="img" aria-label="Foto von ' + esc(p.name) + ', Platzhalter">' + esc(p.name[0]) + '</div></div>' +
          '<div class="profile__body">' +
            '<p class="profile__line">«' + esc(p.line) + '»</p>' +
            '<section class="app-section" aria-labelledby="whereTitle">' +
              '<div class="app-hero app-hero--dark space-hero"><div class="space-hero__head"><h3 class="app-card__kicker" id="whereTitle">Wo es schwingt</h3><p class="space-hero__words">Du und ' + esc(p.name) + ': ' + esc(p.words) + '</p></div><div data-space></div>' +
              '<p class="space-hero__note">Ein Bild, keine Messung. Es zeigt Nähe, Resonanz und Freiraum zwischen euch.</p></div>' +
              '<ul class="notes">' + notes + '</ul></section>' +
            '<section class="app-section" aria-labelledby="askTitle"><h3 class="app-section__title" id="askTitle">Fragen an ' + esc(p.name) + '</h3>' + prompts + '</section>' +
            '<section class="app-section" aria-labelledby="wheelTitle"><h3 class="app-section__title" id="wheelTitle">' + esc(p.name) + 's Resonanzrad</h3>' +
              '<div class="profile__wheel"><div class="profile__mini" data-profile-mini></div><dl class="profile__facts">' +
                p.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl></div></section>' +
          '</div></article>';
      if (R) R.mini($('[data-profile-mini]'), { done: p.done, label: p.name + 's Resonanzrad: ' + p.done.length + ' von 9 Elementen ausgefüllt' });
      /* Ein Beziehungsraum, bei jedem Menschen neu gesetzt: Du und die Person. */
      if (window.ElanumBeziehung) {
        if (!frame) {
          frame = document.createElement('div');
          frame.className = 'relationship-frame discover__space';
          frame.setAttribute('data-beziehung', ''); frame.setAttribute('data-dark', '');
          frame.innerHTML = '<svg viewBox="0 0 720 400" aria-hidden="true"></svg><div class="relationship-label" data-person="a">Du</div><div class="relationship-label" data-person="b"><span data-name></span></div>';
        }
        $('[data-space]', host).replaceWith(frame);
        frame.setAttribute('role', 'img');
        frame.setAttribute('aria-label', 'Du und ' + p.name + ': ' + p.words + '. Zwei eigene Kreise, die Verbindung dazwischen.');
        $('[data-name]', frame).textContent = p.name;
        window.ElanumBeziehung.mount(frame);
        window.ElanumBeziehung.set(frame, p.space, true);
      }
      $('[data-discover-actions]').hidden = false;
      $('[data-discover-steps]').hidden = false;
    };
    var go = function (i, focus) {
      at = i; renderProgress(); renderProfile();
      if (!calm() && host.animate) host.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
      if (focus) { var h = $('#profileName') || $('.app-end h2', host); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
      scrollTo({ top: 0, behavior: calm() ? 'auto' : 'smooth' });
    };
    var sheetApi = A.sheet($('#resonateSheet')), resonateOn = 0;
    var openResonate = function (i) {
      var p = PEOPLE[at]; resonateOn = i;
      $('[data-resonate-on]').innerHTML = i == null
        ? '<p class="app-kicker">An ' + esc(p.name) + '</p><p class="t-heading">Du zeigst Resonanz auf das ganze Profil.</p>'
        : '<p class="app-kicker">An ' + esc(p.name) + ' · ' + esc(p.prompts[i][0]) + '</p><blockquote class="resonate-quote">' + esc(p.prompts[i][1]) + '</blockquote>';
      sheetApi.open();
    };
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-prompt]'); if (b) openResonate(+b.dataset.prompt);
    });
    $('[data-discover-steps]').addEventListener('click', function (e) { var b = e.target.closest('[data-pick]'); if (b) go(+b.dataset.pick, true); });
    $('[data-skip]').addEventListener('click', function () { go(at + 1, true); });
    $('[data-resonate]').addEventListener('click', function () { openResonate(null); });
    /* Resonanz zeigen ist ein Moment: zwei eigene Kreise rücken zusammen, die
       Verbindung entsteht. Weiter geht es erst, wenn du es willst. */
    var form = $('[data-resonate-form]'), moment = $('[data-resonate-moment]'), momentFrame = null, pending = false;
    var finish = function () { if (!pending) return; pending = false; form.hidden = false; moment.hidden = true; go(at + 1, true); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = PEOPLE[at], next = PEOPLE[at + 1];
      resonated[p.id] = resonateOn == null ? -1 : resonateOn;
      $('#resonateText').value = '';
      var on = resonateOn == null ? 'dein Profil' : '«' + p.prompts[resonateOn][0] + '»';
      moment.innerHTML =
        '<div class="app-hero app-hero--dark resonate-moment">' +
          '<div class="relationship-frame" data-beziehung data-dark role="img" aria-label="Du und ' + esc(p.name) + ', zwei eigene Kreise, die Verbindung entsteht."><svg viewBox="0 0 720 400" aria-hidden="true"></svg>' +
          '<div class="relationship-label" data-person="a">Du</div><div class="relationship-label" data-person="b">' + esc(p.name) + '</div></div>' +
          '<h2 class="app-hero__voice" id="momentTitle" tabindex="-1">Deine Resonanz ist bei ' + esc(p.name) + '.</h2>' +
          '<p class="app-card__text">' + esc(p.name) + ' sieht, worauf du reagiert hast: ' + esc(on) + '. Wenn es auch bei ' + esc(p.name) + ' schwingt, öffnet sich ein Chat.</p>' +
        '</div>' +
        '<button class="button" type="button" data-moment-next>' + (next ? 'Weiter zu ' + esc(next.name) : 'Zum Abschluss für heute') + '</button>';
      form.hidden = true; moment.hidden = false; pending = true;
      momentFrame = $('[data-beziehung]', moment);
      if (window.ElanumBeziehung) {
        window.ElanumBeziehung.mount(momentFrame);
        window.ElanumBeziehung.set(momentFrame, { proximity: 4, resonance: 0, openness: 70 }, true);
        setTimeout(function () { window.ElanumBeziehung.set(momentFrame, { proximity: 86, resonance: 92, openness: 30 }, calm()); }, 120);
      }
      $('#momentTitle').focus();
      $('[data-moment-next]', moment).addEventListener('click', function () { sheetApi.close(); });
    });
    /* Wie auch immer das Sheet schliesst, nach dem Senden geht es zum nächsten Menschen. */
    $('#resonateSheet').addEventListener('close', finish);
    go(0, false);
  }

  /* ---------- Chats: Liste und Verlauf ---------- */
  var CHATS = [
    { id: 'noah', name: 'Noah', when: 'Jetzt', isNew: true, preview: 'Hat Resonanz auf «Ein guter Sonntag» gezeigt',
      element: { label: 'Ein guter Sonntag', quote: 'Lange frühstücken, dann irgendwohin, wo man weit sieht.' },
      messages: [['them', 'Ich mag, wie du Sonntage beschreibst. Wo siehst du am liebsten weit?', '19:02']],
      ideas: ['Am liebsten vom Hörnli aus. Und du?', 'Was gehört für dich zu einem langen Frühstück?', 'Welche Frage stellst du gern zu viel?'] },
    { id: 'elias', name: 'Elias', when: '18:20', preview: 'Dann bis Donnerstag beim Hafen?',
      messages: [['them', 'Hast du am Donnerstag Zeit für einen Spaziergang?', '17:48'], ['me', 'Gern. Nach der Arbeit, so ab halb sieben?', '18:05'], ['them', 'Dann bis Donnerstag beim Hafen?', '18:20']],
      ideas: [] },
    { id: 'luca', name: 'Luca', when: 'Mo', preview: 'Du: Das klingt nach einem guten Plan.',
      messages: [['them', 'Ich probiere am Wochenende ein neues Rezept aus. Mit Kürbis.', 'Mo 20:11'], ['me', 'Das klingt nach einem guten Plan.', 'Mo 20:30']],
      ideas: [] }
  ];
  if (screen === 'chats') {
    var split = $('[data-chats]'), list = $('[data-chat-list]'), body = $('[data-thread-body]'), active = 0;
    var desktop = matchMedia('(min-width:1024px)');
    var renderList = function () {
      list.innerHTML = CHATS.map(function (c, i) {
        return '<li><a class="app-row glow-edge' + (c.isNew ? ' is-new' : '') + '" href="#' + c.id + '" data-chat="' + i + '"' + (desktop.matches && i === active ? ' aria-current="true"' : '') + '>' +
          '<span class="person">' + esc(c.name[0]) + '</span><span class="app-row__body"><span class="app-row__title">' + esc(c.name) + '</span>' +
          '<span class="app-row__text">' + esc(c.preview) + '</span></span><span class="app-row__meta">' + esc(c.when) + (c.isNew ? '<span class="visually-hidden">, neu</span>' : '') + '</span></a></li>';
      }).join('');
    };
    var bubble = function (m) { return '<div class="bubble' + (m[0] === 'me' ? ' bubble--me' : '') + '">' + esc(m[1]) + '<span class="bubble__time">' + (m[0] === 'me' ? 'Du · ' : '') + esc(m[2]) + '</span></div>'; };
    var renderThread = function () {
      var c = CHATS[active];
      $('[data-thread-name]').textContent = c.name;
      $('[data-thread-initial]').textContent = c.name[0];
      $('[data-thread-space]').href = '../beziehungsraum/?person=' + encodeURIComponent(c.name);
      $('[data-composer-label]').textContent = 'Nachricht an ' + c.name;
      body.innerHTML = '<p class="app-thread__day">Heute</p>' +
        (c.element ? '<div class="bubble bubble--element"><span class="bubble__resonance">' + icon('likes') + esc(c.name) + ' zeigt Resonanz auf</span><strong class="t-heading">' + esc(c.element.label) + '</strong><span>«' + esc(c.element.quote) + '»</span></div>' : '') +
        c.messages.map(bubble).join('');
      $('[data-thread-ideas]').hidden = !c.ideas.length;
      $('[data-thread-chips]').innerHTML = c.ideas.map(function (t) { return '<button class="idea glow-edge" type="button">' + esc(t) + '</button>'; }).join('');
    };
    var setView = function (view) { split.dataset.view = view; document.body.dataset.view = view; };
    var open = function (i, push) {
      active = i; CHATS[i].isNew = false; renderList(); renderThread(); setView('detail');
      if (push && !desktop.matches) history.pushState({ chat: i }, '', '#' + CHATS[i].id);
      if (!desktop.matches) { scrollTo(0, 0); $('[data-back]').focus(); }
    };
    list.addEventListener('click', function (e) { var a = e.target.closest('[data-chat]'); if (!a) return; e.preventDefault(); open(+a.dataset.chat, true); });
    $('[data-back]').addEventListener('click', function () { if (history.state && history.state.chat != null) history.back(); else { setView('list'); renderList(); } });
    addEventListener('popstate', function () { setView(history.state && history.state.chat != null ? 'detail' : 'list'); renderList(); });
    $('[data-thread-chips]').addEventListener('click', function (e) { var b = e.target.closest('.idea'); if (!b) return; $('#message').value = b.textContent; $('#message').focus(); });
    $('[data-composer]').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#message').value.trim(); if (!v) return;
      CHATS[active].messages.push(['me', v, 'Jetzt']); CHATS[active].ideas = []; CHATS[active].preview = 'Du: ' + v; CHATS[active].when = 'Jetzt';
      $('#message').value = ''; renderThread(); renderList();
    });
    desktop.addEventListener('change', function () { renderList(); });
    var start = CHATS.map(function (c) { return '#' + c.id; }).indexOf(location.hash);
    renderList(); renderThread();
    if (start >= 0) open(start, false); else setView(desktop.matches ? 'detail' : 'list');
  }

  /* ---------- Aktivitäten: Karten und Sheet ---------- */
  var EVENTS = [
    { kind: 'Essen', day: '16', dow: 'Do', month: 'Okt', date: 'Donnerstag, 16. Oktober', title: 'Abendessen zu sechst', time: '19:30 bis 22:30', place: 'Zürich, Kreis 4', seats: 6, people: ['Selin', 'Tim', 'Ana', 'Ruedi'],
      text: 'Sechs Menschen, ein Tisch, drei Gänge. Den Ort erfährst du am Vortag. Am Tisch hilft eine Karte mit Fragen beim Anfangen.', host: 'Selin' },
    { kind: 'Draussen', day: '18', dow: 'Sa', month: 'Okt', date: 'Samstag, 18. Oktober', title: 'Auf den Uetliberg, ohne Eile', time: '09:00 bis 13:00', place: 'Zürich, Triemli', seats: 12, people: ['Jonas', 'Mira', 'Pascal', 'Lou', 'Nina', 'Ben', 'Ida'],
      text: 'Ein langsamer Aufstieg, oben ein Tee aus der Thermoskanne. Wer schneller ist, wartet. Gutes Schuhwerk genügt.', host: 'Jonas' },
    { kind: 'Stille', day: '19', dow: 'So', month: 'Okt', date: 'Sonntag, 19. Oktober', title: 'Eine Stunde ohne Worte', time: '17:00 bis 18:00', place: 'Winterthur, Altstadt', seats: 10, people: ['Ana', 'Mira'],
      text: 'Gemeinsam schweigen, danach ein Satz pro Person. Für alle, die Ruhe lieber teilen als suchen.', host: 'Ana' },
    { kind: 'Kochen', day: '22', dow: 'Mi', month: 'Okt', date: 'Mittwoch, 22. Oktober', title: 'Kochen mit Kürbis', time: '18:30 bis 21:30', place: 'Zürich, Wiedikon', seats: 8, people: ['Tim', 'Lou', 'Selin', 'Pascal', 'Nina', 'Ben', 'Ida', 'Ruedi'],
      text: 'Wir kochen zusammen, was der Markt gerade hat. Alle schneiden mit, alle essen mit.', host: 'Tim' }
  ];
  if (screen === 'aktivitaeten') {
    var joined = {}, grid = $('[data-events]'), sheetEl = $('#eventSheet'), eventSheet = A.sheet(sheetEl), opened = 0;
    var persons = function (names, max) {
      return '<span class="persons" aria-hidden="true">' + names.slice(0, max).map(function (n) { return '<span class="person person--sm">' + esc(n[0]) + '</span>'; }).join('') + '</span>';
    };
    var seatsText = function (e, i) { var n = e.people.length + (joined[i] === 'dabei' ? 1 : 0); return n >= e.seats ? 'Ausgebucht' : n + ' von ' + e.seats + ' Plätzen'; };
    var renderEvents = function () {
      grid.innerHTML = EVENTS.map(function (e, i) {
        var full = e.people.length >= e.seats && joined[i] !== 'dabei';
        var feature = i === 0;
        return '<li' + (feature ? ' class="event-feature"' : '') + '><button class="' + (feature ? 'app-hero' : 'app-card') + ' event glow-edge' + (joined[i] === 'dabei' ? ' is-joined' : '') + '" type="button" data-event="' + i + '" aria-haspopup="dialog">' +
          (feature ? '<span class="event__flag">Diese Woche besonders</span>' : '') +
          '<span class="event__date" aria-hidden="true"><span class="event__day">' + e.day + '</span>' + e.dow + ' · ' + e.month + '</span>' +
          '<span class="event__head"><span class="event__kind">' + esc(e.kind) + '<span class="visually-hidden">, ' + esc(e.date) + '</span></span><span class="event__title">' + esc(e.title) + '</span></span>' +
          (feature ? '<span class="event__text">' + esc(e.text) + '</span>' : '') +
          '<span class="event__meta"><span>' + icon('uhr') + esc(e.time.split(' ')[0]) + '</span><span>' + icon('ort') + esc(e.place) + '</span></span>' +
          '<span class="event__foot">' + persons(e.people, 4) + '<span class="event__seats">' + (joined[i] === 'dabei' ? 'Du bist dabei' : full ? 'Ausgebucht' : seatsText(e, i)) + '</span></span></button></li>';
      }).join('');
    };
    var renderSheet = function () {
      var e = EVENTS[opened], pick = joined[opened] || '';
      $('[data-event-kind]').textContent = e.kind + ' · ' + e.date;
      $('[data-event-body]').innerHTML =
        '<h2 class="t-title" id="eventTitle">' + esc(e.title) + '</h2>' +
        '<dl class="event-facts"><div><dt>' + icon('uhr') + '<span class="visually-hidden">Zeit</span></dt><dd>' + esc(e.time) + '</dd></div>' +
        '<div><dt>' + icon('ort') + '<span class="visually-hidden">Ort</span></dt><dd>' + esc(e.place) + '<span>Genaue Adresse am Vortag</span></dd></div></dl>' +
        '<p>' + esc(e.text) + '</p>' +
        '<section class="app-section" aria-labelledby="whoTitle"><div class="app-section__head"><h3 class="app-section__title" id="whoTitle">Wer dabei ist</h3><span class="app-kicker">' + seatsText(e, opened) + '</span></div>' +
          '<ul class="who">' + e.people.map(function (n) { return '<li><span class="person person--sm" aria-hidden="true">' + esc(n[0]) + '</span>' + esc(n) + (n === e.host ? '<span class="secondary"> · begleitet</span>' : '') + '</li>'; }).join('') +
          (pick === 'dabei' ? '<li><span class="person person--sm" aria-hidden="true">L</span>Du</li>' : '') + '</ul></section>' +
        '<fieldset class="rsvp"><legend class="app-section__title">Bist du dabei?</legend><div class="segmented" role="group" aria-label="Antwort">' +
          [['dabei', 'Dabei'], ['vielleicht', 'Vielleicht'], ['nicht', 'Nicht dabei']].map(function (o) {
            return '<button class="glow-edge" type="button" data-rsvp="' + o[0] + '" aria-pressed="' + (pick === o[0]) + '">' + o[1] + '</button>';
          }).join('') + '</div></fieldset>' +
        '<div data-rsvp-state role="status">' + rsvpStatus(pick) + '</div>';
    };
    function rsvpStatus(pick) {
      if (pick === 'dabei') return '<div class="status" data-role="success"><span class="status__sign" aria-hidden="true">✓</span><div><strong class="status__title">Du bist dabei</strong><p class="status__text">Am Vortag erfährst du den Ort. Absagen geht bis 24 Stunden vorher.</p></div></div>';
      if (pick === 'vielleicht') return '<div class="status" data-role="info"><span class="status__sign" aria-hidden="true">i</span><div><strong class="status__title">Vorgemerkt</strong><p class="status__text">Dein Platz ist nicht reserviert. Wir erinnern dich zwei Tage vorher.</p></div></div>';
      return '';
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-event]'); if (!b) return;
      opened = +b.dataset.event; sheetEl.setAttribute('data-sheet-return', '[data-event="' + opened + '"]');
      renderSheet(); eventSheet.open(b);
    });
    sheetEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rsvp]'); if (!b) return;
      joined[opened] = b.dataset.rsvp; renderSheet(); renderEvents();
      var again = $('[data-rsvp="' + b.dataset.rsvp + '"]', sheetEl); if (again) again.focus();
      var st = $('[data-rsvp-state] .status', sheetEl); if (st) document.dispatchEvent(new CustomEvent('elanum:status', { detail: { element: st } }));
    });
    $$('.erleben-when button').forEach(function (b) {
      b.addEventListener('click', function () { $$('.erleben-when button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
    });
    renderEvents();
  }

  /* ---------- Ankommen ---------- */
  if (screen === 'ankommen') {
    var unknown = $('[data-time-unknown]'), time = $('#birthTime');
    unknown.addEventListener('change', function () { time.disabled = unknown.checked; $('[data-time-hint]').hidden = !unknown.checked; });
    $('[data-flow]').addEventListener('submit', function (e) {
      e.preventDefault();
      var place = $('#birthPlace'), ok = !!place.value.trim();
      place.setAttribute('aria-invalid', String(!ok));
      $('[data-flow-note]').textContent = ok ? 'Gespeichert für diese Vorschau. Als Nächstes: dein Konto.' : 'Bitte gib deinen Geburtsort an.';
      if (!ok) place.focus();
    });
  }

  /* ---------- Folgt ---------- */
  if (screen === 'folgt') {
    var all = [];
    A.kosmen.forEach(function (k) { k.items.forEach(function (it) { all.push({ id: it.id, label: it.name || it.label, kosmos: k.name }); }); });
    A.more.forEach(function (m) { all.push({ id: m.id, label: m.label, kosmos: 'Menü' }); });
    var f = all.filter(function (x) { return x.id === current; })[0] || { label: 'Folgt', kosmos: '' };
    $('[data-folgt-title]').textContent = f.label;
    $('[data-folgt-kosmos]').textContent = f.kosmos;
    document.title = 'ELANUM · ' + f.label;
  }
})();
