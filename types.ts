export interface Tutorial {
	title: string;
	description: string;
	chapters: Chapter[];
}

export interface Chapter {
	title: string;
	description: string;
	content?: string;
	tutorialTitle: string;
}
