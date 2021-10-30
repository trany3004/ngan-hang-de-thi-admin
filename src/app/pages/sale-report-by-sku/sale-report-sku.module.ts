import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PGCommonModule } from '../common/common.module';
import { CurrencyModule } from '../common/currency-pipe/currency.module';
import { SaleReportBySkuComponent } from './sale-report-sku.component';
@NgModule({
  declarations: [
    SaleReportBySkuComponent,
    // FilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    PGCommonModule,
    CurrencyModule,
    RouterModule.forChild([
      {
        path: '',
        component: SaleReportBySkuComponent,
      },
    ]),
  ],
  providers: [
    DatePipe
  ]
})
export class SaleReportBySkuModule { }
