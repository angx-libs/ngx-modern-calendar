import type { CalendarLocale } from './locale';

export const heLocale: CalendarLocale = {
  direction: 'rtl',
  // The Hebrew week starts on Sunday.
  firstDayOfWeek: 0,
  months: [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ],
  days: [
    { longName: 'רִאשׁוֹן', symbol: 'א', priority: 1 },
    { longName: 'יוֹם שֵׁנִי', symbol: 'ב', priority: 2 },
    { longName: 'יוֹם שְׁלִישִׁי', symbol: 'ג', priority: 3 },
    { longName: 'יוֹם רְבִיעִי', symbol: 'ד', priority: 4 },
    { longName: 'יוֹם חֲמִישִׁי', symbol: 'ה', priority: 5 },
    { longName: 'יוֹם שִׁישִׁי', symbol: 'ו', priority: 6 },
    { longName: 'יוֹם שַׁבָּת', symbol: 'ש', priority: 7 },
  ],
};
