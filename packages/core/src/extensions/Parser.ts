import type { ContentItem } from "../types";
import { splitAtCharacter } from "./Tags";

export interface ParserLine {
  text: string;
  tags: string[];
  classes: string[];
}

type ParserCallback = (line: ParserLine, ...args: unknown[]) => unknown;

export class Parser {
  private static _tags: { [key: string]: ParserCallback } = {};
  private static _patterns: {
    matcher: string | RegExp;
    callback: (line: ParserLine) => unknown;
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

  static tag(tag: string, callback: ParserCallback) {
    Parser.tags[tag] = callback;
  }

  static pattern(pattern: string | RegExp, callback: (line: ParserLine) => unknown) {
    Parser.patterns.push({ matcher: pattern, callback: callback });
  }

  static process = (text: string, tags: string[] = []): ContentItem => {
    if (!text) return { text: "", classes: [] };

    const line: ParserLine = { text: text, tags: tags, classes: [] };

    if (line.tags.length && Object.keys(Parser.tags).length) {
      line.tags.forEach((tag) => {
        const splitTag = splitAtCharacter(tag, ":");

        if (splitTag && splitTag.before in Parser.tags) {
          const handler = Parser.tags[splitTag.before];
          if (handler) {
            handler(line, splitTag.before, splitTag.after);
          }
        }
      });
    }

    if (line.text && Parser.patterns.length) {
      Parser.patterns.forEach((pattern) => {
        if (
          (typeof pattern.matcher === "string" && line.text.includes(pattern.matcher)) ||
          (pattern.matcher instanceof RegExp && line.text.match(pattern.matcher))
        ) {
          pattern.callback(line);
        }
      });
    }
    return { text: line.text, classes: line.classes };
  };
}
