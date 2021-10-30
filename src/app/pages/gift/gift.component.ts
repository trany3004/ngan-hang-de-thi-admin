import {
  AfterViewInit,
  Component, Inject, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
import { ExportService } from 'src/app/services/export.service';
import { GiftCreateDialogComponent } from './gift-create-dialog/gift-create-dialog.component';
import { forkJoin, of, Subscription } from 'rxjs';
import { GiftService } from 'src/app/services/gift.service';
import { OutletService } from 'src/app/services/outlet.service';
import { switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { GiftModifyDialogComponent } from './gift-modify-dialog/gift-modify-dialog.component';


@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss'],
})
export class GiftComponent implements OnInit, AfterViewInit, OnDestroy{
  displayedColumns: string[] = ['createdAt', 'outlet', 'product', 'quantity', 'customerName', 'customerMobile', 'receipt', 'action'];
  hidePagination = false;
  pageSizeOptions = [5, 10, 25, 100];
  loadSubscription: Subscription;
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


  constructor(public dialog: MatDialog, private exportService: ExportService,
    private giftService: GiftService, private outletService: OutletService,
    private datePipe: DatePipe) { }

    createPg() {
      const dialogRef = this.dialog.open(GiftComponent, {
        width: '50%',
        data: {
          type: 'create'
        }
      })
    };
   
    ngOnDestroy(): void {
      if(this.loadSubscription) {
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
      this.giftService.fetch(this.filter),
      this.giftService.getTotalRecords(this.filter)
    ]).subscribe(([checkins, total]) => {
      // this.mapData(checkins);
      this.totalCount = total;
      this.loading = false;
    }, _ => {
      this.loading = false;
    })
  }
  

  viewImage(url, title) {
    window.open(`${window.location.host}${url}`);
  }
 

   export() {
    this.exporting = true;
    const fileName = 'gift-reports';
    const header: any = {
      id: 'Report Id',
      createdAt: 'Date',
      outlet: 'OutletName',
      product: 'ProductName',
      user: 'PGName',
      customerName: 'CustomerName',
      customerMobile: 'PhoneNumber',
      quantity: 'Quantity',
      note: 'Note',
      receipt: 'Receipt Photo'
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
      this.giftService.fetch(newFilter)
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
      const mapped = {
        ...element,
        id: element.id,
        quantity: element.quantity,
        customerName: element.customerName,
        customerMobile: element.customerMobile,
        createdAt_: element.createdAt ? this.datePipe.transform(element.createdAt, 'dd/MM/yyyy') : '',
        note: element.note,
        user: element['pg_user'] ? element['pg_user'].username : '',
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        receipt_: element.receipt ? `${element.receipt.url}` : null,
        product: element['pg_product'] ? element['pg_product'].name : ''
      }
      return mapped
    })
    
    return data;
  }

  mappingDataForExport(list) {
    const data: any = list.map((element) => {
      const mapped = {
        id: element.id,
        quantity: element.quantity,
        customerName: element.customerName,
        customerMobile: element.customerMobile,
        createdAt: element.createdAt ? this.datePipe.transform(element.createdAt, 'dd/MM/yyyy') : '',
        note: element.note,
        user: element['pg_user'] ? element['pg_user'].username : '',
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        receipt: element.receipt ? `${element.receipt.url}` : null,
        product: element['pg_product'] ? element['pg_product'].name : ''
      }
      return mapped
    })
    
    return data;
  }

  // mapData(list = []) {
  //   const data: any = this.mappingDataAndDontSet(list);

  //   this.dataNormal = this.mappingDataForExport(list);
  //   this.dataSource = new MatTableDataSource(data);
  //   this.dataSource.sort = this.sort;
  // }

  // onFilterData({region, city, name, startDate, endDate}) {
  //   if (this.filterTimeout) {
  //     clearTimeout(this.filterTimeout);
  //   }
  //   if (region || city || name) {
  //     this.hidePagination = true;
  //     let newFilter = {
  //       group: region, city, name
  //     }
  //     this.filterTimeout = setTimeout(() => {
  //       this.loading = true;
  //       this.outletService.fetchoutlets(newFilter).pipe(switchMap((rs) => {
  //         let listCheckins = [];
  //         (rs || []).map(({pg_gifts}) => {
  //           listCheckins = listCheckins.concat(pg_gifts);
  //         })
  //         return of(listCheckins);
  //       })).pipe(switchMap((rs) => {
  //         let ids = rs.filter(({id}) => id).map(({id}) => id);
  //         const filterDate = {
  //           createdAt_gte: startDate || null,
  //           createdAt_lt: endDate || null
  //         }
  //         return this.giftService.fetchByIds(ids, filterDate)
  //       })).subscribe((rs) => {
  //         this.mapData(rs);
  //         this.loading = false;
  //       })
  //     }, 100)
  //   } else {
  //     this.hidePagination = false;
  //     this.loading = true;
  //     this.filter.page = 0;
  //     this.filterTimeout = setTimeout(() => {
  //         this.filter.createdAt_gte = startDate || null;
  //         this.filter.createdAt_lt = endDate || null;
  //         this.filter.page = 0;
  //         this.filter.pageSize = this.pageSizeOptions[0];
  //         this.init();
  //     }, 100)
  //   }
  // }

  modify(element) {
    const dialogRef = this.dialog.open(GiftModifyDialogComponent, {
      data: element,
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.init();
      }
    });
  }

  deleteItem({id}) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Delete Gift',
        title: 'Do you want to delete this gift?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.giftService.delete(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        });
      }
    });
  }

}

