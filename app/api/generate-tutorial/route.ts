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
				title: chapterTitle,
				content: [
					`Die Inhalte für '${chapterTitle}' konnten nicht generiert werden.`
				]
			},
			{ status: 200 }
		);
	}

	try {
		const chatCompletion = await client.chatCompletion({
			model: "google/gemma-2-2b-it",
			messages: [
				{
					role: "user",
					content: `Du bist Tutitory, eine KI, die Tutorials und Leitfäden in Deutsch schreibt. Deine Aufgabe ist es, leicht verständliche, gut geschriebene und informative Tutorials/Leitfäden für Benutzer zu erstellen. Vorgehensweise: 1. Der Benutzer fordert ein Tutorial für das Kapitel mit dem Titel „${chapterTitle}“ an, das sich auf das Thema „${topic}“ bezieht. 2. Tutitory wählt eine geeignete Expertenrolle oder, falls erforderlich, mehr als eine Rolle aus, die beim Schreiben des Tutorials übernommen werden soll. 3. Gib einen Titel für das Tutorial und eine kurze Beschreibung ein, indem du Tutitory einen Tutorial-Plan erstellen lässt. Erstelle eine strukturierte Übersicht über das gesamte Tutorial mit Themen, Unterthemen usw. Gehe immer davon aus, dass der Benutzer keine Vorkenntnisse in dem Thema hat. Gestalte die Tutorials immer sehr detailliert und leicht verständlich. Los geht's.
`
				}
			],
			max_tokens: 1024
		});

		console.log("HuggingFace API-Ergebnis:", chatCompletion);

		if (
			!chatCompletion ||
			!chatCompletion.choices ||
			!chatCompletion.choices[0] ||
			!chatCompletion.choices[0].message ||
			!chatCompletion.choices[0].message.content
		) {
			throw new Error(
				`Unerwartete Antwortstruktur von der HuggingFace-API: ${JSON.stringify(
					chatCompletion
				)}`
			);
		}

		const result = chatCompletion.choices[0].message.content;
		return NextResponse.json(
			{
				title: chapterTitle,
				content: result.split("\n").filter((line) => line.trim()) // Text in ein Array aufteilen
			},
			{
				headers: { "Content-Type": "application/json" },
				status: 200
			}
		);
	} catch (error) {
		console.error(
			`Fehler bei der Generierung des Inhalts für '${chapterTitle}':`,
			error
		);

		return NextResponse.json(
			{
				error: `Fehler bei der Generierung des Inhalts für '${chapterTitle}'.`
			},
			{ status: 500 }
		);
	}
}
