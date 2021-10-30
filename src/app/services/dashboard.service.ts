import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})

  
  
export class DashboardService extends BaseService {
  
    constructor(private http: HttpClient) {
        super();
    }

    storeTopLow(): Observable<any[]> {
        return this.http.get<any[]>('/api/v1/reports/top-low');
    }

    storeTopHigh(): Observable<any[]> {
        return this.http.get<any[]>('/api/v1/reports/top-high');
    }

    checkinAbsentByDate(dates: any[] = []): Observable<any[]> {
        let query = dates.map((d) => `date=${d}`).join('&')
        return this.http.get<any[]>(`/api/v1/reports/checkin-absent${query ? '?'+query : ''}`);
    }

    targetActualByDate(dates: any[] = []): Observable<any[]> {
        let query = dates.map((d) => `date=${d}`).join('&')
        return this.http.get<any[]>(`/api/v1/reports/target-actual${query ? '?'+query : ''}`);
    }

    targetActualByMonth(months: any[] = []): Observable<any[]> {
        let query = months.map((d) => `month=${d}`).join('&')
        return this.http.get<any[]>(`/api/v1/reports/target-actual${query ? '?'+query : ''}`);
    }

    targetActualByGroup(months: any[] = []): Observable<any[]> {
        let query = months.map((d) => `month=${d}`).join('&')
        return this.http.get<any[]>(`/api/v1/reports/target-actual-group${query ? '?'+query : ''}`);
    }

}
