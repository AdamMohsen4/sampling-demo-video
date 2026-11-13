import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

import {theme} from '../theme';

const CHIPS = ['Målgrupp', 'Tidsfördelning', 'Genomförbarhet', 'Kvoter', 'Mjuk balansering', 'Live', 'Pollflow AI'];

export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const mark = spring({frame, fps, config: {damping: 14, mass: 0.8}});
	const title = Easing.out(Easing.cubic)(interpolate(frame, [10, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const sub = interpolate(frame, [28, 48], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: `radial-gradient(1200px 800px at 30% 20%, #4F48E0 0%, ${theme.deep} 45%, #1E1A6B 100%)`, fontFamily: theme.body, color: theme.white, justifyContent: 'center', padding: '0 160px', opacity: out}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 28, transform: `scale(${0.6 + mark * 0.4})`, transformOrigin: 'left center', opacity: mark}}>
				<Img src={staticFile('pollflow-mark.svg')} style={{width: 96, height: 96, borderRadius: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.35)'}} />
				<span style={{fontSize: 56, fontWeight: 600, letterSpacing: -0.5}}>Pollflow</span>
			</div>
			<div style={{fontFamily: theme.display, fontWeight: 700, fontSize: 170, letterSpacing: -4, marginTop: 40, lineHeight: 1, opacity: title, transform: `translateY(${(1 - title) * 40}px)`}}>Sampling</div>
			<div style={{fontSize: 56, marginTop: 28, color: 'rgba(255,255,255,0.86)', opacity: sub, maxWidth: 1400, lineHeight: 1.25}}>Rätt respondenter, i rätt takt — funktion för funktion.</div>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 64}}>
				{CHIPS.map((chip, i) => {
					const s = interpolate(frame, [52 + i * 5, 64 + i * 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return (
						<span key={chip} style={{fontSize: 30, fontWeight: 500, padding: '12px 24px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', opacity: s, transform: `translateY(${(1 - s) * 16}px)`}}>
							{chip}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
