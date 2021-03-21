import { BootstrapResult, CI } from '../interfaces/BootstrapResult';
import { SortedMetricIntervals } from './sorted-metric-intervals';

export class BootstrapResultBuilder implements BootstrapResult {
  deviationMetricDeviationIndex: number;
  iterations: number;
  missRateDeviationIndex: number;
  progress: number;
  randomDeviationMetric: number[];
  randomDeviationMetricInterval: CI;
  randomMissRateInterval: CI;
  randomMissRates: number[];
  sampleDeviationMetric: number;
  sampleMissRate: number;

  constructor(
    randomDeviationMetrics: number[],
    randomMissRates: number[],
    sampleDeviationMetric: number,
    sampleMissRate: number,
    iteration: number,
    maxIteration: number
  ) {
    const randomDeviationMetricInterval = new SortedMetricIntervals(
      randomDeviationMetrics
    );
    const randomMissRateInterval = new SortedMetricIntervals(randomMissRates);

    this.iterations = iteration;
    this.progress = iteration / maxIteration;
    this.randomDeviationMetric = randomDeviationMetrics;
    this.randomMissRates = randomMissRates;
    this.missRateDeviationIndex = 0;
    this.deviationMetricDeviationIndex = 0;
    this.randomDeviationMetricInterval = randomDeviationMetricInterval;
    this.randomMissRateInterval = randomMissRateInterval;
    this.sampleMissRate = sampleMissRate;
    this.sampleDeviationMetric = sampleDeviationMetric;

    this.deviationMetricDeviationIndex = BootstrapResultBuilder.calculateDeviationIndex(
      this.randomDeviationMetricInterval,
      this.sampleDeviationMetric
    );

    this.missRateDeviationIndex = BootstrapResultBuilder.calculateDeviationIndex(
      this.randomMissRateInterval,
      this.sampleMissRate
    );
  }

  private static calculateDeviationIndex(interval: CI, value: number): number {
    if (value >= interval.lo && value <= interval.hi) {
      return 0;
    }
    if (value <= interval.min || value >= interval.max) {
      return 1;
    }
    if (value < interval.lo) {
      return BootstrapResultBuilder.minMaxScaling(
        interval.lo,
        interval.min,
        value
      );
    }
    return BootstrapResultBuilder.minMaxScaling(
      interval.hi,
      interval.max,
      value
    );
  }

  private static minMaxScaling(
    floor: number,
    ceil: number,
    value: number
  ): number {
    return (value - floor) / (ceil - floor);
  }
}
