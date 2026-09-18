import {test,expect} from '@playwright/test';

test('CHAR-P1-03: Frisuren sind vielfältig, append-only und direkt vergleichbar',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','Die vollständigen Frisurenbögen werden einmal groß geprüft; responsive Galerie bleibt separat abgedeckt.');
 test.setTimeout(180000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/.preview/charakter-inventar.html');
 await page.getByRole('combobox',{name:'Merkmal',exact:true}).selectOption('frisur');
 const gender=page.getByRole('combobox',{name:'Geschlecht',exact:true});
 const groesse=page.getByRole('combobox',{name:'Größe',exact:true});
 const cards=page.locator('[data-testid="varianten"] article');
 const pruefe=async(g,ids)=>{
  await gender.selectOption(g);await expect(cards).toHaveCount(31);
  for(const [id,name] of ids){const card=page.locator(`[data-testid="varianten"] article[data-id="${id}"]`);await expect(card).toContainText(name);await expect(card.locator('svg[aria-label="Spielerporträt"]')).toHaveCount(7);}
  for(const size of ['72','96','145']){await groesse.selectOption(size);await page.getByTestId('varianten').screenshot({path:testInfo.outputPath(`frisuren-${g}-${size}.png`)});}
 };
 await pruefe('m',[[13,'Strukturierter Kurzschnitt'],[26,'Mittellange Locken'],[27,'Lange Locken'],[28,'Box Braids'],[29,'Zurückgebundene Locs'],[30,'Asymmetrischer Fringe']]);
 await pruefe('w',[[9,'Kurzer Ansatz'],[13,'Naturvolumen'],[24,'Vollpony'],[25,'Curtain Bangs'],[26,'Asymmetrischer Bob'],[27,'Half-up'],[28,'Langer Flechtzopf'],[29,'Lange Wellen'],[30,'Twin Buns']]);
 const subset=async(g,size,ids,name)=>{
  await gender.selectOption(g);await groesse.selectOption(String(size));
  await cards.evaluateAll((nodes,keep)=>nodes.forEach(n=>{n.style.display=keep.includes(Number(n.dataset.id))?'':'none';}),ids);
  await page.getByTestId('varianten').screenshot({path:testInfo.outputPath(name+'.png')});
  await cards.evaluateAll(nodes=>nodes.forEach(n=>{n.style.display='';}));
 };
 for(const size of [72,96]){await subset('m',size,[1,13,21],`vergleich-m-alt-1-13-21-${size}`);await subset('w',size,[0,7,9],`vergleich-w-alt-0-7-9-${size}`);await subset('w',size,[2,8,13],`vergleich-w-alt-2-8-13-${size}`);}
 for(const [id,nahe] of [[26,[4,16,19]],[27,[22,24]],[28,[8,18,25]],[29,[9,22]],[30,[2,15,21]]])await subset('m',72,[...nahe,id],`vergleich-m-neu-${id}-72`);
 for(const [id,nahe] of [[24,[0,7,9]],[25,[6,18]],[26,[3,7,9]],[27,[1,4,10,12]],[28,[5,11,23]],[29,[14,17,22]],[30,[4,12]]])await subset('w',72,[...nahe,id],`vergleich-w-neu-${id}-72`);
 expect(errors).toEqual([]);
});
