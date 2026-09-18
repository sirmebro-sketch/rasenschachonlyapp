import {test,expect} from '@playwright/test';

const PACKS=[
 ['bronze','BRONZE',false],
 ['silber','SILBER',false],
 ['gold','GOLD',true],
 ['legende','LEGENDÄR',true],
];
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();

for(const still of [false,true]){
 test(`CARD-P0-02 Packs ${still?'ohne':'mit'} Bewegung folgen ihrer Kontur und bleiben lesbar`,async({page},testInfo)=>{
  test.skip(testInfo.project.name==='desktop','CARD-P0-02 verlangt 320/390 px.');
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/.preview/sichtprobe.html');
  await page.getByRole('button',{name:'packs',exact:true}).click();
  await page.getByRole('checkbox',{name:'Animationen aus',exact:true}).setChecked(still);
  if(!still)await page.waitForTimeout(900);

  const viewport=page.viewportSize();
  for(const [stufe,label,glanz] of PACKS){
   const text=page.locator('svg text').filter({hasText:new RegExp('^'+label+'$')});
   await expect(text,`${stufe}: Beschriftung vorhanden`).toHaveCount(1);
   await expect(text,`${stufe}: Beschriftung sichtbar`).toBeVisible();

   const druck=text.locator('xpath=..');
   const pack=druck.locator('xpath=..');
   const [packBox,textBox]=await Promise.all([pack.boundingBox(),text.boundingBox()]);
   expect(packBox,`${stufe}: Packbox`).not.toBeNull();
   expect(textBox,`${stufe}: Textbox`).not.toBeNull();
   expect(packBox.x).toBeGreaterThanOrEqual(-0.5);
   expect(packBox.x+packBox.width).toBeLessThanOrEqual(viewport.width+0.5);
   expect(textBox.x).toBeGreaterThanOrEqual(packBox.x-0.5);
   expect(textBox.x+textBox.width).toBeLessThanOrEqual(packBox.x+packBox.width+0.5);
   expect(textBox.y).toBeGreaterThanOrEqual(packBox.y-0.5);
   expect(textBox.y+textBox.height).toBeLessThanOrEqual(packBox.y+packBox.height+0.5);

   const effekt=pack.locator(':scope > .rs-materialkante');
   if(!glanz){
    await expect(effekt,`${stufe}: keine Holo-Folie`).toHaveCount(0);
    continue;
   }
   await expect(effekt,`${stufe}: Holo-Folie vorhanden`).toHaveCount(1);
   const effektBox=await effekt.boundingBox();
   expect(Math.abs(effektBox.x-packBox.x),`${stufe}: Folie links bündig`).toBeLessThan(0.6);
   expect(Math.abs(effektBox.y-packBox.y),`${stufe}: Folie oben bündig`).toBeLessThan(0.6);
   expect(Math.abs(effektBox.width-packBox.width),`${stufe}: Folienbreite`).toBeLessThan(0.6);
   expect(Math.abs(effektBox.height-packBox.height),`${stufe}: Folienhöhe`).toBeLessThan(0.6);

   const basisPfad=await pack.locator(':scope > svg').first().locator('path').first().getAttribute('d');
   const clipPfad=await effekt.locator('clipPath path').getAttribute('d');
   expect(norm(clipPfad),`${stufe}: Folienclip entspricht sichtbarer Packkontur`).toBe(norm(basisPfad));

   const [effektZ,druckZ]=await Promise.all([
    effekt.evaluate(el=>Number.parseInt(getComputedStyle(el).zIndex,10)),
    druck.evaluate(el=>Number.parseInt(getComputedStyle(el).zIndex,10)),
   ]);
   expect(druckZ,`${stufe}: Beschriftungs-/Druckebene liegt über der Folie`).toBeGreaterThan(effektZ);

   const laufend=await effekt.evaluate(el=>el.getAnimations({subtree:true})
    .filter(a=>a.playState==='running').map(a=>a.animationName).filter(Boolean));
   if(still)expect(laufend,`${stufe}: Ruhemodus ohne Bewegung`).toEqual([]);
   else {
    expect(laufend,`${stufe}: Farbschimmer läuft`).toContain('rs-folienfarbe');
    expect(laufend,`${stufe}: Lichtzug läuft`).toContain('rs-folienzug');
   }
  }

  expect(errors).toEqual([]);
  await page.screenshot({path:testInfo.outputPath(`packs-${testInfo.project.name}-${still?'still':'animiert'}.png`),fullPage:true});
 });
}
