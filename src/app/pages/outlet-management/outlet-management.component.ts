import {
  AfterViewInit,
  Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
import { ExportService } from 'src/app/services/export.service';
import { OutletCreateDialogComponent } from './outlet-create-dialog/outlet-create-dialog.component';
import { OutletService } from 'src/app/services/outlet.service';
import { forkJoin, Subscription } from 'rxjs';
import { Cities, Regions } from 'src/app/constant/constant';
import { CurrencyService } from '../common/currency-pipe/currency-pipe.service';
import { AddressDialogComponent } from './checkin-address-dialog/checkin-address-dialog.component';


@Component({
  selector: 'app-outlet-management',
  templateUrl: './outlet-management.component.html',
  styleUrls: ['./outlet-management.component.scss'],
})
export class OutletManagementComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(MatSort) sort: MatSort;

  eventSubscription: Subscription;
  totalCount = 0;

  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['stt', 'name','chuong', 'monhoc', 'khoihoc', 'action'];
  dataSource = new MatTableDataSource([]);
  loading = false;
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0]
  
  };

  ngOnInit() {
    this.init();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  //call API
  init() {
    this.loading = true;
    //ham call API
    this.eventSubscription = this.outletserive.getChuDe()
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.totalCount = data.length;
        this.loading = false;
      }, _ => this.loading = false);
  }

  constructor(public dialog: MatDialog, private exportService: ExportService, private outletserive: OutletService,
    private currencyService: CurrencyService) { }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
  createPg() {
    const dialogRef = this.dialog.open(OutletCreateDialogComponent, {
      width: '50%',
      data: { type: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filter.page = 0;
        this.filter.pageSize = this.pageSizeOptions[0];
        this.init();
      }
    });
  }

  modify(element) {
    const dialogRef = this.dialog.open(OutletCreateDialogComponent, {
      width: '50%',
      data: {
        type: 'update',
        data: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filter.page = 0;
        this.filter.pageSize = this.pageSizeOptions[0];
        this.init();
      }
    });
  }

  deleteObject(id) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Xóa chủ đề',
        title: 'Bạn có muốn xóa chủ đề này không?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.outletserive.xoaChuDe(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.init();
        });
      }
    });
  }

 
  onPageChange({ pageIndex, pageSize }) {
    this.filter.page = pageIndex;
    this.filter.pageSize = pageSize;
    this.init();
  }

  openMap(address) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      data: { address: `https://maps.google.com/maps?q=${address.replace('|', ',')}`}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  

 
}
