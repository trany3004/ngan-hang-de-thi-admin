import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-checkin-address-dialog',
  templateUrl: './checkin-address-dialog.component.html',
  styleUrls: ['./checkin-address-dialog.component.scss'],
})
export class AddressDialogComponent {
  latitude
  longitude
  address: any = 'https://www.google.com/maps'
  zoom = 15;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.address = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.data.address}&z=${this.zoom}&output=embed`);
  }
}
