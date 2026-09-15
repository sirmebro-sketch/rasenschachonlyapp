const {test}=require('node:test');
const assert=require('node:assert/strict');
const {build}=require('esbuild');

test('Materialkanten lassen die Fläche frei und trennen SVG-Referenzen',async()=>{
 const r=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {KartenEffekt} from './karteneffekte.jsx';export const html=renderToStaticMarkup(<>{['karte','elf','pack'].map(form=><KartenEffekt key={form} form={form} stark still/>)}</>);`,resolveDir:process.cwd(),loader:'jsx'},bundle:true,platform:'node',format:'cjs',write:false});
 const m={exports:{}};new Function('module','exports','require',r.outputFiles[0].text)(m,m.exports,require);
 const html=m.exports.html;
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,3);assert.equal(new Set(ids).size,3);
 for(const m of html.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(m[1]));
 const paths=[...html.matchAll(/<path\b[^>]*>/g)].map(m=>m[0]);
 assert.equal(paths.length,6);for(const p of paths)assert.match(p,/fill="none"/);
 assert.doesNotMatch(html,/class="rs-materiallicht"/);
 assert.equal((html.match(/aria-hidden="true"/g)||[]).length,3);
});
