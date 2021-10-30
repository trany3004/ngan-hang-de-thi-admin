import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PGCommonModule } from '../common/common.module';
import { GiftComponent } from './gift.component';
import { GiftCreateDialogComponent } from './gift-create-dialog/gift-create-dialog.component';
import { GiftModifyDialogComponent } from './gift-modify-dialog/gift-modify-dialog.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    GiftComponent,
    GiftCreateDialogComponent,
    GiftModifyDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSortModule,
    PGCommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    PGCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: GiftComponent,
      },
    ]),
  ],
  providers: [
    DatePipe
  ]
})
export class GiftModule { }
