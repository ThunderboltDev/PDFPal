export type Feature = { text: string; footnote?: string; negative?: boolean };

export type PricingItem = {
  plan: string;
  tagline: string;
  quota: number;
  price: number;
  features: Feature[];
};

export const pricingItems: PricingItem[] = [
  {
    plan: "Free",
    tagline: "For small side projects.",
    quota: 5,
    price: 0,
    features: [
      {
        text: "5 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "4MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      { text: "Mobile-friendly interface" },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        negative: true,
      },
      { text: "Priority support", negative: true },
    ],
  },
  {
    plan: "Pro",
    tagline: "For larger projects with higher needs.",
    quota: 25,
    price: 9.99,
    features: [
      {
        text: "25 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "16MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      { text: "Mobile-friendly interface" },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
      },
      { text: "Priority support" },
    ],
  },
];
