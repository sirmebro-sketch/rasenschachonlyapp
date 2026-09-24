import {test,expect} from '@playwright/test';

const AKA_KEY='rs-pruefung:rasenschach:akademie';

async function vereinUndAkademieOeffnen(page){
  await page.getByRole('button',{name:/Dein Verein 1/}).click();
  await page.getByRole('button',{name:/Jugendakademie/}).click();
  await page.getByRole('button',{name:'Ausbau',exact:true}).click();
}

async function startAkademie(page){
  await page.goto('/.preview/spieltest.html');
  await page.getByRole('button',{name:'Akademie-Kacheln',exact:true}).click();
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Verstanden',exact:true}).click();
  await vereinUndAkademieOeffnen(page);
}

async function standLaden(page){
  await page.getByRole('button',{name:'Gespeicherten Stand laden',exact:true}).click();
  await vereinUndAkademieOeffnen(page);
}

async function akademieStand(page){
  return page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),AKA_KEY);
}

async function vcSetzen(page,vc){
  await page.evaluate(({key,vc})=>{
    const a=JSON.parse(sessionStorage.getItem(key));
    a.vc=vc;
    sessionStorage.setItem(key,JSON.stringify(a));
  },{key:AKA_KEY,vc});
  await standLaden(page);
}

test.beforeEach(async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await startAkademie(page);
});

test('KAUF-03: neun Kacheln sind verständlich, eigenständig bebildert und öffnen ohne Buchung',async({page},info)=>{
  const kacheln=page.locator('.kauf-kachel');
  await expect(kacheln).toHaveCount(9);

  const inhalt=await kacheln.evaluateAll(nodes=>nodes.map(el=>({
    titel:el.querySelector('strong')?.textContent?.trim()||'',
    nutzen:el.querySelector('.kauf-nutzen')?.textContent?.trim()||'',
    preis:el.querySelector('.kauf-preis')?.textContent?.trim()||'',
    status:el.querySelector('.kauf-status')?.textContent?.trim()||'',
    icon:!!el.querySelector('svg.kauf-icon[aria-hidden="true"]'),
    breite:el.getBoundingClientRect().width,
    hoehe:el.getBoundingClientRect().height,
  })));
  expect(new Set(inhalt.map(x=>x.titel)).size).toBe(9);
  for(const k of inhalt){
    expect(k.icon,k.titel+' hat ein SVG-Motiv').toBe(true);
    expect(k.nutzen.length,k.titel+' erklärt den Nutzen').toBeGreaterThan(10);
    expect(k.preis.length,k.titel+' zeigt Preis oder Maximum').toBeGreaterThan(2);
    expect(k.status.length,k.titel+' zeigt den Zustand').toBeGreaterThan(5);
    expect(k.breite,k.titel+' bleibt als Touchziel breit genug').toBeGreaterThanOrEqual(44);
    expect(k.hoehe,k.titel+' bleibt als Touchziel hoch genug').toBeGreaterThanOrEqual(44);
  }

  const vorher=JSON.stringify(await akademieStand(page));
  const training=page.getByRole('button',{name:/Trainingsplätze Stufe/});
  await training.click();
  const dialog=page.getByRole('dialog',{name:'Trainingsplätze'});
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Bessere Plätze erhöhen die Grundstärke neuer Talente und ihren jährlichen Zuwachs. Der Ausbau wird einmalig mit VC bezahlt.',{exact:true})).toBeVisible();
  await expect(dialog.getByText('Stufe 1 / 6',{exact:true})).toBeVisible();
  await expect(dialog.getByText('16 VC',{exact:true})).toHaveCount(2);
  await expect(dialog.getByText('2 / 6',{exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'Schließen',exact:true}).click();
  await expect(training).toBeFocused();
  expect(JSON.stringify(await akademieStand(page))).toBe(vorher);

  await page.screenshot({path:info.outputPath('kauf-03-uebersicht.png'),fullPage:true});
});

test('KAUF-03: Tastatur, Fokusbindung, Escape, Zurück und Scrollposition funktionieren',async({page})=>{
  const ziel=page.getByRole('button',{name:/Profi-Netzwerk Stufe/});
  await ziel.scrollIntoViewIfNeeded();
  const scrollVorher=await page.evaluate(()=>scrollY);
  await ziel.click();
  const dialog=page.getByRole('dialog',{name:'Profi-Netzwerk'});
  await expect(dialog.getByRole('button',{name:'Schließen',exact:true})).toBeFocused();

  for(let i=0;i<6;i++){
    await page.keyboard.press(i%2?'Shift+Tab':'Tab');
    expect(await page.evaluate(()=>document.activeElement?.closest('dialog')?.classList.contains('kauf-detail')===true),
      'Tab-Fokus bleibt im modalen Detail').toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(ziel).toBeFocused();
  expect(Math.abs((await page.evaluate(()=>scrollY))-scrollVorher)).toBeLessThanOrEqual(1);

  await ziel.click();
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await expect(ziel).toBeFocused();
  expect(Math.abs((await page.evaluate(()=>scrollY))-scrollVorher)).toBeLessThanOrEqual(1);
});

test('KAUF-03: höchste Anzeigegröße, Ruhemodus und kurze Bildschirmhöhe bleiben bedienbar',async({page},info)=>{
  await page.evaluate(()=>{
    sessionStorage.setItem('rs-pruefung:rasenschach:text','4');
    sessionStorage.setItem('rs-pruefung:rasenschach:ruhe','1');
  });
  await standLaden(page);
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--skala').trim())).toBe('1.5');

  const raster=page.locator('.kauf-uebersicht');
  expect(await raster.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);
  expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath('kauf-03-sehr-gross.png'),fullPage:true});

  await page.setViewportSize({width:320,height:420});
  const training=page.getByRole('button',{name:/Trainingsplätze Stufe/});
  await training.click();
  const dialog=page.getByRole('dialog',{name:'Trainingsplätze'});
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);

  const schliessen=dialog.getByRole('button',{name:'Schließen',exact:true});
  const kaufen=dialog.getByRole('button',{name:'Auf Stufe 2 ausbauen · 16 VC',exact:true});
  for(const knopf of [schliessen,kaufen]){
    await knopf.scrollIntoViewIfNeeded();
    await expect(knopf).toBeInViewport();
    const box=await knopf.boundingBox();
    expect(box?.height||0).toBeGreaterThanOrEqual(44);
    expect(box?.width||0).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath('kauf-03-kurze-hoehe.png'),fullPage:false});
});

test('KAUF-03: knappes Guthaben, exakter Preis und Maximalstufe sind eindeutig',async({page})=>{
  await vcSetzen(page,17);
  const scouting=page.getByRole('button',{name:/Scouting Stufe/});
  await expect(scouting).toContainText('18 VC');
  await expect(scouting).toContainText('Noch 1 VC nötig');
  await scouting.click();
  let dialog=page.getByRole('dialog',{name:'Scouting'});
  await expect(dialog.getByText('Noch 1 VC nötig.',{exact:true})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Auf Stufe 2 ausbauen · 18 VC',exact:true})).toBeDisabled();
  await dialog.getByRole('button',{name:'Schließen',exact:true}).click();

  const medizin=page.getByRole('button',{name:/Medizin Stufe/});
  await expect(medizin).toContainText('Stufe 6 / 6');
  await expect(medizin).toContainText('Voll ausgebaut');
  await expect(medizin).toContainText('Maximum erreicht');
  await medizin.click();
  dialog=page.getByRole('dialog',{name:'Medizin'});
  await expect(dialog.getByText('Vollständig ausgebaut.',{exact:true})).toBeVisible();
  await expect(dialog.getByRole('button',{name:/ausbauen/})).toHaveCount(0);
  await dialog.getByRole('button',{name:'Schließen',exact:true}).click();

  await vcSetzen(page,16);
  const training=page.getByRole('button',{name:/Trainingsplätze Stufe/});
  await expect(training).toContainText('Ausbau möglich');
  await training.click();
  dialog=page.getByRole('dialog',{name:'Trainingsplätze'});
  await dialog.getByRole('button',{name:'Auf Stufe 2 ausbauen · 16 VC',exact:true}).click();
  await expect(dialog.getByRole('status')).toContainText('Stufe 2 gespeichert');
  await expect(dialog.getByText('0 VC',{exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'Schließen',exact:true}).click();
  await standLaden(page);
  await expect(page.getByRole('button',{name:/Trainingsplätze Stufe/})).toContainText('Stufe 2 / 6');
});

test('KAUF-03: verzögerte Speicherung und Doppeltipp buchen nur einmal und melden nicht vorzeitig Erfolg',async({page})=>{
  await page.evaluate(key=>{
    const proto=Storage.prototype;
    window.__kauf03OriginalSet=proto.setItem;
    window.__kauf03Writes=0;
    proto.setItem=function(k,v){
      if(this===sessionStorage && k===key){
        let neu=null;
        try{neu=JSON.parse(v);}catch{}
        if(neu?.vc===0){
          window.__kauf03Writes++;
          return new Promise(resolve=>setTimeout(()=>{
            window.__kauf03OriginalSet.call(this,k,v);
            resolve();
          },500));
        }
      }
      return window.__kauf03OriginalSet.call(this,k,v);
    };
  },AKA_KEY);

  const training=page.getByRole('button',{name:/Trainingsplätze Stufe/});
  await training.click();
  const dialog=page.getByRole('dialog',{name:'Trainingsplätze'});
  const kaufen=dialog.getByRole('button',{name:'Auf Stufe 2 ausbauen · 16 VC',exact:true});
  await kaufen.evaluate(el=>{el.click();el.click();});
  await expect(dialog.getByRole('button',{name:'Wird gespeichert …',exact:true})).toBeDisabled();
  await page.waitForTimeout(120);
  await expect(dialog.getByRole('status')).not.toContainText('gespeichert');
  expect((await akademieStand(page)).vc).toBe(16);

  await expect(dialog.getByRole('status')).toContainText('Stufe 2 gespeichert',{timeout:5000});
  expect(await page.evaluate(()=>window.__kauf03Writes)).toBe(1);
  const stand=await akademieStand(page);
  expect(stand.vc).toBe(0);
  expect(stand.stufen.plaetze).toBe(2);

  await page.evaluate(()=>{Storage.prototype.setItem=window.__kauf03OriginalSet;});
  await dialog.getByRole('button',{name:'Schließen',exact:true}).click();
  await standLaden(page);
  await expect(page.getByRole('button',{name:/Trainingsplätze Stufe/})).toContainText('Stufe 2 / 6');
});

test('KAUF-03: fehlgeschlagene Speicherung zeigt keinen Erfolg und erlaubt genau einen sauberen Wiederholungsversuch',async({page})=>{
  await page.evaluate(key=>{
    const proto=Storage.prototype;
    window.__kauf03OriginalSet=proto.setItem;
    window.__kauf03Fehler=0;
    proto.setItem=function(k,v){
      if(this===sessionStorage && k===key){
        let neu=null;
        try{neu=JSON.parse(v);}catch{}
        if(neu?.vc===0 && window.__kauf03Fehler===0){
          window.__kauf03Fehler++;
          throw new Error('KAUF-03 simulierter Speicherfehler');
        }
      }
      return window.__kauf03OriginalSet.call(this,k,v);
    };
  },AKA_KEY);

  const training=page.getByRole('button',{name:/Trainingsplätze Stufe/});
  await training.click();
  const dialog=page.getByRole('dialog',{name:'Trainingsplätze'});
  await dialog.getByRole('button',{name:'Auf Stufe 2 ausbauen · 16 VC',exact:true}).click();
  await expect(dialog.getByRole('status')).toHaveText('Ausbau nicht gespeichert. Bitte erneut versuchen.');
  await expect(dialog.getByRole('status')).not.toContainText('Stufe 2 gespeichert');
  let stand=await akademieStand(page);
  expect(stand.vc).toBe(16);
  expect(stand.stufen.plaetze??1).toBe(1);

  await page.evaluate(()=>{Storage.prototype.setItem=window.__kauf03OriginalSet;});
  const erneut=dialog.getByRole('button',{name:'Auf Stufe 2 ausbauen · 16 VC',exact:true});
  await expect(erneut).toBeEnabled();
  await erneut.click();
  await expect(dialog.getByRole('status')).toContainText('Stufe 2 gespeichert');
  stand=await akademieStand(page);
  expect(stand.vc).toBe(0);
  expect(stand.stufen.plaetze).toBe(2);
});
