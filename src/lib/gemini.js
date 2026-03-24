import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Converts a standard File or Blob object into a base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Keep only the b64 data, strip the `data:image/...` prefix
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sends a base64 garment image to Gemini Vision to extract estimated measurements.
 */
export const analyzeGarment = async (file) => {
  if (!file) throw new Error("No image provided.");

  try {
    const base64Image = await fileToBase64(file);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: file.type || "image/jpeg",
              }
            },
            {
              text: `You are a master digital tailor for an avant-garde apparel brand. 
              Analyze this garment image and estimate the physical measurements needed to construct it. 
              If the garment does not require a specific measurement (e.g., a shirt doesn't have an inseam), leave it null.
              The output must be strictly valid JSON according to the schema provided.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            Shoulders: { type: Type.INTEGER, description: "Estimated shoulder width in inches" },
            Chest: { type: Type.INTEGER, description: "Estimated chest circumference in inches" },
            Waist: { type: Type.INTEGER, description: "Estimated waist circumference in inches" },
            Hips: { type: Type.INTEGER, description: "Estimated hips circumference in inches" },
            Inseam: { type: Type.INTEGER, description: "Estimated inseam or total length in inches" }
          }
        }
      }
    });

    // The response text is a getter property in the @google/genai SDK
    const resultJson = JSON.parse(response.text);
    return resultJson;

  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    throw error;
  }
};
