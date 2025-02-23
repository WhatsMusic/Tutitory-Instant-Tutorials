import { NextRequest, NextResponse } from "next/server";
import OpenAIApi from "openai";

const openaiConfig = {
	apiKey: process.env.OPENAI_API_KEY,
	fetch: (...args: Parameters<typeof globalThis.fetch>) => fetch(...args)
};

const openai = new OpenAIApi(openaiConfig);

// Definiere die Prompts für beide Sprachen
const prompts: {
	[key: string]: (
		tutorialTitle: string,
		chapterTitle: string,
		question: string
	) => string;
} = {
	en: (tutorialTitle, chapterTitle, question) =>
		`You are Tutitory, an AI that writes tutorials and guides in English.
Answer the following question about the chapter "${chapterTitle}" from the tutorial "${tutorialTitle}":
${question}
Provide a detailed and understandable answer in Markdown for better readability.
Start your answer immediately without repeating these instructions.`,
	de: (tutorialTitle, chapterTitle, question) =>
		`Du bist Tutitory, eine KI, die Tutorials und Anleitungen auf Deutsch erstellt.
Beantworte die folgende Frage zum Kapitel "${chapterTitle}" aus dem Tutorial "${tutorialTitle}":
${question}
Gib eine detaillierte und verständliche Antwort in Markdown für bessere Lesbarkeit.
Start your answer immediately without repeating these instructions.`
};

export async function POST(req: NextRequest) {
	try {
		// Lese die Parameter aus dem Request-Body
		const { tutorialTitle, chapterTitle, question } = await req.json();

		// Extrahiere den Locale-Wert aus der URL
		const url = req.nextUrl;
		const localeFromQuery = url.searchParams.get("locale");
		const userLocale = localeFromQuery || url.locale || "en";

		// Wähle das passende Prompt basierend auf dem userLocale, Fallback: englisches Prompt
		const promptGenerator =
			prompts[userLocale as keyof typeof prompts] || prompts.en;
		const prompt = promptGenerator(tutorialTitle, chapterTitle, question);

		// Sammle den generierten Text aus dem Streaming-Response
		let accumulatedText = "";
		const responseStream = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: prompt
				}
			],
			stream: true,
			max_tokens: 2048,
			temperature: 0.7,
			top_p: 0.95
		});

		for await (const chunk of responseStream) {
			if (chunk.choices && chunk.choices.length > 0) {
				const textChunk = chunk.choices[0].delta?.content || "";
				accumulatedText += textChunk;
			}
		}

		const answer = accumulatedText.trim();

		if (!answer || answer.length === 0) {
			throw new Error("Generated answer is empty or invalid");
		}

		// Rückgabe als JSON, damit der Client validen JSON-Code erhält
		return NextResponse.json({ answer });
	} catch (error) {
		console.error("❌ Error generating reply:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
