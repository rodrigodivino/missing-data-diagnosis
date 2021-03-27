import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData, InputDatum } from '../../interfaces/InputData';
import {
  descending,
  extent,
  interpolateYlGnBu,
  schemeCategory10,
  schemeSet3,
} from 'd3';
import { ColumnCellView } from './interfaces/column-cell-view.interface';
import { scaleLinear } from 'd3-scale';

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
  coMissingPadding = 5;
  coMissingHeight: number;
  coMissingPercentage: number;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.data) {
      const cellHeight = this.height / this.data.length;

      const validData = this.data
        .slice()
        .filter((d) => d[this.key] !== null)
        .sort((a, b) => descending(a[this.key], b[this.key]));

      this.coMissingHeight =
        this.height - cellHeight * validData.length - this.coMissingPadding;

      const nullData = this.data.slice().filter((d) => d[this.key] === null);
      const coMissingData = nullData.filter((d) => d[this.mKey] === null);

      this.coMissingPercentage = coMissingData.length / nullData.length;

      let color: (d: InputDatum) => string = null;
      if (this.data.some((d) => isNaN(d[this.key] as any))) {
        const categories = [...new Set(this.data.map((d) => d[this.key]))];
        const colorScheme = [...schemeSet3];
        color = (datum) => colorScheme[categories.indexOf(datum[this.key])];
      } else {
        const colorScale = scaleLinear<number, number>()
          .domain(extent(this.data, (d) => d[this.key] as number))
          .range([0, 1]);
        color = (datum) =>
          interpolateYlGnBu(colorScale(datum[this.key] as number));
      }

      this.columnCells = validData.map((datum, i) => {
        return {
          y: i * cellHeight,
          height: cellHeight + 0.5,
          color: color(datum),
          hasMissing: datum[this.mKey] === null,
        };
      });
    }
  }
}
