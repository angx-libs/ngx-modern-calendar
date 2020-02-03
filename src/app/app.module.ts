import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxModernCalendarModule } from 'projects/angx/ngx-modern-calendar/src/public-api';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxModernCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
