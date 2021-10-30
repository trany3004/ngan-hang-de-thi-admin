import {
  AfterViewInit,
  Component, Inject, OnInit, ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../common/delete-dialog/delete-dialog.component';
import { ExportService } from 'src/app/services/export.service';
import { EvaluationsCreateDialogComponent } from './evaluations-create-dialog/evaluations-create-dialog.component';

export interface PeriodicElement {
  name: string;
  address: string;
  identityCard: string;
  dayOfBirth: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
  { name: 'Trần Thị Thu Thủy', address: '4 Trần Thị Vững, An Bình, thị xã Dĩ An, tỉnh Bình Dương', identityCard: '123654789', dayOfBirth: '09/06/1996' },
  { name: 'Nguyễn Thị Thu Thy', address: '491/8 Trường Chinh, phường 14, quận Tân Bình, HCM ', identityCard: '581648225447', dayOfBirth: '01/01/1996' },
  { name: 'Hà Thị Thảo', address: '10 Đặng Văn Ngữ, phường 10, Phú Nhuận, HCM', identityCard: '123654789', dayOfBirth: '23/09/1996' },
];

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss'],
})
export class EvaluationsComponent implements AfterViewInit{
  @ViewChild(MatSort) sort: MatSort;

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ['name', 'address', 'identityCard', 'dayOfBirth', 'action'];
  displayedSearchColumns: string[] = ['nameSearch', 'addressSearch', 'identityCardSearch', 'dayOfBirthSearch', 'actionSearch'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }



  constructor(public dialog: MatDialog, private exportService: ExportService) { }
  createPg() {
    const dialogRef = this.dialog.open(EvaluationsCreateDialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  modifyPg() {
    const dialogRef = this.dialog.open(EvaluationsCreateDialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deletePg() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        header: 'Xóa PG',
        title: 'Bạn có muốn xóa PG này không?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  export() {
    const fileName = 'Quản lý GP';
    const header = { name: 'Tên', address: 'Địa chỉ', identityCard: 'CMND', dayOfBirth: 'Ngày sinh' };
    const data = [header].concat(ELEMENT_DATA);
    this.exportService.exportExcel(data, fileName, true, [fileName]);
  }
}

