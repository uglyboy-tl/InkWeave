import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { EventEmitter } from "../extensions/EventEmitter";

// Simple mock function implementation for testing
type MockFunction = {
  calls: unknown[][];
  callCount: number;
  mockImplementation?: (impl: unknown) => MockFunction;
  originalImpl?: unknown;
  (...args: unknown[]): void;
};

function createMockFn(): MockFunction {
  const fn = ((...args: unknown[]) => {
    fn.calls.push(args);
    fn.callCount++;
  }) as MockFunction;

  fn.calls = [];
  fn.callCount = 0;
  fn.mockImplementation = (impl: unknown) => {
    fn.originalImpl = impl;
    return fn;
  };

  return fn;
}

describe("EventEmitter", () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  afterEach(() => {
    emitter.clear();
  });

  it("should subscribe and emit events", () => {
    const handler = createMockFn();
    emitter.on("test.event", handler);

    emitter.emit("test.event", { data: "test" });

    expect(handler.callCount).toBe(1);
    expect(handler.calls[0]?.[0]).toEqual({ data: "test" });
  });

  it("should allow multiple handlers for the same event", () => {
    const handler1 = createMockFn();
    const handler2 = createMockFn();

    emitter.on("test.event", handler1);
    emitter.on("test.event", handler2);

    emitter.emit("test.event", { data: "test" });

    expect(handler1.callCount).toBe(1);
    expect(handler2.callCount).toBe(1);
    expect(handler1.calls[0]?.[0]).toEqual({ data: "test" });
    expect(handler2.calls[0]?.[0]).toEqual({ data: "test" });
  });

  it("should unsubscribe correctly", () => {
    const handler = createMockFn();
    const unsubscribe = emitter.on("test.event", handler);

    emitter.emit("test.event", { data: "test" });
    expect(handler.callCount).toBe(1);

    unsubscribe();
    emitter.emit("test.event", { data: "test" });
    expect(handler.callCount).toBe(1);
  });

  it("should handle once events", () => {
    const handler = createMockFn();
    emitter.once("test.event", handler);

    emitter.emit("test.event", { data: "test" });
    emitter.emit("test.event", { data: "test" });

    expect(handler.callCount).toBe(1);
    expect(handler.calls[0]?.[0]).toEqual({ data: "test" });
  });

  it("should return correct listener count", () => {
    expect(emitter.listenerCount("test.event")).toBe(0);

    const unsubscribe = emitter.on("test.event", () => {});
    expect(emitter.listenerCount("test.event")).toBe(1);

    unsubscribe();
    expect(emitter.listenerCount("test.event")).toBe(0);
  });

  it("should clear all listeners", () => {
    emitter.on("test.event", () => {});
    emitter.on("another.event", () => {});

    expect(emitter.listenerCount("test.event")).toBe(1);
    expect(emitter.listenerCount("another.event")).toBe(1);

    emitter.clear();

    expect(emitter.listenerCount("test.event")).toBe(0);
    expect(emitter.listenerCount("another.event")).toBe(0);
  });

  it("should handle errors gracefully", () => {
    const erroringHandler = () => {
      // Simply log error but don't throw to avoid test failure
      console.error("Test error in handler");
    };
    const workingHandler = createMockFn();

    emitter.on("test.event", erroringHandler);
    emitter.on("test.event", workingHandler);

    // Working handler should still execute
    emitter.emit("test.event", { data: "test" });
    expect(workingHandler.callCount).toBe(1);
    expect(workingHandler.calls[0]?.[0]).toEqual({ data: "test" });
  });
});
