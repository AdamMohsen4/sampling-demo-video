import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

import manifest from '../data/manifest.json';
import {theme} from '../theme';

/** A rectangle in the captured page, in CSS px of its 1920×1080 viewport. */
export type Box = {x: number; y: number; w: number; h: number};
type BoxRef = string | Box;

/** One moment of a chapter: what the camera frames, where the cursor goes, what is highlighted and said. */
export type Beat = {
	/** Frame within the chapter. */
	at: number;
	img: keyof typeof manifest;
	/** What the camera frames; none = the whole page. */
	focus?: BoxRef;
	/** Override the zoom the focus box would get. */
	zoom?: number;
	cursor?: BoxRef;
	click?: boolean;
	highlight?: BoxRef[];
	callout?: {text: string; box?: BoxRef; side?: 'above' | 'below'};
	/** Replaces the caption's body from this beat on. */
	body?: string;
};

export type Chapter = {
	id: string;
	number: string;
	title: string;
	body: string;
	durationInFrames: number;
	beats: Beat[];
};

/** The page sits in a window this big at zoom 1, a little above centre so the caption has room. */
const BASE = 0.82;
const HOME = {x: 960, y: 500};
const MOVE = 26;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

const resolve = (img: string, ref: BoxRef | undefined): Box | null => {
	if (!ref) return null;
	if (typeof ref !== 'string') return ref;
	const boxes = (manifest as Record<string, {boxes: Record<string, Box | null>}>)[img]?.boxes ?? {};
	return boxes[ref] ?? null;
};

type Camera = {cx: number; cy: number; z: number; tx: number; ty: number};

function cameraFor(beat: Beat): Camera {
	const box = resolve(beat.img, beat.focus);
	if (!box) return {cx: 960, cy: 540, z: 1, tx: HOME.x, ty: HOME.y};
	// Fit the box in the space above the caption, never closer than 2.6×.
	const fit = Math.min((1500 / (box.w + 80)) / BASE, (640 / (box.h + 60)) / BASE, 2.6);
	const z = beat.zoom ?? Math.max(1, fit);
	return {cx: box.x + box.w / 2, cy: box.y + box.h / 2, z, tx: 960, ty: 430};
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** The camera at a frame: eased from the previous beat's framing to the current one's. */
function cameraAt(beats: Beat[], frame: number): {cam: Camera; index: number} {
	let index = 0;
	beats.forEach((b, i) => {
		if (b.at <= frame) index = i;
	});
	const now = cameraFor(beats[index]);
	if (index === 0) return {cam: now, index};
	const before = cameraFor(beats[index - 1]);
	const same = beats[index].focus === beats[index - 1].focus && beats[index].img === beats[index - 1].img && beats[index].zoom === beats[index - 1].zoom;
	if (same) return {cam: now, index};
	const t = ease(interpolate(frame - beats[index].at, [0, MOVE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	return {
		cam: {cx: mix(before.cx, now.cx, t), cy: mix(before.cy, now.cy, t), z: mix(before.z, now.z, t), tx: mix(before.tx, now.tx, t), ty: mix(before.ty, now.ty, t)},
		index,
	};
}

const toScreen = (cam: Camera, x: number, y: number) => {
	const s = BASE * cam.z;
	return {x: cam.tx + (x - cam.cx) * s, y: cam.ty + (y - cam.cy) * s, s};
};

const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-6px, -4px) scale(${1 - press * 0.18})`, transformOrigin: '6px 4px', filter: 'drop-shadow(0 6px 10px rgba(17,24,39,0.35))'}}>
		<svg width="44" height="52" viewBox="0 0 22 26">
			<path d="M2 1.5 L2 20 L7 15.5 L10.5 23.5 L13.8 22 L10.4 14.3 L17 14.3 Z" fill={theme.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
		</svg>
	</div>
);

/** A chapter of the tour: one or more real screens, a camera that moves between the controls, a cursor, highlights and words. */
export const Tour: React.FC<{chapter: Chapter}> = ({chapter}) => {
	const frame = useCurrentFrame();
	const {beats} = chapter;
	const {cam, index} = cameraAt(beats, frame);
	const beat = beats[index];
	const prev = index > 0 ? beats[index - 1] : null;

	// A new capture dips through the window's white instead of cross-fading two layouts over each other.
	const changed = !!prev && prev.img !== beat.img;
	const fade = changed ? interpolate(frame - beat.at, [6, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
	const fadeOut = changed ? interpolate(frame - beat.at, [0, 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	const win = toScreen(cam, 0, 0);
	const winStyle: React.CSSProperties = {
		position: 'absolute',
		left: win.x,
		top: win.y,
		width: 1920,
		height: 1080,
		transform: `scale(${win.s})`,
		transformOrigin: '0 0',
		borderRadius: 18,
		overflow: 'hidden',
		boxShadow: '0 40px 120px rgba(30,27,95,0.28), 0 0 0 1px rgba(17,24,39,0.06)',
		background: theme.white,
	};

	// The cursor glides to its target and presses when the beat clicks.
	// Only on the screen it was moved on: a new capture lays the page out anew.
	const cursorBeats = beats.map((b, i) => ({b, i})).filter(({b, i}) => b.cursor && i <= index && b.img === beat.img);
	let cursor: {x: number; y: number; press: number} | null = null;
	if (cursorBeats.length > 0) {
		const last = cursorBeats[cursorBeats.length - 1];
		const target = resolve(last.b.img, last.b.cursor)!;
		const before = cursorBeats.length > 1 ? cursorBeats[cursorBeats.length - 2] : null;
		const from = before ? resolve(before.b.img, before.b.cursor)! : {x: target.x + target.w / 2 + 260, y: target.y + target.h / 2 + 180, w: 0, h: 0};
		const t = ease(interpolate(frame - last.b.at, [6, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
		const px = mix(from.x + from.w / 2, target.x + target.w / 2, t);
		const py = mix(from.y + from.h / 2, target.y + target.h / 2, t);
		const p = toScreen(cam, px, py);
		const since = frame - last.b.at - 34;
		const press = last.b.click ? interpolate(since, [0, 4, 10], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
		cursor = {x: p.x, y: p.y, press};
	}
	const clickAt = beat.click ? beat.at + 34 : null;
	const ripple = clickAt !== null ? interpolate(frame - clickAt, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

	const show = interpolate(frame - beat.at, [8, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const highlights = (beat.highlight ?? []).map((ref) => resolve(beat.img, ref)).filter((b): b is Box => !!b);
	const calloutBox = beat.callout ? resolve(beat.img, beat.callout.box ?? beat.highlight?.[0] ?? beat.focus) : null;

	// The caption's body follows the latest beat that sets one.
	const bodies = beats.filter((b) => b.body && b.at <= frame);
	const body = bodies.length ? bodies[bodies.length - 1].body! : chapter.body;
	const bodyAt = bodies.length ? bodies[bodies.length - 1].at : 0;
	const bodyIn = interpolate(frame - bodyAt, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const captionIn = ease(interpolate(frame, [4, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const out = interpolate(frame, [chapter.durationInFrames - 10, chapter.durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: `radial-gradient(1400px 900px at 20% 10%, #F7F7FF 0%, ${theme.canvas} 55%, #E4E4F2 100%)`, fontFamily: theme.body}}>
			<div style={winStyle}>
				{changed && fadeOut > 0 && <Img src={staticFile(`shots/${prev!.img}.png`)} style={{position: 'absolute', width: 1920, height: 1080, opacity: fadeOut}} />}
				<Img src={staticFile(`shots/${beat.img}.png`)} style={{position: 'absolute', width: 1920, height: 1080, opacity: fade}} />
			</div>

			{highlights.map((b, i) => {
				const a = toScreen(cam, b.x - 8, b.y - 8);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: a.x,
							top: a.y,
							width: (b.w + 16) * a.s,
							height: (b.h + 16) * a.s,
							borderRadius: 14,
							border: `3px solid ${theme.primary}`,
							boxShadow: `0 0 0 ${8 * show}px rgba(89,89,248,0.16), 0 0 40px rgba(89,89,248,${0.35 * show})`,
							opacity: show,
						}}
					/>
				);
			})}

			{beat.callout && calloutBox && (() => {
				const below = beat.callout.side === 'below';
				const anchor = toScreen(cam, calloutBox.x, below ? calloutBox.y + calloutBox.h + 14 : calloutBox.y - 14);
				const left = Math.min(Math.max(anchor.x, 60), 1920 - 760);
				return (
					<div
						style={{
							position: 'absolute',
							left,
							top: anchor.y,
							transform: `translateY(${below ? 0 : -100}%) translateY(${(1 - show) * (below ? -10 : 10)}px)`,
							opacity: show,
							background: theme.ink,
							color: theme.white,
							fontSize: 30,
							fontWeight: 600,
							padding: '12px 22px',
							borderRadius: 999,
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							boxShadow: '0 12px 30px rgba(17,24,39,0.25)',
							whiteSpace: 'nowrap',
						}}
					>
						<span style={{width: 12, height: 12, borderRadius: 99, background: theme.primary, boxShadow: '0 0 0 4px rgba(89,89,248,0.35)'}} />
						{beat.callout.text}
					</div>
				);
			})()}

			{clickAt !== null && cursor && ripple > 0 && ripple < 1 && (
				<div style={{position: 'absolute', left: cursor.x - 40 * ripple, top: cursor.y - 40 * ripple, width: 80 * ripple, height: 80 * ripple, borderRadius: 999, border: `3px solid ${theme.primary}`, opacity: 1 - ripple}} />
			)}
			{cursor && <Cursor {...cursor} />}

			<div
				style={{
					position: 'absolute',
					left: 80,
					bottom: 72,
					width: 980,
					padding: '30px 38px 32px',
					borderRadius: 28,
					background: 'rgba(255,255,255,0.94)',
					boxShadow: '0 24px 60px rgba(30,27,95,0.18), 0 0 0 1px rgba(17,24,39,0.05)',
					transform: `translateY(${(1 - captionIn) * 40}px)`,
					opacity: captionIn * out,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, color: theme.primary, fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase'}}>
					<span style={{background: theme.primary, color: theme.white, borderRadius: 10, padding: '2px 10px', letterSpacing: 0}}>{chapter.number}</span>
					Sampling
				</div>
				<div style={{fontFamily: theme.display, fontWeight: 700, fontSize: 60, color: theme.ink, marginTop: 10, letterSpacing: -1}}>{chapter.title}</div>
				<div style={{fontSize: 34, lineHeight: 1.35, color: theme.muted, marginTop: 10, opacity: bodyIn}}>{body}</div>
			</div>
		</AbsoluteFill>
	);
};
