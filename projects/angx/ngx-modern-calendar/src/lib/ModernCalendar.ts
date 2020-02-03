export class ModernCalendar {

    private element: any;
    private selectedDates: Date[];
    private localeData: any;

    private opts = {
        selector: null,
        datesFilter: false,
        pastDates: true,
        availableWeekDays: [],
        availableDates: [],
        date: new Date(),
        todaysDate: new Date(),
        button_prev: null,
        button_next: null,
        month: null,
        month_label: null,
        onSelect: (data: any, elem: any) => { },
        months: [],
        shortWeekday: [],
        direction: 'ltr'
    };

    constructor(options?: any) {
        for (const k in options) {
            if (this.opts.hasOwnProperty(k)) {
                this.opts[k] = options[k];
            }
        }
        this.localeData = options.localeData;
        this.element = document.querySelector(this.opts.selector);
        this.opts.months = Object.keys(this.localeData.months).map((k) => this.localeData.months[k]);
        this.opts.shortWeekday = this.localeData.days.sort((d1, d2) => d1.priority - d2.priority).map((d) => d.symbol);
        this.opts.direction = this.localeData.direction;
        this.init();
    }


    private addEvent = (el: any, type: any, handler: any) => {
        if (!el) {
            return;
        }
        if (el.attachEvent) {
            el.attachEvent('on' + type, handler);
        } else {
            el.addEventListener(type, handler);
        }
    }

    private removeEvent = (el: any, type: any, handler: any) => {
        if (!el) {
            return;
        }
        if (el.detachEvent) {
            el.detachEvent('on' + type, handler);
        } else {
            el.removeEventListener(type, handler);
        }
    }

    private getWeekDay = (day: string) => {
        return this.localeData.days.sort((d1, d2) => d1.priority - d2.priority).map((d) => d.longName)[day];
    }

    private createDay = (date: Date) => {
        const newDayElem = document.createElement('div');
        const dateElem = document.createElement('span');
        dateElem.innerHTML = date.getDate().toString();
        newDayElem.className = 'modern-calendar-date';
        newDayElem.setAttribute('data-calendar-date', date.toDateString());

        const availableWeekDay = this.opts.availableWeekDays.filter(f => f.day === date.getDay() ||
            f.day === this.getWeekDay(date.getDay().toString()));
        const availableDate = this.opts.availableDates.filter(f => f.date === (date.getFullYear() +
            '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')));

        if (date.getDate() === 1) {
            if (this.opts.direction === 'rtl') {
                newDayElem.style.marginRight = ((date.getDay()) * 14.28) + '%';
            } else {
                newDayElem.style.marginLeft = ((date.getDay()) * 14.28) + '%';
            }
        }
        if (this.opts.date.getTime() <= this.opts.todaysDate.getTime() - 1 && !this.opts.pastDates) {
            newDayElem.classList.add('modern-calendar-date--disabled');
        } else {
            if (this.opts.datesFilter) {
                if (availableWeekDay.length) {
                    newDayElem.classList.add('modern-calendar-date--active');
                    newDayElem.setAttribute('data-calendar-data', JSON.stringify(availableWeekDay[0]));
                    newDayElem.setAttribute('data-calendar-status', 'active');
                } else if (availableDate.length) {
                    newDayElem.classList.add('modern-calendar-date--active');
                    newDayElem.setAttribute('data-calendar-data', JSON.stringify(availableDate[0]));
                    newDayElem.setAttribute('data-calendar-status', 'active');
                } else {
                    newDayElem.classList.add('modern-calendar-date--disabled');
                }
            } else {
                newDayElem.classList.add('modern-calendar-date--active');
                newDayElem.setAttribute('data-calendar-status', 'active');
            }
        }
        if (date.toString() === this.opts.todaysDate.toString()) {
            newDayElem.classList.add('modern-calendar-date--today');
        }

        newDayElem.appendChild(dateElem);
        this.opts.month.appendChild(newDayElem);
    }

    private removeActiveClass = () => {
        document.querySelectorAll('.modern-calendar-date--selected').forEach(s => {
            s.classList.remove('modern-calendar-date--selected');
        });
    }

    private createMonth = () => {
        this.clearCalendar();
        const currentMonth = this.opts.date.getMonth();
        while (this.opts.date.getMonth() === currentMonth) {
            this.createDay(this.opts.date);
            this.opts.date.setDate(this.opts.date.getDate() + 1);
        }

        this.opts.date.setDate(1);
        this.opts.date.setMonth(this.opts.date.getMonth() - 1);
        this.opts.month_label.innerHTML = this.opts.months[this.opts.date.getMonth()] + ' ' + this.opts.date.getFullYear();
        // selectDate();
    }

    private selectDate = () => {
        const activeDates = this.element.querySelectorAll('[data-calendar-status=active]');
        activeDates.forEach(date => {
            date.addEventListener('click', (event) => {
                const datas = event.dataset;
                const data = {} as any;
                if (datas.calendarDate) {
                    data.date = datas.calendarDate;
                }
                if (datas.calendarData) {
                    data.data = JSON.parse(datas.calendarData);
                }
                this.opts.onSelect(data, this);
                event.target.classList.add('modern-calendar-date--selected');
            });
        });
    }

    public selectDates = (dates: Date[]) => {
        this.selectedDates = dates;
        this.removeActiveClass();
        dates.forEach((date: Date) => {
            if (date.getMonth() === this.opts.date.getMonth() && date.getFullYear() === this.opts.date.getFullYear()) {
                this.element.querySelector('[data-calendar-date="' + date.toDateString() + '"]')
                    .classList.add('modern-calendar-date--selected');
            }
        });
    }

    private monthPrev = () => {
        this.opts.date.setMonth(this.opts.date.getMonth() - 1);
        this.createMonth();
        setTimeout(() => {
            // tslint:disable-next-line:no-unused-expression
            this.selectedDates && this.selectDates.length > 0 ? this.selectDates(this.selectedDates) : null;
        }, 100);
    }

    private monthNext = () => {
        this.opts.date.setMonth(this.opts.date.getMonth() + 1);
        this.createMonth();
        setTimeout(() => {
            // tslint:disable-next-line:no-unused-expression
            this.selectedDates && this.selectDates.length > 0 ? this.selectDates(this.selectedDates) : null;
        }, 100);
    }

    private clearCalendar = () => {
        this.opts.month.innerHTML = '';
    }

    private createCalendar = () => {
        const direction = this.opts.direction ? this.opts.direction : 'ltr';
        document.querySelector(this.opts.selector).innerHTML = `
            <div class="modern-calendar-header">
                <i class="modern-calendar-btn left-btn" data-calendar-toggle="previous"></i>
                <div class="modern-calendar-header__label col-10" data-calendar-label="month"></div>
                <i class="modern-calendar-btn right-btn" data-calendar-toggle="next"></i>
            </div>
            <div class="modern-calendar-week" style="direction:${direction}"></div>
            <div class="modern-calendar-body" style="direction:${direction}" data-calendar-area="month"></div>
           `;
    }

    private setWeekDayHeader = () => {
        document.querySelector(`${this.opts.selector} .modern-calendar-week`).innerHTML = `
                <span>${this.opts.shortWeekday[0]}</span>
                <span>${this.opts.shortWeekday[1]}</span>
                <span>${this.opts.shortWeekday[2]}</span>
                <span>${this.opts.shortWeekday[3]}</span>
                <span>${this.opts.shortWeekday[4]}</span>
                <span>${this.opts.shortWeekday[5]}</span>
                <span>${this.opts.shortWeekday[6]}</span>
            `;
    }

    private destroy = () => {
        this.removeEvent(this.opts.button_prev, 'click', this.monthPrev);
        this.removeEvent(this.opts.button_next, 'click', this.monthNext);
        this.clearCalendar();
        document.querySelector(this.opts.selector).innerHTML = '';
    }

    public init = () => {
        this.createCalendar();
        this.opts.button_prev = document.querySelector(this.opts.selector + ' [data-calendar-toggle=previous]');
        this.opts.button_next = document.querySelector(this.opts.selector + ' [data-calendar-toggle=next]');
        this.opts.month = document.querySelector(this.opts.selector + ' [data-calendar-area=month]');
        this.opts.month_label = document.querySelector(this.opts.selector + ' [data-calendar-label=month]');

        this.opts.date.setDate(1);
        this.createMonth();
        this.setWeekDayHeader();
        this.addEvent(this.opts.button_prev, 'click', this.monthPrev);
        this.addEvent(this.opts.button_next, 'click', this.monthNext);
    }

    public reset = () => {
        this.destroy();
        this.init();
    }

    public set = (optionsArray: any) => {
        // tslint:disable-next-line:forin
        for (const k in optionsArray) {
            if (this.opts.hasOwnProperty(k)) {
                this.opts[k] = optionsArray[k];
            }
            this.createMonth();
        }
    }
}
