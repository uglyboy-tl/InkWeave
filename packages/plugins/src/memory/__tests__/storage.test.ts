import { describe, expect, it } from "bun:test";
import useStorage, { Save } from "../storage";

describe("storage", () => {
  describe("initial state", () => {
    it("should have empty storage", () => {
      const { storage } = useStorage.getState();
      expect(storage).toBeInstanceOf(Map);
      expect(storage.size).toBe(0);
    });
  });

  describe("setStorage", () => {
    it("should save data to storage", () => {
      useStorage.getState().setStorage("test", 0, { state: "test" });
      const { storage } = useStorage.getState();
      expect(storage.has("test")).toBe(true);
      const saves = storage.get("test");
      expect(saves?.[0]).toBeDefined();
      expect(saves?.[0]?.data).toBe('{"state":"test"}');
    });

    it("should create Save object with timestamp", () => {
      useStorage.getState().setStorage("test", 0, { state: "test" });
      const { storage } = useStorage.getState();
      const saves = storage.get("test");
      expect(saves?.[0]?.timestamp).toBeDefined();
    });
  });

  describe("Save", () => {
    it("should create Save with data", () => {
      const save = new Save({ state: "test" });
      expect(save.data).toBe('{"state":"test"}');
      expect(save.timestamp).toBeDefined();
    });
  });
});
