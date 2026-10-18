async page => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:5174/');
  check(await page.locator('main > section').evaluateAll(sections => sections[0].id === 'hero' && sections[1].id === 'work'), 'Work must immediately follow hero');
  check(await page.locator('[data-project]').count() === 3, 'Expected three flagship projects');
  check(await page.locator('[data-project]').evaluateAll(cards => cards.map(c => c.dataset.project).join() === 'twentyfour,picolor,cad-enclosure'), 'Incorrect flagship selection');
  check(await page.locator('#hero').getByText(/Expected graduation 2027/).isVisible(), 'Student status missing');
  const primary = page.getByRole('link', { name: 'View projects', exact: false });
  check((await primary.boundingBox()).y < 500, 'Primary action should be above the fold');
  await primary.focus();
  await page.keyboard.press('Enter');
  check(await page.evaluate(() => location.hash === '#work'), 'Project shortcut failed');
  for (const id of ['twentyfour', 'picolor', 'cad-enclosure']) {
    const card = page.locator(`[data-project="${id}"]`);
    const summary = card.locator('summary');
    await summary.focus(); await page.keyboard.press('Enter');
    check(await card.locator('details').getAttribute('open') !== null, 'Keyboard case study failed');
    check(await card.getByText('Scope & limitations', { exact: true }).isVisible(), 'Limitations missing');
    for (const image of await card.locator('.case-evidence').all()) {
      await image.scrollIntoViewIfNeeded(); await image.evaluate(img => img.decode());
    }
    await summary.focus(); await page.keyboard.press('Enter');
  }
  await page.getByRole('button', { name: /Explore all 29 works/ }).click();
  check(await page.locator('[data-project]').count() === 29, 'Archive does not show all projects');
  await page.getByRole('button', { name: /Show Featured/ }).click();
  await page.waitForFunction(() => document.querySelectorAll('[data-project]').length === 3);
  await page.getByRole('button', { name: /^DEV TOOLS/ }).click();
  check(await page.locator('[data-project]').count() === 5, 'Developer-tools filter failed');
  await page.getByRole('button', { name: /^ALL \(/ }).click();
  for (const [kind, title, count] of [['resume', 'Resume', 2], ['portfolio', 'Portfolio PDF', 15]]) {
    const opener = page.getByRole('button', { name: `View ${title.toLowerCase()}`, exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: `${title} viewer`, exact: true });
    check(await dialog.locator('img').count() === count, 'Incorrect document page count');
    const first = dialog.locator('img').first(); await first.scrollIntoViewIfNeeded(); await first.evaluate(img => img.decode());
    const last = dialog.locator('img').last(); await last.scrollIntoViewIfNeeded(); await last.evaluate(img => img.decode());
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      check(await dialog.evaluate(el => el.contains(document.activeElement)), 'Document focus escaped');
    }
    const response = await page.request.get(`http://127.0.0.1:5174/${kind}.pdf`);
    check(response.ok() && (await response.body()).subarray(0, 5).toString() === '%PDF-', 'Download is not a PDF');
    check(await dialog.getByRole('link', { name: 'Download', exact: true }).getAttribute('download') === `Raziel_Salamat_${kind === 'resume' ? 'Resume' : 'Portfolio'}.pdf`, 'Incorrect filename');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    check(await opener.evaluate(el => el === document.activeElement), 'Document opener lost focus');
  }
  // An unavailable preview must retain a working route to the original document.
  await page.route('**/resume-preview-01.jpg', route => route.abort());
  await page.getByRole('button', { name: 'View resume', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'preview could not load' }).waitFor();
  check(await page.getByRole('link', { name: 'Open the PDF instead' }).getAttribute('href') === '/resume.pdf', 'Preview error has no PDF fallback');
  await page.keyboard.press('Escape');
  await page.unroute('**/resume-preview-01.jpg');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflow at ${width}`);
    await page.getByRole('button', { name: 'View portfolio pdf', exact: true }).click();
    const close = page.getByRole('button', { name: 'Close portfolio pdf viewer', exact: true });
    const box = await close.boundingBox();
    check(box && box.x >= 0 && box.x + box.width <= width, `Document close clipped at ${width}`);
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#hero').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'output/playwright/portfolio-final-mobile.png' });
  console.log('Portfolio journey passed: featured work, keyboard case studies, archive/filter, PDFs, preview failure, focus, 320/390/768/1440 widths.');
}
