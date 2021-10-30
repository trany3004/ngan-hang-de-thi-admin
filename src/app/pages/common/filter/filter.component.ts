import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cities, Regions } from 'src/app/constant/constant';
import { OutletService } from 'src/app/services/outlet.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() showBrand = false;
  @Input() showProgram = false;
  @Output() onFilterData: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilterDataWithMoreInfo: EventEmitter<any> = new EventEmitter<any>();
  cities: any[] = Cities;

  regions: any[] = Regions;

  loadSubscription: Subscription;
  outlets: any[] = [];
  allOutlets: any[] = [];
  filter: any = {
    region: null,
    city: null,
    name: null,
    startDate: null,
    endDate: null,
    brand: null,
    program: null
  }

  constructor(private outletService: OutletService) {
    
  }
  ngOnDestroy(): void {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    // this.loadSubscription = this.outletService.fetchoutlets().subscribe((outlets) => {
    //   this.outlets = JSON.parse(JSON.stringify(outlets));
    //   this.allOutlets = outlets;
    // })
  }

  changeRegion() {
    this.filter.outlet = null;
    this.outlets = [];
    // if (this.allOutlets && this.allOutlets.length) {
    //   this.outlets = this.allOutlets.filter(({group}) => group === this.filter.region);
    // } else {
    //   if (this.loadSubscription) {
    //     this.loadSubscription.unsubscribe();
    //   }
    //   this.loadSubscription = this.outletService.fetchoutlets().subscribe((outlets) => {
    //     this.allOutlets = outlets;
    //     this.outlets = this.allOutlets.filter(({group}) => group === this.filter.region);
    //   })
    // }
  }

  clear() {
    for(const prop in this.filter) {
      this.filter[prop] = null;
    }
    this.outlets = this.allOutlets;
    this.onFilter();
  }

  onFilter() {
    let newFilter = {
      ...this.filter
    }
    let moreFilterInfo = {
      ...this.filter
    }
    if (this.filter.startDate) {
      const {year, month, date} = this.filter.startDate._i;
      console.log(`${month+1}/${date}/${year}`)
      newFilter.startDate = new Date(Date.UTC(year, month, date,0,0,0)).getTime() - (7 * 60*60*1000);
      moreFilterInfo.startDate = `${month+1}/${date}/${year}`;
    }
    if (this.filter.endDate) {
        const {year, month, date} = this.filter.endDate._i;
        newFilter.endDate = new Date(Date.UTC(year, month, date + 1,0,0,0)).getTime() - (7 * 60*60*1000);
        moreFilterInfo.endDate = `${month+1}/${date}/${year}`;
    }
    this.onFilterData.emit(newFilter);
    this.onFilterDataWithMoreInfo.emit(moreFilterInfo);
  }

}
