async page => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5174/');
  await page.getByRole('heading', { name: 'PiColor 3.14', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Open PiColor 3.14 gallery', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'PiColor 3.14 gallery', exact: true });
  check(await dialog.getByRole('link', { name: 'Website', exact: true }).getAttribute('href') === 'https://pi-color-studio.vercel.app/', 'Windows app should link to its website');
  const captions = [
    'Native app render — palette studio, semantic color roles, and CSS/JSON output',
    'Native app render — HSV color wheel, brightness, and selected-role editing',
    'Native app render — interface preview and pair-specific contrast checks',
    'Native app render — local library settings, backup, and recovery tools',
    '3.14 public website — Windows app introduction and download',
  ];
  for (let index = 0; index < captions.length; index++) {
    await dialog.getByRole('img', { name: captions[index], exact: true }).evaluate(img => img.decode());
    if (index < captions.length - 1) await page.keyboard.press('ArrowRight');
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  await page.getByRole('button', { name: /^DEV TOOLS/ }).click();
  check(await page.getByRole('heading', { name: 'PiColor 3.14', exact: true }).isVisible(), 'PiColor missing from developer tools');
  await page.getByRole('button', { name: 'Index View', exact: true }).click();
  check(await page.getByRole('link', { name: 'Website', exact: true }).getAttribute('href') === 'https://pi-color-studio.vercel.app/', 'Index website link is incorrect');
  await page.getByRole('button', { name: 'Grid View', exact: true }).click();
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByRole('button', { name: 'Open PiColor 3.14 gallery', exact: true }).click();
    const box = await page.getByRole('button', { name: 'Close modal', exact: true }).boundingBox();
    check(box && box.x >= 0 && box.x + box.width <= width, `Close clipped at ${width}px`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Gallery causes horizontal overflow');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Open PiColor 3.14 gallery', exact: true }).click();
  await dialog.getByRole('img', { name: captions[0], exact: true }).evaluate(img => img.decode());
}
