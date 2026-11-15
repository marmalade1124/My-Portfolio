async page => {
  const assert = (value, message) => { if (!value) throw Error(message); };
  const base = 'http://127.0.0.1:5195';
  await page.bringToFront();
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
  const inkResponse = page.waitForResponse(/editorial-ink[^/]*\.webp$/);
  await page.reload();
  await (await inkResponse).finished();
  const toggle = page.getByRole('button', { name: 'Dark mode' });
  assert(await page.getByRole('link', { name: 'English', exact: true }).textContent() === 'EN', 'Missing EN pill');
  assert(await page.getByRole('link', { name: 'Filipino', exact: true }).count() === 0, 'FIL still in the header');
  await toggle.evaluate(button => Promise.all(button.getAnimations().map(animation => animation.finished)));
  await page.evaluate(() => {
    const decode = HTMLImageElement.prototype.decode;
    const gate = new Promise(resolve => { window.releaseInkDecode = resolve; });
    HTMLImageElement.prototype.decode = function () {
      const ready = decode.call(this);
      if (!this.src.startsWith('blob:')) return ready;
      HTMLImageElement.prototype.decode = decode;
      return ready.then(() => gate);
    };
  });

  for (const mode of ['dark', 'light']) {
    const origin = await toggle.boundingBox();
    await toggle.click({ position: { x: 12, y: 14 } });
    if (mode === 'dark') {
      const layer = page.locator('.ed-ink-layer[data-theme=light]');
      await layer.waitFor();
      assert(await layer.evaluate(node => getComputedStyle(node).maskImage === 'none' && node.getAnimations().length === 0),
        'The outgoing page was masked before the texture decoded');
      await page.evaluate(() => { window.releaseInkDecode(); delete window.releaseInkDecode; });
    }
    await page.waitForFunction(() => document.getAnimations().some(animation => animation.animationName === 'ed-ink-bleed'));
    const mask = await page.evaluate(() => {
      const layer = document.querySelector('.ed-ink-layer');
      const style = getComputedStyle(layer);
      const [, left, top, width] = layer.style.getPropertyValue('--ed-ink-mask').match(/\) (-?[\d.]+)px (-?[\d.]+)px \/ ([\d.]+)px/) ?? [];
      const scale = Number(width) / 900;
      return {
        url: style.maskImage, x: Number(left) + 690 * scale, y: Number(top) + 90 * scale,
        outgoingTheme: layer.dataset.theme, inert: layer.inert, hasDuplicateIds: Boolean(layer.querySelector('[id]')),
      };
    });
    assert(mask.url.includes('blob:'), `Missing mask in ${mode}`);
    assert(mask.outgoingTheme !== mode && mask.inert && !mask.hasDuplicateIds, 'Ink layer changed the live theme or duplicated controls');
    assert(Math.abs(mask.x - origin.x - 12) < 2 && Math.abs(mask.y - origin.y - 14) < 2,
      `Ink origin (${mask.x}, ${mask.y}) moved away from the ${mode} click (${origin.x + 12}, ${origin.y + 14})`);
    await page.waitForFunction(mode => document.documentElement.dataset.theme === mode && !document.documentElement.hasAttribute('data-ed-ink'), mode);
    assert(await toggle.getAttribute('aria-pressed') === String(mode === 'dark'), `Wrong toggle state for ${mode}`);
  }

  for (const [mode, delta] of [['dark', 680], ['light', -680]]) {
    await toggle.click();
    await page.waitForFunction(() => document.getAnimations().some(animation => animation.animationName === 'ed-ink-bleed'));
    await page.evaluate(() => {
      window.inkScrollFrame = new Promise(resolve => {
        window.addEventListener('scroll', () => requestAnimationFrame(() => {
          const layer = document.querySelector('.ed-ink-layer');
          resolve({
            offset: scrollY,
            inkOffset: layer?.scrollTop,
            inkRunning: layer?.getAnimations().some(animation => animation.animationName === 'ed-ink-bleed' && animation.playState === 'running'),
            layerTop: layer?.querySelector('[data-ink-id=projects]').getBoundingClientRect().top,
            liveTop: document.getElementById('projects').getBoundingClientRect().top,
          });
        }), { once: true });
      });
    });
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, delta);
    const offset = mode === 'dark' ? 680 : 0;
    await page.waitForFunction(offset => scrollY === offset, offset);
    const frame = await page.evaluate(() => window.inkScrollFrame);
    assert(frame.offset === offset && frame.inkOffset === offset && frame.inkRunning && Math.abs(frame.layerTop - frame.liveTop) < 2,
      `Ink lost alignment or stopped on the first ${mode} scroll frame: ${JSON.stringify(frame)}`);
    assert(await toggle.getAttribute('aria-pressed') === String(mode === 'dark'), 'Scrolling discarded the chosen theme');
    await page.waitForFunction(() => !document.querySelector('.ed-ink-layer'));
    assert(await page.evaluate(() => scrollY) === offset, 'Ending the reveal moved the page');
  }

  const replayed = await toggle.evaluate(button => {
    button.click();
    button.click();
    return document.documentElement.hasAttribute('data-ed-ink');
  });
  assert(!replayed, 'A second click replayed a reveal before the first mask was ready');
  assert(await toggle.getAttribute('aria-pressed') === 'false', 'Rapid toggles lost the last selection');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await toggle.focus();
  await page.keyboard.press('Space');
  assert(await toggle.getAttribute('aria-pressed') === 'true', 'Keyboard toggle failed');
  assert(await page.locator('html[data-ed-ink]').count() === 0, 'Ink animated with reduced motion');
  await page.reload();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await page.waitForURL('**/about');
  assert(await toggle.getAttribute('aria-pressed') === 'true', 'Theme reset on navigation');
  assert(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme) === 'dark', 'Native controls stayed light');

  await page.goto(`${base}/work/hitoshii`);
  await page.getByRole('button', { name: 'Enlarge preview 1' }).click();
  const gallery = page.getByRole('dialog');
  await gallery.waitFor();
  assert(await gallery.locator('.gallery-panel').evaluate(el => getComputedStyle(el).backgroundColor) === 'rgb(24, 24, 23)', 'Gallery stayed light');
  await page.keyboard.press('Escape');
  await gallery.waitFor({ state: 'hidden' });

  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto(`${base}/fil/about`);
  const en = page.getByRole('link', { name: 'English', exact: true });
  const languagePosition = await en.boundingBox();
  assert(languagePosition && languagePosition.x + languagePosition.width <= 320, 'EN spills out of the mobile header');
  await en.click();
  await page.waitForURL('**/about');
  assert(await page.locator('html').getAttribute('lang') === 'en', 'EN did not return to the English page');

  await page.route(/editorial-ink[^/]*\.webp$/, route => route.abort());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await toggle.click();
  await page.waitForFunction(() => document.getAnimations().some(animation => animation.animationName === 'ed-ink-fallback'));
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light' && !document.documentElement.hasAttribute('data-ed-ink'));
  await page.unroute(/editorial-ink[^/]*\.webp$/);

  const fallback = await page.context().browser().newContext({ reducedMotion: 'no-preference', colorScheme: 'light' });
  try {
    await fallback.addInitScript(() => Object.defineProperty(Document.prototype, 'startViewTransition', { value: undefined }));
    const oldBrowser = await fallback.newPage();
    await oldBrowser.goto(base);
    await oldBrowser.getByRole('button', { name: 'Dark mode' }).click();
    await oldBrowser.locator('html[data-theme=dark][data-ed-ink]').waitFor({ state:'attached' });
    await oldBrowser.locator('.ed-ink-layer').waitFor({ state:'detached' });
  } finally {
    await fallback.close();
  }
  await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
  return 'Ink in both directions, live alignment while scrolling, rapid and keyboard toggles, reduced motion, persistence, mobile language, gallery and fallback passed.';
}
