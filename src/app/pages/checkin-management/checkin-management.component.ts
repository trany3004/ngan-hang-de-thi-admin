import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CheckinService } from 'src/app/services/checkin.server';
import { ExportService } from 'src/app/services/export.service';
import { OutletService } from 'src/app/services/outlet.service';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
import { CheckinAddressDialogComponent } from './checkin-address-dialog/checkin-address-dialog.component';
import { CheckinCreateDialogComponent } from './checkin-create-dialog/checkin-create-dialog.component';


export interface PeriodicElement {
  stt: number;
  name: string;
  lop: number;
  monhoc: string;
  thoigian: number;
  trangthai: string;
  ghichu: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { stt: 1, name: 'Kiểm tra thường xuyên 12', lop: 12, monhoc: 'Toán', thoigian: 45, trangthai: 'hoạt động', ghichu: '',},
  { stt: 1, name: 'Kiểm tra thường xuyên 12', lop: 12, monhoc: 'Toán', thoigian: 45, trangthai: 'hoạt động', ghichu: ''}
];

@Component({
  selector: 'app-checkin-management',
  templateUrl: './checkin-management.component.html',
  styleUrls: ['./checkin-management.component.scss'],
})

export class CheckinManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['stt', 'name', 'lop', 'monhoc', 'thoigian', 'trangthai', 'ghichu', 'action'];
  hidePagination = false;
  pageSizeOptions = [5, 5, 10, 25, 100, 100, 100];
  loadingSubscription: Subscription;
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
    startDate_gte: null,
    endDate_lt: null
  };
  totalCount = 0;
  loading = false;
  zoom = 15;

  filterTimeout;

  dataSource = new MatTableDataSource([]);
  dataNormal: any[] = [];
  exporting = false;


  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(public dialog: MatDialog) { }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  createPg() {
    const dialogRef = this.dialog.open(CheckinCreateDialogComponent, {
      width: '50%',
      data: {
        type: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  viewImage(url, title) {
    const dialogRef = this.dialog.open(CheckinCreateDialogComponent, {
      data: {
        url: url,
        title: title
      },
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deletePg() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Xóa PG',
        title: 'Bạn có muốn xóa PG này không?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onPageChange(event) {

  }

}

