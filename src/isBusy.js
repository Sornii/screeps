import { reduce } from 'lodash';

/**
 * Calculate if the given config object is busy
 * @param {number} maxOccupation
 * @param rest
 * @param {Array<string>} attrs
 * @return {boolean}
 */
export const isBusy = ({ maxOccupation, ...rest }, { attrs }) => {
  return (
    reduce(
      attrs,
      (prev, curr) => {
        const length = rest[curr]?.length;
        return length != null ? prev + length : prev;
      },
      0
    ) >= maxOccupation
  );
};
