import { useMutation } from "@tanstack/react-query";
import {
	type ChangeEvent,
	createContext,
	type ReactNode,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";

interface StreamResponse {
	handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	addMessage: () => void;
	isLoading: boolean;
	message: string;
}

export const ChatContext = createContext<StreamResponse>({
	handleInputChange: () => {},
	addMessage: () => {},
	isLoading: false,
	message: "",
});

interface ChatContextProviderProps {
	fileId: string;
	children: ReactNode;
}

export default function ChatContextProvider({
	fileId,
	children,
}: ChatContextProviderProps) {
	const [message, setMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const backupMessage = useRef<string>("");

	const utils = trpc.useUtils();

	const { mutate: sendMessage } = useMutation({
		mutationFn: async ({ message }: { message: string }) => {
			const response = await fetch("/api/message", {
				method: "POST",
				body: JSON.stringify({
					fileId,
					prompt: message,
				}),
			});

			if (!response.ok) throw new Error("Failed to send message!");

			return response.body;
		},

		onMutate: async ({ message }) => {
			backupMessage.current = message;
			setMessage("");

			await utils.chat.getFileMessages.cancel();

			const previousMessages = utils.chat.getFileMessages.getInfiniteData();

			utils.chat.getFileMessages.setInfiniteData({ fileId }, (old) => {
				if (!old)
					return {
						pages: [],
						pageParams: [],
					};

				const newPages = [...old.pages];
				const latestPage = newPages[0];

				latestPage.messages = [
					{
						createdAt: new Date(),
						id: crypto.randomUUID(),
						text: message,
						isUserMessage: true,
					},
					...latestPage.messages,
				];

				newPages[0] = latestPage;

				return {
					...old,
					pages: newPages,
				};
			});

			setIsLoading(true);

			return {
				previousMessages: previousMessages?.pages.flatMap(
					(page) => page.messages ?? [],
				),
			};
		},

		onSuccess: async (stream) => {
			setIsLoading(false);

			if (!stream) {
				return toast.error("Something went wrong!");
			}

			const reader = stream.getReader();
			const decoder = new TextDecoder();

			let done = false;

			let response = "";

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;

				const chunk = decoder.decode(value);
				response += chunk;

				utils.chat.getFileMessages.setInfiniteData({ fileId }, (old) => {
					if (!old)
						return {
							pages: [],
							pageParams: [],
						};

					const isResponseCreated = old.pages.some((page) =>
						page.messages.some((message) => message.id === "ai-response"),
					);

					const updatedPages = old.pages.map((page) => {
						if (page === old.pages[0]) {
							let updatedMessages: {
								id: string;
								createdAt: Date;
								text: string;
								isUserMessage: boolean;
							}[];

							if (isResponseCreated) {
								updatedMessages = page.messages.map((message) => {
									if (message.id === "ai-response") {
										return { ...message, text: response };
									}
									return message;
								});
							} else {
								updatedMessages = [
									{
										createdAt: new Date(),
										id: "ai-response",
										text: response,
										isUserMessage: false,
									},
									...page.messages,
								];
							}

							return {
								...page,
								messages: updatedMessages,
							};
						}

						return page;
					});
					return {
						...old,
						pages: updatedPages,
					};
				});
			}
		},

		onError: (_error, _var, context) => {
			setMessage(backupMessage.current);
			utils.chat.getFileMessages.setData(
				{ fileId },
				{ messages: context?.previousMessages ?? [], nextCursor: undefined },
			);
		},

		onSettled: async () => {
			setIsLoading(false);
			await utils.chat.getFileMessages.invalidate({ fileId });
		},
	});

	const handleInputChange = (_e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(_e.target.value);
	};

	const addMessage = () => sendMessage({ message });

	return (
		<ChatContext.Provider
			value={{
				handleInputChange,
				addMessage,
				isLoading,
				message,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
