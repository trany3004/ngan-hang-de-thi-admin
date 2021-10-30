import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

  
  
export class BaseService {

    generateFilter({ page, pageSize, ...rest }) {
      const filter = {
        _limit: pageSize,
        _start: page * pageSize,
        ...rest
      };
  
      for (const propName in filter) {
        if (!filter[propName] && filter[propName] !== 0) {
          delete filter[propName];
        }
      }
      return filter;
    }

    filter({ page, pageSize, ...rest }) {
      const filter = {
        page,
        pageSize,
        ...rest
      };
  
      for (const propName in filter) {
        if (!filter[propName] && filter[propName] !== 0) {
          delete filter[propName];
        }
      }
      console.log(filter);
      return filter;
    }
}
