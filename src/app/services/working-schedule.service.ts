import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { Checkin } from '../models/checkin.model';
import { WorkingShedule } from '../models/working-schedule.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class WorkingSheduleService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  
  getCauHoi(): Observable<any[]> {
    // CAll API get chu ded
     return this.http.get<any[]>(`/api/v1/cau-hoi`);
   }
 
   getCauHoiById(id): Observable<any> {
     // CAll API get chu ded
      return this.http.get<any>(`/api/v1/cau-hoi?id=${id}`);
    }
 
   createCauHoi(data): Observable<any> {
     return this.http.post<any>(`/api/v1/cau-hoi`, data);
   }
 
   updateCauHoi(id, data): Observable<any> {
     return this.http.put<any>(`/api/v1/cau-hoi/${id}`, data);
   }
 
   xoaCauHoi(id): Observable<any> {
    return this.http.delete<any>(`/api/v1/cau-hoi/${id}`);
  }
 
 



  fetch(filter?: any): Observable<WorkingShedule[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<WorkingShedule[]>(`/api/v2/working-sheets?_sort=startDate:DESC${query ? '&' : ''}${query}`);
  }

  fetchByIds(ids=[], filter): Observable<WorkingShedule[]> {
    let query = '';
    if (filter) {
      query = queryString.stringify(this.generateFilter(filter));
    }
    let queryIds = ids.map((id) => `id=${id}`);
    console.log(queryIds)
    queryIds.push(query);
    query = queryIds.join('&')
    return this.http.get<WorkingShedule[]>(`/api/v2/working-sheets?_sort=startDate:DESC${query ? '&' : ''}${query}`);

  }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/working-sheets/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<WorkingShedule[]> {
    return this.http.post<WorkingShedule[]>('/api/v2/working-sheets', data);
  }

  get(id): Observable<WorkingShedule> {
    return this.http.get<WorkingShedule>(`/api/v2/working-sheets/${id}`);
  }

  update(id: number, data: any): Observable<WorkingShedule[]> {
    return this.http.put<WorkingShedule[]>(`/api/v2/working-sheets/${id}`, data);
  }

  delete(id: number): Observable<WorkingShedule[]> {
    return this.http.delete<WorkingShedule[]>(`/api/v2/working-sheets/${id}`);
  }

}
