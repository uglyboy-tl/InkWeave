import { beforeEach, describe, expect, it, vi } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { StoryProvider, useStory } from "../components/Story";

const Story = require("../components/Story").default;

describe("Story", () => {
  beforeEach(() => {
    cleanup();
  });

  it("should render StoryProvider with ink story", () => {
    const mockInk = {
      restart: vi.fn(),
      choose: vi.fn(),
      options: {},
    };

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
    const mockInk = {
      restart: vi.fn(),
      choose: vi.fn(),
      options: {},
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
    render(<Story ink={mockInk as any} onInit={onInit} />);

    expect(mockInk.restart).toHaveBeenCalled();
    expect(onInit).toHaveBeenCalledWith(mockInk);
  });

  it("should render children", () => {
    const mockInk = {
      restart: vi.fn(),
      choose: vi.fn(),
      options: {},
    };

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <Story ink={mockInk as any}>
        <div data-testid="custom-child">Custom Content</div>
      </Story>,
    );

    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });

  it("should apply className prop", () => {
    const mockInk = {
      restart: vi.fn(),
      choose: vi.fn(),
      options: {},
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
    render(<Story ink={mockInk as any} className="custom-class" />);

    const storyElement = document.querySelector(".inkweave-story");
    expect(storyElement).toHaveClass("custom-class");
  });
});
