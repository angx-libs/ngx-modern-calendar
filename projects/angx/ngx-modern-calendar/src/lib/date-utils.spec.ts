import { describe, expect, it } from 'vitest';
import { addMonths, daysInMonth, leadingBlankCount, toDateKey } from './date-utils';

describe('toDateKey', () => {
  it('formats in local time with padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toDateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('does not shift the day near midnight the way toISOString would', () => {
    const justAfterMidnight = new Date(2026, 2, 1, 0, 30);
    expect(toDateKey(justAfterMidnight)).toBe('2026-03-01');
  });
});

describe('addMonths', () => {
  it('crosses year boundaries', () => {
    expect(toDateKey(addMonths(new Date(2026, 0, 1), -1))).toBe('2025-12-01');
    expect(toDateKey(addMonths(new Date(2026, 11, 1), 1))).toBe('2027-01-01');
  });

  it('does not overflow from a 31 day month into the wrong month', () => {
    // `new Date(2026, 2, 31).setMonth(1)` lands in March, not February.
    expect(toDateKey(addMonths(new Date(2026, 2, 31), -1))).toBe('2026-02-01');
  });
});

describe('daysInMonth', () => {
  it('handles leap years', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2026, 1)).toBe(28);
  });

  it('handles 30 and 31 day months', () => {
    expect(daysInMonth(2026, 3)).toBe(30);
    expect(daysInMonth(2026, 6)).toBe(31);
  });
});

describe('leadingBlankCount', () => {
  // 1 March 2026 is a Sunday.
  const march2026 = new Date(2026, 2, 1);

  it('puts a Sunday first in a Sunday-start locale', () => {
    expect(leadingBlankCount(march2026, 0)).toBe(0);
  });

  it('offsets a Sunday by six in a Monday-start locale', () => {
    // The previous implementation used `getDay() * 14.28%` regardless of the
    // locale, which shifted every Monday-first month by one column.
    expect(leadingBlankCount(march2026, 1)).toBe(6);
  });

  it('stays within a single week for every weekday', () => {
    for (let day = 1; day <= 31; day++) {
      for (let weekStart = 0; weekStart < 7; weekStart++) {
        const blanks = leadingBlankCount(new Date(2026, 0, day), weekStart);
        expect(blanks).toBeGreaterThanOrEqual(0);
        expect(blanks).toBeLessThanOrEqual(6);
      }
    }
  });
});
