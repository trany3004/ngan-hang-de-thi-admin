import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { PGCommonModule } from "../common/common.module";
import { InventoryComponent } from "./inventory.component";
import { InventoryCreateDialogComponent } from "./inventory-create-dialog/inventory-create-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { MathModule } from "src/app/math/math.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [InventoryComponent, InventoryCreateDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PGCommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MathModule.forRoot(),
    MatRadioModule,
    MatCheckboxModule,
    DragDropModule,
    RouterModule.forChild([
      {
        path: "",
        component: InventoryComponent,
      },
    ]),
  ],
  providers: [DatePipe],
})
export class InventoryModule {}
