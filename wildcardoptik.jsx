import React from 'react';
// Dieselbe Prägung auf gezogener Karte und Spielerpass, unabhängig von der Bühne.
export function WildcardPraegung({art}){
 if(!['welt','goat','hsv'].includes(art))return null;
 return <svg aria-hidden="true" className={'rs-wildpraegung rs-wildpraegung-'+art} viewBox="0 0 200 120" preserveAspectRatio="xMaxYMid slice">
 {art==='hsv'?<><path d="M0 12H200M0 108H200" stroke="#68baff" strokeWidth="18"/><path d="M136 22L174 60 136 98 98 60Z" fill="#fff"/><path d="M136 33L163 60 136 87 109 60Z" fill="#050709"/><path d="M136 46L150 60 136 74 122 60Z" fill="#fff"/></>:
 art==='goat'?<><path d="M93 78L85 42 113 57 136 22 159 57 187 42 179 78Z" fill="currentColor"/><path d="M98 89H174" stroke="currentColor" strokeWidth="4"/></>:
 <g fill="none" stroke="currentColor" strokeWidth="2"><circle cx="141" cy="60" r="40"/><ellipse cx="141" cy="60" rx="19" ry="40"/><path d="M101 60H181M107 40H175M107 80H175"/></g>}
 </svg>;
}
export function WildcardBuehne({art,still}){
 if(!['welt','goat','hsv'].includes(art))return null;
 return <div aria-hidden="true" className={'rs-wildbuehne rs-wildbuehne-'+art+(still?' rs-wildbuehne-still':'')}>
 <span className="rs-wildhalo"/>
 <span className="rs-wildstrahlen"/><span className="rs-wildwelle"/><span className="rs-wildwelle rs-wildwelle-zwei"/>
 <div className="rs-wildsterne">{Array.from({length:18},(_,i)=><i key={i} style={{'--dx':Math.cos(i*Math.PI/9)*(150+i%3*24)+'px','--dy':Math.sin(i*Math.PI/9)*(150+i%3*24)+'px','--verzug':(i%5*65)+'ms',rotate:(i*23)+'deg'}}/>)}</div>
 {art==='hsv'?<svg viewBox="0 0 400 300"><path d="M200 14L372 150 200 286 28 150Z"/><path d="M200 36L344 150 200 264 56 150Z"/></svg>:<svg viewBox="0 0 400 300"><path d={art==='goat'?'M65 220L40 85 120 130 200 30 280 130 360 85 335 220Z':'M90 240Q-10 150 90 60M310 240Q410 150 310 60'}/></svg>}
 </div>;
}
export const WILDCARD_CSS=`
.rs-wildpraegung{position:absolute;inset:0;width:100%;height:100%;opacity:.10;pointer-events:none;z-index:-1;}
.rs-wildpraegung-hsv{opacity:.15;}
.rs-wildbuehne{position:absolute;inset:-42px;z-index:-1;pointer-events:none;color:#ebc66a;}
.rs-wildbuehne-hsv{color:#65b4ff;}
.rs-wildbuehne-goat{color:#f9d77e;}
.rs-wildbuehne-welt{color:#9fbeff;}
.rs-wildbuehne svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.5;opacity:.28;animation:rs-emblemankunft 2.8s ease-out both;}
.rs-wildbuehne-hsv svg path+path{stroke:white;stroke-width:3;opacity:.7;}
.rs-wildhalo{position:absolute;inset:-16%;background:radial-gradient(ellipse,currentColor,transparent 65%);opacity:.16;animation:rs-haloankunft 3.2s ease-out both;}
@keyframes rs-emblemankunft{0%{transform:scale(.7);opacity:0}30%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:.28}}
@keyframes rs-haloankunft{0%{opacity:0;transform:scale(.65)}25%{opacity:.6}100%{opacity:.16;transform:scale(1)}}
.rs-wildstrahlen{position:absolute;inset:-45%;background:repeating-conic-gradient(from 10deg,transparent 0deg 17deg,currentColor 19deg,transparent 23deg 36deg);mask-image:radial-gradient(ellipse,transparent 16%,#000 35%,transparent 68%);opacity:.18;animation:rs-lichtfaecher 14s linear infinite;}
.rs-wildwelle{position:absolute;inset:-8%;border:2px solid currentColor;border-radius:50%;box-shadow:0 0 22px currentColor,inset 0 0 12px currentColor;opacity:0;animation:rs-ehrenwelle 1.8s .25s ease-out both;}
.rs-wildwelle-zwei{animation-delay:.55s;border-width:1px;}
.rs-wildsterne{position:absolute;inset:0;}
.rs-wildsterne i{position:absolute;left:50%;top:50%;width:7px;height:7px;background:currentColor;clip-path:polygon(50% 0,62% 36%,100% 50%,62% 64%,50% 100%,38% 64%,0 50%,38% 36%);opacity:0;animation:rs-ehrenfunke 2.8s var(--verzug) cubic-bezier(.1,.7,.3,1) both;}
.rs-wildbuehne-hsv .rs-wildsterne i{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#e6f5ff;}
@keyframes rs-lichtfaecher{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes rs-ehrenwelle{0%{transform:scale(.5);opacity:0}15%{opacity:.8}100%{transform:scale(1.65);opacity:0}}
@keyframes rs-ehrenfunke{0%{transform:translate(0,0) scale(.3);opacity:0}18%{opacity:1}65%{opacity:.8}100%{transform:translate(var(--dx),var(--dy)) scale(.5);opacity:0}}
.rs-wildbuehne-still .rs-wildstrahlen{opacity:.12;}
.rs-wildbuehne-still *{animation:none!important;}
.rs-startsignal::after{content:'›';position:absolute;right:10px;bottom:15px;font-size:20px;animation:rs-startsignal 4s ease-in-out infinite;}
@keyframes rs-startsignal{0%,65%,100%{opacity:.4;translate:0 0}78%{opacity:1;translate:3px 0}90%{opacity:.65;translate:0 0}}
.rs-still .rs-startsignal::after,.rs-still .rs-pochen{animation:none!important;}
@media(prefers-reduced-motion:reduce){.rs-wildbuehne *,.rs-startsignal::after,.rs-pochen{animation:none!important;}}
`;
