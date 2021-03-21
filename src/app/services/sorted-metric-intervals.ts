import { quantile } from 'd3';
import { CI } from '../interfaces/BootstrapResult';

export class SortedMetricIntervals implements CI {
  public lo: number;
  public hi: number;
  public min: number;
  public max: number;

  constructor(metrics: number[]) {
    this.lo = quantile(metrics, 0.025);
    this.hi = quantile(metrics, 0.975);
    this.min = metrics[0];
    this.max = metrics[metrics.length - 1];
  }
}
