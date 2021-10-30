import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { LotDateService } from 'src/app/services/lot-date.service';
import { OutletService } from 'src/app/services/outlet.service';
import { ProductService } from 'src/app/services/product.service';
import { InventoryCreateDialogComponent } from '../../inventory/inventory-create-dialog/inventory-create-dialog.component';
@Component({
  selector: 'app-lot-date-create-dialog',
  templateUrl: './lot-date-create-dialog.component.html',
  styleUrls: ['./lot-date-create-dialog.component.scss'],
})
export class LotDateCreateDialogComponent {
  pgManagementForm: FormGroup;
  subscription: Subscription;
  products = [];
  outlets = [];
  categories = [];
  category = '';
  loading;
  constructor(
    public dialogRef: MatDialogRef<InventoryCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private outletService: OutletService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private lotDateService: LotDateService) {
    this.pgManagementForm = this.fb.group({
      pg_product: [null, [Validators.required]],
      pg_outlet: [null, Validators.required],
      expiredDate: [null, Validators.required],
      reportDate: [null, []]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    const dataUpdated = this.data;
      if (dataUpdated) {
        this.subscription = forkJoin([
          this.outletService.fetchoutlets(),
          this.productService.fetch(),
          this.categoryService.fetch()
        ]).subscribe(([outlets, products, categories]) => {
          this.outlets = outlets;
          this.products = products;
          this.categories = categories;
          this.pgManagementForm.controls['pg_outlet'].setValue(dataUpdated.pg_outlet.id);
          this.pgManagementForm.controls['pg_product'].setValue(dataUpdated.pg_product.id);
          this.pgManagementForm.controls['expiredDate'].setValue(dataUpdated.expiredDate);
          this.pgManagementForm.controls['reportDate'].setValue(dataUpdated.reportDate);
          this.loading = false;
        }, () => this.loading = false)
      }
  }

  getCategory(product) {
    if (product && product.pg_product_group) {
      this.category = this.categories.find(({id}) => id === product.pg_product_group)
    }
  }

  getProduct() {

  }

  update() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      const value = {...this.pgManagementForm.value};
      delete value.reportDate;
      this.lotDateService.update(this.data.id, value).subscribe(res => {
        this.loading = false;
        this.dialogRef.close(res);
      }, _ => this.loading = false);
    }
  }
}
