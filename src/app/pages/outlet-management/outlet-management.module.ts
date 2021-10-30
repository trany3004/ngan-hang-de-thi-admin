import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSortModule } from '@angular/material/sort';
import { OutletManagementComponent } from './outlet-management.component';
import { OutletCreateDialogComponent } from './outlet-create-dialog/outlet-create-dialog.component';
import { AddressDialogComponent } from './checkin-address-dialog/checkin-address-dialog.component';
import { CurrencyModule } from '../common/currency-pipe/currency.module';

@NgModule({
  declarations: [OutletManagementComponent, OutletCreateDialogComponent, AddressDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NgbTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSortModule,
    CurrencyModule,
    MatAutocompleteModule,
    
    RouterModule.forChild([
      {
        path: '',
        component: OutletManagementComponent,
      },
    ]),
  ],
})
export class OutletManagementModule { }
