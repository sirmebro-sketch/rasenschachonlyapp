/* NUR AUF DEM BETA-ZWEIG. Der Rundgang durch die Vereinswirtschaft, der die
   Befunde vom 18.09.2026 gefunden hat: „0 Tsd €" statt „0 €", der abgeschnittene
   Reiter, die verfallenden Akademiejahre und ein Kaderwerkzeug, das fehlte.
   Er braucht die Testwerkzeuge und laeuft deshalb nur hier. */
import {test,expect} from '@playwright/test';
const tippe=async(p,n,w=350)=>{await p.getByRole('button',{name:n,exact:true}).first().click();await p.waitForTimeout(w);};
const text=async(p)=>(await p.locator('body').innerText()).replace(/\n+/g,' | ');

const aufbau=async(page)=>{
 await page.goto('/');
 await tippe(page,'Überspringen');
 await tippe(page,'Optionen');
 await tippe(page,'+2000 VC');
 await tippe(page,'5 Laufbahnen',1200);
 await tippe(page,'Zurück');
 await page.getByRole('button',{name:/Dein Verein/}).first().click(); await page.waitForTimeout(700);
 await page.getByRole('textbox',{name:'Vereinsname'}).fill('Testverein Nord');
 await page.getByRole('textbox',{name:'Stadt'}).fill('Hamburg');
 await tippe(page,'Verein anlegen',900);
 await page.getByRole('button',{name:/Jugendakademie/}).first().click(); await page.waitForTimeout(700);
 await page.getByRole('button',{name:/Akademie gründen/}).first().click(); await page.waitForTimeout(1200);
 await tippe(page,'Zurück',700); await tippe(page,'Zurück',700);
 await tippe(page,'Optionen',600);
 await page.getByRole('button',{name:/Kader mit Probespielern/}).first().click();
 await page.waitForTimeout(1200);
 await tippe(page,'Zurück',600);
 await page.getByRole('button',{name:/Dein Verein/}).first().click(); await page.waitForTimeout(700);
 await page.getByRole('button',{name:/Profimannschaft/}).first().click(); await page.waitForTimeout(900);
 const land=page.getByRole('combobox').first();
 if(await land.count()) await land.selectOption({label:'Deutschland'}).catch(()=>{});
 await page.waitForTimeout(400);
 await page.getByRole('button',{name:/In den Spielbetrieb/}).first().click();
 await page.waitForTimeout(1200);
};

test('Wirtschaftsreiter rendern sauber und ohne leere Nullen',async({page})=>{
 const fehler=[];
 page.on('pageerror',e=>fehler.push(e.message));
 await aufbau(page);
 for(const r of ['Ausbau','Partner','Chronik']){
  await tippe(page,r,600);
  const t=await text(page);
  expect(t,'NaN im Reiter '+r).not.toContain('NaN');
  expect(t,'undefined im Reiter '+r).not.toContain('undefined');
  /* Eine leere Kasse ist "0 €", nicht "0 Tsd €". Die Ziffer davor muss
     ausgeschlossen werden, sonst trifft die Probe auch "800 Tsd €". */
  expect(t.match(/(^|[^\d])0 Tsd/),'leere Null im Reiter '+r).toBeNull();
 }
 expect(fehler).toEqual([]);
});

test('Die Reiterleiste bleibt auf schmalen Geraeten bedienbar',async({page})=>{
 await aufbau(page);
 for(const w of [320,390]){
  await page.setViewportSize({width:w,height:800});
  await page.waitForTimeout(300);
  /* Kein waagerechter Ueberlauf der SEITE -- die Leiste selbst darf scrollen. */
  const ueber=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(ueber,'Seitenüberlauf bei '+w+'px').toBeLessThanOrEqual(0);
  /* Der letzte Reiter ist erreichbar, auch wenn er zunaechst ausserhalb liegt. */
  const chronik=page.getByRole('button',{name:'Chronik',exact:true}).first();
  await chronik.scrollIntoViewIfNeeded();
  await expect(chronik).toBeInViewport();
 }
});
