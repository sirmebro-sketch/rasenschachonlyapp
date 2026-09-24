import {test,expect} from '@playwright/test';

test('Spielerkarten: Gold wirkt metallisch, Legendaer bleibt irisierend',async({page},testInfo)=>{
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
 expect(goldOpacity).toBeGreaterThanOrEqual(.70);
 expect(legendeOpacity).toBeGreaterThan(goldOpacity);

 const goldStops=await gold.locator('svg.rs-materialkante linearGradient').first().locator('stop').evaluateAll(stops=>stops.map(s=>s.getAttribute('stop-color')));
 expect(goldStops).toEqual(expect.arrayContaining(['#704407','#bd7d12','#efb936','#fff0a0','#d89518','#f5d061','#7b500c']));
 expect(goldStops).not.toEqual(expect.arrayContaining(['#ff6ecb','#8f7dff','#55e8ff','#77ffad']));
 await expect(gold.locator('svg.rs-materialkante .rs-gold-iris')).toHaveCount(1);
 await expect(legende.locator('svg.rs-materialkante .rs-gold-iris')).toHaveCount(0);
 const legendenStops=await legende.locator('svg.rs-materialkante linearGradient').first().locator('stop').evaluateAll(stops=>stops.map(s=>s.getAttribute('stop-color')));
 expect(legendenStops).toEqual(expect.arrayContaining(['#ff6ecb','#8f7dff','#55e8ff','#77ffad','#ffd76d']));

 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await page.screenshot({path:testInfo.outputPath('spielerkarten-holo.png'),fullPage:true});
 await page.getByRole('checkbox',{name:'Animationen aus'}).check();
 await expect(page.locator('[data-spielerkarte] svg.rs-materialkante')).toHaveCount(0);
});
