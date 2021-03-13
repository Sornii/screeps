export const pipe = (...fns) => (...args) =>
  fns.slice(1).reduce((result, fn) => fn(result), fns[0](...args));

export const timedPipe = (timer) => (...fns) => (...args) =>
  pipe(
    fns.map(
      (fn) => (...args) => {
        const start = timer.start();
        const result = fn(...args);
        const end = timer.end();
        const time = timer.calc(start, end);
        const formatted = timer.format(time);

        console.log(`Spent ${formatted} on ${fn.name}`);

        return result;
      },
      ...args
    )
  );
