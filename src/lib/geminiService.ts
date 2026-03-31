import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the API key is passed correctly. In Vite it's from import.meta.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export type AIPredictionResult = {
  role: string;
  confidence: number;
  relatedRoles: string[];
  tips: string[];
};

export const predictRoleWithAI = async (
  name: string,
  education: string,
  skills: string[],
  certifications: string[],
  softSkills: string[]
): Promise<AIPredictionResult> => {
  if (!genAI) {
    throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `You are an expert career counselor AI. 
Based on the following profile:
Name: ${name || "Anonymous"}
Education: ${education}
Hard Skills: ${skills.join(", ")}
Certifications: ${certifications.length > 0 ? certifications.join(", ") : "None"}
Soft Skills: ${softSkills.length > 0 ? softSkills.join(", ") : "None"}

Predict the single best job role for this person, provide a confidence score out of 100, list 3 related alternative roles, and provide 3 actionable career tips.
Respond STRICTLY in the following JSON format without any markdown wrappers or additional text:
{
  "role": "Job Role Name",
  "confidence": 85,
  "relatedRoles": ["Role 1", "Role 2", "Role 3"],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Sometimes the model might wrap the JSON in markdown blocks
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText) as AIPredictionResult;
  } catch (error: any) {
    console.error("Error predicting with Gemini:", error);
    throw new Error(error.message || "Failed to fetch AI prediction.");
  }
};
