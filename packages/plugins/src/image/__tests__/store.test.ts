import { beforeEach, describe, expect, it } from "bun:test";
import { useStoryImage } from "../index";

describe("Image store", () => {
  beforeEach(() => {
    useStoryImage.getState().setImage("");
  });

  it("should have empty image initially", () => {
    expect(useStoryImage.getState().image).toBe("");
  });

  it("should set and get image", () => {
    useStoryImage.getState().setImage("test.png");
    expect(useStoryImage.getState().image).toBe("test.png");

    // Reset
    useStoryImage.getState().setImage("");
    expect(useStoryImage.getState().image).toBe("");
  });
});
