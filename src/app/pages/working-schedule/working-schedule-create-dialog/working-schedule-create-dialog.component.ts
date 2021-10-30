import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { OutletService } from 'src/app/services/outlet.service';
import { UserService } from 'src/app/services/user.service';
import { WorkingSheduleService } from 'src/app/services/working-schedule.service';
@Component({
  selector: 'app-working-schedule-create-dialog',
  templateUrl: './working-schedule-create-dialog.component.html',
  styleUrls: ['./working-schedule-create-dialog.component.scss'],
})
export class WorkingScheduleCreateDialogComponent {
  pgManagementForm: FormGroup;
  loading = false;
  title = '';
  filterDateFrom = null;
  filterDateTo = null;

  users: any[] = [];
  outlets: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<WorkingScheduleCreateDialogComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private workingService: WorkingSheduleService,
    private outletService: OutletService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pgManagementForm = this.fb.group({
      pg_user: [null, Validators.required],
      pg_outlet: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }

  createPg() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      const dataToSend = {
        ...this.pgManagementForm.value,
        startDate: new Date(this.pgManagementForm.value.startDate),
        endDate: new Date(this.pgManagementForm.value.endDate)
      }
      if (this.data.type === 'create') {
        console.log(this.pgManagementForm.value);
        this.workingService.create(dataToSend).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        }, _ => this.loading = false);
      }
      if (this.data.type === 'update') {
        this.workingService.update(this.data.id, dataToSend).subscribe(res => {
          this.loading = false;
          this.dialogRef.close(res);
        }, _ => this.loading = false);
      }
    }
  }

  init() {
    this.title = this.data.type === 'update' ? 'Update Working Schedule' : 'Create Working Schedule';
    if (this.data.type === 'update') {
      this.loading = true;
      this.workingService.get(this.data.id).subscribe((res: any) => {
        if (res) {
          this.pgManagementForm.controls['pg_user'].setValue(res.pg_user ? res.pg_user.id : null);
          this.pgManagementForm.controls['pg_outlet'].setValue(res.pg_outlet ? res.pg_outlet.id : null);
          this.pgManagementForm.controls['startDate'].setValue(res.startDate);
          this.pgManagementForm.controls['endDate'].setValue(res.endDate);
          this.filterDateFrom = res.startDate;
          this.filterDateTo = res.endDate;
        }
        console.log(this.pgManagementForm.value);
        this.loading = false;
      }, _ => this.loading = false);
    }
  }

  getUserAndOutlet() {
    this.loading = true;
    // forkJoin([
    //   this.userService.fetchUsers(),
    //   this.outletService.fetchoutlets()
    // ]).subscribe(([users, outlets]) => {
    //   this.users = users;
    //   this.outlets = outlets;
    //   this.loading = false;
    // }, _ => this.loading = false)
  }

  ngOnInit(): void {
    this.init();
    this.getUserAndOutlet();
  }
}
