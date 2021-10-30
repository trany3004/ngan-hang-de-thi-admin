import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Gift } from '../models/gift.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class GiftService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  fetch(filter?: any): Observable<Gift[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<Gift[]>(`/api/v2/gifts?_sort=createdAt:DESC${query ? '&' : ''}${query}`);
  }

  fetchByIds(ids=[], filter): Observable<Gift[]> {
    if (!ids || !ids.length) {
      return of([]);
    }
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    let queryIds = ids.map((id) => `id=${id}`);
    console.log(queryIds)
    queryIds.push(query);
    query = queryIds.join('&')
    return this.http.get<Gift[]>(`/api/v2/gifts?_sort=createdAt:DESC${query ? '&' : ''}${query}`);

  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/gifts/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Gift[]> {
    return this.http.post<Gift[]>('/api/v2/gifts', data);
  }

  get(id): Observable<Gift> {
    return this.http.get<Gift>(`/api/v2/gifts/${id}`);
  }

  update(id: number, data: any): Observable<Gift[]> {
    return this.http.put<Gift[]>(`/api/v2/gifts/${id}`, data);
  }

  delete(id: number): Observable<Gift[]> {
    return this.http.delete<Gift[]>(`/api/v2/gifts/${id}`);
  }
}
