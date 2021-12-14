import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Inventory } from '../models/inventory-report.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class InventoryService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  fetch(filter?: any): Observable<any> {
    let query = '';
    if (filter) {
      query = queryString.stringify(filter);
    }
    return this.http.get<any>(`/api/v1/on-tap${query ? '?' : ''}${query}`);
  }

  taoCauHoiTuDong(data): Observable<any[]> {
    return this.http.post<any>(`/api/v1/on-tap/random`, data);
  }

  taoOnTap(data): Observable<any> {
    return this.http.post<any>(`/api/v1/on-tap`, data);
  }

  fetchByIds(ids=[], filter): Observable<Inventory[]> {
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
    return this.http.get<Inventory[]>(`/api/v2/inventories?_sort=createdAt:DESC${query ? '&' : ''}${query}`);

  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/inventories/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<Inventory[]> {
    return this.http.post<Inventory[]>('/api/v2/inventories', data);
  }

  get(id): Observable<Inventory> {
    return this.http.get<Inventory>(`/api/v2/inventories/${id}`);
  }

  update(id: number, data: any): Observable<Inventory[]> {
    return this.http.put<Inventory[]>(`/api/v2/inventories/${id}`, data);
  }

  delete(id: number): Observable<Inventory[]> {
    return this.http.delete<Inventory[]>(`/api/v2/inventories/${id}`);
  }
}
