import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, Inject, OnDestroy, OnInit, ViewChild,
  } from '@angular/core';
  import { FormControl } from '@angular/forms';
  import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
  import { MatSort } from '@angular/material/sort';
  import { MatTableDataSource } from '@angular/material/table';
  import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
  import { ExportService } from 'src/app/services/export.service';
  import { UserService } from 'src/app/services/user.service';
  import { forkJoin, Subscription } from 'rxjs';
  import { CategoryService } from 'src/app/services/category.service';
  import { ProductService } from 'src/app/services/product.service';
  import { CurrencyService } from '../common/currency-pipe/currency-pipe.service';
  import { ToastrService } from 'ngx-toastr';
import { PromotionService } from 'src/app/services/promotion.service';
import { DatePipe } from '@angular/common';
import { PromotionCreateDialogComponent } from './promotion-create-dialog/promotion-create-dialog.component';
  
  @Component({
    selector: 'app-product-management',
    templateUrl: './promotion-management.component.html',
    styleUrls: ['./promotion-management.component.scss'],
  })
  export class PromotionManagementComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) sort: MatSort;
    pageSizeOptions = [5, 10, 25, 100];
    displayedColumns: string[] = ['name',  'products', 'type', 'discount',  'startDate', 'endDate', 'action'];
    dataSource = new MatTableDataSource([]);
    totalCount = 0;
    filter: any = {
      page: 0,
      pageSize: this.pageSizeOptions[0],
      name_contains: null
    };
  
    exporting = false;
    loading = false;
    searchTimeout;
    userSubscription: Subscription;
  
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }
  
  
  
    constructor(public dialog: MatDialog, private exportService: ExportService,
      private promotionService: PromotionService, private currencyService: CurrencyService,
      private toastr: ToastrService,
      private datePipe: DatePipe
    ) { }
    ngOnDestroy(): void {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
    }
  
    ngOnInit() {
      this.init();
    }
  
    init() {
      this.loading = true;
      this.userSubscription = forkJoin([this.promotionService.fetch(this.filter), this.promotionService.getTotalRecords(this.filter)])
        .subscribe(([data, total]) => {
          this.mapData(data);
          this.totalCount = total;
          this.loading = false;
        }, _ => this.loading = false);
    }
  
    mapData(promotions) {
      (promotions || []).forEach(element => {
        element.startDate = this.datePipe.transform(new Date(new Date(element.start).getTime() - (7 * 60*60*1000)), 'dd/MM/yyyy')
        element.endDate = this.datePipe.transform(new Date(new Date(element.end).getTime() - (7 * 60*60*1000)), 'dd/MM/yyyy');
      });
      this.dataSource = new MatTableDataSource(promotions);
      this.dataSource.sort = this.sort;
    }
  
    create() {
      const dialogRef = this.dialog.open(PromotionCreateDialogComponent, {
        data: { type: 'create', data: {promotionType: 'Buy1get1free'} },
        width: '50%'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        }
      });
    }
  
    update(data) {
      const dialogRef = this.dialog.open(PromotionCreateDialogComponent, {
        data: {
          type: 'update',
          data: data
        },
        width: '50%'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        }
      });
    }
  
    deletePg(id) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          header: 'Delete Product',
          title: 'Do you want to delete this product?'
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.promotionService.delete(id).subscribe(res => {
            this.filter.page = 0;
            this.filter.pageSize = this.pageSizeOptions[0];
            this.init();
          });
        }
      });
    }
  
    export() {
      this.exporting = true;
      const fileName = 'promotions';
      const header: any = {
        name: 'Name',
        products: 'Products',
        type: 'Type',
        discount: 'Discount',
        startDate: 'Start Date',
        endDate: 'End Date'
      }
      const fields = ['name', 'products', 'type', 'discount', 'startDate', 'endDate'];
      let data = [header];
        this.exporting = true;
        let newFilter = {...this.filter};
        delete newFilter.page;
        delete newFilter.pageSize;
        this.promotionService.fetch(newFilter)
          .subscribe((rs: any[]) => {
            (rs || []).forEach(element => {
              element.name = element.name;
              element.discount = element.discount;
              element.price = this.currencyService.transform(element.price, true);
              for(const pro in element) {
                if (!fields.includes(pro)) {
                  delete element[pro];
                }
              }
            });
          data = data.concat(rs);
          this.exportService.exportExcel(data, fileName, true, [fileName]);
          this.exporting = false;
        }, _ => {
          this.exporting = false;
        })
    }
  
    onPageChange({ pageIndex, pageSize }) {
      this.filter.page = pageIndex;
      this.filter.pageSize = pageSize;
      this.init();
    }
  
    changeSearch() {
      // console.log(this.filter)
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.loading = true;
      this.searchTimeout = setTimeout(() => this.init(), 200);
    }
  
    clearFilter() {
      for (const propName in this.filter) {
        if (!['page', 'pageSize'].includes(propName)) {
          this.filter[propName] = null;
        }
      }
      this.init();
    }
  
    openProductByOutlet(element) {
    //   const dialogRef = this.dialog.open(ProductQuantityDialogComponent, {
    //     data: element,
    //     width: '50%'
    //   });
  
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.filter.page = 0;
    //       this.filter.pageSize = this.pageSizeOptions[0];
    //       this.init();
    //     }
    //   });
    }

    displayType(type) {
        if (type === 'Buy1get1free') {
            return 'Mua 1 tặng 1'
        }
        if (type === 'discount') {
            return 'Giảm giá'
        }
    }
  }
  