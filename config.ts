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
} as const;

export default config;
