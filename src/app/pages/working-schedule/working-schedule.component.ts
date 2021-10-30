import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ExportService } from 'src/app/services/export.service';
import { OutletService } from 'src/app/services/outlet.service';
import { WorkingSheduleService } from 'src/app/services/working-schedule.service';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
import { WorkingScheduleCreateDialogComponent } from './working-schedule-create-dialog/working-schedule-create-dialog.component';
export interface CauhoiElement {
  id: number;
  noidung: string;
}

const ELEMENT_DATA: CauhoiElement[] = [
  {  id: 1, noidung: 'Tính đơn điệu'},
  {  id: 2, noidung: 'Tính đơn điệu'}
];
@Component({
  selector: 'app-working-schedule-management',
  templateUrl: './working-schedule.component.html',
  styleUrls: ['./working-schedule.component.scss'],
})

export class WorkingScheduleComponent implements OnInit, AfterViewInit, OnDestroy{
  displayedColumns: string[] = ['id', 'noidung', 'outlet'];
  hidePagination = false;
  pageSizeOptions = [25, 500];
  exporting = false;
  dataNormal: any[] = [];

  loadingSubscription: Subscription;
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
    startDate_gte: null,
    endDate_lt: null
  };
  totalCount = 0;
  loading = false;

  filterTimeout;
  
  dataSource = new MatTableDataSource([]);


  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(public dialog: MatDialog, private exportService: ExportService,
    private outletService: OutletService,
    private workingService: WorkingSheduleService,
    private datePipe: DatePipe) { }
    ngOnDestroy(): void {
      if (this.loadingSubscription) {
        this.loadingSubscription.unsubscribe();
      }
    }
    
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }
    ngOnInit(): void {
      this.init();
    }
   
  init() {
    console.log(this.filter)
    this.loading = true;
    if(this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    this.loadingSubscription = forkJoin([
      this.workingService.fetch(this.filter),
      this.workingService.getTotalRecords(this.filter)
    ]).subscribe(([workingSchedule, total]) => {
      this.mapData(workingSchedule);
      this.totalCount = total;
      this.loading = false;
    }, _ => {
      this.loading = false;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  createPg() {
    const dialogRef = this.dialog.open(WorkingScheduleCreateDialogComponent, {
      width: '50%',
      data: {
        type: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.init();
      }
    });
  }

  modifyPg(id) {
    console.log(id)
    const dialogRef = this.dialog.open(WorkingScheduleCreateDialogComponent, {
      width: '50%',
      data: {
        type: 'update',
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.init();
      }
    });
  }


  deletePg(id) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Delete Working Schedule',
        title: 'Do you want to delete this Working Schedule?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.workingService.delete(id).subscribe(() => {
          this.filter.page = 0;
          this.init();
        })
      }
    });
  }


  export() {
    this.exporting = true;
    const fileName = 'Working Schedule';
    const header: any = { id: 'Schedule Id', noidung: 'NNA Name', outlet: 'OutletName'};
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
      this.workingService.fetch(newFilter)
        .subscribe((rs) => {
        let dataExport = this.mappingDataAndDontSet(rs);
        data = data.concat(dataExport);
        this.exportService.exportExcel(data, fileName, true, [fileName]);
        this.exporting = false;
      }, _ => {
        this.exporting = false;
      })
    }
  }

  mappingDataAndDontSet(list) {
    const data: any = list.map((schedule) => {
      const mapped = {
        startDate: schedule.startDate ? this.datePipe.transform(schedule.startDate, 'dd/MM/yyyy HH:mm') : '',
        endDate: schedule.endDate ? this.datePipe.transform(schedule.endDate, 'dd/MM/yyyy HH:mm') : '',
        user: schedule['pg_user'] ? schedule['pg_user'].name : '',
        outlet: schedule['pg_outlet'] ? schedule['pg_outlet'].name : '',
        id: schedule.id,
        username: schedule['pg_user'] ? schedule['pg_user'].username : '', 
      }
      return mapped
    })
    return data;
  }

  onPageChange(event) {
    this.filter.page = event.pageIndex;
    this.filter.pageSize = event.pageSize;
    this.init();
  }

  mapData(schedules = []) {
    const data: any = this.mappingDataAndDontSet(schedules);
    this.dataNormal = data;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

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
  //         let list = [];
  //         (rs || []).map(({pg_working_sheets}) => {
  //           list = list.concat(pg_working_sheets);
  //         })
  //         return of(list);
  //       })).pipe(switchMap((rs) => {
  //         let ids = rs.filter(({id}) => id).map(({id}) => id);
  //         const filterDate = {
  //           startDate_gte: startDate || null,
  //           endDate_lt: endDate || null
  //         }
  //         return this.workingService.fetchByIds(ids, filterDate)
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
  //         this.filter.startDate_gte = startDate || null;
  //         this.filter.endDate_lt = endDate || null;
  //         this.filter.page = 0;
  //         this.filter.pageSize = this.pageSizeOptions[0];
  //         this.init();
  //     }, 100)
  //   }
  // }

}
