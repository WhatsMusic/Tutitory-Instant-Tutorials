// types.ts
export interface Tutorial {
	id: string;
	title: string;
	description: string;
	locale: string;
	tags: string[];
	keywords: string[];
	chapters: Chapter[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Chapter {
	id: string;
	order: number;
	title: string;
	description: string;
	content: string | null; // Explicitly allow null
	tags: string[];
	keywords: string[];
	tutorialTitle: string;
}

export interface ChapterContentProps {
	chapter: Chapter;
	onBack: () => void;
	onNext: () => void;
	onPrevious: () => void;
	hasNext: boolean;
	hasPrevious: boolean;
	onRetry: () => void;
}
