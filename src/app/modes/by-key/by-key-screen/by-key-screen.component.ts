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
import { Label } from '../../../interfaces/label.interface';
import { Subject } from 'rxjs';
import { OverviewCellView } from '../../overview/interfaces/overview-cell-view.interface';
import { takeUntil } from 'rxjs/operators';
import { LineView } from '../interfaces/line-view.interface';

@Component({
  selector: 'g[by-key-screen]',
  templateUrl: './by-key-screen.component.html',
  styleUrls: ['./by-key-screen.component.scss'],
})
export class ByKeyScreenComponent implements OnInit, OnChanges, OnDestroy {
  public yScale: ScaleBand<string> = scaleBand<string>().padding(0.05);

  @Input() data: InputData;
  @Input() mKeys: string[];
  @Input() key: string;
  @Input() width: number;
  @Input() height: number;

  @Output() selectedMKeyChange = new EventEmitter<string>();
  @Output() selectedKeyChange = new EventEmitter<string>();

  mKeyLabels: Label[] = [];
  keyLabel: Label = null;
  lines: LineView[];
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

  resetKey(): void {
    this.selectedKeyChange.next(null);
  }

  selectMKey(keyLabel: Label): void {
    this.selectedMKeyChange.next(keyLabel.text);
  }

  private populateLabels(): void {
    this.keyLabel = {
      text: this.key,
      x: this.width / 2,
      y: -5,
    };

    this.mKeyLabels = [];

    for (const mKey of this.mKeys) {
      this.mKeyLabels.push({
        text: mKey,
        x: -5,
        y: this.yScale(mKey) + this.yScale.bandwidth() / 2,
      });
    }
  }

  private populateLines(): void {
    this.lines = [];
    for (const mKey of this.mKeys) {
      if (mKey === this.key) {
        continue;
      }
      this.lines.push({
        height: this.yScale.bandwidth(),
        width: this.width,
        mKey,
        x: 0,
        y: this.yScale(mKey),
      });
    }
  }

  private initialize(): void {
    this._keyData$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.yScale = this.yScale?.copy().domain(this.mKeys);

      this.populateLines();
      this.populateLabels();
    });

    this._resize$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.yScale = this.yScale?.copy()?.range([0, this.height]);

      this.populateLines();
      this.populateLabels();
    });

    this._keyData$.next();
    this._resize$.next();
  }
}
