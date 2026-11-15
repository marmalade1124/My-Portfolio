async page => {
  const base = 'http://127.0.0.1:5195';
  const bundle = '**/assets/index-*.js';
  const fallback = '[data-static-fallback]';
  const assert = (value, message) => { if (!value) throw Error(message); };
  await page.bringToFront();
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });

  for (const [path, reload] of [['/', false], ['/', true], ['/work/hitoshii', false], ['/fil/about', false]]) {
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
      assert(firstPaint.join('|') === 'none|rgb(244, 244, 242)', `Wrong startup frame for ${path}: ${firstPaint}`);
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
