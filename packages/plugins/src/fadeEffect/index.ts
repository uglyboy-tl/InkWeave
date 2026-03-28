import { Patches, contentsStore, Tags, createSelectors, type InkStoryContext } from '@inkweave/core';
import { create } from 'zustand';

const options = {
	// 控制文字显示延迟速度（秒），可通过初始化时传入 linedelay 参数修改
	// 或在 Ink 中使用 #linedelay:0.2 动态调整
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
	Tags.add('linedelay', (val: string | null | undefined, ink) => {
		if (val != null) {
			const value = parseFloat(val);
			if (!isNaN(value)) {
				ink.options.linedelay = value;
			}
		}
	});

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
		const unsub = contentsStore.subscribe(() => {
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
