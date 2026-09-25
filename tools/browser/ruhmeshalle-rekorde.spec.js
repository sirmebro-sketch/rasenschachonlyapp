import {test,expect} from '@playwright/test';

test('Ruhmeshalle: Rekordbuch ist auf mobilen Breiten korrekt beschriftet und lesbar',async({page},info)=>{
 await page.goto('/.preview/spieltest.html');
 await page.getByRole('button',{name:'Fortgeschritten',exact:true}).click();
 await page.getByRole('button',{name:/Ruhmeshalle/}).click();

 const buch=page.getByTestId('rekordbuch');
 await expect(buch).toBeVisible();
 for(const name of ['Bestwerte','Gesamtbilanz','Stationen & Rollen'])
  await expect(buch.getByRole('region',{name,exact:true})).toBeVisible();

 await expect(buch.getByText('Pflichtspiele',{exact:true})).toBeVisible();
 await expect(buch.getByText('Spiele ohne Gegentor',{exact:true})).toBeVisible();
 await expect(buch.getByText('Laufbahnen als Kapitän',{exact:true})).toBeVisible();
 await expect(buch.getByText('Meiste Pflichtspiele',{exact:true})).toHaveCount(0);
 await expect(buch.getByText('Saisons als Kapitän',{exact:true})).toHaveCount(0);
 await expect(buch.getByText('Ältester Einsatz',{exact:true})).toHaveCount(0);

 expect(await buch.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 const lang=buch.getByText('Spiele ohne Gegentor',{exact:true});
 expect(await lang.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);

 await buch.screenshot({path:info.outputPath('ruhmeshalle-rekordbuch.png')});
});
