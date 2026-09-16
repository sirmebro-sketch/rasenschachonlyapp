import React from 'react';
// Moderne Bärte: Wangen folgen dem Kopf, Länge darf über die Kinnkontur ragen.
export function Bartform({index,kopf,farbe,hell,clipId}){
 const k=kopf.kinn,b=kopf.b,j=kopf.j*(kopf.kv??1),l=50-b,r=50+b;
 // Die Außenkontur ist dieselbe wie beim Kopf. Eine angenäherte Ellipse
 // ließ gerade bei kantigen oder zarten Köpfen helle Hautkeile am Kiefer frei.
 const aussen=`M${l} 40 C${l} 52 ${50-j} ${k-8} ${50-j} ${k-6} C${50-j} ${k-1} ${50-j*.45} ${k} 50 ${k} C${50+j*.45} ${k} ${50+j} ${k-1} ${50+j} ${k-6} C${50+j} ${k-8} ${r} 52 ${r} 40`;
 const innen=index===8
  ? `Q${r-4} ${k-9} ${50+j-2} ${k-5} Q50 ${k+1} ${50-j+2} ${k-5} Q${l+4} ${k-9} ${l} 40 Z`
  : index===12
  ? `Q${r-4} 54 59 ${k-8} Q50 ${k-3} 41 ${k-8} Q${l+4} 54 ${l} 40 Z`
  : `Q${r-4} 53 60 ${k-10} Q50 ${k-4} 40 ${k-10} Q${l+4} 53 ${l} 40 Z`;
 const ring=aussen+innen;
 const schnauzer=`M40 ${k-13} Q45 ${k-17} 50 ${k-14} Q55 ${k-17} 60 ${k-13} Q55 ${k-11} 50 ${k-13} Q45 ${k-11} 40 ${k-13} Z`;
 const kinn=`M44 ${k-4} Q50 ${k-6} 56 ${k-4} Q55 ${k+2} 50 ${k+3} Q45 ${k+2} 44 ${k-4} Z`;
 return <g fill={farbe}>
 <g clipPath={`url(#${clipId})`}>
 {[1,2,6,7,8,10,12,13,15].includes(index)&&<path d={ring} opacity={index===1?.23:index===2||index===10?.43:1}/>}
 {[3,5,6,7,10,12,13,14,15].includes(index)&&<path d={schnauzer}/>}
 {[4,5,14].includes(index)&&<path d={kinn}/>}
 {index===11&&<path d={`M38 ${k-14} Q45 ${k-17} 50 ${k-14} Q55 ${k-17} 62 ${k-14} Q64 ${k-10} 58 ${k-10} L50 ${k-12} L42 ${k-10} Q36 ${k-10} 38 ${k-14} Z`}/>}
 {index===9&&<><path d={`M${l-1} 35 Q${l+8} 37 ${l+6} 55 L${l+2} 58 Z`}/><path d={`M${r+1} 35 Q${r-8} 37 ${r-6} 55 L${r-2} 58 Z`}/></>}
 </g>
 {[7,13,15].includes(index)&&<path d={index===15
  ? `M${50-j} ${k-6} Q50 ${k-1} ${50+j} ${k-6} L${50+j-1} ${k+3} Q${50+j-2} ${k+8} 50 ${k+8} Q${50-j+2} ${k+8} ${50-j+1} ${k+3} Z`
  : index===13
  ? `M${50-j} ${k-6} Q50 ${k-1} ${50+j} ${k-6} Q${50+j-2} ${k+3} 50 ${k+13} Q${50-j+2} ${k+3} ${50-j} ${k-6} Z`
  : `M${50-j} ${k-6} Q50 ${k-1} ${50+j} ${k-6} C${50+j} ${k+7} ${50+j*.6} ${k+14} 50 ${k+14} C${50-j*.6} ${k+14} ${50-j} ${k+7} ${50-j} ${k-6} Z`}/>}
 {index===14&&<path d={`M45 ${k-1} Q50 ${k+6} 55 ${k-1} Q50 ${k+11} 45 ${k-1} Z`}/>}
 {[7,13,15].includes(index)&&<path d={`M46 ${k-1} Q48 ${k+1} 48 ${k+3} M52 ${k-1} Q54 ${k+1} 53 ${k+3}`} fill="none" stroke={hell} strokeWidth=".7" opacity=".35"/>}
 </g>;
}
