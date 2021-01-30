import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../interfaces/InputData';
import { BootstrapService } from '../services/bootstrap.service';

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

  constructor(private bootstrapService: BootstrapService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && this.key && this.mKey && this.data) {
      this.sequence = this.data.map((datum) => datum[this.key]);
      this.mask = this.data.map((datum) => datum[this.mKey] === null);
      this.bootstrapService.boot(this.sequence, this.mask).subscribe(() => {});
    }
  }
}
