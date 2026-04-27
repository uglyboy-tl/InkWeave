import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Commands } from "../index";

describe("Commands Basic Functionality", () => {
  beforeEach(() => {
    Commands.clear();
  });

  afterEach(() => {
    Commands.clear();
  });

  it("should register and retrieve commands", () => {
    Commands.add("test", {
      name: "Test Command",
      description: "This is a test command",
      handler: () => {},
    });

    const command = Commands.get("test");
    expect(command).toBeDefined();
    if (command) {
      expect(command.name).toBe("Test Command");
      expect(command.description).toBe("This is a test command");
    }

    const allCommands = Commands.getAll();
    expect(allCommands).toHaveLength(1);
    if (allCommands[0]) {
      expect(allCommands[0].name).toBe("Test Command");
    }
  });

  it("should store translation keys in commands", () => {
    const testHandler = () => {};
    Commands.add("test-restart", {
      name: "menu_restart",
      description: "menu_restart_aria",
      handler: testHandler,
    });

    const cmd = Commands.get("test-restart");
    expect(cmd).toBeDefined();
    if (cmd) {
      expect(cmd.name).toBe("menu_restart");
      expect(cmd.description).toBe("menu_restart_aria");
    }
  });
});
