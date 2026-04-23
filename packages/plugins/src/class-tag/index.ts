import type { Plugin } from "@inkweave/core";
import { ChoiceParser, Parser } from "@inkweave/core";

/**
 * Class Tag Plugin.
 *
 * Usage in ink files: # class: className1 className2
 * This tag will apply the specified CSS classes to the content and choices that have the tag.
 *
 * Example:
 * # class: highlight bold
 * This text will have highlight and bold classes
 */
export const classTagPlugin: Plugin = {
  id: "class-tag",
  name: "Class Tag Plugin",
  description: "Provides functionality to add CSS classes to content and choices",
  enabledByDefault: true,
  onLoad: () => {
    // Register the class tag handler with the Parser for Content
    // This handler will add classes to the ParserLine object when processing
    Parser.tag("class", (line, _, value) => {
      if (value && typeof value === "string") {
        // Split the value by spaces to allow multiple classes
        const classes = value.split(/\s+/).filter((cls) => cls.length > 0);
        line.classes.push(...classes);
      }
    });

    // Register the class tag handler with the ChoiceParser for Choices
    ChoiceParser.add("class", (choice, value) => {
      if (value && typeof value === "string") {
        // Split the value by spaces to allow multiple classes
        const classes = value.split(/\s+/).filter((cls) => cls.length > 0);
        if (!choice.classes) {
          choice.classes = [];
        }
        choice.classes.push(...classes);
      }
    });
  },
};
