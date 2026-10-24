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
    assert.equal(await page.locator('#ww-caption').isVisible(), false, 'full transcript collapsed by default');
    const stageSize = await page.locator('#ww-character-stage').boundingBox();
    assert.ok(stageSize.height <= 65, 'voice strip must use at most 65px on a phone');
    const duplicates = await page.locator('#out > div').filter({hasText: 'This place was built to shelter travellers'}).count();
    assert.equal(duplicates, 1, 'only one intro from single command');
    await page.locator('#ww-expand').click();
    assert.equal(await page.locator('#ww-expand').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#ww-caption').isVisible(), true, 'transcript available on demand');
    await page.locator('#ww-expand').click();
    assert.equal(await page.locator('#ww-caption').isVisible(), false);
    await page.locator('#ww-voice-toggle').click();
    assert.equal(await page.locator('#ww-character-stage').isVisible(), false, 'muting also removes unwanted screen clutter');
    await page.locator('#settings-toggle').click();
    await page.locator('#ww-voice-settings-toggle').click();
    assert.equal(await page.locator('#ww-voice-toggle').getAttribute('aria-pressed'), 'true');
    await page.locator('#cmd').fill('say 7'); // newly inserted east-gate topic
    await page.locator('#send').click();
    await page.locator('#ww-character-stage').waitFor({ state: 'visible' });
    await page.locator('#ww-replay').click();
    await page.locator('#out > div').filter({hasText: 'The east gate has been stubborn for years.'}).first().waitFor();
    assert.match(await page.locator('#ww-caption').textContent(), /east gate has been stubborn/);
    // A short studio recording may have ended before this interaction.
    // Stop is disabled at natural end; both states are valid.
    if (await page.locator('#ww-stop').isEnabled()) {
      await page.locator('#ww-stop').click();
    }
    await page.setViewportSize({ width: 320, height: 700 });
    const smallStage = await page.locator('#ww-character-stage').boundingBox();
    assert.ok(smallStage.height <= 65, 'voice strip remains compact at 320px wide');
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(horizontalOverflow <= 2, 'mobile stage must not force horizontal scrolling');

    // Exercise the remaining recorded conversations through real command submissions.
    // Seed only room/material fixtures; dialogue, rewards and audio use production code.
    const heard = new Set();
    await page.evaluate(() => {
      window.__wwPlayed = [];
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function(...args) {
        this.addEventListener('playing', () => window.__wwPlayed.push(this.currentSrc), {once:true});
        return play.apply(this,args);
      };
    });
    async function command(text, expected) {
      await page.locator('#cmd').fill(text);
      await page.locator('#send').click();
      if (expected) {
        await page.waitForFunction(file => window.__wwPlayed.some(url => url.endsWith('/'+file)),expected,{timeout:20000}).catch(async error=>{console.error('Recording missing',text,expected,await page.locator('#out').innerText());throw error;});
        heard.add(expected);
        await page.locator('#ww-stop').click().catch(()=>{});
      }
    }
    async function fixture(room,materials={}) {
      await page.evaluate(({room,materials}) => {
        window.game.cur_room=room;
        const mats=window.game._p3.get('mats');
        for(const [name,count] of Object.entries(materials))mats.set(name,count);
      },{room,materials});
    }

    async function topic(action,file) {
      const choice=await page.evaluate(action=>Array.from(window.game._p6.get('dialog').get('options').toJs()).findIndex(x=>x[1]===action)+1,action);
      assert.ok(choice>0,'dialogue action available: '+action);
      await command('say '+choice,file);
    }
    await fixture('sanctum',{herb:0});
    await page.evaluate(()=>{window.game._ww_caretaker_greeted=false;});
    await command('talk caretaker','VO001.mp3');
    await topic('ct_gate','VO002.mp3');
    await topic('ct_offer_quest','VO003.mp3');
    await command('accept heal_grove');
    await fixture('sanctum',{herb:2});
    await command('turnin heal_grove','VO004.mp3');
    await fixture('wilds_camp',{ore:0});
    await command('talk ranger','VO005.mp3');
    await topic('rg_offer_quest','VO007.mp3');
    await command('accept mine_matters');
    await command('talk ranger');
    await topic('rg_mine_tips','VO006.mp3');
    await fixture('wilds_camp',{ore:2});
    await command('turnin mine_matters','VO008.mp3');
    await fixture('wilds_post',{fish:2});
    await command('talk trader','VO009.mp3');
    await command('say 1','VO010.mp3');
    await command('say 2','VO011.mp3');
    await command('accept angler_aid');
    await command('turnin angler_aid','VO012.mp3');
    await fixture('wilds_hut',{glowcap:0});
    await command('talk hermit','VO013.mp3');
    await command('say 2','VO015.mp3');
    await command('accept hermit_glow');
    await command('talk hermit');
    // The accepted-quest menu provides the glowcap location topic.
    const tips=await page.evaluate(()=>Array.from(window.game._p6.get('dialog').get('options').toJs()).findIndex(x=>x[1]==='hm_glow_tips')+1);
    assert.ok(tips>0,'glowcap topic is available');
    await command('say '+tips,'VO014.mp3');
    await fixture('wilds_hut',{glowcap:3});
    await command('turnin hermit_glow','VO016.mp3');
    await fixture('wilds_tower',{coal:1});
    await command('talk watcher','VO017.mp3');
    await command('say 1','VO018.mp3');
    await command('accept tower_riddle');
    await command('turnin tower_riddle','VO019.mp3');
    await command('talk watcher','VO020.mp3');
    const gold=await page.evaluate(()=>window.game._p3.get('gold'));
    await command('turnin tower_riddle');
    assert.equal(await page.evaluate(()=>window.game._p3.get('gold')),gold,'no duplicate quest reward');
    assert.equal(heard.size,20,'all twenty clips reached through game commands');
    await command('save');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.game && window.pyscript_ready===true,{timeout:120000});
    await fixture('wilds_tower');
    assert.equal(await page.evaluate(()=>window.game._p6.get('quests').get('tower_riddle').get('state')),'turned_in','watcher quest persists across save/reload');
    console.log('PASS: all ten newly integrated recordings play through real dialogue and quest commands');

    assert.deepEqual(failures, [], 'no uncaught page errors');
    console.log('PASS: live Chromium voice + gate + mobile + playback-control journey');
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err.stack || err); process.exitCode = 1; });
