import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
      }

  canActivate(
  ): Observable<any> {
        if (localStorage.getItem('token') && localStorage.getItem('user.role') === 'Admin') {
            return of(true);
        } else {
            this.authService.logout();
            return of(false);
        }
  }
}

