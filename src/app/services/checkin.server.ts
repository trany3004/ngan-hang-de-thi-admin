import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Checkin } from '../models/checkin.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class CheckinService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  fetch(filter?: any): Observable<Checkin[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<Checkin[]>(`/api/v2/checkins?_sort=startDate:DESC${query ? '&' : ''}${query}`);
  }

  fetchByIds(ids=[], filter): Observable<Checkin[]> {
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
    return this.http.get<Checkin[]>(`/api/v2/checkins?_sort=startDate:DESC${query ? '&' : ''}${query}`);

  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    const filterClone = {...filter};
    if (filterClone) {
      delete filterClone.pageSize
      delete filterClone.page
      query = queryString.stringify(this.generateFilter(filterClone));
    }
    return this.http.get<number>(`/api/v2/checkins/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Checkin[]> {
    return this.http.post<Checkin[]>('/api/v2/checkins', data);
  }

  get(id): Observable<Checkin> {
    return this.http.get<Checkin>(`/api/v2/checkins/${id}`);
  }

  update(id: number, data: any): Observable<Checkin[]> {
    return this.http.put<Checkin[]>(`/api/v2/checkins/${id}`, data);
  }

  delete(id: number): Observable<Checkin[]> {
    return this.http.delete<Checkin[]>(`/api/v2/checkins/${id}`);
  }
}
