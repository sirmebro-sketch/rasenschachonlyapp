import {test,expect} from '@playwright/test';

test('CHAR-P1-04: Bartkatalog bleibt vollständig und auf mehreren Kieferformen sichtbar',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Der vollständige Bartbogen wird einmal groß geprüft; 72-px-Proben sind bereits Teil jeder Karte.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/baerte.html');
 const cards=page.locator('[data-testid="baerte"] article');
 await expect(cards).toHaveCount(16);
 const namen=['Glatt','Stoppeln','Dreitagebart','Schnurrbart','Kinnbart','Ziegenbart','Kurzer Vollbart','Langer Vollbart','Kinnriemen','Koteletten','Schnurrbart und Stoppeln','Breiter Schnurrbart','Konturierter Bart','Spitzer Vollbart','Ankerbart','Breiter Vollbart'];
 for(let id=0;id<namen.length;id++){
  const card=page.locator(`[data-testid="baerte"] article[data-id="${id}"]`);
  await expect(card).toContainText(namen[id]);
  await expect(card.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(6);
 }
 await page.screenshot({path:testInfo.outputPath('baerte-vollbogen.png'),fullPage:true});
 expect(errors).toEqual([]);
});
