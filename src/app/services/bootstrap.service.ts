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

  // TODO: Create a type for bootstrap statistic function and define it once in the class body
  private static mannWhitneyU(
    subsample: number[],
    observations: number[]
  ): number {
    const observationsNotNull = observations.filter((n) => n !== null);
    const subsampleNotNull = subsample.filter((n) => n !== null);
    const N = subsampleNotNull.length;
    const M = observationsNotNull.length;

    const L = M + N;

    let sampleRankSum = 0;
    let observationsRankSum = 0;
    let subsampleI = 0;
    let observationI = 0;

    for (let rank = 1; rank <= L; rank++) {
      if (
        subsampleNotNull[subsampleI] === undefined ||
        subsampleNotNull[subsampleI] >= observationsNotNull[observationI]
      ) {
        observationsRankSum += rank;
        observationI++;
      } else {
        sampleRankSum += rank;
        subsampleI++;
      }
    }
    const U1 = sampleRankSum - (N * (N + 1)) / 2;
    const U2 = observationsRankSum - (M * (M + 1)) / 2;
    return Math.min(U1, U2);
  }

  private static normalizedRankSum(
    subsample: number[],
    observations: number[]
  ): number {
    const observationsNotNull = observations.filter((n) => n !== null);
    const subsampleNotNull = subsample.filter((n) => n !== null);
    const N = subsampleNotNull.length;
    const M = observationsNotNull.length;

    const L = M + N;

    let sampleRankSum = 0;
    let subsampleI = 0;
    let observationI = 0;

    for (let rank = 1; rank <= L; rank++) {
      if (
        subsampleNotNull[subsampleI] === undefined ||
        subsampleNotNull[subsampleI] >= observationsNotNull[observationI]
      ) {
        observationI++;
      } else {
        sampleRankSum += rank / L;
        subsampleI++;
      }
    }

    return sampleRankSum;
  }

  private static countMissRate(sample: number[]): number {
    return sample.filter((n) => n === null).length / sample.length;
  }

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
    const bootstrapResult = new Subject<BootstrapResult>();

    this.runBoot(unsortedObservations, mask).then((result: BootstrapResult) => {
      bootstrapResult.next(result);
    });

    return bootstrapResult.asObservable();
  }

  private async runBoot(
    unsortedObservations: number[],
    mask: boolean[]
  ): Promise<BootstrapResult> {
    const sortedObservations = unsortedObservations.slice().sort(ascending);
    const sortedSample = unsortedObservations
      .filter((_, i) => mask[i])
      .sort(ascending);

    const N = mask.filter((m) => m).length;

    const randomRankSums = [];
    const randomMissRates = [];
    for (let i = 0; i < 2000; i++) {
      const random = stableSample<number>(sortedObservations, N);
      randomRankSums.push(
        BootstrapService.normalizedRankSum(random, sortedObservations)
      );
      randomMissRates.push(BootstrapService.countMissRate(random));
    }

    randomRankSums.sort(ascending);
    randomMissRates.sort(ascending);

    const randomRankSumInterval = {
      lo: quantile(randomRankSums, 0.025),
      hi: quantile(randomRankSums, 0.975),
      min: randomRankSums[0],
      max: randomRankSums[randomRankSums.length - 1],
    };

    const randomMissRateInterval = {
      lo: quantile(randomMissRates, 0.025),
      hi: quantile(randomMissRates, 0.975),
      min: randomMissRates[0],
      max: randomMissRates[randomMissRates.length - 1],
    };

    const result: BootstrapResult = {
      randomRankSumInterval,
      randomMissRateInterval,
      sampleMissRate: BootstrapService.countMissRate(sortedSample),
      sampleRankSum: BootstrapService.normalizedRankSum(
        sortedSample,
        sortedObservations
      ),
    };

    return result;
  }
}
