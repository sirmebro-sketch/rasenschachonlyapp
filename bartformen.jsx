import React from 'react';
import {gesichtsAnker} from './gesichtsanker.js';

// CHAR-P1-04/CHAR-FIX-03: bestehende Bart-IDs bleiben unverändert. Die
// Außenform folgt Kopf/Kiefer; Mund und Nase liefern gemeinsam die Innenanker.
const BART_MAX_ID=15;
const num=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function metriken(kopf={}){
 const b=clamp(num(kopf.b,25),22,31);
 const kv=clamp(num(kopf.kv,1),.5,1.2);
 const j=clamp(num(kopf.j,18)*kv,9,26);
 const k=clamp(num(kopf.kinn,70),64,74);
 const profil=typeof kopf.profil==='string'?kopf.profil:'';
 // Zwei Pixel Überstand werden anschließend mit der echten Kopfmaske beschnitten.
 // So bleiben auch Diamant/Trapez/Kurzbreit ohne helle Hautkeile am Kiefer.
 const l=50-b-2,r=50+b+2;
 return {b,j,k,l,r,profil};
}

function bartBand({l,r,j,k,top=46,innenY=54,innenHalb=10,kieferLift=9,freiraumY}){
 const aussen=`M${l} ${top} C${l} ${Math.max(52,top+5)} ${50-j} ${k-8} ${50-j} ${k-6} C${50-j} ${k-1} ${50-j*.45} ${k} 50 ${k} C${50+j*.45} ${k} ${50+j} ${k-1} ${50+j} ${k-6} C${50+j} ${k-8} ${r} ${Math.max(52,top+5)} ${r} ${top}`;
 // Die innere Vollbartkante lag früher nur bei k-kieferLift und konnte damit
 // über Lippen/Zaehne laufen. Sie wird jetzt mindestens bis unter den realen
 // Mundfreiraum abgesenkt; seitlich darf der Bart weiterhin hoch ansetzen.
 const mitte=Math.min(k-1.15,Math.max(k-kieferLift,num(freiraumY,k-kieferLift)));
 const seite=Math.min(mitte-.35,Math.max(innenY,mitte-4.5));
 const bogen=Math.min(k-.7,mitte+1.15);
 const innen=`Q${r-4} ${seite} ${50+innenHalb} ${mitte} Q50 ${bogen} ${50-innenHalb} ${mitte} Q${l+4} ${seite} ${l} ${top} Z`;
 return aussen+innen;
}

function schnurrbartPfad(y,width=11,yOffset=0,drop=0){
 const basis=y+yOffset,w=width,d=drop*.2;
 // Kompakte Oberlippenform: die alte Kurve war bis zu sechs SVG-Einheiten
 // hoch und konnte auf kurzen Köpfen zugleich Nase und Mund berühren.
 return `M50 ${basis+.35} C${50-w*.24} ${basis-1.25} ${50-w*.7} ${basis-1.8+d} ${50-w} ${basis-.45+d} C${50-w*.72} ${basis+.75+d} ${50-w*.28} ${basis+.8} 50 ${basis+.35} C${50+w*.28} ${basis+.8} ${50+w*.72} ${basis+.75+d} ${50+w} ${basis-.45+d} C${50+w*.7} ${basis-1.8+d} ${50+w*.24} ${basis-1.25} 50 ${basis+.35} Z`;
}

// CHAR-FIX-04: Kinnbart, Ziegenbart und Ankerbart teilen dieselbe echte
// Mund→Kinn-Zone. Die alte reine k-minus-X-Geometrie wurde auf kurzen Köpfen
// von Mundmaske und Kopfclip fast vollständig weggeschnitten. Die neue Zone
// beginnt garantiert unter der sichtbaren Unterlippe, reagiert auf die reale
// Kieferbreite und darf in der Mitte kontrolliert unter das Kinn wachsen.
function kinnZone(j,k,face){
 const frei=clamp(k-face.mundBottom,.8,7);
 const halb=clamp(4.6+j*.17,5.8,9);
 const oben=Math.min(k-.3,face.mundBottom+clamp(frei*.32,.45,1.35));
 const unten=k+clamp(1.65+(j-12)*.045,1.65,2.35);
 return {x:50,halb,oben,unten,frei};
}

export function Bartform({index=0,kopf={},nase=0,mund=0,farbe='#38241B',hell='#E7C19F',clipId}){
 const id=clamp(Math.trunc(num(index,0)),0,BART_MAX_ID);
 if(id===0)return null;
 const {j,k,l,r}=metriken(kopf);
 const face=gesichtsAnker(kopf,nase,mund);
 const uid='bart'+React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const mundMask=uid+'mundfrei';
 const clip=clipId?{clipPath:`url(#${clipId})`}:{};
 const moustache=(width=11,yOffset=0,drop=0,part='schnurrbart')=><path data-bart-part={part} d={schnurrbartPfad(face.schnurrbartY,width,yOffset,drop)}/>;
 const stoppelLinie=`M${l+2} 50 C${l+4} 58 ${50-j} ${k-7} ${50-j} ${k-5} Q50 ${k+1} ${50+j} ${k-5} C${50+j} ${k-7} ${r-4} 58 ${r-2} 50`;
 const freiraumY=face.mundBottom+.75;
 const kinn=kinnZone(j,k,face);
 let body=null,moustacheNode=null;

 switch(id){
  case 1: // Stoppeln – lockere einzelne Punkte/Striche entlang Wange und Kiefer.
   body=<g {...clip} fill="none" stroke={farbe} strokeLinecap="round">
    <path data-bart-part="stoppeln-kiefer" d={stoppelLinie} strokeWidth="1" strokeDasharray=".7 2.1" opacity=".72"/>
    <path data-bart-part="stoppeln-wangen" d={`M${l+5} 48 Q${l+8} 55 ${50-j+3} ${k-9} M${r-5} 48 Q${r-8} 55 ${50+j-3} ${k-9}`} strokeWidth=".85" strokeDasharray=".6 2.4" opacity=".6"/>
   </g>;
   break;
  case 2: // Dreitagebart – dichter Schatten, aber noch keine geschlossene Vollbartkante.
   body=<g {...clip}>
    <path data-bart-part="dreitage-flaeche" d={bartBand({l,r,j,k,top:47,innenY:55,innenHalb:12,kieferLift:9,freiraumY})} opacity=".34"/>
    <path data-bart-part="dreitage-textur" d={stoppelLinie} fill="none" stroke={farbe} strokeWidth="1.15" strokeDasharray="1.2 1.8" strokeLinecap="round" opacity=".72"/>
   </g>;
   break;
  case 3: // Klassischer Schnurrbart.
   moustacheNode=moustache(11,0,0);
   break;
  case 4: { // Kinnbart – kompakter Block am tatsächlichen Kinnzentrum.
   const h=kinn.halb;
   body=<path data-bart-part="kinnbart" data-bart-chin-top={kinn.oben.toFixed(2)} data-bart-chin-bottom={kinn.unten.toFixed(2)} data-bart-chin-half={h.toFixed(2)}
    d={`M${50-h} ${kinn.oben} Q50 ${kinn.oben-.55} ${50+h} ${kinn.oben} L${50+h*.82} ${k-.15} Q50 ${kinn.unten} ${50-h*.82} ${k-.15} Z`}/>;
   break;
  }
  case 5: { // Ziegenbart – dieselbe Kinnzone, aber deutlich schmaler und länger.
   const h=clamp(kinn.halb*.5,3,4.4);
   body=<path data-bart-part="ziegenbart-basis" data-bart-chin-top={kinn.oben.toFixed(2)} data-bart-chin-bottom={(k+8).toFixed(2)} data-bart-chin-half={h.toFixed(2)}
    d={`M${50-h} ${kinn.oben} Q50 ${kinn.oben-.7} ${50+h} ${kinn.oben} L${50+h*.65} ${k-.2} Q52 ${k+4.8} 50 ${k+8} Q48 ${k+4.8} ${50-h*.65} ${k-.2} Z`}/>;
   break;
  }
  case 6: // Kurzer Vollbart – niedrige Wangenlinie, kurzer sauberer Abschluss.
   body=<g {...clip}><path data-bart-part="vollbart-kurz" d={bartBand({l,r,j,k,top:47,innenY:54,innenHalb:11,kieferLift:9,freiraumY})}/></g>;
   moustacheNode=moustache(10.5,0,0);
   break;
  case 7: // Langer Vollbart – höhere Wangenlinie und runde Länge unter dem Kinn.
   body=<>
    <g {...clip}><path data-bart-part="vollbart-lang-basis" d={bartBand({l,r,j,k,top:44,innenY:52,innenHalb:10,kieferLift:10,freiraumY})}/></g>
    <path data-bart-part="vollbart-lang-laenge" d={`M${50-j} ${k-6} Q50 ${k} ${50+j} ${k-6} C${50+j-1} ${k+6} ${50+j*.58} ${k+14} 50 ${k+15} C${50-j*.58} ${k+14} ${50-j+1} ${k+6} ${50-j} ${k-6} Z`}/>
    <path d={`M44 ${k+2} Q50 ${k+8} 56 ${k+2}`} fill="none" stroke={hell} strokeWidth=".75" opacity=".28" strokeLinecap="round"/>
   </>;
   moustacheNode=moustache(11.5,-.5,.2);
   break;
  case 8: // Kinnriemen – dünnes Band exakt am Kiefer, Mund/Kinnmitte bleiben frei.
   body=<g {...clip}><path data-bart-part="kinnriemen" d={bartBand({l,r,j,k,top:50,innenY:56,innenHalb:15,kieferLift:6,freiraumY})}/></g>;
   break;
  case 9: // Koteletten – ausschließlich seitliche Bartflächen.
   body=<g {...clip}>
    <path data-bart-part="kotelette-links" d={`M${l-1} 36 Q${l+8} 37 ${l+7} 48 Q${l+7} 56 ${l+4} 61 L${l+1} 59 Q${l+3} 50 ${l-1} 43 Z`}/>
    <path data-bart-part="kotelette-rechts" d={`M${r+1} 36 Q${r-8} 37 ${r-7} 48 Q${r-7} 56 ${r-4} 61 L${r-1} 59 Q${r-3} 50 ${r+1} 43 Z`}/>
   </g>;
   break;
  case 10: // Schnurrbart und Stoppeln – klare Oberlippe plus lockere Kiefertextur.
   body=<g {...clip}>
    <path data-bart-part="stoppeln-kombi" d={stoppelLinie} fill="none" stroke={farbe} strokeWidth="1" strokeDasharray=".8 2" strokeLinecap="round" opacity=".62"/>
    <path d={`M${l+6} 49 Q${l+9} 55 ${50-j+3} ${k-9} M${r-6} 49 Q${r-9} 55 ${50+j-3} ${k-9}`} fill="none" stroke={farbe} strokeWidth=".8" strokeDasharray=".6 2.5" opacity=".48"/>
   </g>;
   moustacheNode=moustache(10.5,0,0);
   break;
  case 11: // Breiter Schnurrbart – deutlich breiter und stärker herabhängend.
   moustacheNode=<g>{moustache(14,-.35,2,'schnurrbart-breit')}<path d={`M37 ${face.schnurrbartY-.4} Q35 ${face.schnurrbartY+1.1} 40 ${face.schnurrbartY+1.45} M63 ${face.schnurrbartY-.4} Q65 ${face.schnurrbartY+1.1} 60 ${face.schnurrbartY+1.45}`} fill="none" stroke={farbe} strokeWidth="1.8" strokeLinecap="round"/></g>;
   break;
  case 12: // Konturierter Bart – hohe scharfe Wangenkante, schlanker Mund-/Kinnbereich.
   body=<g {...clip}>
    <path data-bart-part="bart-konturiert" d={bartBand({l,r,j,k,top:45,innenY:50,innenHalb:9,kieferLift:11,freiraumY})}/>
    <path d={`M${l+4} 49 Q${50-j+4} ${k-12} 41 ${k-10} M${r-4} 49 Q${50+j-4} ${k-12} 59 ${k-10}`} fill="none" stroke={hell} strokeWidth=".8" opacity=".34"/>
   </g>;
   moustacheNode=moustache(9.5,-.5,0);
   break;
  case 13: // Spitzer Vollbart – Vollbartbasis mit deutlich langem V-Abschluss.
   body=<>
    <g {...clip}><path data-bart-part="vollbart-spitz-basis" d={bartBand({l,r,j,k,top:46,innenY:53,innenHalb:10,kieferLift:9,freiraumY})}/></g>
    <path data-bart-part="vollbart-spitz" d={`M${50-j} ${k-6} Q50 ${k} ${50+j} ${k-6} Q${50+j-2} ${k+4} 50 ${k+15} Q${50-j+2} ${k+4} ${50-j} ${k-6} Z`}/>
    <path d={`M47 ${k+3} L50 ${k+10} L53 ${k+3}`} fill="none" stroke={hell} strokeWidth=".7" opacity=".26"/>
   </>;
   moustacheNode=moustache(10.5,0,0);
   break;
  case 14: { // Ankerbart – Oberlippe plus echter Mund→Kinn-Steg und Ankerbogen.
   const h=clamp(kinn.halb*.88,5,7.7);
   body=<g data-bart-part="anker" data-bart-chin-top={kinn.oben.toFixed(2)} data-bart-chin-bottom={(k+3.2).toFixed(2)} data-bart-chin-half={h.toFixed(2)}>
    <path data-bart-part="anker-steg" d={`M47.8 ${kinn.oben} Q50 ${kinn.oben-.55} 52.2 ${kinn.oben} L52.25 ${k-.75} Q50 ${k+1.35} 47.75 ${k-.75} Z`}/>
    <path data-bart-part="anker-bogen" d={`M${50-h} ${k-1.35} Q${50-h*.55} ${k+1.2} 50 ${k+3.2} Q${50+h*.55} ${k+1.2} ${50+h} ${k-1.35}`} fill="none" stroke={farbe} strokeWidth="2.45" strokeLinecap="round"/>
   </g>;
   moustacheNode=moustache(10,0,0);
   break;
  }
  case 15: // Breiter Vollbart – tiefe Wangenlinie, maximaler Kieferkörper, breiter Abschluss.
   body=<>
    <g {...clip}><path data-bart-part="vollbart-breit-basis" d={bartBand({l,r,j,k,top:43,innenY:55,innenHalb:13,kieferLift:8,freiraumY})}/></g>
    <path data-bart-part="vollbart-breit" d={`M${50-j-1} ${k-6} Q50 ${k+1} ${50+j+1} ${k-6} L${50+j} ${k+5} Q${50+j-2} ${k+11} 50 ${k+11} Q${50-j+2} ${k+11} ${50-j} ${k+5} Z`}/>
    <path d={`M43 ${k+2} Q50 ${k+6} 57 ${k+2}`} fill="none" stroke={hell} strokeWidth=".8" opacity=".24" strokeLinecap="round"/>
   </>;
   moustacheNode=moustache(12,0,.5);
   break;
 }
 const mundX=38.5,mundW=23,mundY=face.mundTop-.7,mundH=Math.max(2.4,face.mundBottom-face.mundTop+1.4);
 return <g data-bart-id={id} data-bart-profil={kopf?.profil||'standard'} data-bart-nase={nase} data-bart-mund={mund} data-bart-mundy={face.mundY.toFixed(2)} data-bart-nasebottom={face.naseBottom.toFixed(2)} data-bart-mundbottom={face.mundBottom.toFixed(2)} data-bart-kinn-y={k.toFixed(2)} data-bart-kiefer={j.toFixed(2)} fill={farbe} strokeLinejoin="round">
  <defs><mask id={mundMask} maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100" height="110" fill="white"/><rect x={mundX} y={mundY} width={mundW} height={mundH} rx="4" fill="black"/></mask></defs>
  {body&&<g mask={`url(#${mundMask})`}>{body}</g>}
  {moustacheNode}
 </g>;
}
