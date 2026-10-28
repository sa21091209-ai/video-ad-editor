import {Composition} from 'remotion';
import {sampleMeaning, sampleStory, type WordProps} from './data';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {staticFile} from 'remotion';
import {FPS, getTimeline, voiceFiles} from './timing';
import {WordVideo} from './WordVideo';

const calc = async ({props}: {props: WordProps}) => {
	const voiceFrames = props.voice
		? await Promise.all(
				voiceFiles(props).map(async (f) =>
					Math.ceil((await getAudioDurationInSeconds(staticFile(f))) * FPS),
				),
			)
		: undefined;
	const withVoice = {...props, voiceFrames};
	return {durationInFrames: getTimeline(withVoice).total, props: withVoice};
};

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
