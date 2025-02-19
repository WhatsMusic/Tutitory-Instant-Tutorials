import { Chapter } from "@/types";
import { Tutorial } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const langMap = {
	en: { code: "en", label: "English" },
	de: { code: "de", label: "Deutsch" }
	// weitere Sprachen hier hinzufügen
};

export function cleanJsonString(jsonString: string): string {
	try {
		// Finde den JSON-Block anhand der ersten und letzten geschweiften Klammer
		const firstBraceIndex = jsonString.indexOf("{");
		const lastBraceIndex = jsonString.lastIndexOf("}");
		if (firstBraceIndex === -1 || lastBraceIndex === -1) {
			throw new Error("Invalid JSON: Could not find curly braces.");
		}
		let cleaned = jsonString.substring(firstBraceIndex, lastBraceIndex + 1);

		// Entferne überflüssige Kommata vor schließenden Klammern (sowohl für Objekte als auch für Arrays)
		cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
		return cleaned;
	} catch (error) {
		console.error("JSON cleaning error:", error);
		throw error;
	}
}

export function parseTutorialContent(content: string): Tutorial {
	try {
		const tutorialData = JSON.parse(content);
		const tutorial: Tutorial = {
			id: uuidv4(),
			title: tutorialData.title || "new tutorial",
			description:
				tutorialData.description || "No description available.",
			locale: "en", // Hier könntest du auch den userLocale verwenden, wenn gewünscht.
			tags: tutorialData.tags || [],
			keywords: tutorialData.keywords || [],
			chapters: (tutorialData.chapters || []).map(
				(chapter: Chapter, index: number): Chapter => ({
					id: uuidv4(),
					order: index + 1,
					title: chapter.title || "chapter " + (index + 1),
					description:
						chapter.description || "No description available.",
					content: null,
					tags: chapter.tags || [],
					keywords: chapter.keywords || [],
					tutorialTitle: tutorialData.title || "New Tutorial"
				})
			),
			createdAt: new Date(),
			updatedAt: new Date()
		};
		return tutorial;
	} catch (error) {
		console.error("Error parsing tutorial content:", error);
		throw error;
	}
}
