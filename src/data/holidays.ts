/** Turkish official holidays and special days (Gregorian). Month 1-12, day 1-31. */
export interface HolidayItem {
  month: number;
  day: number;
  name: string;
  isHoliday: boolean;
  isKandil?: boolean;
}

export const turkishHolidays: HolidayItem[] = [
  { month: 1, day: 1, name: "Yılbaşı", isHoliday: true },
  { month: 4, day: 23, name: "Ulusal Egemenlik ve Çocuk Bayramı", isHoliday: true },
  { month: 5, day: 1, name: "Emek ve Dayanışma Günü", isHoliday: true },
  { month: 5, day: 19, name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", isHoliday: true },
  { month: 7, day: 15, name: "Demokrasi ve Milli Birlik Günü", isHoliday: true },
  { month: 8, day: 30, name: "Zafer Bayramı", isHoliday: true },
  { month: 10, day: 29, name: "Cumhuriyet Bayramı", isHoliday: true },
  { month: 2, day: 14, name: "Sevgililer Günü", isHoliday: false },
  { month: 3, day: 8, name: "Dünya Kadınlar Günü", isHoliday: false },
  { month: 5, day: 10, name: "Anneler Günü", isHoliday: false },
  { month: 6, day: 21, name: "Babalar Günü", isHoliday: false },
];

/** Islamic holidays (approximate Gregorian dates for 2025–2026; in production use hijri lib or API). */
export const islamicHolidays2026: { name: string; date: string; isKandil?: boolean }[] = [
  { name: "Mevlid Kandili", date: "2025-09-04", isKandil: true },
  { name: "Regaip Kandili", date: "2026-01-29", isKandil: true },
  { name: "Miraç Kandili", date: "2026-02-27", isKandil: true },
  { name: "Berat Kandili", date: "2026-03-28", isKandil: true },
  { name: "Ramazan Başlangıcı", date: "2026-03-01" },
  { name: "Kadir Gecesi", date: "2026-03-27", isKandil: true },
  { name: "Ramazan Bayramı 1. Gün", date: "2026-03-31" },
  { name: "Kurban Bayramı 1. Gün", date: "2026-06-06" },
];

export function getHolidayForDate(year: number, month: number, day: number): HolidayItem | undefined {
  return turkishHolidays.find((h) => h.month === month && h.day === day);
}

export function isOfficialHoliday(year: number, month: number, day: number): boolean {
  const h = getHolidayForDate(year, month, day);
  return h?.isHoliday ?? false;
}

export function getIslamicEventForDate(dateStr: string): { name: string; isKandil?: boolean } | undefined {
  return islamicHolidays2026.find((e) => e.date === dateStr);
}
