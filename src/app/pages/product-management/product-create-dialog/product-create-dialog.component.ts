import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-product-create-dialog',
  templateUrl: './product-create-dialog.component.html',
  styleUrls: ['./product-create-dialog.component.scss'],
})
export class ProductCreateDialogComponent implements OnInit {
  pgManagementForm: FormGroup;
  title = '';
  buttonTitle = '';
  loading = false;
  categories: any[] = [];
  isClosed = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  private categoryService: CategoryService,
  private productService: ProductService,
  public dialogRef: MatDialogRef<ProductCreateDialogComponent>) {
    this.title = data.type === 'create' ? 'Create Product' : 'Update Product';
    this.buttonTitle = data.type === 'create' ? 'Create' : 'Update';
    // this.title = data.title;
    this.pgManagementForm = this.fb.group({
      name: [null, Validators.required],
      code: [null, Validators.required],
      brand: [null, []],
      price: [null, [Validators.pattern('\\d*')]],
      // quantity: [null, [Validators.pattern('\\d*')]],
      size: [null, []],
      pg_product_group: [null, Validators.required]

    });
  }
  ngOnInit(): void {
    this.fetchCategories();
    if (this.data.type === 'update') {
      const {name, code, brand, price, size, categoryId} = this.data.data;
      this.pgManagementForm.controls.name.setValue(name);
      this.pgManagementForm.controls.code.setValue(code);
      this.pgManagementForm.controls.brand.setValue(brand);
      this.pgManagementForm.controls.price.setValue(price);
      // this.pgManagementForm.controls.quantity.setValue(quantity);
      this.pgManagementForm.controls.size.setValue(size);
      this.pgManagementForm.controls['pg_product_group'].setValue(categoryId);
    }
  }

  createPg() {
    if (this.pgManagementForm.valid) {
      this.loading = true;
      if (this.data.type === 'create') {

        this.productService.create(this.pgManagementForm.value).subscribe(res => {
          this.loading = false;
          this.isClosed = true;
          this.dialogRef.close(res);
        });
      }
      if (this.data.type === 'update') {
        this.productService.update(this.data.data.id, this.pgManagementForm.value).subscribe(res => {
          this.loading = false;
          this.isClosed = true;
          this.dialogRef.close(res);
        });
      }
    } else {
      this.isClosed = false;
      this.pgManagementForm.controls.name.markAllAsTouched();
      this.pgManagementForm.controls.code.markAllAsTouched();
      this.pgManagementForm.controls.pg_product_group.markAllAsTouched();
    }
  }

  fetchCategories() {
    this.loading = true
    this.categoryService.fetch().subscribe((rs) => {
      this.categories = rs;
      this.loading = false
    }, _ => this.loading = false);
  }
}
