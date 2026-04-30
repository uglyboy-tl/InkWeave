import { beforeEach, describe, expect, it } from "bun:test";
import { createInkStory } from "@inkweave/core";
import { clearContentsStore, getText, loadFixture } from "./helpers";

// ── threads ──

describe("ink syntax - weave patterns", () => {
  beforeEach(() => clearContentsStore());

  it("collects content from all threads in order", () => {
    const story = createInkStory(loadFixture("threads.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("I had a headache.");
    expect(text).toContain("It was a tense moment.");
    expect(text).toContain("We walked in silence.");
  });

  it("collects choices from all threads", () => {
    const story = createInkStory(loadFixture("threads.ink"));
    story.continue();
    expect(story.choices).toHaveLength(3);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain('"What did you have for lunch?"');
    expect(choiceTexts).toContain('"Nice weather,"');
    expect(choiceTexts).toContain("Keep walking");
  });

  it("continues story after thread choice", () => {
    const story = createInkStory(loadFixture("threads.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("Spam and eggs");
    expect(text).toContain("Before long, we arrived at his house.");
  });

  it("works with different thread choice", () => {
    const story = createInkStory(loadFixture("threads.ink"));
    story.continue();
    story.choose(2);
    expect(getText(story)).toContain("We continued on our way.");
  });

  // ── stitches ──

  it("displays knot header and stitch choices", () => {
    const story = createInkStory(loadFixture("stitches.ink"));
    story.continue();
    expect(getText(story)).toContain("We boarded the train, but where?");
    expect(story.choices).toHaveLength(2);
    expect(story.choices[0]?.text).toBe("First class");
    expect(story.choices[1]?.text).toBe("Third class");
  });

  it("navigates to first stitch", () => {
    const story = createInkStory(loadFixture("stitches.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("You settle into the plush first class seat.");
  });

  it("navigates to second stitch", () => {
    const story = createInkStory(loadFixture("stitches.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("You find a seat in third class.");
  });

  it("preserves knot content after stitch divert", () => {
    const story = createInkStory(loadFixture("stitches.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain("We boarded the train, but where?");
    expect(text).toContain("You settle into the plush first class seat.");
  });

  // ── weave gathers ──

  it("displays multiple weave choices", () => {
    const story = createInkStory(loadFixture("weave-gather.ink"));
    story.continue();
    expect(story.choices).toHaveLength(3);
  });

  it("shows gather content after choice", () => {
    const story = createInkStory(loadFixture("weave-gather.ink"));
    story.continue();
    story.choose(0);
    const text = getText(story);
    expect(text).toContain('"Really," he responded.');
    expect(text).toContain("With that Monsieur Fogg left the room.");
  });

  it("all choices lead to same gather", () => {
    const story = createInkStory(loadFixture("weave-gather.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("With that Monsieur Fogg left the room.");
  });

  // ── weave labels ──

  it("shows labelled gather content", () => {
    const story = createInkStory(loadFixture("weave-labels.ink"));
    story.continue();
    expect(getText(story)).toContain("The guard frowns at you.");
    expect(story.choices).toHaveLength(2);
  });

  it("shows conditional choice after labelled option", () => {
    const story = createInkStory(loadFixture("weave-labels.ink"));
    story.continue();
    story.choose(0);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("'Having a nice day?'");
  });

  it("shows different conditional after different labelled option", () => {
    const story = createInkStory(loadFixture("weave-labels.ink"));
    story.continue();
    story.choose(1);
    const choiceTexts = story.choices.map((c) => c.text);
    expect(choiceTexts).toContain("Shove him aside");
  });

  it("displays labelled gather reply", () => {
    const story = createInkStory(loadFixture("weave-labels.ink"));
    story.continue();
    story.choose(1);
    expect(getText(story)).toContain("'Hmm,' replies the guard.");
  });

  // ── nested weave ──

  it("displays first-level nested weave choices", () => {
    const story = createInkStory(loadFixture("nested-weave.ink"));
    story.continue();
    expect(story.choices).toHaveLength(2);
    expect(story.choices[0]?.text).toBe('"Murder!"');
    expect(story.choices[1]?.text).toBe('"Suicide!"');
  });

  it("shows second-level choices after first", () => {
    const story = createInkStory(loadFixture("nested-weave.ink"));
    story.continue();
    story.choose(0);
    expect(story.choices).toHaveLength(2);
  });

  it("leads to gather after nested choices", () => {
    const story = createInkStory(loadFixture("nested-weave.ink"));
    story.continue();
    story.choose(0);
    story.choose(0);
    expect(getText(story)).toContain("Mrs. Christie lowered her manuscript.");
  });

  it("second top-level choice also yields nested choices", () => {
    const story = createInkStory(loadFixture("nested-weave.ink"));
    story.continue();
    story.choose(1);
    expect(story.choices).toHaveLength(2);
  });

  // ── suppress ──

  it("suppresses choice text from output", () => {
    const story = createInkStory(loadFixture("suppress-choice.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).not.toContain("Hello back");
  });

  it("shows suppressed text in choice button", () => {
    const story = createInkStory(loadFixture("suppress-choice.ink"));
    story.continue();
    expect(story.choices[0]?.text).toBe("Hello back!");
  });

  // ── once-only (sticky) ──

  it("removes sticky choice after selection", () => {
    const story = createInkStory(loadFixture("sticky-choices.ink"));
    story.continue();
    expect(story.choices).toHaveLength(2);
    story.choose(0);
    expect(story.choices).toHaveLength(0);
  });

  it("displays content after sticky choice", () => {
    const story = createInkStory(loadFixture("sticky-choices.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("The left path leads to a forest.");
  });

  it("shows both sticky choices initially", () => {
    const story = createInkStory(loadFixture("sticky-choices.ink"));
    story.continue();
    expect(story.choices[0]?.text).toBe("Take the left path");
    expect(story.choices[1]?.text).toBe("Take the right path");
  });

  // ── temp / const ──

  it("uses constant as variable value", () => {
    const story = createInkStory(loadFixture("temp-constants.ink"));
    story.continue();
    expect(getText(story)).toContain("Detective: Poirot");
  });

  it("creates and uses temp variable", () => {
    const story = createInkStory(loadFixture("temp-constants.ink"));
    story.continue();
    const text = getText(story);
    expect(text).toContain("Score: 10");
    expect(text).not.toContain("bonus");
  });

  it("modifies temp variable within knot", () => {
    const story = createInkStory(loadFixture("temp-constants.ink"));
    story.continue();
    story.choose(0);
    expect(getText(story)).toContain("Score with bonus: 15");
  });
});
