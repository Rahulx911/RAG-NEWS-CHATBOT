import express from "express";
import dotenv from "dotenv";
dotenv.config();

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "LOADED" : "NOT LOADED");

import { ingestArticles } from "./newsIngest.js";
import { embedTexts } from "./embeddings.js";
import { initVectorStore, upsertVectors } from "./vectorStore.js";
import { handleUserQuery } from "./ragChat.js";
import { getHistory, clearHistory } from "./redisClient.js";
import { createServer } from "node:http";
import { attachSocket } from "./socketServer.js";

const app = express();
app.use(express.json());

// Setup RAG index once
let articles = [];
let embeddings = [];

async function setup() {
  await initVectorStore();
  articles = await ingestArticles();
  embeddings = await embedTexts(articles.map((a) => a.text));

  const vectors = articles.map((article, idx) => ({
    id: article.id,
    values: embeddings[idx],
    metadata: { text: article.text },
  }));

  await upsertVectors(vectors);
  console.log(`Upserted ${vectors.length} vectors to Pinecone.`);
}
setup().catch(console.error);

// REST: ask question
app.post("/query", async (req, res) => {
  try {
    const { sessionId, question } = req.body || {};
    if (!sessionId || !question) return res.status(400).json({ error: "sessionId and question are required" });
    const answer = await handleUserQuery(sessionId, question);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// REST: get history
app.get("/history/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;
  const hist = await getHistory(sessionId, Number(req.query.limit) || 200);
  res.json({ sessionId, history: hist });
});

// REST: clear history
app.post("/clear/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;
  await clearHistory(sessionId);
  res.json({ ok: true });
});

// Start HTTP + Socket server
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
attachSocket(app, httpServer);
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
