import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { cleanJsonString, parseTutorialContent } from "@/app/utils/helpers";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface Prompt {
	toc: (topic: string) => string;
}

const prompts: { [key: string]: Prompt } = {
	en: {
		toc: (topic: string) =>
			`
You are an AI that generates structured tutorials. Follow the exact JSON format provided below without deviation.

{
  "title": "Title of the tutorial",
  "description": "Brief summary of the tutorial",
  "tags": ["tag1", "tag2"],
  "keywords": ["keyword1", "keyword2"],
  "chapters": [
    {
      "title": "Chapter 1 Title",
      "description": "Brief summary of chapter 1",
      "tags": ["tag1", "tag2"],
      "keywords": ["keyword1", "keyword2"]
    },
    {
      "title": "Chapter 2 Title",
      "description": "Brief summary of chapter 2",
      "tags": ["tag1", "tag2"],
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}

Make sure the response strictly follows this JSON structure.
- Do not add markdown formatting like \`\`\`json.
- Do not add any explanations or additional text.
- The response must be valid JSON and contain exactly 5 chapters.
- Ensure that **all JSON elements are fully closed and valid**.

Now generate a tutorial for the topic: "${topic}".
`
	},
	de: {
		toc: (topic: string) =>
			`Du bist eine KI, die strukturierte Tutorials generiert. Halte dich genau an das unten angegebene JSON-Format, ohne davon abzuweichen.
{
"title": "Titel des Tutorials",
"description": "Kurze Zusammenfassung des Tutorials",
"tags": ["tag1", "tag2"],
"keywords": ["keyword1", "keyword2"],
"chapters": [
  {
    "title": "Titel von Kapitel 1",
    "description": "Kurze Zusammenfassung von Kapitel 1",
    "tags": ["tag1", "tag2"],
    "keywords": ["keyword1", "keyword2"]
  },
  {
    "title": "Titel von Kapitel 2",
    "description": "Kurze Zusammenfassung von Kapitel 2",
    "tags": ["tag1", "tag2"],
    "keywords": ["keyword1", "keyword2"]
  }
]
}
Stelle sicher, dass die Antwort genau dieser JSON-Struktur folgt.
- Füge keine Markdown-Formatierung wie json hinzu.
- Füge keine Erklärungen oder zusätzlichen Text hinzu.
- Die Antwort muss gültiges JSON sein und genau 5 Kapitel enthalten.
- Stelle sicher, dass **alle JSON-Elemente vollständig geschlossen und gültig sind**.
Erstelle nun ein Tutorial für das Thema: "${topic}".`
	}
};

export async function POST(req: NextRequest) {
	const { topic } = await req.json();

	// Locale aus den Query-Parametern auslesen und als Fallback auch req.nextUrl.locale nutzen:
	const url = req.nextUrl;
	const localeFromQuery = url.searchParams.get("locale");
	const userLocale = localeFromQuery || url.locale || "en";

	// Den passenden, lokaliserten Prompt auswählen
	const prompt = prompts[userLocale]?.toc(topic) || prompts.en.toc(topic);

	try {
		if (!process.env.HUGGINGFACE_API_KEY) {
			throw new Error("❌ Error: HUGGINGFACE_API_KEY is not set.");
		}

		if (!prompt) {
			throw new Error("❌ Error: Prompt not found.");
		}

		console.log(
			"✅ Hugging Face API key found, starting AI generation...",
			{ prompt }
		);

		const chatCompletion = await client.chatCompletion({
			model: "google/gemma-2-2b-it",
			messages: [
				{
					role: "user",
					content: JSON.stringify({ prompt })
				}
			],
			provider: "hf-inference",
			max_new_tokens: 500,
			temperature: 0.7,
			top_p: 0.95,
			top_k: 50
		});

		const generatedContent = chatCompletion.choices[0]?.message?.content;

		if (!generatedContent) {
			return NextResponse.json(
				{ error: "No content generated" },
				{ status: 500 }
			);
		}

		try {
			const cleanedContent = cleanJsonString(generatedContent); // JSON String bereinigen
			const parsedTutorial = parseTutorialContent(cleanedContent);
			return NextResponse.json(parsedTutorial);
		} catch (error) {
			console.error("Error parsing/cleaning JSON:", error);
			return NextResponse.json(
				{ error: "Invalid JSON received/generated" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error in POST route:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
