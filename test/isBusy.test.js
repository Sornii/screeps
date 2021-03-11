import { isBusy } from '../src/isBusy';

test('isBusy', () => {
  expect(
    isBusy({ maxOccupation: 2, miners: ['a'] }, { attrs: ['miners'] })
  ).toBe(false);
  expect(
    isBusy({ maxOccupation: 1, miners: ['a'] }, { attrs: ['miners'] })
  ).toBe(true);
  expect(
    isBusy(
      { maxOccupation: 2, miners: ['a'], builders: ['b'] },
      { attrs: ['miners', 'builders'] }
    )
  ).toBe(true);
  expect(
    isBusy(
      { maxOccupation: 3, miners: ['a'], builders: ['b'] },
      { attrs: ['miners', 'builders'] }
    )
  ).toBe(false);
});
