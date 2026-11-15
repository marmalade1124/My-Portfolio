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

  for (const mode of ['dark', 'light']) {
    const origin = await toggle.boundingBox();
    await toggle.click({ position: { x: 12, y: 14 } });
    await page.waitForFunction(() => document.getAnimations().some(animation => animation.animationName === 'ed-ink-bleed'));
    const mask = await page.evaluate(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root, '::view-transition-new(root)');
      const [, left, top, width] = root.style.getPropertyValue('--ed-ink-mask').match(/\) (-?[\d.]+)px (-?[\d.]+)px \/ ([\d.]+)px/) ?? [];
      const scale = Number(width) / 900;
      return {
        url: style.maskImage, x: Number(left) + 690 * scale, y: Number(top) + 90 * scale,
      };
    });
    assert(mask.url.includes('blob:'), `Missing mask in ${mode}`);
    assert(Math.abs(mask.x - origin.x - 12) < 2 && Math.abs(mask.y - origin.y - 14) < 2,
      `Ink origin (${mask.x}, ${mask.y}) moved away from the ${mode} click (${origin.x + 12}, ${origin.y + 14})`);
    await page.waitForFunction(mode => document.documentElement.dataset.theme === mode && !document.documentElement.hasAttribute('data-ed-ink'), mode);
    assert(await toggle.getAttribute('aria-pressed') === String(mode === 'dark'), `Wrong toggle state for ${mode}`);
  }

  await toggle.evaluate(button => { button.click(); button.click(); });
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-ed-ink'));
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
    assert(await oldBrowser.locator('html[data-theme=dark]:not([data-ed-ink])').count() === 1, 'Theme toggle requires View Transitions');
  } finally {
    await fallback.close();
  }
  await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
  return 'Ink in both directions, rapid and keyboard toggles, reduced motion, persistence, mobile language, gallery and API fallback passed.';
}
