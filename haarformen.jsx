import React from 'react';
// 35.185: Moderne Porträts verwenden eine zusammenhängende Haarsilhouette.
// Gespeicherte Kennungen bleiben bestehen; Altporträts behalten ihren Renderer.
export function Haarform({index=0,weiblich=false,breite=24,farbe,hell,ebene='vorn',kopfprofil='',kopfpfad=''}){
 const id='haar'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const namen=weiblich
  ? ['kurz','lang','volumen','bob','knoten','seitenzopf','scheitellang','pixie','locken','crop','pferdeschwanz','zoepfe','hoch','afro','wellen','krause','cornrows','lockenseite','vorhang','fade','locs','iro','schulter','flechtkranz']
  : ['rasiert','kurz','scheitel','undercut','locken','afro','textur','licht','zoepfe','knoten','vokuhila','glatze','slick','crop','flach','seitlich','wellen','krause','cornrows','lockenseite','vorhang','fade','locs','iro','schulter','flechtkranz'];
 const typ=namen[index]||'kurz';
 /* CHAR-FIX-03: Profilbreite meint die obere Schädel-/Stirnzone, nicht die
    maximale Wangenbreite. Die vier neuen Köpfe erhalten etwas mehr Haarfläche
    und werden nicht mehr künstlich nach oben gezogen. Dadurch wirken kurze
    Frisuren nicht wie zu kleine aufgesetzte Kappen, während der echte Kopfpfad
    die Unterlage weiterhin exakt begrenzt. */
 const passform={
  trapez:{breite:25.2,dy:0},
  lang:{breite:24.2,dy:0},
  diamant:{breite:25.8,dy:0},
  kurzbreit:{breite:28.2,dy:0},
 }[kopfprofil]||{};
 const haarbreite=passform.breite||breite;
 const dy=passform.dy||0;
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
  if(!d)return null;
  return <g data-haar-typ={typ} data-haar-ebene="hinten" data-haar-profil={kopfprofil||'standard'} transform={transform}><path d={d} fill={farbe}/><path d={d} fill="none" stroke={hell} strokeWidth=".45" opacity=".18"/></g>;
 }
 // Die Unterlage deckt die tatsächliche Schädelkurve ab; einzelne Strähnen
 // dürfen keine hautfarbenen Spalten am Scheitel oder an den Schläfen lassen.
 const schlaefe=25+10*24/haarbreite;
 const neueKopfpassform=['trapez','lang','diamant','kurzbreit'].includes(kopfprofil)&&kopfpfad;
 /* CHAR-FIX-03: Die Haarlinie sitzt zwei bis drei SVG-Einheiten tiefer als in
    CHAR-FIX-01. Genau dort waren im Vollbogen besonders Rasiert/Fade/Undercut
    und mehrere kurze Formen optisch zu klein. Die Unterlage darf großzügig
    sein, weil sie am echten Kopfpfad geclippt wird. */
 const scalp=neueKopfpassform
  ? 'M18 48 C16 14 28 5 50 5 C72 5 84 14 82 48 Q71 34 50 30 Q29 34 18 48 Z'
  : `M25 42 C24 20 ${schlaefe} 11 50 11 C${100-schlaefe} 11 76 20 75 42 Q70 34 50 30 Q30 34 25 42 Z`;
 /* Rasierte Haare brauchen keine dunklen Seitenbänder. Die Kappe ist bewusst
    größer als zuvor, bleibt aber flach und wird auf die echte Kopfhülle
    beschnitten. So wirkt sie wie Haar und nicht wie ein kleiner Fleck oben. */
 const rasierKappe='M26 34 C28 18 38 11 50 11 C62 11 72 18 74 34 Q62 29 50 30 Q38 29 26 34 Z';
 const base='M25 41 C24 21 32 11 49 10 C66 8 77 22 75 41 C70 35 64 31 50 31 C36 31 30 36 25 41 Z';
 const swept='M25 41 C23 27 28 12 45 9 C61 5 73 14 76 31 Q69 25 60 27 Q42 34 27 33 Z';
 const curls='M24 42 Q21 35 24 29 Q20 23 27 19 Q25 13 32 13 Q33 7 40 10 Q43 4 49 8 Q56 3 61 9 Q68 6 72 13 Q80 13 77 22 Q82 27 77 33 L75 42 Q70 34 65 34 Q60 29 56 33 Q50 29 45 33 Q38 29 34 34 Q29 32 24 42 Z';
 const afro='M23 45 Q16 40 19 33 Q13 28 19 22 Q16 15 25 14 Q24 6 33 8 Q37 1 44 5 Q51 0 58 5 Q66 1 71 9 Q79 7 80 15 Q88 16 83 25 Q89 31 82 37 Q84 43 76 46 Q74 33 63 31 Q48 26 34 32 Q27 35 23 45 Z';
 let d=base;
 if(['scheitel','wellen','seitlich','pixie'].includes(typ))d=swept;
 if(['locken','krause','lockenseite'].includes(typ))d=curls;
 if(['afro','volumen'].includes(typ))d=afro;
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
 if(typ==='crop')d='M25 41 C23 20 35 10 50 10 C66 10 77 22 75 41 L70 33 Q62 35 57 33 Q49 35 43 33 Q34 35 30 33 Z';
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
 const unterlage=typ==='rasiert'?rasierKappe:scalp;
 const kopfsaum=neueKopfpassform&&!['rasiert','licht'].includes(typ);
 return <g data-haar-typ={typ} data-haar-ebene="vorn" data-haar-profil={kopfprofil||'standard'} data-haar-breite={haarbreite}>
  {kopfpfad&&<defs><clipPath id={id+'kopf'} clipPathUnits="userSpaceOnUse"><path d={kopfpfad}/></clipPath><clipPath id={id+'kopfsaum'} clipPathUnits="userSpaceOnUse"><rect x="14" y="2" width="72" height="44"/></clipPath></defs>}
  {typ!=='licht'&&<g clipPath={kopfpfad?'url(#'+id+'kopf)':undefined}><g transform={transform}>
   <path d={unterlage} stroke={typ==='rasiert'?'none':farbe} strokeWidth={.65} fill={['undercut','fade'].includes(typ)?'url(#'+id+'fade)':farbe} opacity={typ==='rasiert'?.32:1}/>
  </g></g>}
  {kopfsaum&&<path d={kopfpfad} fill="none" stroke={farbe} strokeWidth=".9" strokeLinejoin="round" clipPath={'url(#'+id+'kopfsaum)'}/>} 
  <g transform={transform}>
   <defs><linearGradient id={id+'farbe'} x1="0" y1="0" x2=".75" y2="1"><stop stopColor={hell}/><stop offset=".38" stopColor={farbe}/><stop offset="1" stopColor={farbe}/></linearGradient><linearGradient id={id+'fade'} x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stopColor={farbe}/><stop offset="1" stopColor={farbe} stopOpacity=".24"/></linearGradient><clipPath id={id+'clip'}><path d={d}/></clipPath></defs>
   {typ!=='rasiert'&&<path d={d} stroke={typ==='licht'?farbe:'none'} strokeWidth={.5} strokeLinejoin="round" fill={'url(#'+id+'farbe)'}/>}
   {typ==='flechtkranz'&&<path d="M29 27 Q38 16 50 17 Q62 16 71 27" fill="none" stroke={hell} strokeWidth="4.2" strokeLinecap="round" strokeDasharray="2 1.5" opacity=".7"/>}
   <g clipPath={'url(#'+id+'clip)'} fill="none" stroke={hell} strokeLinecap="round" opacity=".27">
    {['cornrows','zoepfe'].includes(typ)?[-18,-10,-2,6,14,22].map(x=><path key={x} d={`M${50+x} 9 Q${43+x} 24 ${49+x} 42`} strokeWidth="1.5"/>):
     ['locken','krause','lockenseite','afro','volumen'].includes(typ)?Array.from({length:18},(_,i)=><path key={i} d={`M${27+(i%6)*8} ${18+Math.floor(i/6)*7} q-2 -3 2 -4 q4 0 3 3`} strokeWidth=".7"/>):
     typ!=='rasiert'&&typ!=='licht'&&typ!=='flechtkranz'&&[0,1,2].map(i=><path key={i} d={['slick','hoch','knoten'].includes(typ)?`M${32+i*12} 30 Q${27+i*12} 15 ${42+i*8} 8`:`M${29+i*3} ${29-i*4} Q48 ${12-i*2} ${70-i*4} ${25-i*3}`} strokeWidth=".8"/>)}
   </g>
  </g>
 </g>;
}