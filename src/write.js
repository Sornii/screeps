import { pick, curry, each } from 'lodash';

export const writeMemory = curry((props, worldState) => {
  const state = pick(worldState, props);
  each(state, (value, key) => {
    Memory[key] = value;
  });
});

writeMemory.name = 'writeMemory';
