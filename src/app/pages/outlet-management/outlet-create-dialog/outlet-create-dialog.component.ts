import { MonHocService } from './../../../services/monhoc.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Cities, Groups, Regions } from 'src/app/constant/constant';
import { OutletService } from 'src/app/services/outlet.service';
import { KhoiHocService } from 'src/app/services/khoihoc.service';
import { ChuongService } from 'src/app/services/chuong.service';
@Component({
  selector: 'app-outlet-management',
  templateUrl: './outlet-create-dialog.component.html',
  styleUrls: ['./outlet-create-dialog.component.scss'],
})
export class OutletCreateDialogComponent implements OnInit{
  formGroup: FormGroup;
  regions: any[] = [];
  cities: any[] = [];
  groups: any[] = [];
  title: string = '';
  monHocList$: Observable<any[]>;
  khoiHocList$: Observable<any[]>;
  chuongList$: Observable<any[]>;

  

  loading = false;

  constructor(
    public dialogRef: MatDialogRef<OutletCreateDialogComponent>,
    private fb: FormBuilder,
    private outletService: OutletService,
    private monHocService: MonHocService,
    private chuongHocService: ChuongService,
    private khoiService: KhoiHocService,
    
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formGroup = this.fb.group({
        ten: [null, Validators.required],
        monhoc: [null, Validators.required],
        chuong: [null, Validators.required],
        khoihoc: [null, Validators.required]
      });
    
  }


  init() { 
    this.monHocList$ = this.monHocService.get();
    this.chuongList$ = this.chuongHocService.get();
    this.khoiHocList$ = this.khoiService.get();
    
    if (this.data.type === 'update') {
      this.loading = true;
      const dataUpdated = this.data.data;
        if (dataUpdated) {
          this.formGroup.controls['ten'].setValue(dataUpdated.ten);
          this.formGroup.controls['monhoc'].setValue(dataUpdated.monhoc._id);
          this.formGroup.controls['khoihoc'].setValue(dataUpdated.khoihoc._id);
          this.formGroup.controls['chuong'].setValue(dataUpdated.chuong._id);
         
        }
        this.loading = false;
      // }, _ => this.loading = false);
    }
  }
  
  ngOnInit(): void {
    this.cities = Cities;
    this.groups = Regions;
    this.title = this.data.type === 'update' ? 'Cập nhật chủ đề' : 'Tạo chủ đề';
    this.init();
 
  }

 

  create() {
    if (this.formGroup.valid) {
      this.loading = true;
      const value = {...this.formGroup.value};
      if (this.data.type === 'create') {
        this.outletService.createChuDe(value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        }, _ => this.loading = false);
      }
      if (this.data.type === 'update') {
        this.outletService.update(this.data.data._id, value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        }, _ => this.loading = false);
      }
    }
  }

}
