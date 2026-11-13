import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

import {theme} from '../theme';

const POINTS = [
	['Målgrupp och kvoter', 'Länder, svar, krav och exakta tak — med genomförbarhet per kvot.'],
	['Mjuk balansering', 'Mot befolkningen enligt SCB, med en styrka du kan ändra när som helst.'],
	['Live', 'Tempo, starter och varje kvot i realtid.'],
	['Pollflow AI', 'Förklarar med dina siffror, föreslår ändringar och visar var de görs.'],
];

export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const head = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: `radial-gradient(1200px 800px at 70% 20%, #4F48E0 0%, ${theme.deep} 45%, #1E1A6B 100%)`, fontFamily: theme.body, color: theme.white, padding: '120px 160px'}}>
			<div style={{fontFamily: theme.display, fontWeight: 700, fontSize: 104, letterSpacing: -2, opacity: head, transform: `translateY(${(1 - head) * 30}px)`}}>Sampling i Pollflow</div>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '44px 80px', marginTop: 70}}>
				{POINTS.map(([title, text], i) => {
					const s = interpolate(frame, [18 + i * 8, 34 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return (
						<div key={title} style={{opacity: s, transform: `translateY(${(1 - s) * 20}px)`, borderLeft: '4px solid rgba(255,255,255,0.5)', paddingLeft: 28}}>
							<div style={{fontSize: 44, fontWeight: 700}}>{title}</div>
							<div style={{fontSize: 32, marginTop: 10, color: 'rgba(255,255,255,0.82)', lineHeight: 1.35}}>{text}</div>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 160, bottom: 110, display: 'flex', alignItems: 'center', gap: 22, opacity: interpolate(frame, [60, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
				<Img src={staticFile('pollflow-mark.svg')} style={{width: 72, height: 72, borderRadius: 16}} />
				<span style={{fontSize: 44, fontWeight: 600}}>Pollflow</span>
				<span style={{fontSize: 34, color: 'rgba(255,255,255,0.7)', marginLeft: 12}}>pollflow.io</span>
			</div>
		</AbsoluteFill>
	);
};
