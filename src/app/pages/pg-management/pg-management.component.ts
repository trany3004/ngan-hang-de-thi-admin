import {
  AfterViewInit,
  Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
import { ExportService } from 'src/app/services/export.service';
import { PGCreateDialogComponent } from './pg-create-dialog/pg-create-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-pg-management',
  templateUrl: './pg-management.component.html',
  styleUrls: ['./pg-management.component.scss'],
})
export class PGManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  pageSizeOptions = [5, 30, 25, 25, 25, 25, 25, 25, 25];
  displayedColumns: string[] = ['id', 'name', 'lop', 'thoigian', 'monhoc', 'chuyende', 'kythi', 'tinhtrang', 'hanhdong'];
  displayedSearchColumns: string[] = ['idSearch', 'nameSearch', 'lopSearch'];
  dataSource = new MatTableDataSource([]);
  totalCount = 0;
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
    name_contains: null,
    username_contains: null,
    role: null,
    email_contains: null
  };

  exporting = false;

  loading = false;
  searchTimeout;
  userSubscription: Subscription;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }



  constructor(public dialog: MatDialog, private exportService: ExportService, private userService: UserService,
  ) { }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.initUsers();
  }

  initUsers() {
    this.loading = true;
    this.userSubscription = forkJoin([this.userService.fetchUsers(this.filter), this.userService.getTotalRecords(this.filter)])
      .subscribe(([users, total]) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
        this.totalCount = total;
        this.loading = false;
      }, _ => this.loading = false);
  }

  createPg() {
    const dialogRef = this.dialog.open(PGCreateDialogComponent, {
      data: { type: 'create' },
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filter.page = 0;
        this.filter.pageSize = this.pageSizeOptions[0];
        this.initUsers();
      }
    });
  }

  update(id) {
    const dialogRef = this.dialog.open(PGCreateDialogComponent, {
      data: {
        type: 'update',
        data: id
      },
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filter.page = 0;
        this.filter.pageSize = this.pageSizeOptions[0];
        this.initUsers();
      }
    });
  }

  deletePg(id) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Xóa PG',
        title: 'Bạn có muốn xóa PG này không?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.initUsers();
        });
      }
    });
  }

  export() {
    this.exporting = true;
    const fileName = 'pg-user';
    const header: any = {
      username: 'Name',
      name: 'Fullname',
      email: 'Email',
      role: 'Role',
      mobile: 'Mobile'
    }
    let data = [header];
      this.exporting = true;
      let newFilter = {...this.filter};
      delete newFilter.page;
      delete newFilter.pageSize;
      this.userService.fetchUsers(newFilter)
        .subscribe((rs: any[]) => {
          let dataFilter = (rs || []).map(element => ({
            username: element.username,
            name: element.name,
            email: element.email,
            role: element.role,
            mobile: element.mobile

          }));
        data = data.concat(dataFilter);
        this.exportService.exportExcel(data, fileName, true, [fileName]);
        this.exporting = false;
      }, _ => {
        this.exporting = false;
      })
  }

  onPageChange({ pageIndex, pageSize }) {
    this.filter.page = pageIndex;
    this.filter.pageSize = pageSize;
    this.initUsers();
  }

  changeList(value) {
    // console.log(this.filter)
    this.filter.username_contains = value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => this.initUsers(), 100)
  }

  clearFilter() {
    for (const propName in this.filter) {
      if (!['page', 'pageSize'].includes(propName)) {
        this.filter[propName] = null;
      }
    }
    this.initUsers();
  }
}

