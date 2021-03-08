import { countBy, each } from 'lodash';
import { createCreep } from './professions';

export const population = ({
  professionPopulation: config,
  creeps,
  mainSpawn: spawn,
}) => {
  const countByProfession = countBy(creeps, 'memory.profession');

  console.log(`Current population ${JSON.stringify(countByProfession)}`);

  let populationResult;

  each(config, (maxPopulation, profession) => {
    const currentPopulation = countByProfession[profession];
    if (currentPopulation == null || currentPopulation < maxPopulation) {
      const [configuration, result] = createCreep(profession, spawn);
      if (result === ERR_NOT_ENOUGH_RESOURCES) {
        console.log(
          `Tried to create ${profession} with configuration ${configuration}. There's not enough resources.`
        );
        populationResult = ERR_NOT_ENOUGH_RESOURCES;
      } else {
        console.log(
          `Created ${profession} with configuration ${configuration}.`
        );
      }
    }
  });

  return populationResult;
};
