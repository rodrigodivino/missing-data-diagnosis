import { sequence } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ascending, bisect, bisectLeft, mean, quantile } from 'd3';
import { Observable, Subject } from 'rxjs';
import { sample } from 'underscore';
import { DiagnosisData, DiagnosisDatum } from '../interfaces/DiagnosisData';
import { InputData } from '../interfaces/InputData';
import QuantileComparison from '../interfaces/QuantileComparison';
import QuantileComparisonDatum from '../interfaces/QuantileComparisonDatum';
import QuantileCount from '../interfaces/QuantileCount';

function timeout(ms): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable({
  providedIn: 'root',
})
export class DiagnosisRunnerService {
  private onNewDiagnosis$ = new Subject<DiagnosisDatum>();

  constructor() {}

  public get newDiagnosis(): Observable<DiagnosisDatum> {
    return this.onNewDiagnosis$.asObservable();
  }

  private bootstrapQuantileCount(
    sequence: number[],
    mask: boolean[],
    iterations: number
  ): QuantileCount[] {
    const resampleQuantiles = [];
    for (let i = 0; i < iterations; i++) {
      const resample = sample(sequence, mask.filter((d) => d).length).sort(
        ascending
      );
      resampleQuantiles.push(this.countQuantiles(resample));
    }
    return resampleQuantiles;
  }
  public async diagnose(
    sequence: number[],
    mask: boolean[]
  ): Promise<QuantileComparison> {
    const maskedSequence = sequence.filter((d, i) => mask[i]);

    const resampleQuantiles = this.bootstrapQuantileCount(sequence, mask, 1000);
    const sequenceQuantiles = this.countQuantiles(maskedSequence);
    console.log('maskedSequence', maskedSequence);
    const comparison = this.compareQuantiles(
      sequenceQuantiles,
      resampleQuantiles
    );
    console.log('comparison', comparison);
    return comparison;
  }
  private compareQuantiles(
    sequenceQuantiles: QuantileCount,
    resampleQuantiles: QuantileCount[]
  ): QuantileComparison {
    const quantileComparison = { miss: {} } as QuantileComparison;
    const missArray = resampleQuantiles.map((d) => d.miss).sort(ascending);
    quantileComparison.miss.seq = sequenceQuantiles.miss;
    quantileComparison.miss.bootLo = quantile(missArray, 0.025);
    quantileComparison.miss.bootAvg = mean(missArray);
    quantileComparison.miss.bootHi = quantile(missArray, 0.975);
    quantileComparison.miss.p =
      bisectLeft(missArray, sequenceQuantiles.miss) / resampleQuantiles.length;

    for (let i = 1; i <= 10; i++) {
      const qArray = resampleQuantiles.map((d) => d[`q${i}`]).sort(ascending);
      const quantileComparisonDatum = {} as QuantileComparisonDatum;

      quantileComparisonDatum.seq = sequenceQuantiles[`q${i}`];
      quantileComparisonDatum.bootLo = quantile(qArray, 0.025); // Performance: This can be null, and computed on-demand
      quantileComparisonDatum.bootAvg = mean(qArray);
      quantileComparisonDatum.bootHi = quantile(qArray, 0.975);
      quantileComparisonDatum.p =
        bisectLeft(qArray, sequenceQuantiles[`q${i}`]) / // This could be linear if the above is true, by counting
        resampleQuantiles.length;

      quantileComparison[`q${i}`] = quantileComparisonDatum;
    }

    return quantileComparison;
  }

  private countQuantiles(array: number[]): QuantileCount {
    array.sort(ascending);
    const quantileDatum: QuantileCount = {
      miss: array.filter((d) => d === null).length,
    } as QuantileCount;
    for (let i = 1; i <= 10; i++) {
      quantileDatum[`q${i}`] =
        quantile(
          array.filter((n) => n !== null),
          i * 0.1
        ) ?? null;
    }
    return quantileDatum;
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
        if (missingVariable === dependentVariable) continue;
        this.diagnose(sequence, mask).then((quantileComparison) => {
          this.onNewDiagnosis$.next({
            dependentVariable,
            missingVariable,
            quantileComparison,
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
}
