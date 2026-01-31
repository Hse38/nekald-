import { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = canonicalUrl("/");
  return {
    rules: { userAgent: "*", allow: "/", disallow: [] },
    sitemap: `${base}sitemap.xml`,
  };
}
