import type { Choice, ContentItem } from "@inkweave/core";
import { choicesStore, contentsStore } from "@inkweave/core";

/**
 * Standard zustand → Svelte $state bridge.
 * Automatically handles initial sync + subscription, avoiding manual sync issues.
 */
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

// Global reactive state for choices visibility (used by fade-effect plugin)
// Default to true so choices are visible when fade-effect is not enabled
let _choicesCanShow = $state(true);

export function useChoicesCanShow() {
  return {
    get value() {
      return _choicesCanShow;
    },
    set value(v: boolean) {
      _choicesCanShow = v;
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
