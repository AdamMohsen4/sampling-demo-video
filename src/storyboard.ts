import type {Chapter} from './components/Tour';

/**
 * The tour, chapter by chapter. Every screen is a capture of the real Sampling pages (demo workspace "Nordisk Insikt",
 * local survey-api stand-in); boxes come from capture/manifest.json. Copy is Swedish, in the product's own words.
 */
export const CHAPTERS: Chapter[] = [
	{
		id: 'Oversikt',
		number: '01',
		title: 'Alla projekt på ett ställe',
		body: 'Utkast, pågående och avslutade samplingprojekt — med svar mot mål för vart och ett.',
		durationInFrames: 300,
		beats: [
			{at: 0, img: 's01-list'},
			{at: 70, img: 's01-list', focus: {x: 460, y: 230, w: 1000, h: 280}, highlight: ['rowLive'], callout: {text: 'Live: följs i realtid', box: 'rowLive'}},
			{at: 150, img: 's01-list', focus: {x: 460, y: 60, w: 1100, h: 400}, cursor: 'newBtn', click: true, highlight: ['newBtn'], callout: {text: 'Ny sampling', box: 'newBtn', side: 'below'}},
			{at: 205, img: 's02-new', focus: 'dialog', body: 'Ge projektet ett namn och välj länk: en Pollflow-enkät eller din egen. Klart på några sekunder.'},
		],
	},
	{
		id: 'Malgrupp',
		number: '02',
		title: 'Målgrupp',
		body: 'Var respondenterna bor, hur många svar du behöver och hur lång enkäten är.',
		durationInFrames: 300,
		beats: [
			{at: 0, img: 's03-target', focus: 'card'},
			{at: 60, img: 's03-target', focus: 'card', highlight: ['countries'], callout: {text: 'Ett eller flera länder', box: 'countries'}},
			{at: 135, img: 's03-target', focus: 'card', highlight: ['completes', 'loi'], callout: {text: 'Färdiga svar · längd', box: 'completes'}},
			{at: 210, img: 's03-target', focus: 'card', highlight: ['fieldDays', 'ir'], callout: {text: 'Max fältdagar · förväntad incidens', box: 'fieldDays'}},
		],
	},
	{
		id: 'Tidsfordelning',
		number: '03',
		title: 'Tidsfördelning',
		body: 'Så snabbt som möjligt — eller jämnt över minst N dagar, så att ingen dag tar mer än sin andel.',
		durationInFrames: 190,
		beats: [
			{at: 0, img: 's04-pacing', focus: 'pacing', zoom: 1.7},
			{at: 45, img: 's04-pacing', focus: 'pacing', zoom: 1.7, highlight: ['pacing'], callout: {text: 'Jämnt över minst 7 dagar', box: 'pacing'}},
		],
	},
	{
		id: 'Genomforbarhet',
		number: '04',
		title: 'Genomförbarhet',
		body: 'Räknas ut direkt mot panelen — för hela projektet, med kvoter och balansering.',
		durationInFrames: 290,
		beats: [
			{at: 0, img: 's05-feasibility', focus: 'feasibility'},
			{at: 55, img: 's05-feasibility', focus: 'feasibility', highlight: ['verdict'], callout: {text: 'Inte genomförbar', box: 'verdict'}},
			{at: 125, img: 's05-feasibility', focus: 'feasibility', highlight: ['eta'], callout: {text: 'Klart om ca 12,5–24 dagar · ca 890 svar hinner in', box: 'eta'}},
			{at: 200, img: 's05-feasibility', focus: 'feasibility', highlight: ['blocking'], callout: {text: 'Kvoten som håller tillbaka', box: 'blocking', side: 'below'}, body: 'Du ser exakt vilken kvot som inte hinner fyllas — innan du startar.'},
		],
	},
	{
		id: 'Kvoter',
		number: '05',
		title: 'Kvoter',
		body: 'Exakta tak per grupp. Krav avgör vem som får vara med, kvotbalansering delar upp dem.',
		durationInFrames: 400,
		beats: [
			{at: 0, img: 's06-quotas', focus: {x: 450, y: 90, w: 1280, h: 560}},
			{at: 60, img: 's06-quotas', focus: {x: 450, y: 90, w: 1280, h: 560}, highlight: ['addReq', 'addQuotas'], callout: {text: 'Lägg till krav och kvoter', box: 'addReq', side: 'below'}},
			{at: 135, img: 's06-quotas', focus: {x: 450, y: 90, w: 1280, h: 560}, highlight: ['mode'], callout: {text: 'Håll exakt · tillåt lite överfyllnad', box: 'mode', side: 'below'}},
			{at: 210, img: 's07-quota-rows', focus: {x: 476, y: 200, w: 1228, h: 520}, highlight: ['tough'], callout: {text: 'Varje kvot får sin egen bedömning', box: 'tough'}, body: 'Ålder × Kön: åtta kvoter, var och en med mål, andel och egen genomförbarhet.'},
			{at: 305, img: 's08-templates', focus: {x: 900, y: 700, w: 820, h: 340}, highlight: ['menu'], callout: {text: 'Mallar', box: 'menu'}, body: 'Spara upplägget som mall och använd det igen i nästa projekt.'},
		],
	},
	{
		id: 'Balansering',
		number: '06',
		title: 'Mjuk balansering',
		body: 'Styr urvalet mot befolkningen utan hårda tak. Målen kommer från officiell statistik (SCB).',
		durationInFrames: 460,
		beats: [
			{at: 0, img: 's09-balancing', focus: {x: 475, y: 90, w: 1230, h: 260}},
			{at: 60, img: 's09-balancing', focus: {x: 475, y: 90, w: 1230, h: 260}, highlight: ['auto'], callout: {text: 'Automatiskt nationellt representativ', box: 'auto', side: 'below'}},
			{at: 135, img: 's09-balancing', focus: {x: 475, y: 90, w: 1230, h: 260}, highlight: ['scale'], callout: {text: 'Balanseringens styrka: lätta på allt på en gång', box: 'scale', side: 'below'}},
			{at: 215, img: 's10-dimension', focus: 'income', highlight: ['slider'], callout: {text: 'Snabb ↔ Representativ', box: 'slider'}, body: 'Varje dimension har ett eget reglage: starkare ger bättre träff, men fältarbetet tar längre tid.'},
			{at: 300, img: 's10-dimension', focus: 'income', highlight: ['table'], callout: {text: 'Mål från SCB · uppnått live', box: 'table'}},
			{at: 375, img: 's10-dimension', focus: 'income', highlight: ['adjust'], callout: {text: 'Anpassa egna mål', box: 'adjust', side: 'below'}},
		],
	},
	{
		id: 'Lank',
		number: '07',
		title: 'Länk',
		body: 'Din enkät-URL med panelistens id, och slutlänkar för färdig, screenout och kvot full.',
		durationInFrames: 180,
		beats: [
			{at: 0, img: 's12-link', focus: 'link'},
			{at: 40, img: 's12-link', focus: 'link', highlight: ['link']},
		],
	},
	{
		id: 'Kvalitet',
		number: '08',
		title: 'Kvalitetskontroll',
		body: 'Varje panelist svarar först på en kort öppen fråga. AI bedömer svaret och sållar bort låg kvalitet.',
		durationInFrames: 190,
		beats: [
			{at: 0, img: 's13-settings', focus: 'quality'},
			{at: 40, img: 's13-settings', focus: 'quality', highlight: ['quality'], callout: {text: 'Låg · Standard · Medel · Hög', box: 'quality'}},
		],
	},
	{
		id: 'Starta',
		number: '09',
		title: 'Starta och pris',
		body: 'När allt är klart: Starta. Vi sätter ett pris per svar och mejlar dig.',
		durationInFrames: 230,
		beats: [
			{at: 0, img: 's03-target', focus: {x: 440, y: 100, w: 1300, h: 200}},
			{at: 30, img: 's03-target', focus: {x: 440, y: 100, w: 1300, h: 200}, cursor: 'startBtn', click: true, highlight: ['startBtn'], callout: {text: 'Starta', box: 'startBtn', side: 'below'}},
			{at: 100, img: 's14-start', focus: 'dialog', zoom: 1.9, body: 'Du godkänner priset — sedan går undersökningen live. Priset gäller hela projektet.'},
		],
	},
	{
		id: 'Live',
		number: '10',
		title: 'Live',
		body: 'Färdiga svar, svarar nu, starter, konvertering, incidens och svarstid — uppdaterat hela tiden.',
		durationInFrames: 470,
		beats: [
			{at: 0, img: 's15-live'},
			{at: 55, img: 's15-live', focus: {x: 450, y: 300, w: 1280, h: 130}, highlight: [{x: 450, y: 300, w: 1280, h: 120}], callout: {text: 'Fältarbetet i siffror', box: {x: 450, y: 300, w: 1280, h: 120}, side: 'below'}},
			{at: 135, img: 's15-live', focus: {x: 450, y: 450, w: 1280, h: 330}, highlight: ['pace'], callout: {text: 'Tempo mot målet', box: 'pace', side: 'below'}},
			{at: 220, img: 's16-live-scale', focus: 'scale', zoom: 1.5, highlight: ['scale'], callout: {text: 'Behöver det gå snabbare?', box: 'scale'}, body: 'Går det för långsamt? Lätta på balanseringen direkt — även medan projektet är live.'},
			{at: 300, img: 's16-live-scale', focus: {x: 471, y: 620, w: 1238, h: 90}, zoom: 1.5, highlight: [{x: 471, y: 630, w: 1238, h: 70}], callout: {text: 'Vad hände med starterna', box: 'starts'}},
			{at: 375, img: 's17-live-quotas', focus: 'table', body: 'Varje kvot i realtid: färdiga, svarar nu, screenout, överkvot och kvalitet.'},
		],
	},
	{
		id: 'PollflowAI',
		number: '11',
		title: 'Pollflow AI',
		body: 'Vid varje inställning finns AI-tecknet. Klicka för en förklaring — och en AI som känner ditt projekt.',
		durationInFrames: 1040,
		beats: [
			{at: 0, img: 'a01-help', focus: 'feasibility', cursor: 'help', click: true, highlight: ['help'], callout: {text: 'Förklara med AI', box: 'help'}},
			{at: 85, img: 'a02-drawer', focus: {x: 1000, y: 0, w: 920, h: 1080}, zoom: 1.15, highlight: ['ask'], callout: {text: 'Känner till ditt upplägg', box: 'ask'}},
			{at: 165, img: 'a03-ask', focus: 'composer', zoom: 2.1, highlight: ['composer'], body: 'Fråga på svenska: ”Varför är projektet inte genomförbart, och vad kan jag ändra?”'},
			{at: 240, img: 'a04-answer', focus: {x: 1400, y: 380, w: 520, h: 560}, zoom: 1.45, body: 'Svaret bygger på projektets egna siffror: vilken kvot som inte hinner fyllas, och varför.'},
			{at: 330, img: 'a05-cards', focus: 'card', zoom: 2.1, highlight: ['card'], callout: {text: 'Nu → Förslag', box: 'card'}, body: 'Förslagen visas som komponenter: samma kontroll som i sidan — som den är nu, och som den blir.'},
			{at: 415, img: 'a05-cards', focus: 'card', zoom: 2.1, cursor: 'showClick', click: true, highlight: ['show'], callout: {text: 'Visa i sidan', box: 'show'}},
			{at: 480, img: 'a06-spotlight', focus: 'target', zoom: 1.25, highlight: ['target'], callout: {text: 'Län · Hela projektet', box: 'target'}, body: '”Visa i sidan” öppnar rätt flik, fäller ut sektionen och lyser upp kontrollen.'},
			{at: 565, img: 'a06-spotlight', cursor: 'pill', click: true, highlight: ['pill'], callout: {text: 'Tillbaka till chatten', box: 'pill'}},
			{at: 630, img: 'a07-back', focus: 'card', zoom: 2.1, cursor: 'approve', click: true, highlight: ['approve'], callout: {text: 'Godkänn', box: 'approve', side: 'below'}, body: 'Inget ändras förrän du godkänner.'},
			{at: 710, img: 'a08-approved', focus: {x: 1421, y: 700, w: 479, h: 204}, zoom: 2.1, highlight: [{x: 1430, y: 862, w: 64, h: 28}], callout: {text: 'Klart', box: {x: 1430, y: 862, w: 64, h: 28}, side: 'below'}},
			{at: 775, img: 'a09-pointer', focus: {x: 1421, y: 760, w: 479, h: 130}, zoom: 2.1, highlight: [{x: 1430, y: 790, w: 462, h: 80}], callout: {text: 'Här hittar du den', box: 'card'}, body: 'Frågar du var något finns, pekar AI:n direkt på kontrollen.'},
			{at: 850, img: 'a10-pointed', focus: 'target', zoom: 1.4, highlight: ['target'], callout: {text: 'Balanseringens styrka', box: 'target'}},
			{at: 930, img: 'a11-feasible', focus: 'feasibility', highlight: ['feasibility'], callout: {text: 'Inte genomförbar → Snävt', box: 'feasibility'}, body: 'Resultatet: en godkänd ändring, och projektet går från ”Inte genomförbar” till ”Snävt”.'},
		],
	},
];

export const INTRO_FRAMES = 150;
export const OUTRO_FRAMES = 200;
export const TRANSITION_FRAMES = 15;
