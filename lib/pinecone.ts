import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
	throw new Error("env variable PINECONE_API_KEY not found");
}

export const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY,
});
