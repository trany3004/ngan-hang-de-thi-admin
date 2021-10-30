import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from 'src/app/_metronic/partials/content/general/general.module';
import { MatNativeDateModule } from '@angular/material/core';
import { HighlightModule } from 'ngx-highlightjs';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { WidgetsModule } from 'src/app/_metronic/partials/content/widgets/widgets.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportedMonthComponent } from './reported-month/reported-month.component';
import { CurrencyModule } from '../common/currency-pipe/currency.module';
import { ReportedMonthTargetGroupComponent } from './report-month-target-group/report-month-target-group.component';

@NgModule({
  declarations: [DashboardComponent, ReportedMonthComponent, ReportedMonthTargetGroupComponent],
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
    MatExpansionModule,
    WidgetsModule,
    NgApexchartsModule,
    CurrencyModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    DashboardsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class DashboardModule {}
