// Real Chromium integration test: gameplay command -> recorded dialogue -> controls.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const failures = [];
  page.on('pageerror', e => failures.push(e.message));
  try {
    const baseUrl = process.env.WW_BASE_URL || 'http://127.0.0.1:8000';
    await page.goto(baseUrl.replace(/\/$/, '') + '/index.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.pyscript_ready === true, { timeout: 120000 });
    assert.equal(await page.locator('#ww-character-stage').isVisible(), false, 'stage hidden before speaking');
    await page.locator('#cmd').fill('talk caretaker');
    await page.locator('#send').click();
    await page.locator('#ww-character-stage').waitFor({ state: 'visible', timeout: 20000 });
    assert.equal((await page.locator('#ww-speaker').textContent()).trim(), 'Caretaker');
    assert.match(await page.locator('#ww-caption').textContent(), /This place was built to shelter travellers/);
    assert.equal(await page.locator('#ww-portrait svg').count(), 1);
    const duplicates = await page.locator('#out > div').filter({hasText: 'This place was built to shelter travellers'}).count();
    assert.equal(duplicates, 1, 'only one intro from single command');
    await page.locator('#ww-voice-toggle').click();
    assert.equal(await page.locator('#ww-voice-toggle').getAttribute('aria-pressed'), 'false');
    await page.locator('#settings-toggle').click();
    await page.locator('#ww-voice-settings-toggle').click();
    assert.equal(await page.locator('#ww-voice-toggle').getAttribute('aria-pressed'), 'true');
    await page.locator('#ww-replay').click();
    await page.locator('#cmd').fill('say 7'); // newly inserted east-gate topic
    await page.locator('#send').click();
    await page.getByText('The east gate has been stubborn for years.', { exact: false }).first().waitFor();
    assert.match(await page.locator('#ww-caption').textContent(), /east gate has been stubborn/);
    await page.locator('#ww-stop').click();
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(horizontalOverflow <= 2, 'mobile stage must not force horizontal scrolling');
    assert.deepEqual(failures, [], 'no uncaught page errors');
    console.log('PASS: live Chromium voice + gate + mobile + playback-control journey');
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.stack || err); process.exitCode = 1; });
