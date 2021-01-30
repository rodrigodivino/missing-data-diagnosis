import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BootstrapResult } from '../interfaces/BootstrapResult';
import { ascending } from 'd3-array';
import { stableSample } from '../functions/stableSample';

@Injectable({
  providedIn: 'root',
})
/**
 * Responsible for running and parallelling the bootstrap computation
 */
export class BootstrapService {
  constructor() {}

  /**
   * Computes boostrap statistics between a sample and a mask
   * @param sequence - The sequence of ordinal values
   * @param mask - A mask for boolean variable
   * @returns An Observable for when the bootstrap is finished
   */
  public boot(
    sequence: number[],
    mask: boolean[]
  ): Observable<BootstrapResult> {
    sequence.sort(ascending);
    const bootResponse = new Subject<BootstrapResult>();
    const M = sequence.length;
    const N = mask.filter((m) => m).length;

    for (let i = 0; i < 1; i++) {
      // TODO: Filter nulls and debug rank sum algorithm
      const L = M + N;
      const random = stableSample<number | string>(sequence, N);
      let randomRankSum = 0;
      let randomI = 0;
      let sequenceI = 0;
      for (let r = 1; r <= L; r++) {
        if (sequenceI >= M || random[randomI] < sequence[sequenceI]) {
          randomRankSum += r / L;
          randomI++;
          console.log('random: ' + r, random[randomI]);
        } else {
          sequenceI++;
          console.log('sequence: ' + r, sequence[sequenceI]);
        }
      }
    }

    return bootResponse.asObservable();
  }
}
