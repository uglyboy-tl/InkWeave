import { beforeEach, describe, expect, it } from "bun:test";
import { createInkStory } from "@inkweave/core";
import { clearContentsStore, getText, loadFixture } from "./helpers";

describe("ink syntax - lists", () => {
  beforeEach(() => clearContentsStore());

  // ── basic ──

  it("assigns list value", () => {
    const story = createInkStory(loadFixture("lists-basic.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Kettle is now:");
  });

  it("changes list value correctly", () => {
    const story = createInkStory(loadFixture("lists-basic.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("Kettle is now: boiling");
  });

  it("compares list values for equality", () => {
    const story = createInkStory(loadFixture("lists-basic.ink"));
    story.continue();
    story.choose(0);
    story.choose(1);
    expect(getText(story)).toContain("Kettle is cold.");
  });

  it("compares list values for inequality", () => {
    const story = createInkStory(loadFixture("lists-basic.ink"));
    story.continue();
    story.choose(1);
    story.choose(1);
    expect(getText(story)).toContain("Kettle is not cold.");
  });

  // ── reassignment ──

  it("displays initial list value", () => {
    const story = createInkStory(loadFixture("lists-advanced.ink"));
    story.continue();
    expect(getText(story)).toContain("Skills: strong");
  });

  it("reassigns list value", () => {
    const story = createInkStory(loadFixture("lists-advanced.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Skills now:");
    expect(text).toContain("fast");
  });

  // ── comparisons ──

  it("compares lists with greater than", () => {
    const story = createInkStory(loadFixture("lists-comparisons.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("A is distinctly bigger than B.");
  });

  it("compares lists with greater than or equal", () => {
    const story = createInkStory(loadFixture("lists-comparisons.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("A is never smaller than B.");
  });

  it("compares lists with less than", () => {
    const story = createInkStory(loadFixture("lists-comparisons.ink"));
    story.continue();
    story.choose(2);
    expect(getText(story)).toContain("B is distinctly smaller than A.");
  });

  // ── intersection ──

  it("intersects two lists", () => {
    const story = createInkStory(loadFixture("lists-intersection.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Common values:");
    expect(text).toContain("self_belief");
  });

  it("uses intersection as condition", () => {
    const story = createInkStory(loadFixture("lists-intersection.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("Has at least one common value.");
  });

  // ── invert / all / count ──

  it("inverts list values", () => {
    const story = createInkStory(loadFixture("lists-invert-all.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Now on duty:");
    expect(text).toContain("Carter");
    expect(text).toContain("Braithwaite");
  });

  it("lists all possible values", () => {
    const story = createInkStory(loadFixture("lists-invert-all.ink"));
    story.continue();
    story.choose(1);
    const text = getText(story);
    expect(text).toContain("All guards:");
    expect(text).toContain("Smith");
    expect(text).toContain("Jones");
    expect(text).toContain("Carter");
    expect(text).toContain("Braithwaite");
  });

  it("counts list values", () => {
    const story = createInkStory(loadFixture("lists-invert-all.ink"));
    story.continue();
    story.choose(2);
    expect(getText(story)).toContain("Guards on duty: 2");
  });

  // ── multi-list ──

  it("holds values from multiple lists", () => {
    const story = createInkStory(loadFixture("lists-multi-list.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Alfred is here.");
    expect(text).toContain("Batman is here.");
    expect(text).toContain("A newspaper lies here.");
  });

  it("different multi-list variables hold different values", () => {
    const story = createInkStory(loadFixture("lists-multi-list.ink"));
    story.continue();
    story.choose(1);
    const text = getText(story);
    expect(text).toContain("Robin is here.");
    expect(text).toContain("A champagne glass lies here.");
  });

  it("uses has operator with multi-list variable", () => {
    const story = createInkStory(loadFixture("lists-multi-list.ink"));
    story.continue();
    story.choose(2);
    expect(getText(story)).toContain("Batman is in the Ballroom.");
  });

  // ── multivalued ──

  it("holds single list value", () => {
    const story = createInkStory(loadFixture("lists-multivalued.ink"));
    story.continue();
    expect(getText(story)).toContain("Skills: strong");
  });

  it("adds values to multivalued list", () => {
    const story = createInkStory(loadFixture("lists-multivalued.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Now have:");
    expect(text).toContain("fast");
  });

  it("checks membership with has operator", () => {
    const story = createInkStory(loadFixture("lists-multivalued.ink"));
    story.continue();
    story.choose(2);
    expect(getText(story)).toContain("Hero is strong.");
  });

  // ── reusing ──

  it("reuses list type for multiple variables", () => {
    const story = createInkStory(loadFixture("lists-reusing.ink"));
    story.continue();
    expect(getText(story)).toContain("Kettle: cold, Pot: cold");
  });

  it("changes variables independently", () => {
    const story = createInkStory(loadFixture("lists-reusing.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Kettle is now boiling.");
  });

  it("changes second variable independently", () => {
    const story = createInkStory(loadFixture("lists-reusing.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("Pot is now boiling.");
  });

  it("queries variables separately", () => {
    const story = createInkStory(loadFixture("lists-reusing.ink"));
    story.continue();
    story.choose(0);
    story.choose(1);
    const text = getText(story);
    expect(text).toContain("Kettle is hot.");
    expect(text).toContain("Pot is cold.");
  });

  // ── qualified names ──

  it("distinguishes same-named values from different lists", () => {
    const story = createInkStory(loadFixture("lists-values.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("Colour: blue");
    expect(text).toContain("Mood: blue");
  });

  it("changes value using qualified name", () => {
    const story = createInkStory(loadFixture("lists-values.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Colour is now red.");
  });

  it("changes values from two different lists", () => {
    const story = createInkStory(loadFixture("lists-values.ink"));
    story.continue();
    story.choose(0);
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Colour: red");
    expect(text).toContain("Mood: happy");
  });

  it("compares value using qualified name", () => {
    const story = createInkStory(loadFixture("lists-values.ink"));
    story.continue();
    story.choose(2);
    expect(getText(story)).toContain("Colour is blue.");
  });
});
