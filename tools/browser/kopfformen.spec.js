import {test,expect} from '@playwright/test';

const namen=['Oval','Rund','Kantig','Schmal','Herz','Vollmond','Breit','Weich','Zart','Rundlich','Trapez','Langkantig','Diamant','Kurzbreit'];

test('CHAR-P1-01: 14 stabile Kopfformen rendern mit Haar- und Bartprobe',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/kopfformen.html');
 const cards=page.locator('[data-testid="koepfe"] article');
 await expect(cards).toHaveCount(14);
 for(let id=0;id<14;id++){
  const card=page.locator(`[data-testid="koepfe"] article[data-id="${id}"]`);
  await expect(card).toContainText(`ID ${id} · ${namen[id]}`);
  await expect(card.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(4);
 }
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow,'Kopfform-Sichtprobe darf auf kleinen Viewports nicht horizontal überlaufen').toBeLessThanOrEqual(1);
 if(testInfo.project.name==='desktop')await page.screenshot({path:testInfo.outputPath('koepfe-neu-vergleich.png'),fullPage:true});
 expect(errors).toEqual([]);
});

test('CHAR-P1-01: Charakter-Inventar bietet neue Kopf-IDs append-only für beide Geschlechter',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Die Optionen werden einmal vollständig gezählt; responsive Darstellung prüft die Kopfform-Sichtprobe.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/charakter-inventar.html');
 await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption('kopf');
 for(const gender of ['m','w']){
  await page.getByRole('combobox',{name:'Geschlecht',exact:true}).selectOption(gender);
  const cards=page.locator('[data-testid="varianten"] article');
  await expect(cards).toHaveCount(14);
  for(let id=0;id<14;id++)await expect(page.locator(`[data-testid="varianten"] article[data-id="${id}"]`)).toContainText(`ID ${id}`);
  await page.screenshot({path:testInfo.outputPath(`koepfe-neu-${gender}.png`),fullPage:true});
 }
 expect(errors).toEqual([]);
});
