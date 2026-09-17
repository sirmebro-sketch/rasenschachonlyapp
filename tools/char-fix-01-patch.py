from pathlib import Path

p=Path('App.jsx')
s=p.read_text()

# 1) Langkantig bleibt dieselbe append-only ID, wird aber nach oben verlaengert
# statt bis in den festen Kragen hinein zu wachsen.
old='  { n: "Langkantig", b: 24, j: 19, kinn: 78, profil: "lang" },'
new='  { n: "Langkantig", b: 24, j: 19, kinn: 72, profil: "lang" },'
if s.count(old)!=1:
    raise SystemExit(f'Langkantig-Anker unerwartet: {s.count(old)}')
s=s.replace(old,new,1)

old='  if (k.profil === "lang") return `M${l+1},40 L${l+2},27 Q${l+6},13 50,11 Q${r-6},13 ${r-2},27 L${r-1},52 C${r-1},62 ${kur},${k.kinn-8} ${kur},${k.kinn-6} C${kur},${k.kinn-1} ${50+ku*.45},${k.kinn} 50,${k.kinn} C${50-ku*.45},${k.kinn} ${kul},${k.kinn-1} ${kul},${k.kinn-6} C${kul},${k.kinn-8} ${l+1},62 ${l+1},52 Z`;'
new='  if (k.profil === "lang") return `M${l+1},40 L${l+2},26 Q${l+5},11 42,9 Q50,7 58,9 Q${r-5},11 ${r-2},26 L${r-1},51 C${r-1},59 ${kur},${k.kinn-8} ${kur},${k.kinn-6} C${kur},${k.kinn-1} ${50+ku*.45},${k.kinn} 50,${k.kinn} C${50-ku*.45},${k.kinn} ${kul},${k.kinn-1} ${kul},${k.kinn-6} C${kul},${k.kinn-8} ${l+1},59 ${l+1},51 Z`;'
if s.count(old)!=1:
    raise SystemExit(f'Langpfad-Anker unerwartet: {s.count(old)}')
s=s.replace(old,new,1)

# 2) Ein gemeinsamer Hals-/Kragen-Anker. Kopf/Kinn duerfen variieren, die
# Basis zum Trikot darf es nicht mehr.
old='''  const lidfarbe = shade(haut, -34);\n  const kopfD = kopfPfad(kopf);\n\n  /* Haaransatz folgt der Kopfbreite, damit keine Frisur neben dem Kopf sitzt. */'''
new='''  const lidfarbe = shade(haut, -34);\n  const kopfD = kopfPfad(kopf);\n  /* CHAR-FIX-01: Trikot/Kragen/Halsbasis bilden EINEN unverrueckbaren Anker.\n     Der Kopf darf kuerzer oder laenger sein; die Verbindung zum Koerper nicht. */\n  const KRAGEN_Y = 74;\n  const HALS_OBEN_Y = 55;\n  const HALS_BASIS_Y = 79;\n  const halsSchattenY = Math.min(kinnY - 1, KRAGEN_Y - 2);\n  const halsSchattenEnde = Math.min(kinnY + 4, KRAGEN_Y + 1);\n\n  /* Haaransatz folgt der Kopfbreite, damit keine Frisur neben dem Kopf sitzt. */'''
if s.count(old)!=1:
    raise SystemExit(f'Halskonstanten-Anker unerwartet: {s.count(old)}')
s=s.replace(old,new,1)

old='''        {/* Schultern und Trikot */}\n        <path d="M2,100 C4,82 22,74 50,74 C78,74 96,82 98,100 Z" fill={c1} />\n        <path d="M2,100 C4,82 22,74 34,74 L40,100 Z" fill={shade(c1, -16)} />\n        <path d="M40,74 L50,87 L60,74 L56,73 L50,82 L44,73 Z" fill={c2} />\n\n        {/* Hals mit Schatten unter dem Kiefer */}\n        <path d={"M43," + (kinnY - 10) + " h14 v14 c0,4 -14,4 -14,0 Z"} fill={schatten} />\n        <path d={"M43," + (kinnY - 10) + " h14 v4 c-4,3 -10,3 -14,0 Z"} fill={tief} />\n\n        {modern && <Haarform index={z.frisur} weiblich={w} breite={kopf.b} farbe={haar} hell={haarHell} ebene="hinten"/>}'''
new='''        {/* Schultern und Trikot: feste Lage, unabhaengig von der Kopfform. */}\n        <path d={`M2,100 C4,82 22,${KRAGEN_Y} 50,${KRAGEN_Y} C78,${KRAGEN_Y} 96,82 98,100 Z`} fill={c1} />\n        <path d={`M2,100 C4,82 22,${KRAGEN_Y} 34,${KRAGEN_Y} L40,100 Z`} fill={shade(c1, -16)} />\n\n        {/* Hals laeuft hinter Kopf UND Kragen bis zur immer gleichen Basis.\n            So kann ein kurzer Kopf nicht mehr schweben und ein langer Kopf\n            drueckt den Kragen nicht mehr nach unten. */}\n        <path d={`M43,${HALS_OBEN_Y} H57 V${HALS_BASIS_Y} Q57,81 50,81 Q43,81 43,${HALS_BASIS_Y} Z`} fill={schatten} />\n        <path d={`M43,${halsSchattenY} H57 V${halsSchattenEnde} Q50,${halsSchattenEnde+2} 43,${halsSchattenEnde} Z`} fill={tief} opacity=".72" />\n        {/* Kragen liegt zuletzt auf dem Hals und sitzt damit sichtbar sauber. */}\n        <path d={`M40,${KRAGEN_Y} L50,${KRAGEN_Y+13} L60,${KRAGEN_Y} L56,${KRAGEN_Y-1} L50,${KRAGEN_Y+8} L44,${KRAGEN_Y-1} Z`} fill={c2} />\n\n        {modern && <Haarform index={z.frisur} weiblich={w} breite={kopf.b} kopfprofil={kopf.profil||''} kopfpfad={kopfD} farbe={haar} hell={haarHell} ebene="hinten"/>}'''
if s.count(old)!=1:
    raise SystemExit(f'Koerper/Hals-Anker unerwartet: {s.count(old)}')
s=s.replace(old,new,1)

# 3) Vorderes modernes Haar erhaelt dieselbe echte Kopfsilhouette. Den bereits
# gepatchten Hinterkopf nicht doppelt anfassen.
needle='<Haarform index={z.frisur} weiblich={w} breite={kopf.b}'
hits=s.count(needle)
if hits!=2:
    raise SystemExit(f'Haarform-Aufrufe unerwartet: {hits}')
old_front='<Haarform index={z.frisur} weiblich={w} breite={kopf.b} farbe={haar} hell={haarHell}/>'
new_front='<Haarform index={z.frisur} weiblich={w} breite={kopf.b} kopfprofil={kopf.profil||\'\'} kopfpfad={kopfD} farbe={haar} hell={haarHell}/>'
if s.count(old_front)!=1:
    raise SystemExit(f'Vorderhaar-Anker unerwartet: {s.count(old_front)}')
s=s.replace(old_front,new_front,1)

p.write_text(s)
print('CHAR-FIX-01 App.jsx gepatcht')
