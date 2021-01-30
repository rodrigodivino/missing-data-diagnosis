/**
 * The results of a bootstrap computation
 */
export interface BootstrapResult {
  /**
   * The confidence interval of rank sum of random samples against observation
   */
  RandomRankSumInterval: [number, number];
  /**
   * The confidence interval of sample rank of the sequence against random samples
   */
  SequenceRankSumInterval: [number, number];
  /**
   * The confidence interval of missing data rate of random samples against observation
   */
  RandomMissRateInterval: [number, number];
}
