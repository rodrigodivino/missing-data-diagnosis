/**
 * The results of a bootstrap computation
 */
export interface BootstrapResult {
  iterations: number;
  progress: number;
  randomRankSums: number[];
  randomMissRates: number[];
  /**
   * The confidence interval of rank sum of random subsample against observation
   */
  randomRankSumInterval: CI;

  /**
   * The rank sum of the testing sample against observation
   */
  sampleRankSum: number;

  /**
   * A number between 0 and 1 that indicates the likelyhood of the sample rankSum being anomalous
   */
  rankSumDeviationIndex: number;

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
