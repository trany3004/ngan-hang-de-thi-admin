import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subscription } from 'rxjs';
import { Cities, Regions } from 'src/app/constant/constant';
import { OutletService } from 'src/app/services/outlet.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleReportService } from 'src/app/services/sale-report.service';

@Component({
  selector: 'app-modify-pg-sale-report',
  templateUrl: './modify-pg-sale-report.component.html',
  styleUrls: ['./modify-pg-sale-report.component.scss']
})
export class ModifyPgSaleReportComponent implements OnInit, OnDestroy {
  pgManagementForm: FormGroup;
  subscription: Subscription;
  products = [];
  outlets = [];
  categories = [];
  category = '';
  loading;
  constructor(
    public dialogRef: MatDialogRef<ModifyPgSaleReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private outletService: OutletService,
    private productService: ProductService,
    private saleReportService: SaleReportService) {
    this.pgManagementForm = this.fb.group({
      pg_product: [null, [Validators.required]],
      buyers: [null, [Validators.required, Validators.pattern('\\d*')]],
      itemCount: [null, [Validators.required, Validators.pattern('\\d*')]],
      actualDisplay: [null, [Validators.required, Validators.pattern('\\d*')]],
      reach: [null, [Validators.required, Validators.pattern('\\d*')]],
    });
  }
  
  ngOnInit(): void {
    this.loading = true;
    const dataUpdated = this.data;
    // if (dataUpdated) {
    //   this.subscription = forkJoin([
    //     this.outletService.fetchoutlets(),
    //     this.productService.fetch(),
    //   ]).subscribe(([outlets, products]) => {
    //     // this.outlets = outlets;
    //     // this.products = products;
    //     // this.pgManagementForm.controls['pg_outlet'].setValue(dataUpdated.pg_outlet.id);
    //     this.pgManagementForm.controls['pg_product'].setValue(dataUpdated.pg_product.id);
    //     // this.pgManagementForm.controls['pg_user'].setValue(dataUpdated.pg_user.id);
    //     // this.pgManagementForm.controls['pg_checkin'].setValue(dataUpdated.pg_checkin.id);
    //     this.pgManagementForm.controls['reach'].setValue(dataUpdated.reach);
    //     this.pgManagementForm.controls['buyers'].setValue(dataUpdated.buyers);
    //     this.pgManagementForm.controls['itemCount'].setValue(dataUpdated.itemCount);
    //     this.pgManagementForm.controls['actualDisplay'].setValue(dataUpdated.actualDisplay);
    //     this.loading = false;
    //   }, () => this.loading = false)
    // }
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
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
      this.saleReportService.update(this.data.id, value).subscribe(res => {
        this.loading = false;
        this.dialogRef.close(res);
      }, _ => this.loading = false);
    }
  }

}
