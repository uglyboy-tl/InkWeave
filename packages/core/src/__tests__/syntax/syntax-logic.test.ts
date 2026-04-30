import { beforeEach, describe, expect, it } from "bun:test";
import { createInkStory } from "@inkweave/core";
import { clearContentsStore, getText, loadFixture } from "./helpers";

describe("ink syntax - logic and queries", () => {
  beforeEach(() => clearContentsStore());

  // ── NOT ──

  it("NOT shows option when condition is false", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("Visit London");
  });

  it("NOT hides option when condition is true", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    story.choose(0);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).not.toContain("Visit London");
  });

  // ── AND ──

  it("AND hides option when first condition is false", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).not.toContain("Go to Paris");
  });

  it("AND shows option when both conditions are true", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    story.choose(0);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("Go to Paris");
  });

  it("AND chains work with multiple conditions", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    story.choose(0);
    story.choose(0);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("Visit Rome");
  });

  it("shows final option when all AND conditions are met", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    story.choose(0);
    story.choose(0);
    story.choose(0);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("All cities visited");
  });

  // ── comparisons ──

  it("greater than comparison works", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("Low score option");
    expect(choiceTexts).not.toContain("High score option");
  });

  it("less than or equal comparison works", () => {
    const story = createInkStory(loadFixture("logic-operators.ink"));
    story.continue();
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("Low score option");
  });

  // ── OR ──

  it("OR hides option when both conditions are false", () => {
    const story = createInkStory(loadFixture("or-operator.ink"));
    story.continue();
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts.includes("Open the door")).toBe(false);
  });

  it("OR shows option when first condition is true", () => {
    const story = createInkStory(loadFixture("or-operator.ink"));
    story.continue();
    story.choose(0);
    expect(story.choices.map((c) => c.text).includes("Open the door")).toBe(true);
  });

  it("OR shows option when second condition is true", () => {
    const story = createInkStory(loadFixture("or-operator.ink"));
    story.continue();
    story.choose(1);
    expect(story.choices.map((c) => c.text).includes("Open the door")).toBe(true);
  });

  it("OR shows option when both conditions are true", () => {
    const story = createInkStory(loadFixture("or-operator.ink"));
    story.continue();
    story.choose(0);
    story.choose(2);
    expect(story.choices.map((c) => c.text).includes("Open the door")).toBe(true);
  });

  it("OR works with different variable sets", () => {
    const story = createInkStory(loadFixture("or-operator.ink"));
    story.continue();
    story.choose(2);
    expect(story.choices.map((c) => c.text).includes("Report your travels")).toBe(true);
  });

  it("OR shows option with either variable true", () => {
    const story = createInkStory(loadFixture("or-operator.ink"));
    story.continue();
    story.choose(3);
    expect(story.choices.map((c) => c.text).includes("Report your travels")).toBe(true);
  });

  // ── TURNS ──

  it("TURNS returns current turn count", () => {
    const story = createInkStory(loadFixture("turns-query.ink"));
    story.continue();
    expect(getText(story)).toContain("Current turn:");
  });

  it("TURNS increments across turns", () => {
    const story = createInkStory(loadFixture("turns-query.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Turn:");
  });

  it("TURNS_SINCE returns 1 after leaving knot", () => {
    const story = createInkStory(loadFixture("turns-query.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("Turns since start: 1");
  });

  it("TURNS_SINCE returns a positive number", () => {
    const story = createInkStory(loadFixture("turns-query.ink"));
    story.continue();
    story.choose(1);
    const match = getText(story).match(/Turns since start: (\d+)/);
    expect(match).toBeTruthy();
    if (match?.[1]) expect(parseInt(match[1], 10)).toBeGreaterThan(0);
  });

  it("TURNS and TURNS_SINCE work together", () => {
    const story = createInkStory(loadFixture("turns-query.ink"));
    story.continue();
    story.choose(0);
    story.choose(1);
    const text = getText(story);
    expect(text).toContain("Turn:");
    expect(text).toContain("Turns since game_start:");
  });

  // ── international characters ──

  it("supports Cyrillic variable names and values", () => {
    const story = createInkStory(loadFixture("international-chars.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("Cyrillic variable:");
    expect(text).toContain("Cyrillic greeting");
  });

  it("supports Greek variable names and values", () => {
    const story = createInkStory(loadFixture("international-chars.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("Greek variable:");
    expect(text).toContain("Greek greeting");
  });

  it("displays Cyrillic choice text", () => {
    const story = createInkStory(loadFixture("international-chars.ink"));
    story.continue();
    expect(story.choices[0]?.text).toBe("Показать русский текст");
  });

  it("displays Greek choice text", () => {
    const story = createInkStory(loadFixture("international-chars.ink"));
    story.continue();
    expect(story.choices[1]?.text).toBe("Ελληνικό κείμενο");
  });

  it("displays Cyrillic content after choice", () => {
    const story = createInkStory(loadFixture("international-chars.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Это русский текст.");
  });

  it("displays Greek content after choice", () => {
    const story = createInkStory(loadFixture("international-chars.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("Αυτό είναι ελληνικό κείμενο.");
  });
});
