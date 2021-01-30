import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../interfaces/InputData';

@Component({
  selector: 'g[app-overview-cell]',
  templateUrl: './overview-cell.component.html',
  styleUrls: ['./overview-cell.component.scss'],
})
export class OverviewCellComponent implements OnInit, OnChanges {
  @Input() public width: number;
  @Input() public height: number;
  @Input() public key: string;
  @Input() public mKey: string;

  public sequence: number[];
  public mask: boolean[];

  constructor() {}

  @Input() public data: InputData;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.key && this.mKey && this.data) {
      this.sequence = this.data.map((datum) => datum[this.key]);
      this.mask = this.data.map((datum) => datum[this.mKey] === null);
    }
  }
}
