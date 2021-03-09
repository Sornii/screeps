import { curry, map, fromPairs } from 'lodash';

export const initializeState = curry((props, worldState) => {
  const state = fromPairs(map(props, (prop) => [prop, { ...Memory[prop] }]));

  return { ...worldState, ...state };
});
