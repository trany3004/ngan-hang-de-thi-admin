import { MonHocService } from './../../../services/monhoc.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { KhoiHocService } from 'src/app/services/khoihoc.service';
import { ChuongService } from 'src/app/services/chuong.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-product-create-dialog',
  templateUrl: './product-create-dialog.component.html',
  styleUrls: ['./product-create-dialog.component.scss'],
})
export class ProductCreateDialogComponent implements OnInit {
  formGroup: FormGroup;
  groups: any[] = [];
  title: string = '';
  monHocList$: Observable<any[]>;
  khoiHocList$: Observable<any[]>;


  

  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    private fb: FormBuilder,
    private productService: ProductService,
    private monHocService: MonHocService,
    private khoiService: KhoiHocService,
    
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formGroup = this.fb.group({
        ten: [null, Validators.required],
        monhoc: [null, Validators.required],
        khoihoc: [null, Validators.required]
      });
    
  }


  init() { 
    this.monHocList$ = this.monHocService.get();
    this.khoiHocList$ = this.khoiService.get();
    
    if (this.data.type === 'update') {
      this.loading = true;
      const dataUpdated = this.data.data;
        if (dataUpdated) {
          this.formGroup.controls['ten'].setValue(dataUpdated.ten);
          this.formGroup.controls['monhoc'].setValue(dataUpdated.monhoc._id);
          this.formGroup.controls['khoihoc'].setValue(dataUpdated.khoihoc._id);
         
         
        }
        this.loading = false;
      // }, _ => this.loading = false);
    }
  }
  
  ngOnInit(): void {
   
    this.title = this.data.type === 'update' ? 'Cập nhật chương' : 'Tạo chương';
    this.init();
 
  }

 

  create() {
    if (this.formGroup.valid) {
      this.loading = true;
      const value = {...this.formGroup.value};
      if (this.data.type === 'create') {
        this.productService.createChuong(value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        }, _ => this.loading = false);
      }
      if (this.data.type === 'update') {
        this.productService.updateChuong(this.data.data._id, value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        }, _ => this.loading = false);
      }
    }
  }

}
