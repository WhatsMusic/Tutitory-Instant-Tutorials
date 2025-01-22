import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
	const body = await req.json();
	const { topic, chapterTitle } = body;

	console.log("Empfangene Anfrage:", body);

	if (
		!topic ||
		!chapterTitle ||
		topic.trim().length === 0 ||
		chapterTitle.trim().length === 0
	) {
		console.log("Ungültige Eingabe:", { topic, chapterTitle });
		return NextResponse.json(
			{
				error: "Das Thema und der Kapiteltitel dürfen nicht leer sein.",
				hint: "Bitte überprüfe deine Eingaben und versuche es erneut."
			},
			{ status: 400 }
		);
	}

	try {
		const chatCompletion = await client.chatCompletion({
			model: "google/gemma-2-2b-it",
			messages: [
				{
					role: "user",
					content: `Du bist Tutitory, eine KI, die Tutorials und Leitfäden in Deutsch schreibt. Deine Aufgabe ist es, leicht verständliche, gut geschriebene und informative Tutorials/Leitfäden für Benutzer zu erstellen. Erstelle ein Kapitel mit dem Titel „${chapterTitle}“, das zum Thema „${topic}“ gehört.`
				}
			],
			max_tokens: 1024
		});

		if (
			!topic ||
			!chapterTitle ||
			topic.trim().length === 0 ||
			chapterTitle.trim().length === 0
		) {
			console.error(
				"Fehlerhafte Antwortstruktur von HuggingFace:",
				chatCompletion
			);
			throw new Error("Die API-Antwort ist ungültig.");
		}

		const result =
			chatCompletion.choices[0]?.message?.content?.trim() || "";

		return NextResponse.json(
			{
				title: chapterTitle,
				content: result
					.split("\n")
					.map((line) => line.trim()) // Zeilen trimmen
					// Entferne nur `null` oder `undefined`, behalte aber leere Strings
					.filter((line) => line !== null && line !== undefined)
			},
			{ status: 200 }
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Ein unbekannter Fehler ist aufgetreten";

		console.error(
			`Fehler bei der Generierung des Inhalts für '${chapterTitle}':`,
			error
		);

		return NextResponse.json(
			{
				error: `Fehler bei der Generierung des Inhalts für '${chapterTitle}': ${errorMessage}`
			},
			{ status: 500 }
		);
	}
}
