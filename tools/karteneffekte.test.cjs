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

test('Gold bleibt Edelmetall, Legendaer behaelt den Regenbogen-Holocharakter',()=>{
 const fs=require('node:fs');
 const src=fs.readFileSync('karteneffekte.jsx','utf8');
 assert.match(src,/const goldMetall=dezent&&!stark/);
 assert.match(src,/const deckkraft=dezent\\?\\(stark\\?\\.78:\\.72\\):1/);
 assert.doesNotMatch(src,/dezent\\s*\\?\\s*\\.16/);
 for(const farbe of ['#704407','#bd7d12','#efb936','#fff0a0','#d89518','#f5d061','#7b500c'])assert.match(src,new RegExp(farbe,'i'));
 for(const farbe of ['#ff6ecb','#8f7dff','#55e8ff','#77ffad','#ffd76d'])assert.match(src,new RegExp(farbe,'i'));
 assert.match(src,/rs-gold-iris/);
 assert.match(src,/#efb4ff[^\\n]+stopOpacity="\\.08"/i);
});
