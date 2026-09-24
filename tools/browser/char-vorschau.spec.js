import {test,expect} from '@playwright/test';

const oeffneErstellung=async(page,url)=>{
  await page.goto(url);
  if(url.includes('sichtprobe')){
    await page.getByRole('button',{name:'erstellung',exact:true}).click();
  }else{
    await page.getByRole('button',{name:'Überspringen'}).click();
    await page.getByRole('button',{name:'NEUE LAUFBAHN ab Seite 3'}).click();
  }
};

const masse=async(vorschau,portraet)=>({
  vorschau:await vorschau.boundingBox(),
  portraet:await portraet.boundingBox(),
});

for(const url of ['/', '/.preview/sichtprobe.html']){
  test('Spielerpass-Vorschau bleibt beim Oeffnen der Feinheiten gleich gross '+url,async({page},testInfo)=>{
    test.skip(!['schmal','handy'].includes(testInfo.project.name),'Geometrie wird bei 320 und 390 px geprüft.');
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));

    await oeffneErstellung(page,url);
    const vorschau=page.locator('[data-char-vorschau="true"]');
    const portraet=vorschau.getByRole('img',{name:'Spielerporträt'});
    const fein=page.getByRole('button',{name:'Feinheiten',exact:true});

    await expect(vorschau).toBeVisible();
    await expect(portraet).toBeVisible();
    await expect(portraet).toHaveAttribute('width','112');
    await expect(portraet).toHaveAttribute('height','112');

    for (const button of await vorschau.getByRole('button').all()) {
      expect(await button.evaluate(el=>el.scrollWidth<=el.clientWidth+1), 'Aktionsbeschriftung passt in die Schaltfläche').toBe(true);
    }
    const vorher=await masse(vorschau,portraet);
    expect(vorher.vorschau).not.toBeNull();
    expect(vorher.portraet).not.toBeNull();
    expect(vorher.portraet.width).toBeGreaterThanOrEqual(112);
    await page.screenshot({path:testInfo.outputPath('spielerpass-vorschau-kompakt.png'),fullPage:false});

    await fein.click();
    await expect(fein).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('[id$="-feinheiten"]')).toBeVisible();
    const offen=await masse(vorschau,portraet);

    expect(Math.abs(offen.portraet.width-vorher.portraet.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(offen.portraet.height-vorher.portraet.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(offen.vorschau.width-vorher.vorschau.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(offen.vorschau.height-vorher.vorschau.height)).toBeLessThanOrEqual(1);
    expect(await vorschau.evaluate(el=>getComputedStyle(el).flexWrap)).toBe('nowrap');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    await page.screenshot({path:testInfo.outputPath('spielerpass-vorschau-feinheiten.png'),fullPage:false});

    await fein.click();
    await expect(fein).toHaveAttribute('aria-expanded','false');
    const wiederZu=await masse(vorschau,portraet);
    expect(Math.abs(wiederZu.portraet.width-vorher.portraet.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(wiederZu.vorschau.height-vorher.vorschau.height)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
