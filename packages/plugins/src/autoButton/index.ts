import { ChoiceParser, Patches } from '@inkweave/core';
import { ChoiceRegistry } from '@inkweave/react';
import AutoChoice from './AutoButton';

const load = () => {
  ChoiceParser.add('auto', (new_choice, val) => {
    new_choice.type = 'auto';
    new_choice.val = val;
  });
  ChoiceRegistry.register('auto', AutoChoice);
  Patches.add(null, {});
};

export default load;
