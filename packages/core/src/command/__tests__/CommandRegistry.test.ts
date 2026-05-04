import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { CommandRegistry } from "../CommandRegistry";

describe("CommandRegistry", () => {
  beforeEach(() => {
    CommandRegistry.clear();
  });

  afterEach(() => {
    CommandRegistry.clear();
  });

  it("should register and retrieve commands", () => {
    CommandRegistry.add("test", {
      name: "Test Command",
      description: "This is a test command",
      handler: () => {},
    });

    const command = CommandRegistry.get("test");
    expect(command).toBeDefined();
    if (command) {
      expect(command.name).toBe("Test Command");
      expect(command.description).toBe("This is a test command");
    }

    const allCommands = CommandRegistry.getAll();
    expect(allCommands).toHaveLength(1);
    if (allCommands[0]) {
      expect(allCommands[0].name).toBe("Test Command");
    }
  });

  it("should store translation keys in commands", () => {
    const testHandler = () => {};
    CommandRegistry.add("test-restart", {
      name: "menu_restart",
      description: "menu_restart_aria",
      handler: testHandler,
    });

    const cmd = CommandRegistry.get("test-restart");
    expect(cmd).toBeDefined();
    if (cmd) {
      expect(cmd.name).toBe("menu_restart");
      expect(cmd.description).toBe("menu_restart_aria");
    }
  });
});
