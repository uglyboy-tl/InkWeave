import type { InkStory } from "../story/InkStory";
import type { Command } from "./types";

const RESTART_ICON =
  "M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z";

export class CommandRegistry {
  private static _commands: Map<string, Command> = new Map();
  private static _translations: Record<string, string> = {
    close: "Close",
    menu_restart: "Restart",
    menu_restart_aria: "Restart game",
  };

  static get commands() {
    return CommandRegistry._commands;
  }

  static add(id: string, command: Omit<Command, "id">) {
    CommandRegistry._commands.set(id, {
      id,
      ...command,
    });
  }

  static get(id: string): Command | undefined {
    return CommandRegistry._commands.get(id);
  }

  static getAll(): Command[] {
    return Array.from(CommandRegistry._commands.values());
  }

  static execute(id: string, ink: InkStory): void | Promise<void> {
    const command = CommandRegistry._commands.get(id);
    if (command) {
      return command.handler(ink);
    }
    console.warn(`Command "${id}" not found`);
  }

  static clear() {
    CommandRegistry._commands.clear();
  }

  static addTranslations(dict: Record<string, string>) {
    Object.assign(CommandRegistry._translations, dict);
  }

  static getTranslation(key: string) {
    return CommandRegistry._translations[key];
  }
}

CommandRegistry.add("restart", {
  name: "menu_restart",
  description: "menu_restart_aria",
  icon: RESTART_ICON,
  priority: 100,
  handler: (ink: InkStory) => {
    ink.restart();
  },
});
