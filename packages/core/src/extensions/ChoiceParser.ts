import { Choice } from '../types';
import { splitAtCharacter } from './Tags';
import type { Choice as InkChoice } from 'inkjs/engine/Choice';

export class ChoiceParser {
	private static _tags: Map<string, (choice: Choice, val?: string) => void> = new Map();
	private static readonly excludeKeys: Set<string> = new Set(['unclickable']);

	static get tags() {
		return ChoiceParser._tags;
	}

	static clear = () => {
		for (const [key, _] of this._tags.entries()) {
			if (!this.excludeKeys.has(key)) {
				this._tags.delete(key);
			}
		}
	};

	static add = (
		tag: string,
		callback: (choice: Choice, val?: string) => void
	) => {
		ChoiceParser.tags.set(tag, callback);
	};

	static process = (item: InkChoice, choice: Choice) => {
		if (!item.text) return choice;

		if (item.tags && item.tags.length && ChoiceParser.tags.size) {
			item.tags.forEach(function (tag) {
				let splitTag = splitAtCharacter(tag, ':');

				if (splitTag && ChoiceParser.tags.has(splitTag.before)) {
					ChoiceParser.tags.get(splitTag.before)?.(
						choice,
						splitTag.after
					);
				}
			});
		}
	};
}

ChoiceParser.add('unclickable', (new_choice) => {
	new_choice.type = 'unclickable';
});