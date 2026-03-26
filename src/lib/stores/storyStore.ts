import { create } from 'zustand';
import createSelectors from './createSelectors';
import { InkStory } from '../core/InkStory';
import { Story } from 'inkjs/engine/Story';
import type { InkStoryOptions } from "../types";

interface StoryState {
	ink: InkStory | null;
	setStory: (story: Story, title: string, options?: InkStoryOptions) => void;
}

const useStory = create<StoryState>((set, get) => {
	return {
		ink: null,
		setStory: (story, title, options) => {
			get().ink?.dispose();
			set({ ink: new InkStory(story, title, options) });
		},
	};
});

export default createSelectors(useStory);