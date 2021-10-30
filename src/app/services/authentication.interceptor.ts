import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    if (request.url.endsWith('/login')) {
      return next.handle(request)
    }
    if (!token) {
      this.auth.goToLoginPage()
      return
    }
    request = request.clone({
      setHeaders: {
        Authorization: token
      }
    })
    return next.handle(request)
  }
}
