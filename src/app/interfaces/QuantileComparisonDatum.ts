export default interface QuantileComparisonDatum {
  seq: number;
  /**
   * @property p
   * @description How many bootstrapped numbers are smaller or equal the sequence number. Normalized from 0 to 1
   */
  p: number;
  bootLo95: number;
  bootAvg: number;
  bootHi95: number;
}
