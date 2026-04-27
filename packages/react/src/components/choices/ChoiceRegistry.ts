import type { ChoiceComponent } from "../../types";

class ChoiceRegistryClass {
  private _components: Map<string, ChoiceComponent> = new Map();

  get(type: string): ChoiceComponent | undefined {
    return this._components.get(type);
  }

  register(type: string, component: ChoiceComponent) {
    this._components.set(type, component);
  }

  unregister(type: string) {
    this._components.delete(type);
  }

  clear() {
    this._components.clear();
  }

  has(type: string): boolean {
    return this._components.has(type);
  }
}

export const ChoiceRegistry = new ChoiceRegistryClass();
