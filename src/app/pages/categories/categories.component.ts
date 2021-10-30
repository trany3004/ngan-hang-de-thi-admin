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
import { CategoriesCreateDialogComponent } from './categories-create-dialog/categories-create-dialog.component';


export interface PeriodicElement {
  danhmuc: string;
  chuyende: string;
  nhanbiet: string;
  thonghieu: string;
  vandung: string;
  vandungcao: string;
  hanhdong: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  pageSizeOptions = [100, 100, 100, 100, 100, 100, 100];
  displayedColumns: string[] = ['danhmuc', 'chuyende', 'nhanbiet', 'thonghieu', 'vandung', 'vandungcao', 'hanhdong'];
  displayedSearchColumns: string[] = ['nameSearch', 'sumSearch', 'actionSearch'];
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
    this.userSubscription = forkJoin([this.categoryService.fetch(this.filter), this.categoryService.getTotalRecords(this.filter)])
      .subscribe(([users, total]) => {
        const data = users.map(({name, pg_products, id}) => ({name, id, pg_products: pg_products.length || 0}));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.totalCount = total;
        this.loading = false;
      }, _ => this.loading = false);
  }

  createPg() {
    const dialogRef = this.dialog.open(CategoriesCreateDialogComponent, {
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

  update(category) {
    const dialogRef = this.dialog.open(CategoriesCreateDialogComponent, {
      data: {
        type: 'update',
        data: category
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
        header: 'Delete Category',
        title: 'Do you want to delete this Category?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.delete(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        });
      }
    });
  }

  export() {
    this.exporting = true;
    const fileName = 'Category';
    const header: any = {
      name: 'Name',
      pg_products: 'Number Of Product'
    }
    let data = [header];
      this.exporting = true;
      let newFilter = {...this.filter};
      delete newFilter.page;
      delete newFilter.pageSize;
      this.categoryService.fetch(newFilter)
        .subscribe((rs) => {
          let dataExport = rs.map(({name, pg_products}) => ({name, pg_products: pg_products.length || 0}));
        data = data.concat(dataExport);
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

  changeList() {
    // console.log(this.filter)
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => this.init(), 100)
  }

}

