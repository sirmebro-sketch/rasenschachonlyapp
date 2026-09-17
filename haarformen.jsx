import React from 'react';
// 35.185: Moderne Porträts verwenden eine zusammenhängende Haarsilhouette.
// Gespeicherte Kennungen bleiben bestehen; Altporträts behalten ihren Renderer.
export function Haarform({index=0,weiblich=false,breite=24,farbe,hell,ebene='vorn',kopfprofil='',kopfpfad=''}){
 const id='haar'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const namen=weiblich
  ? ['kurz','lang','volumen','bob','knoten','seitenzopf','scheitellang','pixie','locken','crop','pferdeschwanz','zoepfe','hoch','afro','wellen','krause','cornrows','lockenseite','vorhang','fade','locs','iro','schulter','flechtkranz']
  : ['rasiert','kurz','scheitel','undercut','locken','afro','textur','licht','zoepfe','knoten','vokuhila','glatze','slick','crop','flach','seitlich','wellen','krause','cornrows','lockenseite','vorhang','fade','locs','iro','schulter','flechtkranz'];
 const typ=namen[index]||'kurz';
 /* CHAR-FIX-01: Kopfbreite ist nicht gleich Stirnbreite. Besonders Diamant
    besitzt breite Wangen, aber eine deutlich schmalere obere Silhouette.
    Alte Köpfe ohne Profil behalten exakt die bisherige Breitenableitung. */
 const passform={
  trapez:{breite:24.6,dy:-1},
  lang:{breite:23.5,dy:0},
  diamant:{breite:25.2,dy:-1},
  kurzbreit:{breite:27.2,dy:-2},
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
  return <g transform={transform}><path d={d} fill={farbe}/><path d={d} fill="none" stroke={hell} strokeWidth=".45" opacity=".18"/></g>;
 }
 // Die Unterlage deckt die tatsächliche Schädelkurve ab; einzelne Strähnen
 // dürfen keine hautfarbenen Spalten am Scheitel oder an den Schläfen lassen.
 const schlaefe=26+9*24/haarbreite;
 const scalp=`M26 40 C26 21 ${schlaefe} 12 50 12 C${100-schlaefe} 12 74 21 74 40 Q69 31 50 28 Q31 31 26 40 Z`;
 /* Rasierte Haare brauchen keine dunklen Seitenbänder. Die kurze Kappe liegt
    nur auf der Schädeloberseite und wird zusätzlich auf die echte Kopfhülle
    beschnitten. So entsteht bei Glatze/Rasiert kein schwarzer Schläfenschatten. */
 const rasierKappe='M28 31 C30 18 38 12 50 12 C62 12 70 18 72 31 Q61 26 50 27 Q39 26 28 31 Z';
 const base='M26 40 C25 21 33 12 49 11 C65 9 76 22 74 40 C70 33 64 29 50 29 C36 29 30 34 26 40 Z';
 const swept='M26 39 C24 27 29 13 45 10 C60 6 72 14 75 30 Q68 23 60 25 Q42 32 28 31 Z';
 const curls='M25 40 Q22 34 25 29 Q21 23 27 20 Q25 14 32 14 Q33 8 40 11 Q43 5 49 9 Q56 4 61 10 Q68 7 71 14 Q79 14 76 22 Q81 27 76 32 L74 40 Q70 32 65 33 Q60 28 56 32 Q50 28 45 32 Q38 28 34 33 Q29 31 25 40 Z';
 const afro='M24 44 Q17 39 20 33 Q14 28 20 23 Q17 16 25 15 Q24 7 33 9 Q37 2 44 6 Q51 1 58 6 Q66 2 70 10 Q78 8 79 16 Q87 17 82 25 Q88 31 81 36 Q83 42 76 45 Q74 32 63 30 Q48 25 34 31 Q27 34 24 44 Z';
 let d=base;
 if(['scheitel','wellen','seitlich','pixie'].includes(typ))d=swept;
 if(['locken','krause','lockenseite'].includes(typ))d=curls;
 if(['afro','volumen'].includes(typ))d=afro;
 if(typ==='rasiert')d=rasierKappe;
 if(typ==='undercut')d='M30 34 C27 24 30 13 43 11 C57 6 70 13 72 25 Q70 30 67 30 Q49 26 32 35 Z';
 if(typ==='fade')d='M29 31 C28 19 37 10 50 10 C63 10 72 19 71 31 Q62 27 50 28 Q38 27 29 31 Z';
 if(typ==='bob')d='M25 45 C22 24 30 10 50 10 C70 10 78 24 75 45 L69 49 L68 30 Q50 35 32 30 L31 49 Z';
 if(typ==='lang')d='M25 45 C23 22 32 10 49 10 C67 9 77 24 75 45 L70 49 Q71 30 58 25 Q46 34 30 33 L30 48 Z';
 if(typ==='pferdeschwanz')d='M26 41 C24 23 34 10 50 10 C67 10 76 23 74 41 L69 35 Q65 29 50 27 Q35 29 31 35 Z';
 if(typ==='seitenzopf')d='M26 41 C24 22 35 10 50 10 Q72 9 75 34 Q60 23 55 27 Q42 38 28 34 Z';
 if(typ==='textur')d='M26 40 Q23 29 29 23 Q25 15 37 15 Q35 8 46 12 Q49 5 56 12 Q67 8 67 18 Q77 17 74 32 L73 39 Q61 26 48 30 Q34 28 26 40 Z';
 if(typ==='licht'){
  // Teilkurven derselben Schädel-Bezier: kein gerader Steg über der Glatze.
  const t=.76,u=1-t,x=26*u*u*u+78*u*u*t+3*schlaefe*u*t*t+50*t*t*t,y=40*u*u*u+63*u*u*t+36*u*t*t+12*t*t*t;
  const c=26+(schlaefe-26)*t*t,cy=40-38*t+10*t*t;
  d=`M26 40 C26 ${40-19*t} ${c} ${cy} ${x} ${y} Q32 25 33 36 L30 46 L26 43 Z M74 40 C74 ${40-19*t} ${100-c} ${cy} ${100-x} ${y} Q68 25 67 36 L70 46 L74 43 Z`;
 }
 if(typ==='slick'||typ==='hoch')d='M26 40 C24 23 31 12 45 9 C63 5 77 21 74 40 Q65 28 50 28 Q35 28 26 40 Z';
 if(typ==='crop')d='M26 39 C24 20 36 11 50 11 C65 11 76 22 74 39 L70 31 Q62 33 57 31 Q49 33 43 31 Q34 33 30 31 Z';
 if(typ==='flach')d='M26 40 L28 18 Q30 9 39 9 L62 9 Q72 9 73 22 L74 40 Q67 29 50 29 Q33 29 26 40 Z';
 if(typ==='wellen')d='M25 40 Q22 26 30 18 Q34 10 44 12 Q55 5 65 14 Q76 15 75 34 Q68 28 62 29 Q55 25 49 29 Q39 26 32 35 Z';
 if(typ==='pixie')d='M27 38 C23 22 34 11 50 11 Q69 10 74 30 Q65 22 56 25 Q47 33 30 30 Z';
 if(typ==='seitlich')d='M26 40 C24 21 34 10 52 10 Q72 11 74 34 Q60 26 52 27 Q38 24 28 35 Z';
 if(typ==='krause')d='M26 39 Q23 32 26 27 Q23 21 29 19 Q30 12 36 14 Q41 8 47 12 Q53 8 58 12 Q65 10 69 17 Q76 17 74 24 Q79 29 74 39 Q67 29 61 32 Q54 28 48 32 Q39 28 32 34 Z';
 if(typ==='lockenseite')d='M25 40 Q21 31 25 25 Q22 18 30 17 Q29 10 39 11 Q43 4 50 10 Q61 5 65 13 Q74 13 75 23 L74 40 Q67 29 60 30 Q54 25 49 30 Q43 27 38 34 Q31 30 25 40 Z';
 if(typ==='vorhang'||typ==='scheitellang')d='M25 44 C22 22 32 9 49 11 Q66 8 74 24 Q78 35 74 44 L68 38 Q58 35 50 22 Q43 36 32 39 Z';
 // CHAR-P1-03: neue Kategorien sind append-only und bewusst als andere Silhouetten angelegt.
 if(typ==='locs')d='M25 42 C22 23 32 9 50 10 C68 9 78 23 75 42 Q67 31 61 31 Q50 25 39 31 Q32 31 25 42 Z';
 if(typ==='iro')d='M29 39 Q27 28 35 22 L40 20 L42 8 L47 13 L50 3 L54 13 L59 8 L61 20 L66 22 Q74 28 71 39 Q62 29 50 29 Q38 29 29 39 Z';
 if(typ==='schulter')d='M25 46 C22 23 31 9 50 10 C69 9 78 23 75 46 L69 54 L67 31 Q58 25 51 21 Q43 25 33 31 L31 54 Z';
 if(typ==='flechtkranz')d='M26 40 C23 25 31 12 43 11 Q50 5 57 11 C69 12 77 25 74 40 Q66 31 60 31 Q50 26 40 31 Q33 31 26 40 Z';
 const unterlage=typ==='rasiert'?rasierKappe:scalp;
 return <g>
  {kopfpfad&&<defs><clipPath id={id+'kopf'} clipPathUnits="userSpaceOnUse"><path d={kopfpfad}/></clipPath></defs>}
  {typ!=='licht'&&<g clipPath={kopfpfad?'url(#'+id+'kopf)':undefined}><g transform={transform}>
   <path d={unterlage} stroke={typ==='rasiert'?'none':farbe} strokeWidth={.65} fill={['undercut','fade'].includes(typ)?'url(#'+id+'fade)':farbe} opacity={typ==='rasiert'?.28:1}/>
  </g></g>}
  <g transform={transform}>
   <defs><linearGradient id={id+'farbe'} x1="0" y1="0" x2=".75" y2="1"><stop stopColor={hell}/><stop offset=".38" stopColor={farbe}/><stop offset="1" stopColor={farbe}/></linearGradient><linearGradient id={id+'fade'} x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stopColor={farbe}/><stop offset="1" stopColor={farbe} stopOpacity=".22"/></linearGradient><clipPath id={id+'clip'}><path d={d}/></clipPath></defs>
   {typ!=='rasiert'&&<path d={d} stroke={typ==='licht'?farbe:'none'} strokeWidth={.5} strokeLinejoin="round" fill={'url(#'+id+'farbe)'}/>}
   {typ==='flechtkranz'&&<path d="M29 26 Q38 15 50 16 Q62 15 71 26" fill="none" stroke={hell} strokeWidth="4.2" strokeLinecap="round" strokeDasharray="2 1.5" opacity=".7"/>}
   <g clipPath={'url(#'+id+'clip)'} fill="none" stroke={hell} strokeLinecap="round" opacity=".27">
    {['cornrows','zoepfe'].includes(typ)?[-18,-10,-2,6,14,22].map(x=><path key={x} d={`M${50+x} 9 Q${43+x} 24 ${49+x} 41`} strokeWidth="1.5"/>):
     ['locken','krause','lockenseite','afro','volumen'].includes(typ)?Array.from({length:18},(_,i)=><path key={i} d={`M${27+(i%6)*8} ${18+Math.floor(i/6)*7} q-2 -3 2 -4 q4 0 3 3`} strokeWidth=".7"/>):
     typ!=='rasiert'&&typ!=='licht'&&typ!=='flechtkranz'&&[0,1,2].map(i=><path key={i} d={['slick','hoch','knoten'].includes(typ)?`M${32+i*12} 28 Q${27+i*12} 14 ${42+i*8} 8`:`M${29+i*3} ${27-i*4} Q48 ${12-i*2} ${70-i*4} ${23-i*3}`} strokeWidth=".8"/>)}
   </g>
  </g>
 </g>;
}
