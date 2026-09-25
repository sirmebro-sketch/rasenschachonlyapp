import {test,expect} from '@playwright/test';
const key='rs-pruefung:rasenschach:stand';
const stand=page=>page.evaluate(k=>JSON.parse(sessionStorage.getItem(k)).p,key);
async function oeffnen(page){
 await page.getByRole('button',{name:'WEITER SPIELEN ab Seite 2',exact:true}).click();
 await page.getByRole('button',{name:'Vermögen',exact:true}).click();
}
test.beforeEach(async({page})=>{
 await page.goto('/.preview/spieltest.html');
 await page.getByRole('button',{name:'Vermögenskauf',exact:true}).click();
 for(let i=0;i<2;i++)await page.getByRole('button',{name:'Verstanden',exact:true}).click();
 await oeffnen(page);
});
test('Vermögen: Voraussetzung, getrennte Bestätigung und Wiederladen',async({page},info)=>{
 await expect(page.locator('.kauf-kachel')).toHaveCount(30);
 const raster=page.locator('.vermoegen-kompakt .kauf-raster').first();
 const spalten=await raster.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
 expect(spalten).toBe(info.project.name==='desktop'?3:2);
 await expect(page.locator('.vermoegen-kompakt .kauf-nutzen')).toHaveCount(0);
 await expect(page.locator('.vermoegen-kompakt .kauf-stufe')).toHaveCount(0);
 await page.screenshot({path:info.outputPath('vermoegen-kompakt.png'),fullPage:true});
 await page.getByRole('button',{name:/^Haus im Grünen /}).click();
 let dialog=page.getByRole('dialog');
 await expect(dialog.getByRole('button',{name:/Kaufen/})).toBeDisabled();
 await expect(dialog).toContainText('Voraussetzung: Eigentumswohnung');
 await page.keyboard.press('Escape');
 const wohnung=page.getByRole('button',{name:/^Eigentumswohnung /});
 await wohnung.click();
 expect((await stand(page)).money).toBe(2);
 await dialog.getByRole('button',{name:'Kaufen · 350 Tsd €',exact:true}).click();
 await expect(dialog.getByRole('status')).toHaveText('Kauf gespeichert.');
 expect((await stand(page)).assets).toEqual(['wohnung']);
 expect((await stand(page)).money).toBe(1.65);
 await expect(dialog.getByRole('button',{name:/Kaufen/})).toBeDisabled();
 expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 await page.screenshot({path:info.outputPath('vermoegen-kauf.png')});
 await dialog.getByRole('button',{name:'Schließen',exact:true}).click();
 await page.getByRole('button',{name:'Gespeicherten Stand laden',exact:true}).click();
 await oeffnen(page);
 await expect(page.getByRole('button',{name:/^Eigentumswohnung /})).toContainText('Vorhanden');
 await page.getByRole('button',{name:/^Haus im Grünen /}).click();
 await expect(page.getByRole('dialog')).toContainText('Nicht genug Geld verfügbar');
});
test('Anlagen: Mindestbetrag verfügbar, genau buchen und vollständig auflösen',async({page})=>{
 await page.getByRole('button',{name:/^Staatsanleihen /}).click();
 const dialog=page.getByRole('dialog');
 await dialog.getByRole('button',{name:'200 Tsd € anlegen',exact:true}).click();
 await expect(dialog.getByRole('status')).toHaveText('Anlage gespeichert.');
 expect((await stand(page)).money).toBe(1.8);
 expect((await stand(page)).depot.anleihe).toBe(.2);
 await dialog.getByRole('button',{name:'Depot auflösen · 200 Tsd €',exact:true}).click();
 await expect(dialog.getByRole('status')).toHaveText('Auflösung gespeichert.');
 expect((await stand(page)).money).toBe(2);
 expect((await stand(page)).depot.anleihe).toBe(0);
});
test('Vermögenskauf: langsamer Speicher sperrt Doppeltippen und Schließen',async({page})=>{
 await page.getByRole('button',{name:/^Eigentumswohnung /}).click();
 await page.evaluate(()=>{const orig=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){
  if(k==='rs-pruefung:rasenschach:stand' && JSON.parse(v).p.assets.includes('wohnung'))return new Promise(resolve=>setTimeout(()=>{orig.call(this,k,v);resolve()},500));
  return orig.call(this,k,v);
 }});
 const dialog=page.getByRole('dialog'),buy=dialog.getByRole('button',{name:'Kaufen · 350 Tsd €',exact:true});
 await buy.evaluate(el=>{el.click();el.click()});
 await expect(dialog.getByRole('button',{name:'Wird gespeichert …',exact:true})).toBeDisabled();
 await dialog.getByRole('button',{name:'Schließen',exact:true}).click();
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('status')).toHaveText('Kauf gespeichert.');
 const p=await stand(page);expect(p.money).toBe(1.65);expect(p.assets).toEqual(['wohnung']);
});
test('Vermögenskauf: Speicherfehler zeigt keinen Erfolg, alter Stand bleibt ladbar',async({page})=>{
 await page.getByRole('button',{name:/^Eigentumswohnung /}).click();
 await page.evaluate(()=>{const orig=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){
  if(k==='rs-pruefung:rasenschach:stand' && JSON.parse(v).p.assets.includes('wohnung'))throw Error('Test: Speicherausfall');return orig.call(this,k,v);
 }});
 await page.getByRole('dialog').getByRole('button',{name:'Kaufen · 350 Tsd €',exact:true}).click();
 await expect(page.getByText('Spielstand nicht geladen',{exact:true})).toBeVisible();
 expect((await stand(page)).money).toBe(2);expect((await stand(page)).assets).toEqual([]);
 await page.reload();await oeffnen(page);
 await expect(page.getByRole('button',{name:/^Eigentumswohnung /})).toContainText('Verfügbar');
});
