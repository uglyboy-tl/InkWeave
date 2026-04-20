import { describe, expect, it } from "bun:test";
import { CHOICE_SEPARATOR } from "../../types";
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
    it("should add content", () => {
      contentsStore.getState().setContents([]);
      contentsStore.getState().add([{ text: "hello" }]);
      contentsStore.getState().add([{ text: "world" }]);
      const { contents } = contentsStore.getState();
      expect(contents).toEqual([{ text: "hello" }, { text: "world" }]);
    });
  });

  describe("CHOICE_SEPARATOR", () => {
    it("should be defined", () => {
      expect(CHOICE_SEPARATOR).toBeDefined();
      expect(typeof CHOICE_SEPARATOR).toBe("string");
    });
  });
});
