import React from 'react';
// 35.185: Moderne Porträts verwenden eine zusammenhängende Haarsilhouette.
// Gespeicherte Kennungen bleiben bestehen; Altporträts behalten ihren Renderer.
export function Haarform({index=0,weiblich=false,breite=24,farbe,hell,ebene='vorn'}){
 const id='haar'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const namen=weiblich
  ? ['kurz','lang','volumen','bob','knoten','seitenzopf','scheitellang','pixie','locken','crop','pferdeschwanz','zoepfe','hoch','afro','wellen','krause','cornrows','lockenseite','vorhang','fade']
  : ['rasiert','kurz','scheitel','undercut','locken','afro','textur','licht','zoepfe','knoten','vokuhila','glatze','slick','crop','flach','seitlich','wellen','krause','cornrows','lockenseite','vorhang','fade'];
 const typ=namen[index]||'kurz';
 const transform=`translate(50 0) scale(${breite/24} 1) translate(-50 0)`;
 if(typ==='glatze')return null;
 if(ebene==='hinten'){
  let d='';
  if(['lang','scheitellang','volumen','bob','vokuhila'].includes(typ)){
   const y=typ==='bob'?62:typ==='vokuhila'?68:82;
   d=`M25 36 C20 50 22 ${y-5} 30 ${y} Q36 ${y+2} 38 ${y-5} L37 35 Z M75 36 C80 50 78 ${y-5} 70 ${y} Q64 ${y+2} 62 ${y-5} L63 35 Z`;
  }
  if(['pferdeschwanz','seitenzopf'].includes(typ))d='M69 23 C85 20 87 41 80 55 Q76 66 74 73 Q82 54 73 43 Q68 32 65 29 Z';
  if(typ==='zoepfe')d='M29 32 Q17 40 24 62 Q25 68 29 71 Q28 56 33 42 Z M71 32 Q83 40 76 62 Q75 68 71 71 Q72 56 67 42 Z';
  if(typ==='knoten'||typ==='hoch')d=typ==='hoch'?'M34 19 C26 3 48 1 52 7 C63 -1 79 11 66 23 Z':'M42 16 C33 5 44 1 51 3 C64 2 68 15 57 19 Z';
  if(!d)return null;
  return <g transform={transform}><path d={d} fill={farbe}/><path d={d} fill="none" stroke={hell} strokeWidth=".45" opacity=".18"/></g>;
 }
 const base='M26 40 C25 21 33 12 49 11 C65 9 76 22 74 40 C70 33 64 29 50 29 C36 29 30 34 26 40 Z';
 const swept='M26 39 C24 27 29 13 45 10 C60 6 72 14 75 30 Q68 23 60 25 Q42 32 28 31 Z';
 const curls='M25 40 Q22 34 25 29 Q21 23 27 20 Q25 14 32 14 Q33 8 40 11 Q43 5 49 9 Q56 4 61 10 Q68 7 71 14 Q79 14 76 22 Q81 27 76 32 L74 40 Q70 32 65 33 Q60 28 56 32 Q50 28 45 32 Q38 28 34 33 Q29 31 25 40 Z';
 const afro='M24 44 Q17 39 20 33 Q14 28 20 23 Q17 16 25 15 Q24 7 33 9 Q37 2 44 6 Q51 1 58 6 Q66 2 70 10 Q78 8 79 16 Q87 17 82 25 Q88 31 81 36 Q83 42 76 45 Q74 32 63 30 Q48 25 34 31 Q27 34 24 44 Z';
 let d=base;
 if(['scheitel','wellen','seitlich','pixie'].includes(typ))d=swept;
 if(['locken','krause','lockenseite'].includes(typ))d=curls;
 if(['afro','volumen'].includes(typ))d=afro;
 if(typ==='rasiert')d='M26 39 C26 19 37 12 50 12 C64 12 74 22 74 39 Q70 31 65 30 Q50 25 35 30 Q29 32 26 39 Z';
 if(['undercut','fade'].includes(typ))d='M30 34 C27 24 30 13 43 11 C57 6 70 13 72 25 Q70 30 67 30 Q49 26 32 35 Z';
 if(typ==='textur')d='M26 40 Q23 29 29 23 Q25 15 37 15 Q35 8 46 12 Q49 5 56 12 Q67 8 67 18 Q77 17 74 32 L73 39 Q61 26 48 30 Q34 28 26 40 Z';
 if(typ==='licht')d='M26 43 C24 26 32 17 39 15 Q32 26 33 36 L30 46 Z M74 43 C76 26 68 17 61 15 Q68 26 67 36 L70 46 Z';
 if(typ==='slick'||typ==='hoch')d='M26 40 C24 23 31 12 45 9 C63 5 77 21 74 40 Q65 28 50 28 Q35 28 26 40 Z';
 if(typ==='crop')d='M26 39 C24 20 36 11 50 11 C65 11 76 22 74 39 L70 31 Q62 33 57 31 Q49 33 43 31 Q34 33 30 31 Z';
 if(typ==='flach')d='M26 40 L28 18 Q30 9 39 9 L62 9 Q72 9 73 22 L74 40 Q67 29 50 29 Q33 29 26 40 Z';
 if(typ==='wellen')d='M25 40 Q22 26 30 18 Q34 10 44 12 Q55 5 65 14 Q76 15 75 34 Q68 28 62 29 Q55 25 49 29 Q39 26 32 35 Z';
 if(typ==='pixie')d='M27 38 C23 22 34 11 50 11 Q69 10 74 30 Q65 22 56 25 Q47 33 30 30 Z';
 if(typ==='seitlich')d='M26 40 C24 21 34 10 52 10 Q72 11 74 34 Q60 26 52 27 Q38 24 28 35 Z';
 if(typ==='krause')d='M26 39 Q23 32 26 27 Q23 21 29 19 Q30 12 36 14 Q41 8 47 12 Q53 8 58 12 Q65 10 69 17 Q76 17 74 24 Q79 29 74 39 Q67 29 61 32 Q54 28 48 32 Q39 28 32 34 Z';
 if(typ==='lockenseite')d='M25 40 Q21 31 25 25 Q22 18 30 17 Q29 10 39 11 Q43 4 50 10 Q61 5 65 13 Q74 13 75 23 L74 40 Q67 29 60 30 Q54 25 49 30 Q43 27 38 34 Q31 30 25 40 Z';
 if(typ==='vorhang'||typ==='scheitellang')d='M25 44 C22 22 32 9 49 11 Q66 8 74 24 Q78 35 74 44 L68 38 Q58 35 50 22 Q43 36 32 39 Z';
 return <g transform={transform}>
  <defs><linearGradient id={id+'farbe'} x1="0" y1="0" x2=".75" y2="1"><stop stopColor={hell}/><stop offset=".38" stopColor={farbe}/><stop offset="1" stopColor={farbe}/></linearGradient><clipPath id={id+'clip'}><path d={d}/></clipPath></defs>
  <path d={d} fill={'url(#'+id+'farbe)'} opacity={typ==='rasiert'?.65:1}/>
  <g clipPath={'url(#'+id+'clip)'} fill="none" stroke={hell} strokeLinecap="round" opacity=".27">
   {['cornrows','zoepfe'].includes(typ)?[-18,-10,-2,6,14,22].map(x=><path key={x} d={`M${50+x} 9 Q${43+x} 24 ${49+x} 41`} strokeWidth="1.5"/>):
    ['locken','krause','lockenseite','afro','volumen'].includes(typ)?Array.from({length:18},(_,i)=><path key={i} d={`M${27+(i%6)*8} ${18+Math.floor(i/6)*7} q-2 -3 2 -4 q4 0 3 3`} strokeWidth=".7"/>):
    typ!=='rasiert'&&typ!=='licht'&&[0,1,2].map(i=><path key={i} d={['slick','hoch','knoten'].includes(typ)?`M${32+i*12} 28 Q${27+i*12} 14 ${42+i*8} 8`:`M${29+i*3} ${27-i*4} Q48 ${12-i*2} ${70-i*4} ${23-i*3}`} strokeWidth=".8"/>)}
  </g>
 </g>;
}
