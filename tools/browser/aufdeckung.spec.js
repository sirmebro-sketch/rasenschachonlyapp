import {test,expect} from '@playwright/test';

const SELTENHEITEN=['normal','selten','aussen','unfass','welt','goat','hsv'];
const MIT_MATERIAL=new Set(['unfass','welt','goat','hsv']);
const MIT_PRAEGUNG=new Set(['welt','goat','hsv']);

function innerhalb(inner,outer,toleranz=1){
 expect(inner.x).toBeGreaterThanOrEqual(outer.x-toleranz);
 expect(inner.y).toBeGreaterThanOrEqual(outer.y-toleranz);
 expect(inner.x+inner.width).toBeLessThanOrEqual(outer.x+outer.width+toleranz);
 expect(inner.y+inner.height).toBeLessThanOrEqual(outer.y+outer.height+toleranz);
}

for(const still of [false,true]){
 test(`Wildcard-Aufdeckungen ${still?'ohne':'mit'} Bewegung bleiben vollständig und stabil`,async({page},testInfo)=>{
  test.setTimeout(90000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/.preview/sichtprobe.html');
  await page.getByRole('button',{name:'wildcards',exact:true}).click();
  await page.getByRole('checkbox',{name:'Animationen aus',exact:true}).setChecked(still);

  for(const rarity of SELTENHEITEN){
   await page.getByRole('button',{name:rarity,exact:true}).click();
   const stage=page.locator('.rs-enthuellungsraum');
   const slot=page.locator('.rs-enthuellungsraum + div');
   const before=await stage.boundingBox(),slotBefore=await slot.boundingBox();

   const card=page.locator(`[data-wildcard="${rarity}"]`);
   await expect(card).toBeVisible({timeout:8000});
   const title=card.locator('.rs-wildtext .d');
   const text=card.locator('.rs-wildtext p');
   const band=card.locator('.band');
   await expect(title).not.toHaveText('');
   await expect(text).not.toHaveText('');

   const next=page.locator('.rs-schleier button').filter({hasText:/^Weiter$/});
   await expect(next).toBeVisible({timeout:8000});
   if(!still)await page.waitForTimeout(900);

   const after=await stage.boundingBox(),slotAfter=await slot.boundingBox();
   expect(Math.abs(after.y-before.y)).toBeLessThan(1);
   expect(Math.abs(after.height-before.height)).toBeLessThan(1);
   expect(Math.abs(slotAfter.y-slotBefore.y)).toBeLessThan(1);
   expect(Math.abs(slotAfter.height-slotBefore.height)).toBeLessThan(1);

   const viewport=page.viewportSize();
   const fenster={x:0,y:0,width:viewport.width,height:viewport.height};
   const cardBox=await card.boundingBox(),titleBox=await title.boundingBox();
   const textBox=await text.boundingBox(),bandBox=await band.boundingBox();
   const nextBox=await next.boundingBox();
   innerhalb(cardBox,fenster);
   innerhalb(titleBox,cardBox);
   innerhalb(textBox,cardBox);
   innerhalb(bandBox,cardBox);
   innerhalb(nextBox,fenster);
   expect(titleBox.y+titleBox.height).toBeLessThanOrEqual(textBox.y+1);
   expect(await text.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);

   const material=card.locator('.rs-materialkante');
   await expect(material).toHaveCount(MIT_MATERIAL.has(rarity)?1:0);
   if(MIT_MATERIAL.has(rarity))innerhalb(await material.boundingBox(),cardBox,1.5);
   const praegung=card.locator('.rs-wildpraegung');
   await expect(praegung).toHaveCount(MIT_PRAEGUNG.has(rarity)?1:0);
   if(MIT_PRAEGUNG.has(rarity))innerhalb(await praegung.boundingBox(),cardBox,1.5);

   if(still){
    // Button-Hover/Fokus darf seine Farbe weich wechseln; keine Bewegungsanimation ausnehmen.
    const animations=await page.locator('.rs-schleier').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&!['background-color','color','border-top-color','border-right-color','border-bottom-color','border-left-color'].includes(a.transitionProperty)).map(a=>({name:a.animationName,property:a.transitionProperty,target:a.effect.target.outerHTML.slice(0,240)})));
    expect(animations).toEqual([]);
   }

   if(viewport.width===320||viewport.width===390){
    await page.screenshot({path:testInfo.outputPath(`wildcard-${rarity}-${still?'still':'animiert'}.png`)});
   }
   await next.click();
   await expect(card).toHaveCount(0);
  }
  expect(errors).toEqual([]);
 });
}
