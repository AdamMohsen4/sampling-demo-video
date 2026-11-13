import React from 'react';
import {Composition, Folder} from 'remotion';

import {Tour} from './components/Tour';
import {SamplingDemo, TOTAL_FRAMES} from './SamplingDemo';
import {Intro} from './scenes/Intro';
import {Outro} from './scenes/Outro';
import {CHAPTERS, INTRO_FRAMES, OUTRO_FRAMES} from './storyboard';
import {FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="SamplingDemo" component={SamplingDemo} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={TOTAL_FRAMES} />
		<Folder name="Chapters">
			<Composition id="Intro" component={Intro} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={INTRO_FRAMES} />
			{CHAPTERS.map((chapter) => (
				<Composition key={chapter.id} id={chapter.id} component={Tour} defaultProps={{chapter}} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={chapter.durationInFrames} />
			))}
			<Composition id="Outro" component={Outro} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={OUTRO_FRAMES} />
		</Folder>
	</>
);
