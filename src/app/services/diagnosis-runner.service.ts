import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DiagnosisData, DiagnosisDatum } from '../interfaces/DiagnosisData';
import { InputData } from '../interfaces/InputData';

function timeout(ms): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable({
  providedIn: 'root',
})
export class DiagnosisRunnerService {
  private onNewDiagnosis$ = new Subject<DiagnosisDatum>();
  public async diagnose(sequence: number[], mask: boolean[]): Promise<number> {
    await timeout(2000);
    return 1;
  }

  public get newDiagnosis(): Observable<DiagnosisDatum> {
    return this.onNewDiagnosis$.asObservable();
  }

  public async diagnoseAll(data: InputData): Promise<void> {
    const dependentVariables = Object.keys(data[0]);
    const missingVariables = dependentVariables.filter((v) =>
      data.some((datum) => datum[v] === null)
    );

    for (const missingVariable of missingVariables) {
      for (const dependentVariable of dependentVariables) {
        const sequence = data.map((d) => d[dependentVariable]);
        const mask = data.map((d) => d[missingVariable] === null);
        this.diagnose(sequence, mask).then((factor) => {
          this.onNewDiagnosis$.next({
            dependentVariable,
            missingVariable,
            factor,
          });
        });
      }
    }
  }

  public stateStructure(data: InputData): DiagnosisData {
    const dependentVariables = Object.keys(data[0]);
    const missingVariables = dependentVariables.filter((v) =>
      data.some((datum) => datum[v] === null)
    );

    const state = [];
    for (const missingVariable of missingVariables) {
      for (const dependentVariable of dependentVariables) {
        state.push({
          missingVariable,
          dependentVariable,
          factor: 0,
        });
      }
    }
    return state;
  }
  constructor() {}
}
