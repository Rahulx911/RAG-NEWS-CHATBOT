import { appendMessage, getHistory } from "./redisClient.js";
import { embedTexts } from "./embeddings.js";
import { queryTopK } from "./vectorStore.js";
import { callGeminiAPI } from "./geminiApi.js";

function historyToContext(turns, maxChars = 2000) {
  const lines = turns.map((t) => `${t.role}: ${t.text}`);
  let acc = [];
  let total = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    total += lines[i].length + 1;
    if (total > maxChars) break;
    acc.unshift(lines[i]);
  }
  return acc.join("\n");
}

export async function handleUserQuery(sessionId, question) {
  await appendMessage(sessionId, "user", question);

  const qEmb = (await embedTexts([question]));
  const docs = await queryTopK(qEmb, 5);
  const docContext = docs.map((d) => d.metadata.text).join("\n\n");

  const turns = await getHistory(sessionId, 20);
  const chatContext = historyToContext(turns);

  const finalContext = `Chat history:\n${chatContext}\n\nRelevant documents:\n${docContext}`;

  const answer = await callGeminiAPI(question, [finalContext]);

  await appendMessage(sessionId, "assistant", answer);
  return answer;
}
