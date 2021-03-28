import { InputData } from '../interfaces/InputData';

export function isCategorical(data: InputData, key: string): boolean {
  return data.some((d) => isNaN(d[key] as any));
}
