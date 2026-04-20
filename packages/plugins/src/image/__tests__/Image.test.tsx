import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Image from "../Image";
import { useStoryImage } from "../index";

describe("Image", () => {
  beforeEach(() => {
    cleanup();
    useStoryImage.getState().setImage("");
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render nothing when no image", () => {
    const { container } = render(<Image />);
    const img = container.querySelector("img");
    expect(img).not.toBeInTheDocument();
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

  it("should show fallback on error", async () => {
    useStoryImage.getState().setImage("invalid.png");
    const { container } = render(<Image fallback={<div data-testid="fallback">Fallback</div>} />);

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    if (img) fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });
  });

  it("should render nothing on error without fallback", async () => {
    useStoryImage.getState().setImage("invalid.png");
    const { container } = render(<Image />);

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    if (img) fireEvent.error(img);

    await waitFor(() => {
      expect(container.querySelector("img")).not.toBeInTheDocument();
    });
  });

  it("should log warning on error", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    useStoryImage.getState().setImage("invalid.png");
    const { container } = render(<Image />);

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    if (img) fireEvent.error(img);

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Failed to load image"));
    });
  });

  it("should clear error state on load", async () => {
    useStoryImage.getState().setImage("valid.png");
    const { container } = render(<Image fallback={<div data-testid="fallback">Fallback</div>} />);

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    if (img) fireEvent.load(img);

    await waitFor(() => {
      expect(container.querySelector("img")).toBeInTheDocument();
    });
  });
});
