import React from 'react';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

import {Tour} from './components/Tour';
import {Intro} from './scenes/Intro';
import {Outro} from './scenes/Outro';
import {CHAPTERS, INTRO_FRAMES, OUTRO_FRAMES, TRANSITION_FRAMES} from './storyboard';

/** Every chapter, with a short fade between them. */
export const SamplingDemo: React.FC = () => {
	const transition = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />;
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence name="Intro" durationInFrames={INTRO_FRAMES}>
				<Intro />
			</TransitionSeries.Sequence>
			{CHAPTERS.flatMap((chapter) => [
				<React.Fragment key={`${chapter.id}-t`}>{transition}</React.Fragment>,
				<TransitionSeries.Sequence key={chapter.id} name={chapter.title} durationInFrames={chapter.durationInFrames}>
					<Tour chapter={chapter} />
				</TransitionSeries.Sequence>,
			])}
			{transition}
			<TransitionSeries.Sequence name="Outro" durationInFrames={OUTRO_FRAMES}>
				<Outro />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};

export const TOTAL_FRAMES =
	INTRO_FRAMES + CHAPTERS.reduce((sum, c) => sum + c.durationInFrames, 0) + OUTRO_FRAMES - TRANSITION_FRAMES * (CHAPTERS.length + 1);
