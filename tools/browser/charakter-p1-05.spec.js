import {test,expect} from '@playwright/test';

const gespeicherteZuege=async(page,spieler)=>page.evaluate((name)=>{
 for(const wert of [...Object.values(localStorage),...Object.values(sessionStorage)]){
  try{
   const stand=JSON.parse(wert);
   if(stand?.p?.name===name)return stand.p.zuege || null;
  }catch{}
 }
 return null;
},spieler);

for(const url of ['/', '/.preview/spieltest.html'])test('CHAR-P1-05: Feineinstellung bleibt bei 320/390 px bedienbar und speichert die Auswahl '+url,async({page},testInfo)=>{
 test.skip(!['schmal','handy'].includes(testInfo.project.name),'CHAR-P1-05 nimmt die beiden geforderten Smartphone-Breiten ab.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);
 await page.getByRole('button',{name:'Überspringen'}).click();
 await page.getByRole('button',{name:'NEUE LAUFBAHN ab Seite 3'}).click();

 const spieler='Alex P105';
 await page.getByRole('textbox',{name:'Name der Spielerin oder des Spielers'}).fill(spieler);
 const fein=page.getByRole('button',{name:'Feinheiten',exact:true});
 await fein.click();
 await expect(fein).toHaveAttribute('aria-expanded','true');
 const panel=page.locator('[id$="-feinheiten"]');
 await expect(panel).toBeVisible();

 // Die Seite selbst darf nicht seitlich weglaufen. Nur die Kategorien haben
 // bewusst ihre eigene horizontale Wischspur. Der Container wird ueber einen
 // stabil benannten echten Knopf verankert statt ueber einen :has-Locator.
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 const hautKat=page.getByRole('button',{name:/^Hautton(?: · fest)?$/});
 const rail=hautKat.locator('..');
 const railMass=await rail.evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
 expect(railMass.scrollWidth).toBeGreaterThan(railMass.clientWidth);

 // Sichtbare aktuelle Auswahl plus Festhalten: zwei Merkmale festlegen, dann
 // wuerfeln. Beide muessen unveraendert markiert bleiben.
 const hautKatBox=await hautKat.boundingBox();
 expect(hautKatBox.height).toBeGreaterThanOrEqual(44);
 await hautKat.click();
 await expect(hautKat).toHaveAttribute('aria-pressed','true');
 const haut=page.getByRole('button',{name:'Tiefbraun',exact:true});
 await haut.click();
 await expect(haut).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Hautton festhalten',exact:true}).click();
 await expect(hautKat).toHaveAccessibleName('Hautton · fest');

 const bartKat=page.getByRole('button',{name:/^Bartwuchs(?: · fest)?$/});
 await bartKat.click();
 const bart=page.getByRole('button',{name:'Ankerbart',exact:true});
 await bart.click();
 await page.getByRole('button',{name:'Bartwuchs festhalten',exact:true}).click();
 await expect(bartKat).toHaveAccessibleName('Bartwuchs · fest');
 await page.getByRole('button',{name:'Freie Merkmale würfeln'}).click();
 await bartKat.click();
 await expect(bart).toHaveAttribute('aria-pressed','true');
 await hautKat.click();
 await expect(haut).toHaveAttribute('aria-pressed','true');

 // Auch die spaeten Kategorien muessen ueber dieselbe Wischspur erreichbar
 // bleiben, statt unter einem langen Knopfteppich zu verschwinden.
 await rail.evaluate(el=>{el.scrollLeft=el.scrollWidth;});
 const details=page.getByRole('button',{name:'Besondere Merkmale',exact:true});
 await details.click();
 await expect(details).toHaveAttribute('aria-pressed','true');
 await expect(panel.locator('button.btn[aria-pressed]:not(.sm)').first()).toBeVisible();

 // Pflichtaktionen bleiben trotz Sticky-Vorschau und geoeffnetem Panel frei.
 const start=page.getByRole('button',{name:"Los geht's",exact:true});
 const zurueck=page.getByRole('button',{name:'Zurück',exact:true});
 for(const knopf of [start,zurueck]){
  await expect(knopf).toBeInViewport();
  const box=await knopf.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
 }
 await page.screenshot({path:testInfo.outputPath('char-p1-05-feinheiten.png'),fullPage:true});

 // Die im Editor gewaehlten stabilen IDs muessen nach dem echten Karrierestart
 // unveraendert im gespeicherten Spieler stehen (Tiefbraun=12, Ankerbart=14).
 await start.click();
 await expect.poll(()=>gespeicherteZuege(page,spieler)).not.toBeNull();
 const zuege=await gespeicherteZuege(page,spieler);
 expect(zuege.haut).toBe(12);
 expect(zuege.bart).toBe(14);
 expect(errors).toEqual([]);
});
