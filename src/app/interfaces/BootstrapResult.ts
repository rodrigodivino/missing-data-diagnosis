/**
 * The results of a bootstrap computation
 */
export interface BootstrapResult {
  /**
   * The current iteration
   */
  iterations: number;
  /**
   * The % of progress of the computing
   */
  progress: number;
  /**
   * The accumulated deviation metric (rank sum or RMSE) of previous bootstrap results
   */
  randomDeviationMetric: number[];
  /**
   * The accumulated missRates of previous bootstrap results
   */
  randomMissRates: number[];
  /**
   * The confidence interval of the deviation metric (rank sum or RMSE) of random subsample against observation
   */
  randomDeviationMetricInterval: CI;

  /**
   * The deviation metric (rank sum or RMSE) of the testing sample against observation
   */
  sampleDeviationMetric: number;

  /**
   * A number between 0 and 1 that indicates the likelyhood of the sample deviation metric (rank sum or RMSE) being anomalous
   */
  deviationMetricDeviationIndex: number;

  /**
   * The confidence interval of missing data rate of random samples
   */
  randomMissRateInterval: CI;

  /**
   * The missing data rate of the testing sample
   */
  sampleMissRate: number;

  /**
   * A number between 0 and 1 that indicates the likelyhood of the sample rankSum being anomalous
   */
  missRateDeviationIndex: number;
}

export interface CI {
  lo: number;
  hi: number;
  min: number;
  max: number;
}
