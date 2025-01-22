import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
	const body = await req.json();
	const { topic, chapterTitle } = body;

	if (
		!topic ||
		!chapterTitle ||
		topic.trim() === "" ||
		chapterTitle.trim() === ""
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
		console.log("Eingehende Anfrage:", { topic, chapterTitle });

		const chatCompletion = await client.chatCompletion({
			model: "google/gemma-2-2b-it",
			messages: [
				{
					role: "user",
					content: `Erstelle ein Kapitel mit dem Titel „${chapterTitle}“, das zum Thema „${topic}“ gehört.`
				}
			],
			max_tokens: 1024
		});

		if (
			!chatCompletion.choices ||
			chatCompletion.choices.length === 0 ||
			!chatCompletion.choices[0].message?.content
		) {
			console.error(
				"Ungültige API-Antwort:",
				JSON.stringify(chatCompletion, null, 2)
			);
			throw new Error("Die API-Antwort ist ungültig oder leer.");
		}

		const result = chatCompletion.choices[0].message.content.trim();

		if (!result) {
			throw new Error(
				`Keine Inhalte für das Kapitel '${chapterTitle}' generiert.`
			);
		}

		return NextResponse.json(
			{
				title: chapterTitle,
				content: result
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line)
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
