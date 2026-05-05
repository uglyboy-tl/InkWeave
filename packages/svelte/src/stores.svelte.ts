import type { Choice, ContentItem } from "@inkweave/core";
import { choicesStore, contentsStore } from "@inkweave/core";

/**
 * 标准 zustand → Svelte $state 桥接工具。
 * 自动处理初始同步 + 持续订阅，避免手动同步导致的初始值不一致问题。
 *
 * 使用示例：
 *   const state = syncZustand(someStore, s => s.someField);
 *   // state.value 始终与 zustand 同步，初始值来自 store.getState()
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

// Global reactive state for line delay (used by fade-effect plugin)
let _lineDelay = $state(0.05);

export function useLineDelay() {
  return {
    get value() {
      return _lineDelay;
    },
    set value(v: number) {
      _lineDelay = v;
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
