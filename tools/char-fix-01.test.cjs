const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
const haar=fs.readFileSync(path.join(root,'haarformen.jsx'),'utf8');

test('CHAR-FIX-01: Hals und Kragen besitzen einen gemeinsamen festen Koerperanker',()=>{
 assert.match(app,/const KRAGEN_Y = 74;/);
 assert.match(app,/const HALS_OBEN_Y = 55;/);
 assert.match(app,/const HALS_BASIS_Y = 79;/);
 assert.doesNotMatch(app,/\(kinnY - 10\) \+ " h14 v14/,'Halsbasis darf nicht mehr aus dem Kinn abgeleitet werden');
 assert.match(app,/Kragen liegt zuletzt auf dem Hals/);
});

test('CHAR-FIX-01: Langkantig bleibt ID 11, waechst aber nach oben statt in den Kragen',()=>{
 const m=app.match(/\{ n: "Langkantig", b: 24, j: 19, kinn: (\d+), profil: "lang" \}/);
 assert(m,'Langkantig muss weiter als dieselbe benannte append-only Form existieren');
 assert.equal(Number(m[1]),72);
 assert.match(app,/k\.profil === "lang"\) return `M\$\{l\+1\},40 L\$\{l\+2\},26 Q\$\{l\+5\},11 42,9 Q50,7 58,9/);
});

test('CHAR-FIX-01/04: beide modernen Haarlagen erhalten Profil und echte Kopfhuelle',()=>{
 const props=(app.match(/kopfprofil=\{kopf\.profil\|\|''\} kopfpfad=\{kopfD\}/g)||[]).length;
 assert.equal(props,2,'Vorder- und Hinterhaar muessen dieselbe Kopfanpassung erhalten');
 assert.match(haar,/const neueKopfpassform=\['trapez','lang','diamant','kurzbreit'\]\.includes\(kopfprofil\)&&kopfpfad/);
 assert.match(haar,/const profilBonus=\{trapez:\.8,lang:1\.4,diamant:\.8,kurzbreit:\.8\}\[kopfprofil\]\|\|0/);
 assert.match(haar,/const haarbreite=neueKopfpassform&&kompakt\?Math\.min\(31\.5,Math\.max\(breite\+profilBonus,24\)\):breite/);
 assert.match(haar,/data-haar-passung=\{neueKopfpassform&&kompakt\?'kopfkontur':'standard'\}/);
 assert.match(haar,/data-haar-vorderclip=\{neueKopfpassform&&kopfnah\?'kopf':'frei'\}/);
 assert.match(haar,/clipPathUnits="userSpaceOnUse"/);
});

test('CHAR-FIX-01/04: rasiert bleibt flach, nutzt auf neuen Köpfen aber deren echte Breite',()=>{
 assert.match(haar,/const rasierKappe=neueKopfpassform/);
 assert.match(haar,/'M22 38 C24 16 37 8 50 8 C63 8 76 16 78 38/);
 assert.match(haar,/: 'M26 34 C28 18 38 11 50 11 C62 11 72 18 74 34/);
 assert.match(haar,/const unterlage=typ==='rasiert'\?rasierKappe:scalp/);
 assert.match(haar,/opacity=\{typ==='rasiert'\?\.32:1\}/);
});
