export interface Tutorial {
	content: unknown;
	error: unknown;
	title: string;
	description: string;
	chapters: Chapter[];
}

export interface Chapter {
	title: string;
	content: string[];
}

function createErrorResponse(message: string, status: number = 500) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { topic } = body;

		if (!topic || topic.trim().length === 0) {
			return createErrorResponse("Kein gültiges Thema angegeben.", 400);
		}

		// Dynamische Beispielantwort
		const tutorialResponse: Tutorial = {
			title: `Tutorial: ${topic}`,
			description: `Eine ausführliche Einführung in das Thema "${topic}".`,
			chapters: [
				{
					title: "Einleitung",
					content: [
						`Was ist ${topic}?`,
						`Warum ist ${topic} wichtig?`
					]
				},
				{
					title: "Hauptteil",
					content: [
						`Die zentralen Aspekte von ${topic}.`,
						`Praktische Beispiele und Anwendungen.`
					]
				},
				{
					title: "Fazit",
					content: [
						`Zusammenfassung der wichtigsten Punkte zu ${topic}.`,
						`Empfehlungen für weiterführende Ressourcen zu ${topic}.`
					]
				}
			],
			error: undefined,
			content: undefined
		};

		return new Response(JSON.stringify(tutorialResponse), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error(
			"Fehler bei der Generierung des Tutorials:",
			error instanceof Error ? error.message : error
		);
		return createErrorResponse("Fehler bei der Generierung des Tutorials.");
	}
}
