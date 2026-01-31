import Link from "next/link";
import {
  getTodayTurkey,
  formatDateTR,
  getDayNameTR,
  toYYYYMMDD,
} from "@/lib/date";
import {
  isOfficialHoliday,
  getHolidayForDate,
  getIslamicEventForDate,
} from "@/data/holidays";
import { countdowns, topCountdownSlugs } from "@/data/countdowns";
import { getCountdown, type CountdownResult } from "@/lib/countdown";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { canonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

export default function HomePage() {
  const today = getTodayTurkey();
  const dateStr = toYYYYMMDD(today);
  const holiday = getHolidayForDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  const islamic = getIslamicEventForDate(dateStr);
  const isHoliday = isOfficialHoliday(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  const topCountdowns = topCountdownSlugs
    .map((slug) => countdowns.find((c) => c.slug === slug))
    .filter(Boolean);

  const countdownResults = topCountdowns.map((item) => {
    if (!item) return null;
    const result = getCountdown(item, today);
    return result ? { item, result } : null;
  }).filter((x): x is { item: (typeof countdowns)[0]; result: CountdownResult } => x != null);

  const breadcrumbs = [
    { name: "Ana Sayfa", url: canonicalUrl("/") },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <article>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Bugün ne?
        </h1>

        <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-5 dark:bg-neutral-900">
          <p className="text-lg">
            <strong>Bugün {formatDateTR(today)}</strong>, {getDayNameTR(today)}.
          </p>
          <ul className="mt-3 space-y-1 text-[var(--color-fg-muted)]">
            {isHoliday && holiday && (
              <li>Resmi tatil: {holiday.name}</li>
            )}
            {!isHoliday && (
              <li>Bugün resmi tatil değil.</li>
            )}
            {holiday && !holiday.isHoliday && (
              <li>Özel gün: {holiday.name}</li>
            )}
            {islamic && (
              <li>{islamic.isKandil ? "Kandil" : "Özel gün"}: {islamic.name}</li>
            )}
          </ul>
        </div>

        <p className="mt-4 text-[var(--color-fg-muted)]">
          Detaylı bilgi: <Link href="/bugun-ne">Bugün ne? sayfası</Link>.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Kaç gün kaldı?</h2>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            En çok aranan sayaclar.
          </p>
          <ul className="mt-4 space-y-2">
            {countdownResults.map(({ item, result }) => (
              <li key={item.slug}>
                <Link
                  href={`/kac-gun-kaldi/${item.slug}`}
                  className="flex items-center justify-between rounded border border-[var(--color-border)] bg-white px-4 py-3 dark:bg-neutral-900"
                >
                  <span>{item.title}</span>
                  <span className="font-medium text-[var(--color-accent)]">
                    {result.isToday ? "Bugün" : result.isPast ? "Geçti" : `${result.daysLeft} gün`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Tüm sayaclar</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {countdowns.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/kac-gun-kaldi/${c.slug}`}
                  className="rounded bg-[var(--color-border)] px-3 py-1.5 text-sm hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
          <Link href="/her-gun">Her gün için sayfa</Link> — Takvim üzerinden
          geçmiş ve gelecek günlere bakın.
        </p>
      </article>
    </>
  );
}
