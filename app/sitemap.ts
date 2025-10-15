import type { MetadataRoute } from "next";
import config from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    {
      path: "",
      priority: 1.0,
      changefreq: "monthly",
    },
    {
      path: "dashboard",
      priority: 1.0,
      changefreq: "monthly",
    },
    {
      path: "account",
      priority: 0.85,
      changefreq: "monthly",
    },
    {
      path: "auth",
      priority: 0.6,
      changefreq: "monthly",
    },
    {
      path: "pricing",
      priority: 0.6,
      changefreq: "monthly",
    },
    {
      path: "faq",
      priority: 0.6,
      changefreq: "monthly",
    },
    {
      path: "contact",
      priority: 0.3,
      changefreq: "monthly",
    },
    {
      path: "billing",
      priority: 0.3,
      changefreq: "monthly",
    },
    {
      path: "logout",
      priority: 0.2,
      changefreq: "monthly",
    },
    {
      path: "cookie-policy",
      priority: 0.2,
      changefreq: "yearly",
    },
    {
      path: "privacy-policy",
      priority: 0.2,
      changefreq: "yearly",
    },
    {
      path: "terms-of-service",
      priority: 0.2,
      changefreq: "yearly",
    },
  ];

  return pages.map((page) => ({
    url: `${config.url}/${page.path}`,
    priority: page.priority,
    changefreq: page.changefreq,
    lastModified: new Date().toISOString(),
  }));
}
