globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
} as Storage;
globalThis.sessionStorage = { ...globalThis.localStorage } as Storage;
globalThis.Audio = class Audio {
  pause = () => {};
  play = () => Promise.resolve();
  addEventListener = () => {};
  removeEventListener = () => {};
} as unknown as typeof Audio;
globalThis.window = {
  HTMLMediaElement: class HTMLMediaElement {
    pause = () => {};
    play = () => Promise.resolve();
    addEventListener = () => {};
    removeEventListener = () => {};
  },
  open: () => null,
} as unknown as Window & typeof globalThis;
globalThis.document = {
  createElement: () => ({
    textContent: '',
    appendChild: () => {},
  }),
  head: {
    appendChild: () => {},
  },
  querySelectorAll: () => [],
} as unknown as Document;
