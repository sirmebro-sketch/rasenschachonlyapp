import {test,expect} from '@playwright/test';

const vereinOeffnen=async page=>{
 await page.getByRole('button',{name:/Dein Verein 1/}).click();
 await page.getByRole('button',{name:/Profimannschaft 1/}).click();
};
test('Vereinswirtschaft: Ausbau, Preis und Sponsor überstehen erneutes Laden',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/spieltest.html');
 await page.getByRole('button',{name:'Vereinswirtschaft',exact:true}).click();
 await page.getByRole('button',{name:'Verstanden',exact:true}).click();
 await vereinOeffnen(page);
 await expect(page.getByText(/Gründe zuerst deine Jugendakademie/)).toBeVisible();
 await page.getByRole('button',{name:'Führung',exact:true}).click();
 await page.getByRole('button',{name:'Bauen · 4 Mio €',exact:true}).click();
 await expect(page.getByText('46 Mio €',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Im Bau · noch 2 Saisons',exact:true})).toBeDisabled();
 await page.getByRole('slider',{name:'Eintritt Preisfaktor',exact:true}).press('ArrowRight');
 await expect(page.getByRole('slider',{name:'Eintritt Preisfaktor',exact:true})).toHaveValue('1.02');
 await page.getByRole('button',{name:'Partner',exact:true}).click();
 await page.getByRole('button',{name:'Unterschreiben',exact:true}).first().click();
 await expect(page.getByText('Partner · 1 von 3',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Gespeicherten Stand laden',exact:true}).click();
 await vereinOeffnen(page);
 await page.getByRole('button',{name:'Führung',exact:true}).click();
 await expect(page.getByText('46 Mio €',{exact:true})).toBeVisible();
 await expect(page.getByRole('slider',{name:'Eintritt Preisfaktor',exact:true})).toHaveValue('1.02');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:info.outputPath('vereinsfuehrung.png'),fullPage:true});
 await page.getByRole('button',{name:'Partner',exact:true}).click();
 await expect(page.getByText('Partner · 1 von 3',{exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});

test('Kurzer Bildschirm: Namenseingabe bleibt frei und langer Name vollständig',async({page},info)=>{
 await page.setViewportSize({width:320,height:420});
 await page.goto('/.preview/sichtprobe.html');
 await page.getByRole('button',{name:'erstellung',exact:true}).click();
 const input=page.getByRole('textbox',{name:'Name der Spielerin oder des Spielers'});
 const name='Alexandermilian Maximilianus';
 await input.fill(name);
 await expect(input).toBeInViewport();
 const box=await input.boundingBox();
 const free=await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName,{x:box.x+box.width/2,y:box.y+box.height/2});
 expect(free).toBe('INPUT');
 const label=page.locator('.char-vorschau [title]').first();
 await expect(label).toContainText(name);
 expect(await label.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:info.outputPath('name-kurzer-bildschirm.png'),fullPage:false});
});
