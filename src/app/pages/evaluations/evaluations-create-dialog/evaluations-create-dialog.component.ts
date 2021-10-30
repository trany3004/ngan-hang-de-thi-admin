import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-evaluations-create-dialog',
  templateUrl: './evaluations-create-dialog.component.html',
  styleUrls: ['./evaluations-create-dialog.component.scss'],
})
export class EvaluationsCreateDialogComponent {
  pgManagementForm: FormGroup;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder) {
    this.pgManagementForm = this.fb.group({
      name: [null, Validators.required],
      identityCard: [null, Validators.required],
      address: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
    });
  }

  createPg() {
    console.log('ahihi');
  }
}
