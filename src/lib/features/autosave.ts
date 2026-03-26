import type { InkStory } from '../core/InkStory';
import { Patches } from '../core/Patches';
import { Tags } from '../core/Tags';
import memory from './memory';

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