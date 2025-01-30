import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { Chapter } from "../../../types";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface ChapterContent {
	introduction?: string;
	sections?: { title: string; content: string }[];
	case_study?: string;
	key_takeaways?: string;
}

export async function POST(req: Request) {
	try {
		const { tutorialTitle, chapterTitle, chapterDescription } =
			await req.json();

		if (!process.env.HUGGINGFACE_API_KEY) {
			throw new Error("❌ Error: HUGGINGFACE_API_KEY is not set.");
		}

		console.log(
			"✅ Hugging Face API key found, starting chapter generation..."
		);

		const prompt = `You are an AI that generates structured chapters for tutorials.
		Follow the exact JSON format provided below without deviation.
{
  "title": "${chapterTitle}",
  "description": "${chapterDescription}",
  "content": {
    "introduction": "An introduction to the chapter topic.",
    "sections": [
      {
        "title": "The title of the first section",
        "content": "Detailed explanation with examples of the first section."
      },
      {
        "title": "The title of the second section",
        "content": "Detailed explanation with examples of the second section."
      },
	  {
        "title": "The title of the third section",
        "content": "Detailed explanation with examples of the third section."
      },
	   {
        "title": "The title of the fourth section",
        "content": "Detailed explanation with examples of the fourth section."
      },
	   {
        "title": "The title of the fifth section",
        "content": "Summarize the most important points of the chapter."
      }
    ]
  },
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Make sure the response strictly follows this JSON structure.
- **Do not use markdown formatting like \`\`\`json**.
- **Do not include any text outside the JSON.**
- **Ensure all keys are enclosed in double quotes ("").**
- **Ensure commas are properly placed between JSON properties.**
- **Ensure that the response starts with "{" and ends with "}."**


Now generate a chapter titled "${chapterTitle}" with a description of "${chapterDescription}" for the tutorial: "${tutorialTitle}".
`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 30000);

		let chatCompletion;
		try {
			chatCompletion = await client.chatCompletion({
				model: "google/gemma-2-2b-it",
				messages: [{ role: "user", content: prompt }],
				provider: "hf-inference",
				top_p: 0.8,
				max_tokens: 2048,
				temperature: 0.3,
				signal: controller.signal
			});

			clearTimeout(timeout);
		} catch (apiError) {
			console.error("❌ API error at Hugging Face:", apiError);
			return NextResponse.json(
				{
					error: "Hugging Face API error: Response too slow or invalid.",
					retry: true // ✅ Add a retry flag
				},
				{ status: 500 }
			);
		}

		const generatedContent = chatCompletion.choices[0]?.message?.content;

		if (!generatedContent) {
			console.error("❌ AI did not provide a valid answer.");
			return NextResponse.json(
				{
					error: "No content generated",
					retry: true // ✅ Add retry flag
				},
				{ status: 500 }
			);
		}

		console.log(
			"🔍 AI reply received:",
			generatedContent.substring(0, 200) + "..."
		);

		try {
			const cleanedContent = cleanJsonString(generatedContent);
			const parsedChapter = parseChapterContent(cleanedContent);
			return NextResponse.json(parsedChapter);
		} catch (error) {
			console.error("❌ Error parsing JSON:", error);
			return NextResponse.json(
				{
					error: "Failed to parse generated content",
					retry: true // ✅ Add retry flag
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error in POST route:", error);
		return NextResponse.json(
			{
				error: "An unexpected error occurred",
				retry: true // ✅ Add retry flag
			},
			{ status: 500 }
		);
	}
}

// **Automatically correct JSON errors**
function cleanJsonString(jsonString: string): string {
	try {
		// Remove markdown formatting (` ```json `)
		jsonString = jsonString
			.replace(/^```json/, "")
			.replace(/```$/, "")
			.trim();

		// If JSON still fails
		return jsonString;
	} catch (error) {
		console.error("JSON cleaning error:", error);
		throw NextResponse.json(
			{
				error: "No content generated",
				retry: true // ✅ Add retry flag
			},
			{ status: 500 }
		);
	}
}

// Parse the chapter and validate the structure
function parseChapterContent(
	content: string,
	tutorialTitle?: string,
	chapterTitle?: string,
	chapterDescription?: string
) {
	try {
		const chapterData = safeJsonParse(content);

		const chapter: Chapter = {
			id: uuidv4(),
			order: 1,
			title: chapterData.title || chapterTitle || "Unknown Chapter",
			description:
				chapterData.description ||
				chapterDescription ||
				"No description available",
			tutorialTitle:
				chapterData.tutorialTitle ||
				tutorialTitle ||
				"Unknown Tutorial",
			content: chapterData.content
				? formatChapterContent(chapterData.content as ChapterContent) // ✅ TypeScript secures `content`
				: "Content not available.",
			tags: chapterData.tags || [],
			keywords: chapterData.keywords || []
		};

		return chapter;
	} catch (error) {
		console.error("Error parsing chapter content:", error);
		throw NextResponse.json(
			{
				error: "No content generated",
				retry: true // ✅ Add retry flag
			},
			{ status: 500 }
		);
	}
}

function formatChapterContent(contentObj?: ChapterContent | string): string {
	if (!contentObj) return "No content available."; // 🔥 If contentObj is undefined or null
	if (typeof contentObj === "string") return contentObj.trim(); // If `contentObj` is directly a string

	// If it is an object, extract the relevant texts
	let formattedContent = "";
	if (contentObj.introduction)
		formattedContent += `## Introduction\n\n${contentObj.introduction}\n\n`;
	if (contentObj.sections) {
		contentObj.sections.forEach(
			(section: { title: string; content: string }) => {
				formattedContent += `### ${section.title}\n\n${section.content}\n\n`;
			}
		);
	}
	if (contentObj.case_study)
		formattedContent += `## Case Study\n\n${contentObj.case_study}\n\n`;
	if (contentObj.key_takeaways)
		formattedContent += `## Key Takeaways\n\n${contentObj.key_takeaways}\n\n`;

	return formattedContent.trim();
}

function safeJsonParse(jsonString: string) {
	try {
		// 1. Attempt to extract JSON using the existing regex (for well-formed responses)
		const jsonMatch = jsonString.match(/\{(.*)\}/s);
		let extractedJson = ""; // Initialize outside if block
		if (jsonMatch && jsonMatch[1]) {
			extractedJson = jsonMatch[1];
			extractedJson = extractedJson.replace(/```/g, "");
			// Trailing comma fix
			extractedJson = extractedJson.replace(/,\s*]/g, "]");

			try {
				return JSON.parse(`{${extractedJson}}`);
			} catch (innerError) {
				console.error(
					"Inner parsing error after regex extraction",
					innerError
				);
			}
		} else {
			// 2. If the above fails, try a more relaxed approach:
			// Find the FIRST and LAST curly brace, regardless of nested structure:
			const firstBraceIndex = jsonString.indexOf("{");
			const lastBraceIndex = jsonString.lastIndexOf("}");

			if (
				firstBraceIndex !== -1 &&
				lastBraceIndex !== -1 &&
				lastBraceIndex > firstBraceIndex
			)
				extractedJson = jsonString.substring(
					firstBraceIndex,
					lastBraceIndex + 1
				);
		}
		extractedJson = extractedJson.replace(/```/g, "");
		// Trailing comma fix
		extractedJson = extractedJson.replace(/,\s*]/g, "]");

		// Fix for missing/extra commas in arrays using a replacer function
		try {
			const potentiallyMalformedJson = `{${extractedJson}}`;
			let sanitizedJson = "";

			try {
				sanitizedJson = JSON.stringify(
					JSON.parse(potentiallyMalformedJson),
					null,
					2
				);
			} catch (e) {
				console.error(
					"Error during initial JSON.parse (stringify step):",
					e
				); // Log the error
				// 1. Handle array errors (your existing code):
				sanitizedJson = potentiallyMalformedJson.replace(
					/"([^"]+)"\s*:\s*(\[[^\]]+\])/gs,
					(match, key, arrayString) => {
						const arrayWithFixedCommas = arrayString.replace(
							/\s*([\[\],])\s*/g,
							"$1"
						);
						return `"${key}":${arrayWithFixedCommas}`;
					}
				);

				// 2. Handle unquoted property names
				sanitizedJson = sanitizedJson.replace(
					/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
					'$1"$3":'
				);
			}

			return JSON.parse(sanitizedJson);
		} catch (innerError) {
			console.error("Error after array comma fix attempt:", innerError);

			// Log the extractedJson
			console.error(
				"Extracted JSON that failed parsing:",
				`{${extractedJson}}`
			);
			throw innerError;
		}
	} catch (error) {
		console.error("❌ Error parsing/repairing JSON:", error);
		throw new Error(
			"Invalid JSON received from API. Repair attempt failed."
		);
	}
}
