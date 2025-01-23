export interface Tutorial {
	// Defines the Tutorial interface for TypeScript type checking.
	content: unknown; // Placeholder for content, type is unknown.
	error: unknown; // Placeholder for error, type is unknown.
	title: string; // Title of the tutorial.
	description: string; // Description of the tutorial.
	chapters: Chapter[]; // Array of chapters in the tutorial.
}

export interface Chapter {
	// Defines the Chapter interface for TypeScript type checking.
	title: string; // Title of the chapter.
	content: string[]; // Array of strings representing the content of the chapter.
}

function createErrorResponse(message: string, status: number = 500) {
	// Function to create an error response.
	return new Response(JSON.stringify({ error: message }), {
		// Returns a new Response object with a JSON error message.
		status, // Sets the HTTP status code.
		headers: { "Content-Type": "application/json" } // Sets the content type to JSON.
	});
}

export async function POST(req: Request) {
	// Defines an asynchronous POST function to handle HTTP POST requests.
	try {
		const body = await req.json(); // Parses the request body as JSON.
		const { topic } = body; // Destructures the topic from the request body.

		if (!topic || topic.trim().length === 0) {
			// Validates that a valid topic is provided.
			return createErrorResponse("No valid topic provided.", 400); // Returns a 400 error response if the topic is invalid.
		}

		// Dynamic example response
		const tutorialResponse: Tutorial = {
			// Creates a tutorial response object conforming to the Tutorial interface.
			title: `Tutorial: ${topic}`, // Sets the tutorial title.
			description: `Eine umfassende Einführung in das Thema "${topic}".`, // Sets the tutorial description.
			chapters: [
				// Defines an array of chapters for the tutorial.
				{
					title: "Einleitung", // Title of the first chapter.
					content: [
						// Content of the first chapter.
						`Was ist ${topic}?`,
						`Warum ist ${topic} wichtig?`
					]
				},
				{
					title: "Hauptinhalt", // Title of the second chapter.
					content: [
						// Content of the second chapter.
						`Die wichtigsten Aspekte von ${topic}.`,
						`Praktische Beispiele und Anwendungen.`
					]
				},
				{
					title: "Schlussfolgerung", // Title of the third chapter.
					content: [
						// Content of the third chapter.
						`Zusammenfassung der wichtigsten Punkte zu ${topic}.`,
						`Empfehlungen für weitere Ressourcen zu ${topic}.`
					]
				}
			],
			error: undefined, // Placeholder for error, set to undefined.
			content: undefined // Placeholder for content, set to undefined.
		};

		return new Response(JSON.stringify(tutorialResponse), {
			// Returns a new Response object with the tutorial data as JSON.
			status: 200, // Sets the HTTP status code to 200 (OK).
			headers: { "Content-Type": "application/json" } // Sets the content type to JSON.
		});
	} catch (error) {
		// Catches and handles any errors during the process.
		console.error(
			// Logs the error to the console.
			"Error generating the tutorial:",
			error instanceof Error ? error.message : error
		);
		return createErrorResponse("Error generating the tutorial."); // Returns a generic error response.
	}
}
