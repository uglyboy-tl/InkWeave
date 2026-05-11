import type { VariablesState } from "inkjs/engine/VariablesState";
import { create } from "zustand";

type StoryVariables = {
  variables: Map<string, unknown>;
  setGlobalVars: (variablesState: VariablesState) => void;
  getPercent: (key: string, max?: number) => number;
};

const variablesStore = create<StoryVariables>((set, get) => ({
  variables: new Map<string, unknown>(),
  setGlobalVars: (variablesState) => {
    const globalVars = new Map<string, unknown>();

    // @ts-expect-error - accessing internal property
    const globalVariables = variablesState._globalVariables;

    if (globalVariables) {
      for (const key of globalVariables.keys()) {
        const entry = globalVariables.get(key);
        if (entry) {
          globalVars.set(key, entry.value);
        }
      }
    }
    set({ variables: globalVars });
  },
  getPercent: (key, max = 10) => {
    const raw = get().variables.get(key);
    const value = typeof raw === "number" ? raw : 0;
    return Math.max(0, Math.min(100, (value / max) * 100));
  },
}));

export default variablesStore;
