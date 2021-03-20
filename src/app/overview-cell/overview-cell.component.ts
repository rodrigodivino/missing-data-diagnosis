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
import { scaleLinear } from 'd3-scale';
import { easeExp, easeExpIn, easeExpOut, interpolateBlues } from 'd3';

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

  result: BootstrapResult = null;
  rankSumColor: string;
  missRateColor: string;

  private sequence: number[];
  private mask: boolean[];

  constructor(private bootstrapService: BootstrapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.key && this.mKey && this.data) {
      this.sequence = this.data.map((datum) => datum[this.key]);
      this.mask = this.data.map((datum) => datum[this.mKey] === null);
      this.bootstrapService
        .boot(this.sequence, this.mask)
        .subscribe((result: BootstrapResult) => {
          this.result = result;
          const rankSumDeviationColor = interpolateBlues(
            result.rankSumDeviationIndex
          );
          const missRateDeviationColor = interpolateBlues(
            result.missRateDeviationIndex
          );

          const rankSumFinalColor = scaleLinear<string, string>().range([
            '#dedede',
            rankSumDeviationColor,
          ])(easeExpOut(result.progress));
          const missRateFinalColor = scaleLinear<string, string>().range([
            '#dedede',
            missRateDeviationColor,
          ])(easeExpOut(result.progress));

          this.rankSumColor = rankSumFinalColor;
          this.missRateColor = missRateFinalColor;
        });
    }
  }

  ngOnInit(): void {}
}
