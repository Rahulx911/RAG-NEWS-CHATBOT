import { Pinecone } from "@pinecone-database/pinecone";

let pineconeIndex;

export async function initVectorStore() {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  // get index by name
  pineconeIndex = client.index(process.env.PINECONE_INDEX_NAME);
}

export async function upsertVectors(vectors) {
  await pineconeIndex.upsert(vectors);
}

export async function queryTopK(embedding, topK = 5) {
  const queryResponse = await pineconeIndex.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });
  return queryResponse.matches;
}
