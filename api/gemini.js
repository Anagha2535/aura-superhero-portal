import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API Key. Ensure GEMINI_API_KEY or GOOGLE_API_KEY is configured in the environment." });
  }

  try {
    const data = req.body;
    
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'x-goog-api-key': apiKey
        }
      }
    });

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction: data.systemInstruction
      },
      history: data.contents || []
    });

    const result = await chat.sendMessage({ message: data.message });
    res.status(200).json({ text: result.text });
  } catch (e) {
    const status = e.status || 500;
    const googleError = e.errorDetails ? e.errorDetails : e.message;
    console.error("Gemini API Error:", {
      status: status,
      message: e.message,
      details: googleError,
      model: "gemini-3.6-flash"
    });
    res.status(status).json({ error: e.message, model: "gemini-3.6-flash" });
  }
}
