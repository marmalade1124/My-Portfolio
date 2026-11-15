async page => {
  const base = 'http://127.0.0.1:5195';
  const assert = (condition, message) => { if (!condition) throw Error(message); };
  const projects = [
    'picolor', 'quoter', 'lapcat-website', 'the-collegium', 'okuru', 'ccprint',
    'codecraft-management', 'cpu-scheduler', 'codecraft-web', 'ccnote', 'lockr',
    'mdx-readme', 'arduino-visualizer', 'viewportlab',
  ];

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const id of projects) {
    await page.goto(`${base}/work/${id}`);
    const reel = page.locator('#desktop-screens');
    await reel.waitFor();
    const stage = reel.locator('.ed-desktop-stage');
    const frames = await stage.locator('img').evaluateAll(async images => {
      await Promise.all(images.map(image => image.decode()));
      return images.map(image => image.getAttribute('src'));
    });
    const screenCount = await reel.getByRole('button', { name: /Enlarge / }).count();
    assert(frames.length === 45 && new Set(frames).size === screenCount, `${id} needs a full grid using each gallery screen`);
    assert(screenCount >= (id === 'quoter' ? 5 : 2), `${id} needs more distinct screens`);
    const layout = await stage.evaluate(node => {
      const stageBox = node.getBoundingClientRect();
      const root = document.documentElement;
      const leadBox = document.querySelector('#overview .ed-case-lead').getBoundingClientRect();
      return {
        fullWidth: Math.abs(stageBox.left) < 2 && Math.abs(stageBox.width - root.clientWidth) < 2,
        belowDescription: stageBox.top >= leadBox.bottom,
        background: getComputedStyle(node).backgroundColor,
        overflow: root.scrollWidth > root.clientWidth,
      };
    });
    assert(layout.fullWidth && layout.belowDescription && !layout.overflow && layout.background === 'rgba(0, 0, 0, 0)', `${id} has an incorrect stage: ${JSON.stringify(layout)}`);
  }

  await page.goto(`${base}/work/quoter#preview-2`);
  const reel = page.locator('#desktop-screens');
  const camera = reel.locator('.ed-desktop-camera');
  await reel.waitFor();
  const legacyAnchor = await reel.evaluate(node => ({ top: node.getBoundingClientRect().top, offset: parseFloat(getComputedStyle(node).scrollMarginTop) }));
  assert(Math.abs(legacyAnchor.top - legacyAnchor.offset) < 2, 'A saved preview link should land on the desktop reel');
  await reel.locator('.ed-desktop-stage').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.ed-desktop-camera')?.getAnimations()[0]?.playState === 'running');
  await reel.getByRole('button', { name: 'Pause reel' }).click();
  const poses = await camera.evaluate(async node => {
    const animation = node.getAnimations()[0];
    await animation.ready;
    const state = animation.playState;
    const stage = node.parentElement.getBoundingClientRect();
    const transforms = [0, 3850, 7000, 14000].map(time => {
      animation.currentTime = time;
      return getComputedStyle(node).transform;
    });
    animation.currentTime = 3850;
    const visibleRows = [...node.children].map(row => [...row.children].filter(window => {
      const bounds = window.getBoundingClientRect();
      const width = Math.min(stage.right, bounds.right) - Math.max(stage.left, bounds.left);
      const height = Math.min(stage.bottom, bounds.bottom) - Math.max(stage.top, bounds.top);
      return width >= bounds.width / 2 && height >= bounds.height / 2;
    }).length);
    return { state, transforms, visibleRows: visibleRows.filter(count => count > 0).length, visibleWindows: visibleRows.reduce((total, count) => total + count, 0) };
  });
  assert(poses.state === 'paused' && new Set(poses.transforms.slice(0, 3)).size === 3 && poses.transforms[0] === poses.transforms[3], 'Pan should pause and return continuously to its first pose');
  assert(poses.visibleRows >= 3 && poses.visibleWindows >= 10, `Pullback needs a dense grid: ${JSON.stringify(poses)}`);
  await reel.getByRole('button', { name: 'Resume reel' }).click();
  await page.waitForFunction(() => document.querySelector('.ed-desktop-camera')?.getAnimations()[0]?.playState === 'running');
  await reel.getByRole('button', { name: /Enlarge.*batch of sample exports/i }).focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  assert(await dialog.locator('.gallery-stage img').getAttribute('src') === '/projects/quoter-many-exports.webp', 'Screen control opened the wrong gallery image');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await camera.waitFor();
  assert(await camera.evaluate(node => {
    const root = document.documentElement;
    return node.getAnimations().length === 0 && node.querySelectorAll('img').length === 1 && root.scrollWidth === root.clientWidth;
  }), 'Reduced motion or mobile width is broken');
  assert(await reel.getByRole('button', { name: 'Pause reel' }).count() === 0, 'Static preview should omit playback controls');

  await page.goto(`${base}/work/hitoshii`);
  await page.locator('#app-screens').waitFor();
  assert(await page.locator('#desktop-screens').count() === 0, 'A mobile-only app received a desktop reel');
  return `${projects.length} desktop reels below the description, dense full-width grid, pan, pause, gallery, and reduced motion passed.`;
}
