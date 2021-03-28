import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../../interfaces/InputData';
import { scaleBand, ScaleBand } from 'd3-scale';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OverviewCellView } from '../interfaces/overview-cell-view.interface';
import { Label } from '../../interfaces/label.interface';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'g[app-overview-screen]',
  templateUrl: './overview-screen.component.html',
  styleUrls: ['./overview-screen.component.scss'],
})
export class OverviewScreenComponent implements OnInit, OnChanges, OnDestroy {
  public xScale: ScaleBand<string> = scaleBand<string>().padding(0.05);
  public yScale: ScaleBand<string> = scaleBand<string>().padding(0.05);

  @Input() data: InputData;
  @Input() mKeys: string[];
  @Input() keys: string[];
  @Input() width: number;
  @Input() height: number;

  @Output() selectedMKeyChange = new EventEmitter<string>();
  @Output() selectedKeyChange = new EventEmitter<string>();

  overviewCells: OverviewCellView[] = [];
  mKeyLabels: Label[] = [];
  keyLabels: Label[] = [];

  private _destroy$ = new Subject<void>();
  private _keyData$ = new Subject<void>();
  private _resize$ = new Subject<void>();

  constructor() {}

  public ngOnInit(): void {
    this.initialize();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.keys || changes.mKeys) {
      this._keyData$.next();
    }
    if (changes.width || changes.height) {
      this._resize$.next();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public trackCell(_, d: OverviewCellView): string {
    return '' + d.mKey + d.key;
  }

  trackLabel(_, d: Label): string {
    return '' + d.text;
  }

  private populateLabels(): void {
    this.mKeyLabels = [];

    for (const mKey of this.mKeys) {
      this.mKeyLabels.push({
        text: mKey,
        x: -5,
        y: this.yScale(mKey) + this.yScale.bandwidth() / 2,
      });
    }

    this.keyLabels = [];

    for (const key of this.keys) {
      this.keyLabels.push({
        text: key,
        x: this.xScale(key) + this.xScale.bandwidth() / 2,
        y: -5,
      });
    }
  }

  private populateOverviewCells(): void {
    this.overviewCells = [];
    for (const key of this.keys) {
      for (const mKey of this.mKeys) {
        if (key === mKey) {
          continue;
        }
        this.overviewCells.push({
          height: this.yScale.bandwidth(),
          width: this.xScale.bandwidth(),
          key,
          mKey,
          x: this.xScale(key),
          y: this.yScale(mKey),
        });
      }
    }
  }

  private initialize(): void {
    this._keyData$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.xScale = this.xScale?.copy().domain(this.keys);
      this.yScale = this.yScale?.copy().domain(this.mKeys);

      this.populateOverviewCells();
      this.populateLabels();
    });

    this._resize$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.xScale = this.xScale?.copy()?.range([0, this.width]);
      this.yScale = this.yScale?.copy()?.range([0, this.height]);

      this.populateOverviewCells();
      this.populateLabels();
    });

    this._keyData$.next();
    this._resize$.next();
  }

  selectMKey(mKeyLabel: Label): void {
    this.selectedMKeyChange.next(mKeyLabel.text);
  }

  selectKey(keyLabel: Label): void {
    this.selectedKeyChange.next(keyLabel.text);
  }
}
