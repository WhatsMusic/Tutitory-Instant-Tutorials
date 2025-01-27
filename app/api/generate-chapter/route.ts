import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
	try {
		const { title, chapterTitle } = await req.json();

		const prompt = `Als KI-Assistent, der detaillierte, zusammenhängende und informative Tutorials erstellt, generiere bitte den Inhalt für das Kapitel "${chapterTitle}" im Tutorial "${title}".

Der Inhalt sollte detailliert, leicht verständlich und gut strukturiert sein. Verwende die folgende Struktur für den Inhalt:

1. Einleitung: Kurze Einführung in das Thema des Kapitels
2. Hauptteil: Detaillierte Erklärungen, aufgeteilt in 2-3 Unterabschnitte
3. Beispiele: Praktische Beispiele oder Anwendungsfälle
4. Zusammenfassung: Kurze Zusammenfassung der wichtigsten Punkte

Formatiere den Text mit Markdown für bessere Lesbarkeit. Stelle sicher, dass der Inhalt relevant, informativ und gut organisiert ist.

Beginne direkt mit dem Inhalt, ohne diese Anweisungen zu wiederholen.`;

		const textGeneration = await client.textGeneration({
			model: "google/gemma-2-2b-it",
			inputs: prompt,
			parameters: {
				max_new_tokens: 2048,
				temperature: 0.4,
				top_p: 0.9
			}
		});

		let chapterContent = textGeneration.generated_text.trim();

		// Remove the prompt if it's included in the response
		const promptEndIndex = chapterContent.indexOf(
			"Beginne direkt mit dem Inhalt, ohne diese Anweisungen zu wiederholen."
		);
		if (promptEndIndex !== -1) {
			chapterContent = chapterContent
				.substring(
					promptEndIndex +
						"Beginne direkt mit dem Inhalt, ohne diese Anweisungen zu wiederholen."
							.length
				)
				.trim();
		}

		if (!chapterContent || chapterContent.length === 0) {
			throw new Error("Generated chapter content is empty or invalid");
		}

		return NextResponse.json({ content: chapterContent });
	} catch (error) {
		console.error("Error generating chapter content:", error);
		return NextResponse.json(
			{
				error: "Failed to generate chapter content",
				details:
					error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
