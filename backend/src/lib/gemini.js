import { ENV } from "./env.js";

const GEMINI_MODEL = ENV.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";

const buildPrompt = (conversation) => {
  const systemInstruction =
    "You are ChatAI inside a real-time chat app. Reply like a friendly human chat partner in concise plain text. Keep responses useful, safe, and natural. Avoid markdown unless asked.";

  const transcript = conversation
    .map((entry) => `${entry.role === "user" ? "User" : "ChatAI"}: ${entry.text}`)
    .join("\n");

  return `${systemInstruction}\n\nConversation:\n${transcript}\nChatAI:`;
};

export const generateChatAIReply = async (conversation) => {
  const apiKey = ENV.GEMINI_API_KEY;
  if (!apiKey) {
    return "I am ready to chat, but the AI key is not configured on the server yet.";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(conversation) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 300,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim() || "";

  return text || "I am here. Tell me more.";
};
