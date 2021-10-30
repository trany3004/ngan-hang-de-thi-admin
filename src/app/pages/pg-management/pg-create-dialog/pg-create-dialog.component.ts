import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
interface Kythi {
  value: string;
  viewValue: string;
};
interface Monhoc1 {
  value: string;
  viewValue: string;
};
interface Made {
  value: string;
  viewValue: string;
};



@Component({
  selector: 'app-pg-management',
  templateUrl: './pg-create-dialog.component.html',
  styleUrls: ['./pg-create-dialog.component.scss'],
})
export class PGCreateDialogComponent implements OnInit {


  
kythi: Kythi[] = [
  {value: 'lop-0', viewValue: 'Kỳ thi lớp 10'}
];
monhoc: Monhoc1[] = [
  {value: 'mh-0', viewValue: 'Toán học'},
  {value: 'mh-1', viewValue: 'Vật lý'},
  {value: 'mh-2', viewValue: 'Hoá học'},
  {value: 'mh-3', viewValue: 'Sinh học'},
  {value: 'mh-4', viewValue: 'GDCD'},
  {value: 'mh-5', viewValue: 'Địa Lý'},
  {value: 'mh-6', viewValue: 'Tiếng Anh'},
  {value: 'mh-7', viewValue: 'Lịch sử'},
];
made: Made[] = [
  {value: 'tg-0', viewValue: 'Mã đề 001'},
  {value: 'tg-1', viewValue: 'Mã đề 002'}

];

panelOpenState = false;
  pgManagementForm: FormGroup;
  isUserFormSubmitted = false;
  title: string = '';
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<PGCreateDialogComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pgManagementForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      username: [null, Validators.required],
      role: [null, Validators.required],
      password: [null, Validators.required],
      mobile: [null, [Validators.pattern('\\d{10}\\d?')]]
    });
  }
  ngOnInit(): void {
    if (this.data.type === 'update') {
      this.initUsers();
    }

    this.title = this.data.type === 'create' ? 'Create User' : 'Update User'
  }

  initUsers() {
    this.loading = true;
    // this.userService.getUser(this.data.id).subscribe((res: any) => {
      const res = this.data.data;
      if (res) {
        this.pgManagementForm.controls['username'].disable();
        this.pgManagementForm.controls['name'].setValue(res.name);
        this.pgManagementForm.controls['email'].setValue(res.email);
        this.pgManagementForm.controls['username'].setValue(res.username);
        // this.pgManagementForm.controls['password'].setValue(res.password);
        this.pgManagementForm.controls['role'].setValue(res.role);
        this.pgManagementForm.controls['mobile'].setValue(res.mobile);
        this.pgManagementForm.controls['password'].setValidators([]);
        this.pgManagementForm.controls['password'].updateValueAndValidity();
      }
      this.loading = false;
    // }, _ => this.loading = false);
  }

  createPg() {
    this.isUserFormSubmitted = true;
    if (this.pgManagementForm.valid) {
      this.loading = true;
      if (this.data.type === 'create') {

        this.userService.createUser(this.pgManagementForm.value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        });
      }
      if (this.data.type === 'update') {
        if (!this.pgManagementForm.value.password) {
          delete this.pgManagementForm.value.password;
        }
        this.userService.updateUser(this.data.data.id, this.pgManagementForm.value).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        });
      }
    }
  }
}
