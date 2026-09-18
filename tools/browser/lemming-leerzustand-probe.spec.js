import {test,expect} from '@playwright/test';

const mobileOnly=(testInfo)=>test.skip(testInfo.project.name==='desktop','LEMMING-Leerzustandsprobe nur bei 320/390 px.');

async function evidence(page,testInfo,name){
  await page.screenshot({path:testInfo.outputPath(name+'.png'),fullPage:true});
  const body=(await page.locator('body').innerText()).replace(/\n{3,}/g,'\n\n');
  const buttons=await page.getByRole('button').evaluateAll(bs=>bs.map(b=>({
    text:(b.innerText||'').trim().replace(/\s+/g,' '),
    aria:b.getAttribute('aria-label'),
    disabled:b.disabled
  })));
  await testInfo.attach(name+'.json',{body:Buffer.from(JSON.stringify({url:page.url(),body,buttons},null,2)),contentType:'application/json'});
}

async function isolatedState(page,{hausKarrieren=0,vereinBekannt=false}={}){
  await page.goto('/.preview/spieltest.html');
  await page.evaluate(({hausKarrieren,vereinBekannt})=>{
    const pre='rs-pruefung:';
    Object.keys(sessionStorage).filter(k=>k.startsWith(pre)).forEach(k=>sessionStorage.removeItem(k));
    const set=(k,v)=>sessionStorage.setItem(pre+k,JSON.stringify(v));
    set('rasenschach:willkommen',{schirm:true,aka:true,verein:true});
    set('rasenschach:gesamt',{karrieren:hausKarrieren,hausKarrieren,saisons:hausKarrieren*5});
    set('rasenschach:akademie',{
      name:'',gegruendet:null,jahr:2026,vc:0,verdient:0,ausgegeben:0,jahrgaenge:0,
      stufen:{},talente:[],absolventen:[],chronik:[],ruhm:0,faelle:[],
      bilanz:{aufgenommen:0,profis:0,weltklasse:0,nationalspieler:0,turniere:0,abbrecher:0}
    });
    set('rasenschach:karten',{karten:[]});
    if(vereinBekannt)set('rasenschach:verein',{
      gekannt:true,gegruendet:false,name:'Prüfverein',stadt:'Prüfstadt',
      farben:{primaer:'#c0392b',sekundaer:'#f4f1ea'},
      wappen:{form:'schild',zeichen:'raute',muster:'einfarbig'},muster:'einfarbig',
      jahr:0,eingeschrieben:false,kader:[],formation:'442',taktik:'ausgeglichen',
      aufstellung:{},bonus:{},chronik:[],faelle:[],
      bilanz:{saisons:0,aufstiege:0,abstiege:0,meister:0,tore:0,gegentore:0,punkte:0,bestePlatzierung:null},
      ausbau:{training:1,stadion:1,medizin:1}
    });
  },{hausKarrieren,vereinBekannt});
  await page.reload();
  await expect(page.getByText('In dieser Ausgabe',{exact:true})).toBeVisible();
}

test('LEMMING QA: Erststart ohne vorhandene Karriere',async({page},testInfo)=>{
  mobileOnly(testInfo);
  await page.goto('/.preview/spieltest.html');
  await page.getByRole('button',{name:'Neues Spiel',exact:true}).click();

  await expect(page.getByText('Willkommen',{exact:true})).toBeVisible();
  await evidence(page,testInfo,'01-willkommen-laufbahn');
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await expect(page.getByText('Die Jugendakademie',{exact:true})).toBeVisible();
  await evidence(page,testInfo,'02-willkommen-akademie');
  await page.getByRole('button',{name:'Weiter',exact:true}).click();
  await expect(page.getByText('Dein eigener Verein',{exact:true})).toBeVisible();
  await evidence(page,testInfo,'03-willkommen-verein');
  await page.getByRole('button',{name:"Los geht's",exact:true}).click();

  await expect(page.getByText('noch keine Laufbahn beendet',{exact:true})).toBeVisible();
  await expect(page.getByRole('button').filter({hasText:'Dein Verein'}).first()).toBeDisabled();
  await expect(page.getByText(/noch 2 Laufbahnen bis zur Freischaltung/)).toBeVisible();
  await evidence(page,testInfo,'04-erststart-hauptmenue');

  await page.getByRole('button').filter({hasText:'Ruhmeshalle'}).first().click();
  await expect(page.getByText('Noch leer',{exact:true})).toBeVisible();
  await expect(page.getByText('Spiel eine Laufbahn zu Ende, dann steht sie hier.',{exact:true})).toBeVisible();
  await evidence(page,testInfo,'05-ruhmeshalle-leer');
  await page.getByRole('button',{name:'Zurück',exact:true}).first().click();
  await expect(page.getByText('In dieser Ausgabe',{exact:true})).toBeVisible();

  await page.getByRole('button',{name:'Vermächtnis-Laden',exact:true}).click();
  await expect(page.getByText('Vermächtnis-Laden',{exact:true})).toBeVisible();
  await evidence(page,testInfo,'06-vermaechtnis-laden-null-vc');
  await page.getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(page.getByText('In dieser Ausgabe',{exact:true})).toBeVisible();
});

test('LEMMING QA: freigeschaltetes Vereinsdach ohne Karten und Akademiespieler',async({page},testInfo)=>{
  mobileOnly(testInfo);
  await isolatedState(page,{hausKarrieren:2,vereinBekannt:true});

  await page.getByRole('button').filter({hasText:'Dein Verein'}).first().click();
  await expect(page.getByText('gründen kostet nichts',{exact:true})).toBeVisible();
  await expect(page.getByText(/Noch 3 Laufbahnen bis zur Freischaltung/)).toBeVisible();
  await evidence(page,testInfo,'07-vereinsdach-ohne-akademie-karten');

  await page.getByRole('button',{name:'Fundus, 0 Karten',exact:true}).click();
  await expect(page.getByText('Noch nichts gesammelt. Öffne ein Pack.',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Zum Laden',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Zurück',exact:true})).toBeVisible();
  await evidence(page,testInfo,'08-sammlung-leer');

  await page.getByRole('button',{name:'Zum Laden',exact:true}).click();
  await expect(page.getByText('Packs',{exact:true})).toBeVisible();
  await expect(page.getByText('Dein Konto:')).toBeVisible();
  await evidence(page,testInfo,'09-packs-null-vc');
  await page.getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(page.getByText('Dein Verein',{exact:true}).first()).toBeVisible();

  await page.getByRole('button').filter({hasText:'Jugendakademie'}).first().click();
  await expect(page.getByRole('button',{name:/Akademie gründen/})).toBeVisible();
  await expect(page.getByText(/kostenlos · drei Jahrgänge rücken sofort ein/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Zurück',exact:true})).toBeVisible();
  await evidence(page,testInfo,'10-akademie-ungegruendet');
  await page.getByRole('button',{name:'Zurück',exact:true}).click();
  await expect(page.getByText('Dein Verein',{exact:true}).first()).toBeVisible();
});

test('LEMMING QA: Profimannschaft freigeschaltet, aber Akademie nie gegründet',async({page},testInfo)=>{
  mobileOnly(testInfo);
  await isolatedState(page,{hausKarrieren:5,vereinBekannt:true});

  await page.getByRole('button').filter({hasText:'Dein Verein'}).first().click();
  const profi=page.getByRole('button').filter({hasText:'Profimannschaft'}).first();
  await expect(profi).toBeEnabled();
  await evidence(page,testInfo,'11-vereinsdach-fuenf-laeufe-ohne-akademie');
  await profi.click();

  await expect(page.getByText('In welcher Liga?',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Zurück',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'In den Spielbetrieb',exact:true})).toBeEnabled();
  await evidence(page,testInfo,'12-profimannschaft-ligawahl-ohne-akademie');
  await page.getByRole('button',{name:'In den Spielbetrieb',exact:true}).click();

  await expect(page.getByRole('button',{name:'Noch 16 Spieler nötig',exact:true})).toBeDisabled();
  await expect(page.getByText('Zurzeit ist niemand alt genug. Lass die Akademie ein Jahr laufen.',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Zurück',exact:true})).toBeVisible();
  await evidence(page,testInfo,'13-profimannschaft-ohne-spieler');
  await page.getByRole('button',{name:'Zurück',exact:true}).last().click();
  await expect(page.getByText('Dein Verein',{exact:true}).first()).toBeVisible();
});
