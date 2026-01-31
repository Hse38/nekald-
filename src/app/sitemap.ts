import { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";
import { getCountdownSlugs } from "@/data/countdowns";
import { dateRange } from "@/lib/date-range";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nekaldi.com";
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: canonicalUrl("/bugun-ne"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: canonicalUrl("/her-gun"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const countdownPages: MetadataRoute.Sitemap = getCountdownSlugs().map((slug) => ({
    url: canonicalUrl(`/kac-gun-kaldi/${slug}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const start = new Date(now.getFullYear() - 1, 0, 1);
  const end = new Date(now.getFullYear() + 2, 11, 31);
  const dates = dateRange(start, end);
  const dayPages: MetadataRoute.Sitemap = dates.map((date) => ({
    url: canonicalUrl(`/her-gun/${date}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...countdownPages, ...dayPages];
}
