import {test,expect} from '@playwright/test';

const MERKMALE=['augen','brauen','nase','mund','wangen','details'];

async function rasterAbstand(page){
 return page.locator('[data-testid="varianten"] article').evaluateAll(async nodes=>{
  const render=async(node)=>{
   const svg=node.querySelector('svg[aria-label="Spielerporträt"]');
   const size=Number(svg.getAttribute('width'))||72;
   const xml=new XMLSerializer().serializeToString(svg);
   const url=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml'}));
   try{
    const img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,size,size);
    return {id:Number(node.getAttribute('data-id')),px:ctx.getImageData(0,0,size,size).data,size};
   }finally{URL.revokeObjectURL(url);}
  };
  const rasters=await Promise.all(nodes.map(render));
  let min=null;
  for(let a=0;a<rasters.length;a++)for(let b=a+1;b<rasters.length;b++){
   const A=rasters[a],B=rasters[b],n=A.size*A.size;let delta=0,geaendert=0,maxDelta=0;
   for(let p=0;p<n;p++){
    const i=p*4,d=Math.abs(A.px[i]-B.px[i])+Math.abs(A.px[i+1]-B.px[i+1])+Math.abs(A.px[i+2]-B.px[i+2]);
    delta+=d;if(d>12)geaendert++;if(d>maxDelta)maxDelta=d;
   }
   const x={a:A.id,b:B.id,changedPixels:geaendert,changedRatio:geaendert/n,meanRgbDelta:delta/(n*3*255),maxRgbDelta:maxDelta/3};
   if(!min||x.meanRgbDelta<min.meanRgbDelta)min=x;
  }
  return {count:rasters.length,min};
 });
}

test('CHAR-P1-02: echte Gesichtszüge bleiben in Spielgrößen rasterseitig unterscheidbar',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Die vollständige Rastermetrik läuft einmal; responsive Sichtproben folgen separat.');
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/gesichtszuege.html');
 await expect(page.getByRole('heading',{name:'CHAR-P1-02 · Gesichtszüge'})).toBeVisible();
 const messung=[];
 for(const geschlecht of ['m','w']){
  await page.getByRole('combobox',{name:'Geschlecht'}).selectOption(geschlecht);
  for(const haut of ['0','7','13']){
   await page.getByRole('combobox',{name:'Hautton'}).selectOption(haut);
   for(const groesse of ['72','96']){
    await page.getByRole('combobox',{name:'Größe'}).selectOption(groesse);
    for(const merkmal of MERKMALE){
     await page.getByRole('combobox',{name:'Merkmal'}).selectOption(merkmal);
     const m=await rasterAbstand(page);
     expect(m.count,`${geschlecht}/${haut}/${groesse}/${merkmal}`).toBeGreaterThan(1);
     expect(m.min.changedPixels,`Raster-Dublette ${geschlecht}/${haut}/${groesse}/${merkmal}`).toBeGreaterThan(0);
     messung.push({geschlecht,haut:Number(haut),groesse:Number(groesse),merkmal,...m});
    }
   }
  }
 }
 await testInfo.attach('gesichtszuege-rastermetrik.json',{body:Buffer.from(JSON.stringify(messung,null,2)),contentType:'application/json'});
 expect(errors).toEqual([]);
});

test('CHAR-P1-02: Vergleichsbögen für kleine und normale Spielgröße',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/gesichtszuege.html');
 const bilder=[
  {g:'m',haut:'0',groesse:'72',suffix:'m-hell-72'},
  {g:'w',haut:'13',groesse:'96',suffix:'w-dunkel-96'},
  {g:'m',haut:'7',groesse:'145',suffix:'m-mittel-145'},
 ];
 for(const b of bilder){
  await page.getByRole('combobox',{name:'Geschlecht'}).selectOption(b.g);
  await page.getByRole('combobox',{name:'Hautton'}).selectOption(b.haut);
  await page.getByRole('combobox',{name:'Größe'}).selectOption(b.groesse);
  await page.getByRole('checkbox',{name:'Beschriftung'}).uncheck();
  for(const merkmal of MERKMALE){
   await page.getByRole('combobox',{name:'Merkmal'}).selectOption(merkmal);
   await expect(page.locator('[data-testid="varianten"] article')).not.toHaveCount(0);
   await page.screenshot({path:testInfo.outputPath(`gesicht-${b.suffix}-${merkmal}.png`),fullPage:true});
  }
 }
 await page.getByRole('combobox',{name:'Geschlecht'}).selectOption('w');
 await page.getByRole('combobox',{name:'Hautton'}).selectOption('7');
 await page.getByRole('combobox',{name:'Größe'}).selectOption('72');
 await page.getByRole('combobox',{name:'Merkmal'}).selectOption('augen');
 await page.getByRole('checkbox',{name:'Beschriftung'}).uncheck();
 await page.getByTestId('kombinationen').screenshot({path:testInfo.outputPath('gesicht-kombinationen-w-72.png')});
 expect(errors).toEqual([]);
});
