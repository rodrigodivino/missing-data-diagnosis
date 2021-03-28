import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData, InputDatum } from '../../../interfaces/InputData';
import { descending, extent, interpolateYlOrBr, schemeSet3 } from 'd3';
import { isCategorical } from '../../../services/isCategorical';
import { scaleLinear } from 'd3-scale';
import { LineCellView } from './interfaces/line-cell-view.interface';

@Component({
  selector: 'g[app-line]',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit, OnChanges {
  @Input() public width: number;
  @Input() public height: number;
  @Input() public key: string;
  @Input() public mKey: string;
  @Input() public data: InputData;

  lineCells: LineCellView[];
  private sortedData: InputDatum[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      const cellWidth = this.width / this.data.length;

      this.sortedData = this.data.slice().sort((a, b) => {
        return descending(a[this.key] ?? '', b[this.key] ?? '');
      });

      const color = this.getColorFunction();
      this.lineCells = this.sortedData.map((datum, i) => {
        return {
          x: this.width - cellWidth - i * cellWidth,
          width: cellWidth,
          color: color(datum),
          hasMissing: datum[this.mKey] === null,
        };
      });
    }
  }

  private getColorFunction(): (d: InputDatum) => string {
    let color: (d: InputDatum) => string;
    if (isCategorical(this.data, this.key)) {
      const categories = [...new Set(this.sortedData.map((d) => d[this.key]))];
      const colorScheme = [...schemeSet3];
      color = (datum) => {
        if (datum[this.key] === null) {
          return 'lightgray';
        }
        return colorScheme[categories.indexOf(datum[this.key])];
      };
    } else {
      const colorScale = scaleLinear<number, number>()
        .domain(extent(this.sortedData, (d) => d[this.key] as number))
        .range([0, 1]);
      color = (datum) => {
        if (datum[this.key] === null) {
          return 'lightgray';
        }
        return interpolateYlOrBr(0.6 * colorScale(datum[this.key] as number));
      };
    }
    return color;
  }
}
