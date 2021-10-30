import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {Moment} from 'moment';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CurrencyService } from '../../common/currency-pipe/currency-pipe.service';

const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-reported-month',
  templateUrl: './reported-month.component.html',
  styleUrls: ['./reported-month.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReportedMonthComponent implements OnInit, OnDestroy {
  chartOptions2: any = {};
  loading = true;
  date = new FormControl(moment());
  data:any = {
    month: null,
    year: null
  }
  loadingSubscription: Subscription;
  displayedColumns: string[] = ['actual', 'target', 'achievement'];
  tableTargetReportDate: any[] = [];
  constructor(private currencyService: CurrencyService, private dashboardService: DashboardService) { }
  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.chartOptions2 = {
      series: [
        {
          name: "Target",
          data: [0]
        },
        {
          name: "Actual",
          data: [0]
        }
      ],
      chart: {
        type: "bar",
        height: 500
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Target",
          "Actual"
        ]
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return this.currencyService.transform(val);
          }
        },
        title: {
          text: "VNĐ"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return this.currencyService.transform(val, true);
          }
        }
      }
    };
    this.loadData();
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.data.year = normalizedYear.year();
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.data.month = normalizedMonth.month();
    datepicker.close();
    this.loadData();
  }

  loadData() {
    let time = this.date.status === 'VALID' ? this.date.value._d.getTime() : false;
    if (time) {
      console.log(this.date.value)
      if (this.loadingSubscription) {
        this.loadingSubscription.unsubscribe();
      }
      this.loading = true;
      if (!this.data || !this.data.year || !this.data.month) {
        this.data.year = this.date.value._d.getFullYear();
        this.data.month = this.date.value._d.getMonth();
      }
      let newDate = new Date(Date.UTC(this.data.year, this.data.month, 1,0,0,0)).getTime() - (7*60*60*1000);
      this.loadingSubscription = this.dashboardService.targetActualByMonth([newDate]).subscribe((rs) => {
        this.chartOptions2.series = [
          {
            name: "Target",
            data: [rs[0].target]
          },
          {
            name: "Actual",
            data: [rs[0].actual]
          }
        ]

        const target = !rs || !rs[0] || rs[0].target == 0 ? 1 : rs[0].target;
        this.tableTargetReportDate = [
          {
            target: rs[0].target,
            actual: rs[0].actual,
            achievement: Math.round(rs[0].actual/target * 100)
          }
        ]
        console.log(this.chartOptions2)
        this.loading = false;
      }, _ => this.loading = false)
    } else {
      this.loading = false;
    }
  }

}
