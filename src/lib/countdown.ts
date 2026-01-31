import type { CountdownItem } from "@/data/countdowns";
import { getIslamicTargetDate } from "@/data/islamic-dates";
import {
  getTodayTurkey,
  parseYYYYMMDD,
  daysBetween,
  getYearForTarget,
  toYYYYMMDD,
} from "./date";

export interface CountdownResult {
  daysLeft: number;
  targetDate: string;
  targetDateFormatted: string;
  isToday: boolean;
  isPast: boolean;
  label: string;
}

const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatTargetDate(dateStr: string): string {
  const d = parseYYYYMMDD(dateStr);
  return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function getCountdown(item: CountdownItem, today: Date = getTodayTurkey()): CountdownResult | null {
  let targetDateStr: string | null = null;

  if (item.type === "fixed" && item.date) {
    targetDateStr = item.date;
  } else if (item.type === "yearly" && item.month != null && item.day != null) {
    const y = getYearForTarget(today, item.month, item.day);
    const m = String(item.month).padStart(2, "0");
    const d = String(item.day).padStart(2, "0");
    targetDateStr = `${y}-${m}-${d}`;
  } else if (item.type === "islamic" && item.yearKey) {
    targetDateStr = getIslamicTargetDate(item.yearKey, today.getFullYear());
    if (!targetDateStr) {
      targetDateStr = getIslamicTargetDate(item.yearKey, today.getFullYear() + 1);
    }
  }
  // "user" type: no fixed target; page shows calculator/explanation

  if (!targetDateStr) {
    return null;
  }

  const target = parseYYYYMMDD(targetDateStr);
  const daysLeft = daysBetween(today, target);
  const isToday = daysLeft === 0;
  const isPast = daysLeft < 0;

  return {
    daysLeft: Math.max(0, daysLeft),
    targetDate: targetDateStr,
    targetDateFormatted: formatTargetDate(targetDateStr),
    isToday,
    isPast,
    label: item.title,
  };
}

export function getCountdownAnswerText(result: CountdownResult, title: string): string {
  if (result.isToday) return `${title} bugün.`;
  if (result.isPast) return `${title} ${result.targetDateFormatted} tarihinde gerçekleşti.`;
  if (result.daysLeft === 1) return `${title} yarına. 1 gün kaldı.`;
  return `${title} ${result.daysLeft} gün sonra, ${result.targetDateFormatted} tarihinde. ${result.daysLeft} gün kaldı.`;
}
