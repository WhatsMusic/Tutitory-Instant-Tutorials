// types.ts
export interface Tutorial {
	title: string;
	description: string;
	chapters: Chapter[];
	id?: string; // Make id optional
	locale?: string; // Make locale optional
	tags?: string[]; // Make tags optional
	keywords?: string[]; // Make keywords optional
	createdAt?: Date; // Make createdAt optional
	updatedAt?: Date; // Make updatedAt optional
}

export interface Chapter {
	id: string;
	order: number;
	title: string;
	description: string;
	content: string | null; // Explicitly allow null
	featuredImage?: string;
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

export type LocaleType = "en" | "de";
