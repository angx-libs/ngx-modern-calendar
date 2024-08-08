import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxModernCalendarComponent } from '../../projects/angx/ngx-modern-calendar/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxModernCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedDates = [new Date()];
  title = 'ngx-modern-calendar';
}
