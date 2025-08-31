import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

import { InferenceClient } from "@huggingface/inference";

import { MessageValidator } from "./message-validation";
import { pinecone } from "@/lib/pinecone";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) return new Response("Unauthorized", { status: 401 });

  const userId = user.id;
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

  const namespace = pinecone
    .index(process.env.PINECONE_INDEX!, process.env.PINECONE_HOST_URL)
    .namespace(file.id);

  const searchResults = await namespace.searchRecords({
    query: {
      topK: 3,
      inputs: { text: prompt },
    },
    fields: ["text"],
  });

  const rawMatches = searchResults.result.hits ?? [];

  const contexts: string[] = rawMatches
    .map((match) => {
      // @ts-expect-error text will always exist on field coz that's what we are searching
      if (match.fields && typeof match.fields.text) return match.fields.text;
    })
    .filter(Boolean)
    .slice(0, 3);

  const previousMessages = await db.message.findMany({
    where: {
      fileId,
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 5,
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
    "You are an assistant that answers questions about the user's uploaded PDF.",
    "Use the provided context when relevant and be concise. If context does not contain the answer, say you can't find it and offer to search more.",
    "Don't make up false information and keep the response short and concise.",
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
    temperature: 0.7,
    max_tokens: 512,
    stream: true,
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
      console.log("stream cancelled:", reason);
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
