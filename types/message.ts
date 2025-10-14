import type { inferRouterOutputs } from "@trpc/server";
import type { JSX } from "react";
import type { AppRouter } from "@/trpc";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["chat"]["getFileMessages"]["messages"];

type OmitText = Omit<Messages[number], "text" | "createdAt">;

type ExtendedText = {
	text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;
