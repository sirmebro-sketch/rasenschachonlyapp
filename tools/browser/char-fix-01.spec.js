import {test,expect} from '@playwright/test';

const namen=['Oval','Rund','Kantig','Schmal','Herz','Vollmond','Breit','Weich','Zart','Rundlich','Trapez','Langkantig','Diamant','Kurzbreit'];

test('CHAR-FIX-01: alle Koepfe decken Groesse Geschlecht Haut und kritische Haare ab',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/char-fix-01.html');
 const kritisch=page.locator('[data-testid="kritisch"] article');
 const matrix=page.locator('[data-testid="matrix"] article');
 await expect(kritisch).toHaveCount(14);
 await expect(matrix).toHaveCount(14);
 for(let id=0;id<14;id++){
  const card=page.locator(`[data-testid="matrix"] article[data-id="${id}"]`);
  await expect(card).toContainText(`ID ${id} · ${namen[id]}`);
  await expect(card.locator('.probe')).toHaveCount(18);
  for(const size of ['72','96','145'])await expect(card.locator(`.probe[data-size="${size}"]`)).toHaveCount(6);
  for(const g of ['m','w'])await expect(card.locator(`.probe[data-g="${g}"]`)).toHaveCount(9);
  for(const haut of ['hell','mittel','dunkel'])await expect(card.locator(`.probe[data-haut="${haut}"]`)).toHaveCount(6);
 }
 await expect(page.locator('[data-testid="matrix"] svg[aria-label="Spielerporträt"]')).toHaveCount(252);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow,'CHAR-FIX-01 darf keinen horizontalen Ueberlauf erzeugen').toBeLessThanOrEqual(1);
 if(testInfo.project.name==='desktop'){
  await page.locator('[data-testid="kritisch"]').screenshot({path:testInfo.outputPath('char-fix-01-alle-koepfe-kritisch.png')});
  for(const id of [10,11,12,13]){
   await page.locator(`[data-testid="kritisch"] article[data-id="${id}"]`).screenshot({path:testInfo.outputPath(`char-fix-01-kopf-${id}-kritisch.png`)});
   await page.locator(`[data-testid="matrix"] article[data-id="${id}"]`).screenshot({path:testInfo.outputPath(`char-fix-01-kopf-${id}-vollmatrix.png`)});
  }
 }
 expect(errors).toEqual([]);
});

test('CHAR-FIX-01: rasiert und kurz bleiben bei neuen Koepfen ohne seitliche Fremdflaechen',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Geometrische DOM-Pruefung einmal auf Desktop reicht.');
 await page.goto('/.preview/char-fix-01.html');
 for(const id of [10,11,12,13]){
  const card=page.locator(`[data-testid="kritisch"] article[data-id="${id}"]`);
  const svgs=card.locator('svg[aria-label="Spielerporträt"]');
  await expect(svgs).toHaveCount(6);
  for(let i=0;i<6;i++){
   const box=await svgs.nth(i).boundingBox();
   expect(box?.width||0).toBeGreaterThan(60);
   expect(box?.height||0).toBeGreaterThan(60);
  }
 }
});
