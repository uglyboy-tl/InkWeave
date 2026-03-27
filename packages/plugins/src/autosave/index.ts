import type { InkStory } from '@inkweave/core';
import { Patches, Tags } from '@inkweave/core';
import { memory } from '../memory';

const options = {
	autosave_enabled: true,
};

const load = () => {
	Tags.add('autosave', (_: string | null | undefined, ink: InkStory) => {
		if (ink.options.autosave_enabled) {
			memory.save(2, ink);
		}
	});

	Patches.add(null, options);
};

export default load;