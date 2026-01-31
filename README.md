# Nekaç Gün Kaldı

Türkçe, SEO odaklı “Bugün ne?” ve “X’e kaç gün kaldı?” platformu.

## Teknoloji

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Server Components, SSG/ISR

## Çalıştırma

```bash
npm install
npm run dev
```

Üretim:

```bash
npm run build
npm start
```

## Yapı

- `/` — Ana sayfa (bugün özeti + sayaclar)
- `/bugun-ne` — Bugün ne? detay + SSS
- `/kac-gun-kaldi/[slug]` — Sayac sayfaları (Ramazan, YKS, seçim vb.)
- `/her-gun` — Takvim navigasyonu
- `/her-gun/[date]` — Günlük sayfa (YYYY-MM-DD)

## Yeni sayaç ekleme

`src/data/countdowns.json` dosyasına yeni nesne ekleyin:

- `slug`: URL parçası (örn. `ramazan`)
- `title`: Görünen başlık
- `description`: Meta açıklama
- `type`: `fixed` | `yearly` | `islamic` | `user`
- `date`: Sabit tarih (YYYY-MM-DD, type: fixed)
- `month` / `day`: Yıllık tekrarlayan (type: yearly)
- `yearKey`: İslami takvim anahtarı (type: islamic), `src/data/islamic-dates.ts` içinde tanımlı olmalı
- `searchKeywords`: Arama anahtar kelimeleri

İslami tarihler için `src/data/islamic-dates.ts` içine yeni yıl/tarih ekleyin.

## Ortam

- `NEXT_PUBLIC_SITE_URL`: Canonical ve OG URL (örn. `https://nekaldi.com`)
