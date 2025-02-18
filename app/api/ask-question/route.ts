import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { langMap } from "@/app/utils/helpers";

// Initialize the Hugging Face client
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
	try {
		const { locale, tutorialTitle, chapterTitle, question } =
			await req.json();

		const lang = langMap[locale as keyof typeof langMap] || "Unknown";

		console.log(tutorialTitle, chapterTitle, question);
		const prompt = `You are Tutitory, an AI that writes tutorials and guides in ${lang} language.
    Answer the following question about the chapter "${chapterTitle}" from the tutorial "${tutorialTitle}":
    ${question}
    Provide a detailed and understandable answer. Format your response using Markdown for better readability.
    Start your answer immediately, without repeating these instructions.`;

		const textGeneration = await client.textGeneration({
			model: "google/gemma-2-2b-it",
			inputs: prompt,
			parameters: {
				max_new_tokens: 1024,
				min_new_tokens: 100,
				do_sample: true,
				temperature: 0.2,
				top_p: 0.9
			}
		});

		let answer = textGeneration.generated_text.trim();

		// Remove the prompt if it's included in the response
		const promptEndIndex = answer.indexOf(
			"Start your answer immediately, without repeating these instructions."
		);
		if (promptEndIndex !== -1) {
			answer = answer
				.substring(
					promptEndIndex +
						"Start your answer immediately, without repeating these instructions."
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
