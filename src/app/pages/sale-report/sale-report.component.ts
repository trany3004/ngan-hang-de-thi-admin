import {
  AfterViewInit,
  Component, OnDestroy, ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/services/export.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { SaleReportService } from 'src/app/services/sale-report.service';
import { OutletService } from 'src/app/services/outlet.service';
import { switchMap } from 'rxjs/operators';
import { CurrencyService } from '../common/currency-pipe/currency-pipe.service';
import { DatePipe } from '@angular/common';
import { ModifyPgSaleReportComponent } from '../common/modify-pg-sale-report/modify-pg-sale-report.component';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.scss'],
})

export class SaleReportComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['createdAt', 'group', 'outlet', 'reach', 'buyer', 'saleTarget', 'actual', 'percent', 'action'];
  hidePagination = false;
  pageSizeOptions = [5, 10, 25, 100];
  // cities = [];
  // regions = [];
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
  };
  totalCount = 0;
  loading = false;

  filterTimeout;
  isShowingDetail = false;
  
  dataSource = new MatTableDataSource([]);
  dataSourceDetail = new MatTableDataSource([]);

  exporting = false;
  dataNormal: any[] = [];
  loadingSubscription: Subscription;
  deletingSubscription: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(public dialog: MatDialog, private exportService: ExportService,
    private saleReportService: SaleReportService, private outletService: OutletService,
    private currencyService: CurrencyService,
    private datePipe: DatePipe) { }
    
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }
    ngOnInit(): void {
      this.init();
    }

    ngOnDestroy(): void {
      if (this.loadingSubscription) {
        this.loadingSubscription.unsubscribe();
      }
      if (this.deletingSubscription) {
        this.deletingSubscription.unsubscribe();
      }
    }
   
  init() {
    this.loading = true;
    this.loadingSubscription = this.saleReportService.fetch(this.filter).subscribe((reports) => {
      this.mapData(reports.arr || [], reports.total);
      this.totalCount = reports.count;
      this.loading = false;
    }, _ => {
      this.loading = false;
    })
  }


  export() {
    this.exporting = true;
    const fileName = 'sales_report_by_outlet';
    // const header: any = { product: 'Sản phẩm', outlet: 'Outlet', user: 'NNA', reach: 'Số người tiếp cận',
    // buyer: 'Số người mua', actualDisplay: 'Trưng bày thực tế', saleTarget: 'Sales target', 
    // actual: 'Actual', percent: '% Target', itemCount: 'Số lượng đã bán', createdAt: 'Ngày báo cáo'};
    const header: any = {
      createdAt: 'Date',
      group: 'Customer',
      outlet: 'Outlet/Supermarket',
      reach: 'Reach',
      buyer: 'Buyers',
      saleTarget: 'Sales Target',
      actual: 'Actual',
      percent: '% Target'
    }
    let data = [header];
    this.exporting = true;
    let newFilter = {...this.filter};
    delete newFilter.page;
    delete newFilter.pageSize;
    this.saleReportService.fetch(newFilter)
      .subscribe((rs) => {
      let dataExport = this.mappingDataForExport(rs.arr || []);
      data = data.concat(dataExport);
      this.exportService.exportExcel(data, fileName, true, [fileName]);
      this.exporting = false;
    }, _ => {
      this.exporting = false;
    })
    // if (this.hidePagination) {
    //   data = data.concat(this.dataNormal);
    //   this.exportService.exportExcel(data, fileName, true, [fileName]);
    //   this.exporting = false;
    //   return;
    // } else {
    //   this.exporting = true;
    //   let newFilter = {...this.filter};
    //   delete newFilter.page;
    //   delete newFilter.pageSize;
    //   this.saleReportService.fetch(newFilter)
    //     .subscribe((rs) => {
    //     let dataExport = this.mappingDataAndDontSet(rs);
    //     data = data.concat(dataExport);
    //     this.exportService.exportExcel(data, fileName, true, [fileName]);
    //     this.exporting = false;
    //   }, _ => {
    //     this.exporting = false;
    //   })
    // }
  }


  onPageChange(event) {
    this.filter.page = event.pageIndex;
    this.filter.pageSize = event.pageSize;
    this.init();
  }

  filterDataByOutlet(list = []) {
    let dataGrouped = {};
    list.map((element) => {
      const dateFormat = this.datePipe.transform(element.createdAt, 'dd/MM/yyyy');
      const outlet = element['pg_outlet'] ? element['pg_outlet'].name : '';
      element.actual = element.itemCount * (element['pg_product'] ? element['pg_product'].price: 0);
      element.reach = Number(element.reach);
      element.buyers = Number(element.buyers);
      const key = `${dateFormat}${outlet}`;
      if(dataGrouped[key]) {
        dataGrouped[key].reach = dataGrouped[key].reach + element.reach || 0;
        dataGrouped[key].buyers = dataGrouped[key].buyers + element.buyers || 0;
        dataGrouped[key].actual = dataGrouped[key].actual + element.actual;
      } else {
        dataGrouped[key] = element;
      }
    })
    return dataGrouped;
  }

  mappingDataAndDontSet(list, total) {
    let result = [];
    if (total) {
      result.push({
        reach: total.reach,
        buyer: total.buyer,
        actual: this.currencyService.transform(total.actual, true),
        outlet: '',
        group: '',
        createdAt: 'Sub-total >',
        saleTarget: '',
        percent: '',
        detail: null
      })
    }
    const data: any = list.map((element) => {
       const mapped = {
        reach: element.reach,
        buyer: element.buyer,
        outlet: element.outlet,
        group: element.distributor,
        createdAt: element.date,
        saleTarget: this.currencyService.transform(element.salesTarget, true),
        actual: this.currencyService.transform(element.actual, true),
        percent: `${element.targetPercent.toFixed(2)}%`,
        detail: element.detail,
        filterId: element.filterId
      }
      return mapped
    })
    result = result.concat(data);
    return result
  }

  mappingDataForExport(list) {
    const data: any = list.map((element) => {
       const mapped = {
        reach: element.reach,
        buyer: element.buyer,
        outlet: element.outlet,
        group: element.distributor,
        createdAt: element.date,
        saleTarget: this.currencyService.transform(element.salesTarget, true),
        actual: this.currencyService.transform(element.actual, true),
        percent: `${element.targetPercent.toFixed(2)}%`
      }
      return mapped
    })
    return data;
  }

  mapData(list = [], total) {
    let data: any = this.mappingDataAndDontSet(list, total);
    this.dataNormal = this.mappingDataForExport(list);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  onFilterData({region, city, name, startDate, endDate}) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.loading = true;
    this.filter = {...this.filter, page: 0, region, city, name, startDate, endDate}
    this.filterTimeout = setTimeout(() => {
      this.init();
    }, 100)
  }

  selectRow() {
    console.log('select row')
  }

  viewDetail(element) {
    console.log('Element >>>', element);
    const data = this.mapDataForDetail(element.detail);
    this.dataSourceDetail = new MatTableDataSource(data);
    this.dataSourceDetail.sort = this.sort;
    this.isShowingDetail = true;
  }

  mapDataForDetail(list = []) {
    const data: any = list.map((element) => {
      const saleTarget = element['pg_outlet'] ? element['pg_outlet'].target : null;
      const actual = element.itemCount * (element['pg_product'] ? element['pg_product'].price: 0);
      const mapped = {
        reach: element.reach,
        buyer: element.buyers,
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        group: element['pg_outlet'] ? element['pg_outlet'].group : '',
        createdAt: this.datePipe.transform(new Date(new Date(element.createdAt).getTime() - (7 * 60*60*1000)), 'dd/MM/yyyy'),
        saleTarget: saleTarget ? this.currencyService.transform(saleTarget, true) : '',
        actual: actual ? this.currencyService.transform(actual, true) : '',
        percent: `${saleTarget ? (actual / saleTarget * 100).toFixed(2) : 100}%`,
        detail: element
      }
      return mapped
    })
    return data;

  }

  back() {
    this.isShowingDetail = false;
    this.dataSourceDetail = new MatTableDataSource([]);
  }

  modify(element) {
    const dialogRef = this.dialog.open(ModifyPgSaleReportComponent, {
      width: '50%',
      data: element.detail
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.back();
        this.init();
      }
    });
  }

  deleteItem(element) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Delete Sale Report',
        title: 'Do you want to delete this sale report?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saleReportService.delete(element.detail.id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.back();
          this.init();
        }, _ => this.loading = false);
      }
    });
  }

  deleteSaleReport(element) {
    // console.log('Element >>>>', element)
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Delete Sale Report',
        title: 'Do you want to delete this sale report?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const detail = element.detail || [];
        const saleReportIds = detail.map(({id}) => id)
        this.loading = true;
        this.deletingSubscription = forkJoin([
          this.saleReportService.deleteFilterSaleReportByOutLet(element.filterId),
          ...saleReportIds.map((id) => this.saleReportService.delete(id))
        ]).subscribe(() => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.back();
          this.init();
        }, _ => this.loading = false)
      }
    });
  }

}
