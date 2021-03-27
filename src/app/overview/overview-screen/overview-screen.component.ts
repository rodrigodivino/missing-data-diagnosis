import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../../interfaces/InputData';
import { scaleBand, ScaleBand } from 'd3-scale';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OverviewCell } from '../interfaces/overview-cell.interface';

@Component({
  selector: 'g[app-overview-screen]',
  templateUrl: './overview-screen.component.html',
  styleUrls: ['./overview-screen.component.scss'],
})
export class OverviewScreenComponent implements OnInit, OnChanges, OnDestroy {
  public xScale: ScaleBand<string> = scaleBand<string>();
  public yScale: ScaleBand<string> = scaleBand<string>();
  @Input() public data: InputData;
  @Input() public mKeys: string[];
  @Input() public keys: string[];
  @Input() public width: number;
  @Input() public height: number;
  overviewCells: OverviewCell[];
  private _destroy$ = new Subject<void>();
  private _keyData$ = new Subject<{ keys: string[]; mKeys: string[] }>();
  private _resize$ = new Subject<{ width: number; height: number }>();

  constructor() {}

  public ngOnInit(): void {
    this.initialize();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.keys || changes.mKeys) {
      this._keyData$.next({ keys: this.keys, mKeys: this.mKeys });
    }
    if (changes.width || changes.height) {
      this._resize$.next({ width: this.width, height: this.height });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public trackCell(_, d: OverviewCell): string {
    return '' + d.mKey + d.key;
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
    this._keyData$
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ keys, mKeys }) => {
        this.xScale = this.xScale?.copy().domain(keys);
        this.yScale = this.yScale?.copy().domain(mKeys);

        this.populateOverviewCells();
      });

    this._resize$
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ width, height }) => {
        this.xScale = this.xScale?.copy()?.range([0, width]);
        this.yScale = this.yScale?.copy()?.range([0, height]);

        this.populateOverviewCells();
      });

    this._keyData$.next({ keys: this.keys, mKeys: this.mKeys });
    this._resize$.next({ width: this.width, height: this.height });
  }
}
