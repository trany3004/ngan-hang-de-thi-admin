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


  getCauHoi(): Observable<any[]> {
    // CAll API get chu ded
     return this.http.get<any[]>(`/api/v1/cau-hoi`);
   }
 
   getCauHoiById(id): Observable<any> {
     // CAll API get chu ded
      return this.http.get<any>(`/api/v1/cau-hoi/${id}`);
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
   demCauHoi(id): Observable<any> {
    return this.http.delete<any>(`/api/v1/cau-hoi/${id}`);
  }
 

  fetch(filter?: any): Observable<any[]> {
    let query = '';
    const condition = {}
    if (filter) {
      Object.keys(filter).map((k) => {
        if (filter[k]) condition[k] = filter[k]
      })
      
      query = queryString.stringify(condition);
    }
    return this.http.get<any[]>(`/api/v1/cau-hoi${query ? '?' : ''}${query}`);
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
