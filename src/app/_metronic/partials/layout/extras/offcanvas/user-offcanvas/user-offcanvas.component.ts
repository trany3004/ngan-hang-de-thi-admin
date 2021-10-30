import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from '../../../../../core';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user: any = {};
  constructor(private layout: LayoutService, private auth: AuthService) {}

  ngOnInit(): void {
    this.user.fullName  = localStorage.getItem('user.name') || localStorage.getItem('user.username');
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
