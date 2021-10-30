import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';


interface Danhmuc {
  value: string;
  viewValue: string;
};
interface Chuyende {
  value: string;
  viewValue: string;
};


@Component({
  selector: 'app-categories-create-dialog',
  templateUrl: './categories-create-dialog.component.html',
  styleUrls: ['./categories-create-dialog.component.scss'],
})
export class CategoriesCreateDialogComponent implements OnInit {
  danhmuc: Danhmuc[] = [
    {value: 'ĐS10.C1', viewValue: 'MỆNH ĐỀ - TẬP HỢP'},
    {value: 'ĐS10.C2', viewValue: 'HÀM SỐ BẬC NHẤT VÀ BẬC HAI'},
    {value: 'ĐS10.C3', viewValue: 'PHƯƠNG TRÌNH – HỆ PHƯƠNG TRÌNH'}
  ];
  chuyende: Chuyende[] = [
    {value: 'mh-0', viewValue: 'Toán học'},
    {value: 'mh-1', viewValue: 'Vật lý'},
    {value: 'mh-2', viewValue: 'Hoá học'},
    {value: 'mh-3', viewValue: 'Sinh học'},
    {value: 'mh-4', viewValue: 'GDCD'},
    {value: 'mh-5', viewValue: 'Địa Lý'},
    {value: 'mh-6', viewValue: 'Tiếng Anh'},
  ];
  

  pgManagementForm: FormGroup;
  title = '';
  buttonTitle = '';
  loading = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  private categoryService: CategoryService,
  public dialogRef: MatDialogRef<CategoriesCreateDialogComponent>) {
    this.title = data.type === 'create' ? 'Create Category' : 'Update Category';
    this.buttonTitle = data.type === 'create' ? 'Create' : 'Update';
    // this.title = data.title;
    this.pgManagementForm = this.fb.group({
      name: [null, Validators.required]
    });
  }
  ngOnInit(): void {
    if (this.data.type === 'update') {
      this.pgManagementForm.controls.name.setValue(this.data.data.name);
    }
  }

  createPg() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      if (this.data.type === 'create') {

        this.categoryService.create(this.pgManagementForm.value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        });
      }
      if (this.data.type === 'update') {
        this.categoryService.update(this.data.data.id, this.pgManagementForm.value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        });
      }
    }
  }
}
