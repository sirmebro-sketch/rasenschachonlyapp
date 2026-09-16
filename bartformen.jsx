import React from 'react';
// Moderne Bärte: Wangen folgen dem Kopf, Länge darf über die Kinnkontur ragen.
export function Bartform({index,kopf,farbe,hell,clipId}){
 const k=kopf.kinn,b=kopf.b,j=kopf.j*(kopf.kv??1),l=50-b,r=50+b;
 const ring=`M${l+1} 43 C${l+2} ${k-9} ${50-j} ${k} 50 ${k} C${50+j} ${k} ${r-2} ${k-9} ${r-1} 43 Q${r-5} ${k-13} 60 ${k-11} Q50 ${k-5} 40 ${k-11} Q${l+5} ${k-13} ${l+1} 43 Z`;
 const schnauzer=`M40 ${k-13} Q45 ${k-17} 50 ${k-14} Q55 ${k-17} 60 ${k-13} Q55 ${k-11} 50 ${k-13} Q45 ${k-11} 40 ${k-13} Z`;
 const kinn=`M44 ${k-4} Q50 ${k-6} 56 ${k-4} Q55 ${k+2} 50 ${k+3} Q45 ${k+2} 44 ${k-4} Z`;
 return <g fill={farbe}>
 <g clipPath={`url(#${clipId})`}>
 {[1,2,6,7,8,10,12,13,15].includes(index)&&<path d={ring} transform={index===12?`translate(50 ${k}) scale(.9 .86) translate(-50 ${-k})`:undefined} opacity={index===1?.23:index===2||index===10?.43:1}/>}
 {[3,5,6,7,10,12,13,14,15].includes(index)&&<path d={schnauzer}/>}
 {[4,5,14].includes(index)&&<path d={kinn}/>}
 {index===11&&<path d={`M38 ${k-14} Q45 ${k-17} 50 ${k-14} Q55 ${k-17} 62 ${k-14} Q64 ${k-10} 58 ${k-10} L50 ${k-12} L42 ${k-10} Q36 ${k-10} 38 ${k-14} Z`}/>}
 {index===8&&<path d={`M${l+6} 43 Q${l+9} ${k-4} 50 ${k-4} Q${r-9} ${k-4} ${r-6} 43`} fill="none" stroke={hell} strokeWidth=".8" opacity=".3"/>}
 {index===9&&<><path d={`M${l-1} 35 Q${l+8} 37 ${l+6} 55 L${l+2} 58 Z`}/><path d={`M${r+1} 35 Q${r-8} 37 ${r-6} 55 L${r-2} 58 Z`}/></>}
 </g>
 {[7,13,15].includes(index)&&<path d={`M${50-j+2} ${k-5} Q50 ${k+1} ${50+j-2} ${k-5} C${50+j-3} ${k+4} ${index===13?54:50+j*.4} ${k+(index===7?12:8)} 50 ${k+(index===7?14:10)} C${index===13?46:50-j*.4} ${k+8} ${50-j+3} ${k+4} ${50-j+2} ${k-5} Z`}/>}
 {index===14&&<path d={`M45 ${k-1} Q50 ${k+6} 55 ${k-1} Q50 ${k+11} 45 ${k-1} Z`}/>}
 {[6,7,12,13,15].includes(index)&&<path d={`M46 ${k-1} Q48 ${k+1} 48 ${k+3} M52 ${k-1} Q54 ${k+1} 53 ${k+3}`} fill="none" stroke={hell} strokeWidth=".7" opacity=".35"/>}
 </g>;
}
