import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from './base.service';
import * as queryString from 'query-string';
import { SaleReport } from '../models/sale-report.model';

@Injectable({
  providedIn: 'root'
})

  
  
export class SaleReportService extends BaseService {
  
  constructor(private http: HttpClient) {
    super();
  }

  fetch(filter?: any, isSku = false): Observable<any> {
    let query = '';
    if (filter) {
      let newFilter = this.filter(filter);
      this.filterMapper(newFilter);
      query = queryString.stringify(newFilter);
    }
    return this.http.get<any>(`/api/v1/reports/${isSku ? 'sku' : 'outlet'}/sale-report${query ? '?' : ''}${query}`);
  }

  // fetchByIds(ids=[], filter): Observable<SaleReport[]> {
  //   if (!ids || !ids.length) {
  //     return of([]);
  //   }
  //   let query = '';
  //   if (filter) {
  //     let newFilter = this.generateFilter(filter);
  //     this.filterMapper(newFilter);
  //     query = queryString.stringify(newFilter);
  //   }
  //   let queryIds = ids.map((id) => `id=${id}`);
  //   console.log(queryIds)
  //   queryIds.push(query);
  //   query = queryIds.join('&')
  //   return this.http.get<SaleReport[]>(`/api/v2/sale-reports?_sort=createdAt:DESC${query ? '&' : ''}${query}`);

  // }

  getTotalRecords(filter?: any): Observable<number> {
    let query = '';
    if (filter) {
      delete filter.pageSize
      delete filter.page
      query = queryString.stringify(this.generateFilter(filter));
    }
    return this.http.get<number>(`/api/v2/sale-reports/count${query ? '?' : ''}${query}`);
  }

  create(data): Observable<SaleReport[]> {
    return this.http.post<SaleReport[]>('/api/v2/sale-reports', data);
  }

  get(id): Observable<SaleReport> {
    return this.http.get<SaleReport>(`/api/v2/sale-reports/${id}`);
  }

  update(id: number, data: any): Observable<SaleReport[]> {
    return this.http.put<SaleReport[]>(`/api/v2/sale-reports/${id}`, data);
  }

  delete(id: number): Observable<SaleReport[]> {
    return this.http.delete<SaleReport[]>(`/api/v2/sale-reports/${id}`);
  }

  filterMapper(filter) {
    const props = ['pageSize', 'region', 'name', 'startDate', 'endDate'];
    const propsMapped = ['pagesize', 'distributor', 'outlet', 'fromdate', 'todate'];
    if (filter) {
      for(let i in props) {
        if (filter[props[i]]) {
          filter[propsMapped[i]] = filter[props[i]]
          delete filter[props[i]];
        }
      }
    }
    if (filter.page || filter.page === 0) {
      filter.page = filter.page + 1; 
    }
  }

  deleteFilterSaleReportByOutLet(id) {
    return this.http.delete<SaleReport[]>(`/api/v2/filter-sale-report-by-outlets/${id}`);
  }

  deleteFilterSaleReportBySku(id) {
    return this.http.delete<SaleReport[]>(`/api/v2/filter-sale-report-by-skuses/${id}`);
  }
}
