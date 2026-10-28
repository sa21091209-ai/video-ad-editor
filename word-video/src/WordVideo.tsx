import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {WordProps} from './data';
import {loadFonts} from './fonts';
import {LINE_GAP, getTimeline} from './timing';

loadFonts();

const GOLD = '#D9B26F';
const CREAM = '#F4EBDD';
const INK = '#0E1726';
const INK_2 = '#1B2A40';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// نجمة ثمانية زخرفية تدور ببطء ورا الكلمة
const Star: React.FC<{size: number; opacity: number; rotate: number}> = ({
	size,
	opacity,
	rotate,
}) => {
	const r = size / 2;
	const square = (deg: number) => (
		<rect
			x={r - r * 0.62}
			y={r - r * 0.62}
			width={r * 1.24}
			height={r * 1.24}
			fill="none"
			stroke={GOLD}
			strokeWidth={2}
			transform={`rotate(${deg} ${r} ${r})`}
		/>
	);
	return (
		<svg
			width={size}
			height={size}
			style={{opacity, transform: `rotate(${rotate}deg)`, position: 'absolute'}}
		>
			{square(0)}
			{square(45)}
			<circle cx={r} cy={r} r={r * 0.95} fill="none" stroke={GOLD} strokeWidth={1.5} />
			<circle cx={r} cy={r} r={r * 0.5} fill="none" stroke={GOLD} strokeWidth={1} />
		</svg>
	);
};

const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const glowY = 700 + Math.sin(frame / 60) * 60;
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% ${glowY}px, ${INK_2} 0%, ${INK} 60%, #070C15 100%)`,
			}}
		>
			{/* حبيبات خفيفة */}
			<AbsoluteFill
				style={{
					backgroundImage:
						'radial-gradient(rgba(244,235,221,0.05) 1px, transparent 1px)',
					backgroundSize: '6px 6px',
				}}
			/>
			{/* إطار ذهبي رفيع */}
			<AbsoluteFill
				style={{
					margin: 48,
					border: `1.5px solid ${GOLD}`,
					opacity: 0.35,
					borderRadius: 28,
				}}
			/>
		</AbsoluteFill>
	);
};

const Label: React.FC<{label: string; episode: number}> = ({label, episode}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: ease});
	return (
		<div
			style={{
				position: 'absolute',
				top: 150,
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				opacity: t,
				transform: `translateY(${(1 - t) * -30}px)`,
			}}
		>
			<div
				style={{
					fontFamily: 'Tajawal',
					fontWeight: 700,
					fontSize: 44,
					color: INK,
					background: GOLD,
					padding: '14px 40px',
					borderRadius: 999,
					direction: 'rtl',
				}}
			>
				{label}
				{episode > 0 ? ` · ${episode}` : ''}
			</div>
		</div>
	);
};

const Word: React.FC<{word: string; subtitle: string; linesStart: number}> = ({
	word,
	subtitle,
	linesStart,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - 10, fps, config: {damping: 14, mass: 0.9}});
	const blur = interpolate(frame, [10, 35], [18, 0], clamp);
	// بعد ما تثبت، تطلع الكلمة فوق وتصغر عشان تفسح للمعنى
	const lift = interpolate(frame, [linesStart - 20, linesStart + 10], [0, 1], {
		...clamp,
		easing: ease,
	});
	const y = interpolate(lift, [0, 1], [760, 460]);
	const scale = interpolate(enter, [0, 1], [0.6, 1]) * interpolate(lift, [0, 1], [1, 0.62]);
	const sub = interpolate(frame, [40, 60], [0, 1], clamp);
	const star = interpolate(frame, [0, 40], [0, 1], clamp) * interpolate(lift, [0, 1], [0.22, 0.1]);

	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${scale})`,
					height: 420,
				}}
			>
				<div style={{position: 'absolute', left: '50%', top: '50%'}}>
					<div style={{position: 'relative', left: -380, top: -380}}>
						<Star size={760} opacity={star} rotate={frame * 0.15} />
					</div>
				</div>
				<div
					style={{
						fontFamily: 'Ruqaa',
						fontWeight: 700,
						fontSize: 260,
						color: CREAM,
						direction: 'rtl',
						filter: `blur(${blur}px)`,
						opacity: enter,
						textShadow: `0 0 60px rgba(217,178,111,0.35)`,
						lineHeight: 1.4,
						whiteSpace: 'nowrap',
					}}
				>
					{word}
				</div>
			</div>
			<div
				style={{
					fontFamily: 'Tajawal',
					fontSize: 46,
					color: GOLD,
					direction: 'rtl',
					opacity: sub,
					marginTop: interpolate(lift, [0, 1], [10, -90]),
					transform: `translateY(${(1 - sub) * 20}px)`,
				}}
			>
				{subtitle}
			</div>
		</div>
	);
};

const Lines: React.FC<{lines: string[]; start: number; end: number; mode: WordProps['mode']}> = ({
	lines,
	start,
	end,
	mode,
}) => {
	const frame = useCurrentFrame();
	const out = interpolate(frame, [end - 12, end], [1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				top: 1000,
				right: 110,
				left: 110,
				display: 'flex',
				flexDirection: 'column',
				gap: 38,
				direction: 'rtl',
				opacity: out,
			}}
		>
			{lines.map((line, i) => {
				const s = start + 10 + i * LINE_GAP;
				const t = interpolate(frame, [s, s + 22], [0, 1], {...clamp, easing: ease});
				// السطر الحالي واضح، والقديم يخفت شوي
				const dim = interpolate(frame, [s + LINE_GAP, s + LINE_GAP + 15], [1, 0.55], clamp);
				const isLast = i === lines.length - 1;
				return (
					<div
						key={i}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 26,
							opacity: t * (isLast ? 1 : dim),
							transform: `translateX(${(1 - t) * -60}px)`,
						}}
					>
						<div
							style={{
								width: mode === 'story' ? 14 : 18,
								height: mode === 'story' ? 14 : 18,
								borderRadius: mode === 'story' ? 999 : 4,
								transform: mode === 'story' ? undefined : 'rotate(45deg)',
								background: GOLD,
								flexShrink: 0,
							}}
						/>
						<div
							style={{
								fontFamily: 'Tajawal',
								fontWeight: isLast ? 700 : 400,
								fontSize: 68,
								lineHeight: 1.35,
								color: isLast ? GOLD : CREAM,
							}}
						>
							{line}
						</div>
					</div>
				);
			})}
		</div>
	);
};

const Example: React.FC<{text: string; source: string; start: number; end: number}> = ({
	text,
	source,
	start,
	end,
}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [start, start + 25], [0, 1], {...clamp, easing: ease});
	const out = interpolate(frame, [end - 12, end], [1, 0], clamp);
	if (frame < start || frame > end) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				top: 1020,
				left: 110,
				right: 110,
				opacity: t * out,
				transform: `scale(${interpolate(t, [0, 1], [0.94, 1])})`,
				border: `1.5px solid rgba(217,178,111,0.5)`,
				borderRadius: 32,
				background: 'rgba(217,178,111,0.07)',
				padding: '60px 50px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 30,
				direction: 'rtl',
			}}
		>
			<div style={{fontFamily: 'Tajawal', fontSize: 38, color: GOLD}}>شاهد</div>
			<div
				style={{
					fontFamily: 'Amiri Quran',
					fontSize: 76,
					color: CREAM,
					textAlign: 'center',
					lineHeight: 1.9,
				}}
			>
				﴿{text}﴾
			</div>
			<div style={{fontFamily: 'Tajawal', fontSize: 36, color: 'rgba(244,235,221,0.6)'}}>
				{source}
			</div>
		</div>
	);
};

const Outro: React.FC<{text: string; handle: string; start: number}> = ({text, handle, start}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [start, start + 20], [0, 1], {...clamp, easing: ease});
	if (frame < start) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				top: 1150,
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 24,
				opacity: t,
				transform: `translateY(${(1 - t) * 30}px)`,
				direction: 'rtl',
			}}
		>
			<div style={{fontFamily: 'Tajawal', fontWeight: 700, fontSize: 58, color: CREAM}}>
				{text}
			</div>
			{handle ? (
				<div style={{fontFamily: 'Tajawal', fontSize: 42, color: GOLD}}>{handle}</div>
			) : null}
		</div>
	);
};

export const WordVideo: React.FC<WordProps> = (props) => {
	const frame = useCurrentFrame();
	const tl = getTimeline(props);
	const fadeOut = interpolate(frame, [tl.total - 15, tl.total], [1, 0], clamp);
	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			<Background />
			<Label label={props.label} episode={props.episode} />
			<Word word={props.word} subtitle={props.subtitle} linesStart={tl.linesStart} />
			<Lines lines={props.lines} start={tl.linesStart} end={tl.linesEnd} mode={props.mode} />
			{props.example ? (
				<Example
					text={props.example}
					source={props.exampleSource}
					start={tl.exampleStart}
					end={tl.exampleEnd}
				/>
			) : null}
			<Outro text={props.outro} handle={props.handle} start={tl.outroStart} />
		</AbsoluteFill>
	);
};
