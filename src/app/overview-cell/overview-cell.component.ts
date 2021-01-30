import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../interfaces/InputData';
import { BootstrapService } from '../services/bootstrap.service';
import { BootstrapResult } from '../interfaces/BootstrapResult';
import { color, ScaleLinear, scaleLinear } from 'd3';
import { sample } from 'rxjs/operators';

@Component({
  selector: 'g[app-overview-cell]',
  templateUrl: './overview-cell.component.html',
  styleUrls: ['./overview-cell.component.scss'],
  providers: [BootstrapService],
})
export class OverviewCellComponent implements OnInit, OnChanges {
  @Input() public width: number;
  @Input() public height: number;
  @Input() public key: string;
  @Input() public mKey: string;
  @Input() public data: InputData;

  public sequence: number[];
  public mask: boolean[];

  private result: BootstrapResult = null;
  private rankSumOpacityScale: ScaleLinear<number, number> = scaleLinear<
    number,
    number
  >();
  private missRateOpacityScale: ScaleLinear<number, number> = scaleLinear<
    number,
    number
  >();

  constructor(private bootstrapService: BootstrapService) {}

  public get cellColor(): string {
    if (this.rankSumSignificance) {
      console.log(this.mKey, this.key, this.result, this.rankSumSignificance);
    }
    if (!this.result) {
      return 'slategray';
    }
    if (this.missRateSignificance && this.rankSumSignificance) {
      const c = color('purple');
      c.opacity = (this.rankSumOpacity + this.missRateOpacity) / 2;
      return c.toString();
    }
    if (this.missRateSignificance) {
      const c = color('steelblue');
      c.opacity = this.missRateOpacity;
      return c.toString();
    }
    if (this.rankSumSignificance) {
      const c = color('firebrick');
      c.opacity = this.rankSumOpacity;
      return c.toString();
    }
    return 'aliceblue';
  }

  private get missRateSignificance(): boolean {
    if (!this.result) {
      return false;
    }
    const { sampleMissRate, randomMissRateInterval } = this.result;
    return (
      sampleMissRate < randomMissRateInterval.lo ||
      sampleMissRate > randomMissRateInterval.hi
    );
  }

  private get rankSumSignificance(): boolean {
    if (!this.result) {
      return false;
    }

    const { sampleRankSum, randomRankSumInterval } = this.result;
    return (
      sampleRankSum < randomRankSumInterval.lo ||
      sampleRankSum > randomRankSumInterval.hi
    );
  }

  private get rankSumOpacity(): number {
    const { randomRankSumInterval, sampleRankSum } = this.result;
    const { min, max, lo, hi } = randomRankSumInterval;
    if (sampleRankSum < min || sampleRankSum > max) {
      return 1;
    } else if (sampleRankSum > lo && sampleRankSum < hi) {
      return 0;
    } else {
      if (sampleRankSum < lo) {
        return this.scaleMinMax(sampleRankSum, lo, min);
      } else {
        return this.scaleMinMax(sampleRankSum, hi, max);
      }
    }
  }

  private scaleMinMax(n, start, end): number {
    return (n - start) / (end - start);
  }
  private get missRateOpacity(): number {
    const { randomMissRateInterval, sampleMissRate } = this.result;
    const { min, max, lo, hi } = randomMissRateInterval;
    if (sampleMissRate < min || sampleMissRate > max) {
      return 1;
    } else if (sampleMissRate > lo && sampleMissRate < hi) {
      return 0;
    } else {
      if (sampleMissRate < lo) {
        return this.scaleMinMax(sampleMissRate, lo, min);
      } else {
        return this.scaleMinMax(sampleMissRate, hi, max);
      }
    }
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.key && this.mKey && this.data) {
      this.sequence = this.data.map((datum) => datum[this.key]);
      this.mask = this.data.map((datum) => datum[this.mKey] === null);
      this.bootstrapService
        .boot(this.sequence, this.mask)
        .subscribe((result: BootstrapResult) => {
          this.result = result;
        });
    }
  }
}
