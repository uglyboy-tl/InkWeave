import type { InkStory } from "@inkweave/core";

const RESTART_ICON_PATH =
  "M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z";

export interface Command {
  id: string;
  name: string;
  description?: string;
  title?: string;
  handler: (ink: InkStory) => void | Promise<void>;
  icon?: string;
  getModalContent?: (ink: InkStory, onClose: () => void) => React.ReactNode;
  priority?: number; // 越小越靠前，默认为0
}

export class Commands {
  private static _commands: Map<string, Command> = new Map();

  static get commands() {
    return Commands._commands;
  }

  static add(id: string, command: Omit<Command, "id">) {
    Commands._commands.set(id, {
      id,
      ...command,
    });
  }

  static get(id: string): Command | undefined {
    return Commands._commands.get(id);
  }

  static getAll(): Command[] {
    return Array.from(Commands._commands.values());
  }

  static execute(id: string, ink: InkStory): void | Promise<void> {
    const command = Commands._commands.get(id);
    if (command) {
      return command.handler(ink);
    }
    console.warn(`Command "${id}" not found`);
  }

  static clear() {
    Commands._commands.clear();
  }
}

// Register default commands
Commands.add("restart", {
  name: "Restart",
  description: "Restart game",
  icon: RESTART_ICON_PATH,
  priority: 100, // 较低优先级，显示在后面
  handler: (ink: InkStory) => {
    ink.restart();
  },
});
