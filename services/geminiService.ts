
import { GoogleGenAI, Type } from "@google/genai";
import { Slide, VisualStyle, AspectRatio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateScript = async (topic: string, slideCount: number, style: VisualStyle): Promise<{ slides: Partial<Slide>[], hashtags: string[] }> => {
  const isSingle = slideCount === 1;
  const wordCountTarget = isSingle ? "exactly 400" : "under 300";
  
  const prompt = `
    Generate a high-retention social media narrative for: "${topic}".
    Total segments/slides: ${slideCount}.
    Visual Style: ${style}.

    STRICT RULES FOR FACEBOOK POST FORMATTING:
    1. SOUTH PARK RULE: Never use "And then". Use "BUT" (conflict) or "THEREFORE/SO" (consequence) to drive causal momentum.
    2. NARRATIVE DEPTH: The total script MUST be ${wordCountTarget} words.
    3. FACEBOOK OPTIMIZATION:
       - Start with a "HOOK" sentence that stops the scroll.
       - Use strategic emojis (not too many, but enough to guide the eye).
       - Use frequent line breaks and short paragraphs for mobile readability.
       - Use bullet points for key facts or steps if relevant.
       - End with a clear "Engagement Hook" or question to drive comments.
    4. IMAGE PROMPTS: Provide detailed, high-quality image prompts reflecting, and should be of battle scene "${style}".
    5. METADATA: Provide exactly 15 high-reach hashtags.

    Return ONLY a JSON object:
    {
      "slides": [
        { "slideNumber": 1, "text": "...", "imagePrompt": "..." }
      ],
      "hashtags": ["tag1", "tag2", ..., "tag10"]
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                slideNumber: { type: Type.NUMBER },
                text: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["slideNumber", "text", "imagePrompt"]
            }
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["slides", "hashtags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateSlideImage = async (prompt: string, style: VisualStyle, aspectRatio: AspectRatio): Promise<string> => {
  const stylePrefix = {
    [VisualStyle.NEWS]: "Photojournalism, sharp focus, vibrant, realistic, 8k resolution, documentary style. ",
    [VisualStyle.CINEMATIC]: "Cinematic movie scene, anamorphic lighting, moody atmosphere, highly detailed, film grain. ",
    [VisualStyle.MINIMALIST]: "Minimalist aesthetic, soft natural lighting, white space, clean composition, muted colors. "
  }[style];

  const fullPrompt = `${stylePrefix} Subject: ${prompt}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any
      }
    }
  });

  let imageUrl = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) throw new Error("Image generation failed");
  return imageUrl;
};
