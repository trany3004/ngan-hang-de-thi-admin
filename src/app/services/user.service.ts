import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import * as queryString from 'query-string';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }

  fetchUsers(filter?: any): Observable<User[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<User[]>(`/api/v2/users${query ? '?' : ''}${query}`);
  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/users/count${query ? '?' : ''}${query}`);
  }

  generateFilter({ page, pageSize, ...rest }) {
    const filter = {
      _limit: pageSize,
      _start: page * pageSize,
      ...rest
    };

    for (const propName in filter) {
      if (!filter[propName] && filter[propName] !== 0) {
        delete filter[propName];
      }
    }
    return filter;
  }

  createUser(data): Observable<User[]> {
    return this.http.post<User[]>('/api/v1/users', data);
  }

  getUser(id): Observable<User[]> {
    return this.http.get<User[]>(`/api/v2/users/${id}`);
  }

  updateUser(id: number, data: any): Observable<User[]> {
    return this.http.put<User[]>(`/api/v2/users/${id}`, data);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`/api/v2/users/${id}`);
  }
}
