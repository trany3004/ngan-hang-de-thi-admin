import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  @Input() zoom: number = 15;
  // initial center position for the map
  @Input() lat: number = 0;
  @Input() lng: number = 0;
  @Input() address: string = '';
  @Input() mapUrl = ''

  url: any = '';

  constructor(private sanitizer: DomSanitizer) {
    this.url = this.domSanitizerUrl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && (changes.mapUrl || changes.lat || changes.lng || changes.address || changes.zoom)) {
      this.url = this.domSanitizerUrl();
    }
  }

  domSanitizerUrl() {
    let position
    if (this.mapUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.mapUrl);
    }
    if (this.address) {
      position = encodeURIComponent(this.address)
    } else {
      position = `${this.lat},${this.lng}`
    }
    const url = `https://maps.google.com/maps?q=${position}&z=${this.zoom}&output=embed`
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
