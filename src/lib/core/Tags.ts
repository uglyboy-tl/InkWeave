import type { InkStory } from './InkStory';

type TagFunction = (val: string | null | undefined, ink: InkStory) => void;

export class Tags {
	private static _functions: Map<string, TagFunction> = new Map();
	private static readonly excludeKeys: Set<string> = new Set([
		'clear',
		'restart',
	]);

	static get functions() {
		if (!Tags._functions) Tags._functions = new Map();
		return Tags._functions;
	}

	static clear() {
		for (const [key, _] of this._functions.entries()) {
			if (!this.excludeKeys.has(key)) {
				this._functions.delete(key);
			}
		}
	}

	static add(tagName: string, callback: TagFunction) {
		Tags.functions.set(tagName, callback);
	}

	static process = (ink: InkStory, inputString: string) => {
		const splitTag = splitAtCharacter(inputString, ':');
		if (splitTag) {
			if (Tags.functions.has(splitTag.before)) {
				Tags.functions.get(splitTag.before)?.(splitTag.after, ink);
			} else {
				const options = ink.options as Record<string, unknown>;
				if (options[splitTag.before] != undefined) {
					let newValue: string | number | boolean | undefined = splitTag.after;
					const optionType = typeof options[splitTag.before];
					switch (optionType) {
						case 'string':
							break;
						case 'number':
							if (typeof newValue === 'string') {
								newValue = parseFloat(newValue);
							} else {
								newValue = undefined;
							}
							break;
						case 'boolean':
							newValue = !!newValue;
							break;
						default:
							newValue = undefined;
					}
					if (newValue !== undefined && !Number.isNaN(newValue)) {
						options[splitTag.before] = newValue;
					}
				}
			}
		}
	};
}

export const splitAtCharacter = (text: string, character: string) => {
	if (!text) {
		return;
	}

	let splitIndex = text.indexOf(character);

	if (splitIndex == -1) {
		return {
			before: text.trim().toLowerCase(),
		};
	} else {
		return {
			before: text.slice(0, splitIndex).trim().toLowerCase(),
			after: text.slice(splitIndex + 1).trim(),
		};
	}
};

Tags.add('clear', (_: string | null | undefined, ink: InkStory) => {
	ink.clear();
});

Tags.add('restart', (_: string | null | undefined, ink: InkStory) => {
	ink.restart();
});