import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { BusinessIdea, GroundingChunk, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatInstance: Chat | null = null;

const getChatInstance = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are a helpful and encouraging business advisor chatbot for young entrepreneurs. Keep your responses concise and actionable. Use markdown for formatting when appropriate (e.g., lists, bolding).',
            },
        });
    }
    return chatInstance;
};

export const getBusinessIdeas = async (
  locationQuery: string
): Promise<{ ideas: BusinessIdea[]; sources: GroundingChunk[] }> => {
  const prompt = `Based on a detailed analysis of the location "${locationQuery}", generate 5 innovative and viable business ideas for young entrepreneurs. Consider local demographics, existing businesses, and potential unmet needs in that specific area.
Your response MUST be a single, valid JSON array of objects. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON array. The JSON must be parseable.
Each object in the array must have the following keys:
- "name": A string for the business name.
- "concept": A string for the one-sentence concept.
- "startupCost": A string with one of these exact values: 'Low', 'Medium', or 'High'.

Here is an example of the required format:
[
  {
    "name": "Example Name",
    "concept": "Example one-sentence concept.",
    "startupCost": "Medium"
  }
]

Ensure all string values are properly quoted and all objects in the array are separated by commas.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{googleMaps: {}}],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

  try {
    // The model sometimes wraps the JSON in a markdown code block.
    // This regex removes the ```json prefix and the ``` suffix.
    const jsonString = response.text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    const ideas = JSON.parse(jsonString);
    return { ideas, sources };
  } catch (error) {
    console.error("Failed to parse business ideas JSON:", error);
    // Fallback if JSON parsing fails, showing the raw text for debugging.
    return { ideas: [{ name: "AI Response Error", concept: `Could not parse the AI's response. Raw output:\n\n${response.text}`, startupCost: "N/A" }], sources };
  }
};

export const analyzeBusinessIdea = async (idea: BusinessIdea): Promise<string> => {
  const prompt = `Perform a deep, comprehensive analysis of the following business idea for a young entrepreneur:
    Name: ${idea.name}
    Concept: ${idea.concept}
    Estimated Startup Cost: ${idea.startupCost}

    Provide the following in well-structured markdown:
    1.  **SWOT Analysis:** Strengths, Weaknesses, Opportunities, and Threats.
    2.  **Target Audience:** A detailed description of the ideal customer.
    3.  **Marketing & Branding Strategy:** Creative and low-cost marketing ideas suitable for a new venture.
    4.  **Initial 3-Step Action Plan:** The first three concrete steps to get started.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};


export async function* chatWithBotStream(newMessage: string): AsyncGenerator<string> {
    const chat = getChatInstance();
    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
        yield chunk.text;
    }
}


export const generateImage = async (prompt: string): Promise<string> => {
    const fullPrompt = `A vibrant, modern logo concept for a startup. The logo should be for a business concept: "${prompt}". Minimalist, clean, memorable.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};