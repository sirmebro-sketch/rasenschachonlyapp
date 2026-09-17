import {test,expect} from '@playwright/test';

test('CHAR-P1-03: neue Frisuren sind bei Mann und Frau sichtbar und append-only',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Die Variantenbögen werden einmal groß geprüft; responsive Galerie bleibt separat abgedeckt.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/charakter-inventar.html');
 await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption('frisur');
 const pruefe=async(gender,anzahl,ids)=>{
  await page.getByRole('combobox',{name:'Geschlecht',exact:true}).selectOption(gender);
  const cards=page.locator('[data-testid="varianten"] article');
  await expect(cards).toHaveCount(anzahl);
  for(const [id,name] of ids){
   const card=page.locator(`[data-testid="varianten"] article[data-id="${id}"]`);
   await expect(card).toContainText(name);
   await expect(card.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(3);
  }
  await page.screenshot({path:testInfo.outputPath(`frisuren-${gender}.png`),fullPage:true});
 };
 await pruefe('m',26,[[22,'Lange Locs'],[23,'Irokesenschnitt'],[24,'Schulterlang glatt'],[25,'Flechtkranz']]);
 await pruefe('w',24,[[20,'Lange Locs'],[21,'Irokesenschnitt'],[22,'Schulterlang glatt'],[23,'Flechtkranz']]);
 expect(errors).toEqual([]);
});
