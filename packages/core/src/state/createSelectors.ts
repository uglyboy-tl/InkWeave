import type { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;

  store.use = new Proxy({} as WithSelectors<typeof _store>["use"], {
    get: (_, prop: string) => {
      return () => store((s) => (s as Record<string, unknown>)[prop]);
    },
  });

  return store;
};

export default createSelectors;
