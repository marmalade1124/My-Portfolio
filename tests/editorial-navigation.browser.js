async page => {
  const base = 'http://127.0.0.1:5193';
  const assert = (condition, message) => { if (!condition) throw Error(message); };
  const go = async path => {
    const response = await page.goto(base + path);
    await page.locator('.ed-site').waitFor();
    return response;
  };
  const main = page.locator('.ed-route > main');
  await page.bringToFront();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await go('/');
  await page.reload({ waitUntil: 'domcontentloaded' });
  for (const target of ['/about', '/media', '/', '/about', '/']) {
    const link = target === '/' ? page.getByRole('link', { name: 'Raziel Salamat', exact: true }) : page.locator(`header a[href="${target}"]`);
    const exitDuration = await link.evaluate(link => {
      const outgoing = document.querySelector('main');
      link.click();
      return outgoing.getAnimations().find(animation => !animation.animationName)?.effect.getTiming().duration;
    });
    assert(exitDuration === 160, `Missing outgoing fade for ${target}`);
    await page.waitForURL(base + target);
    await page.waitForFunction(() => document.querySelector('.ed-route > main')?.id === 'content' && document.activeElement?.id === 'content');
    assert(await main.count() === 1, 'More than one active route');
    assert(await main.evaluate(node => getComputedStyle(node).animationName) === 'ed-page-fade', `Missing incoming fade for ${target}`);
  }

  await page.evaluate(() => scrollTo({ top: 1800, behavior: 'instant' }));
  await page.locator('.ed-card-link[href="/work/hitoshii"]').evaluate(link => link.click());
  await page.locator('.ed-project').waitFor();
  await page.goBack();
  await page.locator('.ed-hero').waitFor();
  assert(await page.evaluate(() => scrollY) === 1800, 'Back did not restore the previous scroll');
  await page.goForward();
  await page.locator('.ed-project').waitFor();
  assert(await main.count() === 1, 'Forward left stale content behind');
  await page.locator('.ed-reel-stage').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Pause reel' }).waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Pause reel' }).waitFor({ state: 'detached' });
  assert(await page.locator('.ed-reel-grid').evaluate(grid => grid.getAnimations({ subtree: true }).length) === 0, 'Reel ignored reduced motion');

  await go('/');
  await page.locator('header a[href="/about"]').press('Enter');
  await page.getByRole('button', { name: 'Enlarge portrait' }).click();
  await page.getByRole('button', { name: 'Zoom in' }).click();
  await page.getByRole('button', { name: 'Zoom out' }).waitFor();
  await page.goBack();
  await page.locator('.ed-hero').waitFor();
  assert(await page.getByRole('dialog').count() === 0 && await page.evaluate(() => document.body.style.overflow === ''), 'Back kept the old dialog or scroll lock');
  await page.goForward();
  await page.locator('.ed-about').waitFor();
  assert(await page.getByRole('dialog').count() === 0, 'Forward reopened the old dialog');

  await go('/work/picolor#preview-4');
  const rail = page.getByRole('navigation', { name: 'On this page' });
  await rail.getByRole('button').press('Enter');
  await rail.getByRole('link', { name: 'Palette demo' }).click();
  await page.waitForURL('**#palette-demo');
  await page.goBack();
  await page.waitForFunction(() => {
    const reel = document.querySelector('#desktop-screens');
    return reel && location.hash === '#preview-4' &&
      Math.abs(reel.getBoundingClientRect().top - parseFloat(getComputedStyle(reel).scrollMarginTop)) < 2;
  });

  const missing = await go('/missing-editorial-regression');
  assert(missing.status() === 404, 'Unknown page returned a success response');
  await page.getByRole('link', { name: 'Back to portfolio' }).click();
  await page.locator('.ed-hero').waitFor();

  return 'Editorial navigation, history, galleries, deep links and reduced motion passed.';
}
