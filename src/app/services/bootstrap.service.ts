import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BootstrapResult } from '../interfaces/BootstrapResult';
import { ascending } from 'd3-array';
import { stableSample } from '../functions/stableSample';
import { quantile } from 'd3';

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
   * @param unsortedObservations - The sequence of ordinal values
   * @param mask - A mask for boolean variable
   * @returns An Observable for when the bootstrap is finished
   */
  public boot(
    unsortedObservations: number[],
    mask: boolean[]
  ): Observable<BootstrapResult> {
    const sortedObservations = unsortedObservations.slice().sort(ascending);
    const sortedSample = unsortedObservations
      .filter((_, i) => mask[i])
      .sort(ascending);

    const bootResponse = new Subject<BootstrapResult>();
    const N = mask.filter((m) => m).length;

    const randomRankSums = [];
    for (let i = 0; i < 1000; i++) {
      const random = stableSample<number>(sortedObservations, N);
      randomRankSums.push(this.rankSum(random, sortedObservations));
    }
    randomRankSums.sort(ascending);

    const randomRankSumInterval = [
      quantile(randomRankSums, 0.025),
      quantile(randomRankSums, 0.975),
    ];

    console.log('randomRankSumInterval', randomRankSumInterval);
    console.log(
      'sampleRankSum',
      this.rankSum(sortedSample, sortedObservations)
    );

    // console.log(stableSample<number>(sortedObservations, N), sortedSample);
    // const result: BootstrapResult = {
    //   RandomRankSumInterval,
    // };

    return bootResponse.asObservable();
  }

  private rankSum(subsample: number[], observations: number[]): number {
    const sequenceNotNull = observations.filter((n) => n !== null);
    const sampleNotNull = subsample.filter((n) => n !== null);

    const L = sequenceNotNull.length + sampleNotNull.length;

    let sampleRankSum = 0;
    let sampleI = 0;
    let sequenceI = 0;

    for (let rank = 1; rank <= L; rank++) {
      if (
        sampleNotNull[sampleI] === undefined ||
        sampleNotNull[sampleI] >= sequenceNotNull[sequenceI]
      ) {
        sequenceI++;
      } else {
        sampleRankSum += rank / L;
        sampleI++;
      }
    }
    return sampleRankSum;
  }
}
