import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-checkin-address-dialog',
  templateUrl: './checkin-address-dialog.component.html',
  styleUrls: ['./checkin-address-dialog.component.scss'],
})
export class CheckinAddressDialogComponent {
  latitude
  longitude
  address = ''
  zoom = 15;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.address = `${data.address}&z=${this.zoom}&output=embed`;
  }
}
