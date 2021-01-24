import QuantileComparison from './QuantileComparison';
import QuantileComparisonDatum from './QuantileComparisonDatum';

export type DiagnosisData = DiagnosisDatum[];

export type DiagnosisDatum = {
  missingVariable: string;
  dependentVariable: string;
  quantileComparison: QuantileComparison;
};
