import {test,expect} from '@playwright/test';

test('Spielerkarten: Gold- und Legenden-Holo bleibt sichtbar und abgestuft',async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/.preview/sichtprobe.html');
 await page.getByRole('button',{name:'spielerkarten',exact:true}).click();

 const bronze=page.locator('[data-spielerkarte="bronze"]').first();
 const silber=page.locator('[data-spielerkarte="silber"]').first();
 const gold=page.locator('[data-spielerkarte="gold"]').first();
 const legende=page.locator('[data-spielerkarte="legende"]').first();

 await expect(bronze).toBeVisible();
 await expect(silber).toBeVisible();
 await expect(gold).toBeVisible();
 await expect(legende).toBeVisible();

 await expect(bronze.locator('svg.rs-materialkante')).toHaveCount(0);
 await expect(silber.locator('svg.rs-materialkante')).toHaveCount(0);
 await expect(gold.locator('svg.rs-materialkante')).toHaveCount(1);
 await expect(legende.locator('svg.rs-materialkante')).toHaveCount(1);

 const goldOpacity=Number(await gold.locator('svg.rs-materialkante').evaluate(el=>getComputedStyle(el).opacity));
 const legendeOpacity=Number(await legende.locator('svg.rs-materialkante').evaluate(el=>getComputedStyle(el).opacity));
 expect(goldOpacity).toBeGreaterThanOrEqual(.65);
 expect(legendeOpacity).toBeGreaterThan(goldOpacity);

 const goldStops=await gold.locator('svg.rs-materialkante linearGradient').first().locator('stop').evaluateAll(stops=>stops.map(s=>s.getAttribute('stop-color')));
 expect(goldStops).toEqual(expect.arrayContaining(['#ff6ecb','#8f7dff','#55e8ff','#77ffad','#ffd76d']));

 await page.screenshot({path:testInfo.outputPath('spielerkarten-holo-390.png'),fullPage:true});
});
