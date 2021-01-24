import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { max, mean } from 'd3';
import { ScaleBand, scaleBand, scaleLinear } from 'd3-scale';
import { DiagnosisData, DiagnosisDatum } from '../interfaces/DiagnosisData';
import { InputData } from '../interfaces/InputData';
import { DiagnosisRunnerService } from '../services/diagnosis-runner.service';
import testData from '../services/testData';

@Component({
  selector: 'app-diagnosis-visualization[fullWidth][fullHeight]',
  templateUrl: './diagnosis-visualization.component.html',
  styleUrls: ['./diagnosis-visualization.component.scss'],
  providers: [DiagnosisRunnerService],
})
export class DiagnosisVisualizationComponent implements OnInit, OnChanges {
  public readonly margin = { top: 5, left: 20, right: 20, bottom: 5 };

  @Input() public data: InputData = testData;
  @Input() public fullHeight: number;
  @Input() public fullWidth: number;

  public diagnosisData: DiagnosisData;
  public innerHeight: number;
  public innerWidth: number;
  public xScale: ScaleBand<string>;
  public yScale: ScaleBand<string>;
  public colorGradient = scaleLinear<string, string>()
    .domain([0.025, 0.5, 0.975])
    .range(['coral', 'seashell', 'coral']);

  constructor(private diagnosisRunner: DiagnosisRunnerService) {}

  public colorScale(n: number) {
    if (
      n < this.colorGradient.domain()[0] ||
      n > this.colorGradient.domain()[1]
    )
      return 'firebrick';
    return this.colorGradient(n);
  }
  public fillColor(item: DiagnosisDatum) {
    if (!item.quantileComparison) return 'lightgray';

    return this.colorGradient(
      mean(Object.values(item.quantileComparison).map((c) => c.p))
    );
  }
  public diagnosisId(diagnosisDatum: DiagnosisDatum): string {
    return diagnosisDatum.missingVariable + diagnosisDatum.dependentVariable;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.fullWidth) {
      this.innerWidth = this.fullWidth - this.margin.left - this.margin.right;
      this.resizeScales();
    }
    if (changes.fullHeight) {
      this.innerHeight = this.fullHeight - this.margin.top - this.margin.bottom;
      this.resizeScales();
    }
  }

  public ngOnInit(): void {
    this.diagnosisData = this.diagnosisRunner.stateStructure(this.data);
    this.initializeScales();

    this.diagnosisRunner.newDiagnosis.subscribe((newDiagnosisDatum) => {
      this.diagnosisData = [
        ...this.diagnosisData.filter(
          (diagnosisDatum) =>
            this.diagnosisId(diagnosisDatum) !==
            this.diagnosisId(newDiagnosisDatum)
        ),
        newDiagnosisDatum,
      ];
    });
    this.diagnosisRunner.diagnoseAll(this.data);
  }

  private computeScales(): void {
    this.yScale = scaleBand()
      .domain([...new Set(this.diagnosisData.map((d) => d.missingVariable))])
      .padding(0.1);
    this.xScale = scaleBand()
      .domain([...new Set(this.diagnosisData.map((d) => d.dependentVariable))])
      .padding(0.1);
  }

  private initializeScales(): void {
    this.computeScales();
    this.resizeScales();
  }

  private resizeScales(): void {
    this.xScale?.range([0, this.innerWidth]);
    this.yScale?.range([0, this.innerHeight]);
  }
}
