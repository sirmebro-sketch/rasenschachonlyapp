const fs=require('node:fs');
const path=require('node:path');
const file=path.resolve(__dirname,'..','App.jsx');
let source=fs.readFileSync(file,'utf8');

if(source.includes('CHAR-P1-02 / ChatGPT-Codex: perzeptiv tragfähige Gesichtszüge')){
 console.log('CHAR-P1-02 Renderer-Patch bereits angewendet.');
 process.exit(0);
}

function replaceOnce(alt,neu,label){
 const first=source.indexOf(alt);
 if(first<0)throw new Error(label+': Suchtext nicht gefunden');
 if(source.indexOf(alt,first+alt.length)>=0)throw new Error(label+': Suchtext nicht eindeutig');
 source=source.slice(0,first)+neu+source.slice(first+alt.length);
}
function insertBefore(marker,text,label){
 const first=source.indexOf(marker);
 if(first<0)throw new Error(label+': Marker nicht gefunden');
 if(source.indexOf(marker,first+marker.length)>=0)throw new Error(label+': Marker nicht eindeutig');
 source=source.slice(0,first)+text+source.slice(first);
}

replaceOnce(
`  const augenY = 46 + (z.augen === 3 ? 1.5 : 0);\n  const lidH = z.augen === 1 ? 2.6 : z.augen === 4 ? 4.2 : z.augen === 5 ? 3.9 : z.augen === 6 ? 2.9 : 3.4;   /* Lidspalt */`,
`  /* CHAR-P1-02 / ChatGPT-Codex: perzeptiv tragfähige Gesichtszüge.\n     Bestehende IDs bleiben geometrisch unverändert. Die neuen Formen werden\n     ausschließlich hinten angehängt; alte Seed-Ableitungen behalten damit\n     ihre bisherigen Augen-/Nasen-/Wangen-IDs. */\n  const augenY = 46 + (z.augen === 3 ? 1.5 : 0);\n  const lidH = z.augen === 1 ? 2.6 : z.augen === 4 ? 4.2 : z.augen === 5 ? 3.9 : z.augen === 6 ? 2.9\n    : z.augen === 7 ? 4.25 : z.augen === 8 ? 3.15 : 3.4;   /* Lidspalt */`,
'Augenparameter');

insertBefore(
`            {/* ---- Weiblich: Lidschatten und Wimpern (34.29) ----`,
`            {/* CHAR-P1-02: echte Außenkanten statt weiterer 1–2-px-Lidspalte. */}\n            {z.augen === 7 && <path d={\"M\" + (cx + (cx < 50 ? -6 : 6)) + \",\" + (augenY + .35)\n              + \" l\" + (cx < 50 ? -2.2 : 2.2) + \",-1.9\"} fill=\"none\" stroke={shade(haut, -62)}\n              strokeWidth=\"1.15\" strokeLinecap=\"round\" />}\n            {z.augen === 8 && <path d={\"M\" + (cx + (cx < 50 ? -6 : 6)) + \",\" + (augenY - .25)\n              + \" l\" + (cx < 50 ? -2.2 : 2.2) + \",1.9\"} fill=\"none\" stroke={shade(haut, -62)}\n              strokeWidth=\"1.15\" strokeLinecap=\"round\" />}\n\n`,
'Augen-Außenkanten');

replaceOnce(
`          const br = [2.5, 3.2, 2, 2.9, 2.7, 3.7, 4.3, 2.2,3.1,1.7][z.nase] || 2.5;`,
`          const br = [2.5, 3.2, 2, 2.9, 2.7, 3.7, 4.3, 2.2,3.1,1.7][z.nase] || 2.5;\n          /* IDs 10/11 sind bewusst eigene Formsprachen. Die gemessenen\n             Alt-Dubletten 0/4 und 2/7 bleiben für Spielstände erhalten,\n             werden aber in portraetOptionen nicht mehr neu angeboten. */\n          if (z.nase === 10) return (<g>\n            <path d={\"M49.2,51 C48.2,53.6 45.3,55.4 45.5,57.4 Q50,61 54.5,57.4 C54.7,55.4 51.8,53.6 50.8,51 Z\"}\n              fill={schatten} opacity=\".5\" />\n            <path d=\"M46.4,55.9 Q50,54.1 53.6,55.9\" fill=\"none\" stroke={tief} strokeWidth=\".85\" opacity=\".6\" />\n            <ellipse cx=\"47\" cy=\"57.2\" rx=\"1.25\" ry=\".78\" fill={tief} />\n            <ellipse cx=\"53\" cy=\"57.2\" rx=\"1.25\" ry=\".78\" fill={tief} />\n          </g>);\n          if (z.nase === 11) return (<g>\n            <path d=\"M49.2,47 C48.4,50.2 48.2,54.6 47.2,58 Q50,59.7 52.8,58 C51.8,54.6 51.6,50.2 50.8,47 Z\"\n              fill={schatten} opacity=\".48\" />\n            <path d=\"M50,47.6 V55.3\" fill=\"none\" stroke={shade(haut, 24)} strokeWidth=\".8\" opacity=\".55\" />\n            <ellipse cx=\"48.1\" cy=\"57.6\" rx=\".85\" ry=\".68\" fill={tief} />\n            <ellipse cx=\"51.9\" cy=\"57.6\" rx=\".85\" ry=\".68\" fill={tief} />\n          </g>);`,
'Nasenformen');

insertBefore(
`        {modern && z.wangen===3`,
`        {z.details===7 && <path d={\"M34,\"+(augenY+5)+\" Q40,\"+(augenY+7)+\" 46,\"+(augenY+5)\n          +\" M54,\"+(augenY+5)+\" Q60,\"+(augenY+7)+\" 66,\"+(augenY+5)} fill=\"none\"\n          stroke={shade(haut,-34)} strokeWidth=\".8\" opacity=\".42\" />}\n        {z.details===8 && <path d={\"M47,\"+(kinnY-4)+\" l6,2\"} fill=\"none\" stroke={shade(haut,-48)}\n          strokeWidth=\"1\" strokeLinecap=\"round\" opacity=\".65\" />}\n`,
'Gesichtsdetails');

insertBefore(
`        {/* ---- Augen: Lidspalt, Iris in der gewählten Farbe, Pupille, Glanz ----`,
`        {modern && z.wangen===5 && <path d=\"M29 53 Q35 49 41 52 M71 53 Q65 49 59 52\" fill=\"none\"\n          stroke={schatten} strokeWidth=\"1.25\" strokeLinecap=\"round\" opacity=\".55\"/>}\n        {modern && z.wangen===6 && <path d=\"M30 56 Q35 61 42 59 M70 56 Q65 61 58 59\" fill=\"none\"\n          stroke={schatten} strokeWidth=\"1.35\" strokeLinecap=\"round\" opacity=\".5\"/>}\n`,
'Wangenformen');

fs.writeFileSync(file,source);
console.log('CHAR-P1-02 Renderer-Patch angewendet.');
