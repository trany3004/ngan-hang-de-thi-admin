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
import { ProductCreateDialogComponent } from './product-create-dialog/product-create-dialog.component';
import { ProductService } from 'src/app/services/product.service';
import { CurrencyService } from '../common/currency-pipe/currency-pipe.service';
import { ProductQuantityDialogComponent } from './product-quantity-detail/product-quantity-detail.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['code',  'category', 'brand', 'name',  'size','quantity', 'price', 'action'];
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



  constructor(public dialog: MatDialog, private exportService: ExportService, private categoryService: CategoryService,
    private productService: ProductService, private currencyService: CurrencyService,
    private toastr: ToastrService
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
    this.userSubscription = forkJoin([this.productService.fetch(this.filter), this.productService.getTotalRecords(this.filter)])
      .subscribe(([data, total]) => {
        this.mapData(data);
        this.totalCount = total;
        this.loading = false;
      }, _ => this.loading = false);
  }

  mapData(products) {
    (products || []).forEach(element => {
      element.category = element.pg_product_group ? element.pg_product_group.name: '';
      element.categoryId = element.pg_product_group ? element.pg_product_group.id: null;
    });
    this.dataSource = new MatTableDataSource(products);
    this.dataSource.sort = this.sort;
  }

  createPg() {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      data: { type: 'create' },
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

  update(product) {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      data: {
        type: 'update',
        data: product
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
        this.productService.delete(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        });
      }
    });
  }

  export() {
    this.exporting = true;
    const fileName = 'products';
    const header: any = {
      code: 'Code',
      category: 'Category',
      brand: 'Brand',
      name: 'Sku(vi)',
      size: 'Size',
      quantity: 'Quantity/carton',
      price: 'Price',
    }
    const fields = ['code', 'name', 'category', 'brand', 'price', 'quantity', 'size'];
    let data = [header];
      this.exporting = true;
      let newFilter = {...this.filter};
      delete newFilter.page;
      delete newFilter.pageSize;
      this.productService.fetch(newFilter)
        .subscribe((rs: any[]) => {
          (rs || []).forEach(element => {
            element.category = element.pg_product_group ? element.pg_product_group.name: '';
            element.categoryId = element.pg_product_group ? element.pg_product_group.id: null;
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
    const dialogRef = this.dialog.open(ProductQuantityDialogComponent, {
      data: element,
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
}
