import { Parser } from "@inkweave/core";

/**
 * Loads the class tag plugin.
 *
 * Usage in ink files: # class: className1 className2
 * This tag will apply the specified CSS classes to the content that has the tag.
 *
 * Example:
 * # class: highlight bold
 * This text will have highlight and bold classes
 */
const load = () => {
  // Register the class tag handler with the Parser
  // This handler will add classes to the ParserLine object when processing
  Parser.tag("class", (line, _, value) => {
    if (value && typeof value === 'string') {
      // Split the value by spaces to allow multiple classes
      const classes = value.split(/\s+/).filter(cls => cls.length > 0);
      line.classes.push(...classes);
    }
  });
};

export default load;
