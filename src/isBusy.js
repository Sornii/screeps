export const isBusy = ({ miners, builders, maxOccupation }) => {
  if (miners?.length != null && builders?.length != null) {
    return miners.length + builders.length >= maxOccupation;
  }

  if (miners?.length != null) {
    return miners.length >= maxOccupation;
  }

  if (builders?.length != null) {
    return builders.length >= maxOccupation;
  }

  return false;
};
