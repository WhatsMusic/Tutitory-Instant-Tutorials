import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { Chapter, Tutorial } from "../../../types";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
	try {
		const { topic, locale = "en" } = await req.json();

		if (!process.env.HUGGINGFACE_API_KEY) {
			throw new Error("❌ Error: HUGGINGFACE_API_KEY is not set.");
		}

		console.log("✅ Hugging Face API key found, starting AI generation...");

		const prompt = `
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

Now generate a tutorial for the topic: "${topic}" in ${locale}.
`;
		const chatCompletion = await client.chatCompletion({
			model: "google/gemma-2-2b-it",
			messages: [
				{
					role: "user",
					content: prompt
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
			const cleanedContent = cleanJsonString(generatedContent); // Clean the JSON string
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

function cleanJsonString(jsonString: string): string {
	try {
		// Find the first and last occurrences of curly braces
		const firstBraceIndex = jsonString.indexOf("{");
		const lastBraceIndex = jsonString.lastIndexOf("}");

		// Extract the JSON string between the curly braces
		if (firstBraceIndex !== -1 && lastBraceIndex !== -1) {
			return jsonString.substring(firstBraceIndex, lastBraceIndex + 1);
		} else {
			throw new Error("Invalid JSON: Could not find curly braces.");
		}
	} catch (error) {
		console.error("JSON cleaning error:", error);
		throw error; // Re-throw for handling in the route
	}
}

function parseTutorialContent(content: string): Tutorial {
	try {
		const tutorialData = JSON.parse(content);

		// Validate the structure and provide defaults
		const tutorial: Tutorial = {
			id: uuidv4(),
			title: tutorialData.title || "new tutorial",
			description:
				tutorialData.description || "No description available.",
			locale: "en", // Get locale from the request or have a default
			tags: tutorialData.tags || [],
			keywords: tutorialData.keywords || [],
			chapters: (tutorialData.chapters || []).map(
				(chapter: Chapter, index: number): Chapter => ({
					id: uuidv4(),
					order: index + 1,
					title: chapter.title || "chapter " + (index + 1),
					description:
						chapter.description || "No description available.",
					content: null,
					tags: chapter.tags || [],
					keywords: chapter.keywords || [],
					tutorialTitle: tutorialData.title || "New Tutorial" // Use overall title here
				})
			),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		return tutorial;
	} catch (error) {
		console.error("Error parsing tutorial content:", error);
		throw error; // Re-throw the error to be handled by the route handler
	}
}
