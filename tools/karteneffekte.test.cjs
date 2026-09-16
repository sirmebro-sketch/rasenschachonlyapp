const {test}=require('node:test');
const assert=require('node:assert/strict');
const {build}=require('esbuild');

test('Folien trennen SVG-Referenzen und lassen Pack-Folien flächig',async()=>{
 const r=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {KartenEffekt} from './karteneffekte.jsx';export const html=renderToStaticMarkup(<>{['karte','elf','pack'].map(form=><KartenEffekt key={form} form={form} stark still/>)}</>);`,resolveDir:process.cwd(),loader:'jsx'},bundle:true,platform:'node',format:'cjs',write:false});
 const m={exports:{}};new Function('module','exports','require',r.outputFiles[0].text)(m,m.exports,require);
 const html=m.exports.html;
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,12);assert.equal(new Set(ids).size,12);
 for(const m of html.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(m[1]));
 assert.equal((html.match(/z-index:-1/g)||[]).length,2);
 assert.equal((html.match(/<mask/g)||[]).length,0);
 assert.equal((html.match(/rs-folie-still/g)||[]).length,3);
 assert.doesNotMatch(html,/M2 2 H98/);
 assert.equal((html.match(/aria-hidden="true"/g)||[]).length,3);
});
