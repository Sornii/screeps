export const compose = (...fns) => (arg) =>
  fns.reduceRight((acc, fn) => (fn ? fn(acc) : acc), arg);
