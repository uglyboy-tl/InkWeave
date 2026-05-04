import type { ContentItem } from "../types";
import { splitAtCharacter } from "./utils";

export interface ContentParserLine {
  text: string;
  tags: string[];
  classes: string[];
}

type ContentParserCallback = (line: ContentParserLine, ...args: unknown[]) => unknown;

export class ContentParser {
  private static _tags: Map<string, ContentParserCallback> = new Map();
  private static _patterns: {
    matcher: string | RegExp;
    callback: (line: ContentParserLine) => unknown;
  }[] = [];

  static get tags() {
    return ContentParser._tags;
  }

  static get patterns() {
    return ContentParser._patterns;
  }

  static clear = () => {
    ContentParser._tags = new Map();
    ContentParser._patterns = [];
  };

  static tag(tag: string, callback: ContentParserCallback) {
    ContentParser.tags.set(tag, callback);
  }

  static pattern(pattern: string | RegExp, callback: (line: ContentParserLine) => unknown) {
    ContentParser.patterns.push({ matcher: pattern, callback: callback });
  }

  static process = (text: string, tags: string[] = []): ContentItem => {
    if (!text) return { text: "", classes: [] };

    const line: ContentParserLine = { text: text, tags: tags, classes: [] };

    if (line.tags.length && ContentParser._tags.size > 0) {
      line.tags.forEach((tag) => {
        const splitTag = splitAtCharacter(tag, ":");

        if (splitTag && ContentParser.tags.has(splitTag.before)) {
          const handler = ContentParser.tags.get(splitTag.before);
          if (handler) {
            handler(line, splitTag.before, splitTag.after);
          }
        }
      });
    }

    if (line.text && ContentParser.patterns.length) {
      ContentParser.patterns.forEach((pattern) => {
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
