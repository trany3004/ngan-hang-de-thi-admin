import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-gift-create-dialog',
  templateUrl: './gift-create-dialog.component.html',
  styleUrls: ['./gift-create-dialog.component.scss'],
})
export class GiftCreateDialogComponent {
  imageUrl;
  title;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.imageUrl = data.url;
    this.title = data.title;
  }

  createPg() {
  }
}
