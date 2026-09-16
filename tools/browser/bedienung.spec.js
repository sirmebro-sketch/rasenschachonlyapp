import {test,expect} from '@playwright/test';
test('Einstellungen bleiben bei großer Anzeige bedienbar und gespeichert',async({page},testInfo)=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Überspringen',exact:true}).click();
 await page.getByRole('button',{name:'Optionen',exact:true}).click();
 for(const name of ['Darstellung','Bedienung','Spielweise','Spielstand','Hilfe & Ausgabe'])await expect(page.getByRole('region',{name,exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Anzeigegröße Sehr groß',exact:true}).click();
 await page.getByRole('button',{name:'Animationen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Animationen',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByRole('button',{name:'Zurück',exact:true}).click();
 await page.getByRole('button',{name:'Optionen',exact:true}).click();
 await expect(page.getByRole('button',{name:'Anzeigegröße Sehr groß',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('button',{name:'Animationen',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.screenshot({path:testInfo.outputPath('einstellungen.png'),fullPage:true});
});
test('Sonderschuss kann nach einem Versuch abgeschlossen werden',async({page})=>{
 await page.goto('/.preview/sichtprobe.html');
 await page.getByRole('button',{name:'training',exact:true}).click();
 await page.getByRole('checkbox',{name:'Animationen aus',exact:true}).check();
 await page.getByRole('button',{name:'Sonderschuss starten',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Sonderschuss',exact:true});
 await dialog.getByRole('button',{name:'Schießen (ohne Bewegung)',exact:true}).click();
 await expect(dialog.getByRole('button',{name:/Schießen/})).toHaveCount(0);
 await dialog.getByRole('button',{name:'Weiter',exact:true}).click();
 await expect(dialog).toHaveCount(0);
});
