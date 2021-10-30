import { Component } from '@angular/core';

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
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss'],
})
export class ReportManagementComponent {
  panelOpenState = true;
}

