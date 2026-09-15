import React from 'react';
// Nur die Materialkante schimmert; die Inhaltsfläche bleibt frei.
export const EFFEKT_KONTUREN={
 karte:{box:'0 0 100 100',pfad:'M2 2 H98 V98 H2 Z'},
 elf:{box:'0 0 100 100',pfad:'M2 2 H98 V77 L50 98 L2 77 Z'},
 pack:{box:'0 0 64 91',pfad:'M2 8 L6 4 L10 8 L14 4 L18 8 L22 4 L26 8 L30 4 L34 8 L38 4 L42 8 L46 4 L50 8 L54 4 L58 8 L62 4 L62 87 L2 87 Z'},
};
export function KartenEffekt({form='karte',stark=false,still=false}){
 const id='folie'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const k=EFFEKT_KONTUREN[form]||EFFEKT_KONTUREN.karte;
 return <svg aria-hidden="true" focusable="false" className="rs-materialkante" viewBox={k.box} preserveAspectRatio="none"
  style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',overflow:'hidden',zIndex:1}}>
  <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
   <stop offset="0" stopColor="#9DDDD0"/><stop offset=".28" stopColor="#B8B9E9"/><stop offset=".55" stopColor="#F2D59F"/><stop offset=".8" stopColor="#B6D9E9"/><stop offset="1" stopColor="#9DDDD0"/>
  </linearGradient></defs>
  <path d={k.pfad} fill="none" stroke={'url(#'+id+')'} strokeWidth={stark?2.2:1.5} vectorEffect="non-scaling-stroke" opacity={stark?.8:.6}/>
  <path className={still?'':'rs-materiallicht'} d={k.pfad} fill="none" stroke="#FFF3D6" strokeWidth=".65" vectorEffect="non-scaling-stroke" opacity=".2"/>
 </svg>;
}
