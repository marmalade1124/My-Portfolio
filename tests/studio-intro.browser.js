async page => {
 const check=(value,message)=>{if(!value)throw Error(message)};
 page.setDefaultTimeout(10000);
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:5180/',{waitUntil:'domcontentloaded'});
 await page.locator('.studio-gallery[data-ready]').waitFor();
 const entrance=await page.locator('.studio-gallery').evaluate(el=>el.getAnimations().some(animation=>animation.animationName==='studio-arrive-gallery'));
 check(entrance,'Missing initial gallery entrance');
 const frames=await page.locator('.studio-project').first().evaluate(el=>new Promise(resolve=>{
  const samples=[]; const frame=()=>{samples.push({pose:el.style.transform,scale:new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.studio-gallery')).transform).a});if(samples.length<25)requestAnimationFrame(frame);else resolve(samples)};requestAnimationFrame(frame);
 }));
 check(new Set(frames.map(frame=>frame.pose)).size>10,'Intro ring does not spin');
 check(frames[0].scale<frames.at(-1).scale,'Intro ring does not grow');
 await page.waitForFunction(()=>!document.querySelector('.studio-enter'));
 check(await page.locator('.studio-gallery').evaluate(el=>getComputedStyle(el).opacity)==='1','Gallery did not become visible');
 await page.getByRole('button',{name:'Open TwentyFour',exact:true}).focus();
 await page.keyboard.press('Enter'); await page.waitForURL('**/work/twentyfour');
 await page.getByRole('button',{name:'All work',exact:true}).click();
 check(await page.locator('.studio-enter').count()===0,'Entrance replayed on return');
 await page.goto('http://127.0.0.1:5180/',{waitUntil:'domcontentloaded'});
 await page.locator('.studio-root').waitFor(); await page.keyboard.press('Tab');
 check(await page.locator('.studio-enter').count()===0,'Keyboard did not skip entrance');
 await page.goto('http://127.0.0.1:5180/',{waitUntil:'domcontentloaded'});
 await page.locator('.studio-root').waitFor(); await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>!document.querySelector('.studio-enter'));
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900}); await page.goto('http://127.0.0.1:5180/');
  check(await page.locator('.studio-enter').count()===0,'Reduced motion starts entrance');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Intro overflow');
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:5180/work/codecraft-web');
 check(await page.locator('.studio-enter').count()===0,'Home entrance on direct project');
}
