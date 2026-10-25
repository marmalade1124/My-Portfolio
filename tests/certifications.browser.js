async page => {
 const check=(value,message)=>{if(!value)throw Error(message)};
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:5180/');
  await page.getByRole('button',{name:/^Menu/}).click();
  await page.getByRole('button',{name:/Certifications & learning/}).click();
  const dialog=page.getByRole('dialog',{name:'Certifications & learning'});
  await dialog.getByRole('heading',{name:'Verified certificates'}).waitFor();
  check(await dialog.getByText(/No certificates published yet/).isVisible(),'Missing honest empty state');
  check(!await dialog.locator('details').evaluate(el=>el.open),'Learning links must start separate/collapsed');
  await dialog.locator('summary').focus(); await page.keyboard.press('Enter');
  check(await dialog.locator('details').evaluate(el=>el.open),'Keyboard disclosure failed');
  check(await dialog.locator('.studio-learning-grid a').count()===5,'Missing researched paths');
  check(await dialog.getByText(/not credentials held or claims of enrollment/).isVisible(),'Learning resources misrepresented');
  check(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth),'Panel overflow');
  await page.screenshot({path:'output/playwright/certifications-'+width+'.png'});
  await page.keyboard.press('Escape');
  check(await page.getByRole('dialog').count()===0,'Escape failed');
  await page.getByRole('button',{name:/^Menu/}).click();
  await page.keyboard.press('Shift+Tab');
  check(await page.getByRole('dialog').evaluate(el=>el.contains(document.activeElement)),'Menu focus escaped');
  await page.keyboard.press('Escape');
 }
}
