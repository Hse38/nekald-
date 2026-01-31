import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  parseYYYYMMDD,
  formatDateTR,
  getDayNameTR,
  toYYYYMMDD,
  addDays,
} from "@/lib/date";
import { dateRange } from "@/lib/date-range";
import {
  getHolidayForDate,
  isOfficialHoliday,
  getIslamicEventForDate,
} from "@/data/holidays";
import { buildMeta, canonicalUrl } from "@/lib/seo";
import { BreadcrumbSchema, WebPageSchema, FAQSchema } from "@/components/JsonLd";

export const revalidate = 86400;

const START_YEAR = 2024;
const END_YEAR = 2028;
const START_DATE = new Date(START_YEAR, 0, 1);
const END_DATE = new Date(END_YEAR, 11, 31);

function isValidDateStr(s: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

type Props = { params: Promise<{ date: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year - 1, 0, 1);
  const end = new Date(year + 1, 11, 31);
  const dates = dateRange(start, end);
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date: dateStr } = await params;
  if (!isValidDateStr(dateStr)) return { title: "Geçersiz tarih" };

  const date = parseYYYYMMDD(dateStr);
  const path = `/her-gun/${dateStr}`;
  const fullTitle = `${formatDateTR(date)} — ${getDayNameTR(date)}`;
  const title = fullTitle.length > 60 ? `${dateStr} ${getDayNameTR(date)}` : fullTitle;
  const description = `${formatDateTR(date)} hangi gün? ${getDayNameTR(date)}. Resmi tatil mi, özel gün mü?`.slice(0, 160);

  return buildMeta({ title, description, path });
}

export default async function DayPage({ params }: Props) {
  const { date: dateStr } = await params;
  if (!isValidDateStr(dateStr)) notFound();

  const date = parseYYYYMMDD(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const holiday = getHolidayForDate(year, month, day);
  const islamic = getIslamicEventForDate(dateStr);
  const isHoliday = isOfficialHoliday(year, month, day);

  const path = `/her-gun/${dateStr}`;
  const canonical = canonicalUrl(path);

  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, 1);

  const faq = [
    {
      question: `${formatDateTR(date)} hangi gün?`,
      answer: `${formatDateTR(date)} ${getDayNameTR(date)}.`,
    },
    {
      question: `${formatDateTR(date)} resmi tatil mi?`,
      answer:
        isHoliday && holiday
          ? `Evet. ${formatDateTR(date)} ${holiday.name} resmi tatil.`
          : `Hayır. ${formatDateTR(date)} resmi tatil değil.`,
    },
  ];

  const breadcrumbs = [
    { name: "Ana Sayfa", url: canonicalUrl("/") },
    { name: "Her Gün", url: canonicalUrl("/her-gun") },
    { name: formatDateTR(date), url: canonical },
  ];

  return (
    <>
      <FAQSchema faq={faq} />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema
        name={`${formatDateTR(date)} — ${getDayNameTR(date)}`}
        description={`${formatDateTR(date)} hangi gün? ${getDayNameTR(date)}. Resmi tatil ve özel gün bilgisi.`}
        url={canonical}
        datePublished={dateStr}
        dateModified={dateStr}
      />

      <article>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {formatDateTR(date)} — {getDayNameTR(date)}
        </h1>

        <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-5 dark:bg-neutral-900">
          <p className="text-lg">
            <strong>{formatDateTR(date)}</strong>, {getDayNameTR(date)}.
          </p>
          <ul className="mt-3 space-y-1 text-[var(--color-fg-muted)]">
            <li>
              Resmi tatil: {isHoliday && holiday ? holiday.name : "Hayır."}
            </li>
            {holiday && !holiday.isHoliday && (
              <li>Özel gün: {holiday.name}</li>
            )}
            {islamic && (
              <li>
                {islamic.isKandil ? "Kandil" : "Dini gün"}: {islamic.name}
              </li>
            )}
          </ul>
        </div>

        <nav className="mt-6 flex flex-wrap gap-4" aria-label="Önceki / sonraki gün">
          <Link
            href={`/her-gun/${toYYYYMMDD(prevDate)}`}
            className="rounded border border-[var(--color-border)] bg-white px-4 py-2 dark:bg-neutral-900"
          >
            ← {formatDateTR(prevDate)}
          </Link>
          <Link
            href={`/her-gun/${toYYYYMMDD(nextDate)}`}
            className="rounded border border-[var(--color-border)] bg-white px-4 py-2 dark:bg-neutral-900"
          >
            {formatDateTR(nextDate)} →
          </Link>
        </nav>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Sık sorulan sorular</h2>
          <dl className="mt-3 space-y-3">
            {faq.map((q) => (
              <div key={q.question}>
                <dt className="font-medium">{q.question}</dt>
                <dd className="mt-1 text-[var(--color-fg-muted)]">{q.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-8">
          <Link href="/her-gun">Her gün takvimi</Link> ·{" "}
          <Link href="/">Ana sayfa</Link> ·{" "}
          <Link href="/bugun-ne">Bugün ne?</Link>
        </p>
      </article>
    </>
  );
}
