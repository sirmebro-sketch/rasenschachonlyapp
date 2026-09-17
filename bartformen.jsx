import React from 'react';

// CHAR-P1-04: bestehende Bart-IDs bleiben unverändert. Die Formen werden nur
// visuell klarer getrennt und weiter an die reale Kopf-/Kiefergeometrie gekoppelt.
const BART_MAX_ID=15;
const num=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function metriken(kopf={}){
 const b=clamp(num(kopf.b,25),22,31);
 const kv=clamp(num(kopf.kv,1),.5,1.2);
 const j=clamp(num(kopf.j,18)*kv,9,26);
 const k=clamp(num(kopf.kinn,70),65,74);
 const profil=typeof kopf.profil==='string'?kopf.profil:'';
 const profilKinn=profil==='lang'?1:profil==='kurzbreit'?-1:0;
 // Zwei Pixel Überstand werden anschließend mit der echten Kopfmaske beschnitten.
 // So bleiben auch Diamant/Trapez/Kurzbreit ohne helle Hautkeile am Kiefer.
 const l=50-b-2,r=50+b+2;
 return {b,j,k:k+profilKinn,l,r,profil};
}

function bartBand({l,r,j,k,top=46,innenY=54,innenHalb=10,kieferLift=9,kinnLift=4}){
 const aussen=`M${l} ${top} C${l} ${Math.max(52,top+5)} ${50-j} ${k-8} ${50-j} ${k-6} C${50-j} ${k-1} ${50-j*.45} ${k} 50 ${k} C${50+j*.45} ${k} ${50+j} ${k-1} ${50+j} ${k-6} C${50+j} ${k-8} ${r} ${Math.max(52,top+5)} ${r} ${top}`;
 const innen=`Q${r-4} ${innenY} ${50+innenHalb} ${k-kieferLift} Q50 ${k-kinnLift} ${50-innenHalb} ${k-kieferLift} Q${l+4} ${innenY} ${l} ${top} Z`;
 return aussen+innen;
}

function schnurrbartPfad(k,width=11,yOffset=0,drop=0){
 const y=k-14+yOffset,w=width;
 return `M50 ${y+1} C${50-w*.24} ${y-3} ${50-w*.7} ${y-4+drop} ${50-w} ${y-1+drop} C${50-w*.72} ${y+2+drop} ${50-w*.28} ${y+2} 50 ${y+1} C${50+w*.28} ${y+2} ${50+w*.72} ${y+2+drop} ${50+w} ${y-1+drop} C${50+w*.7} ${y-4+drop} ${50+w*.24} ${y-3} 50 ${y+1} Z`;
}

function kinnPfad(k,width=6,length=6,point=false){
 const bottom=k+length;
 return point
  ? `M${50-width} ${k-7} Q50 ${k-9} ${50+width} ${k-7} Q${50+width-1} ${k-1} 50 ${bottom} Q${50-width+1} ${k-1} ${50-width} ${k-7} Z`
  : `M${50-width} ${k-7} Q50 ${k-9} ${50+width} ${k-7} L${50+width-1} ${bottom-2} Q50 ${bottom+1} ${50-width+1} ${bottom-2} Z`;
}

export function Bartform({index=0,kopf={},farbe='#38241B',hell='#E7C19F',clipId}){
 const id=clamp(Math.trunc(num(index,0)),0,BART_MAX_ID);
 if(id===0)return null;
 const {j,k,l,r}=metriken(kopf);
 const clip=clipId?{clipPath:`url(#${clipId})`}:{};
 const moustache=(width=11,yOffset=0,drop=0)=><path data-bart-part="schnurrbart" d={schnurrbartPfad(k,width,yOffset,drop)}/>;
 const stoppelLinie=`M${l+2} 50 C${l+4} 58 ${50-j} ${k-7} ${50-j} ${k-5} Q50 ${k+1} ${50+j} ${k-5} C${50+j} ${k-7} ${r-4} 58 ${r-2} 50`;
 let form=null;

 switch(id){
  case 1: // Stoppeln – lockere einzelne Punkte/Striche entlang Wange und Kiefer.
   form=<g {...clip} fill="none" stroke={farbe} strokeLinecap="round">
    <path data-bart-part="stoppeln-kiefer" d={stoppelLinie} strokeWidth="1" strokeDasharray=".7 2.1" opacity=".72"/>
    <path data-bart-part="stoppeln-wangen" d={`M${l+5} 48 Q${l+8} 55 ${50-j+3} ${k-9} M${r-5} 48 Q${r-8} 55 ${50+j-3} ${k-9}`} strokeWidth=".85" strokeDasharray=".6 2.4" opacity=".6"/>
   </g>;
   break;
  case 2: // Dreitagebart – dichter Schatten, aber noch keine geschlossene Vollbartkante.
   form=<g {...clip}>
    <path data-bart-part="dreitage-flaeche" d={bartBand({l,r,j,k,top:47,innenY:55,innenHalb:12,kieferLift:9,kinnLift:3})} opacity=".34"/>
    <path data-bart-part="dreitage-textur" d={stoppelLinie} fill="none" stroke={farbe} strokeWidth="1.15" strokeDasharray="1.2 1.8" strokeLinecap="round" opacity=".72"/>
   </g>;
   break;
  case 3: // Klassischer Schnurrbart.
   form=<g {...clip}>{moustache(11,0,0)}</g>;
   break;
  case 4: // Kinnbart – kompakt und stumpfer als der spitze Ziegenbart.
   form=<g {...clip}><path data-bart-part="kinnbart" d={kinnPfad(k,6,3,false)}/><path d={`M47 ${k-11} Q50 ${k-13} 53 ${k-11} L52 ${k-8} Q50 ${k-9} 48 ${k-8} Z`} opacity=".88"/></g>;
   break;
  case 5: // Ziegenbart – schmal, deutlich länger und spitz zulaufend.
   form=<g {...clip}><path data-bart-part="ziegenbart" d={kinnPfad(k,5,8,true)}/><path d={`M48 ${k-13} Q50 ${k-15} 52 ${k-13} L52 ${k-10} Q50 ${k-11} 48 ${k-10} Z`}/></g>;
   break;
  case 6: // Kurzer Vollbart – niedrige Wangenlinie, kurzer sauberer Abschluss.
   form=<g {...clip}>
    <path data-bart-part="vollbart-kurz" d={bartBand({l,r,j,k,top:47,innenY:54,innenHalb:11,kieferLift:9,kinnLift:4})}/>
    {moustache(10.5,0,0)}
   </g>;
   break;
  case 7: // Langer Vollbart – höher an der Wange und mit runder Länge unter dem Kinn.
   form=<>
    <g {...clip}><path data-bart-part="vollbart-lang-basis" d={bartBand({l,r,j,k,top:44,innenY:52,innenHalb:10,kieferLift:10,kinnLift:5})}/>{moustache(11.5,-.5,.2)}</g>
    <path data-bart-part="vollbart-lang-laenge" d={`M${50-j} ${k-6} Q50 ${k} ${50+j} ${k-6} C${50+j-1} ${k+6} ${50+j*.58} ${k+14} 50 ${k+15} C${50-j*.58} ${k+14} ${50-j+1} ${k+6} ${50-j} ${k-6} Z`}/>
    <path d={`M44 ${k+2} Q50 ${k+8} 56 ${k+2}`} fill="none" stroke={hell} strokeWidth=".75" opacity=".28" strokeLinecap="round"/>
   </>;
   break;
  case 8: // Kinnriemen – dünnes Band exakt am Kiefer, Mund/Kinnmitte bleiben frei.
   form=<g {...clip}>
    <path data-bart-part="kinnriemen" d={bartBand({l,r,j,k,top:50,innenY:56,innenHalb:15,kieferLift:6,kinnLift:1})}/>
   </g>;
   break;
  case 9: // Koteletten – ausschließlich seitliche Bartflächen.
   form=<g {...clip}>
    <path data-bart-part="kotelette-links" d={`M${l-1} 36 Q${l+8} 37 ${l+7} 48 Q${l+7} 56 ${l+4} 61 L${l+1} 59 Q${l+3} 50 ${l-1} 43 Z`}/>
    <path data-bart-part="kotelette-rechts" d={`M${r+1} 36 Q${r-8} 37 ${r-7} 48 Q${r-7} 56 ${r-4} 61 L${r-1} 59 Q${r-3} 50 ${r+1} 43 Z`}/>
   </g>;
   break;
  case 10: // Schnurrbart und Stoppeln – klare Oberlippe plus lockere Kiefertextur.
   form=<g {...clip}>
    {moustache(10.5,0,0)}
    <path data-bart-part="stoppeln-kombi" d={stoppelLinie} fill="none" stroke={farbe} strokeWidth="1" strokeDasharray=".8 2" strokeLinecap="round" opacity=".62"/>
    <path d={`M${l+6} 49 Q${l+9} 55 ${50-j+3} ${k-9} M${r-6} 49 Q${r-9} 55 ${50+j-3} ${k-9}`} fill="none" stroke={farbe} strokeWidth=".8" strokeDasharray=".6 2.5" opacity=".48"/>
   </g>;
   break;
  case 11: // Breiter Schnurrbart – deutlich breiter und stärker herabhängend.
   form=<g {...clip}>
    <path data-bart-part="schnurrbart-breit" d={schnurrbartPfad(k,14,-.5,2)}/>
    <path d={`M37 ${k-14} Q35 ${k-9} 40 ${k-8} M63 ${k-14} Q65 ${k-9} 60 ${k-8}`} fill="none" stroke={farbe} strokeWidth="2.2" strokeLinecap="round"/>
   </g>;
   break;
  case 12: // Konturierter Bart – hohe scharfe Wangenkante, schlanker Mund-/Kinnbereich.
   form=<g {...clip}>
    <path data-bart-part="bart-konturiert" d={bartBand({l,r,j,k,top:45,innenY:50,innenHalb:9,kieferLift:11,kinnLift:5})}/>
    <path d={`M${l+4} 49 Q${50-j+4} ${k-12} 41 ${k-10} M${r-4} 49 Q${50+j-4} ${k-12} 59 ${k-10}`} fill="none" stroke={hell} strokeWidth=".8" opacity=".34"/>
    {moustache(9.5,-.5,0)}
   </g>;
   break;
  case 13: // Spitzer Vollbart – Vollbartbasis mit deutlich langem V-Abschluss.
   form=<>
    <g {...clip}><path data-bart-part="vollbart-spitz-basis" d={bartBand({l,r,j,k,top:46,innenY:53,innenHalb:10,kieferLift:9,kinnLift:4})}/>{moustache(10.5,0,0)}</g>
    <path data-bart-part="vollbart-spitz" d={`M${50-j} ${k-6} Q50 ${k} ${50+j} ${k-6} Q${50+j-2} ${k+4} 50 ${k+15} Q${50-j+2} ${k+4} ${50-j} ${k-6} Z`}/>
    <path d={`M47 ${k+3} L50 ${k+10} L53 ${k+3}`} fill="none" stroke={hell} strokeWidth=".7" opacity=".26"/>
   </>;
   break;
  case 14: // Ankerbart – Schnurrbart plus schmale, ankerförmige Mund-/Kinnkontur.
   form=<g {...clip}>
    {moustache(10,0,0)}
    <path data-bart-part="anker" d={`M46 ${k-10} Q43 ${k-6} 45 ${k-2} Q47 ${k+1} 50 ${k+7} Q53 ${k+1} 55 ${k-2} Q57 ${k-6} 54 ${k-10} L52 ${k-9} Q54 ${k-5} 52 ${k-2} L50 ${k+2} L48 ${k-2} Q46 ${k-5} 48 ${k-9} Z`}/>
    <path d={`M42 ${k-1} Q50 ${k+6} 58 ${k-1}`} fill="none" stroke={farbe} strokeWidth="2.4" strokeLinecap="round"/>
   </g>;
   break;
  case 15: // Breiter Vollbart – tiefe Wangenlinie, maximaler Kieferkörper, breiter Abschluss.
   form=<>
    <g {...clip}><path data-bart-part="vollbart-breit-basis" d={bartBand({l,r,j,k,top:43,innenY:55,innenHalb:13,kieferLift:8,kinnLift:3})}/>{moustache(12,0,.5)}</g>
    <path data-bart-part="vollbart-breit" d={`M${50-j-1} ${k-6} Q50 ${k+1} ${50+j+1} ${k-6} L${50+j} ${k+5} Q${50+j-2} ${k+11} 50 ${k+11} Q${50-j+2} ${k+11} ${50-j} ${k+5} Z`}/>
    <path d={`M43 ${k+2} Q50 ${k+6} 57 ${k+2}`} fill="none" stroke={hell} strokeWidth=".8" opacity=".24" strokeLinecap="round"/>
   </>;
   break;
 }
 return <g data-bart-id={id} data-bart-profil={kopf?.profil||'standard'} fill={farbe} strokeLinejoin="round">{form}</g>;
}
