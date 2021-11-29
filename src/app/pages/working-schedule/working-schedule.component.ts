import { OutletService } from "./../../services/outlet.service";
import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { combineLatest, forkJoin, Observable, of, Subscription } from "rxjs";
import { delay, map, switchMap } from "rxjs/operators";
import { ExportService } from "src/app/services/export.service";
import { PromotionService } from "src/app/services/promotion.service";
import { KhoiHocService } from "src/app/services/khoihoc.service";
import { ChuongService } from "src/app/services/chuong.service";
import { MonHocService } from "src/app/services/monhoc.service";
import { WorkingSheduleService } from "src/app/services/working-schedule.service";
import { DeleteDialogComponent } from "../common/delete-dialog/delete-dialog.component";
import { WorkingScheduleCreateDialogComponent } from "./working-schedule-create-dialog/working-schedule-create-dialog.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
export interface CauhoiElement {
  id: number;
  noidung: string;
}

@Component({
  selector: "app-working-schedule-management",
  templateUrl: "./working-schedule.component.html",
  styleUrls: ["./working-schedule.component.scss"],
})
export class WorkingScheduleComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  
  formGroup: FormGroup;
  monHocList$: Observable<any[]>;
  khoiHocList$: Observable<any[]>;
  chuongList$: Observable<any[]>;
  outletList$: Observable<any[]>;

  displayedColumns: string[] = [
    "stt",
    "noidung",
    "khoihoc",
    "monhoc",
    "chude",
    "chuong",
    "mucDo",
    "loai",
    "action"
  ];
  hidePagination = false;
  pageSizeOptions = [25, 500];
  exporting = false;
  dataNormal: any[] = [];

  loadingSubscription: Subscription;
  eventSubscription: Subscription;
  filter: any = {
    page: 0,
    pageSize: this.pageSizeOptions[0],
    startDate_gte: null,
    endDate_lt: null,
  };
  totalCount = 0;

  loading = false;

  filterTimeout;

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private outletService: OutletService,
    private workingService: WorkingSheduleService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private promotionService: PromotionService,
    private monHocService: MonHocService,
    private chuongHocService: ChuongService,
    private khoiService: KhoiHocService
  ) // private router: ActivatedRoute

  {
    this.formGroup = this.fb.group({
      monhoc: [null],
      cauhoi: [""],
      chuong: [null],
      khoihoc: [null],
      chude: [null],
      loai: [null, []],
      mucDo: [null],
    });
  }

  displayMucDo(mucDo) {
    if (mucDo == 1) return "Dễ";
    if (mucDo == 2) return "Trung bình";
    if (mucDo == 3) return "Khó";
  }

  displayLoai(e) {
    if (e.isDrapDrop) return "Kéo thả đáp án";
    if (e.multipleAnswer) return "Nhiều đáp án đúng";
    if (!e.multipleAnswer) return "Một đáp án đúng";
  }
  ngOnInit() {
    this.init();
    this.getData();
    combineLatest(
      this.formGroup.get("monhoc").valueChanges.pipe(delay(200)),
      this.formGroup.get("khoihoc").valueChanges.pipe(delay(200)),
      this.formGroup.get("chuong").valueChanges.pipe(delay(200))
    ).subscribe(() => {
      if (!this.disableChuDe()) {
        this.outletList$ = this.outletService.getChuDeByCondition({
          mon: this.formGroup.get("monhoc").value,
          khoi: this.formGroup.get("khoihoc").value,
          chuong: this.formGroup.get("chuong").value,
        });
      }
      if (!this.disableChuong()) {
        this.chuongList$ = this.chuongHocService.get({
          monhoc: this.formGroup.get("monhoc").value,
          khoihoc: this.formGroup.get("khoihoc").value,
        });
      }
    });
    combineLatest(
      this.formGroup.get("monhoc").valueChanges.pipe(delay(200)),
      this.formGroup.get("khoihoc").valueChanges.pipe(delay(200))
    ).subscribe(() => {
      if (!this.disableChuong()) {
        this.chuongList$ = this.chuongHocService.get({
          monhoc: this.formGroup.get("monhoc").value,
          khoihoc: this.formGroup.get("khoihoc").value,
        });
      }
    });
  }

  init() {
    this.monHocList$ = this.monHocService.get();
    this.chuongList$ = this.chuongHocService.get();
    this.khoiHocList$ = this.khoiService.get();
  }

  disableChuong() {
    return (
      !this.formGroup.get("monhoc").value ||
      !this.formGroup.get("khoihoc").value
    );
  }
  disableChuDe() {
    return (
      !this.formGroup.get("monhoc").value ||
      !this.formGroup.get("khoihoc").value ||
      !this.formGroup.get("chuong").value
    );
  }

  getData() {
    const query = { ...this.formGroup.value };
    if (query.loai) {
      query.multipleAnswer = ["1", "2"].includes(query.loai);
      if (query.loai === "3") query.isDrapDrop = true;
    }
    if (query.mucDo) query.mucDo = +query.mucDo;
    delete query.loai;

    this.promotionService.fetch(this.formGroup.value).subscribe((rs) => {
      this.dataSource = new MatTableDataSource(rs);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  applyFilter() {
    this.getData();
  }
  createPg() {
    const dialogRef = this.dialog.open(WorkingScheduleCreateDialogComponent, {
      width: "50%",
      data: {
        type: "create",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.init();
      }
    });
  }

  modifyPg(id) {
    console.log(id);
    const dialogRef = this.dialog.open(WorkingScheduleCreateDialogComponent, {
      width: "50%",
      data: {
        type: "update",
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.init();
      }
    });
  }

  deleteObject(id) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Xóa câu hỏi',
        title: 'Bạn có muốn xóa  câu hỏi này không?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workingService.xoaCauHoi(id).subscribe(res => {
          this.filter.page = 0;
          this.filter.pageSize = this.pageSizeOptions[0];
          this.getData();
        });
      }
    });
  }
  onPageChange({ pageIndex, pageSize }) {
    this.filter.page = pageIndex;
    this.filter.pageSize = pageSize;
    this.init();
  }


  
}
