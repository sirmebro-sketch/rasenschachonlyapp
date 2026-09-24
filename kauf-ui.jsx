import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { KaufIcon } from './kauf-icons.jsx';

// Reine Darstellung: Preise, Voraussetzungen und Buchungen bleiben beim Aufrufer.
export function KaufKachel({ icon, titel, stufe, maximum, preis, status, nutzen, onOpen }) {
  return <button type="button" className="kauf-kachel" onClick={onOpen} aria-haspopup="dialog">
    <KaufIcon id={icon}/>
    <strong>{titel}</strong>
    <span className="kauf-stufe">Stufe {stufe} / {maximum}</span>
    <span className="kauf-leiste" aria-hidden="true">{Array.from({length:maximum},(_,i)=><i key={i} data-aktiv={i<stufe}/>)}</span>
    <span className="kauf-nutzen">{nutzen}</span>
    <span className="kauf-preis">{preis == null ? 'Voll ausgebaut' : `${preis} VC`}</span>
    <span className="kauf-status">{status}</span>
  </button>;
}

export function KaufDetail({ titel, onClose, registerBack, children }) {
  const dialog = useRef(null), schliessen = useRef(onClose);
  const titelId = useId();
  schliessen.current = onClose;
  useEffect(() => {
    const el = dialog.current, vorher = document.activeElement;
    const overflow = document.body.style.overflow;
    // Native modal: Fokus bleibt im Fenster, Hintergrund ist inert; kein eigener Tab-Nachbau.
    el.showModal();
    document.body.style.overflow = 'hidden';
    const abmelden = registerBack?.(() => schliessen.current());
    return () => {
      abmelden?.(); el.close(); document.body.style.overflow = overflow;
      if (vorher?.isConnected) vorher.focus({preventScroll:true});
    };
  }, [registerBack]);
  return createPortal(<dialog ref={dialog} className="fl kauf-detail" aria-labelledby={titelId}
    onCancel={e=>{e.preventDefault();schliessen.current();}}>
    <header><h2 id={titelId}>{titel}</h2><button type="button" className="btn sm" autoFocus onClick={onClose}>Schließen</button></header>
    <div className="kauf-detail-inhalt">{children}</div>
  </dialog>, document.body);
}

export const KAUF_CSS = `
.kauf-uebersicht{container-type:inline-size;container-name:kauf}
.kauf-raster{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.kauf-kachel{font:inherit;color:var(--tx);background:var(--pan);border:1px solid var(--ln2);padding:12px;display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:7px;min-width:0;cursor:pointer;overflow-wrap:anywhere}
.kauf-kachel:hover{border-color:var(--ac);background:var(--pan2)}
.kauf-kachel:active{border-color:var(--ac);background:var(--up);box-shadow:inset 0 0 0 2px var(--ac)}
.kauf-kachel:focus-visible{outline:3px solid var(--ac);outline-offset:2px}
.kauf-kachel strong{font-size:15px;line-height:1.2}
.kauf-icon{width:48px;height:48px;flex-shrink:0;color:var(--karton);background:var(--pan2);padding:6px;box-sizing:border-box}
.kauf-stufe,.kauf-status{font-size:12px;line-height:1.35;color:var(--mu)}
.kauf-leiste{display:flex;gap:3px;width:100%}.kauf-leiste i{height:4px;flex:1;background:var(--ln2)}.kauf-leiste i[data-aktiv=true]{background:var(--ok)}
.kauf-nutzen{font-size:12px;line-height:1.4;color:var(--mu)}
.kauf-preis{font-weight:700;font-size:15px;margin-top:auto;padding-top:3px}
.fl.kauf-detail{min-height:0;box-sizing:border-box;position:fixed;inset:auto 0 0;width:min(calc(100% / var(--skala,1)),620px);max-width:calc(100% / var(--skala,1));max-height:calc(90vh / var(--skala,1));max-height:calc(90dvh / var(--skala,1));margin:0 auto;padding:18px 18px max(18px,env(safe-area-inset-bottom));border:1px solid var(--ln2);background:var(--bg);color:var(--tx);overflow:auto;overscroll-behavior:contain;text-align:left}
.kauf-detail::backdrop{background:rgba(0,0,0,.72)}
.kauf-detail header{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:flex-start}
.kauf-detail h2{font-size:22px;line-height:1.2;margin:0;overflow-wrap:anywhere}
.kauf-detail header .btn{width:auto;min-height:44px;flex-shrink:0}
.kauf-detail-inhalt{font-size:15px;line-height:1.5;margin-top:18px}
.kauf-detail-inhalt p{margin:12px 0}.kauf-detail-inhalt .btn{min-height:48px;white-space:normal}
.kauf-detail-inhalt dl{display:grid;grid-template-columns:1fr auto;gap:8px;margin:16px 0}.kauf-detail-inhalt dd{margin:0;font-weight:700;text-align:right}
@container kauf (max-width:270px){.kauf-raster{grid-template-columns:1fr}}
@media(min-width:680px){.kauf-raster{grid-template-columns:repeat(3,minmax(0,1fr))}.kauf-detail{inset:0;margin:auto;height:fit-content}}
`;
