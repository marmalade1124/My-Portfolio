async page => {
  const base = 'http://127.0.0.1:5195';
  const bundle = '**/assets/index-*.js';
  const fallback = '[data-static-fallback]';
  const assert = (value, message) => { if (!value) throw Error(message); };
  await page.bringToFront();
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  for (const [path, reload, colorScheme] of [['/', false, 'light'], ['/', true, 'light'], ['/work/hitoshii', false, 'dark'], ['/fil/about', false, 'dark']]) {
    await page.emulateMedia({ colorScheme });
    let release;
    const hold = new Promise(resolve => { release = resolve; });
    const pauseBundle = route => hold.then(() => route.continue());
    await page.route(bundle, pauseBundle);
    try {
      if (reload) await page.reload({ waitUntil: 'commit' });
      else await page.goto(base + path, { waitUntil: 'commit' });
      await page.locator(fallback).waitFor({ state: 'attached' });
      const firstPaint = await page.locator(fallback).evaluate(async node => {
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return [getComputedStyle(node).display, getComputedStyle(document.documentElement).backgroundColor];
      });
      const paper = colorScheme === 'dark' ? 'rgb(24, 24, 23)' : 'rgb(244, 244, 242)';
      assert(firstPaint.join('|') === `none|${paper}`, `Wrong ${colorScheme} startup frame for ${path}: ${firstPaint}`);
      release();
      await page.locator('.ed-route > main').waitFor();
      assert(await page.locator(fallback).count() === 0, `Stale fallback on ${path}`);
      assert(await page.locator('html[data-portfolio-starting]').count() === 0, `Startup state remained on ${path}`);
    } finally {
      release();
      await page.unroute(bundle, pauseBundle);
    }
  }

  await page.route(bundle, route => route.abort());
  try {
    await page.goto(base + '/');
    await page.locator(fallback).waitFor({ state: 'visible' });
  } finally {
    await page.unroute(bundle);
  }

  const context = await page.context().browser().newContext({ javaScriptEnabled: false });
  try {
    const plain = await context.newPage();
    await plain.goto(base + '/writing/keeping-layouts-steady');
    await plain.locator(fallback).getByRole('heading', { name: 'Keeping layouts steady' }).waitFor();
  } finally {
    await context.close();
  }
  return 'Startup paint, refresh, failed bundle, and JavaScript-disabled fallback passed.';
}
