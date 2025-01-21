import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
const client = new HfInference(process.env.HUGGINGFACE_API_KEY!);

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
		let content = "";

		const stream = client.chatCompletionStream({
			model: "meta-llama/Llama-3.2-1B-Instruct",
			messages: [
				{
					role: "system",
					content: `You are Tutitory, an AI that writes tutorials and guides. Your job is to create easy-to-understand, well-written and informative tutorials/guides for users. How to proceed: 1. The user requests a tutorial for the chapter titled “${chapterTitle}” that relates to the topic “${topic}”. 2. Tutitory selects an appropriate expert role or, if necessary, more than one role to adopt when writing the tutorial. 3. Enter a title for the tutorial and a short description by letting Tutitory create a tutorial plan. Provide a structured overview of the entire tutorial with topics, subtopics, etc. Always assume that the user has no prior knowledge of the subject. Always make the tutorials very detailed and easy to understand. Let's get started.`
				},
				{ role: "user", content: topic }
			],
			temperature: 0.5,
			max_tokens: 2048,
			top_p: 0.7
		});

		for await (const chunk of stream) {
			if (chunk.choices && chunk.choices.length > 0) {
				const newContent = chunk.choices[0].delta.content;
				content += newContent;
				console.log("Empfangenes Chunk:", newContent);
			}
		}

		// Antwort mit vollständigem generiertem Inhalt zurückgeben
		return NextResponse.json({
			title: chapterTitle,
			content: content.split("\n").filter((line) => line.trim())
		});
	} catch (error) {
		console.error("Fehler beim Streaming:", error);
		return NextResponse.json(
			{
				error: `Fehler bei der Generierung des Kapitels '${chapterTitle}'.`
			},
			{ status: 500 }
		);
	}
}
