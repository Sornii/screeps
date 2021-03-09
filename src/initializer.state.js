import { curry, map } from 'lodash';

export const initializeState = curry((props, worldState) => {
  const state = Object.fromEntries(
    map(props, (prop) => [prop, { ...Memory[prop] }])
  );

  return { ...worldState, ...state };
});
