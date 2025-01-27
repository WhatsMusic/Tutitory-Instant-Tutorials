import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Initialize the Hugging Face client
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
	try {
		const { chapterTitle, question } = await req.json();

		const prompt = `Du bist Tutitory, eine KI, die deutsche Tutorials und Anleitungen schreibt.
    Beantworte die folgende Frage zum Kapitel "${chapterTitle}":
    ${question}
    Gib eine detaillierte und verständliche Antwort. Formatiere die Antwort mit Markdown für bessere Lesbarkeit.
    Beginne deine Antwort direkt, ohne diese Anweisungen zu wiederholen.`;

		const textGeneration = await client.textGeneration({
			model: "google/gemma-2-2b-it",
			inputs: prompt,
			parameters: {
				max_new_tokens: 2048,
				temperature: 0.4,
				top_p: 0.9
			}
		});

		let answer = textGeneration.generated_text.trim();

		// Remove the prompt if it's included in the response
		const promptEndIndex = answer.indexOf(
			"Beginne deine Antwort direkt, ohne diese Anweisungen zu wiederholen."
		);
		if (promptEndIndex !== -1) {
			answer = answer
				.substring(
					promptEndIndex +
						"Beginne deine Antwort direkt, ohne diese Anweisungen zu wiederholen."
							.length
				)
				.trim();
		}

		if (!answer || answer.length === 0) {
			throw new Error("Generated answer is empty or invalid");
		}

		return NextResponse.json({ answer });
	} catch (error) {
		console.error("Error generating answer:", error);
		return NextResponse.json(
			{
				error: "Failed to generate answer",
				details:
					error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
