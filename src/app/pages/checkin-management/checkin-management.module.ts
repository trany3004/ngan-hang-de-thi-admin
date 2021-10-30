import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CheckinManagementComponent } from './checkin-management.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CheckinCreateDialogComponent } from './checkin-create-dialog/checkin-create-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { CheckinAddressDialogComponent } from './checkin-address-dialog/checkin-address-dialog.component';
import { PGCommonModule } from '../common/common.module';
import { MapComponent } from '../common/map/map.component';
@NgModule({
  declarations: [
    CheckinManagementComponent,
    CheckinCreateDialogComponent,
    CheckinAddressDialogComponent,
  
    MapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTableModule,
    PGCommonModule,
    MatExpansionModule,
    RouterModule.forChild([
      {
        path: '',
        component: CheckinManagementComponent,
      },
    ]),
  ],
  providers: [
    DatePipe
  ]
})
export class CheckinManagementModule { }
