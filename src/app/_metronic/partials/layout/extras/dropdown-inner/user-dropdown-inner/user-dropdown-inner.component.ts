import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  // user$: Observable<UserModel>;
  user: any = {};
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // this.extrasUserDropdownStyle = this.layout.getProp(
    //   'extras.user.dropdown.style'
    // );
    // this.user$ = this.auth.currentUserSubject.asObservable();
    this.user.fullName = localStorage.getItem('user.name');
    this.user.username = localStorage.getItem('user.username');

  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
