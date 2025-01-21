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
					content: `Write a detailed and educational content for the chapter titled '${chapterTitle}' related to the topic '${topic}'. Focus on key explanations, examples, and structured learning.`
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
