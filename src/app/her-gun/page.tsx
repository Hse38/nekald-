import Link from "next/link";
import type { Metadata } from "next";
import { getTodayTurkey, toYYYYMMDD, addDays, formatDateTR, getDayNameTR } from "@/lib/date";
import { buildMeta, canonicalUrl } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 3600;

const PATH = "/her-gun";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Her Gün — Tarih ve Gün Sayfaları",
    description:
      "Her gün için ayrı sayfa. Bugün, dün, yarın ve istediğiniz tarihin gün adı, resmi tatil ve özel gün bilgisi.",
    path: PATH,
  }),
};

export default function HerGunPage() {
  const today = getTodayTurkey();
  const todayStr = toYYYYMMDD(today);
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  const quickLinks = [
    { date: yesterday, label: "Dün" },
    { date: today, label: "Bugün" },
    { date: tomorrow, label: "Yarın" },
  ];

  const breadcrumbs = [
    { name: "Ana Sayfa", url: canonicalUrl("/") },
    { name: "Her Gün", url: canonicalUrl(PATH) },
  ];

  const currentYear = today.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <article>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Her gün
        </h1>
        <p className="mt-2 text-[var(--color-fg-muted)]">
          Tarih seçerek o güne ait sayfaya gidin: gün adı, resmi tatil ve özel
          gün bilgisi.
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Hızlı erişim</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {quickLinks.map(({ date, label }) => (
              <li key={label}>
                <Link
                  href={`/her-gun/${toYYYYMMDD(date)}`}
                  className={`rounded border px-4 py-2 ${
                    label === "Bugün"
                      ? "border-[var(--color-accent)] bg-blue-50 font-medium dark:bg-blue-950"
                      : "border-[var(--color-border)] bg-white dark:bg-neutral-900"
                  }`}
                >
                  {label} — {formatDateTR(date)}, {getDayNameTR(date)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">{currentYear} takvimi</h2>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            Aya tıklayarak o ayın günlerini listeleyebilir veya doğrudan tarih
            yazarak sayfaya gidebilirsiniz.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {months.map((month) => {
              const firstDay = new Date(currentYear, month - 1, 1);
              const monthStr = String(month).padStart(2, "0");
              const href = `/her-gun/${currentYear}-${monthStr}-01`;
              const monthNames = [
                "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
              ];
              return (
                <li key={month}>
                  <Link
                    href={href}
                    className="block rounded border border-[var(--color-border)] bg-white px-3 py-2 text-center dark:bg-neutral-900"
                  >
                    {monthNames[month - 1]} {currentYear}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Diğer yıllar</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <li key={y}>
                <Link
                  href={`/her-gun/${y}-01-01`}
                  className="rounded border border-[var(--color-border)] bg-white px-3 py-1.5 dark:bg-neutral-900"
                >
                  {y}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8">
          <Link href="/">Ana sayfa</Link> · <Link href="/bugun-ne">Bugün ne?</Link>
        </p>
      </article>
    </>
  );
}
