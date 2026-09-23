import React from 'react';
// 35.181: Nur die Materialkante schimmerte, die Inhaltsfläche blieb frei.
// 15.09.2026 / 35.182: Das wirkte wie ein Innenrahmen. Folie jetzt hinter
// den Karteninhalten; Pack-Aufdrucke liegen als eigene Druckebene über der Folie.
export const EFFEKT_KONTUREN={
 karte:{box:'0 0 100 100',pfad:'M0 0 H100 V100 H0 Z'},
 elf:{box:'0 0 100 100',pfad:'M0 0 H100 V78 L50 100 L0 78 Z'},
 pack:{box:'0 0 64 91',pfad:'M2 8 L6 4 L10 8 L14 4 L18 8 L22 4 L26 8 L30 4 L34 8 L38 4 L42 8 L46 4 L50 8 L54 4 L58 8 L62 4 L62 87 L2 87 Z'},
};
export function KartenEffekt({form='karte',stark=false,still=false,hsv=false,dezent=false}){
 const id='folie'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const k=EFFEKT_KONTUREN[form]||EFFEKT_KONTUREN.karte;
 return <svg aria-hidden="true" focusable="false" className={'rs-materialkante'+(stark?' rs-folie-stark':'')+(still?' rs-folie-still':'')}
  data-form={form} viewBox={k.box} preserveAspectRatio="none"
  style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',overflow:'hidden',zIndex:form==='pack'?1:-1,opacity:dezent ? .16 : 1}}>
  <defs>
   <clipPath id={id+'clip'}><path d={k.pfad}/></clipPath>
   <linearGradient id={id+'holo'} x1="0" y1="0" x2="1" y2=".65">
    <stop stopColor="#51e5d1" stopOpacity="0"/><stop offset=".25" stopColor={hsv?'#278ae0':stark?'#65e9ef':'#e3ae42'} stopOpacity=".32"/>
    <stop offset=".48" stopColor={hsv?'#ffffff':stark?'#b98bff':'#fff0a4'} stopOpacity=".08"/>
    <stop offset=".7" stopColor={hsv?'#91c9ff':stark?'#f8a6d9':'#8de0ce'} stopOpacity=".3"/><stop offset="1" stopColor="#86bdff" stopOpacity="0"/>
   </linearGradient>
   <linearGradient id={id+'licht'}><stop stopColor="#fff5d6" stopOpacity="0"/><stop offset=".44" stopColor="#fff5d6" stopOpacity="0"/><stop offset=".5" stopColor="#fffbe7" stopOpacity={stark?'.52':'.36'}/><stop offset=".56" stopColor="#fff5d6" stopOpacity="0"/><stop offset="1" stopColor="#fff5d6" stopOpacity="0"/></linearGradient>
   <pattern id={id+'korn'} width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#fff0c1" strokeWidth=".25" opacity=".16"/></pattern>
  </defs>
  <g clipPath={'url(#'+id+'clip)'}>
   <rect width="100" height="100" fill={'url(#'+id+'korn)'}/>
   <rect className="rs-folienfarbe" x="-100" y="0" width="300" height="100" fill={'url(#'+id+'holo)'}/>
   <g className="rs-folienzug"><path d="M-100 -50 H0 L100 150 H0 Z" fill={'url(#'+id+'licht)'}/></g>
  </g>
 </svg>;
}
