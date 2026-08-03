import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NgxModernCalendarComponent,
  type AvailableWeekDay,
  type CalendarSelection,
} from '@angx/ngx-modern-calendar';

const LANGUAGES = ['en', 'es', 'fr', 'he', 'hi'] as const;

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, NgxModernCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly languages = LANGUAGES;
  readonly language = signal<string>('en');

  /** Multi-select: clicking a date toggles it in and out of the list. */
  readonly selectedDates = signal<Date[]>([new Date()]);
  readonly lastSelection = signal<CalendarSelection | null>(null);

  /** Only weekends are selectable in the filtered example. */
  readonly weekends: AvailableWeekDay[] = [
    { day: 0, label: 'Sunday slot' },
    { day: 6, label: 'Saturday slot' },
  ];

  onLanguageChange(event: Event): void {
    this.language.set((event.target as HTMLSelectElement).value);
  }

  onDateSelected(selection: CalendarSelection): void {
    this.lastSelection.set(selection);
    this.selectedDates.update((dates) => {
      const time = selection.date.getTime();
      const without = dates.filter((date) => date.getTime() !== time);
      return without.length === dates.length ? [...dates, selection.date] : without;
    });
  }
}
