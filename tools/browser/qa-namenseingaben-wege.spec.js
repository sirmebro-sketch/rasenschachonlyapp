import {test,expect} from '@playwright/test';

const spieltest = '/.preview/spieltest.html';
const spielername = 'Jean-Pierre Großmüller';
const vereinsname = 'FC Überlänge Süd-West';
const ort = 'München Süd';

function ueberlappt(a,b){
  if(!a||!b)return false;
  return !(a.x+a.width<=b.x || b.x+b.width<=a.x || a.y+a.height<=b.y || b.y+b.height<=a.y);
}

test('QA Namenseingabe Charakter: Fokus, geringe Höhe, Zurück und Bestätigen', async ({page}, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Auftrag nur 320/390 px');
  await page.goto(spieltest);
  await page.getByRole('button',{name:'Neues Spiel',exact:true}).click();
  await page.getByRole('button',{name:'Überspringen',exact:true}).click();
  await page.getByRole('button',{name:/NEUE\s+LAUFBAHN/}).click();

  const name = page.locator('input[placeholder="z. B. Kevin Sarantis"]');
  const nummer = page.locator('input[maxlength="2"]');
  const start = page.getByRole('button',{name:"LOS GEHT'S",exact:true});
  const zurueck = page.getByRole('button',{name:'Zurück',exact:true});

  await name.fill(spielername);
  await name.focus();
  await page.screenshot({path:testInfo.outputPath('char-name-focus.png'),fullPage:false});

  await nummer.fill('17');
  await nummer.focus();
  await expect(name).toHaveValue(spielername);
  await name.focus();
  await name.press('Enter');
  await expect(name).toHaveValue(spielername);
  await expect(page.getByText('SPIELERPASS ANLEGEN',{exact:true})).toBeVisible();

  const lowHeight = testInfo.project.name === 'schmal' ? 420 : 500;
  await page.setViewportSize({width:testInfo.project.name === 'schmal' ? 320 : 390,height:lowHeight});
  await name.focus();
  const nameBox = await name.boundingBox();
  const startBox = await start.boundingBox();
  const backBox = await zurueck.boundingBox();
  console.log('QA_CHAR_LOW',JSON.stringify({
    project:testInfo.project.name,
    viewport:page.viewportSize(),
    nameBox,startBox,backBox,
    overlapNameStart:ueberlappt(nameBox,startBox),
    overlapNameBack:ueberlappt(nameBox,backBox)
  }));
  await page.screenshot({path:testInfo.outputPath('char-low-height.png'),fullPage:false});

  await zurueck.click();
  await expect(page.getByRole('button',{name:/NEUE\s+LAUFBAHN/})).toBeVisible();
  await page.getByRole('button',{name:/NEUE\s+LAUFBAHN/}).click();
  const neuerName = page.locator('input[placeholder="z. B. Kevin Sarantis"]');
  await expect(neuerName).not.toHaveValue(spielername);

  await neuerName.fill(spielername);
  await page.setViewportSize({width:testInfo.project.name === 'schmal' ? 320 : 390,height:testInfo.project.name === 'schmal' ? 720 : 844});
  await page.getByRole('button',{name:"LOS GEHT'S",exact:true}).click();
  await expect(page.getByText(spielername,{exact:true})).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('char-confirmed.png'),fullPage:false});
});

test('QA Namenseingabe Verein: Fokus, Scroll, Zurück und Bestätigen', async ({page}, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Auftrag nur 320/390 px');
  await page.goto(spieltest);
  await page.getByRole('button',{name:'Fortgeschritten',exact:true}).click();
  await page.getByRole('button',{name:'Verstanden',exact:true}).click();
  await page.getByRole('button',{name:/DEIN VEREIN/}).click();

  const name = page.locator('input[placeholder="Vereinsname"]');
  const stadt = page.locator('input[placeholder="Stadt"]');
  const zurueck = page.getByRole('button',{name:'Zurück',exact:true});
  await name.fill(vereinsname);
  await stadt.fill(ort);
  await stadt.focus();
  await expect(name).toHaveValue(vereinsname);
  await page.screenshot({path:testInfo.outputPath('verein-name-ort.png'),fullPage:false});

  await stadt.press('Enter');
  await expect(page.locator('input[placeholder="Vereinsname"]')).toHaveValue(vereinsname);
  await expect(page.getByRole('button',{name:'Verein anlegen',exact:true})).toBeVisible();

  const lowHeight = testInfo.project.name === 'schmal' ? 420 : 500;
  await page.setViewportSize({width:testInfo.project.name === 'schmal' ? 320 : 390,height:lowHeight});
  await stadt.focus();
  await page.screenshot({path:testInfo.outputPath('verein-low-focus.png'),fullPage:false});

  const anlegen = page.getByRole('button',{name:'Verein anlegen',exact:true});
  await anlegen.scrollIntoViewIfNeeded();
  const cityBox = await stadt.boundingBox();
  const createBox = await anlegen.boundingBox();
  const backBox = await zurueck.boundingBox();
  console.log('QA_VEREIN_LOW',JSON.stringify({
    project:testInfo.project.name,
    viewport:page.viewportSize(),
    cityBox,createBox,backBox,
    active:await page.evaluate(()=>document.activeElement?.getAttribute('placeholder'))
  }));
  await expect(name).toHaveValue(vereinsname);
  await expect(stadt).toHaveValue(ort);
  await page.screenshot({path:testInfo.outputPath('verein-low-actions.png'),fullPage:false});

  await zurueck.click();
  await expect(page.getByRole('button',{name:/DEIN VEREIN/})).toBeVisible();
  await page.getByRole('button',{name:/DEIN VEREIN/}).click();
  await expect(page.locator('input[placeholder="Vereinsname"]')).toHaveValue('');
  await expect(page.locator('input[placeholder="Stadt"]')).toHaveValue('');

  await page.locator('input[placeholder="Vereinsname"]').fill(vereinsname);
  await page.locator('input[placeholder="Stadt"]').fill(ort);
  await page.getByRole('button',{name:'Verein anlegen',exact:true}).click();
  await expect(page.getByText(vereinsname,{exact:true})).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('verein-confirmed.png'),fullPage:false});
});
