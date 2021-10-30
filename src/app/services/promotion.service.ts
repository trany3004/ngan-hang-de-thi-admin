import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Product } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class PromotionService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  fetch(filter?: any): Observable<Product[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<Product[]>(`/api/v2/promotions?isDelete=false${query ? '&' : ''}${query}`);
  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/promotions/count?isDelete=false${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Product[]> {
    return this.http.post<Product[]>('/api/v2/promotions', data);
  }

  get(id): Observable<Product> {
    return this.http.get<Product>(`/api/v2/promotions/${id}`);
  }

  update(id: number, data: any): Observable<Product[]> {
    return this.http.put<Product[]>(`/api/v2/promotions/${id}`, data);
  }

  delete(id: number): Observable<Product[]> {
    return this.http.delete<Product[]>(`/api/v2/promotions/${id}`);
  }

}
