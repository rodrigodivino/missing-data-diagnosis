import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-diagnosis-visualization[fullWidth][fullHeight]',
  templateUrl: './diagnosis-visualization.component.html',
  styleUrls: ['./diagnosis-visualization.component.scss'],
})
export class DiagnosisVisualizationComponent implements OnInit, OnChanges {
  @Input() fullWidth: number;
  @Input() fullHeight: number;

  public readonly margin = { top: 5, left: 20, right: 20, bottom: 5 };
  public innerWidth: number;
  public innerHeight: number;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fullWidth) {
      this.innerWidth = this.fullWidth - this.margin.left - this.margin.right;
    }
    if (changes.fullHeight) {
      this.innerHeight = this.fullHeight - this.margin.top - this.margin.bottom;
    }
  }

  ngOnInit(): void {}
}
