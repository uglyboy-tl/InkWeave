import type { Choice, ContentItem } from "@inkweave/core";
import { choicesStore, contentsStore } from "@inkweave/core";

export function syncZustand<T, U>(
  store: { getState: () => T; subscribe: (fn: (s: T) => void) => () => void },
  selector: (s: T) => U,
) {
  let val = $state(selector(store.getState()));
  $effect(() => {
    const unsub = store.subscribe((s) => {
      val = selector(s);
    });
    return unsub;
  });
  return {
    get value() {
      return val;
    },
  };
}

export function useContents(): { readonly contents: ContentItem[] } {
  const store = syncZustand(contentsStore, (s) => s.contents);
  return {
    get contents() {
      return store.value;
    },
  };
}

export function useChoices(): { readonly choices: Choice[] } {
  const store = syncZustand(choicesStore, (s) => s.choices);
  return {
    get choices() {
      return store.value;
    },
  };
}
