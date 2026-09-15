import { vorsatzStand } from './vorsatz.js';

/* Nur belegbare Erinnerungen, keine erfundenen Beziehungen aus evLog:
   evLog erfasst bereits gezogene, eventuell übersprungene Ereignisse. */
export function persoenlicherRueckblick(p) {
 const texte=[];
 const v=vorsatzStand(p);
 if(v?.erfuellt)texte.push(`Du hast deinen Vorsatz „${v.n}“ erfüllt. ${v.text}.`);
 else if(v?.gebrochen)texte.push(`Dein Weg führte dich ins Ausland. Der Vorsatz „${v.n}“ blieb dabei zurück.`);
 else if(v)texte.push(`Dein Vorsatz „${v.n}“ blieb offen: ${v.text}.`);
 if(p.flags?.mentorSpur&&p.videoKontakt?.name)texte.push(`${p.videoKontakt.name} gibt deine Video-Notizen inzwischen weiter. Etwas von deiner Erfahrung bleibt auf dem Trainingsplatz.`);
 else if(p.videoKontakt?.name)texte.push(`Mit ${p.videoKontakt.name} hast du deine frühen Video-Notizen geteilt – einschließlich deiner eigenen Fehler.`);
 const buch=p.straenge?.buch;
 if(buch?.stufe>=3){const t={offen:'Du hast deine Geschichte mit ihren unbequemen Stellen öffentlich erzählt.',kontrolle:'Bei deinem Buch hast du selbst entschieden, welche Erinnerungen privat bleiben.',ohne:'Deine Geschichte wurde auch ohne deine Mitarbeit erzählt.'};if(t[buch.weg])texte.push(t[buch.weg]);}
 const spaet=p.straenge?.spaet;
 if(spaet){const t={einsatz:'Im späteren Karriereverlauf hast du noch einmal bewusst an deiner Einsatzchance gearbeitet.',begleiten:'Im späteren Karriereverlauf hast du Trainingszeit für die Begleitung jüngerer Spieler reserviert.',kraefte:'Im späteren Karriereverlauf hast du deine Kräfte bewusst eingeteilt und freiwillige Extras gestrichen.'};if(t[spaet.weg])texte.push(t[spaet.weg]);}
 return texte.slice(0,4);
}
