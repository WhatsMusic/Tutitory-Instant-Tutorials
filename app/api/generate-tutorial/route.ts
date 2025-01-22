import { NextResponse } from "next/server"; // Imports Next.js response utility for server-side responses.
import { HfInference } from "@huggingface/inference"; // Imports the Hugging Face inference client.

const client = new HfInference(process.env.HUGGINGFACE_API_KEY); // Initializes the Hugging Face client with an API key from environment variables.

export async function POST(req: Request) {
	// Defines an asynchronous POST function to handle HTTP POST requests.
	const body = await req.json(); // Parses the request body as JSON.
	const { topic, chapterTitle } = body; // Destructures topic and chapterTitle from the request body.

	console.log("Received request:", body); // Logs the received request body for debugging.

	if (
		// Validates that both topic and chapterTitle are provided and not empty.
		!topic ||
		!chapterTitle ||
		topic.trim().length === 0 ||
		chapterTitle.trim().length === 0
	) {
		console.log("Invalid input:", { topic, chapterTitle }); // Logs invalid input for debugging.
		return NextResponse.json(
			// Returns a JSON response with an error message and a 400 status code.
			{
				error: "The topic and chapter title must not be empty.",
				hint: "Please check your inputs and try again."
			},
			{ status: 400 }
		);
	}

	try {
		const chatCompletion = await client.chatCompletion({
			// Calls the Hugging Face API for chat completion.
			model: "google/gemma-2-2b-it", // Specifies the model to use for generating content.
			messages: [
				{
					role: "user",
					content: `Du bist Tutitory, eine KI, die Tutorials und Anleitungen schreibt.
							Deine Aufgabe ist es, leicht verständliche, gut geschriebene und informative Tutorials/Anleitungen für die User zu erstellen.
							Vorgehensweise:
							1. Der User benötigt ein Tutorial zum Thema ${topic}.
							2. Tutitory wählt eine passende Expertenrolle oder ggf. mehr als eine Rolle, die es für das Schreiben des Tutorials annimmt.
							3. Gib einen Titel für das Tutorial und eine kurze Beschreibung an, indem Tutitory einen Tutorialplan erstellt. Gib einen strukturierten Überblick über das gesamte Tutorial mit Themen, Unterthemen usw.
							4. Gestalte die Tutorials immer sehr detailliert und einfach zu folgen.`
				}
			],
			temperature: 0.3,
			max_tokens: 2048,
			top_p: 0.7
		});

		if (
			// Checks if the response structure is valid.
			!topic ||
			!chapterTitle ||
			topic.trim().length === 0 ||
			chapterTitle.trim().length === 0
		) {
			console.error(
				// Logs an error if the response structure is invalid.
				"Invalid response structure from HuggingFace:",
				chatCompletion
			);
			throw new Error("The API response is invalid."); // Throws an error for invalid API response.
		}

		const result = // Extracts the content from the API response.
			chatCompletion.choices[0]?.message?.content?.trim() || "";

		return NextResponse.json(
			// Returns a JSON response with the generated chapter content and a 200 status code.
			{
				title: chapterTitle,
				content: result
					.split("\n")
					.map((line) => line.trim()) // Trims each line of the content.
					.filter((line) => line !== null && line !== undefined) // Filters out null or undefined lines.
			},
			{ status: 200 }
		);
	} catch (error) {
		// Catches and handles any errors during the process.
		const errorMessage = // Determines the error message to display.
			error instanceof Error
				? error.message
				: "An unknown error occurred";

		console.error(
			// Logs the error message for debugging.
			`Error generating content for '${chapterTitle}':`,
			error
		);

		return NextResponse.json(
			// Returns a JSON response with an error message and a 500 status code.
			{
				error: `Error generating content for '${chapterTitle}': ${errorMessage}`
			},
			{ status: 500 }
		);
	}
}
