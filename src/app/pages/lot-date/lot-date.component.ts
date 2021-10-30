import {
  AfterViewInit,
  Component, Inject, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/services/export.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { LotDateService } from 'src/app/services/lot-date.service';
import { OutletService } from 'src/app/services/outlet.service';
import { switchMap } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';
import { DatePipe } from '@angular/common';
import { LotDateCreateDialogComponent } from './lot-date-create-dialog/lot-date-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lot-date',
  templateUrl: './lot-date.component.html',
  styleUrls: ['./lot-date.component.scss'],
})
export class LotDateComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['reportDate', 'outlet', 'region', 'product', 'category', 'brand', 'expiredDate'];
  hidePagination = false;
  pageSizeOptions = [5, 10, 25, 100];
  loadSubscription: Subscription;
  categories: any[] = [];
  // cities = [];
  // regions = [];
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
    startDate_gte: null,
    endDate_lt: null
  };
  totalCount = 0;
  loading = false;

  filterTimeout;
  
  exporting = false;
  dataNormal: any[] = [];

  dataSource = new MatTableDataSource([]);


  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private exportService: ExportService,
    private lotDateService: LotDateService, private outletService: OutletService,
    private categoryService: CategoryService,
    private datePipe: DatePipe,
    public dialog: MatDialog) { }

    ngOnDestroy(): void {
      if (this.loadSubscription) {
        this.loadSubscription.unsubscribe();
      }
    }
      
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }
    ngOnInit(): void {
      this.init();
    }
   
  init() {
    this.loading = true;
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
    this.loadSubscription = forkJoin([
      this.lotDateService.fetch(this.filter),
      this.lotDateService.getTotalRecords(this.filter),
      this.categoryService.fetch()
    ]).subscribe(([checkins, total, categories]) => {
      this.categories = categories;
      this.mapData(checkins);
      this.totalCount = total;
      this.loading = false;
    }, _ => {
      this.loading = false;
    })
  }


  export() {
    this.exporting = true;
    const fileName = 'lot-date-reports';
    const header: any = {
      reportDate: 'Date',
      outlet: 'OutletName',
      region: 'Customer',
      product: 'ProductName',
      category: 'Category',
      brand: 'Brand',
      expiredDate: 'ExpiredDate',
    }
    let data = [header];
    if (this.hidePagination) {
      data = data.concat(this.dataNormal);
      this.exportService.exportExcel(data, fileName, true, [fileName]);
      this.exporting = false;
      return;
    } else {
      this.exporting = true;
      let newFilter = {...this.filter};
      delete newFilter.page;
      delete newFilter.pageSize;
      this.lotDateService.fetch(newFilter)
        .subscribe((rs) => {
        let dataExport = this.mappingDataForExport(rs);
        data = data.concat(dataExport);
        this.exportService.exportExcel(data, fileName, true, [fileName]);
        this.exporting = false;
      }, _ => {
        this.exporting = false;
      })
    }
  }

  onPageChange(event) {
    this.filter.page = event.pageIndex;
    this.filter.pageSize = event.pageSize;
    this.init();
  }

  mappingDataAndDontSet(list) {
    const data: any = list.map((element) => {
      let category;
      if (element['pg_product'] && element['pg_product'].pg_product_group) {
        category = this.categories.find(({id}) => id === element['pg_product'].pg_product_group)
      }
      const mapped = {
        ...element,
        region: element['pg_outlet'] ? element['pg_outlet'].group : '',
        brand: element['pg_product'] ? element['pg_product'].brand : '',
        expiredDate_: element.expiredDate ? this.datePipe.transform(element.expiredDate, 'dd/MM/yyyy') : '',
        reportDate_: element.reportDate ? this.datePipe.transform(element.reportDate, 'dd/MM/yyyy') : '',
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        product: element['pg_product'] ? element['pg_product'].name : '',
        category: category ? category.name : '',
      }
      return mapped
    })
    
    return data;
  }

  mappingDataForExport(list) {
    const data: any = list.map((element) => {
      let category;
      if (element['pg_product'] && element['pg_product'].pg_product_group) {
        category = this.categories.find(({id}) => id === element['pg_product'].pg_product_group)
      }
      const mapped = {
        region: element['pg_outlet'] ? element['pg_outlet'].group : '',
        brand: element['pg_product'] ? element['pg_product'].brand : '',
        expiredDate: element.expiredDate ? this.datePipe.transform(element.expiredDate, 'dd/MM/yyyy') : '',
        reportDate: element.reportDate ? this.datePipe.transform(element.reportDate, 'dd/MM/yyyy') : '',
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        product: element['pg_product'] ? element['pg_product'].name : '',
        category: category ? category.name : '',
      }
      return mapped
    })
    
    return data;
  }

  mapData(list = []) {
    const data: any = this.mappingDataAndDontSet(list);

    this.dataNormal = this.mappingDataForExport(list);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  onFilterData({region, city, name, startDate, endDate, brand}) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    if (region || city || name) {
      this.hidePagination = true;
      let newFilter = {
        group: region, city, name
      }
      this.filterTimeout = setTimeout(() => {
        this.loading = true;
        this.outletService.fetchoutlets(newFilter).pipe(switchMap((rs) => {
          let list = [];
          (rs || []).map(({pg_lot_dates}) => {
            list = list.concat(pg_lot_dates);
          })
          return of(list);
        })).pipe(switchMap((rs) => {
          let ids = rs.filter(({id}) => id).map(({id}) => id);
          const filterDate = {
            expiredDate_gte: startDate || null,
            expiredDate_lt: endDate || null
          }
          return this.lotDateService.fetchByIds(ids, filterDate)
        })).subscribe((rs) => {
          this.mapData(rs);
          this.loading = false;
        })
      }, 100)
    } else {
      this.hidePagination = false;
      this.loading = true;
      this.filter.page = 0;
      this.filterTimeout = setTimeout(() => {
          this.filter.expiredDate_gte = startDate || null;
          this.filter.expiredDate_lt = endDate || null;
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
      }, 100)
    }
  }

  modify(element) {
    const dialogRef = this.dialog.open(LotDateCreateDialogComponent, {
      width: '50%',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.init();
      }
    });
  }

}

