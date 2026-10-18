async page => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5174/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.querySelectorAll('#hero h1 > span')).every(el => Number(getComputedStyle(el).opacity) === 1));
  for (const width of [320, 390, 768, 900, 1024, 1280, 1518, 1920, 2560]) {
    await page.setViewportSize({ width, height: 982 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const surname = await page.locator('#hero').getByText('SALAMAT', { exact: true }).boundingBox();
    const concept = await page.locator('#hero').getByText('Concept', { exact: true }).boundingBox();
    check(surname.y + surname.height + 12 <= concept.y, `Hero surname and concept overlap at ${width}px`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
  }
  for (const reduceMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion: reduceMotion });
    for (const width of [390, 1518]) {
      await page.setViewportSize({ width, height: 982 });
      await page.locator('#work').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY));
      for (const label of ['SOFTWARE & WEB', 'HARDWARE & IOT', 'VIDEOGRAPHY & MEDIA', 'DEV TOOLS', '3D CAD BLUEPRINTS', 'ALL']) {
        const button = page.getByRole('button', { name: new RegExp(`^${label} \\(`) });
        const before = await button.boundingBox();
        const scrollBefore = await page.evaluate(() => scrollY);
        await button.click();
        const samples = await button.evaluate(el => new Promise(resolve => {
          const positions = [];
          const sample = () => {
            const box = el.getBoundingClientRect();
            positions.push({ x: box.x, y: box.y, scroll: scrollY });
            if (positions.length < 24) requestAnimationFrame(sample); else resolve(positions);
          };
          requestAnimationFrame(sample);
        }));
        check(samples.every(position => Math.abs(position.y - before.y) < 2 && Math.abs(position.x - before.x) < 2 && Math.abs(position.scroll - scrollBefore) < 2), `${label} filter moved at ${width}px (${reduceMotion})`);
      }
    }
  }
  await page.setViewportSize({ width: 1518, height: 982 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'output/playwright/hero-layout-verified.png' });
}
