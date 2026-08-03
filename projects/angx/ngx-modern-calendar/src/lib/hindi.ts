import type { CalendarLocale } from './locale';

export const hiLocale: CalendarLocale = {
  direction: 'ltr',
  firstDayOfWeek: 1,
  months: [
    'जनवरी',
    'फ़रवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितंबर',
    'अक्टूबर',
    'नवंबर',
    'दिसंबर',
  ],
  days: [
    { longName: 'सोमवार', symbol: 'सोम', priority: 1 },
    { longName: 'मंगलवार', symbol: 'मंगल', priority: 2 },
    { longName: 'बुधवार', symbol: 'बुध', priority: 3 },
    { longName: 'गुरुवार', symbol: 'गुरु', priority: 4 },
    { longName: 'शुक्रवार', symbol: 'शुक्र', priority: 5 },
    { longName: 'शनिवार', symbol: 'शनि', priority: 6 },
    { longName: 'रविवार', symbol: 'रवि', priority: 7 },
  ],
};
