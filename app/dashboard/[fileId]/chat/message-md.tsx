"use client";

import { Check, Copy } from "lucide-react";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useState, useCallback, type ReactNode } from "react";
import rehypeHighlight from "rehype-highlight";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { Button } from "@/components/ui/button";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
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
                size="icon"
                variant="ghost"
                className={`absolute top-2 right-2 z-10 size-7 bg-muted/75 backdrop-blur-sm text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity`}
                onClick={() => copyToClipboard(codeText)}
                aria-label={isCopied ? "Code copied!" : "Copy code"}
              >
                {isCopied ? <Check className="text-green-500" /> : <Copy />}
              </Button>

              <div className="overflow-auto rounded-lg">
                <SyntaxHighlighter
                  language={language}
                  PreTag="div"
                  showLineNumbers
                  wrapLines
                  style={oneDark}
                  customStyle={{ margin: 0 }}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
