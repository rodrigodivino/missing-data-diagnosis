import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BootstrapResult } from '../interfaces/BootstrapResult';
import { ascending } from 'd3-array';
import { stableSample } from '../functions/stableSample';
import { BootstrapStatisticsService } from './bootstrap-statistics.service';
import { BootstrapResultBuilder } from './bootstrap-result-builder';
import { datum } from '../types/datum';

@Injectable({
  providedIn: 'root',
})
/**
 * Responsible for running and parallelling the bootstrap computation
 */
export class BootstrapService {
  private static readonly MAX_ITERATIONS = 20000;

  constructor() {}

  /**
   * Computes boostrap statistics between a sample and a mask
   * @param unsortedObservations - The sequence of ordinal values
   * @param mask - A mask for boolean variable
   * @returns An Observable for when the bootstrap is finished
   */
  public boot(
    unsortedObservations: datum[],
    mask: boolean[]
  ): Observable<BootstrapResult> {
    const bootstrapResult = new Subject<BootstrapResult>();

    const handleRunBootResult = (result?: BootstrapResult) => {
      if (result) {
        bootstrapResult.next(result);
      }
      setTimeout(() => {
        this.runBoot(unsortedObservations, mask, result).then(
          (newResult: BootstrapResult) => {
            if (
              newResult.randomDeviationMetric.length <
              BootstrapService.MAX_ITERATIONS
            ) {
              handleRunBootResult(newResult);
            }
          }
        );
      }, 100);
    };

    handleRunBootResult();

    return bootstrapResult.asObservable();
  }

  private async runBoot(
    unsortedObservations: datum[],
    mask: boolean[],
    previousResult?: BootstrapResult
  ): Promise<BootstrapResult> {
    const sortedObservations = unsortedObservations.slice().sort(ascending);
    const sortedSample = unsortedObservations
      .filter((_, i) => mask[i])
      .sort(ascending);

    const N = mask.filter((m) => m).length;

    const randomDeviationMetrics = previousResult?.randomDeviationMetric ?? [];
    const randomMissRates = previousResult?.randomMissRates ?? [];

    const [
      sampleDeviationMetric,
      sampleMissRate,
    ] = BootstrapStatisticsService.getMetrics(sortedSample, sortedObservations);

    for (let i = 0; i < 100; i++) {
      const random = stableSample<datum>(sortedObservations, N);
      const [
        randomDeviationMetric,
        randomMissRate,
      ] = BootstrapStatisticsService.getMetrics(random, sortedObservations);

      randomDeviationMetrics.push(randomDeviationMetric);
      randomMissRates.push(randomMissRate);
    }

    randomDeviationMetrics.sort(ascending);
    randomMissRates.sort(ascending);

    return new BootstrapResultBuilder(
      randomDeviationMetrics,
      randomMissRates,
      sampleDeviationMetric,
      sampleMissRate,
      randomDeviationMetrics.length,
      BootstrapService.MAX_ITERATIONS
    );
  }
}
