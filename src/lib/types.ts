import { Story } from 'inkjs/engine/Story';
import type { IFileHandler } from 'inkjs/compiler/IFileHandler';

export interface InkStoryOptions {
	debug?: boolean;
	linedelay?: number;
	fileHandler?: IFileHandler;
	[key: string]: unknown;
}

export interface InkStoryContext {
	options: InkStoryOptions;
	save_label: string[];
	clears: Array<() => void>;
	cleanups: Array<() => void>;
	_side_effects: Array<() => void>;
	// Allow dynamic properties for patches
	[key: string]: unknown;
}

export interface SaveData {
	state: string;
	contents?: string[];
	image?: string;
	[key: string]: unknown;
}