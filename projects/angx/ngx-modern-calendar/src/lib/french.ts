import type { CalendarLocale } from './locale';

export const frLocale: CalendarLocale = {
  direction: 'ltr',
  firstDayOfWeek: 1,
  months: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
  days: [
    { longName: 'lundi', symbol: 'lu', priority: 1 },
    { longName: 'mardi', symbol: 'ma', priority: 2 },
    { longName: 'mercredi', symbol: 'me', priority: 3 },
    { longName: 'jeudi', symbol: 'je', priority: 4 },
    { longName: 'vendredi', symbol: 've', priority: 5 },
    { longName: 'samedi', symbol: 'sa', priority: 6 },
    { longName: 'dimanche', symbol: 'di', priority: 7 },
  ],
};
