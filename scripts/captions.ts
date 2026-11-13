// Writes the film's captions (WebVTT, Swedish) from the storyboard, with the same timing the video uses.
import {writeFileSync} from 'node:fs';

import {CHAPTERS, INTRO_FRAMES, OUTRO_FRAMES, TRANSITION_FRAMES} from '../src/storyboard.ts';

const FPS = 30;
const out = process.argv[2] ?? 'out/pollflow-sampling-demo.sv.vtt';
const ts = (frame: number) => {
	const ms = Math.round((frame / FPS) * 1000);
	const h = Math.floor(ms / 3_600_000), m = Math.floor(ms / 60_000) % 60, s = Math.floor(ms / 1000) % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};
const cues: Array<[number, number, string]> = [[0, INTRO_FRAMES, 'Pollflow Sampling — rätt respondenter, i rätt takt. Funktion för funktion.']];
let start = INTRO_FRAMES - TRANSITION_FRAMES;
for (const c of CHAPTERS) {
	const bodies = [{at: 0, body: c.body}, ...c.beats.filter((b) => b.body).map((b) => ({at: b.at, body: b.body!}))];
	bodies.forEach((b, i) => {
		const end = i + 1 < bodies.length ? bodies[i + 1].at : c.durationInFrames;
		cues.push([start + b.at, start + end, `${c.number} ${c.title}: ${b.body}`]);
	});
	start += c.durationInFrames - TRANSITION_FRAMES;
}
cues.push([start, start + OUTRO_FRAMES, 'Sampling i Pollflow: målgrupp och kvoter, mjuk balansering, live och Pollflow AI.']);
writeFileSync(out, 'WEBVTT\n\n' + cues.map(([a, b, text], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${text}\n`).join('\n'));
console.log(`${cues.length} cues → ${out}`);
