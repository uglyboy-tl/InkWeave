import { create } from "zustand";
import { CHOICE_SEPARATOR } from "../constants";
import type { ContentItem } from "../types";

type StoryContent = {
  contents: ContentItem[];
  visibleLines: number | null;
  setContents: (contents: ContentItem[]) => void;
  add: (content: ContentItem[]) => void;
  addSeparator: () => void;
  clear: () => void;
};

const contentsStore = create<StoryContent>((set) => ({
  contents: [],
  visibleLines: null,
  setContents: (contents) => set({ contents }),
  add: (content) => {
    set((state) => ({
      contents: [...state.contents, ...content],
    }));
  },
  addSeparator: () => {
    set((state) => ({
      visibleLines: state.contents.length > 0 ? state.contents.length - 1 : -1,
      contents: [...state.contents, { text: CHOICE_SEPARATOR }],
    }));
  },
  clear: () => set({ contents: [], visibleLines: null }),
}));

export default contentsStore;
