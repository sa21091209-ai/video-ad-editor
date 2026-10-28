import {continueRender, delayRender, staticFile} from 'remotion';

const fonts: [string, string, string][] = [
	['Ruqaa', 'fonts/ArefRuqaa-Bold.ttf', '700'],
	['Tajawal', 'fonts/Tajawal-Regular.ttf', '400'],
	['Tajawal', 'fonts/Tajawal-Bold.ttf', '700'],
	['Amiri Quran', 'fonts/AmiriQuran-Regular.ttf', '400'],
];

let loaded = false;

export const loadFonts = () => {
	if (loaded || typeof document === 'undefined') {
		return;
	}
	loaded = true;
	const handle = delayRender('Loading fonts');
	Promise.all(
		fonts.map(([family, file, weight]) => {
			const face = new FontFace(family, `url(${staticFile(file)})`, {weight});
			document.fonts.add(face);
			return face.load();
		}),
	)
		.then(() => continueRender(handle))
		.catch((err) => {
			console.error(err);
			continueRender(handle);
		});
};
