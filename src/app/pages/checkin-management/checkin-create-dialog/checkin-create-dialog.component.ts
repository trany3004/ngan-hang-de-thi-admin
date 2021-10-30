import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
interface Lop1 {
  value: string;
  viewValue: string;
};
interface Monhoc1 {
  value: string;
  viewValue: string;
};
interface Thoigian1 {
  value: string;
  viewValue: string;
};
interface Trangthai1 {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-checkin-create-dialog',
  templateUrl: './checkin-create-dialog.component.html',
  styleUrls: ['./checkin-create-dialog.component.scss'],
})
export class CheckinCreateDialogComponent {
  lops: Lop1[] = [
    {value: 'lop-0', viewValue: 'Lớp 10'},
    {value: 'lop-1', viewValue: 'Lớp 11'},
    {value: 'lop-2', viewValue: 'Lớp 12'}
  ];
  monhoc: Monhoc1[] = [
    {value: 'mh-0', viewValue: 'Toán học'},
    {value: 'mh-1', viewValue: 'Vật lý'},
    {value: 'mh-2', viewValue: 'Hoá học'},
    {value: 'mh-3', viewValue: 'Sinh học'},
    {value: 'mh-4', viewValue: 'GDCD'},
    {value: 'mh-5', viewValue: 'Địa Lý'},
    {value: 'mh-6', viewValue: 'Tiếng Anh'},
    {value: 'mh-7', viewValue: 'Lịch sử'},
  ];
  thoigian: Thoigian1[] = [
    {value: 'tg-0', viewValue: '15 phút'},
    {value: 'tg-1', viewValue: '45 phút'},
    {value: 'tg-2', viewValue: '60 phút'},
    {value: 'tg-3', viewValue: '90 phút'},
    {value: 'tg-4', viewValue: '120 phút'},
    {value: 'tg-5', viewValue: '180 phút'},
  
  ];
  trangthai: Trangthai1[] = [
    {value: 'tt-0', viewValue: 'hoạt động'},
    {value: 'tt-1', viewValue: 'Không hoạt động'}
  ];
  panelOpenState = false;
  imageUrl;
  title;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.imageUrl = data.url;
    this.title = data.title;
  }

  createPg() {
    console.log('ahihi');
  }
}
