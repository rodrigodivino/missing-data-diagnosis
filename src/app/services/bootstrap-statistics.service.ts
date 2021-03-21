import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BootstrapStatisticsService {
  constructor() {}

  public static getMetrics(
    subsample: (number | string)[],
    observations: (number | string)[]
  ): [number, number] {
    return [
      BootstrapStatisticsService.autoBootstrapMetric(subsample, observations),
      BootstrapStatisticsService.countMissRate(subsample),
    ];
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

  private static categoricalRMSE(
    subsample: string[],
    observations: string[]
  ): number {
    const categories = [...new Set(observations)];

    const trueRates = BootstrapStatisticsService.getCountRates(
      observations,
      categories
    );
    const sampleRates = BootstrapStatisticsService.getCountRates(
      subsample,
      categories
    );

    let SE = 0;
    for (const category of categories) {
      SE +=
        ((sampleRates[category] ?? 0 - trueRates[category] ?? 0) * 100) ** 2;
    }
    const MSE = SE / categories.length;
    return Math.sqrt(MSE);
  }

  private static countMissRate(sample: (number | string)[]): number {
    return sample.filter((n) => n === null).length / sample.length;
  }

  private static autoBootstrapMetric(
    subsample: (number | string)[],
    observations: (number | string)[]
  ): number {
    if (observations.some((obs: any) => isNaN(obs))) {
      return this.categoricalRMSE(
        subsample as string[],
        observations as string[]
      );
    } else {
      return this.normalizedRankSum(
        subsample as number[],
        observations as number[]
      );
    }
  }

  private static getCountRates(
    observations: string[],
    categories: string[]
  ): { [category: string]: number } {
    const trueRates = {};

    for (const category of categories) {
      trueRates[category] =
        observations.filter((d) => d === category).length / observations.length;
    }

    return trueRates;
  }
}
