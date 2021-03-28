import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { scaleBand, ScaleBand } from 'd3-scale';
import { InputData } from '../../../interfaces/InputData';
import { OverviewCellView } from '../../overview/interfaces/overview-cell-view.interface';
import { Label } from '../../../interfaces/label.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnView } from '../interfaces/column-view.interface';

@Component({
  selector: 'g[app-horizontal-screen]',
  templateUrl: './horizontal-screen.component.html',
  styleUrls: ['./horizontal-screen.component.scss'],
})
export class HorizontalScreenComponent implements OnInit, OnChanges, OnDestroy {
  public xScale: ScaleBand<string> = scaleBand<string>();

  @Input() data: InputData;
  @Input() mKey: string;
  @Input() keys: string[];
  @Input() width: number;
  @Input() height: number;

  @Output() selectedMKeyChange = new EventEmitter<string>();
  @Output() selectedKeyChange = new EventEmitter<string>();

  mKeyLabel: Label = null;
  keyLabels: Label[] = [];
  columns: ColumnView[];
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

  resetMKey(): void {
    this.selectedMKeyChange.next(null);
  }

  selectKey(keyLabel: Label): void {
    this.selectedKeyChange.next(keyLabel.text);
  }

  private populateLabels(): void {
    this.mKeyLabel = {
      text: this.mKey,
      x: -5,
      y: this.height / 2,
    };

    this.keyLabels = [];

    for (const key of this.keys) {
      this.keyLabels.push({
        text: key,
        x: this.xScale(key) + this.xScale.bandwidth() / 2,
        y: -5,
      });
    }
  }

  private populateColumns(): void {
    this.columns = [];
    for (const key of this.keys) {
      if (key === this.mKey) {
        continue;
      }
      this.columns.push({
        height: this.height,
        width: this.xScale.bandwidth(),
        key,
        x: this.xScale(key),
        y: 0,
      });
    }
  }

  private initialize(): void {
    this._keyData$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.xScale = this.xScale?.copy().domain(this.keys);

      this.populateColumns();
      this.populateLabels();
    });

    this._resize$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.xScale = this.xScale?.copy()?.range([0, this.width]);

      this.populateColumns();
      this.populateLabels();
    });

    this._keyData$.next();
    this._resize$.next();
  }
}
