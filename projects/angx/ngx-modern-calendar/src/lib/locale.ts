/** A weekday, positioned by `priority` (1 = first column of the grid). */
export interface CalendarDay {
  longName: string;
  symbol: string;
  /** 1-7, where 1 is the leftmost column of the calendar grid. */
  priority: number;
}

export interface CalendarLocale {
  direction: 'ltr' | 'rtl';
  /** Month names, January first. */
  months: readonly string[];
  /** Exactly seven weekdays. */
  days: readonly CalendarDay[];
  /**
   * Weekday the grid starts on, using the JavaScript convention where 0 is
   * Sunday. Must line up with the `days` ordering. Defaults to Monday.
   */
  firstDayOfWeek?: number;
}

/** A date the calendar should treat as selectable, with optional payload. */
export interface AvailableDate {
  /** ISO `YYYY-MM-DD`. */
  date: string;
  [key: string]: unknown;
}

/** A weekday the calendar should treat as selectable, with optional payload. */
export interface AvailableWeekDay {
  /**
   * Either 0-6 (`Date.prototype.getDay`, 0 = Sunday) or the weekday's
   * `longName` as spelled in the active locale.
   */
  day: number | string;
  [key: string]: unknown;
}

/** Emitted when the user picks a date. */
export interface CalendarSelection {
  /** The selected date, at local midnight. */
  date: Date;
  /** Payload from the matching `availableDates` / `availableWeekDays` entry. */
  data?: AvailableDate | AvailableWeekDay;
}
