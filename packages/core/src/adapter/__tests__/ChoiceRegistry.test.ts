import { beforeEach, describe, expect, it } from "bun:test";
import { ChoiceRegistry } from "../ChoiceRegistry";

describe("ChoiceRegistry", () => {
  let registry: ChoiceRegistry<() => string>;

  beforeEach(() => {
    registry = new ChoiceRegistry<() => string>();
  });

  it("should have empty registry initially", () => {
    expect(registry.get("default")).toBeUndefined();
  });

  it("should register a value", () => {
    const fn = () => "hello";
    registry.register("custom", fn);
    expect(registry.get("custom")).toBe(fn);
  });

  it("should check if type exists", () => {
    const fn = () => "hello";
    expect(registry.has("test")).toBe(false);
    registry.register("test", fn);
    expect(registry.has("test")).toBe(true);
  });

  it("should unregister a value", () => {
    const fn = () => "hello";
    registry.register("removable", fn);
    expect(registry.get("removable")).toBe(fn);
    registry.unregister("removable");
    expect(registry.get("removable")).toBeUndefined();
  });

  it("should clear all registered values", () => {
    const fn1 = () => "first";
    const fn2 = () => "second";
    registry.register("type1", fn1);
    registry.register("type2", fn2);
    registry.clear();
    expect(registry.get("type1")).toBeUndefined();
    expect(registry.get("type2")).toBeUndefined();
  });

  it("should allow overwriting existing value", () => {
    const fn1 = () => "first";
    const fn2 = () => "second";
    registry.register("overwrite", fn1);
    registry.register("overwrite", fn2);
    expect(registry.get("overwrite")).toBe(fn2);
  });
});
