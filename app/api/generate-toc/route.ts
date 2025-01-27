import { NextResponse } from "next/server";
import type { Tutorial } from "../../../types";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);
let userTopic = "";

export async function POST(req: Request) {
	try {
		const { topic } = await req.json();
		userTopic = topic;
		const chatCompletion = await client.chatCompletion({
			model: "google/gemma-2-2b-it",
			messages: [
				// {
				// 	role: "system",
				// 	content:
				// 		"You are an AI that generates structured tutorials. Follow the exact format provided without deviation."
				// },
				{
					role: "user",
					content: `Erstelle ein detailliertes Inhaltsverzeichnis für das Tutorial zum Thema „${topic}“. 
Das Tutorial sollte genau 5 Kapitel haben. Verwende keine Aufzählungszeichen, Nummerierungen oder Unterkapitel. Stelle sicher, dass alle Teile ausgefüllt sind und der Inhalt aussagekräftig und für das Thema relevant ist.
Formatiere die Antwort genau wie folgt, ohne zusätzliche Formatierung:
TUTORIAL:
TITLE: [Titel des Tutorials]
DESCRIPTION: [Beschreibe das Tutorial in 1–2 Sätzen]
CHAPTERS:
- [Title 1]: [Kurze Beschreibung des 1. Kapitels in einem Satz]
- [Title 2]: [Kurze Beschreibung des 2. Kapitels in einem Satz]
- [Title 3]: [Kurze Beschreibung des 3. Kapitels in einem Satz]
- [Title 4]: [Kurze Beschreibung des 4. Kapitels in einem Satz]
- [Title 5]: [Kurze Beschreibung des 5. Kapitels in einem Satz]
`
				}
			],
			provider: "hf-inference",
			top_p: 0.9,
			max_tokens: 500,
			temperature: 0.3
		});

		const generatedContent = chatCompletion.choices[0]?.message?.content;

		if (!generatedContent) {
			return NextResponse.json(
				{ error: "Inhalte konnten nicht generiert werden" },
				{ status: 500 }
			);
		}

		console.log("Generierte Inhalte:", generatedContent);

		const parsedTutorial = parseTutorialContent(generatedContent);

		if (
			!parsedTutorial.title ||
			!parsedTutorial.description ||
			parsedTutorial.chapters.length === 0
		) {
			return NextResponse.json(
				{
					error: "Der generierte Inhalt hat nicht das erwartete Format"
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(parsedTutorial);
	} catch (error) {
		console.error(
			"Fehler beim Erstellen des Inhaltsverzeichnisses:",
			error
		);
		return NextResponse.json(
			{
				error: "Inhaltsverzeichnis konnte nicht erstellt werden",
				details:
					error instanceof Error
						? error.message
						: "Unbekannter Fehler"
			},
			{ status: 500 }
		);
	}
}

function parseTutorialContent(content: string): Tutorial {
	const chapters: Tutorial["chapters"] = [];
	let title = "";
	let description = "";

	// Split content into lines and remove empty lines
	const lines = content.split("\n").filter((line) => line.trim().length > 0);

	// Parse each line
	lines.forEach((line) => {
		const trimmedLine = line.trim();

		if (
			trimmedLine.startsWith("TITLE:") ||
			trimmedLine.startsWith("TITEL:")
		) {
			title = trimmedLine.split(":").slice(1).join(":").trim();
		} else if (
			trimmedLine.startsWith("DESCRIPTION:") ||
			trimmedLine.startsWith("BESCHREIBUNG:")
		) {
			description = trimmedLine.split(":").slice(1).join(":").trim();
		} else if (trimmedLine.startsWith("-")) {
			const chapterContent = trimmedLine.substring(1).trim();
			const [chapterTitle, ...descriptionParts] =
				chapterContent.split(":");

			if (chapterTitle) {
				chapters.push({
					title: chapterTitle.trim(),
					description:
						descriptionParts.join(":").trim() ||
						"Keine Beschreibung verfügbar",
					tutorialTitle: title
				});
			}
		}
	});

	// Validate and provide defaults if necessary
	return {
		title: title || userTopic || "Neues Tutorial",
		description: description || "Keine Beschreibung verfügbar",
		chapters:
			chapters.length > 0
				? chapters
				: [
						{
							title: "Einführung",
							description: "Erste Schritte mit diesem Thema",
							tutorialTitle:
								title || userTopic || "Neues Tutorial"
						}
				  ]
	};
}
