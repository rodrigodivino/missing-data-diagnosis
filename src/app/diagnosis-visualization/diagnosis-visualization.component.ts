import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ScaleBand, scaleBand, scaleLinear } from 'd3-scale';
import { InputData } from '../interfaces/InputData';
import testData from '../services/testData';

@Component({
  selector: 'app-diagnosis-visualization',
  templateUrl: './diagnosis-visualization.component.html',
  styleUrls: ['./diagnosis-visualization.component.scss'],
  providers: [],
})
export class DiagnosisVisualizationComponent implements OnInit, OnChanges {
  public readonly margin = { top: 5, left: 20, right: 20, bottom: 5 };
  public xScale: ScaleBand<string> = scaleBand<string>();
  public yScale: ScaleBand<string> = scaleBand<string>();
  public colorGradient = scaleLinear<string, string>()
    .domain([0.025, 0.5, 0.975])
    .range(['coral', 'seashell', 'coral']);

  @Input() public data: InputData = testData;
  @Input() public fullHeight: number;
  @Input() public fullWidth: number;
  public keys: string[] = [];
  public mKeys: string[] = [];

  constructor() {}

  public keyID(_, key): string {
    return 'key-' + key;
  }
  public mKeyID(_, key): string {
    return 'keyWidthMissingValues-' + key;
  }
  public get innerHeight(): number {
    return this.fullHeight - this.margin.top - this.margin.bottom;
  }

  public get innerWidth(): number {
    return this.fullWidth - this.margin.left - this.margin.right;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.updateScaleDomain();
    }
    if (changes.fullWidth || changes.fullHeight) {
      this.updateScaleRange();
    }
  }

  public ngOnInit(): void {
    this.updateScaleDomain();
    this.updateScaleRange();
  }

  private updateScaleDomain(): void {
    this.createKeys();
    this.xScale = this.xScale?.copy().domain(this.keys);
    this.yScale = this.yScale?.copy().domain(this.mKeys);
  }

  private updateScaleRange(): void {
    this.xScale = this.xScale?.copy()?.range([0, this.innerWidth]);
    this.yScale = this.yScale?.copy()?.range([0, this.innerHeight]);
  }

  private createKeys(): void {
    this.keys = Object.keys(this.data[0]);
    this.mKeys = this.keys.filter((key) => {
      return this.data.some((datum) => datum[key] === null);
    });
    console.log('here', this.keys, this.data);
  }
}
