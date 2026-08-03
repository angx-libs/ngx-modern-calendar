import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  addMonths,
  daysInMonth,
  leadingBlankCount,
  startOfDay,
  startOfMonth,
  toDateKey,
} from './date-utils';
import { engLocale } from './english';
import { frLocale } from './french';
import { heLocale } from './hebrew';
import { hiLocale } from './hindi';
import { esLocale } from './spanish';
import type {
  AvailableDate,
  AvailableWeekDay,
  CalendarDay,
  CalendarLocale,
  CalendarSelection,
} from './locale';

const BUILT_IN_LOCALES: Readonly<Record<string, CalendarLocale>> = {
  en: engLocale,
  es: esLocale,
  fr: frLocale,
  he: heLocale,
  hi: hiLocale,
};

const DEFAULT_FIRST_DAY_OF_WEEK = 1;

/** One cell of the month grid. `date` is null for the leading blanks. */
interface CalendarCell {
  key: string;
  date: Date | null;
  dayOfMonth: number;
  selectable: boolean;
  selected: boolean;
  today: boolean;
  data?: AvailableDate | AvailableWeekDay;
}

@Component({
  selector: 'modern-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modern-calendar" [attr.dir]="direction()">
      <div class="modern-calendar__header">
        <button
          type="button"
          class="modern-calendar__nav modern-calendar__nav--previous"
          [attr.aria-label]="previousMonthLabel()"
          (click)="goToPreviousMonth()"
        ></button>

        <div class="modern-calendar__label" aria-live="polite">{{ monthLabel() }}</div>

        <button
          type="button"
          class="modern-calendar__nav modern-calendar__nav--next"
          [attr.aria-label]="nextMonthLabel()"
          (click)="goToNextMonth()"
        ></button>
      </div>

      <div class="modern-calendar__week">
        @for (weekday of weekdays(); track weekday.priority) {
          <span [attr.title]="weekday.longName" [attr.aria-label]="weekday.longName">
            {{ weekday.symbol }}
          </span>
        }
      </div>

      <div class="modern-calendar__body">
        @for (cell of cells(); track cell.key) {
          @if (cell.date) {
            <button
              type="button"
              class="modern-calendar__date"
              [class.modern-calendar__date--selected]="cell.selected"
              [class.modern-calendar__date--today]="cell.today"
              [disabled]="!cell.selectable"
              [attr.aria-pressed]="cell.selected"
              [attr.aria-current]="cell.today ? 'date' : null"
              (click)="select(cell)"
            >
              <span>{{ cell.dayOfMonth }}</span>
            </button>
          } @else {
            <span class="modern-calendar__date modern-calendar__date--blank" aria-hidden="true"></span>
          }
        }
      </div>
    </div>
  `,
  styleUrl: './ngx-modern-calendar.component.css',
})
export class NgxModernCalendarComponent {
  /** Built-in locale code: `en`, `es`, `fr`, `he` or `hi`. Unknown codes fall back to `en`. */
  readonly language = input('en');

  /** Supply a full locale to go beyond the built-in five. Wins over `language`. */
  readonly locale = input<CalendarLocale | null>(null);

  /** Dates to render as selected. */
  readonly selectedDates = input<readonly Date[]>([]);

  /** Restrict selectable days to `availableDates` / `availableWeekDays`. */
  readonly datesFilter = input(false);

  /** Allow selecting days before today. */
  readonly pastDates = input(true);

  /** Specific selectable dates, used when `datesFilter` is on. */
  readonly availableDates = input<readonly AvailableDate[]>([]);

  /** Selectable weekdays, used when `datesFilter` is on. */
  readonly availableWeekDays = input<readonly AvailableWeekDay[]>([]);

  /** Override the locale's first day of week (0 = Sunday). */
  readonly firstDayOfWeek = input<number | null>(null);

  /** Emits the picked date together with any payload attached to it. */
  readonly dateSelected = output<CalendarSelection>();

  /** Emits the first of the month whenever the visible month changes. */
  readonly monthChanged = output<Date>();

  /** First of the currently displayed month. */
  private readonly viewDate = signal(startOfMonth(new Date()));

  private readonly today = startOfDay(new Date());

  private readonly activeLocale = computed(
    () => this.locale() ?? BUILT_IN_LOCALES[this.language()] ?? engLocale,
  );

  protected readonly direction = computed(() => this.activeLocale().direction ?? 'ltr');

  protected readonly weekdays = computed<readonly CalendarDay[]>(() =>
    [...this.activeLocale().days].sort((a, b) => a.priority - b.priority),
  );

  private readonly weekStart = computed(() => {
    const override = this.firstDayOfWeek();
    const configured = override ?? this.activeLocale().firstDayOfWeek ?? DEFAULT_FIRST_DAY_OF_WEEK;
    return ((configured % 7) + 7) % 7;
  });

  protected readonly monthLabel = computed(() => {
    const view = this.viewDate();
    return `${this.activeLocale().months[view.getMonth()]} ${view.getFullYear()}`;
  });

  protected readonly previousMonthLabel = computed(() => this.adjacentMonthLabel(-1));
  protected readonly nextMonthLabel = computed(() => this.adjacentMonthLabel(1));

  private readonly selectedKeys = computed(
    () => new Set(this.selectedDates().map((date) => toDateKey(date))),
  );

  private readonly availableDatesByKey = computed(
    () => new Map(this.availableDates().map((entry) => [entry.date, entry])),
  );

  protected readonly cells = computed<readonly CalendarCell[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const blanks = leadingBlankCount(view, this.weekStart());
    const total = daysInMonth(year, month);

    const cells: CalendarCell[] = [];
    for (let index = 0; index < blanks; index++) {
      cells.push({
        key: `blank-${year}-${month}-${index}`,
        date: null,
        dayOfMonth: 0,
        selectable: false,
        selected: false,
        today: false,
      });
    }

    for (let dayOfMonth = 1; dayOfMonth <= total; dayOfMonth++) {
      const date = new Date(year, month, dayOfMonth);
      const key = toDateKey(date);
      const data = this.matchAvailability(date, key);
      cells.push({
        key,
        date,
        dayOfMonth,
        selectable: this.isSelectable(date, data),
        selected: this.selectedKeys().has(key),
        today: date.getTime() === this.today.getTime(),
        data,
      });
    }

    return cells;
  });

  /** Move the visible month. Positive moves forward. */
  goToMonth(offset: number): void {
    const next = addMonths(this.viewDate(), offset);
    this.viewDate.set(next);
    this.monthChanged.emit(next);
  }

  goToPreviousMonth(): void {
    this.goToMonth(-1);
  }

  goToNextMonth(): void {
    this.goToMonth(1);
  }

  /** Jump the view to the month containing `date`. */
  showMonthOf(date: Date): void {
    const next = startOfMonth(date);
    this.viewDate.set(next);
    this.monthChanged.emit(next);
  }

  protected select(cell: CalendarCell): void {
    if (!cell.date || !cell.selectable) {
      return;
    }
    this.dateSelected.emit({ date: cell.date, data: cell.data });
  }

  private adjacentMonthLabel(offset: number): string {
    const target = addMonths(this.viewDate(), offset);
    return `${this.activeLocale().months[target.getMonth()]} ${target.getFullYear()}`;
  }

  private matchAvailability(date: Date, key: string): AvailableDate | AvailableWeekDay | undefined {
    const weekday = this.availableWeekDays().find((entry) => this.matchesWeekDay(entry, date));
    return weekday ?? this.availableDatesByKey().get(key);
  }

  /** `day` may be a 0-6 index or the weekday's `longName` in the active locale. */
  private matchesWeekDay(entry: AvailableWeekDay, date: Date): boolean {
    if (typeof entry.day === 'number') {
      return entry.day === date.getDay();
    }
    const columnIndex = (date.getDay() - this.weekStart() + 7) % 7;
    return entry.day === this.weekdays()[columnIndex]?.longName;
  }

  private isSelectable(date: Date, data: AvailableDate | AvailableWeekDay | undefined): boolean {
    if (!this.pastDates() && date.getTime() < this.today.getTime()) {
      return false;
    }
    return this.datesFilter() ? data !== undefined : true;
  }
}
