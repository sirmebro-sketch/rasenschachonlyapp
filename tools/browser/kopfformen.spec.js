import {test,expect} from '@playwright/test';

test('CHAR-P1-01: Ausgangsvergleich der zehn gespeicherten Kopfformen',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Der große Vergleichsbogen wird einmal auf Desktop erfasst; responsive Wege bleiben separat abgedeckt.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/charakter-inventar.html');
 await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption('kopf');
 const pruefe=async(gender)=>{
  await page.getByRole('combobox',{name:'Geschlecht',exact:true}).selectOption(gender);
  const cards=page.locator('[data-testid="varianten"] article');
  await expect(cards).toHaveCount(10);
  for(let id=0;id<10;id++){
   const card=page.locator(`[data-testid="varianten"] article[data-id="${id}"]`);
   await expect(card.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(3);
  }
  await page.screenshot({path:testInfo.outputPath(`koepfe-ausgang-${gender}.png`),fullPage:true});
 };
 await pruefe('m');
 await pruefe('w');
 expect(errors).toEqual([]);
});
