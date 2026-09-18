import React from 'react';
// 35.185: Moderne Porträts verwenden eine zusammenhängende Haarsilhouette.
// Gespeicherte Kennungen bleiben bestehen; Altporträts behalten ihren Renderer.
export function Haarform({index=0,weiblich=false,breite=24,farbe,hell,ebene='vorn',kopfprofil='',kopfpfad=''}){
 const id='haar'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const namen=weiblich
  ? ['kurz','lang','volumen','bob','knoten','seitenzopf','scheitellang','pixie','locken','crop','pferdeschwanz','zoepfe','hoch','naturvolumen','wellen','krause','cornrows','lockenseite','vorhang','fade','locs','iro','schulter','flechtkranz','vollpony','curtain','asymbob','halfup','langzopf','langwellen','twinbuns']
  : ['rasiert','kurz','scheitel','undercut','locken','afro','textur','licht','zoepfe','knoten','vokuhila','glatze','slick','crop','flach','seitlich','wellen','krause','cornrows','lockenseite','vorhang','fade','locs','iro','schulter','flechtkranz','mittellocken','langlocken','boxbraids','locsgebunden','fringe'];
 const typ=namen[index]||'kurz';
 /* CHAR-FIX-04: Die feste Profilbreite aus FIX-03 konnte eine gültige, aber
    sichtbar zu kleine "Perücke" ergeben. Kopfnahe Kurzformen leiten ihre
    horizontale Passung jetzt aus der tatsächlich übergebenen Kopfbreite ab.
    Ein kleiner profilspezifischer Zuschlag deckt die echte Schläfenkurve ab;
    die reale Kopfmaske begrenzt Unterlage und kopfnahe Vorderform wieder exakt. */
 const neueKopfpassform=['trapez','lang','diamant','kurzbreit'].includes(kopfprofil)&&kopfpfad;
 const kompakteTypen=['rasiert','kurz','scheitel','undercut','textur','slick','crop','flach','seitlich','vorhang','fade','pixie','bob','iro','fringe','vollpony','curtain','asymbob'];
 const kopfnaheTypen=['kurz','scheitel','undercut','slick','crop','flach','seitlich','vorhang','fade','pixie','fringe','vollpony','curtain','asymbob'];
 const kompakt=kompakteTypen.includes(typ);
 const kopfnah=kopfnaheTypen.includes(typ);
 const profilBonus={trapez:.8,lang:1.4,diamant:.8,kurzbreit:.8}[kopfprofil]||0;
 const haarbreite=neueKopfpassform&&kompakt?Math.min(31.5,Math.max(breite+profilBonus,24)):breite;
 const dy=0;
 const transform=`translate(50 ${dy}) scale(${haarbreite/24} 1) translate(-50 0)`;
 if(typ==='glatze')return null;
 if(ebene==='hinten'){
  let d='';
  if(['lang','scheitellang','volumen','bob','vokuhila','schulter'].includes(typ)){
   const y=typ==='bob'?62:typ==='vokuhila'?68:typ==='schulter'?75:82;
   d=`M25 36 C20 50 22 ${y-5} 30 ${y} Q36 ${y+2} 38 ${y-5} L37 35 Z M75 36 C80 50 78 ${y-5} 70 ${y} Q64 ${y+2} 62 ${y-5} L63 35 Z`;
  }
  if(typ==='locs')d='M27 33 C22 47 23 66 27 79 L32 79 L34 38 Z M35 31 C31 49 33 70 36 82 L41 82 L42 35 Z M65 31 C69 49 67 70 64 82 L59 82 L58 35 Z M73 33 C78 47 77 66 73 79 L68 79 L66 38 Z';
  if(['pferdeschwanz','seitenzopf'].includes(typ))d='M69 23 C85 20 87 41 80 55 Q76 66 74 73 Q82 54 73 43 Q68 32 65 29 Z';
  if(typ==='zoepfe')d='M29 32 Q17 40 24 62 Q25 68 29 71 Q28 56 33 42 Z M71 32 Q83 40 76 62 Q75 68 71 71 Q72 56 67 42 Z';
  if(typ==='knoten'||typ==='hoch')d=typ==='hoch'?'M34 19 C26 3 48 1 52 7 C63 -1 79 11 66 23 Z':'M42 16 C33 5 44 1 51 3 C64 2 68 15 57 19 Z';
  if(typ==='mittellocken')d='M25 33 Q18 45 24 61 Q26 68 31 68 Q29 54 36 39 Z M75 33 Q82 45 76 61 Q74 68 69 68 Q71 54 64 39 Z';
  if(['langlocken','langwellen'].includes(typ))d='M25 32 Q17 46 23 60 Q18 70 26 83 L33 82 Q28 69 35 58 Q29 48 37 36 Z M75 32 Q83 46 77 60 Q82 70 74 83 L67 82 Q72 69 65 58 Q71 48 63 36 Z';
  if(typ==='boxbraids')d='M26 31 Q22 49 25 80 L30 80 Q27 53 33 35 Z M35 30 Q32 52 36 84 L41 84 Q38 56 42 34 Z M65 30 Q68 52 64 84 L59 84 Q62 56 58 34 Z M74 31 Q78 49 75 80 L70 80 Q73 53 67 35 Z';
  if(typ==='locsgebunden')d='M66 24 Q83 22 82 39 Q81 50 73 58 Q70 69 73 80 L66 80 Q63 65 68 53 Q73 42 64 31 Z';
  if(['vollpony','curtain'].includes(typ))d='M25 32 Q19 47 24 70 L31 75 Q29 57 36 37 Z M75 32 Q81 47 76 70 L69 75 Q71 57 64 37 Z';
  if(typ==='asymbob')d='M25 34 Q20 45 27 52 L32 51 L36 36 Z M74 31 Q82 47 74 65 L66 66 L63 35 Z';
  if(typ==='halfup')d='M25 32 Q19 49 25 78 L32 79 Q29 57 36 37 Z M75 32 Q81 49 75 78 L68 79 Q71 57 64 37 Z M39 18 Q35 8 49 6 Q60 6 61 13 Q71 9 76 16 Q79 23 70 30 Q65 34 60 33 Q65 21 56 17 Q48 13 39 18 Z';
  if(typ==='langzopf')d='M68 28 Q82 34 74 49 Q82 58 73 68 Q80 77 70 87 L65 84 Q72 76 66 68 Q73 58 67 50 Q74 40 64 33 Z';
  if(typ==='twinbuns')d='M24 27 Q16 20 21 12 Q27 5 35 11 Q40 18 33 27 Z M76 27 Q84 20 79 12 Q73 5 65 11 Q60 18 67 27 Z';
  if(!d)return null;
  return <g data-haar-typ={typ} data-haar-ebene="hinten" data-haar-profil={kopfprofil||'standard'} transform={transform}>
   <path d={d} fill={farbe}/><path d={d} fill="none" stroke={hell} strokeWidth=".45" opacity=".18"/>
   {typ==='boxbraids'&&<g fill="none" stroke={hell} strokeWidth=".8" opacity=".62">
    {[44,52,60,68,76].map((y,i)=><React.Fragment key={y}>
     <path d={`M${26+(i%2)} ${y} l5 2`}/><path d={`M${35+(i%2)} ${y+1} l6 2`}/>
     <path d={`M${59-(i%2)} ${y+1} l6 -2`}/><path d={`M${69-(i%2)} ${y} l5 -2`}/>
    </React.Fragment>)}
   </g>}
   {typ==='langzopf'&&<g fill="none" stroke={hell} strokeWidth=".9" opacity=".68">
    <path d="M69 39 l7 4 M68 47 l8 4 M68 56 l8 4 M68 65 l7 4 M67 74 l7 4"/>
    <path d="M76 43 l-7 4 M76 51 l-8 5 M76 60 l-8 5 M75 69 l-8 5"/>
   </g>}
   {typ==='locsgebunden'&&<g fill="none" stroke={hell} strokeWidth=".7" opacity=".45">
    <path d="M67 36 l7 1 M66 44 l8 1 M65 52 l8 1 M66 61 l7 1 M68 70 l5 1"/>
   </g>}
  </g>;
 }
 // Die Unterlage deckt die tatsächliche Schädelkurve ab; einzelne Strähnen
 // dürfen keine hautfarbenen Spalten am Scheitel oder an den Schläfen lassen.
 const schlaefe=25+10*24/haarbreite;
 /* CHAR-FIX-04: Die Unterlage der neuen Köpfe ist absichtlich größer als jede
    reale Kopfkontur. Erst die echte Kopfmaske macht daraus die sichtbare Form.
    Damit kann weder eine feste Ellipse noch eine historische Profilbreite an
    breiten Schläfen oder am oberen Schädelrand einen Hautkeil offen lassen. */
 const scalp=neueKopfpassform
  ? 'M12 52 C10 11 27 3 50 3 C73 3 90 11 88 52 Q73 35 50 29 Q27 35 12 52 Z'
  : `M25 42 C24 20 ${schlaefe} 11 50 11 C${100-schlaefe} 11 76 20 75 42 Q70 34 50 30 Q30 34 25 42 Z`;
 /* Rasiert bleibt bewusst transparent. Auf den neuen Köpfen folgt auch diese
    Kappe der realen Breite und wird anschließend an der Kopfmaske beschnitten,
    statt als zu kleiner dunkler Fleck aufzuliegen. */
 const rasierKappe=neueKopfpassform
  ? 'M22 38 C24 16 37 8 50 8 C63 8 76 16 78 38 Q64 29 50 30 Q36 29 22 38 Z'
  : 'M26 34 C28 18 38 11 50 11 C62 11 72 18 74 34 Q62 29 50 30 Q38 29 26 34 Z';
 const base='M25 41 C24 21 32 11 49 10 C66 8 77 22 75 41 C70 35 64 31 50 31 C36 31 30 36 25 41 Z';
 const swept='M25 41 C23 27 28 12 45 9 C61 5 73 14 76 31 Q69 25 60 27 Q42 34 27 33 Z';
 const curls='M24 42 Q21 35 24 29 Q20 23 27 19 Q25 13 32 13 Q33 7 40 10 Q43 4 49 8 Q56 3 61 9 Q68 6 72 13 Q80 13 77 22 Q82 27 77 33 L75 42 Q70 34 65 34 Q60 29 56 33 Q50 29 45 33 Q38 29 34 34 Q29 32 24 42 Z';
 const afro='M23 45 Q16 40 19 33 Q13 28 19 22 Q16 15 25 14 Q24 6 33 8 Q37 1 44 5 Q51 0 58 5 Q66 1 71 9 Q79 7 80 15 Q88 16 83 25 Q89 31 82 37 Q84 43 76 46 Q74 33 63 31 Q48 26 34 32 Q27 35 23 45 Z';
 let d=base;
 if(['scheitel','wellen','seitlich','pixie'].includes(typ))d=swept;
 if(['locken','krause','lockenseite'].includes(typ))d=curls;
 if(['afro','volumen'].includes(typ))d=afro;
 if(typ==='naturvolumen')d='M29 44 Q22 39 25 31 Q20 24 28 20 Q25 12 36 12 Q38 4 48 8 Q56 2 64 10 Q75 9 74 20 Q82 24 76 32 Q79 39 71 44 Q65 35 59 36 Q50 31 41 36 Q35 34 29 44 Z';
 if(typ==='rasiert')d=rasierKappe;
 if(typ==='undercut')d='M28 37 C26 24 29 12 43 10 C58 5 72 13 74 27 Q71 32 67 32 Q49 28 31 37 Z';
 if(typ==='fade')d='M27 34 C26 19 36 9 50 9 C64 9 74 19 73 34 Q63 29 50 30 Q37 29 27 34 Z';
 if(typ==='bob')d='M24 46 C21 24 29 9 50 9 C71 9 79 24 76 46 L70 50 L68 31 Q50 36 32 31 L30 50 Z';
 if(typ==='lang')d='M24 46 C22 22 31 9 49 9 C68 8 78 24 76 46 L70 50 Q72 31 58 26 Q46 35 29 34 L29 49 Z';
 if(typ==='pferdeschwanz')d='M25 42 C23 23 33 9 50 9 C68 9 77 23 75 42 L69 36 Q65 30 50 29 Q35 30 31 36 Z';
 if(typ==='seitenzopf')d='M25 42 C23 22 34 9 50 9 Q73 8 76 35 Q60 24 55 28 Q42 39 27 35 Z';
 if(typ==='textur')d='M25 42 Q22 30 28 23 Q24 15 37 14 Q35 7 46 11 Q49 4 56 11 Q68 7 68 18 Q78 17 75 33 L74 41 Q61 28 48 31 Q34 29 25 42 Z';
 if(typ==='licht'){
  // Teilkurven derselben Schädel-Bezier: kein gerader Steg über der Glatze.
  const t=.76,u=1-t,x=25*u*u*u+79*u*u*t+3*schlaefe*u*t*t+50*t*t*t,y=42*u*u*u+61*u*u*t+35*u*t*t+11*t*t*t;
  const c=25+(schlaefe-25)*t*t,cy=42-40*t+9*t*t;
  d=`M25 42 C25 ${42-20*t} ${c} ${cy} ${x} ${y} Q32 26 33 38 L30 47 L25 44 Z M75 42 C75 ${42-20*t} ${100-c} ${cy} ${100-x} ${y} Q68 26 67 38 L70 47 L75 44 Z`;
 }
 if(typ==='slick'||typ==='hoch')d='M25 41 C23 23 30 11 45 8 C64 4 78 21 75 41 Q65 30 50 30 Q35 30 25 41 Z';
 if(typ==='crop')d=weiblich
  ?'M26 42 C23 23 32 10 50 10 Q70 9 75 30 Q66 23 58 27 Q49 29 39 40 Q34 44 28 39 Z'
  :'M25 41 Q23 29 29 23 L28 18 L36 18 L35 13 L43 15 L47 9 L53 14 L61 11 L65 18 Q75 20 75 39 L69 32 L62 36 L55 31 L48 37 L41 32 L34 37 Z';
 if(typ==='flach')d='M25 41 L27 18 Q29 8 39 8 L62 8 Q73 8 74 22 L75 41 Q67 31 50 31 Q33 31 25 41 Z';
 if(typ==='wellen')d='M24 42 Q21 26 29 18 Q33 9 44 11 Q55 4 66 13 Q77 14 76 35 Q69 29 62 30 Q55 26 49 30 Q39 27 31 36 Z';
 if(typ==='pixie')d='M26 40 C22 22 33 10 50 10 Q70 9 75 31 Q66 23 56 27 Q47 35 29 32 Z';
 if(typ==='seitlich')d='M25 42 C23 21 33 9 52 9 Q73 10 75 35 Q60 28 52 29 Q38 26 27 37 Z';
 if(typ==='krause')d='M25 41 Q22 33 25 27 Q22 21 29 18 Q30 11 36 13 Q41 7 47 11 Q53 7 58 11 Q65 9 70 16 Q77 16 75 24 Q80 29 75 41 Q67 31 61 34 Q54 30 48 34 Q39 30 32 36 Z';
 if(typ==='lockenseite')d='M24 42 Q20 31 24 25 Q21 18 30 16 Q29 9 39 10 Q43 3 50 9 Q61 4 66 12 Q75 12 76 23 L75 42 Q67 31 60 32 Q54 27 49 32 Q43 29 38 36 Q31 32 24 42 Z';
 if(typ==='vorhang'||typ==='scheitellang')d='M24 45 C21 22 31 8 49 10 Q67 7 75 24 Q79 35 75 45 L68 39 Q58 36 50 23 Q43 37 31 40 Z';
 // CHAR-P1-03: neue Kategorien sind append-only und bewusst als andere Silhouetten angelegt.
 if(typ==='locs')d='M24 43 C21 23 31 8 50 9 C69 8 79 23 76 43 Q68 32 61 32 Q50 26 39 32 Q32 32 24 43 Z';
 if(typ==='iro')d='M28 41 Q26 28 35 22 L40 20 L42 7 L47 12 L50 2 L54 12 L59 7 L61 20 L66 22 Q75 28 72 41 Q62 31 50 31 Q38 31 28 41 Z';
 if(typ==='schulter')d='M24 47 C21 23 30 8 50 9 C70 8 79 23 76 47 L69 55 L67 32 Q58 26 51 22 Q43 26 33 32 L31 55 Z';
 if(typ==='flechtkranz')d='M25 42 C22 25 30 11 43 10 Q50 4 57 10 C70 11 78 25 75 42 Q66 33 60 33 Q50 28 40 33 Q33 33 25 42 Z';
 if(typ==='mittellocken')d='M23 46 Q19 35 24 28 Q21 21 30 18 Q30 10 39 12 Q45 5 51 11 Q60 6 67 14 Q77 14 77 25 Q82 34 75 46 L70 51 Q64 40 58 42 Q50 37 43 42 Q35 38 29 50 Z';
 if(typ==='langlocken')d='M23 47 Q19 35 24 27 Q21 19 31 17 Q32 9 40 11 Q46 4 52 10 Q62 5 68 14 Q78 14 77 25 Q82 34 75 48 L70 59 Q64 47 58 49 Q50 42 43 49 Q35 45 29 59 Z';
 if(typ==='boxbraids')d='M25 43 C22 24 31 9 50 9 C69 9 78 24 75 43 Q68 34 61 33 Q50 27 39 33 Q32 34 25 43 Z M29 31 L26 58 L30 58 L34 34 Z M71 31 L74 58 L70 58 L66 34 Z';
 if(typ==='locsgebunden')d='M25 42 C23 23 31 10 48 9 Q66 7 76 28 L72 36 Q63 29 51 29 Q38 29 29 38 Z';
 if(typ==='fringe')d='M26 43 C22 25 31 10 49 9 Q69 8 76 29 L72 35 Q63 27 56 31 Q52 38 43 47 Q38 50 39 40 Q31 37 26 43 Z';
 if(typ==='vollpony')d='M24 47 C21 23 30 8 50 9 C70 8 79 23 76 47 L70 51 L68 33 L62 34 L60 40 L55 36 L50 41 L45 36 L40 40 L38 34 L31 33 L30 51 Z';
 if(typ==='curtain')d='M24 47 C21 23 30 8 48 9 Q50 11 50 17 Q50 11 52 9 C70 8 79 23 76 47 L70 51 Q64 36 54 25 L52 43 L48 43 L46 25 Q36 36 30 51 Z';
 if(typ==='asymbob')d='M25 46 C22 23 31 9 50 9 Q70 8 76 37 L72 61 Q66 65 64 55 L65 33 Q56 27 50 25 Q41 32 31 36 L30 48 Z';
 if(typ==='halfup')d='M24 47 C21 23 30 9 50 10 C70 9 79 23 76 47 L70 51 Q68 34 58 28 Q50 32 42 28 Q32 34 30 51 Z M39 20 Q39 12 49 10 Q59 11 61 18 Q56 16 50 17 Q44 16 39 20 Z';
 if(typ==='langzopf')d='M25 43 C23 23 32 9 50 9 Q71 8 76 35 Q65 27 56 29 Q46 35 28 36 Z';
 if(typ==='langwellen')d='M23 47 Q20 34 25 27 Q22 19 31 17 Q34 8 43 11 Q50 5 57 11 Q68 8 73 17 Q80 23 76 34 Q80 42 74 49 Q66 39 59 42 Q50 37 42 42 Q34 39 28 51 Z';
 if(typ==='twinbuns')d='M25 42 C23 24 32 10 49 10 Q67 8 75 28 L74 42 Q64 32 55 31 L50 24 L45 31 Q36 32 26 42 Z';
 const unterlage=typ==='rasiert'?rasierKappe:scalp;
 const kopfsaum=neueKopfpassform&&!['rasiert','licht'].includes(typ);
 return <g data-haar-typ={typ} data-haar-ebene="vorn" data-haar-profil={kopfprofil||'standard'} data-haar-breite={haarbreite} data-haar-passung={neueKopfpassform&&kompakt?'kopfkontur':'standard'} data-haar-vorderclip={neueKopfpassform&&kopfnah?'kopf':'frei'}>
  {kopfpfad&&<defs><clipPath id={id+'kopf'} clipPathUnits="userSpaceOnUse"><path d={kopfpfad}/></clipPath><clipPath id={id+'kopfsaum'} clipPathUnits="userSpaceOnUse"><rect x="14" y="2" width="72" height="44"/></clipPath></defs>}
  {typ!=='licht'&&<g clipPath={kopfpfad?'url(#'+id+'kopf)':undefined}><g transform={transform}>
   <path d={unterlage} stroke={typ==='rasiert'?'none':farbe} strokeWidth={.65} fill={['undercut','fade'].includes(typ)?'url(#'+id+'fade)':farbe} opacity={typ==='rasiert'?.32:1}/>
  </g></g>}
  {kopfsaum&&<path d={kopfpfad} fill="none" stroke={farbe} strokeWidth=".9" strokeLinejoin="round" clipPath={'url(#'+id+'kopfsaum)'}/>} 
  <g clipPath={neueKopfpassform&&kopfnah?'url(#'+id+'kopf)':undefined}>
   <g transform={transform}>
    <defs><linearGradient id={id+'farbe'} x1="0" y1="0" x2=".75" y2="1"><stop stopColor={hell}/><stop offset=".38" stopColor={farbe}/><stop offset="1" stopColor={farbe}/></linearGradient><linearGradient id={id+'fade'} x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stopColor={farbe}/><stop offset="1" stopColor={farbe} stopOpacity=".24"/></linearGradient><clipPath id={id+'clip'}><path d={d}/></clipPath></defs>
    {typ!=='rasiert'&&<path d={d} stroke={typ==='licht'?farbe:'none'} strokeWidth={.5} strokeLinejoin="round" fill={'url(#'+id+'farbe)'}/>}
    {typ==='flechtkranz'&&<path d="M29 27 Q38 16 50 17 Q62 16 71 27" fill="none" stroke={hell} strokeWidth="4.2" strokeLinecap="round" strokeDasharray="2 1.5" opacity=".7"/>}
    <g clipPath={'url(#'+id+'clip)'} fill="none" stroke={hell} strokeLinecap="round" opacity=".27">
     {['cornrows','zoepfe','boxbraids','langzopf'].includes(typ)?[-18,-10,-2,6,14,22].map(x=><path key={x} d={`M${50+x} 9 Q${43+x} 24 ${49+x} 42`} strokeWidth="1.5"/>):
      ['locken','krause','lockenseite','afro','volumen','naturvolumen','mittellocken','langlocken','langwellen'].includes(typ)?Array.from({length:18},(_,i)=><path key={i} d={`M${27+(i%6)*8} ${18+Math.floor(i/6)*7} q-2 -3 2 -4 q4 0 3 3`} strokeWidth=".7"/>):
      typ==='locsgebunden'?[28,36,44,52,60,68].map(x=><path key={x} d={`M${x} 12 Q${x-4} 26 ${x+1} 39`} strokeWidth="1.15"/>):
      typ!=='rasiert'&&typ!=='licht'&&typ!=='flechtkranz'&&[0,1,2].map(i=><path key={i} d={['slick','hoch','knoten'].includes(typ)?`M${32+i*12} 30 Q${27+i*12} 15 ${42+i*8} 8`:`M${29+i*3} ${29-i*4} Q48 ${12-i*2} ${70-i*4} ${25-i*3}`} strokeWidth=".8"/>)}
    </g>
   </g>
  </g>
 </g>;
}