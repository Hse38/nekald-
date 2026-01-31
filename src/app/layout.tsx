import type { Metadata } from "next";
import "./globals.css";
import { canonicalUrl } from "@/lib/seo";

const siteName = "Nekaç Gün Kaldı";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nekaldi.com"),
  title: {
    default: "Bugün Ne? Kaç Gün Kaldı? | Nekaç Gün Kaldı",
    template: `%s | ${siteName}`,
  },
  description:
    "Bugün hangi gün, bugün ne oldu, resmi tatil mi? Ramazan, YKS, seçim, okul açılışı gibi önemli tarihlere kaç gün kaldı? Hızlı ve güvenilir cevaplar.",
  keywords: [
    "bugün ne",
    "kaç gün kaldı",
    "bugün hangi gün",
    "resmi tatil",
    "Ramazan",
    "YKS",
    "okul açılışı",
  ],
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    siteName,
    locale: "tr_TR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <header className="border-b border-[var(--color-border)] bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <a href="/" className="text-lg font-semibold">
              {siteName}
            </a>
            <nav className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-fg-muted)]">
              <a href="/">Ana Sayfa</a>
              <a href="/bugun-ne">Bugün Ne?</a>
              <a href="/kac-gun-kaldi/ramazan">Ramazan</a>
              <a href="/kac-gun-kaldi/yks">YKS</a>
              <a href="/her-gun">Her Gün</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-fg-muted)]">
          <div className="mx-auto max-w-3xl px-4">
            <a href="/">Nekaç Gün Kaldı</a> — Bugün ne, kaç gün kaldı sorularına
            hızlı cevap.
          </div>
        </footer>
      </body>
    </html>
  );
}
