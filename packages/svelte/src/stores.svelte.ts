import type { Choice, ContentItem } from "@inkweave/core";
import { choicesStore, contentsStore } from "@inkweave/core";

// Global reactive state for choices visibility (used by fade-effect plugin)
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

export function useChoices(): { readonly choices: Choice[] } {
  let choices = $state<Choice[]>(choicesStore.getState().choices);

  $effect(() => {
    const unsub = choicesStore.subscribe((state) => {
      choices = state.choices;
    });
    return unsub;
  });

  return {
    get choices() {
      return choices;
    },
  };
}

export function useContents(): { readonly contents: ContentItem[] } {
  let contents = $state<ContentItem[]>(contentsStore.getState().contents);

  $effect(() => {
    const unsub = contentsStore.subscribe((state) => {
      contents = state.contents;
    });
    return unsub;
  });

  return {
    get contents() {
      return contents;
    },
  };
}
