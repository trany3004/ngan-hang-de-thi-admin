import { DatePipe } from '@angular/common';
import { WOW } from 'wowjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CurrencyService } from '../common/currency-pipe/currency-pipe.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  panelOpenState = true;
  chartOptions: any = {};
  displayedColumns: string[] = ['store', 'actual', 'target', 'achievement'];
  displayedColumn1s: string[] = ['actual', 'target', 'achievement'];
  displayedColumn2s: string[] = ['checkin', 'absent', 'achievement'];
  displayedColumns7days: string[] = ['date', 'actual', 'target', 'achievement'];
  tableTargetReportBy7Date: any[] = [];

  constructor(private datePipe: DatePipe,
    private dashboardService: DashboardService, 
    public currencyService: CurrencyService) {

  }
  ngAfterViewInit() {
    WOW.prototype.animationName = () => {
          return 'slideInLeft';
    };
    new WOW({
          live: false,
    }).init();
 }
  ngOnDestroy(): void {
    if (this.loadStoreLowSub) {
      this.loadStoreLowSub.unsubscribe();
    }
    if(this.loadStoreHighSub) {
      this.loadStoreHighSub.unsubscribe();
    }
    if(this.loadReportTodaySub) {
      this.loadReportTodaySub.unsubscribe();
    }
    if(this.loadReportByDateSub) {
      this.loadReportByDateSub.unsubscribe();
    }
    if (this.loadReportBy7DateSub) {
      this.loadReportBy7DateSub.unsubscribe();
    }
  }

  topStoresLow: any[] = [];
  loadingTopStoreLow = false;
  loadStoreLowSub: Subscription;

  topStoresHigh: any[] = [];
  loadingTopStoreHigh = false;
  loadStoreHighSub: Subscription;

  reportToday: any[] = [];
  loadingReportToday = false;
  loadReportTodaySub: Subscription;
  chartTarget: any = {};
  chartCheckin: any = {};
  tableCheckinReportDate: any[] = [];
  tableTargetReportDate: any[] = [];

  reportCheckin: any = null;
  reportDate: any[] = [];
  loadingReportByDate = false;
  loadReportByDateSub: Subscription;
  tableCheckinReportByDate: any[] = [];
  chartCheckinByDate: any = {
    series: [0, 0],
    chart: {
      width: 380,
      type: "pie"
    },
    labels: ["Check in", "Absent"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  loadingReportBy7Dates = false;
  loadReportBy7DateSub: Subscription;
  chartTargetBy7Dates: any = {
    series: [
      
    ],
    chart: {
      height: 350,
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
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
    xaxis: {
      categories: []
    },
    tooltip: {
      x: {
        format: "dd/MM/yy"
      },
      y: {
        formatter: (val) => {
          return this.currencyService.transform(val, true);
        }
      }
    }
  }

  loadTopStoresLow() {
    this.loadingTopStoreLow = true;
    this.loadStoreLowSub = this.dashboardService.storeTopLow().subscribe((stores) => {
      this.topStoresLow = stores.map(({name, actual, target}) => {
        const targetTmp = target == 0 ? 1 : target;
        const rs = {
          name, 
          actual, 
          target,
          achievement: Math.round(actual/targetTmp * 100)
        };
        return rs;
      });
      this.loadingTopStoreLow = false;
    }, _ => this.loadingTopStoreLow = false);
  }

  loadTopStoresHigh() {
    this.loadingTopStoreHigh = true;
    this.loadStoreHighSub = this.dashboardService.storeTopHigh().subscribe((stores) => {
      this.topStoresHigh = stores.map(({name, actual, target}) => {
        const targetTmp = target == 0 ? 1 : target;
        const rs = {
          name, 
          actual, 
          target,
          achievement: Math.round(actual/targetTmp * 100)
        };
        return rs;
      });
      this.loadingTopStoreHigh = false;
    }, _ => this.loadingTopStoreHigh = false);
  }

  loadReportToday() {
    this.chartTarget = {
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
    this.chartCheckin = {
      chart: {
        type: "bar",
        height: 500
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "42%"
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
          "Checkin",
          "Absent"
        ]
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return val;
          }
        }
      },
      tooltip: {
        y: {
          formatter: (val) => {
            return val;
          }
        }
      },
      fill: {
        opacity: 1
      },
    };
    this.loadingReportToday = true;
    const newDate = new Date();
    const timeDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0)).getTime() - (7*60*60*1000);
    this.loadReportTodaySub = forkJoin([
      this.dashboardService.targetActualByDate([timeDate]),
      this.dashboardService.checkinAbsentByDate([timeDate])
    ]).subscribe(([targets, checkins]) => {
      const series = [
        {
          name: "Target",
          data: [targets[0].target]
        },
        {
          name: "Actual",
          data: [targets[0].actual]
        }
      ];
      const checkInseries = [
        {
          name: "Checkin",
          data: [checkins[0].checkin]
        },
        {
          name: "Absent",
          data: [checkins[0].absent]
        }
      ];
      this.chartTarget.series = series;
      this.chartCheckin.series = checkInseries;
      const totalCheckinAndAbsent = (checkins[0].checkin + checkins[0].absent) == 0 ? 1 : (checkins[0].checkin + checkins[0].absent);
      this.tableCheckinReportDate = [
        {
          checkin: checkins[0].checkin,
          absent: checkins[0].absent,
          achievement: Math.round(checkins[0].checkin/totalCheckinAndAbsent * 100)
        }
      ]
      const target = !targets || !targets[0] || targets[0].target == 0 ? 1 : targets[0].target;
      this.tableTargetReportDate = [
        {
          target: targets[0].target,
          actual: targets[0].actual,
          achievement: Math.round(targets[0].actual/target * 100)
        }
      ]
      this.loadingReportToday = false;
      
    }, _ => this.loadingReportToday = false);
  }

  loadReportCheckinByDate() {
    this.loadingReportByDate = true;
    let sendDate: any;
    if (!this.reportCheckin) {
      const newDate = new Date();
      this.reportCheckin = newDate;
      sendDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0)).getTime() - (7*60*60*1000);
    } else {
      const {year, month, date} = this.reportCheckin._i;
      sendDate = Date.UTC(year, month, date, 0,0,0);
    }
    if (this.loadReportByDateSub) {
      this.loadReportByDateSub.unsubscribe();
    }
    this.loadReportByDateSub = this.dashboardService.checkinAbsentByDate([sendDate])
    .subscribe((checkins) => {
      this.chartCheckinByDate.series = [checkins[0].checkin, checkins[0].absent];
      const totalCheckinAndAbsent = (checkins[0].checkin + checkins[0].absent) == 0 ? 1 : (checkins[0].checkin + checkins[0].absent);
      this.tableCheckinReportByDate = [
        {
          checkin: checkins[0].checkin,
          absent: checkins[0].absent,
          achievement: Math.round(checkins[0].checkin/totalCheckinAndAbsent * 100)
        }
      ]
      this.loadingReportByDate = false;
    }, _ => this.loadingReportByDate = false)
  }

  loadReportTargetFor7Days() {
    this.loadingReportBy7Dates = true;
    let newDate = new Date();
    let listDates: any[] = [];
    listDates.push(new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),0,0,0)).getTime() - (7*60*60*1000));
    for(let i = 1; i < 7; i++) {
      newDate.setDate(new Date().getDate() - i)
      listDates.push(new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),0,0,0)).getTime()-(7*60*60*1000));
    }
    listDates = listDates.reverse();
    if (this.loadReportBy7DateSub) {
      this.loadReportBy7DateSub.unsubscribe();
    }
    this.loadReportBy7DateSub = this.dashboardService.targetActualByDate(listDates)
    .subscribe((targets) => {
      this.chartTargetBy7Dates.series = [
        {
          name: "Target",
          data: targets.map(({target}) => target)
        },
        {
          name: "Actual",
          data: targets.map(({actual}) => actual)
        }
      ]
      this.chartTargetBy7Dates.xaxis = {
        categories: listDates.map((d) => this.datePipe.transform(d, 'dd-MM-yyyy', 'Asia/Ho_Chi_Minh'))
      }
      this.tableTargetReportBy7Date = targets.map(({target, actual}, index) => {
        const targetTmp = !target || target == 0 ? 1 : target;
        return  {
          date: this.datePipe.transform(listDates[index], 'dd-MM-yyyy', 'Asia/Ho_Chi_Minh'),
          target: target,
          actual: actual,
          achievement: Math.round(actual/targetTmp * 100)
        }
      })
      this.loadingReportBy7Dates = false;
    }, _ => this.loadingReportBy7Dates = false)
  }

  ngOnInit(): void {
    // this.loadTopStoresLow();
    // this.loadTopStoresHigh();
    // this.loadReportToday();
    // this.loadReportCheckinByDate();
    // this.loadReportTargetFor7Days();

  }
  

}
