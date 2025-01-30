import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

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

		const prompt = `You will write a tutorial chapter on the topic “${chapterTitle}” – “${chapterDescription}” as a single chapter within the tutorial titled “${tutorialTitle}”.
Please create the chapter with at least 5 detailed sections related to the topic. Consider the following scheme as a guide: 

## **${chapterTitle}**
_${chapterDescription}_  

---

### **1. The Title of the First Section**
- Provide a detailed explanation.
- Include key concepts, examples, or case studies.
- If applicable, break it down into **subsections**.

### **2. The Title of the Second Section**
- Expand on a specific aspect related to the chapter.
- Use bullet points for structured information.

### **3. The Title of the Third Section**
- Explain another key area of the topic.
- Use a **real-world example** or **a step-by-step guide** if relevant.

### **4. The Title of the Fourth Section**
- Dive deeper into an advanced concept.
- Provide actionable insights, common mistakes, or best practices.

### **5. The Title of the Fifth Section**
- Summarize the key ideas covered so far.
- Introduce any additional thoughts that complement the topic.

---
`;

		const responseStream = client.chatCompletionStream({
			model: "mistralai/Mistral-7B-Instruct-v0.3", // ✅ Use a model that supports chat streaming
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
					// ✅ Process the `AsyncGenerator` response stream
					for await (const chunk of responseStream) {
						if (chunk.choices && chunk.choices.length > 0) {
							const textChunk =
								chunk.choices[0].delta?.content || "";
							controller.enqueue(encoder.encode(textChunk)); // ✅ Convert to Uint8Array before streaming
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
