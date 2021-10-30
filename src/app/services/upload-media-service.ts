import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Product } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class UploadMediaService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  upload(file: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('files', file);
    return this.http.post<any>(`/api/v2/upload`, uploadData);
}

  fetch(filter?: any): Observable<Product[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<Product[]>(`/api/v2/products${query ? '?' : ''}${query}`);
  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/products/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Product[]> {
    return this.http.post<Product[]>('/api/v2/products', data);
  }

  get(id): Observable<Product> {
    return this.http.get<Product>(`/api/v2/products/${id}`);
  }

  update(id: number, data: any): Observable<Product[]> {
    return this.http.put<Product[]>(`/api/v2/products/${id}`, data);
  }

  delete(id: number): Observable<Product[]> {
    return this.http.delete<Product[]>(`/api/v2/products/${id}`);
  }
}
