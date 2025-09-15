import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = createClient({ url });

redis.on("error", (err) => console.error("Redis error:", err));
await redis.connect();

const k = (sid) => `chat:${sid}`;

export async function appendMessage(sessionId, role, text) {
  const item = JSON.stringify({ role, text, ts: Date.now() });
  await redis.rPush(k(sessionId), item);
  // Keep last N messages per session (change via env if needed)
  const N = Number(process.env.CHAT_HISTORY_MAX || 200);
  await redis.lTrim(k(sessionId), -N, -1);
}

export async function getHistory(sessionId, limit = 50) {
  const arr = await redis.lRange(k(sessionId), -limit, -1);
  return arr.map((s) => JSON.parse(s));
}

export async function clearHistory(sessionId) {
  await redis.del(k(sessionId));
}
