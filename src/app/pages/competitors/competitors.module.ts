import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PGCommonModule } from '../common/common.module';
import { CompetitorsComponent } from './competitors.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { CompetitorsCreateDialogComponent } from './competitors-create-dialog/competitors-create-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CompetitorsModifyDialogComponent } from './competitors-modify-dialog/competitors-modify-dialog.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MathModule } from 'src/app/math/math.module';
@NgModule({
  declarations: [
    CompetitorsComponent,
    CompetitorsCreateDialogComponent,
    CompetitorsModifyDialogComponent
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
    MatCarouselModule.forRoot(),
    CKEditorModule,
    MathModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: CompetitorsComponent,
      },
    ]),
  ],
  providers: [
    DatePipe
  ]
})
export class CompetitorsModule { }
