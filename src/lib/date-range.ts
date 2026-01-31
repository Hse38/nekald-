import { addDays, toYYYYMMDD } from "./date";

/** Generate YYYY-MM-DD strings from start to end (inclusive). */
export function dateRange(start: Date, end: Date): string[] {
  const out: string[] = [];
  let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (d <= endDate) {
    out.push(toYYYYMMDD(d));
    d = addDays(d, 1);
  }
  return out;
}
