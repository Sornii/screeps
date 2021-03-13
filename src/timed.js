export const timed = (timer) => (...fns) =>
  fns.map((fn) => (...args) => {
    const start = timer.start();
    const result = fn(...args);
    const end = timer.end();
    const time = timer.calc(start, end);
    const formatted = timer.format(time);

    console.log(`Spent ${formatted} on ${fn.name}`);

    return result;
  });
