import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataRefreshService {
  private exclusivePatentsRefreshSource = new Subject<void>();

  exclusivePatentsRefresh$ = this.exclusivePatentsRefreshSource.asObservable();

  triggerExclusivePatentsRefresh() {
    this.exclusivePatentsRefreshSource.next();
  }
}
