import type { InkStory } from '../core/InkStory';
import { Patches } from '../core/Patches';
import useStorage from './storage';

interface MemorySaveData {
	state: string;
	[key: string]: string | number | boolean | undefined;
}

let options = {
	memory_format: 'local',
};

export const show = (title: string) => {
	return useStorage.getState().storage.get(title) || null;
};

export const save = (index: number, ink: InkStory) => {
	const saveData: MemorySaveData = {
		state: ink.story.state.toJson(),
	};
	ink.save_label.forEach((label) => {
		const value = ink[label as keyof InkStory];
		if (label in ink && value !== undefined) {
			if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
				saveData[label] = value;
			}
		}
	});
	useStorage.getState().setStorage(ink.title, index, saveData);
};

export const load = (save_data: string, ink: InkStory) => {
	let save: MemorySaveData | null = null;
	try {
		save = JSON.parse(save_data);
	} catch (e) {
		console.error('InkPlayer: Failed to parse save data:', e);
		return;
	}
	if (save) {
		ink.story.state.LoadJson(save.state);
		ink.clear();
		ink.save_label.forEach((label) => {
			if (
				label in ink &&
				typeof ink[label as keyof InkStory] !== 'undefined' &&
				label in save
			)
				// @ts-ignore
				ink[label as keyof InkStory] = save[label];
		});
		ink.continue();
	}
};

export const loadMemory = () => {
	Patches.add(function () {
		useStorage.getState().changeFormat(options.memory_format);
	}, options);
};

export default { save, load, show };