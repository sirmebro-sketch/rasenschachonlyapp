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
   const stage=page.locator('.rs-enthuellungsraum');
   const before=await stage.boundingBox();
   const text=page.getByText('Du erkennst den freien Raum, bevor alle anderen ihn sehen.',{exact:true});
   await expect(text).toBeVisible();
   const next=page.locator('button').filter({hasText:/^Weiter$/});
   await expect(next).toBeVisible({timeout:8000});
   const after=await stage.boundingBox();
   expect(Math.abs(after.y-before.y)).toBeLessThan(1);
   await expect(page.locator('[data-wildcard] .band')).toContainText('Wildcard ·');
   const box=await text.boundingBox(),viewport=page.viewportSize();
   expect(box.x).toBeGreaterThanOrEqual(0);
   expect(box.x+box.width).toBeLessThanOrEqual(viewport.width+1);
   expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
   if(still){
    // Button-Hover/Fokus darf seine Farbe weich wechseln; keine Bewegungsanimation ausnehmen.
    const animations=await page.locator('.rs-schleier').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&!['background-color','color','border-top-color','border-right-color','border-bottom-color','border-left-color'].includes(a.transitionProperty)).map(a=>({name:a.animationName,property:a.transitionProperty,target:a.effect.target.outerHTML.slice(0,240)})));
    expect(animations).toEqual([]);
   }
   if(rarity==='goat')await page.screenshot({path:testInfo.outputPath(`goat-${still?'still':'animiert'}.png`)});
   await next.click();
   await expect(text).toHaveCount(0);
  }
  expect(errors).toEqual([]);
 });
}
