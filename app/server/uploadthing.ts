import { UTApi } from "uploadthing/server";

if (!process.env.UPLOADTHING_TOKEN) {
  throw new Error("env var UPLOADTHING_TOKEN not found");
}

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
  defaultKeyType: "fileKey",
});
