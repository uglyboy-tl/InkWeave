import type { InkStoryContext } from '../types';

export type PatchFunction = (this: InkStoryContext, content: string) => void;

export class Patches {
	private static _patches: PatchFunction[] = [];
	private static _options: Record<string, unknown> = {};

	static get patches() {
		return Patches._patches;
	}

	static set patches(value: PatchFunction[]) {
		Patches._patches = value;
	}

	static add(
		callback: PatchFunction | null,
		patchOptions: Record<string, unknown> = {}
	) {
		Object.assign(this._options, patchOptions);
		if (callback) Patches._patches.push(callback);
	}

	static apply(story: InkStoryContext | object, content: string) {
		const storyCtx = story as InkStoryContext;
		Object.assign(storyCtx.options, Patches._options);
		for (const patch of Patches._patches) {
			if (patch) {
				patch.bind(storyCtx, content)();
			}
		}
	}

	static clear() {
		Patches._patches = [];
		Patches._options = {};
	}
}