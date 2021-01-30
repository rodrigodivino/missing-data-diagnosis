import { range } from 'd3-array';
import { sample } from 'underscore';

/**
 * Samples a sequence maintaining order
 * @param sequence - The sequence to sample
 * @param N - The length of the sample
 */
export function stableSample<T>(sequence: T[], N: number): T[] {
  const toRemove = sample(range(sequence.length), sequence.length - N);
  const symbol = Symbol();
  const random: Array<T | symbol> = sequence.slice();
  toRemove.forEach((i) => {
    random[i] = symbol;
  });
  return random.filter((n) => n !== symbol) as T[];
}
