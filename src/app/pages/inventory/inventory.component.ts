import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";

import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ExportService } from "src/app/services/export.service";
import { combineLatest, forkJoin, Observable, of, Subscription } from "rxjs";
import { delay, switchMap } from "rxjs/operators";
import { OutletService } from "src/app/services/outlet.service";
import { InventoryService } from "src/app/services/inventory.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { InventoryCreateDialogComponent } from "./inventory-create-dialog/inventory-create-dialog.component";
import { KhoiHocService } from "src/app/services/khoihoc.service";
import { ChuongService } from "src/app/services/chuong.service";
import { MonHocService } from "src/app/services/monhoc.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DeleteDialogComponent } from "../common/delete-dialog/delete-dialog.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

export interface CauhoiElement {
  id: number;
  noidung: string;
}

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent {
  formGroup: FormGroup;
  monHocList$: Observable<any[]>;
  khoiHocList$: Observable<any[]>;
  chuongList$: Observable<any[]>;
  outletList$: Observable<any[]>;
  listCauHoi: any = {
    de: [],
    trungBinh: [],
    kho: [],
  };
  hidePagination = false;
  pageSizeOptions = [5, 10, 25, 100];
  loadSubscription: Subscription;
  categories: any[] = [];
  slCauHoi: number = 0;

  displayedColumns: string[] = ["noidung"];
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
  ontap: any = null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private outletService: OutletService,
    private inventoryService: InventoryService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private monHocService: MonHocService,
    private chuongHocService: ChuongService,
    private khoiService: KhoiHocService // private router: ActivatedRoute
  ) {
    this.formGroup = this.fb.group({
      monhoc: [null],
      cauhoi: [""],
      chuong: [null],
      khoihoc: [null],
      chude: [null],
      loai: [null, []],
      mucDo: [null],
      time: 0
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
    this.loading = true;
    const value = { ...this.formGroup.value };
    const query: any = {
     
    };
    if (value.chude) {
      query.chude = value.chude
    }

    this.inventoryService.fetch(query).subscribe(
      (rs) => {
        this.ontap = rs;
        this.formGroup.controls.time.setValue(rs?.time ? rs.time/60000 : 0);
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  taoCauHoi(mucDo, slCauHoi) {
    this.loading = true;
    const data = {
      chude: this.formGroup.value.chude,
      mucDoList: [{ mucDo: +mucDo, soLuong: +slCauHoi }],
    };
    this.inventoryService.taoCauHoiTuDong(data).subscribe(
      (rs) => {
        const property = mucDo == 1 ? "de" : mucDo == 2 ? "trungBinh" : "kho";
        this.listCauHoi[property] = rs[0];
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // ngOnDestroy(): void {
  //   if (this.eventSubscription) {
  //     this.eventSubscription.unsubscribe();
  //   }
  // }

  applyFilter() {
    this.getData();
  }

  onPageChange(event) {
    this.filter.page = event.pageIndex;
    this.filter.pageSize = event.pageSize;
    this.init();
  }

  getListCauHoi(cauhoi) {
    let rs = [];
    Object.keys(cauhoi).forEach((mucDo) => {
      rs = rs.concat(cauhoi[mucDo].map((c) => c._id))
    })
    return rs;

  }

  drop(event: CdkDragDrop<string[]>, element: any) {
    moveItemInArray(
      element.dapAn,
      event.previousIndex,
      event.currentIndex
    );
  }

  changeDapAn(index, element) {
    element.dapAn.forEach((e) => (e.selected = false));
    element.dapAn[index].selected = true;
  }
  
  taoOnTap() {
    this.loading = true;
    const payload = {
      chude: this.formGroup.value.chude,
      time: Number(this.formGroup.value.time),
      cauhoi: this.getListCauHoi(this.listCauHoi)
    }
    return this.inventoryService.taoOnTap(payload).subscribe(() => {
      this.getData();
    }, _ => this.loading = false);

  }
}
