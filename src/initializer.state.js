import { curry, map, reduce } from 'lodash';

export const initializeState = curry((props, worldState) => {
  const state = reduce(
    props,
    (prev, curr) => {
      prev[curr] = { ...Memory[curr] };
      return prev;
    },
    {}
  );

  return { ...worldState, ...state };
});
