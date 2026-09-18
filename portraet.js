/* Stabile gespeicherte Indizes: neue Formen nur anhängen, alte Freischaltungen behalten. */
export function portraetOptionen(basis,g){
 const a=Object.fromEntries(Object.entries(basis).map(([k,n])=>[k,Array.from({length:n},(_,i)=>i)]));
 const frisurBonus=g==='w'?17:15;
 a.frisur=[...a.frisur,...Array.from({length:frisurBonus},(_,i)=>(g==='w'?14:16)+i)];
 if(g!=='w')a.bart=[...a.bart,10,11,12,13,14,15];
 /* CHAR-P1-02: Die gespeicherten IDs bleiben gültig, aber nachgewiesene
    72-px-Dubletten werden nicht länger als neue Auswahl angeboten.
    - Nase 4 ist bei 72 px praktisch identisch zu 0, Nase 7 zu 2.
    - Wange 4 unterscheidet sich bei 72/96 px nur in 1–2 relevanten Pixeln.
    Alte Spielstände rendern diese IDs weiterhin unverändert; nur die
    Neuauswahl/Würfelung nutzt die tragfähigeren Formen plus neue IDs. */
 if(a.nase)a.nase=a.nase.filter(i=>i!==4&&i!==7);
 if(a.wangen)a.wangen=a.wangen.filter(i=>i!==4);
 for(const [k,neu] of Object.entries({brauen:[5,6],augen:[5,6,7,8],nase:[8,9,10,11],mund:[7,8],ohren:[3,4],wangen:[3,5,6]}))if(a[k])a[k]=[...a[k],...neu];
 if(g==='w'&&a.schminke)a.schminke=[...a.schminke,5,6];
 if(basis.schmuck>2)a.schmuck=[...a.schmuck,6,7];
 a.details=[0,1,2,3,4,5,6,7,8];return a;
}
export function portraetWuerfeln(alt,optionen,fest,zufall){
 const neu={...alt,stil:2};
 for(const [k,werte] of Object.entries(optionen))if(!fest[k])neu[k]=werte[Math.min(werte.length-1,Math.floor(zufall()*werte.length))];
 return neu;
}
export const PORTRAET_NAMEN={
 brauen:['Gerade','Geschwungen','Markant','Fein','Breit geschwungen','Weich auslaufend','Sanfter Bogen'],
 augen:['Mandelförmig','Schmal','Betont','Tief liegend','Offen','Sanft rund','Leicht angehoben','Angehobene Außenkante','Abgesenkte Außenkante'],
 nase:['Ausgeglichen','Breit','Schmal','Lang','Gerade','Rund','Kräftig','Fein','Kurze Nasenspitze','Sanfter Nasenrücken','Breite Stupsnase','Hoher Nasenrücken'],
 mund:['Lächelnd','Gerade','Schmal geschwungen','Entspannt','Ausgeglichen','Voll','Breit','Leichtes Lächeln','Offenes Lächeln'],
 ohren:['Klein','Mittel','Groß','Anliegend','Rund'],
 wangen:['Weich','Kinngrübchen','Wangenknochen','Dezente Kontur','Wangengrübchen','Hohe Wangenkontur','Weiche Wangenfülle'],
 haut:['Hell warm','Hell golden','Mittel golden','Bronze','Braun warm','Dunkel warm','Sehr hell','Hell rosig','Mittel rosig','Kupfer','Braun neutral','Dunkel neutral','Tiefbraun','Sehr dunkel'],
 haar:['Schwarzbraun','Dunkelbraun','Braun','Hellbraun','Goldblond','Grau','Kupferrot','Hellblond','Dunkelblond','Kastanie','Dunkelrot','Silbergrau','Weiß'],
 bart:['Glatt','Stoppeln','Dreitagebart','Schnurrbart','Kinnbart','Ziegenbart','Kurzer Vollbart','Langer Vollbart','Kinnriemen','Koteletten','Schnurrbart und Stoppeln','Breiter Schnurrbart','Konturierter Bart','Spitzer Vollbart','Ankerbart','Breiter Vollbart'],
 details:['Ohne','Feine Sommersprossen','Dichte Sommersprossen','Augenbrauennarbe','Wangennarbe','Schönheitsfleck','Leichte Lachfältchen','Leichte Augenringe','Kleine Kinnnarbe'],
 schmuck:['Ohne','Ohrstecker','Breites Stirnband','Runde Brille','Kette','Schmales Stirnband','Sportbrille','Creolen'],
 schminke:['Ohne','Augen betonen','Lippen betonen','Augen und Lippen','Dezent','Feiner Lidstrich','Warmer Lippenakzent'],
};
export const NEUE_FRISUREN=['Weiche Wellen','Kurze Naturkrause','Geflochtener Ansatz','Locken mit Seitenscheitel','Mittelscheitel mit Fall','Kurzer Fade','Lange Locs','Irokesenschnitt','Schulterlang glatt','Flechtkranz'];
export const NEUE_FRISUREN_M=[...NEUE_FRISUREN,'Mittellange Locken','Lange Locken','Box Braids','Zurückgebundene Locs','Asymmetrischer Fringe'];
export const NEUE_FRISUREN_W=[...NEUE_FRISUREN,'Vollpony','Curtain Bangs','Asymmetrischer Bob','Half-up','Langer Flechtzopf','Lange Wellen','Twin Buns'];

export const FRISUR_NAMEN={m:['Rasiert','Kurz','Seitenscheitel','Undercut','Locken','Afro','Igel','Halbglatze','Zöpfe','Knoten','Vokuhila','Glatze','Zurückgekämmt','Strukturierter Kurzschnitt','Flacher Schnitt','Seitlicher Ansatz'],w:['Kurz','Lang offen','Voluminös','Bob','Knoten','Seitenzopf','Lang mit Scheitel','Pixie','Locken','Kurzer Ansatz','Hoher Pferdeschwanz','Geflochtene Zöpfe','Hochgesteckt','Naturvolumen']};
export function frisurName(index,g='m'){
 const start=g==='w'?14:16,neu=g==='w'?NEUE_FRISUREN_W:NEUE_FRISUREN_M;
 return index>=start?(neu[index-start]||('Frisur '+(index+1))):(FRISUR_NAMEN[g]?.[index]||('Frisur '+(index+1)));
}
