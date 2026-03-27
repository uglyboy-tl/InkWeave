import { create } from 'zustand';
import createSelectors from './createSelectors';

type StoryContent = {
	contents: string[];
	setContents: (contents: string[]) => void;
	add: (content: string[]) => void;
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