import { ChoiceParser, Patches } from '@inkweave/core';
import { ChoiceComponents } from '@inkweave/react';
import CooldownChoice from './CdButton';

const options = {
	cdTemplate: '{text} ({time})',
};

const load = () => {
	ChoiceParser.add('cd', (new_choice, val) => {
		new_choice.type = 'cd';
		new_choice.val = val;
	});
	ChoiceComponents.register('cd', CooldownChoice);
	Patches.add(null, options);
};

export default load;