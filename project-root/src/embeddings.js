import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: //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",
});

export async function embedTexts(texts) {
  const embeddings = [];
  for (const text of texts) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });
    embeddings.push(response.data[0].embedding);
  }
  return embeddings;
}
