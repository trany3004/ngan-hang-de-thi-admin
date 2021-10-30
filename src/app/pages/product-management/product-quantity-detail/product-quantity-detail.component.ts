import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import {MatTableDataSource} from '@angular/material/table';
import { forkJoin, Subscription } from 'rxjs';
import { OutletService } from 'src/app/services/outlet.service';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-quantity-detail',
  templateUrl: './product-quantity-detail.component.html',
  styleUrls: ['./product-quantity-detail.component.scss'],
})


export class ProductQuantityDialogComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  subscription: Subscription;
  updateSubscription: Subscription;
  outlets: any[] = [];
  loading: boolean = false;
  isUpdated: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  private outletService: OutletService,
  private productService: ProductService,
  public dialogRef: MatDialogRef<ProductQuantityDialogComponent>,
  private toastr: ToastrService) {
  }
 
  ngOnInit(): void {
    this.init();
  }

  displayedColumns: string[] = ['outletName', 'name'];
  dataSource = new MatTableDataSource([]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  init() {
    // this.loading = true;
    // this.subscription = forkJoin([
    //   this.productService.fetchSystemInventoryProduct(this.data.id),
    //   this.outletService.fetchoutlets()
    // ]).subscribe(([inventories, outlets]) => {
    //   this.outlets = outlets;
    //   this.dataSource =  new MatTableDataSource(this.mapData(inventories));
    //   this.dataSource.sort = this.sort;
    //   this.loading = false;
    // }, _ => this.loading = false)
  }

  mapData(inventories) {
    return this.outlets.map((outlet) => {
      const inventory = inventories.find(({pg_outlet}) => pg_outlet.id === outlet.id);
      return {
        outletName: outlet.name,
        outletId: outlet.id,
        quantity: inventory? inventory.quantities : null,
        productId: this.data.id
      }
    })    
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.updateSubscription) this.updateSubscription.unsubscribe();
  }

  submit() {
    this.isUpdated = true;
    let data = JSON.parse(JSON.stringify(this.dataSource.data));
    let body: any[] = [];
    data.map((e) => {
      if (e.quantity !== null && e.quantity !== undefined) {
        e.quantity = String(e.quantity)
        delete e.outletName
        body.push(e)
      }
      return e
    })
    this.loading = true
    this.updateSubscription = this.productService.updateQuantities(body).subscribe(res => {
      this.loading = false;
      this.toastr.success('', 'Update stock(s) successfully');
      // this.dialogRef.close(true);
    }, _ => {
      this.loading = false;
      this.toastr.error('', 'Failed to update stock(s)');
    });

  }

  blurInput(element) {
    const quantity = element.quantity;
    const outlet = this.dataSource.data.find(({outletId}) => outletId === element.outletId)
    if (!quantity) {
      outlet.quantity = "0"
    }
    else if (quantity && !String(quantity).match(/^\d+$/)) {
      outlet.quantity = "0"
    }
  }

  close() {
    this.dialogRef.close(this.isUpdated);
  }
}
