import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormatCurrencyPipe } from './currency.pipe';

@NgModule({
    imports:      [CommonModule],
    declarations: [FormatCurrencyPipe],
    exports:      [FormatCurrencyPipe],
  })
  export class CurrencyModule { }