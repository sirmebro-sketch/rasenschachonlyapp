import React from 'react';
// Einmaliger Akzent um die Karte, keine zweite Folie über dem Inhalt.
export function AufdeckLicht({farbe,stark=false,still=false,kompakt=false}){
 return <div aria-hidden="true" className={'rs-aufdecklicht'+(stark?' rs-aufdecklicht-stark':'')+(still?' rs-aufdecklicht-still':'')+(kompakt?' rs-aufdecklicht-kompakt':'')} style={{'--lichtfarbe':farbe}}>
  <span className="rs-lichtbett"/><span className="rs-lichtring"/>
  {(stark?[0,1,2,3]:[0,1]).map(i=><i key={i} className="rs-lichtstern" style={{'--stern':i,left:i%2?'94%':'6%',top:i<2?'12%':'86%'}}/>)}
 </div>;
}
export const AUFDECK_CSS=`
.rs-enthuellungsraum{isolation:isolate;}
.rs-aufdecklicht{position:absolute;inset:-28px;z-index:-1;pointer-events:none;}
.rs-lichtbett{position:absolute;inset:-12%;background:radial-gradient(ellipse,var(--lichtfarbe),transparent 66%);opacity:.23;animation:rs-lichtankunft 1.4s ease-out both;}
.rs-lichtring{position:absolute;inset:8%;border:1px solid var(--lichtfarbe);border-radius:24px;opacity:0;animation:rs-lichtkreis 1.8s ease-out both;}
.rs-lichtstern{position:absolute;width:12px;height:12px;background:var(--lichtfarbe);clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);opacity:0;animation:rs-lichtstern 1.7s ease-out both;animation-delay:calc(var(--stern)*110ms);}
.rs-aufdecklicht-stark .rs-lichtbett{opacity:.36;}
.rs-aufdecklicht-stark .rs-lichtstern{width:17px;height:17px;}
.rs-aufdecklicht-kompakt{inset:0;overflow:hidden;}
.rs-aufdecklicht-kompakt .rs-lichtbett{inset:0;background:radial-gradient(ellipse at 100% 0,var(--lichtfarbe),transparent 68%);}
.rs-aufdecklicht-kompakt .rs-lichtring{display:none;}
.rs-aufdecklicht-kompakt .rs-lichtstern{width:8px;height:8px;}
@keyframes rs-lichtankunft{0%{transform:scale(.55);opacity:0}45%{opacity:.48}100%{transform:scale(1)}}
@keyframes rs-lichtkreis{0%{transform:scale(.8);opacity:0}20%{opacity:.65}100%{transform:scale(1.3);opacity:0}}
@keyframes rs-lichtstern{0%{transform:scale(0) rotate(-35deg);opacity:0}25%{opacity:.9}70%{opacity:.5}100%{transform:scale(1.5) rotate(35deg);opacity:0}}
.rs-aufdecklicht-still *,.rs-still .rs-aufdecklicht *{animation:none!important;}
.rs-aufdecklicht-still .rs-lichtring,.rs-aufdecklicht-still .rs-lichtstern{display:none;}
@media(prefers-reduced-motion:reduce){.rs-aufdecklicht *{animation:none!important;}.rs-lichtring,.rs-lichtstern{display:none;}}
`;
