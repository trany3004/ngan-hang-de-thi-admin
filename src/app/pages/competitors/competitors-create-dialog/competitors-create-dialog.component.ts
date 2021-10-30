import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-competitors-create-dialog',
  templateUrl: './competitors-create-dialog.component.html',
  styleUrls: ['./competitors-create-dialog.component.scss'],
})
export class CompetitorsCreateDialogComponent {
  images;
  title;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.images = data.images;
    this.title = data.title;
    console.log(this.images)
  }

  createPg() {
    console.log('ahihi');
  }
}

