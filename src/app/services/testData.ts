export default [
  ...new Array(500).fill(0).map(() => {
    const a = getMCAR();

    return {
      a,
      b: a === null && Math.random() < 0.2 ? null : getMCAR(),
      c: getMCAR(),
      d: getMCAR(),
      e: a !== null && a < 50 && Math.random() < 0.5 ? null : getMCAR(),
      f: getCategorical(),

      // g: Math.random() < 0.2 ? null : Math.random() * 100,
      // h: Math.random() < 0.2 ? null : Math.random() * 100,
      // i: Math.random() < 0.2 ? null : Math.random() * 100,
      // j: Math.random() < 0.2 ? null : Math.random() * 100,
      // k: Math.random() < 0.2 ? null : Math.random() * 100,
      // l: Math.random() < 0.2 ? null : Math.random() * 100,
      // m: Math.random() < 0.2 ? null : Math.random() * 100,
      // n: Math.random() < 0.2 ? null : Math.random() * 100,
    };
  }),
];

function getMCAR(): number {
  return Math.random() < 0.3 ? null : Math.random() * 100;
}

function getCategorical(): string {
  return ['a', 'b', 'c', null][Math.floor(Math.random() * 4)];
}
