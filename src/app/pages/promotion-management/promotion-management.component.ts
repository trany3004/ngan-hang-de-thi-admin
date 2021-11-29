import { MathContent } from './../../math/math-content';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { KhoiHocService } from "src/app/services/khoihoc.service";
import { ChuongService } from "src/app/services/chuong.service";
import { MonHocService } from "src/app/services/monhoc.service";

import { PromotionService } from "src/app/services/promotion.service";
import { OutletService } from "src/app/services/outlet.service";
import { combineLatest, Observable } from "rxjs";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import * as ClassicEditor from "../../../assets/js/ck-editor-math-type/ckeditor.js";
import { ActivatedRoute } from "@angular/router";
import { delay } from "rxjs/operators";
import { T } from '@angular/cdk/keycodes';

@Component({
  selector: "app-product-management",
  templateUrl: "./promotion-management.component.html",
  styleUrls: ["./promotion-management.component.scss"],
})
export class PromotionManagementComponent {
  title = "ckeditorwithMath";
  data = "";
  editorData = "";
  alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  favoriteSeason: string;
  // seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  formGroup: FormGroup;
  regions: any[] = [];
  cities: any[] = [];
  groups: any[] = [];
  // title: string = '';
  monHocList$: Observable<any[]>;
  khoiHocList$: Observable<any[]>;
  chuongList$: Observable<any[]>;
  outletList$: Observable<any[]>;

  mode = "create";
  dapAnDung = null;

  id;

  loading = false;

  public Editor = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private promotionService: PromotionService,
    private monHocService: MonHocService,
    private outletService: OutletService,
    private chuongHocService: ChuongService,
    private khoiService: KhoiHocService,
    private router: ActivatedRoute
  ) {
    this.formGroup = this.fb.group({
      ten: [null, Validators.required],
      monhoc: [null, Validators.required],
      noidung: ['', Validators.required],
      chuong: [null, Validators.required],
      khoihoc: [null, Validators.required],
      chude: [null, Validators.required],
      danhSachDapAn: this.fb.array([]),
      loai: [null, []],
      mucDo: [null, Validators.required],
      giaithich: ['', []],
      dapAnDung: this.fb.array([])
    });
  }

  get danhSachDapAn(): FormArray {
    return this.formGroup.get("danhSachDapAn") as FormArray;
  }

  get danhSachDapAnDung(): FormArray {
    return this.formGroup.get("dapAnDung") as FormArray;
  }

  changeRadio(i) {
    console.log(i)
    const selectedList = this.danhSachDapAn.value as any;
    selectedList.forEach((c, index) => c.selected = index === i ? true : false);
    this.danhSachDapAn.patchValue(selectedList);
  }
  ngOnInit() {
    const id = this.router.snapshot.paramMap.get("id");
    this.mode = id ? "update" : "create";
    this.id = id;
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
      this.formGroup.get("khoihoc").valueChanges.pipe(delay(200)),
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
    this.khoiHocList$ = this.khoiService.get();

    if (this.mode === "update") {
      this.loading = true;
      this.promotionService.getCauHoiById(this.id).subscribe((dataUpdated) => {
        if (dataUpdated) {
          this.formGroup.controls["monhoc"].setValue(dataUpdated.monhoc);
          this.formGroup.controls["khoihoc"].setValue(dataUpdated.khoihoc);
          this.formGroup.controls["chuong"].setValue(dataUpdated.chuong);
          this.formGroup.controls["noidung"].setValue(dataUpdated.cauhoi);
          this.formGroup.controls["chude"].setValue(dataUpdated.chude._id);
          this.formGroup.controls["chude"].setValue(dataUpdated.chude._id);
          this.formGroup.controls["loai"].setValue(dataUpdated.isDrapDrop ? '3' : dataUpdated.multipleAnswer ? '2' : '1');
          this.formGroup.controls["mucDo"].setValue(String(dataUpdated.mucDo));
          this.formGroup.controls["giaithich"].setValue(dataUpdated.giaithich);
          if (dataUpdated.isDrapDrop) {
            const dapAns = dataUpdated.dapAn.map((d) => ({
              selected: false,
              noidung: d
            }))
            dapAns.forEach((e) => {
              this.addAnswer()
            })
            this.formGroup.controls['danhSachDapAn'].patchValue(dapAns);
            const dapAnDung = dataUpdated.dapAnDung.map((d) => {
              const index = dataUpdated.dapAn.indexOf(d);
              return index
            })
            this.formGroup.controls['dapAnDung'].patchValue(dapAnDung);
          } else {
            const dapAns = dataUpdated.dapAn.map((d) => ({
              selected: dataUpdated.dapAnDung.indexOf(d) > -1,
              noidung: d
            }))
            dapAns.forEach((e) => {
              this.addAnswer()
            })
            this.formGroup.controls['danhSachDapAn'].patchValue(dapAns);
          }
        }
        this.loading = false
      }, () => this.loading = false);
    }
  }

  

  addAnswer() {
    const dataFormGroup = this.fb.group({
      selected: false
    })
    dataFormGroup.addControl('noidung', new FormControl('', Validators.required));
    this.danhSachDapAn.push(dataFormGroup);
    const dapAnDung = this.fb.control(this.danhSachDapAn.controls.length - 1);
    this.danhSachDapAnDung.push(dapAnDung);
    console.log(this.danhSachDapAnDung)
    console.log(this.danhSachDapAn.value[this.danhSachDapAnDung.value[0]]['noidung'])

  }

  xoaDapAn(i) {
    this.danhSachDapAn.removeAt(i);
    const index = this.danhSachDapAnDung.value.find((e) => e === i);
    this.danhSachDapAnDung.removeAt(index);
    const value = this.danhSachDapAnDung.value.map((i, index) => index);
    this.danhSachDapAnDung.patchValue(value);
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

  drop(event: CdkDragDrop<string[]>) {
    const value = this.danhSachDapAnDung.value;
    moveItemInArray(value, event.previousIndex, event.currentIndex);
    this.danhSachDapAnDung.patchValue(value);
  }

  getValue(i): MathContent {
   const index = this.dapAnDung.value[i];
   return {mathml: this.danhSachDapAn.value[index].noidung};
  }

  save() {
    console.log(this.formGroup.value);
    const {chude, noidung, giaithich, danhSachDapAn, mucDo, loai} = this.formGroup.value;
    const payload: any = {
      isDrapDrop: loai === '3' ? true : false,
      chude,
      cauhoi: noidung,
      giaithich,
      dapAn: danhSachDapAn.map((e) => e.noidung),
      mucDo: Number(mucDo)
    }
    if (loai !== '3') {
      payload.dapAnDung = danhSachDapAn.filter((e) => e.selected).map((e) => e.noidung)
    } else {
      const dapAn = [];
      this.danhSachDapAnDung.value.forEach((e) => {
        dapAn.push(danhSachDapAn[e].noidung);
      })
      payload.dapAnDung = dapAn;
    }
    this.promotionService.createCauHoi(payload)
    .subscribe(() => {
      console.log('Tao xong')
    })
    //call All

  }
}
