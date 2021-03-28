import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../../interfaces/InputData';
import { BootstrapService } from '../../services/bootstrap.service';
import { BootstrapResult } from '../../interfaces/BootstrapResult';
import { interpolateRdYlBu, interpolateYlGnBu, interpolateYlOrRd } from 'd3';
import { datum } from '../../types/datum';

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

  private sequence: datum[];
  private mask: boolean[];

  constructor(private bootstrapService: BootstrapService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.key && this.mKey && this.data) {
      this.sequence = this.data.map((d) => d[this.key]);
      this.mask = this.data.map((d) => d[this.mKey] === null);
      this.bootstrapService
        .boot(this.sequence, this.mask)
        .subscribe((result: BootstrapResult) => {
          this.result = result;
          const rankSumDeviationColor =
            result.deviationMetricDeviationIndex === 0
              ? '#e5e5e5'
              : interpolateYlOrRd(result.deviationMetricDeviationIndex);

          const missRateDeviationColor =
            result.missRateDeviationIndex === 0
              ? '#e5e5e5'
              : interpolateYlOrRd(result.missRateDeviationIndex);

          this.rankSumColor = rankSumDeviationColor;
          this.missRateColor = missRateDeviationColor;
        });
    }
  }

  ngOnInit(): void {}
}
