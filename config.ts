const url = "https://pdf-pal-pro.vercel.app";

const config = {
  name: "PDF Pal",
  id: "saas",
  description:
    "A web platform that lets you to interact with your PDFs using AI. Summarize, chat or get valuable insights instantly!",
  url,
  creator: "Thunderbolt",
  themeColor: "#402080",
  gtag: "GTM-MJ8WM9MT",
  socials: {
    github: "https://github.com/ThunderboltDev",
    discord: "https://discord.com/",
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
        monthly: "prod_4ZtlEyxvUyIIMxSraQ7ZcT",
        yearly: "prod_7G9AC88XkORnOM3vNiS3m4",
      },
      maxFileSize: "16MB",
      maxFileSizeInBytes: 4 * 1024 * 1024,
      maxFiles: 25,
      maxPages: 25,
    },
  },
} as const;

export const CREEM_API_BASE =
  process.env.CREEM_TEST_MODE === "true"
    ? "https://test-api.creem.io/v1"
    : "https://api.creem.io/v1";

export default config;
