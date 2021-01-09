import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-diagnosis-visualization[fullWidth][fullHeight]',
  templateUrl: './diagnosis-visualization.component.html',
  styleUrls: ['./diagnosis-visualization.component.scss'],
})
export class DiagnosisVisualizationComponent implements OnInit {
  @Input() fullWidth: number;
  @Input() fullHeight: number;

  constructor() {}

  ngOnInit(): void {}
}
