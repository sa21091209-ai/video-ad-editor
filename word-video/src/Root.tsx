import {Composition} from 'remotion';
import {sampleMeaning, sampleStory, type WordProps} from './data';
import {FPS, getTimeline} from './timing';
import {WordVideo} from './WordVideo';

const calc = ({props}: {props: WordProps}) => ({
	durationInFrames: getTimeline(props).total,
});

export const Root: React.FC = () => (
	<>
		<Composition
			id="WordVideo"
			component={WordVideo}
			width={1080}
			height={1920}
			fps={FPS}
			durationInFrames={300}
			defaultProps={sampleMeaning}
			calculateMetadata={calc}
		/>
		<Composition
			id="WordStory"
			component={WordVideo}
			width={1080}
			height={1920}
			fps={FPS}
			durationInFrames={300}
			defaultProps={sampleStory}
			calculateMetadata={calc}
		/>
	</>
);
