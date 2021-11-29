import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },
      // bài kiểm tra
      {
        path: 'pg-management',
        loadChildren: () =>
          import('./pg-management/pg-management.module').then((m) => m.PGManagementModule),
      },
      // ôn tập
      {
        path: 'competitors',
        loadChildren: () =>
          import('./competitors/competitors.module').then((m) => m.CompetitorsModule),
      },
      {
        path: 'competitors/:id',
        loadChildren: () =>
          import('./competitors/competitors.module').then((m) => m.CompetitorsModule),
      },
      // câu hỏi
      {
        path: 'cau-hoi',
        loadChildren: () =>
          import('./working-schedule/working-schedule.module').then((m) => m.WorkingScheduleModule),
      },
      //Bài kiểm tra ngoài hệ thống
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/inventory.module').then((m) => m.InventoryModule),
      },
      // {
      //   path: 'lot-date',
      //   loadChildren: () =>
      //     import('./lot-date/lot-date.module').then((m) => m.LotDateModule),
      // },

      //Quản lý lớp học
      {
        path: 'evaluations',
        loadChildren: () =>
          import('./evaluations/evaluations.module').then((m) => m.EvaluationsModule),
      },
      //Cấu trúc bài kiểm tra - setting
      {
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then((m) => m.CategoriesModule),
      },

      //Lớp chủ nhiệm
      {
        path: 'sales-report',
        loadChildren: () =>
          import('./sale-report/sale-report.module').then((m) => m.SaleReportModule),
      },
      //Danh sách cấu hình bài kiểm tra
      {
        path: 'checkin-management',
        loadChildren: () =>
          import('./checkin-management/checkin-management.module').then((m) => m.CheckinManagementModule),
      },
     // Chủ đề
      {
        path: 'outlet-management',
        loadChildren: () =>
          import('./outlet-management/outlet-management.module').then((m) => m.OutletManagementModule),
      },
      //Thống kê(chưa làm)
      {
        path: 'report-management',
        loadChildren: () =>
          import('./report-management/report-management.module').then((m) => m.ReportManagementModule),
      },

    //Chương
      {
        path: 'product-management',
        loadChildren: () =>
          import('./product-management/product-management.module').then((m) => m.ProductManagementModule),
      },
      //Quản lý tài khoản
      {
        path: 'gift-management',
        loadChildren: () =>
          import('./gift/gift.module').then((m) => m.GiftModule),
      },
      //Bài kiểm tra- thêm mới - lưu
      {
        path: 'sales-report-sku',
        loadChildren: () =>
          import('./sale-report-by-sku/sale-report-sku.module').then(
            (m) => m.SaleReportBySkuModule
          ),
      },
      //Cập nhật câu hỏi
      {
        path: 'promotion-management',
        loadChildren: () =>
          import('./promotion-management/promotion-management.module').then(
            (m) => m.PromotionManagementModule
          ),
      },
      {
        path: 'promotion-management/:id',
        loadChildren: () =>
          import('./promotion-management/promotion-management.module').then(
            (m) => m.PromotionManagementModule
          ),
      },
      // {
      //   path: 'ngbootstrap',
      //   loadChildren: () =>
      //     import('../modules/ngbootstrap/ngbootstrap.module').then(
      //       (m) => m.NgbootstrapModule
      //     ),
      // },
      // {
      //   path: 'wizards',
      //   loadChildren: () =>
      //     import('../modules/wizards/wizards.module').then(
      //       (m) => m.WizardsModule
      //     ),
      // },
      // {
      //   path: 'material',
      //   loadChildren: () =>
      //     import('../modules/material/material.module').then(
      //       (m) => m.MaterialModule
      //     ),
      // },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'errors/404',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
