import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InputData } from '../interfaces/InputData';
import testData from '../services/testData';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-diagnosis-visualization',
  templateUrl: './diagnosis-visualization.component.html',
  styleUrls: ['./diagnosis-visualization.component.scss'],
  providers: [],
})
export class DiagnosisVisualizationComponent
  implements OnInit, OnChanges, OnDestroy {
  readonly margin = { top: 100, left: 100, right: 20, bottom: 20 };

  @Input() public data: InputData = testData;
  @Input() public fullHeight: number;
  @Input() public fullWidth: number;

  keys: string[] = [];
  mKeys: string[] = [];
  innerHeight: number;
  innerWidth: number;

  private _resize$ = new Subject<void>();
  private _data$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.fullWidth || changes.fullHeight) &&
      this.fullWidth &&
      this.fullHeight
    ) {
      this._resize$.next();
    }
  }

  public ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initialize(): void {
    this._resize$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.innerHeight = this.fullHeight - this.margin.top - this.margin.bottom;
      this.innerWidth = this.fullWidth - this.margin.left - this.margin.right;
    });

    this._data$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.keys = Object.keys(this.data[0]);
      this.mKeys = this.keys.filter((key) => {
        return this.data.some((datum) => datum[key] === null);
      });
    });

    this._data$.next();
    this._resize$.next();
  }
}
