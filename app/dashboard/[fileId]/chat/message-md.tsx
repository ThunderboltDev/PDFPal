"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Check, Copy } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

function extractTextFromNode(node: ReactNode): string {
  if (node == null) return "";

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("");
  }

  if (typeof node === "object" && node !== null) {
    if (
      "props" in node &&
      node.props &&
      typeof node.props === "object" &&
      "children" in node.props
    ) {
      return extractTextFromNode(node.props.children as ReactNode);
    }

    if ("children" in node) {
      return extractTextFromNode(node.children as ReactNode);
    }
  }

  return "";
}

interface MessageMarkdownProps {
  children: string;
}

export default function MessageMarkdown({ children }: MessageMarkdownProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(async (code: string) => {
    navigator.clipboard.writeText(code);

    sendGTMEvent({
      event: "chat-action",
      value: 1,
      action_name: "copy-code",
    });

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  return (
    <ReactMarkdown
      components={{
        pre({ children }) {
          return (
            <div className="relative my-3 overflow-hidden rounded-lg border border-border">
              {children}
            </div>
          );
        },
        code({ className, children }) {
          const languageMatch = /language-(\w+)/.exec(className || "");
          const language = languageMatch?.[1] || "";
          const codeText = extractTextFromNode(children).replace(/\n$/, "");

          return (
            <div className="group relative">
              <Button
                aria-label={isCopied ? "Code copied!" : "Copy code"}
                className={
                  "absolute top-2 right-2 z-10 size-7 bg-muted-foreground/25 text-background opacity-0 backdrop-blur-sm transition-all hover:bg-muted-foreground/75 hover:text-muted group-hover:opacity-100"
                }
                onClick={() => copyToClipboard(codeText)}
                size="icon"
                variant="ghost"
              >
                {isCopied ? <Check className="text-green-500" /> : <Copy />}
              </Button>

              <div className="*:scrollbar-1.5 overflow-auto rounded-lg">
                <SyntaxHighlighter
                  customStyle={{ margin: 0 }}
                  language={language}
                  PreTag="div"
                  showLineNumbers
                  style={oneDark}
                  wrapLines
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        },
      }}
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
}
