import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
  @Input() data: InputData = testData;
  @Input() fullWidth: number;
  @Input() fullHeight: number;

  public readonly margin = { top: 5, left: 20, right: 20, bottom: 5 };
  public innerWidth: number;
  public innerHeight: number;

  constructor(private diagnosisRunner: DiagnosisRunnerService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fullWidth) {
      this.innerWidth = this.fullWidth - this.margin.left - this.margin.right;
    }
    if (changes.fullHeight) {
      this.innerHeight = this.fullHeight - this.margin.top - this.margin.bottom;
    }
  }

  ngOnInit(): void {
    console.log(this.diagnosisRunner.diagnoseAll(this.data, () => {}));
  }
}
