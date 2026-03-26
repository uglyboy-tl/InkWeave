import { create } from 'zustand';
import createSelectors from '../stores/createSelectors';
import { Patches } from '../core/Patches';
import useContents from '../stores/contentsStore';
import type { InkStoryContext } from '../types';

const options = {
	linedelay: 0.05,
};

type ContentComplete = {
	contentComplete: boolean;
	last_content: string;
	setContentComplete: (contentComplete: boolean) => void;
	setLastContent: (contents: string[]) => void;
};

const useContentComplete = create<ContentComplete>((set) => ({
	contentComplete: true,
	last_content: '',
	setContentComplete: (contentComplete) => set({ contentComplete }),
	setLastContent: (contents) => {
		if (contents.length === 0) {
			set({ last_content: '' });
			return;
		}
		const last_content = contents[contents.length - 1];
		set({ last_content });
	},
}));

const load = () => {
	Patches.add(function (this: InkStoryContext) {
		const originalChoose = this.choose as (index: number) => void;
		const self = this;
		this.choose = function (index: number) {
			if (self.options.linedelay != 0) {
				useContentComplete.getState().setContentComplete(false);
				useContentComplete.getState().setLastContent(self.contents as string[]);
			}
			return originalChoose.call(self, index);
		};
		Object.defineProperty(this, 'visibleLines', {
			get() {
				const last_content = useContentComplete.getState().last_content;
				return (self.contents as string[]).lastIndexOf(last_content);
			},
		});
		Object.defineProperty(this, 'choicesCanShow', {
			get() {
				return createSelectors(useContentComplete).use.contentComplete();
			},
		});

		let timer: ReturnType<typeof setTimeout> | null = null;
		const unsub = useContents.subscribe(() => {
			if (self.options.linedelay == 0) return;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				useContentComplete.getState().setContentComplete(true);
			}, ((self.contents as string[]).length - (self.visibleLines as number)) * (self.options.linedelay as number) * 1000);
		});

		this.cleanups.push(() => {
			unsub();
			if (timer) clearTimeout(timer);
		});
		this.clears.push(() => {
			if (self.options.linedelay != 0)
				useContentComplete.getState().setContentComplete(false);
			useContentComplete.getState().setLastContent([]);
		});
	}, options);
};

export default load;