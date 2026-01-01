
import { GoogleGenAI, Type } from "@google/genai";

export interface ParsedCommission {
  gross_commission: number;
  broker_split: number;
  team_split: number;
  admin_fees: number;
}

export const parseCommissionStub = async (base64Image: string): Promise<ParsedCommission> => {
  // Use process.env.API_KEY which is expected to be available in the execution environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // Providing multimodal content as a single Content object with parts
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Extract financial details from this real estate commission stub. Return JSON with keys: gross_commission, broker_split, team_split, admin_fees.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gross_commission: { type: Type.NUMBER },
            broker_split: { type: Type.NUMBER },
            team_split: { type: Type.NUMBER },
            admin_fees: { type: Type.NUMBER },
          },
          required: ["gross_commission", "broker_split", "team_split", "admin_fees"],
        },
      },
    });

    // Access .text property directly as per latest guidelines
    const text = response.text;
    if (!text) throw new Error("No data returned from AI");
    
    return JSON.parse(text) as ParsedCommission;
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return {
      gross_commission: 0,
      broker_split: 0,
      team_split: 0,
      admin_fees: 0,
    };
  }
};
