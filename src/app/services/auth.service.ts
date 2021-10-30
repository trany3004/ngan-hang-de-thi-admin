import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { User } from '../models/user.model'
import { Observable, of } from 'rxjs'

const ApiEndpoint = '/api/v1'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string, callback?: Function): Observable<any> {
        // return of({
        //     token: '1234',
        //     user: {
        //         username: username,
        //         name: username,
        //         email: `${username}@gmail.com`
        //     }
        // })
        return this.http.post<any>(ApiEndpoint + '/login', { username, password })
    }

    logout() {
        this.clearToken()
        this.clearUserInfo()
        this.goToLoginPage()
    }

    goToLoginPage() {
        // this.router.navigate(['/auth/login'])
    }

    getCurrentUser() {
        return localStorage.getItem('user.name')
    }

    getToken() {
        return localStorage.getItem('token')
    }

    storeUserInfo(user: User) {
        localStorage.setItem('user.name', user.name)
        localStorage.setItem('user.username', user.username)
        localStorage.setItem('user.role', user.role)
        localStorage.setItem('user.email', user.email)
    }

    storeToken(token: string) {
        localStorage.setItem('token', token)
    }

    clearUserInfo() {
        localStorage.removeItem('user.name')
        localStorage.removeItem('user.username')
        localStorage.removeItem('user.role')
        localStorage.removeItem('user.email')
    }

    clearToken() {
        localStorage.removeItem('token')
    }
}
