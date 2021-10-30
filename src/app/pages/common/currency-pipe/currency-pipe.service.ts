import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    transform(val : number, currency?: boolean | number) : string {
        if (!currency) {
            return this.numberWithDots(val);
        }
        const numberDot = this.numberWithDots(val);
         return (!numberDot && numberDot !=='0') ? '' : numberDot + (typeof currency === 'boolean' ? 'đ' : currency);
    }
 
     numberWithDots(x) {
        return (!x && x!=0) ? '' : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}
