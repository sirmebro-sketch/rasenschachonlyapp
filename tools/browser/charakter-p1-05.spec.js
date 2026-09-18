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

const touchWisch=async(page,rail,richtung='links')=>{
 await rail.scrollIntoViewIfNeeded();
 const box=await rail.boundingBox();
 expect(box).not.toBeNull();
 const viewport=page.viewportSize();
 expect(viewport).not.toBeNull();
 const x=Math.max(2,Math.min(viewport.width-2,Math.round(box.x+box.width/2)));
 const y=Math.max(2,Math.min(viewport.height-2,Math.round(box.y+Math.min(box.height/2,44))));
 const cdp=await page.context().newCDPSession(page);
 /* Chromiums Synthese erzeugt die eigentliche Touch-Scrollgeste. Der Start
    wird vorher in den realen Viewport gebracht: "visible" allein bedeutet
    bei Playwright nicht, dass CDP-Koordinaten bereits im Viewport liegen. */
 await cdp.send('Input.synthesizeScrollGesture',{
  x,y,
  // CDP definiert positive xDistance als "nach links scrollen".
  xDistance:Math.round(Math.min(box.width,viewport.width)*.58)*(richtung==='links'?1:-1),
  speed:650,
  preventFling:true,
  gestureSourceType:'touch'
 });
 await cdp.detach();
 await page.waitForTimeout(180);
};

const oeffneErstellung=async(page,url)=>{
 await page.goto(url);
 if(url.includes('sichtprobe')){
  await page.getByRole('button',{name:'erstellung',exact:true}).click();
 }else{
  await page.getByRole('button',{name:'Überspringen'}).click();
  await page.getByRole('button',{name:'NEUE LAUFBAHN ab Seite 3'}).click();
 }
 const fein=page.getByRole('button',{name:'Feinheiten',exact:true});
 await fein.click();
 await expect(fein).toHaveAttribute('aria-expanded','true');
 const panel=page.locator('[id$="-feinheiten"]');
 await expect(panel).toBeVisible();
 const rail=panel.locator('[data-char-kategorien="true"]');
 const hinweis=panel.locator('.char-kategorie-hinweis');
 await expect(rail).toBeVisible();
 await expect(hinweis).toBeVisible();
 return {panel,rail,hinweis};
};

const bisZumEndeWischen=async(page,rail)=>{
 for(let i=0;i<6 && await rail.getAttribute('data-am-ende')!=='true';i++)await touchWisch(page,rail,'links');
 await expect(rail).toHaveAttribute('data-am-ende','true');
};

for(const url of ['/', '/.preview/spieltest.html'])test('CHAR-P1-05: Feineinstellung bleibt bedienbar, Wischhinweis reagiert und Auswahl wird gespeichert '+url,async({page},testInfo)=>{
 test.skip(!['schmal','handy'].includes(testInfo.project.name),'CHAR-P1-05 nimmt die beiden geforderten Smartphone-Breiten ab.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const {panel,rail,hinweis}=await oeffneErstellung(page,url);

 // Am linken Rand sagt die Leiste ausdrücklich, dass rechts weitere Kategorien
 // folgen. Die Seite selbst darf weiterhin nicht horizontal überlaufen.
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 const railMass=await rail.evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollLeft:el.scrollLeft}));
 expect(railMass.scrollWidth).toBeGreaterThan(railMass.clientWidth);
 expect(railMass.scrollLeft).toBeLessThanOrEqual(8);
 await expect(rail).toHaveAttribute('data-am-anfang','true');
 await expect(hinweis).toHaveText('Wischen · weitere Kategorien →');
 await page.screenshot({path:testInfo.outputPath('char-p1-05-wisch-start.png'),fullPage:false});

 // Echter Touch-Wischweg über CDP statt direkter Manipulation von scrollLeft.
 await touchWisch(page,rail,'links');
 await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(20);
 await expect(rail).toHaveAttribute('data-am-anfang','false');
 await expect(rail).toHaveAttribute('data-am-ende','false');
 await expect(hinweis).toHaveText('← Kategorien wischen →');

 // Zurück zum Anfang wischen; die Auswahl-/Festhalteprüfung beginnt damit in
 // derselben Ausgangslage wie zuvor.
 await touchWisch(page,rail,'rechts');
 await expect.poll(()=>rail.getAttribute('data-am-anfang')).toBe('true');
 await expect(hinweis).toHaveText('Wischen · weitere Kategorien →');

 // Sichtbare aktuelle Auswahl plus Festhalten: zwei Merkmale festlegen, dann
 // würfeln. Beide müssen unverändert markiert bleiben.
 const hautKat=page.getByRole('button',{name:/^Hautton(?: · fest)?$/});
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

 // Auch der Weg bis ans rechte Ende erfolgt durch echte Touch-Gesten. Dort
 // dreht der Hinweis sinnvoll um und die späte Kategorie bleibt klickbar.
 await bisZumEndeWischen(page,rail);
 await expect(hinweis).toHaveText('← Frühere Kategorien · wischen');
 const details=page.getByRole('button',{name:'Besondere Merkmale',exact:true});
 await details.click();
 await expect(details).toHaveAttribute('aria-pressed','true');
 await expect(panel.locator('button.btn[aria-pressed]:not(.sm)').first()).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('char-p1-05-wisch-ende.png'),fullPage:false});

 const endeVorher=await rail.evaluate(el=>el.scrollLeft);
 await touchWisch(page,rail,'rechts');
 await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeLessThan(endeVorher-10);
 await expect(hinweis).toHaveText('← Kategorien wischen →');

 // Pflichtaktionen bleiben trotz Sticky-Vorschau und geöffnetem Panel frei.
 const start=page.getByRole('button',{name:"Los geht's",exact:true});
 const zurueck=page.getByRole('button',{name:'Zurück',exact:true});
 for(const knopf of [start,zurueck]){
  await expect(knopf).toBeInViewport();
  const box=await knopf.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
 }

 // Die im Editor gewählten stabilen IDs müssen nach dem echten Karrierestart
 // unverändert im gespeicherten Spieler stehen (Tiefbraun=12, Ankerbart=14).
 const spieler='Alex P105';
 await page.getByRole('textbox',{name:'Name der Spielerin oder des Spielers'}).fill(spieler);
 await start.click();
 await expect.poll(()=>gespeicherteZuege(page,spieler)).not.toBeNull();
 const zuege=await gespeicherteZuege(page,spieler);
 expect(zuege.haut).toBe(12);
 expect(zuege.bart).toBe(14);
 expect(errors).toEqual([]);
});

test('CHAR-P1-05: isolierte Sichtprobe nutzt denselben Wischhinweis und echte Bedienwege',async({page},testInfo)=>{
 test.skip(!['schmal','handy'].includes(testInfo.project.name),'CHAR-P1-05 nimmt die beiden geforderten Smartphone-Breiten ab.');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const {rail,hinweis}=await oeffneErstellung(page,'/.preview/sichtprobe.html');
 await expect(hinweis).toHaveText('Wischen · weitere Kategorien →');

 await touchWisch(page,rail,'links');
 await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(20);
 await expect(hinweis).toHaveText('← Kategorien wischen →');

 const hautKat=page.getByRole('button',{name:/^Hautton(?: · fest)?$/});
 await hautKat.click();
 await page.getByRole('button',{name:'Tiefbraun',exact:true}).click();
 await page.getByRole('button',{name:'Hautton festhalten',exact:true}).click();
 await expect(hautKat).toHaveAccessibleName('Hautton · fest');
 await page.getByRole('button',{name:'Freie Merkmale würfeln'}).click();
 await hautKat.click();
 await expect(page.getByRole('button',{name:'Tiefbraun',exact:true})).toHaveAttribute('aria-pressed','true');

 await bisZumEndeWischen(page,rail);
 await expect(hinweis).toHaveText('← Frühere Kategorien · wischen');
 await page.getByRole('button',{name:'Besondere Merkmale',exact:true}).click();

 // In der Vorschau sind die Callbacks absichtlich leer. Die Buttons werden
 // trotzdem wirklich geklickt; es darf dabei kein Fehler und keine Pflicht-
 // zwischenaktion entstehen.
 const zurueck=page.getByRole('button',{name:'Zurück',exact:true});
 const start=page.getByRole('button',{name:"Los geht's",exact:true});
 await expect(zurueck).toBeInViewport();
 await expect(start).toBeInViewport();
 await zurueck.click();
 await start.click();
 expect(errors).toEqual([]);
});
