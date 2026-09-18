import {test,expect} from '@playwright/test';

test('CHAR-FIX-04: gezielte Haar-/Bart-Sichtbögen rendern vollständig und sauber',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Die großen CHAR-FIX-04-Bögen werden einmal auf Desktop gerendert; 72/96/145 px sind im Bogen selbst enthalten.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/char-fix-04.html');

 const alle=page.locator('[data-kind="haar-alle"]');
 const kritisch=page.locator('[data-kind="haar-kritisch"]');
 const diagnose=page.locator('[data-kind="haar-diagnose"]');
 const bartNeu=page.locator('[data-kind="bart-neu"]');
 const bartAlt=page.locator('[data-kind="bart-alt"]');
 const bartGross=page.locator('[data-kind="bart-kritisch"]');

 await expect(alle).toHaveCount(200);
 await expect(kritisch).toHaveCount(152);
 await expect(diagnose).toHaveCount(76);
 await expect(bartNeu).toHaveCount(384);
 await expect(bartAlt).toHaveCount(96);
 await expect(bartGross).toHaveCount(42);

 for(const id of [10,11,12,13]){
  await expect(page.locator('[data-testid="haar-alle-neue"] article[data-kopf="'+id+'"] [data-kind="haar-alle"]')).toHaveCount(50);
  await expect(page.locator('[data-testid="haar-kritisch"] article[data-kopf="'+id+'"] [data-size="96"]')).toHaveCount(19);
  await expect(page.locator('[data-testid="haar-kritisch"] article[data-kopf="'+id+'"] [data-size="145"]')).toHaveCount(19);
  await expect(page.locator('[data-testid="bart-neue"] article[data-kopf="'+id+'"] .paar')).toHaveCount(3);
 }
 await expect(page.locator('svg[aria-label="Haar-Passungsdiagnose"]')).toHaveCount(76);
 await expect(page.locator('[data-bart-id="4"]')).toHaveCount(36);
 await expect(page.locator('[data-bart-id="14"]')).toHaveCount(36);

 const html=await page.locator('main').innerHTML();
 expect(html).not.toMatch(/NaN|undefined/);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow,'CHAR-FIX-04 darf keinen horizontalen Seitenüberlauf erzeugen').toBeLessThanOrEqual(1);

 await page.locator('[data-testid="haar-alle-neue"]').screenshot({path:testInfo.outputPath('char-fix-04-haare-alle-neue-koepfe.png')});
 await page.locator('[data-testid="haar-kritisch"]').screenshot({path:testInfo.outputPath('char-fix-04-haare-kritisch-96-145.png')});
 await page.locator('[data-testid="haar-diagnose"]').screenshot({path:testInfo.outputPath('char-fix-04-haare-diagnose-kopfkontur.png')});
 await page.locator('[data-testid="bart-neue"]').screenshot({path:testInfo.outputPath('char-fix-04-baerte-neue-koepfe.png')});
 await page.locator('[data-testid="bart-altvergleich"]').screenshot({path:testInfo.outputPath('char-fix-04-baerte-altvergleich.png')});
 await page.locator('[data-testid="bart-kritisch-gross"]').screenshot({path:testInfo.outputPath('char-fix-04-baerte-kritisch-gross.png')});
 expect(errors).toEqual([]);
});

test('CHAR-FIX-04: DOM-Diagnose belegt kopfgebundene Kurzhaar- und Kinnanker-Regeln',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Geometrische DOM-Diagnose einmal im Desktopprojekt.');
 await page.goto('/.preview/char-fix-04.html');
 for(const id of [10,11,12,13]){
  const card=page.locator('[data-testid="haar-diagnose"] article[data-kopf="'+id+'"]');
  const fitted=card.locator('[data-haar-passung="kopfkontur"]');
  expect(await fitted.count(), 'Kopf '+id+' muss mehrere echte Kopfkontur-Passungen enthalten').toBeGreaterThan(10);
 }
 const kinn=page.locator('[data-testid="bart-kritisch-gross"] [data-bart-id="4"]');
 const anker=page.locator('[data-testid="bart-kritisch-gross"] [data-bart-id="14"]');
 await expect(kinn).toHaveCount(6);
 await expect(anker).toHaveCount(6);
 for(const loc of [kinn,anker])for(let i=0;i<await loc.count();i++){
  const el=loc.nth(i);
  const k=Number(await el.getAttribute('data-bart-kinn-y'));
  const mb=Number(await el.getAttribute('data-bart-mundbottom'));
  const top=Number(await el.locator('[data-bart-chin-top]').first().getAttribute('data-bart-chin-top'));
  const bottom=Number(await el.locator('[data-bart-chin-bottom]').first().getAttribute('data-bart-chin-bottom'));
  expect(top).toBeGreaterThan(mb+.4);
  expect(top).toBeLessThan(k);
  expect(bottom).toBeGreaterThan(k+1.5);
 }
});
