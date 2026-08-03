import type { CalendarLocale } from './locale';

export const engLocale: CalendarLocale = {
  direction: 'ltr',
  firstDayOfWeek: 1,
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  days: [
    { longName: 'Monday', symbol: 'M', priority: 1 },
    { longName: 'Tuesday', symbol: 'T', priority: 2 },
    { longName: 'Wednesday', symbol: 'W', priority: 3 },
    { longName: 'Thursday', symbol: 'T', priority: 4 },
    { longName: 'Friday', symbol: 'F', priority: 5 },
    { longName: 'Saturday', symbol: 'S', priority: 6 },
    { longName: 'Sunday', symbol: 'S', priority: 7 },
  ],
};
