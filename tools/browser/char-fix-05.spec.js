import {test,expect} from '@playwright/test';

test('CHAR-FIX-05: Lange Locken rendern auf allen Köpfen und Größen',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Der vollständige 14×4×3-Sichtbogen wird einmal im Desktopprojekt erzeugt.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/char-fix-05.html');
 const cards=page.locator('[data-kind="langlocken"]');
 await expect(cards).toHaveCount(168);
 for(const size of [72,96,145]){
  const section=page.getByTestId('langlocken-'+size);
  await expect(section.locator('[data-kind="langlocken"]')).toHaveCount(56);
  for(let kopf=0;kopf<14;kopf++)await expect(section.locator('[data-kind="langlocken"][data-kopf="'+kopf+'"]')).toHaveCount(4);
  await section.screenshot({path:testInfo.outputPath('char-fix-05-langlocken-'+size+'.png')});
 }
 const html=await page.locator('main').innerHTML();
 expect(html).not.toMatch(/NaN|undefined/);
 expect(errors).toEqual([]);
});
