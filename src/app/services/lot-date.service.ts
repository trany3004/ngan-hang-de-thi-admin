import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { LotDate } from '../models/lot-date.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class LotDateService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  fetch(filter?: any): Observable<LotDate[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<LotDate[]>(`/api/v2/lot-dates?_sort=reportDate:DESC${query ? '&' : ''}${query}`);
  }

  fetchByIds(ids=[], filter): Observable<LotDate[]> {
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
    return this.http.get<LotDate[]>(`/api/v2/lot-dates?_sort=reportDate:DESC${query ? '&' : ''}${query}`);

  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/lot-dates/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<LotDate[]> {
    return this.http.post<LotDate[]>('/api/v2/lot-dates', data);
  }

  get(id): Observable<LotDate> {
    return this.http.get<LotDate>(`/api/v2/lot-dates/${id}`);
  }

  update(id: number, data: any): Observable<LotDate[]> {
    return this.http.put<LotDate[]>(`/api/v2/lot-dates/${id}`, data);
  }

  delete(id: number): Observable<LotDate[]> {
    return this.http.delete<LotDate[]>(`/api/v2/lot-dates/${id}`);
  }
}
