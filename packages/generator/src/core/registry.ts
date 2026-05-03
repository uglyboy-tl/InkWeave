import type { GameType } from "./types";

class GameRegistry {
  private types = new Map<string, GameType>();

  register(type: GameType): void {
    if (this.types.has(type.id)) {
      throw new Error(`Game type "${type.id}" is already registered`);
    }
    this.types.set(type.id, type);
  }

  get(id: string): GameType | undefined {
    return this.types.get(id);
  }

  getAll(): GameType[] {
    return Array.from(this.types.values());
  }

  has(id: string): boolean {
    return this.types.has(id);
  }

  getIds(): string[] {
    return Array.from(this.types.keys());
  }
}

export const registry = new GameRegistry();

export function registerGameType(type: GameType): void {
  registry.register(type);
}
