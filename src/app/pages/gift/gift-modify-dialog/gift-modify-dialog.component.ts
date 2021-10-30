import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';
import { GiftService } from 'src/app/services/gift.service';
import { OutletService } from 'src/app/services/outlet.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadMediaService } from 'src/app/services/upload-media-service';
@Component({
  selector: 'app-gift-modify-dialog',
  templateUrl: './gift-modify-dialog.component.html',
  styleUrls: ['./gift-modify-dialog.component.scss'],
})
export class GiftModifyDialogComponent implements OnInit, OnDestroy {
  pgManagementForm: FormGroup;
  subscription: Subscription;
  outlets = [];
  category = '';
  loading;
  selectedFile: File = null;
  filterDateFrom;
  filterDateTo;
  imageUpdated: any = {};
  products = [];
  constructor(
    public dialogRef: MatDialogRef<GiftModifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private outletService: OutletService,
    private uploadMediaService: UploadMediaService,
    private productService: ProductService,
    private giftService: GiftService) {
    this.pgManagementForm = this.fb.group({
      customerName: [null, [Validators.required]],
      pg_outlet: [null, Validators.required],
      customerMobile: [null, [Validators.required, Validators.pattern('\\d*')]],
      pg_product: [null, Validators.required],
      note: [null, []]
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loading = true;
    const dataUpdated = this.data;
      // if (dataUpdated) {
      //   this.subscription = forkJoin([
      //     // this.outletService.fetchoutlets(),
      //     this.productService.fetch()
      //   // ]).subscribe(([outlets, products]) => {
      //   //   this.outlets = outlets;
      //   //   this.products = products;
      //   //   this.pgManagementForm.controls['pg_outlet'].setValue(dataUpdated.pg_outlet.id);
      //   //   this.pgManagementForm.controls['pg_product'].setValue(dataUpdated.pg_product.id);
      //   //   this.pgManagementForm.controls['customerName'].setValue(dataUpdated.customerName);
      //   //   this.pgManagementForm.controls['note'].setValue(dataUpdated.note);
      //   //   this.pgManagementForm.controls['customerMobile'].setValue(dataUpdated.customerMobile);
      //   //   this.imageUpdated = dataUpdated.receipt;
      //   //   this.loading = false;
      //   // }, () => this.loading = false)
      // }
  }


  getProduct() {

  }

  update() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      const value = {...this.pgManagementForm.value};
      delete value.reportDate;
      value.receipt = this.imageUpdated;
      this.giftService.update(this.data.id, value).subscribe(res => {
        this.loading = false;
        this.dialogRef.close(res);
      }, _ => this.loading = false);
    }
  }

  onFileSelected(event, type) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.size <= 1000000) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
          const that = this;
            reader.onload = function (e: any) {
              that.imageUpdated = e.target.result;
            };
            reader.readAsDataURL(this.selectedFile);
            this.uploadMediaService.upload(this.selectedFile).subscribe(res => {
              if (res && res.length) {
                this.imageUpdated = res[0];
              }
              },
              errors => {
                  console.error(errors);
              }
            );
        }
    } else {
    }
  }

  deleteImage() {
    this.imageUpdated = null
  }
  
}

