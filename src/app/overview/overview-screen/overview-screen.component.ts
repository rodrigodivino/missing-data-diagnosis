import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../../interfaces/InputData';
import { scaleBand, ScaleBand } from 'd3-scale';

@Component({
  selector: 'g[app-overview-screen]',
  templateUrl: './overview-screen.component.html',
  styleUrls: ['./overview-screen.component.scss'],
})
export class OverviewScreenComponent implements OnInit, OnChanges {
  public xScale: ScaleBand<string> = scaleBand<string>();
  public yScale: ScaleBand<string> = scaleBand<string>();
  @Input() public data: InputData;
  @Input() public mKeys: string[];
  @Input() public keys: string[];
  @Input() public width: number;
  @Input() public height: number;

  constructor() {}

  public keyID(_, key): string {
    return 'key-' + key;
  }

  public mKeyID(_, key): string {
    return 'keyWidthMissingValues-' + key;
  }

  public ngOnInit(): void {
    this.updateScaleDomain();
    this.updateScaleRange();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.updateScaleDomain();
    }
    if (changes.width || changes.height) {
      this.updateScaleRange();
    }
  }

  private updateScaleDomain(): void {
    this.xScale = this.xScale?.copy().domain(this.keys);
    this.yScale = this.yScale?.copy().domain(this.mKeys);
  }

  private updateScaleRange(): void {
    this.xScale = this.xScale?.copy()?.range([0, this.width]);
    this.yScale = this.yScale?.copy()?.range([0, this.height]);
  }
}
