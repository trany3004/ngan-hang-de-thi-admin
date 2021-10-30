import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
        // .pipe(catchError(err => {
        //     console.log(err)
        //     if (err.status === 401 ||
        //         err.error.message === 'jwt expired' ||
        //         err.error.message === 'invalid token' ||
        //         err.error.message === 'Missing Authorization' ||
        //         err.error.message === 'Token is invalid') {
        //         this.authenticationService.logout();
        //     }
        //     const error = err.error.message || err.statusText;
        //     return throwError(error);
        // })
        // );
    }
}
