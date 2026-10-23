async page => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.setViewportSize({ width:1440,height:900 });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('http://127.0.0.1:5180/');
  await page.locator('.studio-project-active img').evaluate(img => img.decode());
  check(await page.getByRole('button',{name:'Showcase',exact:true}).getAttribute('aria-pressed') === 'true','Missing default view');
  await page.getByRole('button',{name:'Next project',exact:true}).click();
  check(await page.locator('.studio-caption').innerText().then(text=>text.includes('PiColor')), 'Next project failed');
  await page.getByRole('region',{name:'Selected project gallery'}).focus();
  await page.keyboard.press('ArrowLeft');
  check(await page.locator('.studio-caption').innerText().then(text=>text.includes('TwentyFour')), 'Keyboard project navigation failed');
  await page.getByRole('button',{name:'Open TwentyFour',exact:true}).click();
  let dialog=page.getByRole('dialog',{name:'TwentyFour',exact:true});
  check(await dialog.getByText('The approach',{exact:true}).isVisible(),'Case study missing');
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');check(await dialog.evaluate(el=>el.contains(document.activeElement)),'Project focus escaped');}
  await dialog.getByRole('button',{name:'View gallery'}).click();
  dialog=page.getByRole('dialog',{name:'TwentyFour gallery',exact:true});
  await dialog.getByRole('img',{name:'TwentyFour — live web app landing page',exact:true}).evaluate(img=>img.decode());
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  await dialog.waitFor({state:'detached'});
  await page.getByRole('button',{name:'List',exact:true}).click();
  check(await page.getByRole('region',{name:'All projects',exact:true}).locator('button').count()===29,'Archive must preserve all projects');
  await page.getByRole('region',{name:'All projects',exact:true}).getByRole('button',{name:/Arduino Visualizer/}).click();
  await page.getByRole('dialog',{name:'Arduino Visualizer',exact:true}).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Slider',exact:true}).click();
  check(await page.locator('.studio-view-slider').count()===1,'Slider mode missing');
  await page.getByRole('button',{name:'Menu',exact:false}).click();
  await page.getByRole('button',{name:/About & experience/}).click();
  check(await page.getByRole('dialog',{name:'About Raziel'}).getByText(/Expected 2027/).isVisible(),'Education is stale');
  await page.getByRole('button',{name:'View resume & portfolio',exact:false}).click();
  await page.getByRole('button',{name:'View resume',exact:true}).click();
  dialog=page.getByRole('dialog',{name:'Resume viewer',exact:true});
  await dialog.locator('img').first().evaluate(img=>img.decode());
  check(await dialog.locator('img').count()===2,'Incorrect resume document');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Let\'s talk',exact:false}).click();
  check(await page.getByRole('link',{name:/razielrenz@gmail.com/}).getAttribute('href')==='mailto:razielrenz@gmail.com','Contact link failed');
  await page.keyboard.press('Escape');
  for(const width of [320,390,768,1440,1920]){
    await page.setViewportSize({width,height:844});
    for(const mode of ['Showcase','List','Slider']){
      await page.getByRole('button',{name:mode,exact:true}).click();
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal page overflow');
      const active=await page.locator('.studio-project-active').boundingBox();
      check(active && active.x>=0 && active.x+active.width<=width,`Active project clipped in ${mode} at ${width}`);
      await page.getByRole('button',{name:'Menu',exact:false}).click();
      const close=page.getByRole('button',{name:'Close Navigation',exact:true});
      const box=await close.boundingBox();
      check(box && box.x>=0 && box.x+box.width<=width,'Dialog close clipped');
      await page.keyboard.press('Escape');
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Showcase',exact:true}).click();
  await page.screenshot({path:'output/playwright/studio-verified-mobile.png'});
  await page.setViewportSize({width:1440,height:900});
  await page.screenshot({path:'output/playwright/studio-verified-desktop.png'});
}
