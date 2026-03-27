import { splitAtCharacter } from './Tags';

export interface ParserLine {
	text: string;
	tags: string[];
	classes: string[];
}

export class Parser {
	private static _tags: { [key: string]: Function } = {};
	private static _patterns: {
		matcher: string | RegExp;
		callback: Function;
	}[] = [];

	static get tags() {
		return Parser._tags;
	}

	static get patterns() {
		return Parser._patterns;
	}

	static clear = () => {
		Parser._tags = {};
		Parser._patterns = [];
	};

	static tag(tag: string, callback: Function) {
		Parser.tags[tag] = callback;
	}

	static pattern(pattern: string | RegExp, callback: Function) {
		Parser.patterns.push({ matcher: pattern, callback: callback });
	}

	static process = (text: string, tags: string[] = []): string => {
		if (!text) return '';

		let line: ParserLine = { text: text, tags: tags, classes: [] };

		if (line.tags.length && Object.keys(Parser.tags).length) {
			line.tags.forEach(function (tag) {
				let splitTag = splitAtCharacter(tag, ':');

				if (splitTag && splitTag.before in Parser.tags) {
					Parser.tags[splitTag.before](
						line,
						splitTag.before,
						splitTag.after
					);
				}
			});
		}

		if (line.text && Parser.patterns.length) {
			Parser.patterns.forEach(function (pattern) {
				if (
					(typeof pattern.matcher === 'string' &&
						line.text.includes(pattern.matcher)) ||
					(pattern.matcher instanceof RegExp &&
						line.text.match(pattern.matcher))
				) {
					pattern.callback(line);
				}
			});
		}
		return line.text;
	};
}