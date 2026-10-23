async page => {
  const check = (condition,message)=>{if(!condition)throw new Error(message)};
  await page.goto('http://127.0.0.1:5180/');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900});
  await page.getByRole('region',{name:'Selected project gallery'}).hover();
  await page.mouse.wheel(0,180);
  await page.waitForFunction(()=>document.querySelector('.studio-caption').textContent.includes('PiColor'));
  const before=await page.locator('.studio-caption').innerText();
  await page.mouse.move(720,440); await page.mouse.down(); await page.mouse.move(600,440,{steps:10}); await page.mouse.up();
  await page.waitForFunction(previous=>document.querySelector('.studio-caption').innerText!==previous,before);
  check(await page.getByRole('dialog').count()===0,'Drag accidentally opened project');
  const transform=await page.locator('.studio-project-active').evaluate(el=>getComputedStyle(el).transitionDuration);
  check(transform.includes('0.7s'),'Pointer gallery should retain spatial transition');
  await page.emulateMedia({reducedMotion:'reduce'});
  check(await page.locator('.studio-project-active').evaluate(el=>getComputedStyle(el).transitionDuration)==='0s','Reduced motion did not remove movement');
  await page.getByRole('button',{name:'Menu',exact:false}).click();
  const dialog=page.getByRole('dialog',{name:'Navigation',exact:true});
  await page.keyboard.press('Shift+Tab');
  check(await dialog.evaluate(el=>el.contains(document.activeElement)),'Reverse focus escaped');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.activeElement?.classList.contains('studio-menu'));
}
