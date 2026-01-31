import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountdownBySlug, getCountdownSlugs } from "@/data/countdowns";
import { getCountdown, getCountdownAnswerText } from "@/lib/countdown";
import { getTodayTurkey, toYYYYMMDD } from "@/lib/date";
import { buildMeta, canonicalUrl } from "@/lib/seo";
import { FAQSchema, BreadcrumbSchema, WebPageSchema } from "@/components/JsonLd";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCountdownSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getCountdownBySlug(slug);
  if (!item) return { title: "Sayfa bulunamadı" };

  const today = getTodayTurkey();
  const result = getCountdown(item, today);
  const path = `/kac-gun-kaldi/${slug}`;

  const title =
    `${item.title} Kaç Gün Kaldı?`.length > 60
      ? `${item.title} Kaç Gün?`
      : `${item.title} Kaç Gün Kaldı?`;
  let description = item.description;
  if (result) {
    const answer = getCountdownAnswerText(result, item.title);
    description = `${answer} ${item.description}`.slice(0, 160);
  } else {
    description = description.slice(0, 160);
  }

  return buildMeta({ title, description, path });
}

export default async function CountdownPage({ params }: Props) {
  const { slug } = await params;
  const item = getCountdownBySlug(slug);
  if (!item) notFound();

  const today = getTodayTurkey();
  const result = getCountdown(item, today);
  const path = `/kac-gun-kaldi/${slug}`;
  const canonical = canonicalUrl(path);

  if (item.type === "user") {
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: "Ana Sayfa", url: canonicalUrl("/") },
            { name: "Kaç Gün Kaldı", url: canonicalUrl("/kac-gun-kaldi") },
            { name: item.title, url: canonical },
          ]}
        />
        <article>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {item.title} kaç gün kaldı?
          </h1>
          <p className="mt-4 text-[var(--color-fg-muted)]">
            {item.description} Kendi tarihinizi hesaplamak için bir tarih
            seçebilir veya doğum günü / askerlik tarihinizi kendiniz
            hesaplayabilirsiniz: hedef tarihten bugünün tarihini çıkararak
            kalan günü bulabilirsiniz.
          </p>
          <p className="mt-4">
            <Link href="/">Popüler sayaclar</Link>
          </p>
        </article>
      </>
    );
  }

  if (!result) notFound();

  const answerText = getCountdownAnswerText(result, item.title);
  const faq = [
    {
      question: `${item.title} kaç gün kaldı?`,
      answer: answerText,
    },
    {
      question: `${item.title} ne zaman?`,
      answer: result.targetDateFormatted,
    },
  ];

  const breadcrumbs = [
    { name: "Ana Sayfa", url: canonicalUrl("/") },
    { name: "Kaç Gün Kaldı", url: canonicalUrl("/") },
    { name: item.title, url: canonical },
  ];

  return (
    <>
      <FAQSchema faq={faq} />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema
        name={`${item.title} Kaç Gün Kaldı?`}
        description={item.description}
        url={canonical}
        dateModified={toYYYYMMDD(today)}
      />

      <article>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {item.title} kaç gün kaldı?
        </h1>

        <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-5 dark:bg-neutral-900">
          <p className="text-xl font-medium" data-answer>
            {result.isToday
              ? `${item.title} bugün.`
              : result.isPast
                ? `${item.title} ${result.targetDateFormatted} tarihinde gerçekleşti.`
                : `${result.daysLeft} gün kaldı.`}
          </p>
          <p className="mt-2 text-[var(--color-fg-muted)]">
            Tarih: {result.targetDateFormatted}
          </p>
        </div>

        <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none">
          <p>{item.description}</p>
          <p>
            {result.isToday
              ? `Bugün ${item.title} günü.`
              : result.isPast
                ? `${item.title} ${result.targetDateFormatted} tarihinde gerçekleşti.`
                : `${item.title} ${result.targetDateFormatted} tarihinde. Kalan süre: ${result.daysLeft} gün.`}
          </p>
        </div>

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
          <Link href="/">Ana sayfa</Link> ·{" "}
          <Link href="/bugun-ne">Bugün ne?</Link> ·{" "}
          <Link href="/her-gun">Her gün</Link>
        </p>
      </article>
    </>
  );
}
