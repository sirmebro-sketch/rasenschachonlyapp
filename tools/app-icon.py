#!/usr/bin/env python3
"""Rebuild the native Android icon and legacy PNGs from geometry, never from a raster.
Requires Python fonttools (including Brotli for WOFF2), and Inkscape on PATH.
The existing embedded display font supplies outlined lettering; no system font is used.
Run from repository root: python tools/app-icon.py
"""
from pathlib import Path
from io import BytesIO
import base64, re, subprocess, tempfile
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from xml.sax.saxutils import escape
ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / 'android/app/src/main/res'
fontdata = re.search(r'base64,([^)]*)', (ROOT/'schriften.js').read_text()).group(1)
font = TTFont(BytesIO(base64.b64decode(fontdata)))
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
paths = []
def path(d, color): paths.append((d,color))
def rect(x,y,w,h,c): path(f'M{x} {y}h{w}v{h}h{-w}Z',c)
def circle(x,y,r,c): path(f'M{x-r} {y}a{r} {r} 0 1 0 {2*r} 0a{r} {r} 0 1 0 {-2*r} 0',c)
def lettering(text,x,y,w,h,color):
 names=[cmap[ord(c)] for c in text]
 total=sum(glyphs[n].width for n in names)
 cap=font['OS/2'].sCapHeight
 advance=0
 for n in names:
  pen=SVGPathPen(glyphs)
  glyphs[n].draw(TransformPen(pen,(w/total,0,0,-h/cap,x+advance*w/total,y)))
  path(pen.getCommands(),color);advance+=glyphs[n].width
# The compact badge keeps the former red / ivory / turf identity. Clear geometry
# replaces photographic noise that turns grey when launcher icons are small.
rect(-30,-30,160,160,'#131D16')
path('M3 67L97 52V86Q97 97 86 97H14Q3 97 3 86Z','#2E4824')
path('M3 80L97 65V75L3 90Z','#36502A')
path('M15 96L97 83V86Q97 97 86 97H15Z','#23381E')
# Pitch lines and distant goal remain beneath the monogram.
path('M5 75L94 60L94 61L5 76Z M11 92L94 79L94 80L11 93Z','#778168')
path('M80 58V48H93V58H91V50H82V58Z','#A4AA96')
path('M84 50H85V57H84Z M88 50H89V57H88Z M82 53H91V54H82Z','#596553')
# Floodlights: deliberately bounded, crisp beams rather than fuzzy bitmap glow.
for x in (10,88):
 path(f'M{x-2} 46L{x-4} 68H{x-3}L{x-1} 46Z','#7A8873')
 rect(x-3,40,7,5,'#C6D1B5')
 for dx in (-2,1):
  for dy in (41,43): rect(x+dx,dy,2,1.2,'#FFFCEE')
path('M5 37L95 31V35L5 41Z','#DDDCC6')
path('M5 15Q5 5 15 5H85Q95 5 95 15V31L5 37Z','#BB201C')
path('M7 15Q7 7 16 7H85Q92 7 93 14L7 20Z','#D63227')
lettering('RASENSCHACH',18,31,64,12,'#FFFDEE')
# Custom slanted XI avoids font dependencies and keeps the distinctive large mark.
path('M32 42H48L54 58L64 39H79L60 68L70 91H54L48 76L39 94H23L41 66Z','#A21D1A')
path('M32 40H47L53 56L63 38H77L58 67L68 90H53L47 74L37 92H22L40 65Z','#F6F4E8')
path('M82 38H96L86 91H72Z','#A21D1A')
path('M80 37H93L83 90H70Z','#F6F4E8')
# Recognisable stitched football, kept separate from the X.
circle(17,81,8.5,'#0C140E');circle(16.5,80.5,7.6,'#F2EFDA')
path('M15 76L19 77L20 81L16.5 83L13.5 80Z M10 77L12 74L15 73L14 75L11 78Z M23 78L24 81L22 84L21 81Z M13 86L16 88L19 87L18 85L15 84Z','#202B23')
path('M14 80L11 82L10 81L13.5 79Z M18 77L20 75L21 76L19 78Z M18 82L19 85L18 86L17 82Z','#52604C')

def svg(scale=1,offset=0,bg=False):
 p=''.join(f'<path fill="{c}" d="{d}"/>' for d,c in paths)
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'+('<path fill="#171A12" d="M0 0H100V100H0Z"/>' if bg else '')+f'<g transform="translate({offset} {offset}) scale({scale})">{p}</g></svg>'
(ROOT/'artwork/app-icon.svg').write_text(svg(bg=True))
# Full-bleed background; Android supplies the sole outer mask.
# The artwork spans the visible 72dp region, without a second inset badge.
xml='<?xml version="1.0" encoding="utf-8"?>\n<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">\n<group android:translateX="17" android:translateY="17" android:scaleX="0.74" android:scaleY="0.74">\n'
xml+='\n'.join(f'<path android:fillColor="{c}" android:pathData="{escape(d)}"/>' for d,c in paths)
xml+='\n</group>\n</vector>\n'
(RES/'drawable-v24/ic_launcher_foreground.xml').write_text(xml)
with tempfile.TemporaryDirectory() as tmp:
 source=Path(tmp)/'icon.svg'
 for density,size in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
  target=RES/f'mipmap-{density}'
  for name in ['ic_launcher','ic_launcher_round']:
   art=svg(bg=True)
   if name=='ic_launcher_round':
    art=art.replace('<g ', '<defs><clipPath id="round"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#round)"><g ',1).replace('</svg>','</g></svg>')
    art=art.replace('<path fill="#171A12" d="M0 0H100V100H0Z"/>','')
   source.write_text(art)
   subprocess.run(['inkscape',str(source),f'--export-filename={target/name}.png',f'--export-width={size}',f'--export-height={size}'],check=True,stdout=subprocess.DEVNULL)
print('Wrote outlined SVG master, native adaptive vector and 10 launcher PNGs.')
