import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S
) => {
	let store = _store as WithSelectors<typeof _store>;
	
	// Use Proxy to create selectors lazily when accessed
	store.use = new Proxy({} as WithSelectors<typeof _store>['use'], {
		get: (_, prop: string) => {
			return () => store((s: any) => s[prop]);
		}
	});

	return store;
};

export default createSelectors;