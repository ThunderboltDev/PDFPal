import { InferenceClient } from "@huggingface/inference";
import type { NextRequest } from "next/server";
import z from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pinecone } from "@/lib/pinecone";

if (!process.env.PINECONE_INDEX) {
  throw new Error("env variable PINECONE_INDEX not foud");
}

const pineconeIndex = process.env.PINECONE_INDEX;

const MessageValidator = z.object({
  fileId: z.string(),
  prompt: z.string(),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.userId) return new Response("Unauthorized", { status: 401 });

  const userId = session.userId;
  const body = await req.json();

  const { fileId, prompt } = MessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });

  await db.message.create({
    data: {
      text: prompt,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  const isSubscribed =
    session.user.currentPeriodEnd &&
    new Date(session.user.currentPeriodEnd) > new Date();

  const namespace = pinecone
    .index(pineconeIndex, process.env.PINECONE_HOST_URL)
    .namespace(file.id);

  const searchResults = await namespace.searchRecords({
    query: {
      topK: isSubscribed ? 10 : 5,
      inputs: { text: prompt },
    },
    fields: ["text"],
  });

  const rawMatches = searchResults.result.hits ?? [];

  const contexts: string[] = rawMatches
    .map((match) => {
      return Object.hasOwn(match.fields, "text")
        ? (match.fields as { text: string }).text
        : "";
    })
    .filter(Boolean)
    .slice(0, isSubscribed ? 5 : 3);

  const previousMessages = await db.message.findMany({
    where: {
      fileId,
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: isSubscribed ? 10 : 5,
  });

  const conversationHistory = previousMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const contextMessage = contexts.length
    ? `Use the following context from the PDF to answer the user's question:\n\n${contexts
        .map((context, index) => `Context ${index + 1}:\n${context}`)
        .join("\n\n")}`
    : "No relevant context found in the PDF. Answer based only on the conversation.";

  const systemMessage = [
    "/no_think",
    isSubscribed
      ? "You are a premium assistant with access to deeper reasoning, extended token context, and better PDF comprehension."
      : "You are a standard assistant; stay concise and to the point.",
    "You are an assistant that answers questions about the user's uploaded PDF.",
    "Use the provided context when relevant and be concise. If context does not contain the answer, say you can't find it and offer to search more.",
    "Don't make up false information and keep the response short and concise.",
    "Don't divert away from the PDF topic.",
    "Give a short, direct answer only. Your response should not be larger than 250 words.",
    "Provide your responses using Markdown formatting when applicable. Use headers, lists, code blocks, and links as needed.",
    contextMessage,
  ].join("\n");

  const client = new InferenceClient(process.env.HUGGINGFACEHUB_API_KEY);

  const stream = client.chatCompletionStream({
    provider: "hf-inference",
    model: "HuggingFaceTB/SmolLM3-3B",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      ...conversationHistory,
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: isSubscribed ? 2048 : 256,
  });

  const readable = new ReadableStream({
    async start(controller) {
      let response = "";
      try {
        for await (const chunk of stream) {
          if (chunk.choices && chunk.choices.length > 0) {
            const str = chunk.choices[0].delta.content;
            if (str) {
              response += str;
              controller.enqueue(new TextEncoder().encode(str));
            }
          }
        }

        try {
          await db.message.create({
            data: {
              fileId,
              userId,
              text: response,
              isUserMessage: false,
            },
          });
        } catch (err) {
          console.error("saving response error:", err);
        }

        controller.close();
      } catch (err) {
        console.error("streaming error:", err);
        controller.error(err);
      }
    },

    cancel(reason) {
      console.error("stream cancelled:", reason);
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
