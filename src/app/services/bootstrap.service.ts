import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BootstrapResult, CI } from '../interfaces/BootstrapResult';
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
  private static readonly MAX_ITERATIONS = 20000;

  constructor() {}

  private static minMaxScaling(
    floor: number,
    ceil: number,
    value: number
  ): number {
    return (value - floor) / (ceil - floor);
  }

  private static calculateDeviationIndex(interval: CI, value: number): number {
    if (value >= interval.lo && value <= interval.hi) {
      return 0;
    }
    if (value <= interval.min || value >= interval.max) {
      return 1;
    }
    if (value < interval.lo) {
      return BootstrapService.minMaxScaling(interval.lo, interval.min, value);
    }
    return BootstrapService.minMaxScaling(interval.hi, interval.max, value);
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

    const handleRunBootResult = (result?: BootstrapResult) => {
      if (
        result &&
        result.randomRankSums.length < BootstrapService.MAX_ITERATIONS
      ) {
        bootstrapResult.next(result);
      }
      setTimeout(() => {
        this.runBoot(unsortedObservations, mask, result).then(
          (newResult: BootstrapResult) => {
            handleRunBootResult(newResult);
          }
        );
      }, 100);
    };

    handleRunBootResult();

    return bootstrapResult.asObservable();
  }

  private async runNumericalBoot(
    unsortedObservations: number[],
    mask: boolean[],
    previousResult?: BootstrapResult
  ): Promise<BootstrapResult> {
    const sortedObservations = unsortedObservations.slice().sort(ascending);
    const sortedSample = unsortedObservations
      .filter((_, i) => mask[i])
      .sort(ascending);

    const N = mask.filter((m) => m).length;

    const randomRankSums = previousResult?.randomRankSums ?? [];
    const randomMissRates = previousResult?.randomMissRates ?? [];
    for (let i = 0; i < 100; i++) {
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
      iterations: randomRankSums.length,
      progress: randomRankSums.length / BootstrapService.MAX_ITERATIONS,
      randomRankSums,
      randomMissRates,
      missRateDeviationIndex: 0,
      rankSumDeviationIndex: 0,
      randomRankSumInterval,
      randomMissRateInterval,
      sampleMissRate: BootstrapService.countMissRate(sortedSample),
      sampleRankSum: BootstrapService.normalizedRankSum(
        sortedSample,
        sortedObservations
      ),
    };

    result.rankSumDeviationIndex = BootstrapService.calculateDeviationIndex(
      result.randomRankSumInterval,
      result.sampleRankSum
    );

    result.missRateDeviationIndex = BootstrapService.calculateDeviationIndex(
      result.randomMissRateInterval,
      result.sampleMissRate
    );
    return result;
  }

  private async runBoot(
    unsortedObservations: number[],
    mask: boolean[],
    previousResult?: BootstrapResult
  ): Promise<BootstrapResult> {
    if (unsortedObservations.some((obs) => isNaN(obs))) {
      return await this.runCategoricalBoot(
        unsortedObservations,
        mask,
        previousResult
      );
    }
    return await this.runNumericalBoot(
      unsortedObservations,
      mask,
      previousResult
    );
  }

  private async runCategoricalBoot(
    unsortedObservations: number[],
    mask: boolean[],
    previousResult: BootstrapResult
  ): Promise<BootstrapResult> {
    console.log('here');
    return undefined;
  }
}
