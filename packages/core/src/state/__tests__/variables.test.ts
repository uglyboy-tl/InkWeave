import { describe, expect, it } from "bun:test";
import type { VariablesState } from "inkjs/engine/VariablesState";
import variablesStore from "../variables";

describe("variablesStore", () => {
  describe("initial state", () => {
    it("should have empty variables map", () => {
      const { variables } = variablesStore.getState();
      expect(variables).toBeInstanceOf(Map);
      expect(variables.size).toBe(0);
    });
  });

  describe("setGlobalVars", () => {
    it("should set global variables", () => {
      const mockVariablesState = {
        _globalVariables: new Map([
          ["var1", { value: "value1" }],
          ["var2", { value: 42 }],
        ]),
      } as unknown as VariablesState;
      variablesStore.getState().setGlobalVars(mockVariablesState);
      const { variables } = variablesStore.getState();
      expect(variables.get("var1")).toBe("value1");
      expect(variables.get("var2")).toBe(42);
    });
  });
});
