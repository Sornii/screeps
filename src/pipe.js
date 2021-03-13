export const pipe = (...fns) => (...args) =>
  fns.slice(1).reduce((result, fn) => fn(result), fns[0](...args));
