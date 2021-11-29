import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Outlet } from '../models/outlet.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class OutletService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  getChuDe(): Observable<any[]> {
   // CAll API get chu ded
    return this.http.get<any[]>(`/api/v1/chu-de`);
  }

  getChuDeByCondition(query?): Observable<any[]> {
    // CAll API get chu ded
    const queryString = query ? Object.keys(query).map((key) => `${key}=${query[key]}`).join('&') : ''
     return this.http.get<any[]>(`/api/v1/chu-de${queryString ? '?'+queryString : ''}`);
   }

  getChuDeById(id): Observable<any> {
    // CAll API get chu ded
     return this.http.get<any>(`/api/v1/chu-de?id=${id}`);
   }

  createChuDe(data, file, fileName): Observable<any> {
    if (file) {
      data.file = file;
      data.fileName = fileName;
    }
    return this.http.post<any>(`/api/v1/chu-de`, data);
  }

  update(id, data): Observable<any> {
    return this.http.put<any>(`/api/v1/chu-de/${id}`, data);
  }

  xoaChuDe(id): Observable<any> {
    return this.http.delete<any>(`/api/v1/chu-de/${id}`);
  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/outlets/count${query ? '?' : ''}${query}`);
  }

  createoutlet(data): Observable<Outlet[]> {
    return this.http.post<Outlet[]>('/api/v2/outlets', data);
  }

  getoutlet(id): Observable<Outlet> {
    return this.http.get<Outlet>(`/api/v2/outlets/${id}`);
  }

  updateoutlet(id: number, data: any): Observable<Outlet[]> {
    return this.http.put<Outlet[]>(`/api/v2/outlets/${id}`, data);
  }

  deleteoutlet(id: number): Observable<Outlet[]> {
    return this.http.delete<Outlet[]>(`/api/v2/outlets/${id}`);
  }
}
