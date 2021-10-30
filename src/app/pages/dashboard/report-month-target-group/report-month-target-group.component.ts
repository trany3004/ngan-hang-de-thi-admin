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
  selector: 'app-reported-month-group',
  templateUrl: './report-month-target-group.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReportedMonthTargetGroupComponent implements OnInit, OnDestroy {
  chartOptions: any = {};
  loading = true;
  date = new FormControl(moment());
  loadingSubscription: Subscription;
  data:any = {
    month: null,
    year: null
  };

  displayedColumns: string[] = ['group', 'actual', 'target', 'achievement'];
  tableTargetReportDate: any[] = [];
  constructor(private currencyService: CurrencyService, private dashboardService: DashboardService) { }
  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: "Target",
          data: []
        },
        {
          name: "Actual",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%",
          // endingShape: "rounded"
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
      if (this.loadingSubscription) {
        this.loadingSubscription.unsubscribe();
      }
      this.loading = true;
      if (!this.data || !this.data.year || !this.data.month) {
        this.data.year = this.date.value._d.getFullYear();
        this.data.month = this.date.value._d.getMonth();
      }
      let newDate = new Date(Date.UTC(this.data.year, this.data.month, 1,0,0,0)).getTime() -(7*60*60*1000);
      this.loadingSubscription = this.dashboardService.targetActualByGroup([newDate]).subscribe((rs) => {
        this.chartOptions.series = [
          {
            name: "Target",
            data: rs.map(({target}) => target)
          },
          {
            name: "Actual",
            data: rs.map(({actual}) => actual)
          }
        ]
        this.chartOptions.xaxis = {
          categories: rs.map(({group}) => group)
        },
        this.tableTargetReportDate = rs.map(({group, target, actual}) => {
          const targetTmp = !target || target == 0 ? 1 : target;
          return  {
            group: group,
            target: target,
            actual: actual,
            achievement: Math.round(actual/targetTmp * 100)
          }
        })
        this.loading = false;
      }, _ => this.loading = false)
    } else {
      this.loading = false;
    }
  }

}
