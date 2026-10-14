/* Screenshots für die Übersicht im README.
   Vorher im Repository einen Server starten:  python3 tools/serve.py
   Dann:  node tools/screenshots.js
   Braucht Playwright (npm i -D playwright oder PLAYWRIGHT=/pfad/zu/playwright).
   Einstieg nach Auftritt und Zeichenaufbau, das Resonanzrad ohne Bewegung (fertig aufgebaut),
   dazu die App: Heute auf dem Telefon und am Desktop, Entdecken auf dem Telefon. */
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const BASE = process.env.ATLAS_URL || 'http://127.0.0.1:4173/';
const OUT = path.join(__dirname, '..', 'docs', 'screenshots');

(async () => {
  const browser = await chromium.launch();
  /* Einstieg mit Bewegung, nach dem Auftritt aufgenommen. */
  const hero = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await hero.goto(BASE, { waitUntil: 'networkidle' });
  await hero.waitForTimeout(4500);
  await hero.screenshot({ path: path.join(OUT, 'atlas-desktop.png') });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await desktop.goto(BASE, { waitUntil: 'networkidle' });
  const wheel = desktop.locator('#resonanzrad .rad');
  await wheel.scrollIntoViewIfNeeded();
  await desktop.waitForTimeout(400);
  await wheel.screenshot({ path: path.join(OUT, 'atlas-resonanzrad.png') });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(4500);
  await mobile.screenshot({ path: path.join(OUT, 'atlas-mobil.png') });

  /* App-Screens, ohne Bewegung und mit Schweizer Datumsformat. */
  const app = async (file, out, width, height, scale) => {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale, reducedMotion: 'reduce', locale: 'de-CH' });
    await page.goto(BASE + 'components/app/' + file, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, out) });
  };
  await app('heute.html', 'app-telefon.png', 390, 844, 2);
  await app('entdecken.html', 'app-entdecken-telefon.png', 390, 844, 2);
  await app('heute.html', 'app-desktop.png', 1440, 900, 1);

  await browser.close();
  console.log('geschrieben: ' + OUT);
})();
