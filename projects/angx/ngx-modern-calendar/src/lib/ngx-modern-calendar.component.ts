import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { engLocale } from './english';
import { frLocale } from './french';
import { heLocale } from './hebrew';
import { hiLocale } from './hindi';
import { ModernCalendar } from './ModernCalendar';
import { esLocale } from './spanish';

@Component({
  standalone: true,
  selector: 'modern-calendar',
  template: `<div id="modernCalendar" class="modern-calendar"></div>`,
  styleUrls: ['./ngx-modern-calendar.component.css']
})
export class NgxModernCalendarComponent implements OnInit, OnChanges {

  private calendar!: ModernCalendar;
  @Input() selectedDates!: Date[];
  @Input() language!: string;
  localization: any;
  constructor() { }

  ngOnInit() {
    switch (this.language) {
      case 'en': {
        this.localization = engLocale;
        break;
      }
      case 'he': {
        this.localization = heLocale;
        break;
      }
      case 'fr': {
        this.localization = frLocale;
        break;
      }
      case 'es': {
        this.localization = esLocale;
        break;
      }
      case 'hi': {
        this.localization = hiLocale;
        break;
      }
      default: {
        this.localization = engLocale;
        break;
      }
    }
    this.calendar = new ModernCalendar({
      selector: '#modernCalendar',
      localeData: this.localization
    });
    this.calendar.init();
  }

  ngOnChanges() {
    setTimeout(() => {
      if (this.calendar && this.selectedDates && this.selectedDates.length > 0) {
        this.calendar.selectDates(this.selectedDates);
      }
    });
  }

}
