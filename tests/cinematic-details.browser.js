async page => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5174/');
  check(await page.locator('.product-frame').count() === 3, 'Expected capture, anticipation and reveal frames');
  await page.locator('.product-frames img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  await page.getByRole('button', { name: 'Open TwentyFour gallery', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'TwentyFour gallery', exact: true });
  const image = dialog.getByRole('img', { name: 'TwentyFour — live web app landing page', exact: true });
  const widths = await image.evaluate(img => new Promise(resolve => {
    const samples = [];
    const sample = () => {
      samples.push(img.getBoundingClientRect().width);
      if (samples.length < 35) requestAnimationFrame(sample); else resolve(samples);
    };
    requestAnimationFrame(sample);
  }));
  check(Math.max(...widths) - Math.min(...widths) > 5, 'Cover image should expand into the gallery');
  const links = await dialog.locator('a[href],button:not([disabled])').count();
  for (let index = 0; index <= links; index++) {
    await page.keyboard.press('Tab');
    check(await dialog.evaluate(el => el.contains(document.activeElement)), 'Gallery focus escaped');
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  check(await page.getByRole('button', { name: 'Open TwentyFour gallery', exact: true }).evaluate(el => el === document.activeElement), 'Focus should return to the image button');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Open TwentyFour gallery', exact: true }).focus();
  await page.keyboard.press('Enter');
  await dialog.waitFor();
  check(await image.evaluate(img => getComputedStyle(img).transform === 'none'), 'Reduced-motion image should not move');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  check(await page.locator('.product-screen').evaluateAll(frames => frames.every(el => getComputedStyle(el).opacity === '1')), 'Reduced-motion product screens must stay visible');

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflow at ${width}px`);
    await page.getByRole('button', { name: 'Open TwentyFour gallery', exact: true }).click();
    const close = page.getByRole('button', { name: 'Close modal', exact: true });
    const box = await close.boundingBox();
    check(box && box.x >= 0 && box.x + box.width <= width, `Close control clipped at ${width}px`);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
  }
  const story = page.getByRole('region', { name: 'TwentyFour guest experience, three steps' });
  await story.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('.product-frames').scrollLeft > 0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  check(await page.getByRole('link', { name: 'razielrenz@gmail.com', exact: true }).isVisible(), 'Contact email should remain available');
  check(await page.locator('.contact-signature').evaluate(el => getComputedStyle(el).opacity === '1'), 'Reduced-motion signature must remain visible');
}
