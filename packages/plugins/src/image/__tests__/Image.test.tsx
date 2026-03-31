import { beforeEach, describe, expect, it } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import Image from "../Image";
import { useStoryImage } from "../index";

describe("Image", () => {
  beforeEach(() => {
    cleanup();
    useStoryImage.getState().setImage("");
  });

  it("should render img element even when no image", () => {
    const { container } = render(<Image />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it("should render image when image is set", () => {
    useStoryImage.getState().setImage("test.png");
    const { container } = render(<Image />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("src")).toBe("test.png");
  });

  it("should apply className", () => {
    useStoryImage.getState().setImage("test.png");
    const { container } = render(<Image className="custom-class" />);
    const div = container.querySelector("div");
    expect(div).toHaveClass("custom-class");
  });
});
