import type { VariablesState } from "inkjs/engine/VariablesState";
import { create } from "zustand";

type StoryVariables = {
  variables: Map<string, unknown>;
  setGlobalVars: (variablesState: VariablesState) => void;
};

const variablesStore = create<StoryVariables>((set) => ({
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
}));

export default variablesStore;
