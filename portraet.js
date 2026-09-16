/* Stabile gespeicherte Indizes: neue Formen nur anhängen, alte Freischaltungen behalten. */
export function portraetOptionen(basis,g){
 const a=Object.fromEntries(Object.entries(basis).map(([k,n])=>[k,Array.from({length:n},(_,i)=>i)]));
 a.frisur=[...a.frisur,...Array.from({length:6},(_,i)=>(g==='w'?14:16)+i)];
 if(g!=='w')a.bart=[...a.bart,10,11,12];
 a.details=[0,1,2,3,4];return a;
}
export function portraetWuerfeln(alt,optionen,fest,zufall){
 const neu={...alt,stil:2};
 for(const [k,werte] of Object.entries(optionen))if(!fest[k])neu[k]=werte[Math.min(werte.length-1,Math.floor(zufall()*werte.length))];
 return neu;
}
export const PORTRAET_NAMEN={
 haut:['Hell warm','Hell golden','Mittel golden','Bronze','Braun warm','Dunkel warm','Sehr hell','Hell rosig','Mittel rosig','Kupfer','Braun neutral','Dunkel neutral','Tiefbraun','Sehr dunkel'],
 haar:['Schwarzbraun','Dunkelbraun','Braun','Hellbraun','Goldblond','Grau','Kupferrot','Hellblond','Dunkelblond','Kastanie','Dunkelrot','Silbergrau','Weiß'],
 bart:['Glatt','Stoppeln','Dreitagebart','Schnurrbart','Kinnbart','Ziegenbart','Kurzer Vollbart','Langer Vollbart','Kinnriemen','Koteletten','Schnurrbart und Stoppeln','Breiter Schnurrbart','Konturierter Bart'],
 details:['Ohne','Feine Sommersprossen','Dichte Sommersprossen','Augenbrauennarbe','Wangennarbe'],
 schmuck:['Ohne','Ohrstecker','Stirnband','Brille','Sportbrille','Kette'],
 schminke:['Ohne','Augen betonen','Lippen betonen','Augen und Lippen','Dezent'],
};
export const NEUE_FRISUREN=['Weiche Wellen','Kurze Naturkrause','Geflochtener Ansatz','Locken mit Seitenscheitel','Mittelscheitel mit Fall','Kurzer Fade'];

export const FRISUR_NAMEN={m:['Rasiert','Kurz','Seitenscheitel','Undercut','Locken','Afro','Igel','Halbglatze','Zöpfe','Knoten','Vokuhila','Glatze','Zurückgekämmt','Strukturierter Kurzschnitt','Flacher Schnitt','Seitlicher Ansatz'],w:['Kurz','Lang offen','Voluminös','Bob','Knoten','Seitenzopf','Lang mit Scheitel','Pixie','Locken','Kurzer Ansatz','Hoher Pferdeschwanz','Geflochtene Zöpfe','Hochgesteckt','Naturvolumen']};
