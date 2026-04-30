import { beforeEach, describe, expect, it } from "bun:test";
import { createInkStory } from "@inkweave/core";
import { clearContentsStore, getText, loadFixture } from "./helpers";

// ── basic content ──

describe("ink syntax - basic", () => {
  beforeEach(() => clearContentsStore());

  it("displays text content", () => {
    const story = createInkStory(loadFixture("basic-content.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("Hello, World!");
    expect(text).toContain("Second line.");
  });

  it("does not display comments", () => {
    const story = createInkStory(loadFixture("basic-content.ink"));
    story.continue();
    const text = getText(story);
    expect(text).not.toContain("This is a comment");
    expect(text).not.toContain("block comment");
  });

  it("includes tagged content", () => {
    const story = createInkStory(loadFixture("basic-content.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("This line has a tag.");
  });
});

// ── choices ──

describe("ink syntax - choices", () => {
  beforeEach(() => clearContentsStore());

  it("renders multiple choices", () => {
    const story = createInkStory(loadFixture("choices.ink"));
    story.continue();
    expect(story.choices).toHaveLength(2);
  });

  it("displays choice text correctly", () => {
    const story = createInkStory(loadFixture("choices.ink"));
    story.continue();
    expect(story.choices[0]?.text).toBe("Choice A");
    expect(story.choices[1]?.text).toBe("Choice B");
  });

  it("shows result after clicking choice", () => {
    const story = createInkStory(loadFixture("choices.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("You chose A.");
  });

  it("suppresses bracketed choice text from output", () => {
    const story = createInkStory(loadFixture("choices.ink"));
    story.continue();
    const text = getText(story);
    expect(text).not.toContain("Choice A");
    expect(text).not.toContain("Choice B");
  });
});

// ── variables ──

describe("ink syntax - variables", () => {
  beforeEach(() => clearContentsStore());

  it("displays initial variable value", () => {
    const story = createInkStory(loadFixture("variables.ink"));
    story.continue();
    expect(getText(story)).toContain("You have 0 gold coins.");
  });

  it("updates variable after choice", () => {
    const story = createInkStory(loadFixture("variables.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("You have 10 gold coins.");
  });

  it("persists variable across multiple choices", () => {
    const story = createInkStory(loadFixture("variables.ink"));
    story.continue();
    story.choose(0);
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("You have 10 gold coins.");
    expect(text).toContain("You earned 10 gold!");
  });
});

// ── conditional choices ──

describe("ink syntax - conditional", () => {
  beforeEach(() => clearContentsStore());

  it("shows choice when condition is true", () => {
    const story = createInkStory(loadFixture("conditional-choices.ink"));
    story.continue();
    expect(story.choices[0]?.text).toBe("Open the chest");
  });

  it("hides choice when condition is false", () => {
    const story = createInkStory(loadFixture("conditional-choices.ink"));
    story.continue();
    expect(story.choices).toHaveLength(2);
    expect(story.choices[1]?.text).toBe("Leave");
  });

  it("shows new choice after condition is met", () => {
    const story = createInkStory(loadFixture("conditional-choices.ink"));
    story.continue();
    story.choose(0);
    expect(story.choices[0]?.text).toBe("Take gold");
  });

  it("hides original choice after state change", () => {
    const story = createInkStory(loadFixture("conditional-choices.ink"));
    story.continue();
    story.choose(0);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).not.toContain("Open the chest");
  });

  it("shows false branch of conditional block", () => {
    const story = createInkStory(loadFixture("conditional-blocks.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("You haven't met Blofeld yet.");
  });

  it("shows true branch after variable change", () => {
    const story = createInkStory(loadFixture("conditional-blocks.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("You have met Blofeld.");
  });

  it("displays correct content from conditional block", () => {
    const story = createInkStory(loadFixture("conditional-blocks.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("You meet Blofeld.");
    expect(text).toContain("You have met Blofeld.");
  });
});
