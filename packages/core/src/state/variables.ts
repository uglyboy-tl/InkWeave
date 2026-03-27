import { create } from 'zustand';
import createSelectors from './createSelectors';
import type { VariablesState } from 'inkjs/engine/VariablesState';

type StoryVariables = {
	variables: Map<string, unknown>;
	setGlobalVars: (variablesState: VariablesState) => void;
};

interface GlobalVariableEntry {
	value: unknown;
}

interface GlobalVariablesMap {
	keys(): IterableIterator<string>;
	get(key: string): GlobalVariableEntry | undefined;
}

const variablesStore = create<StoryVariables>((set) => ({
	variables: new Map<string, unknown>(),
	setGlobalVars: (variablesState) => {
		const globalVars = new Map<string, unknown>();

		// Access inkjs internal _globalVariables
		// Note: This relies on inkjs internal implementation.
		// If inkjs updates and breaks this, we'll need to find an alternative.
		const variablesStateAny = variablesState as unknown as {
			_globalVariables?: GlobalVariablesMap;
		};
		const globalVariables = variablesStateAny._globalVariables;
		
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

export default createSelectors(variablesStore);