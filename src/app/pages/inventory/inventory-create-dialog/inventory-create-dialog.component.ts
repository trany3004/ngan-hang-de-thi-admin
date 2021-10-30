import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';
import { InventoryService } from 'src/app/services/inventory.service';
import { OutletService } from 'src/app/services/outlet.service';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-inventory-create-dialog',
  templateUrl: './inventory-create-dialog.component.html',
  styleUrls: ['./inventory-create-dialog.component.scss'],
})
export class InventoryCreateDialogComponent implements OnInit {
  pgManagementForm: FormGroup;
  subscription: Subscription;
  products = [];
  outlets = [];
  loading;
  constructor(
    public dialogRef: MatDialogRef<InventoryCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private outletService: OutletService,
    private productService: ProductService,
    private inventoryService: InventoryService) {
    this.pgManagementForm = this.fb.group({
      before: [null, [Validators.required, Validators.pattern('\\d*')]],
      after: [null, [Validators.required, Validators.pattern('\\d*')]],
      pg_outlet: [null, Validators.required],
      pg_product: [null, Validators.required],
      createdAt: [null, []]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    const dataUpdated = this.data;
      // if (dataUpdated) {
      //   this.subscription = forkJoin([
      //     this.outletService.fetchoutlets(),
      //     this.productService.fetch()
      //   ]).subscribe(([outlets, products]) => {
      //     this.outlets = outlets;
      //     this.products = products;
      //     this.pgManagementForm.controls['before'].setValue(dataUpdated.before);
      //     this.pgManagementForm.controls['after'].setValue(dataUpdated.after);
      //     this.pgManagementForm.controls['pg_outlet'].setValue(dataUpdated.pg_outlet.id);
      //     this.pgManagementForm.controls['pg_product'].setValue(dataUpdated.pg_product.id);
      //     this.pgManagementForm.controls['createdAt'].setValue(dataUpdated.createdAt);
      //     this.pgManagementForm.controls['createdAt'].disable();
      //     this.loading = false;
      //   }, () => this.loading = false)
      // }
  }

  update() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      const value = {...this.pgManagementForm.value};
      delete value.createdAt;
      this.inventoryService.update(this.data.id, value).subscribe(res => {
        this.loading = false;
        this.dialogRef.close(res);
      }, _ => this.loading = false);
    }
  }

}
