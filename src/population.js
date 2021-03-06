import { countBy, each } from 'lodash';
import { createCreep } from './professions';

export const population = ({
  professionPopulation: config,
  creeps,
  mainSpawn: spawn,
}) => {
  const countByProfession = countBy(creeps, 'memory.profession');

  console.log(`Current population ${JSON.stringify(countByProfession)}`);

  each(config, (maxPopulation, profession) => {
    const currentPopulation = countByProfession[profession];
    if (currentPopulation == null || currentPopulation < maxPopulation) {
      const [configuration, result] = createCreep(profession, spawn);
      console.log(
        `Created ${profession} with configuration ${configuration}. The result is ${result}`
      );
    }
  });
};
