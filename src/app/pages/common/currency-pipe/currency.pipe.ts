import {Pipe, PipeTransform} from '@angular/core';
import { CurrencyService } from './currency-pipe.service';
@Pipe ({
   name : 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
    constructor(private currencyService: CurrencyService) {

    }
    transform(val : number, currency?: boolean | number) : string {
       return this.currencyService.transform(val, currency);
    }
}