import QuantileComparisonDatum from './QuantileComparisonDatum';

export default interface QuantileUncertaintyDatum {
  miss: QuantileComparisonDatum;
  q1: QuantileComparisonDatum;
  q2: QuantileComparisonDatum;
  q3: QuantileComparisonDatum;
  q4: QuantileComparisonDatum;
  q5: QuantileComparisonDatum;
  q6: QuantileComparisonDatum;
  q7: QuantileComparisonDatum;
  q8: QuantileComparisonDatum;
  q9: QuantileComparisonDatum;
  q10: QuantileComparisonDatum;
}
