async page => {
 const check=(condition,message)=>{if(!condition)throw new Error(message)};
 page.setDefaultTimeout(15000);
 const revealStory=async()=>{
  await page.locator('.project-visual img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode()})));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  return page.locator('.product-story').evaluate(el=>{ const root=document.querySelector('.project-scroll'); for(let parent=el.parentElement;parent;parent=parent.parentElement)parent.scrollLeft=0; root.scrollTop=innerWidth>=768?el.offsetLeft-20:root.scrollTop+el.getBoundingClientRect().top-110; }); };
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:5180/');
 await page.locator('.studio-gallery[data-ready]').waitFor();
 check(await page.locator('.studio-logo-tile').count()===7,'Missing consistent logo tiles');
 check(await page.locator('.product-cover').count()===0,'Old animated overlays remain');
 check(await page.locator('.studio-logo-mark').evaluateAll(els=>els.every(el=>getComputedStyle(el).color==='rgb(17, 17, 17)')),'Text marks are invisible');
 for(const img of await page.locator('.studio-logo-tile img').all()){
  await img.evaluate(el=>el.decode());
  check(await img.evaluate(el=>getComputedStyle(el).objectFit)==='contain','Logo cropped');
 }
 await page.getByRole('region',{name:'Selected project gallery'}).focus();
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('.studio-caption').textContent.includes('PiColor'));
 await page.screenshot({path:'output/playwright/product-cover.png'});
 for(const id of ['twentyfour','picolor','lapcat-app','lapcat-website']){
  await page.goto('http://127.0.0.1:5180/work/'+id);
  const story=page.locator('.product-story'); await story.waitFor();
  await page.locator('.project-track').evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
  await revealStory();
  const video=story.locator('video');
  check(await video.getAttribute('preload')==='none','Story eagerly loads media');
  check(await video.evaluate(el=>!el.autoplay&&el.paused),'Story must wait for user');
  await video.evaluate(el=>new Promise(resolve=>{const observer=new IntersectionObserver(([entry])=>{if(entry?.isIntersecting){observer.disconnect();requestAnimationFrame(()=>requestAnimationFrame(resolve));}},{threshold:.5});observer.observe(el);}));
  await video.evaluate(el=>el.play());
  await page.waitForFunction(()=>document.querySelector('video').currentTime>.1);
  check(await video.evaluate(el=>Math.abs(el.duration-8)<.1),'Wrong story length');
  await page.getByRole('button',{name:'Play diagram',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.process-playing'));
  await page.getByRole('button',{name:'Stop diagram',exact:true}).click();
  await page.screenshot({path:'output/playwright/product-story-'+id+'.png'});
  await page.locator('.project-scroll').evaluate(el=>el.scrollTop=0);
  await page.waitForFunction(()=>document.querySelector('video').paused);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:5180/');
 check(await page.locator('.cover-playing').count()===0,'Reduced-motion cover animated');
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:5180/work/twentyfour');
  await revealStory();
  check(await page.getByRole('button',{name:'Play diagram',exact:true}).count()===0,'Reduced-motion diagram control must be static');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Story causes horizontal overflow');
 }
 await page.route('**/motion/*.mp4',route=>route.abort());
 await page.goto('http://127.0.0.1:5180/work/picolor');
 await revealStory();
 await page.locator('video').evaluate(el=>el.load());
 await page.getByRole('status').filter({hasText:'The story could not load'}).waitFor();
 check(await page.locator('.project-visual').count()>0,'Media failure removed screenshot gallery');
 await page.unroute('**/motion/*.mp4');
}
