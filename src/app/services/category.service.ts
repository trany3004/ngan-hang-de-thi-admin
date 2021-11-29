import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class CategoryService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  getChuong(): Observable<any[]> {
    // CAll API get chuong
     return this.http.get<any[]>(`/api/v1/chuong-hoc`);
   }
 
   createChuong(data): Observable<any> {
     return this.http.post<any>(`/api/v1/chuong-hoc`, data);
   }
 
    updateChuong(id, data): Observable<any> {
      return this.http.put<any>(`/api/v1/chuong-hoc/${id}`, data);
    }
 
   xoaChuDe(id): Observable<any> {
     return this.http.delete<any>(`/api/v1/chuong-hoc/${id}`);
   }
 




  fetch(filter?: any): Observable<Category[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<Category[]>(`/api/v2/product-groups${query ? '?' : ''}${query}`);
  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/product-groups/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Category[]> {
    return this.http.post<Category[]>('/api/v2/product-groups', data);
  }

  get(id): Observable<Category> {
    return this.http.get<Category>(`/api/v2/product-groups/${id}`);
  }

  update(id: number, data: any): Observable<Category[]> {
    return this.http.put<Category[]>(`/api/v2/product-groups/${id}`, data);
  }

  delete(id: number): Observable<Category[]> {
    return this.http.delete<Category[]>(`/api/v2/product-groups/${id}`);
  }
}
