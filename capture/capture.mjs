// Captures each state of the Sampling tour at 2x, with the boxes (CSS px in a 1920×1080 viewport) the video zooms and points at.
import { chromium } from '/Users/adammohsen/Documents/GitHub/flow-survey-mono/flow-survey-webapp/node_modules/playwright/index.mjs';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
const D = process.argv[2];
const only = process.argv[3]?.split(',');
const OUT = `${D}/capture`;
const UI = 'http://localhost:5176';
const A = 3, LIVE = 26;
const manifestPath = `${OUT}/manifest.json`;
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, storageState: `${D}/auth.json` });
const page = await ctx.newPage();
await page.addStyleTag({ content: '' }).catch(() => {});
const wait = (ms) => page.waitForTimeout(ms);
const go = async (url) => { await page.goto(UI + url); await wait(2800); await page.mouse.move(1900, 1070); };
const center = async (loc) => { await loc.first().evaluate((el) => el.scrollIntoView({ block: 'center' })); await wait(500); };
const top = async (loc, offset = 120) => { await loc.first().evaluate((el, o) => { const y = el.getBoundingClientRect().top + window.scrollY - o; window.scrollTo(0, y); document.querySelector('main')?.scrollTo?.(0, 0); }, offset); await wait(500); };
const anchor = (name) => page.locator(`[data-sampling-anchor="${name}"]`);
async function shot(id, boxes = {}) {
  if (only && !only.includes(id)) return;
  await wait(400);
  const out = {};
  for (const [name, loc] of Object.entries(boxes)) {
    const b = await loc.first().boundingBox().catch(() => null);
    if (b) out[name] = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
    else console.log(`  ${id}: no box for ${name}`);
  }
  await page.screenshot({ path: `${OUT}/${id}.png` });
  manifest[id] = { file: `${id}.png`, boxes: out };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('shot', id, Object.keys(out).join(','));
}
const want = (...ids) => !only || ids.some((i) => only.includes(i));

// 1. The list
if (want('s01-list', 's02-new')) {
  await go('/sampling');
  await shot('s01-list', { newBtn: page.getByRole('button', { name: 'Ny sampling' }), rowA: page.getByText('Konsumentvanor 2026'), rowLive: page.getByText('Mediavanor Q4') });
  await page.getByRole('button', { name: 'Ny sampling' }).first().click();
  await wait(1200);
  await shot('s02-new', { dialog: page.getByRole('dialog') });
  await page.keyboard.press('Escape');
}

// 2. Target group, time balancing, feasibility
if (want('s03-target', 's04-pacing', 's05-feasibility', 's05b-blocking')) {
  await go(`/sampling/${A}?tab=quotas`);
  await page.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('*').forEach((el) => { if (el.scrollTop > 0) el.scrollTop = 0; }); });
  await wait(500);
  await shot('s03-target', {
    header: page.getByRole('heading', { name: 'Konsumentvanor 2026' }),
    checklist: page.getByText('Antal svar').first(),
    card: anchor('target-group'),
    countries: page.getByRole('group').filter({ hasText: 'Länder' }),
    completes: page.getByLabel('Färdiga svar'),
    loi: page.getByLabel('Längd'),
    fieldDays: anchor('field-days'),
    ir: page.getByLabel('Förväntad incidens'),
    startBtn: page.getByRole('button', { name: 'Starta' }),
  });
  await center(anchor('pacing'));
  await shot('s04-pacing', { pacing: anchor('pacing'), feasibility: anchor('feasibility') });
  await shot('s05-feasibility', {
    feasibility: anchor('feasibility'),
    verdict: anchor('feasibility').getByText('Inte genomförbar'),
    eta: anchor('feasibility').getByText(/Klart om/),
    blocking: anchor('feasibility').getByText(/fylls inte/),
    help: anchor('feasibility').getByRole('button', { name: 'Förklara med AI' }),
  });
}

// 3. Quotas
if (want('s06-quotas', 's07-quota-rows', 's08-templates')) {
  await go(`/sampling/${A}?tab=quotas`);
  await top(anchor('quotas'), 90);
  await shot('s06-quotas', {
    section: anchor('quotas'),
    mode: anchor('hard-quota-mode'),
    templates: page.getByRole('button', { name: 'Mallar' }),
    addReq: page.getByRole('button', { name: 'Lägg till krav' }),
    addQuotas: page.getByRole('button', { name: 'Lägg till kvoter' }),
    group: page.getByText('Ålder × Kön').first(),
  });
  await top(page.locator('[data-sampling-anchor^="quota:"]').first(), 260);
  await shot('s07-quota-rows', {
    first: page.locator('[data-sampling-anchor^="quota:"]').first(),
    tough: page.locator('[data-sampling-anchor^="quota:"]').filter({ hasText: 'Ålder 65–79 · Man' }),
    size: page.getByText('Storlek').first(),
    flex: page.getByRole('button', { name: /^Exakt/ }).first(),
  });
  await page.getByRole('button', { name: 'Mallar' }).first().click();
  await wait(800);
  await shot('s08-templates', { menu: page.getByRole('menu') });
  await page.keyboard.press('Escape');
}

// 4. Soft balancing
if (want('s09-balancing', 's10-dimension', 's11-targets')) {
  await go(`/sampling/${A}?tab=quotas`);
  await top(anchor('balancing:project'), 90);
  await shot('s09-balancing', {
    section: anchor('balancing:project'),
    auto: page.getByText('Automatiskt nationellt representativ'),
    scale: anchor('balancing-scale'),
    gender: anchor('balance:project:gender'),
  });
  await top(anchor('balance:project:income'), 140);
  await shot('s10-dimension', {
    income: anchor('balance:project:income'),
    slider: anchor('balance:project:income').locator('input[type="range"]'),
    table: anchor('balance:project:income').locator('table'),
    adjust: anchor('balance:project:income').getByRole('button', { name: 'Anpassa' }),
  });
  await top(anchor('balance:project:county'), 140);
  await shot('s11-targets', {
    county: anchor('balance:project:county'),
    slider: anchor('balance:project:county').locator('input[type="range"]'),
    table: anchor('balance:project:county').locator('table'),
  });
}

// 5. Link and settings
if (want('s12-link', 's13-settings', 's14-start')) {
  await go(`/sampling/${A}?tab=link`);
  await shot('s12-link', { link: anchor('link') });
  await go(`/sampling/${A}?tab=settings`);
  await shot('s13-settings', { quality: anchor('quality') });
  await go(`/sampling/${A}?tab=quotas`);
  await page.getByRole('button', { name: 'Starta' }).first().click();
  await wait(1200);
  await shot('s14-start', { dialog: page.getByRole('dialog') });
  await page.keyboard.press('Escape');
}

// 6. Live
if (want('s15-live', 's16-live-scale', 's17-live-quotas')) {
  await go(`/sampling/${LIVE}?tab=live`);
  await wait(1500);
  await shot('s15-live', {
    kpis: page.getByText('Färdiga svar').first(),
    pace: page.getByText('Tempo').first(),
    header: page.getByRole('heading', { name: 'Mediavanor Q4' }),
    pause: page.getByRole('button', { name: 'Pausa' }),
  });
  await center(anchor('balancing-scale'));
  await shot('s16-live-scale', { scale: anchor('balancing-scale'), starts: page.getByText('Vad hände med starterna') });
  await top(anchor('live-progress'), 120);
  await shot('s17-live-quotas', { table: anchor('live-progress') });
}

// 7. Pollflow AI
if (want('a01-help', 'a02-drawer', 'a03-ask', 'a04-answer', 'a05-cards', 'a06-spotlight', 'a07-back', 'a08-approved', 'a09-pointer', 'a10-pointed')) {
  await go(`/sampling/${A}?tab=quotas`);
  await center(anchor('feasibility'));
  const help = anchor('feasibility').getByRole('button', { name: 'Förklara med AI' }).first();
  await shot('a01-help', { help, feasibility: anchor('feasibility') });
  await help.click();
  await wait(1500);
  const dlg = page.getByRole('dialog');
  await shot('a02-drawer', { drawer: dlg, tabs: dlg.getByRole('tablist'), ask: dlg.getByText('Fråga Pollflow AI').first() });
  const box = dlg.locator('textarea');
  await box.fill('Varför är projektet inte genomförbart, och vad kan jag ändra så att det blir det?');
  await shot('a03-ask', { composer: box });
  await box.press('Enter');
  await dlg.getByText(/Föreslagna ändringar|Föreslagen ändring/).first().waitFor({ timeout: 120000 });
  await wait(3000);
  await shot('a04-answer', { drawer: dlg });
  const cards = dlg.locator('li').filter({ has: page.getByRole('button', { name: 'Godkänn' }) });
  const lan = cards.filter({ hasText: 'Län' }).first();
  await lan.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await wait(600);
  await shot('a05-cards', { card: lan, preview: lan.getByText('Nu', { exact: true }), show: lan.getByRole('button', { name: 'Visa i sidan' }), approve: lan.getByRole('button', { name: 'Godkänn' }) });
  const showBox = await lan.getByRole('button', { name: 'Visa i sidan' }).boundingBox();
  manifest['a05-cards'].boxes.showClick = showBox && { x: Math.round(showBox.x), y: Math.round(showBox.y), w: Math.round(showBox.width), h: Math.round(showBox.height) };
  await lan.getByRole('button', { name: 'Visa i sidan' }).click();
  await wait(1300);
  await shot('a06-spotlight', { target: anchor('balance:project:county'), pill: page.getByRole('button', { name: 'Tillbaka till chatten' }) });
  await page.getByRole('button', { name: 'Tillbaka till chatten' }).click();
  await wait(1500);
  const lan2 = page.getByRole('dialog').locator('li').filter({ has: page.getByRole('button', { name: 'Godkänn' }) }).filter({ hasText: 'Län' }).first();
  await lan2.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await wait(600);
  await shot('a07-back', { card: lan2, approve: lan2.getByRole('button', { name: 'Godkänn' }) });
  await lan2.getByRole('button', { name: 'Godkänn' }).click();
  await wait(2500);
  await shot('a08-approved', { card: page.getByRole('dialog').getByText('Klart').first() });
  const box2 = page.getByRole('dialog').locator('textarea');
  await box2.fill('Var ändrar jag balanseringens styrka för alla balanseringar på en gång?');
  await box2.press('Enter');
  await page.getByRole('dialog').getByText('Här hittar du den').last().waitFor({ timeout: 120000 });
  await wait(2500);
  const pointer = page.getByRole('dialog').locator('div').filter({ hasText: /^Här hittar du den/ }).last();
  await page.getByRole('dialog').getByText('Här hittar du den').last().evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await wait(500);
  await shot('a09-pointer', { card: page.getByRole('dialog').getByText('Här hittar du den').last(), show: page.getByRole('dialog').getByRole('button', { name: 'Visa i sidan' }).last() });
  await page.getByRole('dialog').getByRole('button', { name: 'Visa i sidan' }).last().click();
  await wait(1300);
  await shot('a10-pointed', { target: anchor('balancing-scale') });
  await center(anchor('feasibility'));
  await wait(2500);
  await shot('a11-feasible', { feasibility: anchor('feasibility') });
}
await browser.close();
