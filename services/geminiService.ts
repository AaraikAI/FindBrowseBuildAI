

import { GoogleGenAI, Type } from "@google/genai";
import { Idea, Artifact } from "../types";
import { CARD_COLORS } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIdeas = async (topic: string, count: number = 6): Promise<Idea[]> => {
  const ai = getClient();
  
  const systemInstruction = `
    You are a world-class startup consultant and product visionary like Paul Graham or Sam Altman. 
    Your goal is to generate innovative, realistic, and highly specific business ideas based on a given topic.
    Avoid generic ideas. Focus on solving real pain points with modern technology.
    
    Return a list of ${count} distinct ideas.
  `;

  const prompt = `Generate ${count} startup ideas related to: "${topic}". 
  If the topic is generic (like "random"), generate ideas across trending industries (AI, Climate, B2B SaaS).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Catchy startup name" },
              oneLiner: { type: Type.STRING, description: "Compelling value prop in one sentence" },
              emoji: { type: Type.STRING, description: "A relevant emoji icon" },
              category: { type: Type.STRING, description: "Industry category e.g. SaaS, EdTech" },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              problem: { type: Type.STRING, description: "The core pain point being solved" },
              solution: { type: Type.STRING, description: "How the product solves the problem" },
              targetAudience: { type: Type.STRING, description: "Who is this for?" },
              monetization: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of revenue models"
              },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3-4 relevant tags"
              },
              mvpFeatures: {
                 type: Type.ARRAY, 
                 items: { type: Type.STRING },
                 description: "3 core features for MVP"
              }
            },
            required: ["title", "oneLiner", "emoji", "category", "difficulty", "problem", "solution", "targetAudience", "monetization", "tags", "mvpFeatures"]
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) return [];

    const parsedData = JSON.parse(rawData);
    
    // Enrich with client-side only properties (id, color)
    return parsedData.map((idea: any) => ({
      ...idea,
      id: crypto.randomUUID(),
      color: CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)]
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateMoreLikeThis = async (originalIdea: Idea): Promise<Idea[]> => {
    const ai = getClient();
    const prompt = `Generate 3 variations or pivot ideas based on this concept: 
    Title: ${originalIdea.title}
    Problem: ${originalIdea.problem}
    Solution: ${originalIdea.solution}
    
    Make them distinct approaches to the same problem or adjacent markets.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            oneLiner: { type: Type.STRING },
                            emoji: { type: Type.STRING },
                            category: { type: Type.STRING },
                            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                            problem: { type: Type.STRING },
                            solution: { type: Type.STRING },
                            targetAudience: { type: Type.STRING },
                            monetization: { type: Type.ARRAY, items: { type: Type.STRING } },
                            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            mvpFeatures: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                         required: ["title", "oneLiner", "emoji", "category", "difficulty", "problem", "solution", "targetAudience", "monetization", "tags", "mvpFeatures"]
                    }
                }
            }
        });
        
        const rawData = response.text;
        if (!rawData) return [];

        const parsedData = JSON.parse(rawData);
        return parsedData.map((idea: any) => ({
            ...idea,
            id: crypto.randomUUID(),
            color: CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)]
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export const generateArtifact = async (
    idea: Idea, 
    moduleId: string, 
    moduleTitle: string, 
    useSearch: boolean = false,
    instruction: string = ""
): Promise<Artifact> => {
    const ai = getClient();
    
    // Schema for Artifact Structure
    const artifactSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A creative title for this document" },
            sections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Section header" },
                        type: { type: Type.STRING, enum: ["text", "list", "key-value", "markdown"] },
                        content: { 
                             type: Type.STRING,
                             description: "The content of the section. If type is 'list', format as markdown bullet points. If key-value, format as 'Key: Value' lines." 
                        }
                    },
                    required: ["title", "type", "content"]
                }
            }
        },
        required: ["title", "sections"]
    };

    const prompt = `
        You are an expert Chief Strategy Officer, CTO, and CMO.
        
        Startup Idea: ${idea.title}
        One Liner: ${idea.oneLiner}
        Problem: ${idea.problem}
        Solution: ${idea.solution}
        Target Audience: ${idea.targetAudience}

        Task: Generate a professional "${moduleTitle}" (${moduleId}) for this startup.
        
        Specific Instructions:
        ${instruction}

        Requirements:
        1. Professional, detailed, and actionable content.
        2. Break the content into logical sections (e.g. for a Brand Package: "Color Palette", "Typography", "Voice").
        3. Use "type": "markdown" for paragraphs, "list" for bullet points (returned as markdown string), "key-value" for structured data (returned as 'Key: Value' string).
        
        ${useSearch ? "Use Google Search to find real competitors, market data, or trends to inform your response. CRITICAL: When referencing specific facts or data from search, you MUST cite the source URL inline in the text using Markdown format, e.g. [TechCrunch](https://techcrunch.com/...)." : "Be creative and specific to the industry."}
    `;

    try {
        let response;
        if (useSearch) {
             response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: "You are a helpful assistant. Output the result in valid JSON format inside a ```json``` block matching this structure: { title: string, sections: [{ title, type, content }] }."
                }
            });
        } else {
             response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: artifactSchema
                }
            });
        }

        const rawText = response.text;
        
        let parsedData;
        if (useSearch) {
             // Extract JSON from code block
             const jsonMatch = rawText?.match(/```json\n([\s\S]*?)\n```/) || rawText?.match(/```\n([\s\S]*?)\n```/);
             if (jsonMatch && jsonMatch[1]) {
                 try {
                     parsedData = JSON.parse(jsonMatch[1]);
                 } catch (e) {
                     console.error("Failed to parse JSON block", e);
                     parsedData = null;
                 }
             } 
             
             if (!parsedData) {
                 // Fallback if no code block or parse failed, try parsing raw text if it looks like JSON
                 try {
                     parsedData = JSON.parse(rawText || '{}');
                 } catch (e) {
                     // If parsing fails completely, wrap the raw text in a generic artifact
                     parsedData = {
                         title: moduleTitle,
                         sections: [{ title: "Analysis", type: "markdown", content: rawText }]
                     };
                 }
             }
        } else {
            parsedData = JSON.parse(rawText || '{}');
        }

        // Extract sources from grounding metadata if available
        let sources: { uri: string, title: string }[] = [];
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri) {
                    sources.push({
                        uri: chunk.web.uri,
                        title: chunk.web.title || new URL(chunk.web.uri).hostname
                    });
                }
            });
        }

        // De-duplicate sources
        sources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

        return {
            id: moduleId,
            title: parsedData.title || moduleTitle,
            sections: parsedData.sections || [],
            sources: sources.length > 0 ? sources : undefined,
            createdAt: Date.now()
        };

    } catch (error) {
        console.error(`Error generating ${moduleId}:`, error);
        throw error;
    }
}
