import z from "zod/v4";

export const MessageValidator = z.object({
  fileId: z.string(),
  prompt: z.string(),
});
