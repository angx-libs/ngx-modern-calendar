import type { CalendarLocale } from './locale';

export const esLocale: CalendarLocale = {
  direction: 'ltr',
  firstDayOfWeek: 1,
  months: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  days: [
    { longName: 'lunes', symbol: 'lu', priority: 1 },
    { longName: 'martes', symbol: 'ma', priority: 2 },
    { longName: 'miércoles', symbol: 'mi', priority: 3 },
    { longName: 'jueves', symbol: 'ju', priority: 4 },
    { longName: 'viernes', symbol: 'vi', priority: 5 },
    { longName: 'sábado', symbol: 'sá', priority: 6 },
    { longName: 'domingo', symbol: 'do', priority: 7 },
  ],
};
