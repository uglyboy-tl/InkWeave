import { create } from "zustand";
import type { ContentItem } from "../types";
import createSelectors from "./createSelectors";

type StoryContent = {
  contents: ContentItem[];
  setContents: (contents: ContentItem[]) => void;
  add: (content: ContentItem[]) => void;
  clear: () => void;
};

const contentsStore = create<StoryContent>((set) => ({
  contents: [],
  setContents: (contents) => set({ contents }),
  add: (content) => {
    set((state) => ({
      contents: [...state.contents, ...content],
    }));
  },
  clear: () => set({ contents: [] }),
}));

export default createSelectors(contentsStore);
