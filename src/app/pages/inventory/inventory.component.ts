import {
  AfterViewInit,
  Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/services/export.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OutletService } from 'src/app/services/outlet.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InventoryCreateDialogComponent } from './inventory-create-dialog/inventory-create-dialog.component';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [ 'createdAt', 'outlet', 'product', 'before', 'after', 'action'];
  hidePagination = false;
  pageSizeOptions = [5, 10, 25, 100];
  loadSubscription: Subscription;
  categories: any[] = [];
  // cities = [];
  // regions = [];
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
  };
  totalCount = 0;
  loading = false;

  filterTimeout;
  
  exporting = false;
  dataNormal: any[] = [];
  loadingSubscription: Subscription;

  dataSource = new MatTableDataSource([]);


  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private exportService: ExportService,
    private inventoryService: InventoryService, private outletService: OutletService,
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
      this.inventoryService.fetch(this.filter),
      this.inventoryService.getTotalRecords(this.filter)
    ]).subscribe(([checkins, total]) => {
      this.mapData(checkins);
      this.totalCount = total;
      this.loading = false;
    }, _ => {
      this.loading = false;
    })
  }


   export() {
    this.exporting = true;
    const fileName = 'inventory-reports';
    const header: any = {
      createdAt: 'Date',
      outlet: 'OutletName',
      product: 'ProductName',
      before: 'Quantity In Stock',
      after: 'Final Inventory'
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
      this.inventoryService.fetch(newFilter)
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
        createdAt: this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'),
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        product: element['pg_product'] ? element['pg_product'].name : '',
      }
      return mapped
    })
    return data;
  }

  mappingDataForExport(list) {
    const data: any = list.map((element) => {
      const mapped = {
        createdAt: this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'),
        outlet: element['pg_outlet'] ? element['pg_outlet'].name : '',
        product: element['pg_product'] ? element['pg_product'].name : '',
        after: element.after,
        before: element.before
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

  onFilterData({region, city, name, startDate, endDate}) {
    // if (this.filterTimeout) {
    //   clearTimeout(this.filterTimeout);
    // }
    // if (region || city || name) {
    //   this.hidePagination = true;
    //   let newFilter = {
    //     group: region, city, name
    //   }
    //   this.filterTimeout = setTimeout(() => {
    //     this.loading = true;
    //     this.outletService.fetchoutlets(newFilter).pipe(switchMap((rs) => {
    //       let list = [];
    //       (rs || []).map(({pg_inventories}) => {
    //         list = list.concat(pg_inventories);
    //       })
    //       return of(list);
    //     })).pipe(switchMap((rs) => {
    //       let ids = rs.filter(({id}) => id).map(({id}) => id);
    //       const filterDate = {
    //         createdAt_gte: startDate || null,
    //         createdAt_lt: endDate || null
    //       }
    //       return this.inventoryService.fetchByIds(ids, filterDate)
    //     })).subscribe((rs) => {
    //       this.mapData(rs);
    //       this.loading = false;
    //     })
    //   }, 100)
    // } else {
    //   this.hidePagination = false;
    //   this.loading = true;
    //   this.filter.page = 0;
    //   this.filterTimeout = setTimeout(() => {
    //       this.filter.createdAt_gte = startDate || null;
    //       this.filter.createdAt_lt = endDate || null;
    //       this.filter.page = 0;
    //       this.filter.pageSize = this.pageSizeOptions[0];
    //       this.init();
    //   }, 100)
    // }
  }

  modifyInventory(element) {
    const dialogRef = this.dialog.open(InventoryCreateDialogComponent, {
      width: '50%',
      data: element
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
        header: 'Delete Inventory',
        title: 'Do you want to delete this inventory?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryService.delete(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        });
      }
    });
  }

}


