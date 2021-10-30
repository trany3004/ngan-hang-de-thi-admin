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
  selector: 'app-sale-report-sku',
  templateUrl: './sale-report-sku.component.html',
  styleUrls: ['./sale-report-sku.component.scss'],
})

export class SaleReportBySkuComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['createdAt', 'group', 'outlet', 'sku', 'reach', 'display', 'buyer', 'actual', 'action'];
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
  
  dataSource = new MatTableDataSource([]);
  dataSourceDetail = new MatTableDataSource([]);
  isShowingDetail = false;

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
    }
   
  init() {
    this.loading = true;
    this.loadingSubscription = this.saleReportService.fetch(this.filter, true).subscribe((reports) => {
      this.mapData(reports.arr || [], reports.total);
      this.totalCount = reports.count;
      this.loading = false;
    }, _ => {
      this.loading = false;
    })
  }
  create() {
    const dialogRef = this.dialog.open(SaleReportBySkuComponent, {
      data: { type: 'create', data: {promotionType: 'Buy1get1free'} },
      width: '50%'
    });

  }


  onPageChange(event) {
    this.filter.page = event.pageIndex;
    this.filter.pageSize = event.pageSize;
    this.init();
  }

  mappingDataAndDontSet(list, total) {
    let result = [];
    if (total) {
      result.push({
        reach: total.reach,
        buyer: total.buyer,
        outlet: null,
        sku: null,
        group: '',
        createdAt: 'Sub-total >',
        display: total.display,
        saleTarget: '',
        actual: this.currencyService.transform(total.actual, true),
        detail: []
      })
    }
    const data: any = list.map((element) => {
       const mapped = {
        reach: element.reach,
        buyer: element.buyer,
        outlet: element.outlet,
        sku: element.sku,
        group: element.distributor,
        createdAt: element.date,
        display: element.display,
        saleTarget: this.currencyService.transform(element.salesTarget, true),
        actual: this.currencyService.transform(element.actual, true),
        detail: element.detail,
        filterId: element.filterId
      }
      return mapped
    })
    result = result.concat(data)
    return result
  }

  mappingDataForExport(list) {
    const data: any = list.map((element) => {
       const mapped = {
        reach: element.reach,
        buyer: element.buyer,
        outlet: element.outlet,
        sku: element.sku,
        group: element.distributor,
        createdAt: element.date,
        display: element.display,
        saleTarget: this.currencyService.transform(element.salesTarget, true),
        actual: this.currencyService.transform(element.actual, true)
      }
      return mapped
    })
    return data;
  }


  mapData(list = [], total) {
    const data: any = this.mappingDataAndDontSet(list, total);
    this.dataNormal = this.mappingDataForExport(list);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  // onFilterData({region, city, name, startDate, endDate}) {
  //   if (this.filterTimeout) {
  //     clearTimeout(this.filterTimeout);
  //   }
  //   this.loading = true;
  //   this.filter = {...this.filter, page: 0, region, city, name, startDate, endDate}
  //   this.filterTimeout = setTimeout(() => {
  //     this.init();
  //   }, 100)
  // }

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
        display: element.actualDisplay,
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        group: element['pg_outlet'] ? element['pg_outlet'].group : '',
        sku: element['pg_product']  ? element['pg_product'].name : '',
        createdAt: this.datePipe.transform(new Date(new Date(element.createdAt).getTime() - (7 * 60*60*1000)), 'dd/MM/yyyy'),
        saleTarget: saleTarget ? this.currencyService.transform(saleTarget, true) : '',
        actual: actual ? this.currencyService.transform(actual, true) : '',
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
        });
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
          this.saleReportService.deleteFilterSaleReportBySku(element.filterId),
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



