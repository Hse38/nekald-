/** Approximate Gregorian dates for Islamic events (Ramazan start, Kurban 1st day). Update yearly. */
export const islamicEventDates: Record<string, Record<string, string>> = {
  ramazan: {
    "2025": "2025-02-28",
    "2026": "2026-02-18",
    "2027": "2027-02-08",
  },
  kurban: {
    "2025": "2025-06-06",
    "2026": "2026-05-27",
    "2027": "2027-05-16",
  },
};

export function getIslamicTargetDate(yearKey: string, year: number): string | null {
  const key = String(year);
  return islamicEventDates[yearKey]?.[key] ?? null;
}
