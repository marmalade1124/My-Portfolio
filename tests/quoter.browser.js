async page => {
 const check=(v,m)=>{if(!v)throw Error(m)};
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:5180/');
 check(await page.locator('.studio-project').count()===8,'All eight featured logos must remain');
 await page.getByRole('button',{name:'List',exact:true}).click();
 const archive=page.getByRole('region',{name:'All projects',exact:true});
 check(await archive.locator('button').count()===32,'Expected 32 projects');
 await archive.getByRole('button',{name:/Quoter/}).focus();await page.keyboard.press('Enter');
 await page.waitForURL('**/work/quoter');
 check(await page.getByRole('heading',{name:'Quoter',exact:true}).count()===1,'Quoter heading missing');
 check(await page.locator('.project-introduction').innerText().then(t=>t.includes('Bambu Studio')&&t.includes('C#')),'Quoter content missing');
 check(await page.locator('.project-links a').count()===0,'Do not invent download/source links');
 const images=page.locator('.project-visual img');
 await images.evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode()})));
 check(await images.count()===4,'Expected four gallery images');
 check(await images.evaluateAll(imgs=>imgs.every(img=>img.naturalWidth>0&&/demo/i.test(img.alt))),'Missing screenshot or demo labels');
 await page.screenshot({path:'output/playwright/quoter-desktop.png'});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflows viewport');
  if(width===390)await page.screenshot({path:'output/playwright/quoter-mobile.png'});
 }
 await page.reload();await page.getByRole('heading',{name:'Quoter',exact:true}).waitFor();
 await page.keyboard.press('Escape');await page.waitForURL('http://127.0.0.1:5180/');
 check(errors.length===0,errors.join('\n'));
 return {featured:8,archive:32,quoterImages:4,directRoute:true,keyboard:true,widths:[320,390,768,1440],pageErrors:errors};
}

