const url = "https://something.vercel.app";

const config = {
  name: "PDF Pal",
  id: "saas",
  description: "Cool!",
  url: url,
  author: "Thunderbolt",
  themeColor: "#00aaff",
  gtag: "G-",
  adsense: "",
  socials: {
    github: "",
    youtube: "",
    twitter: "@surprizedPika",
    linkedIn: "",
    discord: "",
    email: "thunderbolt3141592@gmail.com",
    bluesky: "surprizedpika.bsky.social",
  },
  assets: {
    favicon: `${url}favicon.ico`,
    logo: `${url}/logo.webp`,
    logoSize: 350,
    preview: `${url}/preview.webp`,
    previewWidth: 1200,
    previewHeight: 628,
  },
  keywords: [
    "chat with pdf",
    "ai pdf assistant",
    "ai pdf chatbot",
    "ai pdf summarizer",
    "ai pdf analyzer",
  ],
  plans: {
    free: {
      id: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      interval: "month",
      productId: "free",
      maxFileSize: "4MB",
      maxFileSizeInBytes: 4 * 1024 * 1024,
      maxFiles: 5,
      maxPages: 5,
    },
    pro: {
      id: "pro",
      name: "Pro",
      price: 9.99,
      currency: "USD",
      interval: "month",
      productId: "prod_4ZtlEyxvUyIIMxSraQ7ZcT",
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
