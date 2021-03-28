import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData, InputDatum } from '../../../interfaces/InputData';
import {
  descending,
  extent,
  interpolateYlGnBu,
  interpolateYlOrBr,
  schemeSet3,
} from 'd3';
import { ColumnCellView } from './interfaces/column-cell-view.interface';
import { scaleLinear } from 'd3-scale';
import { isCategorical } from '../../../services/isCategorical';

@Component({
  selector: 'g[app-column]',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, OnChanges {
  @Input() public width: number;
  @Input() public height: number;
  @Input() public key: string;
  @Input() public mKey: string;
  @Input() public data: InputData;

  columnCells: ColumnCellView[];
  private sortedData: InputDatum[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      const cellHeight = this.height / this.data.length;

      this.sortedData = this.data.slice().sort((a, b) => {
        return descending(a[this.key] ?? '', b[this.key] ?? '');
      });

      const color = this.getColorFunction();
      this.columnCells = this.sortedData.map((datum, i) => {
        return {
          y: i * cellHeight,
          height: cellHeight,
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
