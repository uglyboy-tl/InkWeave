import { beforeEach, describe, expect, it, vi } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import Story, { StoryProvider, useStory } from "../components/Story";
import { createMockInk } from "./mock";

describe("Story", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should render StoryProvider with ink story", () => {
    const mockInk = createMockInk();

    const TestComponent = () => {
      const ink = useStory();
      return <div data-testid="story-context">{ink ? "has-story" : "no-story"}</div>;
    };

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <TestComponent />
      </StoryProvider>,
    );

    expect(screen.getByTestId("story-context").textContent).toBe("has-story");
  });

  it("should throw error when useStory is used outside StoryProvider", () => {
    const TestComponent = () => {
      useStory();
      return <div>test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow("useStory must be used within StoryProvider");
  });

  it("should call onInit callback on mount", () => {
    const onInit = vi.fn();
    const mockInk = createMockInk();

    // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
    render(<Story ink={mockInk as any} onInit={onInit} />);

    expect(mockInk.restart).toHaveBeenCalled();
    expect(onInit).toHaveBeenCalledWith(mockInk);
  });

  it("should render children", () => {
    const mockInk = createMockInk();

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <Story ink={mockInk as any}>
        <div data-testid="custom-child">Custom Content</div>
      </Story>,
    );

    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });

  it("should apply className prop", () => {
    const mockInk = createMockInk();

    // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
    render(<Story ink={mockInk as any} className="custom-class" />);

    const storyElement = document.querySelector(".inkweave-story");
    expect(storyElement).toHaveClass("custom-class");
  });

  it("should call onInit when ink prop changes", () => {
    const onInit = vi.fn();
    const mockInk1 = createMockInk();
    const mockInk2 = createMockInk();

    const { rerender } = render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <Story ink={mockInk1 as any} onInit={onInit} />,
    );

    expect(onInit).toHaveBeenCalledTimes(1);
    expect(onInit).toHaveBeenCalledWith(mockInk1);

    rerender(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <Story ink={mockInk2 as any} onInit={onInit} />,
    );

    expect(onInit).toHaveBeenCalledTimes(2);
    expect(onInit).toHaveBeenCalledWith(mockInk2);
    expect(mockInk2.restart).toHaveBeenCalled();
  });

  it("should update onInit callback reference on subsequent renders", () => {
    const onInit1 = vi.fn();
    const onInit2 = vi.fn();
    const mockInk = createMockInk();

    const { rerender } = render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <Story ink={mockInk as any} onInit={onInit1} />,
    );

    expect(onInit1).toHaveBeenCalledTimes(1);

    rerender(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <Story ink={mockInk as any} onInit={onInit2} />,
    );

    expect(onInit2).not.toHaveBeenCalled();
  });
});
