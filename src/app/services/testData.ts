export default [
  ...new Array(100).fill(0).map(() => ({
    a: Math.random() < 0.2 ? null : Math.random() * 100,
    b: Math.random() < 0.2 ? null : Math.random() * 100,
    c: Math.random() < 0.2 ? null : Math.random() * 100,
    d: Math.random() < 0.2 ? null : Math.random() * 100,
    e: Math.random() < 0.2 ? null : Math.random() * 100,
    f: Math.random() < 0.2 ? null : Math.random() * 100,
    g: Math.random() < 0.2 ? null : Math.random() * 100,
  })),
];
