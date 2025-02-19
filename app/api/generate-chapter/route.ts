import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface Prompts {
	chapter: (
		tutorialTitle: string,
		chapterTitle: string,
		chapterDescription: string
	) => string;
}

const prompts: { [key: string]: Prompts } = {
	en: {
		chapter: (tutorialTitle, chapterTitle, chapterDescription) =>
			`You will write a tutorial chapter for the tutorial titled "${tutorialTitle}".
The chapter is titled "${chapterTitle}" and covers the topic "${chapterDescription}".
Please respond exclusively in Markdown and follow this structure without including the words "Section:", "Description:" or "Example:" explicitly:

# ${chapterTitle}

## 1. [Title of the First Section]
Provide a detailed explanation along with a concrete example in a natural text flow.

## 2. [Title of the Second Section]
Provide a detailed explanation along with a concrete example in a natural text flow.

## 3. [Title of the Third Section]
Provide a detailed explanation along with a concrete example in a natural text flow.

## 4. [Title of the Fourth Section]
Provide a detailed explanation along with a concrete example in a natural text flow.

## 5. [Title of the Fifth Section]
Provide a detailed explanation along with a concrete example in a natural text flow.

Make sure the entire response is in English and does not include the words "Section:", "Description:" or "Example:" anywhere in the text.`
	},
	de: {
		chapter: (tutorialTitle, chapterTitle, chapterDescription) =>
			`Du wirst ein Kapitel für das Tutorial mit dem Titel "${tutorialTitle}" erstellen.
Das Kapitel trägt den Titel "${chapterTitle}" und behandelt das Thema "${chapterDescription}".
Bitte antworte ausschließlich in Markdown und folge exakt der folgenden Struktur – jedoch ohne die zusätzlichen Begriffe "Section:", "Description:" oder "Example:" zu verwenden:

# ${chapterTitle}

## 1. [Titel des ersten Abschnitts]
Gib eine ausführliche Erklärung und füge ein konkretes Beispiel in einem natürlichen Fließtext ein.

## 2. [Titel des zweiten Abschnitts]
Gib eine ausführliche Erklärung und füge ein konkretes Beispiel in einem natürlichen Fließtext ein.

## 3. [Titel des dritten Abschnitts]
Gib eine ausführliche Erklärung und füge ein konkretes Beispiel in einem natürlichen Fließtext ein.

## 4. [Titel des vierten Abschnitts]
Gib eine ausführliche Erklärung und füge ein konkretes Beispiel in einem natürlichen Fließtext ein.

## 5. [Titel des fünften Abschnitts]
Gib eine ausführliche Erklärung und füge ein konkretes Beispiel in einem natürlichen Fließtext ein.

Achte darauf, dass die gesamte Antwort in deutscher Sprache erfolgt und die Wörter "Section:", "Description:" oder "Example:" nicht vorkommen.`
	}
};

export async function POST(req: NextRequest) {
	try {
		// Lese die Parameter aus dem Request-Body
		const { tutorialTitle, chapterTitle, chapterDescription } =
			await req.json();

		if (!process.env.HUGGINGFACE_API_KEY) {
			throw new Error("❌ Error: HUGGINGFACE_API_KEY is not set.");
		}

		// Wähle den korrekten Prompt basierend auf dem übergebenen Locale; Fallback: "en"
		const url = req.nextUrl;
		const localeFromQuery = url.searchParams.get("locale");
		const userLocale = localeFromQuery || url.locale || "en";
		const prompt =
			prompts[userLocale]?.chapter(
				tutorialTitle,
				chapterTitle,
				chapterDescription
			) ||
			prompts.en.chapter(tutorialTitle, chapterTitle, chapterDescription);

		const responseStream = client.chatCompletionStream({
			model: "mistralai/Mistral-7B-Instruct-v0.3", // Modell, das Chat-Streaming unterstützt
			messages: [
				{
					role: "user",
					content: prompt
				}
			],
			provider: "together",
			max_new_tokens: 2048,
			temperature: 0.3,
			top_p: 0.95,
			top_k: 50
		});

		const encoder = new TextEncoder();
		const stream = new ReadableStream<Uint8Array>({
			async start(controller) {
				try {
					// Verarbeite den asynchronen Response-Stream
					for await (const chunk of responseStream) {
						if (chunk.choices && chunk.choices.length > 0) {
							const textChunk =
								chunk.choices[0].delta?.content || "";
							controller.enqueue(encoder.encode(textChunk));
						}
					}
					controller.close();
				} catch (error) {
					console.error("❌ Streaming Error:", error);
					controller.error(error);
				}
			}
		});

		return new Response(stream, {
			headers: { "Content-Type": "text/plain" }
		});
	} catch (error) {
		console.error("❌ Error generating chapter:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
