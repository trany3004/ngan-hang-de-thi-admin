import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MathServiceImpl} from './math.service';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {MathContent} from './math-content';


@Directive({
  selector: '[appMath]'
})
export class MathDirective implements OnInit, OnChanges, OnDestroy {
  private alive$ = new Subject<boolean>();

  @Input()
  private appMath: MathContent;
  private readonly _el: HTMLElement;

  constructor(private service: MathServiceImpl,
              private el: ElementRef) {
    this._el = el.nativeElement as HTMLElement;
  }

  ngOnInit(): void {
    this.service
      .ready()
      .pipe(
        take(1),
        takeUntil(this.alive$)
      ).subscribe(res => {
        this.service.render(this._el, this.appMath);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appMath && !changes.appMath.firstChange) {
        this.service.render(this._el, this.appMath);
      };
  }

  ngOnDestroy(): void {
    this.alive$.next(false);
  }
}