import Link from "next/link";
import type { Metadata } from "next";
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
import { buildMeta, canonicalUrl } from "@/lib/seo";
import { FAQSchema, BreadcrumbSchema, WebPageSchema } from "@/components/JsonLd";

export const revalidate = 3600;

const PATH = "/bugun-ne";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Bugün Ne? Bugün Hangi Gün, Resmi Tatil mi?",
    description:
      "Bugün hangi gün, bugün ne oldu, bugün resmi tatil mi, bugün kandil mi? Güncel tarih ve özel gün bilgisi.",
    path: PATH,
  }),
};

export default function BugunNePage() {
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

  const faq = [
    {
      question: "Bugün hangi gün?",
      answer: `Bugün ${formatDateTR(today)}, ${getDayNameTR(today)}.`,
    },
    {
      question: "Bugün resmi tatil mi?",
      answer: isHoliday && holiday
        ? `Evet. Bugün ${holiday.name} resmi tatil.`
        : "Hayır. Bugün resmi tatil değil.",
    },
    {
      question: "Bugün kandil mi?",
      answer: islamic?.isKandil
        ? `Evet. Bugün ${islamic.name}.`
        : islamic
          ? `Bugün ${islamic.name}.`
          : "Bugün kandil değil.",
    },
    {
      question: "Bugün ne oldu?",
      answer: `Bugün ${formatDateTR(today)}. ${holiday ? `Özel/tatil: ${holiday.name}.` : ""} ${islamic ? `Dini gün: ${islamic.name}.` : ""}`.trim(),
    },
  ];

  const breadcrumbs = [
    { name: "Ana Sayfa", url: canonicalUrl("/") },
    { name: "Bugün Ne?", url: canonicalUrl(PATH) },
  ];

  const canonical = canonicalUrl(PATH);
  const published = "2025-01-01";
  const modified = dateStr;

  return (
    <>
      <FAQSchema faq={faq} />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema
        name="Bugün Ne? Bugün Hangi Gün, Resmi Tatil mi?"
        description="Bugün hangi gün, bugün ne oldu, bugün resmi tatil mi? Güncel bilgi."
        url={canonical}
        datePublished={published}
        dateModified={modified}
      />

      <article>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Bugün ne?
        </h1>

        <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-5 dark:bg-neutral-900">
          <p className="text-lg">
            <strong>Bugün {formatDateTR(today)}</strong>, {getDayNameTR(today)}.
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Resmi tatil:</strong>{" "}
              {isHoliday && holiday ? holiday.name : "Hayır."}
            </li>
            {holiday && !holiday.isHoliday && (
              <li>
                <strong>Özel gün:</strong> {holiday.name}
              </li>
            )}
            {islamic && (
              <li>
                <strong>{islamic.isKandil ? "Kandil" : "Dini gün"}:</strong>{" "}
                {islamic.name}
              </li>
            )}
          </ul>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Sık sorulan sorular</h2>
          <dl className="mt-4 space-y-4">
            {faq.map((item) => (
              <div key={item.question}>
                <dt className="font-medium">{item.question}</dt>
                <dd className="mt-1 text-[var(--color-fg-muted)]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-8">
          <Link href="/">Ana sayfaya dön</Link> ·{" "}
          <Link href="/kac-gun-kaldi/ramazan">Ramazan kaç gün kaldı?</Link>
        </p>
      </article>
    </>
  );
}
