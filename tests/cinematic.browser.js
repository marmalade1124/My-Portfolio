async page => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5174/');
  await page.locator('.cinema-enabled').waitFor();
  for (const [progress, chapter] of [[0, 0], [0.5, 1], [0.95, 2], [0.5, 1]]) {
    await page.locator('.cinema').evaluate((el, fraction) => {
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * fraction);
    }, progress);
    await page.waitForFunction(index => Number(getComputedStyle(document.querySelectorAll('.cinema-scene')[index]).opacity) > 0.99, chapter);
    const image = page.locator('.cinema-scene').nth(chapter).locator('img');
    await image.evaluate(img => img.decode());
  }
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desktop horizontal overflow');
  await page.screenshot({ path: 'output/cinematic-desktop.png' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.cinema-enabled').waitFor({ state: 'detached' });
  check(await page.locator('.cinema-scene').evaluateAll(scenes => scenes.every(scene => {
    const style = getComputedStyle(scene);
    return style.position !== 'absolute' && style.visibility === 'visible' && Number(style.opacity) === 1;
  })), 'Reduced-motion chapters must remain visible in normal document flow');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator('.cinema-enabled').waitFor({ state: 'detached' });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    check(await page.locator('.cinema-scene').evaluateAll(scenes => scenes.every(scene => getComputedStyle(scene).position !== 'absolute')), 'Small screens must not pin the story');
  }
  await page.setViewportSize({ width: 1440, height: 650 });
  await page.locator('.cinema-enabled').waitFor({ state: 'detached' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.cinema').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 64));
  await page.screenshot({ path: 'output/cinematic-mobile.png' });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('.cinema-enabled').waitFor();
  await page.locator('.cinema-topline a').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => location.hash === '#work');
  await page.getByRole('button', { name: 'Inspect Gallery', exact: true }).first().click();
  await page.getByRole('button', { name: 'Next image', exact: true }).click();
  check(await page.getByText('Mobile camera interface — public demo with a sample scene', { exact: true }).isVisible(), 'TwentyFour gallery stopped working');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Close modal', exact: true }).waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'View & download my resume', exact: true }).click();
  check(await page.getByRole('img', { name: /October portfolio resume — page/ }).count() === 13, 'Resume pages missing');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Close resume viewer', exact: true }).waitFor({ state: 'detached' });
}
