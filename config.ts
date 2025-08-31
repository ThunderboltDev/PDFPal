const url = "https://something.vercel.app";

const config = {
  name: "SaaS",
  abbr: "SS",
  id: "saas",
  description: "Cool!",
  url: url,
  author: "Surprized Pikachu",
  themeColor: "#00aaff",
  gtag: "G-",
  adsense: "",
  socials: {
    github: "",
    youtube: "",
    twitter: "@surprizedPika",
    linkedIn: "",
    discord: "",
    email: "programmer80101@gmail.com",
    bluesky: "surprizedpika.bsky.social",
  },
  assets: {
    favicon: `${url}favicon.ico`,
    logo: `${url}/logo.png`,
    logoSize: 350,
    preview: `${url}/preview.png`,
    previewWidth: 1200,
    previewHeight: 628,
  },
  keywords: [
    "form builder",
    "form creator",
    "survey tool",
    "quiz maker",
    "data collection",
    "online forms",
    "custom forms",
    "form templates",
    "form analytics",
    "form sharing",
    "form integration",
    "user-friendly forms",
    "responsive forms",
    "secure forms",
    "collaborative forms",
  ],
  plans: [
    {
      name: "free",
      price: 0,
      currency: "USD",
      interval: "month",
      productId: "free",
    },
    {
      name: "pro",
      price: 9.99,
      currency: "USD",
      interval: "month",
      productId: "prod_4ZtlEyxvUyIIMxSraQ7ZcT",
    },
  ],
} as const;

export const CREEM_API_BASE =
  process.env.CREEM_TEST_MODE === "true"
    ? "https://test-api.creem.io/v1"
    : "https://api.creem.io/v1";

export default config;
