/* Screenshots für die Übersicht im README.
   Vorher im Repository einen Server starten:  python3 -m http.server 4173
   Dann:  node tools/screenshots.js
   Braucht Playwright (npm i -D playwright oder PLAYWRIGHT=/pfad/zu/playwright).
   Einstieg nach dem Auftritt, das Resonanzrad ohne Bewegung (fertig aufgebaut). */
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const BASE = process.env.ATLAS_URL || 'http://127.0.0.1:4173/';
const OUT = path.join(__dirname, '..', 'docs', 'screenshots');

(async () => {
  const browser = await chromium.launch();
  /* Einstieg mit Bewegung, nach dem Auftritt aufgenommen. */
  const hero = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await hero.goto(BASE, { waitUntil: 'networkidle' });
  await hero.waitForTimeout(3000);
  await hero.screenshot({ path: path.join(OUT, 'atlas-desktop.png') });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await desktop.goto(BASE, { waitUntil: 'networkidle' });
  const wheel = desktop.locator('#resonanzrad .rad');
  await wheel.scrollIntoViewIfNeeded();
  await desktop.waitForTimeout(400);
  await wheel.screenshot({ path: path.join(OUT, 'atlas-resonanzrad.png') });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(3000);
  await mobile.screenshot({ path: path.join(OUT, 'atlas-mobil.png') });

  await browser.close();
  console.log('geschrieben: ' + OUT);
})();
