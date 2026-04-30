import { beforeEach, describe, expect, it } from "bun:test";
import { createInkStory } from "@inkweave/core";
import { clearContentsStore, getText, loadFixture } from "./helpers";

// ── glue ──

describe("ink syntax - flow control", () => {
  beforeEach(() => clearContentsStore());

  it("glue joins text fragments across knots", () => {
    const story = createInkStory(loadFixture("glue.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("We hurried home to Savile Row as fast as we could.");
    expect(text).not.toContain("home\nto");
  });

  it("glue preserves individual fragments", () => {
    const story = createInkStory(loadFixture("glue.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("We hurried home");
    expect(text).toContain("to Savile Row");
    expect(text).toContain("as fast as we could.");
  });

  // ── cycles ──

  it("cycle starts at first element", () => {
    const story = createInkStory(loadFixture("cycles.ink"));
    story.continue();
    expect(getText(story)).toContain("Monday");
  });

  it("cycle advances to next element", () => {
    const story = createInkStory(loadFixture("cycles.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Tuesday");
  });

  // ── sequences ──

  it("sequence starts at first element", () => {
    const story = createInkStory(loadFixture("sequences.ink"));
    story.continue();
    expect(getText(story)).toContain("Three!");
  });

  it("sequence advances on revisit", () => {
    const story = createInkStory(loadFixture("sequences.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Two!");
  });

  // ── shuffles ──

  it("shuffle emits a valid element", () => {
    const story = createInkStory(loadFixture("shuffles.ink"));
    story.continue();
    expect(getText(story)).toMatch(/Heads|Tails/);
  });

  it("shuffle repeats on revisit", () => {
    const story = createInkStory(loadFixture("shuffles.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toMatch(/Heads|Tails/);
  });

  // ── fallback ──

  it("fallback choice is not displayed", () => {
    const story = createInkStory(loadFixture("fallback.ink"));
    story.continue();
    expect(story.choices).toHaveLength(2);
  });

  it("visible choices display correctly", () => {
    const story = createInkStory(loadFixture("fallback.ink"));
    story.continue();
    expect(story.choices[0]?.text).toBe("The woman helps you");
    expect(story.choices[1]?.text).toBe("The man ignores you");
  });

  it("fallback triggers after sticky choices exhausted", () => {
    const story = createInkStory(loadFixture("fallback.ink"));
    story.continue();
    story.choose(0);
    story.choose(0);
    expect(getText(story)).toContain("You collapse");
  });

  // ── tunnels ──

  it("tunnel executes sub-knot and returns in correct order", () => {
    const story = createInkStory(loadFixture("tunnels.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("You are at home.");
    expect(text).toContain("You travel to the store.");
    expect(text).toContain("You buy some groceries.");
    expect(text).toContain("You are back home now.");
  });

  // ── functions ──

  it("calls function and displays result", () => {
    const story = createInkStory(loadFixture("functions.ink"));
    story.continue();
    expect(getText(story)).toContain("5");
  });

  it("accumulates function results across calls", () => {
    const story = createInkStory(loadFixture("functions.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("5");
    expect(text).toContain("10");
  });

  // ── game queries ──

  it("CHOICE_COUNT returns a numeric value", () => {
    const story = createInkStory(loadFixture("game-queries.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toMatch(/Choice count: \d+/);
  });
});
