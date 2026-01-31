export type CountdownType = "fixed" | "yearly" | "islamic" | "user";

export interface CountdownItem {
  slug: string;
  title: string;
  description: string;
  type: CountdownType;
  date?: string;
  month?: number;
  day?: number;
  yearKey?: string;
  searchKeywords: string[];
}

import countdownsJson from "./countdowns.json";

export const countdowns: CountdownItem[] = countdownsJson as CountdownItem[];

export function getCountdownBySlug(slug: string): CountdownItem | undefined {
  return countdowns.find((c) => c.slug === slug);
}

export function getCountdownSlugs(): string[] {
  return countdowns.map((c) => c.slug);
}

/** Top countdowns for homepage (most searched). */
export const topCountdownSlugs = [
  "ramazan",
  "yks",
  "secim",
  "okul-acilisi",
  "yilbasi",
  "kurban-bayrami",
  "valentine",
  "cumhuriyet",
];
