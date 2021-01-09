import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { DiagnosisDatum } from '../interfaces/DiagnosisData';
import { InputData } from '../interfaces/InputData';
@Injectable({
  providedIn: 'root',
})
export class DiagnosisRunnerService {
  public diagnose(sequence: [(number | string)[]], mask: boolean[]): number {
    return 0;
  }

  public diagnoseAll(
    data: InputData,
    callback: (diagnosis: DiagnosisDatum) => void
  ): void {
    const dependentVariables = Object.keys(data[0]);
    const missingVariables = dependentVariables.filter((v) =>
      data.some((datum) => datum[v] === null)
    );

    for (const missingVariable of missingVariables) {
      for (const dependentVariable of dependentVariables) {
        console.log(missingVariable, dependentVariable);
      }
    }
  }
  constructor() {}
}
