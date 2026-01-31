const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nekaldi.com";

export function canonicalUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  noIndex?: boolean;
  openGraph?: { type?: string; image?: string };
}

export function buildMeta(page: PageSeo) {
  const canonical = canonicalUrl(page.path);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical ?? canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "Nekaç Gün Kaldı",
      locale: "tr_TR",
      type: page.openGraph?.type ?? "website",
      images: page.openGraph?.image ? [{ url: page.openGraph.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: page.noIndex ? { index: false, follow: true } : undefined,
  };
}
