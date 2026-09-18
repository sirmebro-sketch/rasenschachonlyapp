import {test,expect} from '@playwright/test';

const PACKS=[
 ['bronze','BRONZE',false],
 ['silber','SILBER',false],
 ['gold','GOLD',true],
 ['legende','LEGENDÄR',true],
];

async function packsOeffnen(page){
 await page.goto('/.preview/sichtprobe.html');
 await page.getByRole('button',{name:'packs',exact:true}).click();
}

async function packVon(page,label){
 const text=page.locator('svg text').filter({hasText:new RegExp('^'+label+'$')});
 await expect(text).toHaveCount(1);
 return text.locator('xpath=../..');
}

async function bewegung(pack){
 return pack.evaluate(el=>{
  const teile=[...el.querySelectorAll('.rs-folienfarbe,.rs-folienzug')];
  return {
   laufend:[...el.getAnimations({subtree:true})]
    .filter(a=>a.playState==='running')
    .map(a=>a.animationName)
    .filter(Boolean)
    .sort(),
   stand:teile.map(teil=>{
    const css=getComputedStyle(teil);
    return {
     klasse:teil.getAttribute('class'),
     transform:css.transform,
     opacity:css.opacity,
    };
   }),
  };
 });
}

async function animiertWennErlaubt(page){
 for(const [stufe,label,glanz] of PACKS){
  const pack=await packVon(page,label);
  const effekt=pack.locator(':scope > .rs-materialkante');
  if(!glanz){
   await expect(effekt,`${stufe}: bewusst keine Materialanimation`).toHaveCount(0);
   expect(await pack.evaluate(el=>el.getAnimations({subtree:true}).length),
    `${stufe}: ohne versteckte Packanimation`).toBe(0);
   continue;
  }
  await expect(effekt,`${stufe}: Materialfolie vorhanden`).toHaveCount(1);
  await page.waitForTimeout(120);
  const vorher=await bewegung(pack);
  await page.waitForTimeout(650);
  const nachher=await bewegung(pack);
  expect(vorher.laufend,`${stufe}: Farbschimmer läuft normal`).toContain('rs-folienfarbe');
  expect(vorher.laufend,`${stufe}: Lichtzug läuft normal`).toContain('rs-folienzug');
  expect(nachher.stand,`${stufe}: sichtbarer Materialstand verändert sich`).not.toEqual(vorher.stand);
 }
}

async function komplettStill(page,grund){
 for(const [stufe,label,glanz] of PACKS){
  const pack=await packVon(page,label);
  const effekt=pack.locator(':scope > .rs-materialkante');
  if(!glanz){
   await expect(effekt,`${stufe}: bewusst keine Materialfolie`).toHaveCount(0);
  }else{
   await expect(effekt,`${stufe}: Materialfolie bleibt gestalterisch erhalten`).toHaveCount(1);
  }
  const vorher=await bewegung(pack);
  await page.waitForTimeout(700);
  const nachher=await bewegung(pack);
  expect(vorher.laufend,`${stufe}: ${grund} stoppt laufende Animationen`).toEqual([]);
  expect(nachher.laufend,`${stufe}: ${grund} bleibt still`).toEqual([]);
  expect(nachher.stand,`${stufe}: ${grund} ohne Translation/Puls/Rotation/Schweben`).toEqual(vorher.stand);
 }
}

test('OPTIK-P0-01 Packs stehen bei ausgeschalteten Spielanimationen still',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await packsOeffnen(page);
 await expect(page.getByRole('checkbox',{name:'Animationen aus',exact:true})).not.toBeChecked();
 await animiertWennErlaubt(page);

 await page.getByRole('checkbox',{name:'Animationen aus',exact:true}).check();
 await expect(page.getByRole('checkbox',{name:'Animationen aus',exact:true})).toBeChecked();
 await komplettStill(page,'Spiel-Ruhemodus');
});

test('OPTIK-P0-01 Packs respektieren die Systempraeferenz fuer reduzierte Bewegung',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await packsOeffnen(page);
 await animiertWennErlaubt(page);

 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),
  'Browser meldet reduzierte Bewegung').toBe(true);
 await komplettStill(page,'Systempraeferenz');
});
