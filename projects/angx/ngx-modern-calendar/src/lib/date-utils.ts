/** Stable `YYYY-MM-DD` key in local time. `toISOString` would shift the day. */
export function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Midnight on the first of `date`'s month. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Midnight on the same day, dropping any time component. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Shifts by whole months without the end-of-month overflow that
 * `setMonth` has (31 March minus one month would otherwise land in March).
 */
export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Number of blank cells before the first of the month, given the weekday the
 * grid starts on. Always 0-6.
 */
export function leadingBlankCount(firstOfMonth: Date, firstDayOfWeek: number): number {
  return (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;
}
