import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PGCommonModule } from '../common/common.module';
import { SaleReportComponent } from './sale-report.component';
import { CurrencyModule } from '../common/currency-pipe/currency.module';
@NgModule({
  declarations: [
    SaleReportComponent,
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
        component: SaleReportComponent,
      },
    ]),
  ],
  providers: [
    DatePipe
  ]
})
export class SaleReportModule { }
