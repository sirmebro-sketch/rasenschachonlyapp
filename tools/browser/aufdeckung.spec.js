import {test,expect} from '@playwright/test';

for(const still of [false,true]){
 test(`Wildcard-Aufdeckungen ${still?'ohne':'mit'} Bewegung bleiben lesbar und abschließbar`,async({page},testInfo)=>{
  test.setTimeout(90000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/.preview/sichtprobe.html');
  await page.getByRole('button',{name:'wildcards',exact:true}).click();
  await page.getByRole('checkbox',{name:'Animationen aus',exact:true}).setChecked(still);
  for(const rarity of ['normal','selten','aussen','unfass','welt','goat','hsv']){
   await page.getByRole('button',{name:rarity,exact:true}).click();
   const text=page.getByText('Du erkennst den freien Raum, bevor alle anderen ihn sehen.',{exact:true});
   await expect(text).toBeVisible();
   const next=page.locator('button').filter({hasText:/^Weiter$/});
   await expect(next).toBeVisible({timeout:8000});
   const box=await text.boundingBox(),viewport=page.viewportSize();
   expect(box.x).toBeGreaterThanOrEqual(0);
   expect(box.x+box.width).toBeLessThanOrEqual(viewport.width+1);
   expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
   if(still){
    const animations=await page.locator('.rs-schleier').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length);
    expect(animations).toBe(0);
   }
   if(rarity==='goat')await page.screenshot({path:testInfo.outputPath(`goat-${still?'still':'animiert'}.png`)});
   await next.click();
   await expect(text).toHaveCount(0);
  }
  expect(errors).toEqual([]);
 });
}
