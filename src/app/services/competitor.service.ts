import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Competitor } from '../models/competitor.model';

@Injectable({
  providedIn: 'root'
})

  
export class CompetitorService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

 

  fetch(filter?: any): Observable<Competitor[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<Competitor[]>(`/api/v2/competitors?_sort=startDate:DESC${query ? '&' : ''}${query}`);
  }

  fetchByIds(ids=[], filter): Observable<Competitor[]> {
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
    return this.http.get<Competitor[]>(`/api/v2/competitors?_sort=startDate:DESC${query ? '&' : ''}${query}`);

  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/competitors/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Competitor[]> {
    return this.http.post<Competitor[]>('/api/v2/competitors', data);
  }

  get(id): Observable<Competitor> {
    return this.http.get<Competitor>(`/api/v2/competitors/${id}`);
  }

  update(id: number, data: any): Observable<Competitor[]> {
    return this.http.put<Competitor[]>(`/api/v2/competitors/${id}`, data);
  }

  delete(id: number): Observable<Competitor[]> {
    return this.http.delete<Competitor[]>(`/api/v2/competitors/${id}`);
  }
}
