async page => {
 const check=(condition,message)=>{if(!condition)throw new Error(message)};
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:5180/');
 await page.getByRole('region',{name:'Selected project gallery'}).focus();
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('.studio-caption').textContent.includes('PiColor'));
 await page.keyboard.press('ArrowLeft');
 await page.waitForFunction(()=>document.querySelector('.studio-caption').textContent.includes('TwentyFour'));
 await page.getByRole('button',{name:'Open TwentyFour',exact:true}).focus(); await page.keyboard.press('Enter');
 await page.waitForURL('**/work/twentyfour');
 check(await page.getByRole('heading',{name:'TwentyFour',exact:true}).count()===1,'Missing dedicated project page');
 check(await page.getByRole('dialog').count()===0,'Project must not be a dialog');
 const story=page.getByRole('region',{name:'TwentyFour project story'});
 await story.evaluate(el=>{el.scrollTop=800});
 await page.waitForFunction(()=>document.querySelector('.project-track').style.transform.includes('-800px'));
 check(await page.locator('.project-progress').innerText()!=='0%','Progress did not update');
 await page.goBack(); await page.getByRole('button',{name:'Showcase',exact:true}).waitFor();
 await page.getByRole('button',{name:'List',exact:true}).click();
 check(await page.getByRole('region',{name:'All projects',exact:true}).locator('button').count()===29,'Missing archive');
 await page.getByRole('region',{name:'All projects',exact:true}).getByRole('button',{name:/Arduino Visualizer/}).click();
 await page.waitForURL('**/work/arduino-visualizer');
 await page.getByRole('button',{name:'All work',exact:true}).click();
 await page.getByRole('button',{name:'Menu',exact:false}).click();
 await page.getByRole('button',{name:/About & experience/}).click();
 check(await page.getByRole('dialog',{name:'About Raziel'}).getByText(/Expected 2027/).isVisible(),'Education stale');
 await page.getByRole('button',{name:'View resume & portfolio',exact:false}).click();
 await page.getByRole('button',{name:'View resume',exact:true}).click();
 await page.getByRole('dialog',{name:'Resume viewer'}).locator('img').first().evaluate(img=>img.decode());
 await page.keyboard.press('Escape');
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:844});
  for(const view of ['Showcase','List','Slider']){
   await page.getByRole('button',{name:view,exact:true}).click();
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Home overflow');
  }
  await page.goto('http://127.0.0.1:5180/work/picolor');
  await page.getByRole('heading',{name:'PiColor 3.14',exact:true}).waitFor();
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Project overflow');
  if(width<768){
   const images=await page.locator('.project-visual').evaluateAll(els=>els.slice(0,2).map(el=>({x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y})));
   check(images.length===2&&images[1].y>images[0].y,'Mobile gallery is not vertical');
  }
  await page.getByRole('button',{name:'All work',exact:true}).click();
 }
 await page.goto('http://127.0.0.1:5180/work/missing');
 check(await page.getByRole('heading',{name:'Project not found.'}).isVisible(),'Missing route has no fallback');
 await page.getByRole('button',{name:'Back to work'}).click();
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:5180/work/twentyfour');
 await page.screenshot({path:'output/playwright/project-horizontal-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'output/playwright/project-vertical-mobile.png'});
}
