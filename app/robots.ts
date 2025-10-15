import type { MetadataRoute } from "next";
import config from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/check-email",
        "/auth-callback",
        "/dashboard/",
        "/api/",
        "/server/",
        "/static/",
        "/_next/",
      ],
    },
    sitemap: `${config.url}/sitemap.xml`,
    host: config.url,
  };
}
