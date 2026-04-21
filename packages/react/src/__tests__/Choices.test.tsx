import { beforeEach, describe, expect, it, vi } from "bun:test";
import { CHOICE_SEPARATOR, Choice, choicesStore, contentsStore } from "@inkweave/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Choices from "../components/Choices";
import { ChoiceRegistry } from "../components/Choices/registry";
import Contents from "../components/Contents";
import { StoryProvider } from "../components/Story";
import { createMockInk } from "./mock";

describe("Choices", () => {
  beforeEach(() => {
    cleanup();
    ChoiceRegistry.clear();
    choicesStore.getState().clear();
  });

  it("should render choices from store", () => {
    const mockInk = createMockInk();

    choicesStore.setState({
      choices: [new Choice("Choice 1", 0), new Choice("Choice 2", 1)],
    });

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    expect(screen.getByText("Choice 1")).toBeInTheDocument();
    expect(screen.getByText("Choice 2")).toBeInTheDocument();
  });

  it("should call ink.choose when a choice is clicked", () => {
    const mockInk = createMockInk();

    choicesStore.setState({
      choices: [new Choice("Click me", 5)],
    });

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    fireEvent.click(screen.getByText("Click me"));

    expect(mockInk.choose).toHaveBeenCalledWith(5);
  });

  it("should not call onClick when choice type is unclickable", () => {
    const mockInk = createMockInk();

    choicesStore.setState({
      choices: [new Choice("Disabled", 2, "unclickable")],
    });

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    fireEvent.click(screen.getByText("Disabled"));

    expect(mockInk.choose).not.toHaveBeenCalled();
  });

  it("should set aria-disabled on unclickable choices", () => {
    const mockInk = createMockInk();

    choicesStore.setState({
      choices: [new Choice("Disabled", 3, "unclickable")],
    });

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    const link = screen.getByText("Disabled");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("should render empty when no choices", () => {
    const mockInk = createMockInk();

    choicesStore.getState().clear();

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("should hide choices when choicesCanShow is false", () => {
    const mockInk = createMockInk({
      choicesCanShow: false,
    });

    choicesStore.setState({
      choices: [new Choice("Hidden", 0)],
    });

    const { container } = render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    const ul = container.querySelector("ul");
    expect(ul).toHaveStyle({ visibility: "hidden" });
  });

  it("should render custom registered component for choice type", () => {
    const mockInk = createMockInk();

    const CustomChoice = vi.fn(({ onClick, className, children }) => (
      <button type="button" data-testid="custom-choice" onClick={onClick} className={className}>
        {children}
      </button>
    ));

    ChoiceRegistry.register("custom", CustomChoice);

    choicesStore.setState({
      choices: [new Choice("Custom Choice", 0, "custom")],
    });

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    expect(screen.getByTestId("custom-choice")).toBeInTheDocument();
    expect(screen.getByText("Custom Choice")).toBeInTheDocument();
  });

  it("should apply classes from choice to the rendered element", () => {
    const mockInk = createMockInk();

    const choiceWithClasses = new Choice("Styled Choice", 0);
    // Add additional classes without replacing the initial inkweave-choice class
    choiceWithClasses.classes.push("primary", "highlighted");

    choicesStore.setState({
      choices: [choiceWithClasses],
    });

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Choices />
      </StoryProvider>,
    );

    const link = screen.getByText("Styled Choice");
    expect(link).toHaveClass("inkweave-choice");
    expect(link).toHaveClass("primary");
    expect(link).toHaveClass("highlighted");
  });
});

describe("Contents", () => {
  beforeEach(() => {
    cleanup();
    contentsStore.getState().clear();
  });

  it("should render content lines from store", () => {
    const mockInk = createMockInk();

    contentsStore.getState().setContents([{ text: "Hello world" }, { text: "Second line" }]);

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Contents />
      </StoryProvider>,
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Second line")).toBeInTheDocument();
  });

  it("should render divider for CHOICE_SEPARATOR", () => {
    const mockInk = createMockInk();

    contentsStore
      .getState()
      .setContents([{ text: "Before" }, { text: CHOICE_SEPARATOR }, { text: "After" }]);

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Contents />
      </StoryProvider>,
    );

    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
    expect(document.querySelector(".inkweave-divider")).toBeInTheDocument();
  });

  it("should render empty when no contents", () => {
    const mockInk = createMockInk();

    contentsStore.getState().clear();

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Contents />
      </StoryProvider>,
    );

    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it("should apply lineDelay from ink.options", () => {
    const mockInk = createMockInk({
      options: { linedelay: 0.1 },
    });

    contentsStore.getState().setContents([{ text: "Line 1" }, { text: "Line 2" }]);

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Contents />
      </StoryProvider>,
    );

    const elements = document.querySelectorAll("[style*='--delay']");
    expect(elements.length).toBe(2);
  });

  it("should use default lineDelay when not specified", () => {
    const mockInk = createMockInk();

    contentsStore.getState().setContents([{ text: "Line 1" }]);

    render(
      // biome-ignore lint/suspicious/noExplicitAny: mock object for testing
      <StoryProvider ink={mockInk as any}>
        <Contents />
      </StoryProvider>,
    );

    const element = document.querySelector("[style*='--delay']");
    expect(element).toHaveAttribute("style", expect.stringContaining("--delay"));
  });
});
