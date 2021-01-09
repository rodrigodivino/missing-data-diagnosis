export type DiagnosisData = DiagnosisDatum[];

export type DiagnosisDatum = {
  missingVariable: string;
  dependentVariable: string;
  factor: number;
};
