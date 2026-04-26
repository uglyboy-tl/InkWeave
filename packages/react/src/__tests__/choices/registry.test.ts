import { beforeEach, describe, expect, it } from "bun:test";
import { ChoiceRegistry } from "../../components/choices/ChoiceRegistry";

describe("ChoiceRegistry", () => {
  beforeEach(() => {
    ChoiceRegistry.clear();
  });

  it("should have empty registry initially", () => {
    expect(ChoiceRegistry.get("default")).toBeUndefined();
  });

  it("should register a choice component", () => {
    const MockComponent = () => null;
    ChoiceRegistry.register("custom", MockComponent);
    expect(ChoiceRegistry.get("custom")).toBe(MockComponent);
  });

  it("should check if type exists", () => {
    const MockComponent = () => null;
    expect(ChoiceRegistry.has("test")).toBe(false);
    ChoiceRegistry.register("test", MockComponent);
    expect(ChoiceRegistry.has("test")).toBe(true);
  });

  it("should unregister a choice component", () => {
    const MockComponent = () => null;
    ChoiceRegistry.register("removable", MockComponent);
    expect(ChoiceRegistry.get("removable")).toBe(MockComponent);
    ChoiceRegistry.unregister("removable");
    expect(ChoiceRegistry.get("removable")).toBeUndefined();
  });

  it("should clear all registered components", () => {
    const MockComponent1 = () => null;
    const MockComponent2 = () => null;
    ChoiceRegistry.register("type1", MockComponent1);
    ChoiceRegistry.register("type2", MockComponent2);
    ChoiceRegistry.clear();
    expect(ChoiceRegistry.get("type1")).toBeUndefined();
    expect(ChoiceRegistry.get("type2")).toBeUndefined();
  });

  it("should allow overwriting existing component", () => {
    const MockComponent1 = () => "first";
    const MockComponent2 = () => "second";
    ChoiceRegistry.register("overwrite", MockComponent1);
    ChoiceRegistry.register("overwrite", MockComponent2);
    expect(ChoiceRegistry.get("overwrite")).toBe(MockComponent2);
  });
});
