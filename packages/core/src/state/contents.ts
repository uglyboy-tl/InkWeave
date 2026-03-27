import { create } from 'zustand';
import createSelectors from './createSelectors';

type StoryContent = {
	contents: string[];
	refreshKey: number;
	setContents: (contents: string[]) => void;
	add: (content: string[]) => void;
	clear: () => void;
	refresh: () => void;
};

const contentsStore = create<StoryContent>((set) => ({
	contents: [],
	refreshKey: 0,
	setContents: (contents) => set({ contents }),
	add: (content) => {
		set((state) => ({
			contents: [...state.contents, ...content],
		}));
	},
	clear: () => set({ contents: [] }),
	refresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));

export default createSelectors(contentsStore);