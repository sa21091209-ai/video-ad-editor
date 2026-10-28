// محتوى الفيديو — غيّر هالملف بس عشان تطلع كلمة جديدة.
export type WordProps = {
	mode: 'meaning' | 'story';
	// عنوان صغير فوق، مثل «كلمة اليوم»
	label: string;
	// رقم الحلقة (يطلع جنب العنوان)، 0 = بلا رقم
	episode: number;
	// الكلمة بالتشكيل
	word: string;
	// سطر تحت الكلمة: الجذر أو النوع
	subtitle: string;
	// المعنى (meaning) أو القصة (story) — كل عنصر سطر يطلع لحاله
	lines: string[];
	// شاهد أو مثال بالأخير (اختياري)
	example: string;
	exampleSource: string;
	// خاتمة
	outro: string;
	handle: string;
};

export const sampleMeaning: WordProps = {
	mode: 'meaning',
	label: 'كلمة ومعنى',
	episode: 1,
	word: 'عَسْعَسَ',
	subtitle: 'فعل · من الأضداد',
	lines: [
		'كلمة تحمل المعنى وضدّه',
		'عسعس الليل: أقبل بظلامه',
		'وعسعس الليل: أدبر وولّى',
		'فهي من الأضداد في العربية',
	],
	example: 'وَاللَّيْلِ إِذَا عَسْعَسَ',
	exampleSource: 'التكوير: 17',
	outro: 'تابعنا لكلمة جديدة كل يوم',
	handle: '',
};

export const sampleStory: WordProps = {
	mode: 'story',
	label: 'كلمة وقصة',
	episode: 1,
	word: 'الصَّبَابَة',
	subtitle: 'اسم · من أوصاف الحب',
	lines: [
		'للحب في العربية أسماء كثيرة',
		'ولكل اسم منها درجة ولون',
		'والصبابة: رقّة الشوق وحرارته',
		'ومنها قيل للعاشق المشتاق: صَبّ',
	],
	example: '',
	exampleSource: '',
	outro: 'تابعنا لقصة كلمة كل يوم',
	handle: '',
};
