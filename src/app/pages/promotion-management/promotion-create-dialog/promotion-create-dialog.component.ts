import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-promotion-create-dialog',
  templateUrl: './promotion-create-dialog.component.html',
  styleUrls: ['./promotion-create-dialog.component.scss'],
})
export class PromotionCreateDialogComponent implements OnInit {
  pgManagementForm: FormGroup;
  title = '';
  buttonTitle = '';
  loading = false;
  products: any[] = [];
  isClosed = false;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: any[] = [];
  fruits: string[] = [];
  allFruits: any[] = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  
  promotionTypes = [
    {
      value: 'discount',
      label: 'Giảm giá'
    },
    {
      value: 'Buy1get1free',
      label: 'Mua 1 tặng 1'
    }
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  private categoryService: CategoryService,
  private productService: ProductService,
  public dialogRef: MatDialogRef<PromotionCreateDialogComponent>) {
    this.title = data.type === 'create' ? 'Create Promotion' : 'Update Promotion';
    this.buttonTitle = data.type === 'create' ? 'Create' : 'Update';
    this.pgManagementForm = this.fb.group({
      name: [null, Validators.required],
      start: [null, Validators.required],
      end: [null, []],
      size: [null, []],
      pg_products: [null, Validators.required]

    });

    this.productService.fetch().subscribe((rs) => this.filteredFruits = rs);
  }
  ngOnInit(): void {
    this.fetchCategories();
    if (this.data.type === 'update') {
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
      // this.categories = rs;
      this.loading = false
    }, _ => this.loading = false);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('Event >>>', event)
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
