/**
 * The results of a bootstrap computation
 */
export interface BootstrapResult {
  /**
   * The confidence interval of rank sum of random subsample against observation
   */
  randomRankSumInterval: CI;

  /**
   * The rank sum of the testing sample against observation
   */
  sampleRankSum: number;
  /**
   * The confidence interval of missing data rate of random samples
   */
  randomMissRateInterval: CI;

  /**
   * The missing data rate of the testing sample
   */
  sampleMissRate: number;
}

export interface CI {
  lo: number;
  hi: number;
  min: number;
  max: number;
}
