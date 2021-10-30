import {Observable, Observer, ReplaySubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {MathContent} from './math-content';

// see https://stackoverflow.com/a/12709880/1203690
declare global {
  interface Window {
    hubReady: Observer<boolean>;
  }
}


export interface MathService {
  ready(): Observable<boolean>;

  render(element: HTMLElement, math?: MathContent): void;
}

@Injectable()
export class MathServiceImpl implements MathService {
  private readonly notifier: ReplaySubject<boolean>;

  constructor() {
    console.log(`service constructor`);
    this.notifier = new ReplaySubject<boolean>();
    window.hubReady = this.notifier;
  }

  ready(): Observable<boolean> {
    return this.notifier;
  }

  render(element: HTMLElement, math?: MathContent): void {
    if (math) {
      if (math.latex) {
        element.innerText = math.latex;
      } else {
        element.innerHTML = math.mathml;
      }
    }

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, element]);
  }
}