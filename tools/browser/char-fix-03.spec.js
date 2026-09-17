import {test,expect} from '@playwright/test';

test('CHAR-FIX-03: alle Kopf/Frisur-Paare und kritischen Bartkombinationen rendern sauber',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Der große Passungsbogen wird einmal im Desktop-Projekt geprüft; 72-px-Avatare sind Bestandteil des Bogens.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/char-fix-03.html');
 const haar=page.locator('[data-kind="haar"]');
 const bart=page.locator('[data-kind="bart"]');
 await expect(haar).toHaveCount(700);
 await expect(bart).toHaveCount(896);
 await expect(haar.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(700);
 await expect(bart.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(896);
 await expect(page.locator('[data-testid="haar-matrix"] article')).toHaveCount(14);
 await expect(page.locator('[data-testid="bart-matrix"] article')).toHaveCount(14);
 await expect(page.locator('[data-bart-id]')).toHaveCount(840); // Bart 0 = glatt, daher ohne Bart-SVG-Gruppe.
 const html=await page.locator('main').innerHTML();
 expect(html).not.toMatch(/NaN|undefined/);
 await page.locator('[data-testid="haar-matrix"]').screenshot({path:testInfo.outputPath('char-fix-03-haare-vollmatrix.png')});
 await page.locator('[data-testid="bart-matrix"]').screenshot({path:testInfo.outputPath('char-fix-03-baerte-vollmatrix.png')});
 expect(errors).toEqual([]);
});
