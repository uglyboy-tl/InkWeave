import { beforeEach, describe, expect, it, vi } from "bun:test";
import {
  cooldownStates,
  getCooldownKey,
  getRemainingSeconds,
  isCooldownActive,
  setCooldown,
} from "../cooldownState";

describe("cooldownState", () => {
  beforeEach(() => {
    cooldownStates.clear();
  });

  describe("getCooldownKey", () => {
    it("should generate key from type, text, and val", () => {
      const key = getCooldownKey({ type: "cd", text: "Attack", val: "5" });
      expect(key).toBe("cd_Attack_5");
    });

    it("should handle empty val", () => {
      const key = getCooldownKey({ type: "cd", text: "Defend" });
      expect(key).toBe("cd_Defend_");
    });
  });

  describe("setCooldown / isCooldownActive / getRemainingSeconds", () => {
    it("should set cooldown and expire correctly", () => {
      const now = 10000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      setCooldown("btn1", 5);

      expect(isCooldownActive("btn1")).toBe(true);
      expect(getRemainingSeconds("btn1")).toBe(5);

      vi.restoreAllMocks();
    });

    it("should return false for unknown key", () => {
      expect(isCooldownActive("nonexistent")).toBe(false);
      expect(getRemainingSeconds("nonexistent")).toBe(0);
    });

    it("should expire when time passes", () => {
      const now = 10000;
      const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);

      setCooldown("btn1", 5);
      expect(isCooldownActive("btn1")).toBe(true);

      // After 5000ms, cooldown should expire
      dateNowSpy.mockReturnValue(now + 5000);
      expect(isCooldownActive("btn1")).toBe(false);
      expect(getRemainingSeconds("btn1")).toBe(0);

      dateNowSpy.mockRestore();
    });

    it("should countdown correctly every second (cd:5)", () => {
      const now = 10000;
      const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);

      setCooldown("btn1", 5);

      // At t=0ms (immediately after set)
      expect(getRemainingSeconds("btn1")).toBe(5);

      // At t=500ms (half second, still ceil to 5)
      dateNowSpy.mockReturnValue(now + 500);
      expect(getRemainingSeconds("btn1")).toBe(5);

      // At t=1000ms (1 second)
      dateNowSpy.mockReturnValue(now + 1000);
      expect(getRemainingSeconds("btn1")).toBe(4);

      // At t=2000ms
      dateNowSpy.mockReturnValue(now + 2000);
      expect(getRemainingSeconds("btn1")).toBe(3);

      // At t=3000ms
      dateNowSpy.mockReturnValue(now + 3000);
      expect(getRemainingSeconds("btn1")).toBe(2);

      // At t=4000ms
      dateNowSpy.mockReturnValue(now + 4000);
      expect(getRemainingSeconds("btn1")).toBe(1);

      // At t=5000ms (expired)
      dateNowSpy.mockReturnValue(now + 5000);
      expect(getRemainingSeconds("btn1")).toBe(0);
      expect(isCooldownActive("btn1")).toBe(false);

      // At t=5001ms (slightly after expiry)
      dateNowSpy.mockReturnValue(now + 5001);
      expect(getRemainingSeconds("btn1")).toBe(0);
      expect(isCooldownActive("btn1")).toBe(false);

      dateNowSpy.mockRestore();
    });

    it("should countdown correctly for cd:1", () => {
      const now = 10000;
      const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);

      setCooldown("btn1", 1);

      // At t=0ms
      expect(getRemainingSeconds("btn1")).toBe(1);

      // At t=500ms
      dateNowSpy.mockReturnValue(now + 500);
      expect(getRemainingSeconds("btn1")).toBe(1);

      // At t=1000ms (expired)
      dateNowSpy.mockReturnValue(now + 1000);
      expect(getRemainingSeconds("btn1")).toBe(0);
      expect(isCooldownActive("btn1")).toBe(false);

      dateNowSpy.mockRestore();
    });

    it("should behave correctly for cd:0", () => {
      const now = 10000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      setCooldown("btn1", 0);

      // Immediately expired
      expect(isCooldownActive("btn1")).toBe(false);
      expect(getRemainingSeconds("btn1")).toBe(0);

      vi.restoreAllMocks();
    });

    it("should handle overlapping cooldowns independently", () => {
      const now = 10000;
      const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);

      setCooldown("btn1", 3);
      expect(getRemainingSeconds("btn1")).toBe(3);

      dateNowSpy.mockReturnValue(now + 1000);

      setCooldown("btn2", 5);
      // btn1 should be at 2, btn2 at 5
      expect(getRemainingSeconds("btn1")).toBe(2);
      expect(getRemainingSeconds("btn2")).toBe(5);
      expect(isCooldownActive("btn1")).toBe(true);
      expect(isCooldownActive("btn2")).toBe(true);

      dateNowSpy.mockReturnValue(now + 5000);
      // btn1 expired, btn2 still active at 1
      expect(isCooldownActive("btn1")).toBe(false);
      expect(getRemainingSeconds("btn1")).toBe(0);
      expect(isCooldownActive("btn2")).toBe(true);
      expect(getRemainingSeconds("btn2")).toBe(1);

      dateNowSpy.mockRestore();
    });
  });
});
