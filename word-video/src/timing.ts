import type {WordProps} from './data';

export const FPS = 30;
const GAP = 10; // سكتة بين كل جملة والثانية
// أطوال افتراضية (بالفريمات) لما يكون الفيديو بلا صوت
const SILENT = {label: 4, word: 30, subtitle: 60, line: 50, example: 90, outro: 50};

// ترتيب ملفات الصوت: العنوان، الكلمة، السطر تحتها، الأسطر، الشاهد، الخاتمة
export const voiceFiles = (p: WordProps) => {
	const count = 3 + p.lines.length + (p.example ? 1 : 0) + 1;
	return Array.from(
		{length: count},
		(_, i) => `${p.voice}/l${String(i + 1).padStart(2, '0')}.mp3`,
	);
};

export const getTimeline = (p: WordProps) => {
	const d = p.voice ? p.voiceFrames ?? [] : [];
	const n = p.lines.length;
	const len = (i: number, fallback: number) => d[i] ?? fallback;

	let t = 6;
	const labelCue = t;
	t += len(0, SILENT.label) + GAP;
	const wordCue = t;
	t += len(1, SILENT.word) + GAP;
	const subtitleCue = t;
	t += len(2, SILENT.subtitle) + GAP * 2;
	// هنا تصعد الكلمة فوق، وأول سطر يبدأ بعدها بشوي
	const linesStart = t;
	t += 15;
	const lineCues = p.lines.map((_, i) => {
		const cue = t;
		t += len(3 + i, SILENT.line) + GAP;
		return cue;
	});
	const linesEnd = t + 15;
	const exampleStart = linesEnd;
	const exampleCue = exampleStart + 18;
	const exampleEnd = p.example ? exampleCue + len(3 + n, SILENT.example) + 30 : exampleStart;
	const outroStart = exampleEnd;
	const outroCue = outroStart + 8;
	const total = outroCue + len(d.length - 1, SILENT.outro) + 30;
	const cues = [labelCue, wordCue, subtitleCue, ...lineCues];
	if (p.example) {
		cues.push(exampleCue);
	}
	cues.push(outroCue);
	return {
		wordCue,
		subtitleCue,
		linesStart,
		lineCues,
		linesEnd,
		exampleStart,
		exampleEnd,
		outroStart,
		total,
		cues,
	};
};
