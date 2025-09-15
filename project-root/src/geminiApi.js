import fetch from "node-fetch";
import { getAccessToken } from "./authServiceAccount.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function callGeminiAPI(question, contexts) {
  const accessToken = await getAccessToken();
  const promptText = `Question: ${question}\nContext:\n${contexts.join("\n")}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ],
  };

  const resp = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error("Gemini API error: " + (await resp.text()));
  }

  const data = await resp.json();

  // Safely read text from candidates[0].content.parts[*].text
  const candidates = (data && data.candidates) || [];
  const first = candidates.length > 0 ? candidates[0] : null;
  const content = first && first.content ? first.content : null;
  const parts = content && Array.isArray(content.parts) ? content.parts : [];
  const text = parts.map(p => (typeof p.text === "string" ? p.text : "")).join("\n").trim();

  return text || "No answer generated";
}
