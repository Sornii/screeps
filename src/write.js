import { pick, curry } from 'lodash';

export const writeMemory = curry((props, worldState) => {
  const state = pick(worldState, props);
  each(state, (value, key) => {
    Memory[key] = value;
  });
});
