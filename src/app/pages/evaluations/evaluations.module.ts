import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeneralModule } from '../../_metronic/partials/content/general/general.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule } from 'ngx-highlightjs';
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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSortModule } from '@angular/material/sort';
// import { FilterComponent } from '../common/filter/filter.component';
import { PGCommonModule } from '../common/common.module';
import { EvaluationsCreateDialogComponent } from './evaluations-create-dialog/evaluations-create-dialog.component';
import { EvaluationsComponent } from './evaluations.component';
@NgModule({
  declarations: [
    EvaluationsComponent,
    EvaluationsCreateDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    MatNativeDateModule,
    HighlightModule,
    NgbNavModule,
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
    PGCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EvaluationsComponent,
      },
    ]),
  ],
})
export class EvaluationsModule { }
