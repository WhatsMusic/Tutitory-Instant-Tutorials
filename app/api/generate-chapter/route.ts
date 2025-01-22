import { NextResponse } from "next/server"; // Imports Next.js response utility for server-side responses.
import { HfInference } from "@huggingface/inference"; // Imports the Hugging Face inference client.

const client = new HfInference(process.env.HUGGINGFACE_API_KEY); // Initializes the Hugging Face client with an API key from environment variables.

export async function POST(req: Request) {
	// Defines an asynchronous POST function to handle HTTP POST requests.
	const body = await req.json(); // Parses the request body as JSON.
	const { topic, chapterTitle } = body; // Destructures topic and chapterTitle from the request body.

	if (
		// Validates that both topic and chapterTitle are provided and not empty.
		!topic ||
		!chapterTitle ||
		topic.trim() === "" ||
		chapterTitle.trim() === ""
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
		console.log("Incoming request:", { topic, chapterTitle }); // Logs the incoming request for debugging.

		const chatCompletion = await client.chatCompletion({
			// Calls the Hugging Face API for chat completion.
			model: "google/gemma-2-2b-it", // Specifies the model to use for generating content.
			messages: [
				{
					role: "user",
					content: `Erstelle ein Kapitel mit dem Titel „${chapterTitle}“, das zum Thema „${topic}“ gehört.`
				}
			],
			max_tokens: 1024 // Limits the number of tokens in the response.
		});

		if (
			// Checks if the API response is valid and contains content.
			!chatCompletion.choices ||
			chatCompletion.choices.length === 0 ||
			!chatCompletion.choices[0].message?.content
		) {
			console.error(
				// Logs an error if the API response is invalid or empty.
				"Invalid API response:",
				JSON.stringify(chatCompletion, null, 2)
			);
			throw new Error("The API response is invalid or empty."); // Throws an error for invalid API response.
		}

		const result = chatCompletion.choices[0].message.content.trim(); // Extracts and trims the content from the API response.

		if (!result) {
			// Checks if the result is empty after trimming.
			throw new Error( // Throws an error if no content was generated.
				`No content generated for the chapter '${chapterTitle}'.`
			);
		}

		return NextResponse.json(
			// Returns a JSON response with the generated chapter content and a 200 status code.
			{
				title: chapterTitle,
				content: result
					.split("\n")
					.map((line) => line.trim()) // Trims each line of the content.
					.filter((line) => line) // Filters out empty lines.
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
