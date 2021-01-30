import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BootstrapResult } from '../interfaces/BootstrapResult';
import { ascending } from 'd3-array';
import { stableSample } from '../functions/stableSample';

@Injectable({
  providedIn: 'root',
})
export class BootstrapService {
  constructor() {}

  public boot(
    sequence: number[],
    mask: boolean[]
  ): Observable<BootstrapResult> {
    sequence.sort(ascending);
    const bootResponse = new Subject<BootstrapResult>();
    const N = mask.filter((m) => m).length;

    for (let i = 0; i < 1; i++) {
      const random = stableSample<number | string>(sequence, N);
      console.log(sequence, N, random);
    }

    return bootResponse.asObservable();
  }
}
