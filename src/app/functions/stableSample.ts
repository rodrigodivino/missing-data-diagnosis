import { range } from 'd3-array';
import { sample } from 'underscore';

export function stableSample<T>(sequence: T[], N: number): T[] {
  const toRemove = sample(range(sequence.length), sequence.length - N);
  const symbol = Symbol();
  const random: Array<T | symbol> = sequence.slice();
  toRemove.forEach((i) => {
    random[i] = symbol;
  });
  return random.filter((n) => n !== symbol) as T[];
}
