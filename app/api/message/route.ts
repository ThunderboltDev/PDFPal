import { InferenceClient } from "@huggingface/inference";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import z from "zod";
import { db } from "@/db";
import { filesTable, messagesTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { pinecone } from "@/lib/pinecone";

if (!process.env.PINECONE_INDEX) {
  throw new Error("env variable PINECONE_INDEX not found");
}

const pineconeIndex = process.env.PINECONE_INDEX;
const inferenceClient = new InferenceClient(process.env.HUGGINGFACEHUB_API_KEY);

const subscriptionTiers = {
  free: {
    maxTokens: 512,
    maxSearchResults: 5,
    maxContextFragments: 3,
    maxConversationHistory: 5,
  },
  pro: {
    maxTokens: 2048,
    maxSearchResults: 10,
    maxContextFragments: 5,
    maxConversationHistory: 15,
  },
};

const MessageValidator = z.object({
  fileId: z.string(),
  prompt: z.string(),
});

async function streamMessage({
  text,
  fileId,
  userId,
}: {
  text: string;
  fileId: string;
  userId: string;
}) {
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const encoder = new TextEncoder();
        const words = text.split(" ");

        for await (const word of words) {
          controller.enqueue(encoder.encode(`${word} `));
          await new Promise((res) => setTimeout(res, 50));
        }

        try {
          await db.insert(messagesTable).values({
            text,
            fileId,
            userId,
            isUserMessage: false,
          });
        } catch (error) {
          console.error("saving response error:", error);
        }

        controller.close();
      } catch (error) {
        console.error("streamAndSaveMessage error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id)
    return new Response("You are unauthorized.", { status: 401 });

  const userId = session.user.id;
  const body = await req.json();

  const { fileId, prompt } = MessageValidator.parse(body);

  if (prompt.length > 500) {
    return new Response(
      "Question too long. Please keep it under 500 characters.",
      { status: 400 }
    );
  }

  const file = await db.query.files.findFirst({
    where: and(eq(filesTable.id, fileId), eq(filesTable.userId, userId)),
  });

  if (!file) return new Response("File not found.", { status: 404 });

  await db.insert(messagesTable).values({
    text: prompt,
    isUserMessage: true,
    userId,
    fileId,
  });

  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, userId),
    columns: {
      currentPeriodEnd: true,
    },
  });

  const isSubscribed =
    user?.currentPeriodEnd && new Date(user.currentPeriodEnd) > new Date();

  const tierSettings = subscriptionTiers[isSubscribed ? "pro" : "free"];

  const pineconeNamespace = pinecone
    .index(pineconeIndex, process.env.PINECONE_HOST_URL)
    .namespace(file.id);

  const searchResults = await pineconeNamespace.searchRecords({
    query: {
      topK: tierSettings.maxSearchResults,
      inputs: { text: prompt },
    },
    fields: ["text"],
  });

  const searchHits = searchResults.result.hits ?? [];

  const contextFragments: string[] = searchHits
    .map((match) => {
      return Object.hasOwn(match.fields, "text")
        ? (match.fields as { text: string }).text
        : "";
    })
    .filter(Boolean)
    .slice(0, tierSettings.maxContextFragments);

  if (contextFragments.length === 0) {
    const noContextMessage =
      "The information found in your PDF doesn't seem relevant enough to answer this question accurately. Please try rephrasing or ask about specific content in your document.";

    await db.insert(messagesTable).values({
      fileId,
      userId,
      text: noContextMessage,
      isUserMessage: false,
    });

    return streamMessage({
      text: noContextMessage,
      fileId,
      userId,
    });
  }

  const previousMessages = await db.query.messages.findMany({
    where: and(
      eq(messagesTable.fileId, fileId),
      eq(messagesTable.userId, userId)
    ),
    orderBy: asc(messagesTable.createdAt),
    limit: tierSettings.maxConversationHistory,
  });

  const conversationHistory = previousMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const contextInstruction = contextFragments.length
    ? `Use the following context from the PDF to answer the user's question:\n\n${contextFragments
        .map((context, index) => `Context ${index + 1}:\n${context}`)
        .join("\n\n")}`
    : "No relevant context found in the PDF.";

  const systemMessage = [
    "/no_think",
    isSubscribed
      ? "You are a premium assistant with deeper reasoning and extended PDF comprehension."
      : "You are a standard assistant; stay brief and factual.",
    "You MUST ONLY answer questions directly related to the user's uploaded PDF.",
    "If the user's question is not clearly about the PDF or cannot be answered from the provided context, reply exactly with:",
    `"I can only answer questions about the uploaded PDF."`,
    "Do not attempt to interpret, guess, or be creative in such cases.",
    "When context is relevant, give a clear, factual answer using the context below.",
    "If the answer isn't in the context, say you can't find it and suggest a more specific question.",
    "Do not hallucinate or invent details.",
    "Try to keep your responses under 250 words and use Markdown formatting when helpful.",
    contextInstruction,
  ].join("\n");

  const responseStream = inferenceClient.chatCompletionStream({
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
    max_tokens: tierSettings.maxTokens,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      let response = "";
      try {
        for await (const chunk of responseStream) {
          if (chunk.choices && chunk.choices.length > 0) {
            const content = chunk.choices[0].delta.content;
            if (content) {
              response += content;
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        }

        try {
          await db.insert(messagesTable).values({
            fileId,
            userId,
            text: response,
            isUserMessage: false,
          });
        } catch (error) {
          console.error("saving response error:", error);
        }

        controller.close();
      } catch (error) {
        console.error("streaming error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
