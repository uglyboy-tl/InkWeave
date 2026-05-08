import { describe, expect, it } from "bun:test";
import { CHOICE_SEPARATOR } from "../../constants";
import contentsStore from "../contents";

describe("contentsStore", () => {
  describe("initial state", () => {
    it("should have empty contents", () => {
      const { contents } = contentsStore.getState();
      expect(contents).toEqual([]);
    });
  });

  describe("setContents", () => {
    it("should set contents", () => {
      contentsStore.getState().setContents([{ text: "hello" }, { text: "world" }]);
      const { contents } = contentsStore.getState();
      expect(contents).toEqual([{ text: "hello" }, { text: "world" }]);
    });
  });

  describe("add", () => {
    it("should add content without changing visibleLines", () => {
      contentsStore.getState().clear();
      contentsStore.getState().add([{ text: "hello" }]);
      contentsStore.getState().add([{ text: "world" }]);
      const state = contentsStore.getState();
      expect(state.contents).toEqual([{ text: "hello" }, { text: "world" }]);
      expect(state.visibleLines).toBeNull();
    });
  });

  describe("addSeparator", () => {
    it("should set visibleLines to last index before separator", () => {
      contentsStore.getState().clear();
      contentsStore.getState().add([{ text: "a" }, { text: "b" }, { text: "c" }]);
      contentsStore.getState().addSeparator();
      const state = contentsStore.getState();
      expect(state.visibleLines).toBe(2);
      expect(state.contents).toHaveLength(4);
    });

    it("should set visibleLines to -1 when contents is empty", () => {
      contentsStore.getState().clear();
      contentsStore.getState().addSeparator();
      expect(contentsStore.getState().visibleLines).toBe(-1);
    });
  });

  describe("CHOICE_SEPARATOR", () => {
    it("should be defined", () => {
      expect(CHOICE_SEPARATOR).toBeDefined();
      expect(typeof CHOICE_SEPARATOR).toBe("string");
    });
  });
});
