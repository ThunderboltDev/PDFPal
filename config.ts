export const isDev = process.env.NODE_ENV === "development";

export const url = isDev
  ? "http://localhost:3000"
  : "https://pdfpal.thunderboltdev.site";

export const config = {
  name: "PDF Pal",
  description:
    "An AI powered web platform that helps you analyze and understand your PDFs instantly. Chat, summarize and get valuable insights effortlessly!",
  url,
  creator: "Thunderbolt",
  themeColor: "#402080",
  gtmId: "GTM-MJ8WM9MT",
  socials: {
    github: "https://github.com/ThunderboltDev",
    discord: "https://discord.com/users/855342398115414037",
    email: "pdfpal0@gmail.com",
  },
  favicon: "/favicon.ico",
  logo: {
    url: "/logo.webp",
    size: 350,
  },
  preview: {
    url: "/preview.webp",
    width: 1200,
    height: 630,
  },
  landing: {
    url: "/landing-page.webp",
    width: 1200,
    height: 630,
  },
  keywords: [
    "PDF pal",
    "PDF chat",
    "PDF reader",
    "PDF tools",
    "document AI",
    "chat with PDF",
    "AI chat for PDF",
    "AI PDF assistant",
    "AI PDF chatbot",
    "AI PDF summarizer",
    "AI PDF analyzer",
    "AI PDF workspace",
    "AI PDF summariser",
    "chat with documents",
    "analyze PDF AI",
    "PDF intelligence",
    "document insights",
  ],
  plans: {
    free: {
      id: "free",
      name: "Free",
      currency: "USD",
      price: {
        monthly: 0,
        yearly: 0,
      },
      productId: {
        monthly: "free",
        yearly: "free",
      },
      maxFileSize: "4MB",
      maxFileSizeInBytes: 4 * 1024 * 1024,
      maxFiles: 5,
      maxPages: 5,
    },
    pro: {
      id: "pro",
      name: "Pro",
      currency: "USD",
      price: {
        monthly: 9.99,
        yearly: 99.99,
      },
      productId: {
        monthly: isDev
          ? "pdt_0NWT8J5GlbOF0F4hv6zaZ"
          : "pdt_0NWT7uXTDvNlkt9faXhxk",
        yearly: isDev
          ? "pdt_0NWT8RhHFSyoZAI9NY3NH"
          : "pdt_0NWT7zVpBTFiroJhvIq6L",
      },
      maxFileSize: "16MB",
      maxFileSizeInBytes: 4 * 1024 * 1024,
      maxFiles: 25,
      maxPages: 25,
    },
  },
} as const;
