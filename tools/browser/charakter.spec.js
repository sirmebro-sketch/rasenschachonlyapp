import {test,expect} from '@playwright/test';

test('Spielerpass: kompakte Ansicht, feste Merkmale, Karriere starten',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.getByRole('button',{name:'Überspringen'}).click();
 await page.getByRole('button',{name:'NEUE LAUFBAHN ab Seite 3'}).click();
 const details=page.getByRole('button',{name:'Feinheiten',exact:true});
 await expect(details).toHaveAttribute('aria-expanded','false');
 const dice=page.getByRole('button',{name:'Freie Merkmale würfeln'});
 const a=await dice.boundingBox(),b=await details.boundingBox();
 expect(Math.abs(a.y-b.y)).toBeLessThan(1);
 await page.getByRole('textbox',{name:'Name der Spielerin oder des Spielers'}).fill('Alex Testspieler');
 await page.getByRole('textbox',{name:'Rückennummer'}).fill('99');
 await page.getByRole('combobox',{name:'Starker Fuß'}).selectOption({label:'beidfüßig'});
 await page.getByRole('combobox',{name:'Position',exact:true}).selectOption('ZDM');
 await details.click();
 await page.getByRole('button',{name:'Bartwuchs',exact:true}).click();
 const beard=page.getByRole('button',{name:'Ankerbart',exact:true});
 await beard.click();
 await page.getByRole('button',{name:'Bartwuchs festhalten',exact:true}).click();
 await dice.click();
 await expect(beard).toHaveAttribute('aria-pressed','true');
 await details.click();
 await page.screenshot({path:testInfo.outputPath('spielerpass.png'),fullPage:true});
 await page.getByRole('button',{name:"Los geht's",exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Name der Spielerin oder des Spielers'})).toHaveCount(0);
 expect(errors).toEqual([]);
});

test('Galerie: alle Merkmale beider Auswahlen und Freischaltungen',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/sichtprobe.html');
 for(const gender of ['m','w']){
  await page.getByRole('combobox',{name:'Geschlecht',exact:true}).selectOption(gender);
  const fields=await page.getByRole('combobox',{name:'Merkmal',exact:true}).locator('option').evaluateAll(options=>options.map(o=>o.value));
  for(const field of fields){
   await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption(field);
   expect(await page.getByRole('img',{name:'Spielerporträt',exact:true}).count()).toBeGreaterThan(0);
   await expect(page.locator('main')).not.toContainText('undefined');
  }
  await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption('schmuck');
  await expect(page.getByRole('img',{name:'Spielerporträt',exact:true})).toHaveCount(8);
  await page.getByRole('checkbox',{name:'Freischaltungen',exact:true}).uncheck();
  await expect(page.getByRole('img',{name:'Spielerporträt',exact:true})).toHaveCount(2);
  await page.getByRole('checkbox',{name:'Freischaltungen',exact:true}).check();
 }
 await page.getByRole('combobox',{name:'Geschlecht',exact:true}).selectOption('m');
 await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption('bart');
 await page.screenshot({path:testInfo.outputPath('baerte.png'),fullPage:true});
 expect(errors).toEqual([]);
});
