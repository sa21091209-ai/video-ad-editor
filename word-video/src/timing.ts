import type {WordProps} from './data';

export const FPS = 30;
export const WORD_SOLO = 120; // الكلمة لحالها بنص الشاشة
export const LINE_GAP = 60; // بين كل سطر والثاني
export const LINES_HOLD = 45;
export const EXAMPLE_LEN = 120;
export const OUTRO_LEN = 75;

export const getTimeline = (p: WordProps) => {
	const linesStart = WORD_SOLO;
	const linesEnd = linesStart + p.lines.length * LINE_GAP + LINES_HOLD;
	const exampleStart = linesEnd;
	const exampleEnd = exampleStart + (p.example ? EXAMPLE_LEN : 0);
	const outroStart = exampleEnd;
	const total = outroStart + OUTRO_LEN;
	return {linesStart, linesEnd, exampleStart, exampleEnd, outroStart, total};
};
